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

async function tweetCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🐦 Tweet Generator*\n\n*Usage:* .tweet <username> | <tweet_text>\n\n*Example:* .tweet @elonmusk | Hello Twitter!`,
                ...channelInfo
            }, { quoted: message });
        }

        const input = args.join(' ');
        const parts = input.split('|').map(p => p.trim());
        const username = parts[0] || 'user';
        const tweetText = parts[1] || 'No tweet text provided';

        try {
            const response = await axios.get(`https://api.popcat.xyz/tweet`, {
                params: {
                    text: tweetText,
                    username: username.replace('@', '')
                },
                responseType: 'arraybuffer'
            });

            if (response.data) {
                await sock.sendMessage(chatId, {
                    image: Buffer.from(response.data),
                    caption: `*🐦 Tweet by ${username}*\n\n${tweetText}\n\n_Powered by EliTechWiz_`,
                    ...channelInfo
                }, { quoted: message });
            } else {
                throw new Error('No image received');
            }
        } catch (apiError) {
            // Fallback to text format if API fails
            const text = `╔══「 🐦 *TWEET* 」══╗\n\n` +
                `👤 *@${username.replace('@', '')}*\n` +
                `📝 *Tweet:*\n${tweetText}\n\n` +
                `💙 0  🔄 0  ❤️ 0\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        }
    } catch (error) {
        console.error('Tweet command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating tweet. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = tweetCommand;

