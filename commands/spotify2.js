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

async function spotify2Command(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🎵 Spotify Search Command*\n\n*Usage:* .spotify2 <song name>\n\n*Example:* .spotify2 shape of you`,
                ...channelInfo
            }, { quoted: message });
        }

        const query = args.join(' ');
        const response = await axios.get(`https://api.spotify.com/v1/search`, {
            params: {
                q: query,
                type: 'track',
                limit: 5
            },
            headers: {
                'Authorization': `Bearer ${process.env.SPOTIFY_TOKEN || ''}`
            }
        }).catch(async () => {
            await sock.sendMessage(chatId, {
                text: `🎵 *Spotify Search: ${query}*\n\n*Note:* Spotify API requires authentication. Please use .song or .lyrics2 for music search.`,
                ...channelInfo
            }, { quoted: message });
        });

        if (response && response.data && response.data.tracks && response.data.tracks.items) {
            const tracks = response.data.tracks.items;
            let text = `╔══「 🎵 *SPOTIFY SEARCH* 」══╗\n\n`;
            text += `🔍 *Query:* ${query}\n\n`;
            tracks.forEach((track, index) => {
                text += `${index + 1}. *${track.name}*\n`;
                text += `   👤 ${track.artists.map(a => a.name).join(', ')}\n`;
                text += `   🔗 ${track.external_urls.spotify}\n\n`;
            });
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        }
    } catch (error) {
        console.error('Spotify2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error searching Spotify. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = spotify2Command;

