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

async function catCommand(sock, chatId, message) {
    try {
        const response = await axios.get('https://api.thecatapi.com/v1/images/search');
        
        if (response.data && response.data[0]) {
            const catImage = response.data[0].url;
            await sock.sendMessage(chatId, {
                image: { url: catImage },
                caption: `🐱 *Random Cat*\n\n*Powered by EliTechWiz*`,
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Could not fetch cat image. Please try again.',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Cat command error:', error);
        // Fallback to alternative API
        try {
            const fallback = await axios.get('https://cataas.com/cat?json=true');
            if (fallback.data && fallback.data.url) {
                await sock.sendMessage(chatId, {
                    image: { url: `https://cataas.com${fallback.data.url}` },
                    caption: `🐱 *Random Cat*\n\n*Powered by EliTechWiz*`,
                    ...channelInfo
                }, { quoted: message });
            }
        } catch (fallbackError) {
            await sock.sendMessage(chatId, {
                text: '❌ Error fetching cat image. Please try again.',
                ...channelInfo
            }, { quoted: message });
        }
    }
}

module.exports = catCommand;

