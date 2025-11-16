const fs = require('fs');
const path = require('path');
const settings = require('../settings');

const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363222395675670@newsletter',
            newsletterName: 'EliTechWiz-GENZ',
            serverMessageId: -1
        }
    }
};

const autoreactFile = path.join(__dirname, '../data/autoreact.json');

function loadAutoreactState() {
    try {
        if (fs.existsSync(autoreactFile)) {
            return JSON.parse(fs.readFileSync(autoreactFile, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading autoreact state:', error);
    }
    return { enabled: false };
}

function saveAutoreactState(state) {
    try {
        const dir = path.dirname(autoreactFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(autoreactFile, JSON.stringify(state, null, 2));
    } catch (error) {
        console.error('Error saving autoreact state:', error);
    }
}

async function autoreactCommand(sock, chatId, message, args) {
    try {
        const state = loadAutoreactState();
        
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🤖 Auto React Command*\n\n*Status:* ${state.enabled ? '✅ Enabled' : '❌ Disabled'}\n\n*Usage:*\n.autoreact on - Enable auto reactions\n.autoreact off - Disable auto reactions`,
                ...channelInfo
            }, { quoted: message });
        }

        const action = args[0].toLowerCase();

        if (action === 'on' || action === 'enable') {
            state.enabled = true;
            saveAutoreactState(state);
            await sock.sendMessage(chatId, {
                text: '✅ *Auto React Enabled*\n\nThe bot will now automatically react to messages with random emojis.',
                ...channelInfo
            }, { quoted: message });
        } else if (action === 'off' || action === 'disable') {
            state.enabled = false;
            saveAutoreactState(state);
            await sock.sendMessage(chatId, {
                text: '❌ *Auto React Disabled*',
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Invalid option. Use: on/off',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Autoreact command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error managing auto react. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

function isAutoreactEnabled() {
    const state = loadAutoreactState();
    return state.enabled;
}

module.exports = { autoreactCommand, isAutoreactEnabled };

