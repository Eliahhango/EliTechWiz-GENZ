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

async function nekoCommand(sock, chatId, message) {
    try {
        const response = await axios.get('https://nekos.life/api/v2/img/neko');
        
        if (response.data && response.data.url) {
            await sock.sendMessage(chatId, {
                image: { url: response.data.url },
                caption: `*🐱 Random Neko*\n\n_Powered by EliTechWiz_`,
                ...channelInfo
            }, { quoted: message });
        } else {
            throw new Error('No image received');
        }
    } catch (error) {
        console.error('Neko command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching neko image. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = nekoCommand;

