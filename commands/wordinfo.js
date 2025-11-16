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

async function wordinfoCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📚 Word Info Command*\n\n*Usage:* .wordinfo <word>\n\n*Example:* .wordinfo hello`,
                ...channelInfo
            }, { quoted: message });
        }

        const word = args.join(' ');
        
        const [dictResponse, synResponse, antResponse, rhyResponse] = await Promise.allSettled([
            axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`),
            axios.get(`https://api.datamuse.com/words`, { params: { rel_syn: word, max: 5 } }),
            axios.get(`https://api.datamuse.com/words`, { params: { rel_ant: word, max: 5 } }),
            axios.get(`https://api.datamuse.com/words`, { params: { rel_rhy: word, max: 5 } })
        ]);

        let text = `╔══「 📚 *WORD INFO* 」══╗\n\n`;
        text += `🔤 *Word:* ${word}\n\n`;

        if (dictResponse.status === 'fulfilled' && dictResponse.value.data && dictResponse.value.data.length > 0) {
            const entry = dictResponse.value.data[0];
            if (entry.phonetic) {
                text += `🔊 *Phonetic:* ${entry.phonetic}\n`;
            }
            if (entry.meanings && entry.meanings.length > 0) {
                text += `\n📖 *Meanings:*\n`;
                entry.meanings.slice(0, 2).forEach((meaning, index) => {
                    text += `${index + 1}. *${meaning.partOfSpeech}*: ${meaning.definitions[0]?.definition || 'N/A'}\n`;
                });
            }
        }

        if (synResponse.status === 'fulfilled' && synResponse.value.data && synResponse.value.data.length > 0) {
            const synonyms = synResponse.value.data.map(item => item.word).join(', ');
            text += `\n📝 *Synonyms:* ${synonyms}\n`;
        }

        if (antResponse.status === 'fulfilled' && antResponse.value.data && antResponse.value.data.length > 0) {
            const antonyms = antResponse.value.data.map(item => item.word).join(', ');
            text += `📝 *Antonyms:* ${antonyms}\n`;
        }

        if (rhyResponse.status === 'fulfilled' && rhyResponse.value.data && rhyResponse.value.data.length > 0) {
            const rhymes = rhyResponse.value.data.map(item => item.word).join(', ');
            text += `🎵 *Rhymes:* ${rhymes}\n`;
        }

        text += `\n╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Wordinfo command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching word information. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = wordinfoCommand;

