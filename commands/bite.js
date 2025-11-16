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

async function biteCommand(sock, chatId, message, args) {
    try {
        const response = await axios.get('https://api.waifu.pics/sfw/bite');
        
        if (response.data && response.data.url) {
            const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            const mentionText = mentioned.length > 0 ? `@${mentioned[0].split('@')[0]}` : '';
            
            await sock.sendMessage(chatId, {
                image: { url: response.data.url },
                caption: `*😋 Bite*\n\n${mentionText ? `Biting ${mentionText}! 😋` : '😋 Bite!'}\n\n_Powered by EliTechWiz_`,
                mentions: mentioned,
                ...channelInfo
            }, { quoted: message });
        } else {
            throw new Error('No image received');
        }
    } catch (error) {
        console.error('Bite command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching bite image. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = biteCommand;

