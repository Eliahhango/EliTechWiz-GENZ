const axios = require('axios');
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

async function pastebinCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📋 Pastebin Command*\n\n*Usage:* .pastebin <text>\n\n*Example:* .pastebin Hello World\n\nOr reply to a message with .pastebin`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ');
        const response = await axios.post('https://pastebin.com/api/api_post.php', null, {
            params: {
                api_dev_key: process.env.PASTEBIN_API_KEY || 'your_key',
                api_option: 'paste',
                api_paste_code: text,
                api_paste_name: 'EliTechWiz Paste',
                api_paste_format: 'text'
            }
        });

        if (response.data && response.data.startsWith('http')) {
            await sock.sendMessage(chatId, {
                text: `╔══「 📋 *PASTEBIN* 」══╗\n\n✅ *Paste created successfully!*\n\n🔗 *URL:* ${response.data}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
                ...channelInfo
            }, { quoted: message });
        } else {
            // Fallback to alternative paste service
            const fallback = await axios.post('https://hastebin.com/documents', text);
            if (fallback.data && fallback.data.key) {
                await sock.sendMessage(chatId, {
                    text: `╔══「 📋 *PASTEBIN* 」══╗\n\n✅ *Paste created successfully!*\n\n🔗 *URL:* https://hastebin.com/${fallback.data.key}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
                    ...channelInfo
                }, { quoted: message });
            } else {
                throw new Error('Failed to create paste');
            }
        }
    } catch (error) {
        console.error('Pastebin command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error creating paste. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = pastebinCommand;

