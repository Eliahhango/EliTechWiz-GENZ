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

async function rhymeCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🎵 Rhyme Command*\n\n*Usage:* .rhyme <word>\n\n*Example:* .rhyme cat`,
                ...channelInfo
            }, { quoted: message });
        }

        const word = args.join(' ');
        const response = await axios.get(`https://api.datamuse.com/words`, {
            params: {
                rel_rhy: word,
                max: 15
            }
        });

        if (response.data && response.data.length > 0) {
            const rhymes = response.data.map(item => item.word).join(', ');
            const text = `╔══「 🎵 *RHYMES* 」══╗\n\n` +
                `🔤 *Word:* ${word}\n\n` +
                `📝 *Rhyming Words:*\n${rhymes}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `❌ No rhymes found for "${word}"`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Rhyme command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching rhymes. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = rhymeCommand;

