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

async function urlstatusCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔍 URL Status Check Command*\n\n*Usage:* .urlstatus <url>\n\n*Example:* .urlstatus https://github.com/Eliahhango/EliTechWiz-GENZ`,
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

        const startTime = Date.now();
        try {
            const response = await axios.head(url, {
                timeout: 10000,
                maxRedirects: 5
            });
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            const statusCode = response.status;
            const statusText = response.statusText;
            const contentType = response.headers['content-type'] || 'N/A';
            const server = response.headers['server'] || 'N/A';
            const contentLength = response.headers['content-length'] || 'N/A';

            const text = `╔══「 🔍 *URL STATUS* 」══╗\n\n` +
                `🔗 *URL:* ${url}\n` +
                `✅ *Status:* ${statusCode} ${statusText}\n` +
                `⏱️ *Response Time:* ${responseTime}ms\n` +
                `📄 *Content Type:* ${contentType}\n` +
                `🖥️ *Server:* ${server}\n` +
                `📦 *Content Length:* ${contentLength} bytes\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } catch (error) {
            if (error.response) {
                const statusCode = error.response.status;
                const statusText = error.response.statusText;
                const text = `╔══「 🔍 *URL STATUS* 」══╗\n\n` +
                    `🔗 *URL:* ${url}\n` +
                    `❌ *Status:* ${statusCode} ${statusText}\n` +
                    `⚠️ *URL returned an error status*\n\n` +
                    `╚═══════════════════╝\n*Powered by EliTechWiz*`;

                await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
            } else {
                throw error;
            }
        }
    } catch (error) {
        console.error('URLstatus command error:', error);
        await sock.sendMessage(chatId, {
            text: '🔍 *URL Check Failed*\n\nI couldn\'t check the URL status. The link might be unreachable or invalid. 🌐\n\n*Verify the URL and try again.*\n\n*Powered by EliTechWiz*',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = urlstatusCommand;

