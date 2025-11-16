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

async function hexCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔢 Hex Converter Command*\n\n*Usage:*\n.hex encode <text> - Convert text to hex\n.hex decode <hex> - Convert hex to text\n\n*Examples:*\n.hex encode Hello\n.hex decode 48656c6c6f`,
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
            
            const hex = text.split('').map(char => 
                char.charCodeAt(0).toString(16).padStart(2, '0')
            ).join(' ');
            
            await sock.sendMessage(chatId, {
                text: `╔══「 🔢 *HEX ENCODER* 」══╗\n\n📝 *Text:* ${text}\n✅ *Hex:* ${hex}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
                ...channelInfo
            }, { quoted: message });
        } else if (action === 'decode') {
            const hex = args.slice(1).join(' ').replace(/\s/g, '');
            if (!hex) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Please provide hex to decode.',
                    ...channelInfo
                }, { quoted: message });
            }
            
            try {
                const text = hex.match(/.{1,2}/g).map(h => 
                    String.fromCharCode(parseInt(h, 16))
                ).join('');
                
                await sock.sendMessage(chatId, {
                    text: `╔══「 🔢 *HEX DECODER* 」══╗\n\n📝 *Hex:* ${hex}\n✅ *Text:* ${text}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
                    ...channelInfo
                }, { quoted: message });
            } catch (decodeError) {
                await sock.sendMessage(chatId, {
                    text: '❌ Invalid hex format. Please check and try again.',
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
        console.error('Hex command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing hex. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = hexCommand;

