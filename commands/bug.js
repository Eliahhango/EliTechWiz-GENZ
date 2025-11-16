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

async function bugCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🐛 Bug Report Command*\n\n*Usage:* .bug <description>\n\n*Example:* .bug Bot crashes when using .help command`,
                ...channelInfo
            }, { quoted: message });
        }

        const bugReport = args.join(' ');
        const ownerNumber = settings.ownerNumber || '255742631101';
        const ownerJid = `${ownerNumber}@s.whatsapp.net`;

        const text = `╔══「 🐛 *BUG REPORT* 」══╗\n\n` +
            `📝 *Report:* ${bugReport}\n` +
            `👤 *Reporter:* ${message.key.participant || message.key.remoteJid}\n` +
            `📅 *Date:* ${new Date().toLocaleString()}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        // Send to owner
        try {
            await sock.sendMessage(ownerJid, { text: text, ...channelInfo });
        } catch (error) {
            console.error('Error sending bug report to owner:', error);
        }

        await sock.sendMessage(chatId, {
            text: '✅ *Bug report sent to owner!*\n\nThank you for reporting this issue.',
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Bug command error:', error);
        await sock.sendMessage(chatId, {
            text: '😅 *Oops! Bug Report Failed*\n\nI couldn\'t send your bug report right now. The owner might be busy! 📝\n\n*Please try again in a moment.*\n\n*Powered by EliTechWiz*',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = bugCommand;

