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

async function scanCommand(sock, chatId, message) {
    try {
        const infoMsg = `╔══「 🔗 *ELITECHWIZ BOT LINKS* 」══╗\n\n` +
            `*1️⃣ PAIRING CODE*\n` +
            `https://eliah-7b9540c853b5.herokuapp.com/pair\n\n` +
            `*2️⃣ SCAN QR CODE*\n` +
            `https://eliah-7b9540c853b5.herokuapp.com/eliahqr\n\n` +
            `*3️⃣ GITHUB REPO*\n` +
            `https://github.com/Eliahhango/EliTechWiz-GENZ\n\n` +
            `*4️⃣ WHATSAPP CHANNEL*\n` +
            `https://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s\n\n` +
            `*5️⃣ YOUTUBE CHANNEL*\n` +
            `https://youtube.com/@eliahhango\n\n` +
            `╚═══════════════════╝\n\n` +
            `*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: infoMsg, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Scan command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching links. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = scanCommand;

