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

async function capitalizeCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔤 Capitalize Text Command*\n\n*Usage:* .capitalize <text>\n\n*Example:* .capitalize hello world`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ');
        const capitalized = text.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');

        await sock.sendMessage(chatId, {
            text: `╔══「 🔤 *CAPITALIZE TEXT* 」══╗\n\n*Original:* ${text}\n*Capitalized:* ${capitalized}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Capitalize command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error capitalizing text. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = capitalizeCommand;

