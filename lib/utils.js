const { execSync } = require('child_process');

function checkSudo() {
    if (process.getuid() !== 0) {
        console.error('This command requires administrator privileges.');
        console.error('Please run: sudo terminal-wizard-apache');
        process.exit(1);
    }
}

function runCommand(command) {
    try {
        return execSync(command, { stdio: 'inherit' });
    } catch (err) {
        throw new Error(`Failed to execute command: ${command}`);
    }
}

module.exports = { checkSudo, runCommand };