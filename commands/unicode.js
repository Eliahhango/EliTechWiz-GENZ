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

function textToUnicode(text) {
    return text.split('').map(char => {
        const code = char.charCodeAt(0);
        return `U+${code.toString(16).toUpperCase().padStart(4, '0')}`;
    }).join(' ');
}

function unicodeToText(unicodeCodes) {
    return unicodeCodes.split(/\s+/).map(code => {
        const hex = code.replace(/U\+/i, '');
        return String.fromCharCode(parseInt(hex, 16));
    }).join('');
}

async function unicodeCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔤 Unicode Converter Command*\n\n*Usage:*\n.unicode <text> - Convert text to Unicode\n.unicode decode <U+0041 U+0042> - Convert Unicode to text\n\n*Examples:*\n.unicode Hello\n.unicode decode U+0048 U+0065 U+006C U+006C U+006F`,
                ...channelInfo
            }, { quoted: message });
        }

        if (args[0].toLowerCase() === 'decode') {
            const unicodeCodes = args.slice(1).join(' ');
            const decoded = unicodeToText(unicodeCodes);
            
            await sock.sendMessage(chatId, {
                text: `╔══「 🔤 *UNICODE DECODER* 」══╗\n\n` +
                    `📝 *Unicode:* ${unicodeCodes}\n` +
                    `✅ *Decoded:* ${decoded}\n\n` +
                    `╚═══════════════════╝\n*Powered by EliTechWiz*`,
                ...channelInfo
            }, { quoted: message });
        } else {
            const text = args.join(' ');
            const unicode = textToUnicode(text);
            
            await sock.sendMessage(chatId, {
                text: `╔══「 🔤 *UNICODE ENCODER* 」══╗\n\n` +
                    `📝 *Text:* ${text}\n` +
                    `✅ *Unicode:* ${unicode}\n\n` +
                    `╚═══════════════════╝\n*Powered by EliTechWiz*`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Unicode command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing Unicode. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = unicodeCommand;

