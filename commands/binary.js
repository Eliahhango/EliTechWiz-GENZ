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

async function binaryCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔢 Binary Converter Command*\n\n*Usage:*\n.binary encode <text> - Convert text to binary\n.binary decode <binary> - Convert binary to text\n\n*Examples:*\n.binary encode Hello\n.binary decode 01001000 01100101 01101100 01101100 01101111`,
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
            
            const binary = text.split('').map(char => 
                char.charCodeAt(0).toString(2).padStart(8, '0')
            ).join(' ');
            
            await sock.sendMessage(chatId, {
                text: `╔══「 🔢 *BINARY ENCODER* 」══╗\n\n📝 *Text:* ${text}\n✅ *Binary:* ${binary}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
                ...channelInfo
            }, { quoted: message });
        } else if (action === 'decode') {
            const binary = args.slice(1).join(' ');
            if (!binary) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Please provide binary to decode.',
                    ...channelInfo
                }, { quoted: message });
            }
            
            try {
                const text = binary.split(' ').map(bin => 
                    String.fromCharCode(parseInt(bin, 2))
                ).join('');
                
                await sock.sendMessage(chatId, {
                    text: `╔══「 🔢 *BINARY DECODER* 」══╗\n\n📝 *Binary:* ${binary}\n✅ *Text:* ${text}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
                    ...channelInfo
                }, { quoted: message });
            } catch (decodeError) {
                await sock.sendMessage(chatId, {
                    text: '❌ Invalid binary format. Please check and try again.',
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
        console.error('Binary command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing binary. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = binaryCommand;

