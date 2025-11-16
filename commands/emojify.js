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

const emojiMap = {
    'a': '🇦', 'b': '🇧', 'c': '🇨', 'd': '🇩', 'e': '🇪', 'f': '🇫',
    'g': '🇬', 'h': '🇭', 'i': '🇮', 'j': '🇯', 'k': '🇰', 'l': '🇱',
    'm': '🇲', 'n': '🇳', 'o': '🇴', 'p': '🇵', 'q': '🇶', 'r': '🇷',
    's': '🇸', 't': '🇹', 'u': '🇺', 'v': '🇻', 'w': '🇼', 'x': '🇽',
    'y': '🇾', 'z': '🇿', '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣',
    '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
    ' ': '  '
};

async function emojifyCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*😀 Emojify Text Command*\n\n*Usage:* .emojify <text>\n\n*Example:* .emojify hello world`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ').toLowerCase();
        const emojified = text.split('').map(char => emojiMap[char] || char).join('');

        await sock.sendMessage(chatId, {
            text: `╔══「 😀 *EMOJIFY TEXT* 」══╗\n\n*Original:* ${args.join(' ')}\n*Emojified:* ${emojified}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Emojify command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error emojifying text. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = emojifyCommand;

