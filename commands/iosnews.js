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

async function iosnewsCommand(sock, chatId, message) {
    try {
        await sock.sendMessage(chatId, {
            text: '🍎 *Fetching iOS news...*',
            ...channelInfo
        }, { quoted: message });

        const apiUrl = 'https://api.maher-zubair.tech/details/ios';
        const response = await axios.get(apiUrl);

        if (!response.data || response.data.status !== 200 || !response.data.result) {
            return await sock.sendMessage(chatId, {
                text: '❌ Failed to fetch iOS news.',
                ...channelInfo
            }, { quoted: message });
        }

        const { title, link, images, desc } = response.data.result;

        let output = `╔══「 🍎 *iOS NEWS* 」══╗\n\n`;
        output += `*${title}*\n\n`;
        output += `${desc}\n\n`;
        output += `🔗 *Link:* ${link}\n\n`;

        if (images && images.length > 0) {
            output += `*Images:*\n`;
            images.forEach((image, index) => {
                output += `${index + 1}. ${image}\n`;
            });
            output += `\n`;
        }

        output += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: output, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('iOS news command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to fetch iOS news. Please try again later.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = iosnewsCommand;

