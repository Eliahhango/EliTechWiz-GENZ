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

async function uppercaseCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔤 Uppercase Text Command*\n\n*Usage:* .uppercase <text>\n\n*Example:* .uppercase hello world`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ');
        const uppercased = text.toUpperCase();

        await sock.sendMessage(chatId, {
            text: `╔══「 🔤 *UPPERCASE TEXT* 」══╗\n\n*Original:* ${text}\n*Uppercase:* ${uppercased}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Uppercase command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error converting text. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = uppercaseCommand;

