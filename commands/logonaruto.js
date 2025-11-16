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

async function logonarutoCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*⛩ Naruto Logo Command*\n\n*Usage:* .logonaruto <text>\n\n*Example:* .logonaruto EliTechWiz`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ');
        
        try {
            const apiUrl = `https://api.maher-zubair.tech/textpro/naruto?text=${encodeURIComponent(text)}`;
            const response = await axios.get(apiUrl);
            
            if (response.data && response.data.result) {
                await sock.sendMessage(chatId, {
                    image: { url: response.data.result },
                    caption: `⛩ *Naruto Logo*\n\n*Text:* ${text}\n\n*Powered by EliTechWiz*`,
                    ...channelInfo
                }, { quoted: message });
            } else {
                throw new Error('No image in response');
            }
        } catch (error) {
            console.error('Naruto logo error:', error);
            await sock.sendMessage(chatId, {
                text: '❌ Error generating Naruto logo. Please try again later.',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Naruto logo command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating logo. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = logonarutoCommand;

