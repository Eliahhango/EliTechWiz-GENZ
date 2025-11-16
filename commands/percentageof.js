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

async function percentageofCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length < 2) {
            return await sock.sendMessage(chatId, {
                text: `*📊 Percentage Of Calculator Command*\n\n*Usage:* .percentageof <percentage> <number>\n\n*Examples:*\n.percentageof 25 100\n.percentageof 15 200`,
                ...channelInfo
            }, { quoted: message });
        }

        const percentage = parseFloat(args[0]);
        const number = parseFloat(args[1]);

        if (isNaN(percentage) || isNaN(number)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid numbers. Please provide valid numbers.',
                ...channelInfo
            }, { quoted: message });
        }

        const result = (percentage / 100) * number;
        const text = `╔══「 📊 *PERCENTAGE OF* 」══╗\n\n` +
            `📊 *Percentage:* ${percentage}%\n` +
            `🔢 *Of Number:* ${number}\n` +
            `✅ *Result:* ${result.toFixed(2)}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Percentageof command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error calculating. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = percentageofCommand;

