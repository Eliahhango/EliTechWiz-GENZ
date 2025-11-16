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

async function spellcheckCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*✅ Spell Check Command*\n\n*Usage:* .spellcheck <word>\n\n*Example:* .spellcheck recieve`,
                ...channelInfo
            }, { quoted: message });
        }

        const word = args.join(' ');
        const response = await axios.get(`https://api.datamuse.com/sug`, {
            params: {
                s: word,
                max: 5
            }
        });

        if (response.data && response.data.length > 0) {
            const suggestions = response.data.map(item => item.word).join(', ');
            const text = `╔══「 ✅ *SPELL CHECK* 」══╗\n\n` +
                `🔤 *Word:* ${word}\n\n` +
                `💡 *Suggestions:*\n${suggestions}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `✅ "${word}" appears to be spelled correctly, or no suggestions found.`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Spellcheck command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error checking spelling. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = spellcheckCommand;

