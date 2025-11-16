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

async function urlshortCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔗 URL Shortener Command*\n\n*Usage:* .urlshort <url>\n\n*Example:* .urlshort https://github.com/Eliahhango/EliTechWiz-GENZ`,
                ...channelInfo
            }, { quoted: message });
        }

        const url = args[0];
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid URL. URL must start with http:// or https://',
                ...channelInfo
            }, { quoted: message });
        }

        try {
            const response = await axios.get(`https://tinyurl.com/api-create.php`, {
                params: { url: url }
            });

            if (response.data && !response.data.includes('Error')) {
                const shortUrl = response.data.trim();
                const text = `╔══「 🔗 *URL SHORTENER* 」══╗\n\n` +
                    `🔗 *Original:* ${url}\n` +
                    `✅ *Short URL:* ${shortUrl}\n\n` +
                    `╚═══════════════════╝\n*Powered by EliTechWiz*`;

                await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
            } else {
                throw new Error('Shortening failed');
            }
        } catch (apiError) {
            await sock.sendMessage(chatId, {
                text: '❌ Error shortening URL. Please try again.',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('URLshort command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing URL. Please check the URL and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = urlshortCommand;

