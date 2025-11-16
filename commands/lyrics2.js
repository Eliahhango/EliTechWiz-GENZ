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

async function lyrics2Command(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🎵 Lyrics Command*\n\n*Usage:* .lyrics2 <song name>\n\n*Example:* .lyrics2 shape of you`,
                ...channelInfo
            }, { quoted: message });
        }

        const song = args.join(' ');
        const response = await axios.get(`https://api.dreaded.site/api/lyrics`, {
            params: { title: song }
        });

        if (response.data && response.data.success && response.data.result) {
            const data = response.data.result;
            const lyrics = data.lyrics || 'Lyrics not available';
            const title = data.title || song;
            const artist = data.artist || 'Unknown';
            const thumb = data.thumb;

            let text = `╔══「 🎵 *LYRICS* 」══╗\n\n`;
            text += `🎵 *Title:* ${title}\n`;
            text += `🎤 *Artist:* ${artist}\n\n`;
            text += `📝 *Lyrics:*\n${lyrics.substring(0, 2000)}${lyrics.length > 2000 ? '...' : ''}\n\n`;
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            if (thumb) {
                await sock.sendMessage(chatId, {
                    image: { url: thumb },
                    caption: text,
                    ...channelInfo
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
            }
        } else {
            await sock.sendMessage(chatId, {
                text: `❌ Lyrics not found for "${song}"`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Lyrics2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching lyrics. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = lyrics2Command;

