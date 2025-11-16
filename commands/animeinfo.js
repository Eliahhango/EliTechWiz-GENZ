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

function getStarRating(score) {
    if (!score || isNaN(score)) return '⭐ N/A';
    const numStars = Math.floor(parseFloat(score) / 2);
    return '⭐'.repeat(numStars) + ' ' + score;
}

async function animeinfoCommand(sock, chatId, message, args) {
    try {
        await sock.sendMessage(chatId, {
            text: '🔎 *Searching for a random anime...*',
            ...channelInfo
        }, { quoted: message });

        const jsonURL = 'https://api.jikan.moe/v4/random/anime';
        const response = await axios.get(jsonURL);
        const data = response.data.data;

        const title = data.title;
        const titleJapanese = data.title_japanese || 'N/A';
        const synopsis = data.synopsis || 'No synopsis available.';
        const imageUrl = data.images?.jpg?.large_image_url || data.images?.jpg?.image_url;
        const episodes = data.episodes || 'Unknown';
        const status = data.status || 'Unknown';
        const score = data.score || 'N/A';
        const rating = data.rating || 'N/A';
        const year = data.year || 'Unknown';
        const genres = data.genres ? data.genres.map(genre => genre.name).join(', ') : 'Unknown';

        const stars = getStarRating(score);

        let messageText = `╔══「 📺 *ANIME INFO* 」══╗\n\n`;
        messageText += `🎬 *${title}*\n`;
        messageText += `🇯🇵 *Japanese:* ${titleJapanese}\n\n`;
        messageText += `${stars}/10\n\n`;
        messageText += `🎯 *Status:* ${status}\n`;
        messageText += `🔢 *Episodes:* ${episodes}\n`;
        messageText += `📅 *Year:* ${year}\n`;
        messageText += `🔞 *Rating:* ${rating}\n`;
        messageText += `🎭 *Genres:* ${genres}\n\n`;
        messageText += `📝 *Synopsis:*\n${synopsis.substring(0, 500)}${synopsis.length > 500 ? '...' : ''}\n\n`;
        messageText += `🔗 *MyAnimeList:* ${data.url}\n\n`;
        messageText += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        if (imageUrl) {
            await sock.sendMessage(chatId, {
                image: { url: imageUrl },
                caption: messageText,
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: messageText, ...channelInfo }, { quoted: message });
        }
    } catch (error) {
        console.error('Anime info command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error retrieving anime data. The API might be down. Please try again later.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = animeinfoCommand;

