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

async function percentageCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length < 2) {
            return await sock.sendMessage(chatId, {
                text: `*📊 Percentage Calculator Command*\n\n*Usage:* .percentage <value> <total>\n\n*Examples:*\n.percentage 25 100\n.percentage 75 200`,
                ...channelInfo
            }, { quoted: message });
        }

        const value = parseFloat(args[0]);
        const total = parseFloat(args[1]);

        if (isNaN(value) || isNaN(total)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid numbers. Please provide valid numbers.',
                ...channelInfo
            }, { quoted: message });
        }

        if (total === 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ Total cannot be zero.',
                ...channelInfo
            }, { quoted: message });
        }

        const percentage = (value / total) * 100;
        const text = `╔══「 📊 *PERCENTAGE CALCULATOR* 」══╗\n\n` +
            `📝 *Value:* ${value}\n` +
            `📊 *Total:* ${total}\n` +
            `✅ *Percentage:* ${percentage.toFixed(2)}%\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Percentage command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error calculating percentage. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = percentageCommand;

