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

async function calc2Command(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔢 Calculator Command*\n\n*Usage:* .calc2 <expression>\n\n*Examples:*\n.calc2 2+2\n.calc2 10*5\n.calc2 sqrt(16)\n.calc2 sin(30)`,
                ...channelInfo
            }, { quoted: message });
        }

        const expression = args.join(' ');
        
        try {
            const result = Function(`"use strict"; return (${expression})`)();
            
            const text = `╔══「 🔢 *CALCULATOR* 」══╗\n\n` +
                `📝 *Expression:* ${expression}\n` +
                `✅ *Result:* ${result}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } catch (evalError) {
            await sock.sendMessage(chatId, {
                text: '❌ Invalid expression. Please check your math and try again.',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Calc2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error calculating. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = calc2Command;

