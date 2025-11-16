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

async function movieCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🎬 Movie Info Command*\n\nPlease provide a movie name.\n\n*Example:* .movie The Matrix`,
                ...channelInfo
            }, { quoted: message });
        }

        const movieTitle = args.join(' ');
        const apiKey = process.env.OMDB_API_KEY || '742b2d09'; // Free tier key
        
        const response = await axios.get(
            `http://www.omdbapi.com/?apikey=${apiKey}&t=${encodeURIComponent(movieTitle)}&plot=full`
        );

        if (response.data.Response !== 'True') {
            return await sock.sendMessage(chatId, {
                text: `❌ Movie not found: "${movieTitle}"\n\nPlease check the spelling and try again.`,
                ...channelInfo
            }, { quoted: message });
        }

        const data = response.data;
        let info = `╔══「 🎬 *MOVIE INFORMATION* 」══╗\n\n`;
        info += `🎭 *Title:* ${data.Title}\n`;
        info += `📅 *Year:* ${data.Year}\n`;
        info += `⭐ *IMDb Rating:* ${data.imdbRating || 'N/A'}\n`;
        info += `🎭 *Genre:* ${data.Genre || 'N/A'}\n`;
        info += `⏱️ *Runtime:* ${data.Runtime || 'N/A'}\n`;
        info += `🎬 *Director:* ${data.Director || 'N/A'}\n`;
        info += `👥 *Actors:* ${data.Actors || 'N/A'}\n`;
        info += `🌍 *Language:* ${data.Language || 'N/A'}\n`;
        info += `🏆 *Awards:* ${data.Awards || 'N/A'}\n`;
        info += `📝 *Plot:*\n${data.Plot || 'N/A'}\n\n`;
        info += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        if (data.Poster && data.Poster !== 'N/A') {
            await sock.sendMessage(chatId, {
                image: { url: data.Poster },
                caption: info,
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: info, ...channelInfo }, { quoted: message });
        }
    } catch (error) {
        console.error('Movie command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching movie information. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = movieCommand;

