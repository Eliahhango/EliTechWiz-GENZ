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

async function diceCommand(sock, chatId, message) {
    try {
        const result = Math.floor(Math.random() * 6) + 1;
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        
        await sock.sendMessage(chatId, {
            text: `╔══「 🎲 *DICE ROLL* 」══╗\n\n${diceEmojis[result - 1]} *Result:* ${result}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Dice command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error rolling dice. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = diceCommand;

