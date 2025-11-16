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

async function wanewsCommand(sock, chatId, message) {
    try {
        await sock.sendMessage(chatId, {
            text: '📱 *Fetching WhatsApp beta news...*',
            ...channelInfo
        }, { quoted: message });

        const apiUrl = 'https://api.maher-zubair.tech/details/wabetainfo';
        const response = await axios.get(apiUrl);

        if (!response.data || response.data.status !== 200 || !response.data.result) {
            return await sock.sendMessage(chatId, {
                text: '❌ Failed to fetch WhatsApp beta news.',
                ...channelInfo
            }, { quoted: message });
        }

        const { title, subtitle, date, image, link, desc, QandA } = response.data.result;

        let output = `╔══「 📱 *WHATSAPP BETA NEWS* 」══╗\n\n`;
        output += `*${title}*\n\n`;
        output += `${subtitle}\n`;
        output += `📅 *Date:* ${date}\n\n`;
        output += `${desc}\n\n`;
        output += `🔗 *Link:* ${link}\n\n`;

        if (QandA && QandA.length > 0) {
            output += `*Q&A:*\n`;
            QandA.forEach((qa, index) => {
                output += `*${index + 1}. ${qa.question}*\n${qa.answer}\n\n`;
            });
        }

        output += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        if (image) {
            await sock.sendMessage(chatId, {
                image: { url: image },
                caption: output,
                ...channelInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: output, ...channelInfo }, { quoted: message });
        }
    } catch (error) {
        console.error('WhatsApp news command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Failed to fetch WhatsApp beta news. Please try again later.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = wanewsCommand;

