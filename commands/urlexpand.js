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

async function urlexpandCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔗 URL Expander Command*\n\n*Usage:* .urlexpand <short_url>\n\n*Example:* .urlexpand https://tinyurl.com/abc123`,
                ...channelInfo
            }, { quoted: message });
        }

        const shortUrl = args[0];
        
        try {
            const response = await axios.head(shortUrl, {
                maxRedirects: 0,
                validateStatus: (status) => status >= 200 && status < 400
            });

            const expandedUrl = response.headers.location || shortUrl;
            const statusCode = response.status;

            const text = `╔══「 🔗 *URL EXPANDER* 」══╗\n\n` +
                `🔗 *Short URL:* ${shortUrl}\n` +
                `✅ *Expanded URL:* ${expandedUrl}\n` +
                `📊 *Status Code:* ${statusCode}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } catch (error) {
            if (error.response && error.response.status >= 300 && error.response.status < 400) {
                const expandedUrl = error.response.headers.location || shortUrl;
                const text = `╔══「 🔗 *URL EXPANDER* 」══╗\n\n` +
                    `🔗 *Short URL:* ${shortUrl}\n` +
                    `✅ *Expanded URL:* ${expandedUrl}\n\n` +
                    `╚═══════════════════╝\n*Powered by EliTechWiz*`;

                await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('URLexpand command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error expanding URL. Please check the URL and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = urlexpandCommand;

