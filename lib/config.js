const fs = require('fs');
const path = require('path');
const { select } = require('@inquirer/prompts');

const configPath = path.join(process.env.HOME, '.terminal-wizard-apache.json');

function loadConfig() {
    if (fs.existsSync(configPath)) {
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    return {};
}

function saveConfig(config) {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

async function getEditor() {
    const config = loadConfig();
    if (!config.editor) {
        const editor = await selectEditor();
        config.editor = editor;
        saveConfig(config);
    }
    return config.editor;
}

async function selectEditor() {
    const editors = ['nano', 'vim', 'code', 'sublime'].filter(e => {
        try {
            execSync(`which ${e}`, { stdio: 'ignore' });
            return true;
        } catch {
            return false;
        }
    });

    if (!editors.length) return 'nano'; // Default if none found

    return await select({
        message: 'Which text editor do you prefer?',
        choices: editors.map(e => ({ name: e, value: e })),
    });
}

async function setEditor() {
    const editor = await selectEditor();
    saveConfig({ editor });
    console.log(`Text editor set to ${editor}`);
}

module.exports = { getEditor, selectEditor, setEditor };