const yts = require('yt-search');
const ytdl = require('ytdl-core');
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

async function youtubeCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📺 YouTube Command*\n\n*Usage:*\n.youtube search <query> - Search YouTube\n.youtube info <url> - Get video info\n\n*Examples:*\n.youtube search never gonna give you up\n.youtube info https://youtube.com/watch?v=...`,
                ...channelInfo
            }, { quoted: message });
        }

        const action = args[0].toLowerCase();
        
        if (action === 'search') {
            const query = args.slice(1).join(' ');
            if (!query) {
                const { sendError } = require('../lib/errorHandler');
                return await sendError(sock, chatId, message, 'invalidInput', "❓ *Missing Search Query*\n\nI need a search term to find YouTube videos! 🎬\n\n*Usage:* .youtube search <query>\n*Example:* .youtube search never gonna give you up");
            }

            const searchResults = await yts(query);
            if (!searchResults.videos || searchResults.videos.length === 0) {
                const { sendError } = require('../lib/errorHandler');
                return await sendError(sock, chatId, message, 'notFound', `🔍 *No Results Found*\n\nI searched YouTube but couldn't find anything for "${query}". Try different keywords! 🎯\n\n*Tip:* Be more specific or try alternative search terms.`);
            }

            const video = searchResults.videos[0];
            let text = `╔══「 📺 *YOUTUBE SEARCH* 」══╗\n\n`;
            text += `🎬 *Title:* ${video.title}\n`;
            text += `👤 *Channel:* ${video.author.name}\n`;
            text += `⏱️ *Duration:* ${video.timestamp}\n`;
            text += `👁️ *Views:* ${video.views}\n`;
            text += `🔗 *URL:* ${video.url}\n\n`;
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, {
                image: { url: video.thumbnail },
                caption: text,
                ...channelInfo
            }, { quoted: message });
        } else if (action === 'info') {
            const url = args[1];
            if (!url || !ytdl.validateURL(url)) {
                const { sendError } = require('../lib/errorHandler');
                return await sendError(sock, chatId, message, 'invalidInput', "🔗 *Invalid YouTube URL*\n\nThe URL you provided doesn't look like a valid YouTube link! 📺\n\n*Make sure it starts with:* youtube.com or youtu.be");
            }

            const info = await ytdl.getInfo(url);
            const videoDetails = info.videoDetails;
            
            let text = `╔══「 📺 *YOUTUBE VIDEO INFO* 」══╗\n\n`;
            text += `🎬 *Title:* ${videoDetails.title}\n`;
            text += `👤 *Channel:* ${videoDetails.author.name}\n`;
            text += `⏱️ *Duration:* ${videoDetails.lengthSeconds}s\n`;
            text += `👁️ *Views:* ${videoDetails.viewCount}\n`;
            text += `👍 *Likes:* ${videoDetails.likes || 'N/A'}\n`;
            text += `📝 *Description:* ${videoDetails.description.substring(0, 200)}...\n`;
            text += `🔗 *URL:* ${videoDetails.video_url}\n\n`;
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, {
                image: { url: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url },
                caption: text,
                ...channelInfo
            }, { quoted: message });
        } else {
            const { sendError } = require('../lib/errorHandler');
            return await sendError(sock, chatId, message, 'invalidInput', "❓ *Invalid Action*\n\nI don't recognize that action! Use 'search' or 'info'. 🎯\n\n*Usage:*\n• .youtube search <query>\n• .youtube info <url>");
        }
    } catch (error) {
        const { handleError } = require('../lib/errorHandler');
        await handleError(sock, chatId, message, error, 'api');
    }
}

module.exports = youtubeCommand;

