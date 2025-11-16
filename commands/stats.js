const settings = require('../settings');
const { getCommandStats, getTopCommands } = require('../lib/commandStats');

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

async function statsCommand(sock, chatId, message, args) {
    try {
        const stats = getCommandStats();
        const topCommands = getTopCommands(10);
        
        let text = `╔══「 📊 *BOT STATISTICS* 」══╗\n\n`;
        text += `📈 *Total Commands Executed:* ${stats.totalCommands.toLocaleString()}\n\n`;
        
        if (topCommands.length > 0) {
            text += `🏆 *Top 10 Commands:*\n`;
            topCommands.forEach((cmd, index) => {
                text += `${index + 1}. *${cmd.name}* - ${cmd.count.toLocaleString()} times\n`;
            });
            text += `\n`;
        }
        
        const today = new Date().toISOString().split('T')[0];
        if (stats.dailyStats[today]) {
            const todayStats = stats.dailyStats[today];
            text += `📅 *Today's Stats:*\n`;
            text += `• Commands: ${todayStats.totalCommands.toLocaleString()}\n`;
            text += `• Unique Users: ${(todayStats.uniqueUsers?.length || 0).toLocaleString()}\n\n`;
        }
        
        text += `╚═══════════════════╝\n*Powered by ${settings.botName || 'EliTechWiz'}*`;
        
        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        const { handleError } = require('../lib/errorHandler');
        await handleError(sock, chatId, message, error, 'processing');
    }
}

module.exports = statsCommand;

