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

async function bibleCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📖 Bible Command*\n\nPlease specify the book, chapter and verse you want to read.\n\n*Example:* .bible John 3:16\n.bible Romans 6:23`,
                ...channelInfo
            }, { quoted: message });
        }

        const reference = args.join(' ');
        const response = await axios.get(`https://bible-api.com/${encodeURIComponent(reference)}`);
        
        if (response.data && response.data.reference) {
            const bibleText = `╔══「 📖 *THE HOLY BIBLE* 」══╗\n\n` +
                `📚 *Reference:* ${response.data.reference}\n` +
                `📝 *Text:*\n${response.data.text}\n\n` +
                `🔢 *Number of Verses:* ${response.data.verses.length}\n\n` +
                `╚═══════════════════╝\n` +
                `*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: bibleText, ...channelInfo }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Could not find that Bible reference. Please check the format.\n\n*Example:* .bible John 3:16',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Bible command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching Bible verse. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = bibleCommand;

