#!/usr/bin/env node
const { select } = require('@inquirer/prompts');
const { createVhost, toggleVhosts, editVhost, showVhost, manageModules, controlApache, checkConfig } = require('./lib/apache');
const { setEditor } = require('./lib/config');
const { checkSudo } = require('./lib/utils');

// Check if running with sudo
checkSudo();

async function main() {
    console.log('');
    const choices = [
        { name: 'Exit', value: 'exit' },
        { name: 'Create new Virtual Host', value: 'createVhost' },
        { name: 'Enable/Disable Virtual Host', value: 'toggleVhost' },
        { name: 'Edit Virtual Host', value: 'editVhost' },
        { name: 'Show Virtual Host', value: 'showVhost' },
        { name: 'Manage Modules', value: 'manageModules' },
        { name: 'Restart/Reload/Stop Apache', value: 'controlApache' },
        { name: 'Check Configuration', value: 'checkConfig' },
        { name: 'Configure Text Editor', value: 'setEditor' },
    ];
    const choice = await select({
        message: 'Welcome to Terminal Wizard Apache! What would you like to do?',
        loop: false,
        pageSize: choices.length,
        choices,
    });

    switch (choice) {
        case 'exit': process.exit(0);
        case 'createVhost': await createVhost(); break;
        case 'toggleVhost': await toggleVhosts(); break;
        case 'editVhost': await editVhost(); break;
        case 'showVhost': await showVhost(); break;
        case 'manageModules': await manageModules(); break;
        case 'controlApache': await controlApache(); break;
        case 'checkConfig': await checkConfig(); break;
        case 'setEditor': await setEditor(); break;
    }

    await main(); // Back to menu
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});