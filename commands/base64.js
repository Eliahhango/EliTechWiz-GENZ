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

async function base64Command(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔐 Base64 Encoder/Decoder Command*\n\n*Usage:*\n.base64 encode <text> - Encode to Base64\n.base64 decode <base64> - Decode from Base64\n\n*Examples:*\n.base64 encode Hello World\n.base64 decode SGVsbG8gV29ybGQ=`,
                ...channelInfo
            }, { quoted: message });
        }

        const action = args[0].toLowerCase();
        
        if (action === 'encode') {
            const text = args.slice(1).join(' ');
            if (!text) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Please provide text to encode.',
                    ...channelInfo
                }, { quoted: message });
            }
            
            const encoded = Buffer.from(text).toString('base64');
            await sock.sendMessage(chatId, {
                text: `╔══「 🔐 *BASE64 ENCODER* 」══╗\n\n📝 *Text:* ${text}\n✅ *Encoded:* ${encoded}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
                ...channelInfo
            }, { quoted: message });
        } else if (action === 'decode') {
            const base64 = args.slice(1).join(' ');
            if (!base64) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Please provide Base64 string to decode.',
                    ...channelInfo
                }, { quoted: message });
            }
            
            try {
                const decoded = Buffer.from(base64, 'base64').toString('utf-8');
                await sock.sendMessage(chatId, {
                    text: `╔══「 🔐 *BASE64 DECODER* 」══╗\n\n📝 *Base64:* ${base64}\n✅ *Decoded:* ${decoded}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
                    ...channelInfo
                }, { quoted: message });
            } catch (decodeError) {
                await sock.sendMessage(chatId, {
                    text: '❌ Invalid Base64 string. Please check and try again.',
                    ...channelInfo
                }, { quoted: message });
            }
        } else {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid action. Use "encode" or "decode".',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Base64 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing Base64. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = base64Command;

