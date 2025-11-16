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

const autoblueFile = path.join(__dirname, '../data/autoblue.json');

function loadAutoblueState() {
    try {
        if (fs.existsSync(autoblueFile)) {
            return JSON.parse(fs.readFileSync(autoblueFile, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading autoblue state:', error);
    }
    return { enabled: false };
}

function saveAutoblueState(state) {
    try {
        const dir = path.dirname(autoblueFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(autoblueFile, JSON.stringify(state, null, 2));
    } catch (error) {
        console.error('Error saving autoblue state:', error);
    }
}

async function autoblueCommand(sock, chatId, message, args) {
    try {
        const state = loadAutoblueState();
        
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*✓ Auto Blue Tick Command*\n\n*Status:* ${state.enabled ? '✅ Enabled' : '❌ Disabled'}\n\n*Usage:*\n.autoblue on - Enable auto blue tick (read receipts)\n.autoblue off - Disable auto blue tick`,
                ...channelInfo
            }, { quoted: message });
        }

        const action = args[0].toLowerCase();

        if (action === 'on' || action === 'enable') {
            state.enabled = true;
            saveAutoblueState(state);
            await sock.sendMessage(chatId, {
                text: '✅ *Auto Blue Tick Enabled*\n\nThe bot will now automatically mark messages as read.',
                ...channelInfo
            }, { quoted: message });
        } else if (action === 'off' || action === 'disable') {
            state.enabled = false;
            saveAutoblueState(state);
            await sock.sendMessage(chatId, {
                text: '❌ *Auto Blue Tick Disabled*',
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Invalid option. Use: on/off',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Autoblue command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error managing auto blue tick. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

function isAutoblueEnabled() {
    const state = loadAutoblueState();
    return state.enabled;
}

module.exports = { autoblueCommand, isAutoblueEnabled };

