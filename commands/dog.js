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

async function dogCommand(sock, chatId, message) {
    try {
        const response = await axios.get('https://dog.ceo/api/breeds/image/random');
        
        if (response.data && response.data.status === 'success') {
            await sock.sendMessage(chatId, {
                image: { url: response.data.message },
                caption: `🐕 *Random Dog*\n\n*Powered by EliTechWiz*`,
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Could not fetch dog image. Please try again.',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Dog command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching dog image. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = dogCommand;

