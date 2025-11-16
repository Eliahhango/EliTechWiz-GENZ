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

async function asciiCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔢 ASCII Converter Command*\n\n*Usage:*\n.ascii encode <text> - Get ASCII codes\n.ascii decode <codes> - Convert ASCII codes to text\n\n*Examples:*\n.ascii encode Hello\n.ascii decode 72 101 108 108 111`,
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
            
            const ascii = text.split('').map(char => char.charCodeAt(0)).join(' ');
            
            await sock.sendMessage(chatId, {
                text: `╔══「 🔢 *ASCII ENCODER* 」══╗\n\n📝 *Text:* ${text}\n✅ *ASCII:* ${ascii}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
                ...channelInfo
            }, { quoted: message });
        } else if (action === 'decode') {
            const codes = args.slice(1);
            if (codes.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Please provide ASCII codes to decode.',
                    ...channelInfo
                }, { quoted: message });
            }
            
            try {
                const text = codes.map(code => 
                    String.fromCharCode(parseInt(code))
                ).join('');
                
                await sock.sendMessage(chatId, {
                    text: `╔══「 🔢 *ASCII DECODER* 」══╗\n\n📝 *ASCII:* ${codes.join(' ')}\n✅ *Text:* ${text}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
                    ...channelInfo
                }, { quoted: message });
            } catch (decodeError) {
                await sock.sendMessage(chatId, {
                    text: '❌ Invalid ASCII codes. Please check and try again.',
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
        console.error('ASCII command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing ASCII. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = asciiCommand;

