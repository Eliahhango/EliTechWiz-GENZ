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

async function rankCommand(sock, chatId, message, senderId, isGroup) {
    try {
        if (!isGroup) {
            return await sock.sendMessage(chatId, {
                text: '❌ This command can only be used in groups!',
                ...channelInfo
            }, { quoted: message });
        }

        const messageCountPath = path.join(__dirname, '../data/messageCount.json');
        let messageData = {};
        
        try {
            if (fs.existsSync(messageCountPath)) {
                messageData = JSON.parse(fs.readFileSync(messageCountPath, 'utf8'));
            }
        } catch (error) {
            console.error('Error reading message count:', error);
        }

        const groupData = messageData[chatId] || {};
        const users = Object.entries(groupData)
            .map(([userId, count]) => ({ userId, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        if (users.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '📊 No message statistics available yet. Start chatting to see rankings!',
                ...channelInfo
            }, { quoted: message });
        }

        let text = `╔══「 📊 *GROUP RANKINGS* 」══╗\n\n`;
        
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const userName = await sock.getName(user.userId).catch(() => user.userId.split('@')[0]);
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
            text += `${medal} *${userName}*\n   📝 ${user.count} messages\n\n`;
        }
        
        text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;
        
        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Rank command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching rankings. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = rankCommand;

