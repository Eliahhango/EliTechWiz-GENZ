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

async function trtCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length < 2) {
            return await sock.sendMessage(chatId, {
                text: `*🌐 Translate Command*\n\n*Usage:* .trt <target_lang> <text>\n\n*Supported languages:* en, es, fr, de, it, pt, ru, ja, ko, zh, ar, hi\n\n*Examples:*\n.trt es Hello World\n.trt fr Bonjour`,
                ...channelInfo
            }, { quoted: message });
        }

        const targetLang = args[0].toLowerCase();
        const text = args.slice(1).join(' ');

        const languageCodes = {
            'en': 'English', 'es': 'Spanish', 'fr': 'French', 'de': 'German',
            'it': 'Italian', 'pt': 'Portuguese', 'ru': 'Russian', 'ja': 'Japanese',
            'ko': 'Korean', 'zh': 'Chinese', 'ar': 'Arabic', 'hi': 'Hindi'
        };

        if (!languageCodes[targetLang]) {
            return await sock.sendMessage(chatId, {
                text: `❌ Unsupported language. Supported: ${Object.keys(languageCodes).join(', ')}`,
                ...channelInfo
            }, { quoted: message });
        }

        try {
            const response = await axios.get('https://api.mymemory.translated.net/get', {
                params: {
                    q: text,
                    langpair: `auto|${targetLang}`
                }
            });

            if (response.data && response.data.responseData) {
                const translated = response.data.responseData.translatedText;
                const detectedLang = response.data.responseData.detectedSourceLanguage || 'auto';

                const text = `╔══「 🌐 *TRANSLATE* 」══╗\n\n` +
                    `📝 *Original:* ${text}\n` +
                    `🌍 *Detected:* ${detectedLang}\n` +
                    `✅ *Translated (${languageCodes[targetLang]}):* ${translated}\n\n` +
                    `╚═══════════════════╝\n*Powered by EliTechWiz*`;

                await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
            } else {
                throw new Error('No translation received');
            }
        } catch (apiError) {
            await sock.sendMessage(chatId, {
                text: '❌ Error translating text. Please try again.',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('TRT command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing translation. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = trtCommand;

