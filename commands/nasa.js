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

async function nasaCommand(sock, chatId, message) {
    try {
        const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
        const response = await axios.get(`https://api.nasa.gov/planetary/apod`, {
            params: {
                api_key: apiKey
            }
        });

        if (response.data) {
            const data = response.data;
            const text = `╔══「 🚀 *NASA APOD* 」══╗\n\n` +
                `📅 *Date:* ${data.date}\n` +
                `📝 *Title:* ${data.title}\n` +
                `📖 *Explanation:*\n${data.explanation.substring(0, 500)}${data.explanation.length > 500 ? '...' : ''}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            if (data.media_type === 'image' && data.url) {
                await sock.sendMessage(chatId, {
                    image: { url: data.url },
                    caption: text,
                    ...channelInfo
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
            }
        } else {
            throw new Error('No data received');
        }
    } catch (error) {
        console.error('NASA command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching NASA APOD. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = nasaCommand;

