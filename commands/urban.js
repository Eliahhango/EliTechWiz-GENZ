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

async function urbanCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📖 Urban Dictionary Command*\n\n*Usage:* .urban <word>\n\n*Example:* .urban yeet`,
                ...channelInfo
            }, { quoted: message });
        }

        const word = args.join(' ');
        const response = await axios.get(`http://api.urbandictionary.com/v0/define`, {
            params: { term: word }
        });

        if (response.data && response.data.list && response.data.list.length > 0) {
            const definition = response.data.list[0];
            const text = `╔══「 📖 *URBAN DICTIONARY* 」══╗\n\n` +
                `🔤 *Word:* ${definition.word}\n\n` +
                `📝 *Definition:*\n${definition.definition}\n\n` +
                `💡 *Example:*\n${definition.example || 'No example available'}\n\n` +
                `👍 *Thumbs Up:* ${definition.thumbs_up}\n` +
                `👎 *Thumbs Down:* ${definition.thumbs_down}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `❌ No definition found for "${word}"`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Urban command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching definition. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = urbanCommand;

