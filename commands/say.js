const googleTTS = require('google-tts-api');
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

async function sayCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*👄 Text-to-Speech (English) Command*\n\n*Usage:* .say <text>\n\n*Example:* .say Hello World`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ');
        
        if (text.length > 200) {
            return await sock.sendMessage(chatId, {
                text: '❌ Text is too long. Maximum 200 characters.',
                ...channelInfo
            }, { quoted: message });
        }

        const url = googleTTS.getAudioUrl(text, {
            lang: 'en',
            slow: false,
            host: 'https://translate.google.com',
        });

        await sock.sendMessage(chatId, {
            audio: { url: url },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: message });
    } catch (error) {
        console.error('Say command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating speech. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = sayCommand;

