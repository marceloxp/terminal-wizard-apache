# Terminal Wizard Apache

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

`terminal-wizard-apache` is a simple, interactive command-line tool to manage Apache2 configurations. With a user-friendly menu, it helps you create virtual hosts, toggle modules, and control your Apache server—all from the terminal.

---

## Features

- Create virtual hosts with custom domains and document roots.
- Enable or disable virtual hosts with a single selection.
- Edit or view virtual host files in your preferred editor.
- Toggle Apache modules (e.g., `rewrite`, `ssl`).
- Reload, restart, or stop the Apache server.
- Check configuration syntax and list virtual hosts.
- Set your preferred text editor.

---

## Prerequisites

- Apache2 installed on a Debian/Ubuntu-based system.
- Sudo privileges to manage Apache configurations.

---

## Installation

Install globally with npm:
```bash
npm install -g terminal-wizard-apache
```

> **Note**: Requires Node.js and npm. If you don’t have them, download and install from [nodejs.org/en/download](https://nodejs.org/en/download) for your operating system.

---

## Usage

Run the tool:
```bash
sudo terminal-wizard-apache
```

> **Important**: Use `sudo` to allow changes to Apache files and services. Without it, you'll see a reminder to rerun with `sudo`.

### Menu Options
- **Create new Virtual Host**: Set up a new site.
- **Enable/Disable Virtual Host**: Toggle sites on/off (enabled sites marked with `*`).
- **Edit Virtual Host**: Edit a site’s config file.
- **Show Virtual Host**: View a site’s config.
- **Manage Modules**: Turn modules on/off (enabled ones marked with `*`).
- **Restart/Reload/Stop Apache**: Control the server.
- **Check Configuration**: Verify syntax and list sites.
- **Configure Text Editor**: Pick your editor (saved for future use).
- **Exit**: Close the tool.

---

## Examples

### Creating a Virtual Host
1. Choose "Create new Virtual Host".
2. Enter a domain (e.g., `mysite.com`).
3. Add an alias if needed (e.g., `www.mysite.com`).
4. Set the document root (e.g., `/var/www/mysite`).
5. The tool creates and enables it automatically.

### Toggling a Virtual Host
1. Select "Enable/Disable Virtual Host".
2. Pick a site (e.g., `* mysite.com` for enabled, `  othersite.com` for disabled).
3. Confirm to toggle its status.

---

## Configuration

Your text editor preference (e.g., `nano`, `vim`) is saved to `~/.terminal-wizard-apache.json` the first time you edit a file or via "Configure Text Editor".

---

## Troubleshooting

- **Command not found?** Ensure it’s installed globally (`npm link` if testing locally).
- **Permission errors?** Always run with `sudo`.

---

## Contributing

Found a bug or have an idea? Open an issue or submit a pull request at [GitHub](https://github.com/marceloxp/terminal-wizard-apache).

---

## License

MIT License. Free to use and modify. See [LICENSE](LICENSE) for details.

---

## Author

- **Marcelo XP** - [GitHub](https://github.com/marceloxp)
