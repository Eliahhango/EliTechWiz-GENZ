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

async function comradeCommand(sock, chatId, message) {
    try {
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        if (mentioned.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*☭ Comrade Filter*\n\n*Usage:* .comrade @user\n\n*Example:* Reply to an image with .comrade @user`,
                ...channelInfo
            }, { quoted: message });
        }

        const imageUrl = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.url;
        
        if (!imageUrl && !message.message?.imageMessage?.url) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please reply to an image or send an image with the command.',
                ...channelInfo
            }, { quoted: message });
        }

        const imgUrl = imageUrl || message.message?.imageMessage?.url;
        
        try {
            const response = await axios.get(`https://api.popcat.xyz/comrade`, {
                params: { image: imgUrl },
                responseType: 'arraybuffer'
            });

            if (response.data) {
                await sock.sendMessage(chatId, {
                    image: Buffer.from(response.data),
                    caption: `*☭ Comrade Filter*\n\n_Powered by EliTechWiz_`,
                    mentions: mentioned,
                    ...channelInfo
                }, { quoted: message });
            } else {
                throw new Error('No image received');
            }
        } catch (apiError) {
            await sock.sendMessage(chatId, {
                text: '❌ Error applying comrade filter. Please try again with a different image.',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Comrade command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing comrade filter. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = comradeCommand;

