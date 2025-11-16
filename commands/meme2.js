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

async function meme2Command(sock, chatId, message) {
    try {
        const response = await axios.get('https://meme-api.com/gimme');
        
        if (response.data && response.data.url) {
            await sock.sendMessage(chatId, {
                image: { url: response.data.url },
                caption: `*${response.data.title}*\n\n_Powered by EliTechWiz_`,
                ...channelInfo
            }, { quoted: message });
        } else {
            throw new Error('No meme received');
        }
    } catch (error) {
        console.error('Meme2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching meme. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = meme2Command;

