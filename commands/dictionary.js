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

async function dictionaryCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📚 Dictionary Command*\n\n*Usage:* .dictionary <word>\n\n*Example:* .dictionary hello`,
                ...channelInfo
            }, { quoted: message });
        }

        const word = args.join(' ');
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

        if (response.data && response.data.length > 0) {
            const entry = response.data[0];
            let text = `╔══「 📚 *DICTIONARY* 」══╗\n\n`;
            text += `🔤 *Word:* ${entry.word}\n`;
            
            if (entry.phonetic) {
                text += `🔊 *Phonetic:* ${entry.phonetic}\n`;
            }
            
            if (entry.meanings && entry.meanings.length > 0) {
                entry.meanings.forEach((meaning, index) => {
                    text += `\n📖 *${meaning.partOfSpeech}*\n`;
                    if (meaning.definitions && meaning.definitions.length > 0) {
                        meaning.definitions.slice(0, 3).forEach((def, defIndex) => {
                            text += `${defIndex + 1}. ${def.definition}\n`;
                            if (def.example) {
                                text += `   *Example:* ${def.example}\n`;
                            }
                        });
                    }
                });
            }
            
            text += `\n╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `❌ No definition found for "${word}"`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Dictionary command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching definition. Please check the word and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = dictionaryCommand;

