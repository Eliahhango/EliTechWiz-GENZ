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

async function wordcountCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📊 Word Count Command*\n\n*Usage:* .wordcount <text>\n\n*Example:* .wordcount Hello world this is a test`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = args.join(' ');
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const characters = text.length;
        const charactersNoSpaces = text.replace(/\s/g, '').length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

        await sock.sendMessage(chatId, {
            text: `╔══「 📊 *WORD COUNT* 」══╗\n\n` +
                `📝 *Text:* ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}\n\n` +
                `📊 *Statistics:*\n` +
                `   • Words: ${words.length}\n` +
                `   • Characters: ${characters}\n` +
                `   • Characters (no spaces): ${charactersNoSpaces}\n` +
                `   • Sentences: ${sentences}\n` +
                `   • Paragraphs: ${paragraphs}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Wordcount command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error counting words. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = wordcountCommand;

