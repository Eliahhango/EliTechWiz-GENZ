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

async function urlCommand(sock, chatId, message) {
    try {
        const text = `╔══「 🔗 *BOT LINKS* 」══╗\n\n` +
            `🔗 *GitHub Repository:*\nhttps://github.com/Eliahhango/EliTechWiz-GENZ\n\n` +
            `📺 *YouTube Channel:*\n${global.ytch || 'https://youtube.com/@eliahhango'}\n\n` +
            `📱 *WhatsApp Channel:*\n${global.channelLink || 'N/A'}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        const { handleError } = require('../lib/errorHandler');
        await handleError(sock, chatId, message, error, 'processing');
    }
}

module.exports = urlCommand;
