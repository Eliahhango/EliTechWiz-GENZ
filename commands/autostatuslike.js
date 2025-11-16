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

const autostatuslikeFile = path.join(__dirname, '../data/autostatuslike.json');

function loadAutostatuslikeState() {
    try {
        if (fs.existsSync(autostatuslikeFile)) {
            return JSON.parse(fs.readFileSync(autostatuslikeFile, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading autostatuslike state:', error);
    }
    return { enabled: false };
}

function saveAutostatuslikeState(state) {
    try {
        const dir = path.dirname(autostatuslikeFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(autostatuslikeFile, JSON.stringify(state, null, 2));
    } catch (error) {
        console.error('Error saving autostatuslike state:', error);
    }
}

async function autostatuslikeCommand(sock, chatId, message, args) {
    try {
        const state = loadAutostatuslikeState();
        
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*❤️ Auto Status Like Command*\n\n*Status:* ${state.enabled ? '✅ Enabled' : '❌ Disabled'}\n\n*Usage:*\n.autostatuslike on - Enable auto status liking\n.autostatuslike off - Disable auto status liking`,
                ...channelInfo
            }, { quoted: message });
        }

        const action = args[0].toLowerCase();

        if (action === 'on' || action === 'enable') {
            state.enabled = true;
            saveAutostatuslikeState(state);
            await sock.sendMessage(chatId, {
                text: '✅ *Auto Status Like Enabled*\n\nThe bot will now automatically like status updates.',
                ...channelInfo
            }, { quoted: message });
        } else if (action === 'off' || action === 'disable') {
            state.enabled = false;
            saveAutostatuslikeState(state);
            await sock.sendMessage(chatId, {
                text: '❌ *Auto Status Like Disabled*',
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Invalid option. Use: on/off',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Autostatuslike command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error managing auto status like. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

function isAutostatuslikeEnabled() {
    const state = loadAutostatuslikeState();
    return state.enabled;
}

module.exports = { autostatuslikeCommand, isAutostatuslikeEnabled };

