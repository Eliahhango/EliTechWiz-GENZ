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

async function downloadCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📥 Download Command*\n\n*Usage:* .download <url>\n\n*Supported:*\n• YouTube videos\n• Instagram posts\n• TikTok videos\n• Facebook videos\n\n*Example:* .download https://www.youtube.com/watch?v=...`,
                ...channelInfo
            }, { quoted: message });
        }

        const url = args[0];
        
        // Check URL type and route to appropriate downloader
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return await sock.sendMessage(chatId, {
                text: '📥 *YouTube Download*\n\nUse .youtube or .ytmp4 for YouTube videos.\n\n*Powered by EliTechWiz*',
                ...channelInfo
            }, { quoted: message });
        } else if (url.includes('instagram.com')) {
            return await sock.sendMessage(chatId, {
                text: '📥 *Instagram Download*\n\nUse .igs or .instagram for Instagram posts.\n\n*Powered by EliTechWiz*',
                ...channelInfo
            }, { quoted: message });
        } else if (url.includes('tiktok.com')) {
            return await sock.sendMessage(chatId, {
                text: '📥 *TikTok Download*\n\nUse .tiktok for TikTok videos.\n\n*Powered by EliTechWiz*',
                ...channelInfo
            }, { quoted: message });
        } else if (url.includes('facebook.com')) {
            return await sock.sendMessage(chatId, {
                text: '📥 *Facebook Download*\n\nUse .facebook for Facebook videos.\n\n*Powered by EliTechWiz*',
                ...channelInfo
            }, { quoted: message });
        } else {
            return await sock.sendMessage(chatId, {
                text: '❌ Unsupported URL. Please use specific download commands for each platform.',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Download command error:', error);
        await sock.sendMessage(chatId, {
            text: '📥 *Download Failed*\n\nThe download couldn\'t complete. This might be due to network issues or the source being unavailable. 🌐\n\n*Check your connection and try again.*\n\n*Powered by EliTechWiz*',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = downloadCommand;

