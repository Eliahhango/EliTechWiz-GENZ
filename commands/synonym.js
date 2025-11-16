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

async function synonymCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📖 Synonym Command*\n\n*Usage:* .synonym <word>\n\n*Example:* .synonym happy`,
                ...channelInfo
            }, { quoted: message });
        }

        const word = args.join(' ');
        const response = await axios.get(`https://api.datamuse.com/words`, {
            params: {
                rel_syn: word,
                max: 10
            }
        });

        if (response.data && response.data.length > 0) {
            const synonyms = response.data.map(item => item.word).join(', ');
            const text = `╔══「 📖 *SYNONYMS* 」══╗\n\n` +
                `🔤 *Word:* ${word}\n\n` +
                `📝 *Synonyms:*\n${synonyms}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `❌ No synonyms found for "${word}"`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Synonym command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching synonyms. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = synonymCommand;

