const yts = require('yt-search');
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

async function ytsearchCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔍 YouTube Search Command*\n\n*Usage:* .ytsearch <query>\n\n*Example:* .ytsearch never gonna give you up`,
                ...channelInfo
            }, { quoted: message });
        }

        const query = args.join(' ');
        const searchResults = await yts(query);
        
        if (!searchResults.videos || searchResults.videos.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `❌ No results found for "${query}"`,
                ...channelInfo
            }, { quoted: message });
        }

        let text = `╔══「 🔍 *YOUTUBE SEARCH* 」══╗\n\n`;
        text += `🔎 *Query:* ${query}\n\n`;
        text += `*Top Results:*\n\n`;
        
        const videos = searchResults.videos.slice(0, 10);
        videos.forEach((video, index) => {
            text += `${index + 1}. *${video.title}*\n`;
            text += `   ⏱️ ${video.timestamp || 'N/A'}\n`;
            text += `   👁️ ${video.views || 'N/A'} views\n`;
            text += `   🔗 ${video.url}\n\n`;
        });
        
        text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;
        
        // Send with thumbnail of first result
        if (videos[0] && videos[0].thumbnail) {
            await sock.sendMessage(chatId, {
                image: { url: videos[0].thumbnail },
                caption: text,
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        }
    } catch (error) {
        console.error('YouTube search error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error searching YouTube. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = ytsearchCommand;

