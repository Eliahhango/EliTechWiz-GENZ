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

const autostatusviewFile = path.join(__dirname, '../data/autostatusview.json');

function loadAutostatusviewState() {
    try {
        if (fs.existsSync(autostatusviewFile)) {
            return JSON.parse(fs.readFileSync(autostatusviewFile, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading autostatusview state:', error);
    }
    return { enabled: false };
}

function saveAutostatusviewState(state) {
    try {
        const dir = path.dirname(autostatusviewFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(autostatusviewFile, JSON.stringify(state, null, 2));
    } catch (error) {
        console.error('Error saving autostatusview state:', error);
    }
}

async function autostatusviewCommand(sock, chatId, message, args) {
    try {
        const state = loadAutostatusviewState();
        
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*👁️ Auto Status View Command*\n\n*Status:* ${state.enabled ? '✅ Enabled' : '❌ Disabled'}\n\n*Usage:*\n.autostatusview on - Enable auto status viewing\n.autostatusview off - Disable auto status viewing`,
                ...channelInfo
            }, { quoted: message });
        }

        const action = args[0].toLowerCase();

        if (action === 'on' || action === 'enable') {
            state.enabled = true;
            saveAutostatusviewState(state);
            await sock.sendMessage(chatId, {
                text: '✅ *Auto Status View Enabled*\n\nThe bot will now automatically view status updates.',
                ...channelInfo
            }, { quoted: message });
        } else if (action === 'off' || action === 'disable') {
            state.enabled = false;
            saveAutostatusviewState(state);
            await sock.sendMessage(chatId, {
                text: '❌ *Auto Status View Disabled*',
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Invalid option. Use: on/off',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Autostatusview command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error managing auto status view. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

function isAutostatusviewEnabled() {
    const state = loadAutostatusviewState();
    return state.enabled;
}

module.exports = { autostatusviewCommand, isAutostatusviewEnabled };

