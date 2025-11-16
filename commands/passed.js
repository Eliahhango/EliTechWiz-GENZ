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

async function passedCommand(sock, chatId, message) {
    try {
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        const imageUrl = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage?.url;
        
        if (!imageUrl && !message.message?.imageMessage?.url) {
            return await sock.sendMessage(chatId, {
                text: `*💀 Passed Away Filter*\n\n*Usage:* .passed (reply to image)\n\n*Example:* Reply to an image with .passed`,
                ...channelInfo
            }, { quoted: message });
        }

        const imgUrl = imageUrl || message.message?.imageMessage?.url;
        
        try {
            const response = await axios.get(`https://api.popcat.xyz/passed`, {
                params: { image: imgUrl },
                responseType: 'arraybuffer'
            });

            if (response.data) {
                await sock.sendMessage(chatId, {
                    image: Buffer.from(response.data),
                    caption: `*💀 Passed Away Filter*\n\n_Powered by EliTechWiz_`,
                    mentions: mentioned,
                    ...channelInfo
                }, { quoted: message });
            } else {
                throw new Error('No image received');
            }
        } catch (apiError) {
            await sock.sendMessage(chatId, {
                text: '❌ Error applying passed filter. Please try again with a different image.',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Passed command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing passed filter. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = passedCommand;

