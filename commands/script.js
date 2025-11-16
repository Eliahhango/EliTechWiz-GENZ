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

async function scriptCommand(sock, chatId, message) {
    try {
        const text = `╔══「 📜 *BOT SCRIPT INFO* 」══╗\n\n` +
            `🤖 *Bot Name:* ${settings.botName || 'EliTechWiz'}\n` +
            `📦 *Version:* ${settings.version || '4.0.0'}\n` +
            `👤 *Owner:* ${settings.botOwner || 'EliTechWiz'}\n` +
            `🔗 *GitHub:* https://github.com/Eliahhango/EliTechWiz-GENZ\n` +
            `📺 *YouTube:* ${global.ytch || 'https://youtube.com/@eliahhango'}\n\n` +
            `*Powered by EliTechWiz*\n\n` +
            `╚═══════════════════╝`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        const { handleError } = require('../lib/errorHandler');
        await handleError(sock, chatId, message, error, 'processing');
    }
}

module.exports = scriptCommand;

