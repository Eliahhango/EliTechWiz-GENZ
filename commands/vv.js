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

async function vvCommand(sock, chatId, message) {
    try {
        const text = `╔══「 📊 *BOT VERSION* 」══╗\n\n` +
            `🤖 *Bot Name:* ${settings.botName || 'EliTechWiz'}\n` +
            `📦 *Version:* ${settings.version || '4.0.0'}\n` +
            `👤 *Owner:* ${settings.botOwner || 'EliTechWiz'}\n` +
            `🌐 *Mode:* ${settings.commandMode || 'Public'}\n` +
            `📝 *Description:* ${settings.description || 'Advanced WhatsApp Bot'}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('VV command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching version info. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = vvCommand;

