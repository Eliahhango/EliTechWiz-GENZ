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

async function ytinfoCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📺 YouTube Info Command*\n\n*Usage:* .ytinfo <youtube_url>\n\n*Example:* .ytinfo https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
                ...channelInfo
            }, { quoted: message });
        }

        const url = args[0];
        
        if (!ytdl.validateURL(url)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid YouTube URL. Please provide a valid YouTube video URL.',
                ...channelInfo
            }, { quoted: message });
        }

        const info = await ytdl.getInfo(url);
        const videoDetails = info.videoDetails;

        const duration = parseInt(videoDetails.lengthSeconds);
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        const formattedDuration = hours > 0 
            ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
            : `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const text = `╔══「 📺 *YOUTUBE INFO* 」══╗\n\n` +
            `📺 *Title:* ${videoDetails.title}\n` +
            `👤 *Channel:* ${videoDetails.author.name}\n` +
            `👁️ *Views:* ${parseInt(videoDetails.viewCount).toLocaleString()}\n` +
            `👍 *Likes:* ${videoDetails.likes || 'N/A'}\n` +
            `⏱️ *Duration:* ${formattedDuration}\n` +
            `📅 *Upload Date:* ${videoDetails.publishDate || 'N/A'}\n` +
            `📝 *Description:*\n${videoDetails.description?.substring(0, 200) || 'N/A'}${videoDetails.description?.length > 200 ? '...' : ''}\n\n` +
            `🔗 *URL:* ${url}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, {
            image: { url: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url },
            caption: text,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('YTinfo command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching YouTube info. Please check the URL and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = ytinfoCommand;

