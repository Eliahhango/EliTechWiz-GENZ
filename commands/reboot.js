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

async function rebootCommand(sock, chatId, message, senderId) {
    try {
        const isOwner = require('./lib/isOwner');
        const senderIsOwner = await isOwner(senderId);
        
        if (!senderIsOwner) {
            return await sock.sendMessage(chatId, {
                text: '❌ Only bot owner can use this command!',
                ...channelInfo
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            text: '🔄 *Rebooting bot...*\n\nPlease wait a few seconds.',
            ...channelInfo
        }, { quoted: message });

        // Exit process to trigger restart (if using PM2 or similar)
        setTimeout(() => {
            process.exit(0);
        }, 2000);
    } catch (error) {
        console.error('Reboot command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error rebooting bot. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = rebootCommand;

