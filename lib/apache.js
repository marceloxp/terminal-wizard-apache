const fs = require('fs');
const path = require('path');
const { input, select, confirm } = require('@inquirer/prompts');
const { runCommand } = require('./utils');
const { getEditor } = require('./config');

const sitesAvailable = '/etc/apache2/sites-available';

async function createVhost() {
    const domain = await input({ message: 'What is the domain? (e.g., example.com)' });
    const alias = await input({ message: 'Add an alias? (e.g., www.example.com)', default: '' });
    const docRoot = await input({ message: 'What is the DocumentRoot?', default: process.cwd() });

    if (!fs.existsSync(docRoot)) {
        const createDir = await confirm({ message: `The directory ${docRoot} does not exist. Create it now?` });
        if (createDir) {
            fs.mkdirSync(docRoot, { recursive: true });
            const setPerms = await confirm({ message: 'Set permissions for www-data?' });
            if (setPerms) runCommand(`chown -R www-data:www-data ${docRoot}`);
        }
    }

    const vhostContent = `
<VirtualHost *:80>
    ServerName ${domain}
    ${alias ? `ServerAlias ${alias}` : ''}
    DocumentRoot ${docRoot}
    ErrorLog \${APACHE_LOG_DIR}/${domain}-error.log
    CustomLog \${APACHE_LOG_DIR}/${domain}-access.log combined
</VirtualHost>`.trim();

    const filePath = path.join(sitesAvailable, `${domain}.conf`);
    fs.writeFileSync(filePath, vhostContent);

    runCommand(`a2ensite ${domain}.conf`);
    runCommand('systemctl reload apache2');
    console.log(`Virtual Host ${domain} created and enabled!`);
}

async function toggleVhosts() {
    const vhosts = fs.readdirSync(sitesAvailable).filter(f => f.endsWith('.conf'));
    if (!vhosts.length) {
        console.log('No Virtual Hosts found in sites-available.');
        return;
    }

    const enabled = fs.readdirSync('/etc/apache2/sites-enabled').map(f => f.replace('.conf', ''));

    const choices = [
        { name: 'Back', value: 'back' },
        ...vhosts.map(vhost => {
            const name = vhost.replace('.conf', '');
            const isEnabled = enabled.includes(name);
            return {
                name: `${isEnabled ? '*' : ' '} ${name}`,
                value: name,
            };
        }),
    ];

    const selected = await select({
        message: 'Select a Virtual Host to toggle its status:',
        choices,
    });

    if (selected === 'back') {
        return;
    }

    const isCurrentlyEnabled = enabled.includes(selected);
    const action = isCurrentlyEnabled ? 'disable' : 'enable';
    const confirmAction = await confirm({
        message: `Are you sure you want to ${action} the Virtual Host "${selected}"?`,
    });

    if (!confirmAction) {
        console.log('Action canceled.');
        return;
    }

    if (isCurrentlyEnabled) {
        runCommand(`a2dissite ${selected}`);
        console.log(`Virtual Host "${selected}" disabled!`);
    } else {
        runCommand(`a2ensite ${selected}`);
        console.log(`Virtual Host "${selected}" enabled!`);
    }

    runCommand('systemctl reload apache2');
}

async function editVhost() {
    const vhosts = fs.readdirSync(sitesAvailable).filter(f => f.endsWith('.conf'));
    if (!vhosts.length) {
        console.log('No Virtual Hosts found.');
        return;
    }

    const choices = [
        { name: 'Back', value: 'back' },
        ...vhosts.map(v => ({ name: v, value: v })),
    ];

    const vhost = await select({
        message: 'Which Virtual Host do you want to edit?',
        choices,
    });

    if (vhost === 'back') {
        return;
    }

    const editor = await getEditor();
    runCommand(`${editor} ${path.join(sitesAvailable, vhost)}`);
}

async function showVhost() {
    const vhosts = fs.readdirSync(sitesAvailable).filter(f => f.endsWith('.conf'));
    if (!vhosts.length) {
        console.log('No Virtual Hosts found.');
        return;
    }

    const choices = [
        ...vhosts.map(v => ({ name: v, value: v })),
        { name: 'Back', value: 'back' },
    ];

    const vhost = await select({
        message: 'Which Virtual Host do you want to view?',
        choices,
    });

    if (vhost === 'back') {
        return;
    }

    const content = fs.readFileSync(path.join(sitesAvailable, vhost), 'utf8');
    console.log('\nVirtual Host Content:\n');
    console.log(content);
}

async function manageModules() {
    const modules = ['rewrite', 'ssl', 'headers']; // Example, can be expanded
    const enabled = fs.readdirSync('/etc/apache2/mods-enabled').map(m => m.replace(/\..*$/, ''));

    const choices = [
        { name: 'Back', value: 'back' },
        ...modules.map(mod => ({
            name: `${enabled.includes(mod) ? '*' : ' '} ${mod}`,
            value: mod,
        })),
    ];

    const selected = await select({
        message: 'Select a module to toggle its status:',
        choices,
    });

    if (selected === 'back') {
        return;
    }

    if (enabled.includes(selected)) {
        runCommand(`a2dismod ${selected}`);
        console.log(`Module ${selected} disabled!`);
    } else {
        runCommand(`a2enmod ${selected}`);
        console.log(`Module ${selected} enabled!`);
    }

    runCommand('systemctl reload apache2');
}

async function controlApache() {
    const action = await select({
        message: 'What do you want to do with Apache?',
        choices: [
            { name: 'Reload', value: 'reload' },
            { name: 'Restart', value: 'restart' },
            { name: 'Stop', value: 'stop' },
        ],
    });

    runCommand(`systemctl ${action} apache2`);
    console.log(`Apache ${action}ed successfully!`);
}

async function checkConfig() {
    console.log('Checking configuration syntax...');
    runCommand('apache2ctl -t');
    console.log('');
    console.log('Listing available Virtual Hosts...');
    const vhosts = fs.readdirSync(sitesAvailable).filter(f => f.endsWith('.conf'));
    console.log(vhosts.length ? vhosts.join('\n') : 'No Virtual Hosts found.');
    console.log('');
}

module.exports = { createVhost, toggleVhosts, editVhost, showVhost, manageModules, controlApache, checkConfig };