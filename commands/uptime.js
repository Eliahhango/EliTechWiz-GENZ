const os = require('os');
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

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let uptime = '';
    if (days > 0) uptime += `${days} day${days > 1 ? 's' : ''} `;
    if (hours > 0) uptime += `${hours} hour${hours > 1 ? 's' : ''} `;
    if (minutes > 0) uptime += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    if (secs > 0 || uptime === '') uptime += `${secs} second${secs > 1 ? 's' : ''}`;
    
    return uptime.trim();
}

async function uptimeCommand(sock, chatId, message) {
    try {
        const uptimeSeconds = Math.floor(process.uptime());
        const uptimeFormatted = formatUptime(uptimeSeconds);
        
        const memUsage = process.memoryUsage();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        
        const text = `╔══「 ⏱️ *UPTIME & SYSTEM INFO* 」══╗\n\n` +
            `⏰ *Uptime:* ${uptimeFormatted}\n` +
            `📊 *Memory Usage:*\n` +
            `   • Used: ${(memUsage.heapUsed / 1024 / 1024).toFixed(2)} MB\n` +
            `   • Total: ${(memUsage.heapTotal / 1024 / 1024).toFixed(2)} MB\n` +
            `   • System: ${(usedMem / 1024 / 1024 / 1024).toFixed(2)} GB / ${(totalMem / 1024 / 1024 / 1024).toFixed(2)} GB\n` +
            `💻 *Platform:* ${os.platform()}\n` +
            `🖥️ *Architecture:* ${os.arch()}\n` +
            `📦 *Node Version:* ${process.version}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;
        
        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Uptime command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching system information.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = uptimeCommand;

