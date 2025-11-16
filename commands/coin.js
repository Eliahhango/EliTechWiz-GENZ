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

async function coinCommand(sock, chatId, message) {
    try {
        const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
        const emoji = result === 'Heads' ? '🪙' : '🪙';
        
        await sock.sendMessage(chatId, {
            text: `╔══「 🪙 *COIN FLIP* 」══╗\n\n${emoji} *Result:* ${result}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Coin command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error flipping coin. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = coinCommand;

