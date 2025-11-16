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

async function defineCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📖 Dictionary Command*\n\nPlease provide a word to define.\n\n*Example:* .define technology`,
                ...channelInfo
            }, { quoted: message });
        }

        const word = args.join(' ');
        const response = await axios.get(`http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(word)}`);

        if (!response.data.list || response.data.list.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `❌ No definition found for "${word}"`,
                ...channelInfo
            }, { quoted: message });
        }

        const definition = response.data.list[0];
        let text = `╔══「 📖 *DICTIONARY* 」══╗\n\n`;
        text += `🔤 *Word:* ${definition.word}\n\n`;
        text += `📝 *Definition:*\n${definition.definition.replace(/\[/g, '').replace(/\]/g, '')}\n\n`;
        
        if (definition.example) {
            text += `💡 *Example:*\n${definition.example.replace(/\[/g, '').replace(/\]/g, '')}\n\n`;
        }
        
        text += `👍 *Thumbs Up:* ${definition.thumbs_up} | 👎 *Thumbs Down:* ${definition.thumbs_down}\n\n`;
        text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Define command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching definition. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = defineCommand;

