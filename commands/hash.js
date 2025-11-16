const crypto = require('crypto');
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

async function hashCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length < 2) {
            return await sock.sendMessage(chatId, {
                text: `*🔐 Hash Generator Command*\n\n*Usage:* .hash <algorithm> <text>\n\n*Supported algorithms:*\n• md5\n• sha1\n• sha256\n• sha512\n\n*Examples:*\n.hash md5 Hello World\n.hash sha256 MySecret`,
                ...channelInfo
            }, { quoted: message });
        }

        const algorithm = args[0].toLowerCase();
        const text = args.slice(1).join(' ');

        const supportedAlgorithms = ['md5', 'sha1', 'sha256', 'sha512'];
        
        if (!supportedAlgorithms.includes(algorithm)) {
            return await sock.sendMessage(chatId, {
                text: `❌ Unsupported algorithm. Supported: ${supportedAlgorithms.join(', ')}`,
                ...channelInfo
            }, { quoted: message });
        }

        const hash = crypto.createHash(algorithm).update(text).digest('hex');

        await sock.sendMessage(chatId, {
            text: `╔══「 🔐 *HASH GENERATOR* 」══╗\n\n` +
                `📝 *Text:* ${text}\n` +
                `🔧 *Algorithm:* ${algorithm.toUpperCase()}\n` +
                `✅ *Hash:* ${hash}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Hash command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating hash. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = hashCommand;

