const fs = require('fs');
const path = require('path');

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

const afkFilePath = path.join(__dirname, '../data/afk.json');

function readAfkData() {
    try {
        if (fs.existsSync(afkFilePath)) {
            return JSON.parse(fs.readFileSync(afkFilePath, 'utf8'));
        }
    } catch (error) {
        console.error('Error reading AFK data:', error);
    }
    return {};
}

function writeAfkData(data) {
    try {
        fs.writeFileSync(afkFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing AFK data:', error);
    }
}

async function afkCommand(sock, chatId, message, args, senderId) {
    try {
        const afkData = readAfkData();
        const reason = args.join(' ') || 'No reason provided';
        const timestamp = Date.now();

        afkData[senderId] = {
            reason: reason,
            timestamp: timestamp
        };

        writeAfkData(afkData);

        await sock.sendMessage(chatId, {
            text: `╔══「 ⏸️ *AFK MODE* 」══╗\n\n✅ You are now AFK\n📝 *Reason:* ${reason}\n\nYou will be notified when someone mentions you.\n\n╚═══════════════════╝`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('AFK command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error setting AFK status.',
            ...channelInfo
        }, { quoted: message });
    }
}

function isUserAfk(userId) {
    const afkData = readAfkData();
    return afkData[userId] || null;
}

function removeAfk(userId) {
    const afkData = readAfkData();
    if (afkData[userId]) {
        delete afkData[userId];
        writeAfkData(afkData);
        return true;
    }
    return false;
}

module.exports = { afkCommand, isUserAfk, removeAfk };

