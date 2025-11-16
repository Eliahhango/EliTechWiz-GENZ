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

async function igscCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📷 Instagram Story Downloader*\n\n*Usage:* .igsc <instagram_story_url>\n\n*Example:* .igsc https://www.instagram.com/stories/username/123456789/`,
                ...channelInfo
            }, { quoted: message });
        }

        const url = args[0];
        
        await sock.sendMessage(chatId, {
            text: `📷 *Instagram Story Downloader*\n\n*URL:* ${url}\n\n*Note:* Instagram story downloading requires special API access. For now, please use .igs for regular Instagram posts/stories.\n\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('IGSC command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing Instagram story. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = igscCommand;

