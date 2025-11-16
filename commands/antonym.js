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

async function antonymCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📖 Antonym Command*\n\n*Usage:* .antonym <word>\n\n*Example:* .antonym happy`,
                ...channelInfo
            }, { quoted: message });
        }

        const word = args.join(' ');
        const response = await axios.get(`https://api.datamuse.com/words`, {
            params: {
                rel_ant: word,
                max: 10
            }
        });

        if (response.data && response.data.length > 0) {
            const antonyms = response.data.map(item => item.word).join(', ');
            const text = `╔══「 📖 *ANTONYMS* 」══╗\n\n` +
                `🔤 *Word:* ${word}\n\n` +
                `📝 *Antonyms:*\n${antonyms}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `❌ No antonyms found for "${word}"`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Antonym command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching antonyms. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = antonymCommand;

