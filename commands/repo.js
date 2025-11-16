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

async function repoCommand(sock, chatId, message) {
    try {
        const infoMsg = `╔══「 🌟 *ELITECHWIZ BOT REPO INFO* 」══╗\n\n` +
            `🔗 *GITHUB LINK*\n` +
            `https://github.com/Eliahhango/EliTechWiz-GENZ\n\n` +
            `🔗 *WHATSAPP CHANNEL*\n` +
            `https://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s\n\n` +
            `📺 *YOUTUBE CHANNEL*\n` +
            `https://youtube.com/@eliahhango\n\n` +
            `╚═══════════════════╝\n\n` +
            `*FOLLOW MY CHANNEL FOR MORE INFO*\n\n` +
            `*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: infoMsg, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Repo command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching repo info. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = repoCommand;

