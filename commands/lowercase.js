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

async function lowercaseCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔤 Lowercase Text Command*\n\n*Usage:* .lowercase <text>\n\n*Example:* .lowercase HELLO WORLD`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ');
        const lowercased = text.toLowerCase();

        await sock.sendMessage(chatId, {
            text: `╔══「 🔤 *LOWERCASE TEXT* 」══╗\n\n*Original:* ${text}\n*Lowercase:* ${lowercased}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Lowercase command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error converting text. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = lowercaseCommand;

