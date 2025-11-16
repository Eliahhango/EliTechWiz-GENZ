/**
 * Initialize Data Files
 * Creates necessary data files and directories for the bot
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Default data structures
const defaultData = {
    autoreact: { enabled: false },
    autoblue: { enabled: false },
    autostatusview: { enabled: false },
    autostatuslike: { enabled: false },
    reminders: {},
    todos: {},
    notes: {},
    afk: {}
};

// Initialize data files
function initDataFiles() {
    const files = [
        { name: 'autoreact.json', default: defaultData.autoreact },
        { name: 'autoblue.json', default: defaultData.autoblue },
        { name: 'autostatusview.json', default: defaultData.autostatusview },
        { name: 'autostatuslike.json', default: defaultData.autostatuslike },
        { name: 'reminders.json', default: defaultData.reminders },
        { name: 'todos.json', default: defaultData.todos },
        { name: 'notes.json', default: defaultData.notes },
        { name: 'afk.json', default: defaultData.afk },
        { name: 'blocklist.json', default: { users: [] } },
        { name: 'channelMembers.json', default: { members: {}, lastReminder: {} } },
        { name: 'commandStats.json', default: { totalCommands: 0, commands: {}, dailyStats: {}, topCommands: [] } }
    ];

    files.forEach(file => {
        const filePath = path.join(dataDir, file.name);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(file.default, null, 2));
            console.log(`✅ Initialized ${file.name}`);
        }
    });
}

// Run initialization
initDataFiles();

module.exports = { initDataFiles };

