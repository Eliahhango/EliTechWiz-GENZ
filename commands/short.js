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

async function shortCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔗 URL Shortener Command*\n\n*Usage:* .short <url>\n\n*Example:* .short https://example.com/very/long/url`,
                ...channelInfo
            }, { quoted: message });
        }

        const longUrl = args[0];
        if (!longUrl.startsWith('http://') && !longUrl.startsWith('https://')) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide a valid URL starting with http:// or https://',
                ...channelInfo
            }, { quoted: message });
        }

        // Try multiple URL shortener services
        let shortUrl = null;
        
        // Try tinyurl first
        try {
            const response = await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
            if (response.data && response.data.startsWith('http')) {
                shortUrl = response.data.trim();
            }
        } catch (e) {
            // Try is.gd
            try {
                const response = await axios.get(`https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`);
                if (response.data && response.data.shorturl) {
                    shortUrl = response.data.shorturl;
                }
            } catch (e2) {
                // Try v.gd
                try {
                    const response = await axios.get(`https://v.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`);
                    if (response.data && response.data.shorturl) {
                        shortUrl = response.data.shorturl;
                    }
                } catch (e3) {
                    throw new Error('All URL shorteners failed');
                }
            }
        }

        if (shortUrl) {
            await sock.sendMessage(chatId, {
                text: `╔══「 🔗 *URL SHORTENER* 」══╗\n\n✅ *Shortened URL:*\n${shortUrl}\n\n📎 *Original:*\n${longUrl}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
                ...channelInfo
            }, { quoted: message });
        } else {
            throw new Error('Failed to shorten URL');
        }
    } catch (error) {
        console.error('Short command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error shortening URL. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = shortCommand;

