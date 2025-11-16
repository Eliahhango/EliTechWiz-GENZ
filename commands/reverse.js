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

async function reverseCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔄 Reverse Text Command*\n\n*Usage:* .reverse <text>\n\n*Example:* .reverse Hello World`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ');
        const reversed = text.split('').reverse().join('');

        await sock.sendMessage(chatId, {
            text: `╔══「 🔄 *REVERSE TEXT* 」══╗\n\n` +
                `📝 *Original:* ${text}\n` +
                `🔄 *Reversed:* ${reversed}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Reverse command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error reversing text. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = reverseCommand;

