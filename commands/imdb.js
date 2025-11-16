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

async function imdbCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🎬 IMDB Search Command*\n\n*Usage:* .imdb <movie/tv name>\n\n*Example:* .imdb Inception`,
                ...channelInfo
            }, { quoted: message });
        }

        const query = args.join(' ');
        
        await sock.sendMessage(chatId, {
            text: '🔍 *Searching IMDB database...*',
            ...channelInfo
        }, { quoted: message });

        const apiKey = process.env.OMDB_API_KEY || '742b2d09';
        const response = await axios.get(`http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(query)}&plot=full`);

        if (response.data.Response === 'False') {
            return await sock.sendMessage(chatId, {
                text: `❌ *Not Found:* "${query}" could not be found in the IMDB database.`,
                ...channelInfo
            }, { quoted: message });
        }

        const data = response.data;
        const rating = data.imdbRating || 'N/A';
        const stars = '⭐'.repeat(Math.floor(parseFloat(rating) || 0));

        let text = `╔══「 🎬 *IMDB MOVIE INFO* 」══╗\n\n`;
        text += `🎬 *Title:* ${data.Title}\n`;
        text += `📅 *Year:* ${data.Year}\n`;
        text += `🎭 *Genre:* ${data.Genre || 'N/A'}\n`;
        text += `⏱️ *Runtime:* ${data.Runtime || 'N/A'}\n`;
        text += `🎯 *Rating:* ${rating}/10 ${stars}\n`;
        text += `🎪 *Director:* ${data.Director || 'N/A'}\n`;
        text += `👥 *Actors:* ${data.Actors || 'N/A'}\n`;
        text += `🏆 *Awards:* ${data.Awards || 'N/A'}\n`;
        text += `📝 *Plot:* ${data.Plot || 'N/A'}\n`;
        text += `🌐 *IMDB ID:* ${data.imdbID || 'N/A'}\n`;
        text += `🔗 *IMDB Link:* https://www.imdb.com/title/${data.imdbID}\n\n`;
        text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        if (data.Poster && data.Poster !== 'N/A') {
            await sock.sendMessage(chatId, {
                image: { url: data.Poster },
                caption: text,
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        }
    } catch (error) {
        console.error('IMDB command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching IMDB data. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = imdbCommand;

