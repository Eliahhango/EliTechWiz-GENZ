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

async function ytcommentCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*💬 YouTube Comment Generator*\n\n*Usage:* .ytcomment <username> | <comment>\n\n*Example:* .ytcomment PewDiePie | Great video!`,
                ...channelInfo
            }, { quoted: message });
        }

        const input = args.join(' ');
        const parts = input.split('|').map(p => p.trim());
        const username = parts[0] || 'User';
        const comment = parts[1] || 'Nice video!';

        try {
            const response = await axios.get(`https://api.popcat.xyz/youtubecomment`, {
                params: {
                    text: comment,
                    username: username
                },
                responseType: 'arraybuffer'
            });

            if (response.data) {
                await sock.sendMessage(chatId, {
                    image: Buffer.from(response.data),
                    caption: `*💬 YouTube Comment by ${username}*\n\n${comment}\n\n_Powered by EliTechWiz_`,
                    ...channelInfo
                }, { quoted: message });
            } else {
                throw new Error('No image received');
            }
        } catch (apiError) {
            // Fallback to text format if API fails
            const text = `╔══「 💬 *YOUTUBE COMMENT* 」══╗\n\n` +
                `👤 *${username}*\n` +
                `💬 *Comment:*\n${comment}\n\n` +
                `👍 0  👎 0  💬 Reply\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        }
    } catch (error) {
        console.error('YTcomment command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating YouTube comment. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = ytcommentCommand;

