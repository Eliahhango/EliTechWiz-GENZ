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

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

async function systemCommand(sock, chatId, message) {
    try {
        const memUsage = process.memoryUsage();
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const cpuCount = os.cpus().length;
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);

        const text = `╔══「 💻 *SYSTEM INFORMATION* 」══╗\n\n` +
            `🖥️ *Platform:* ${os.platform()}\n` +
            `🏗️ *Architecture:* ${os.arch()}\n` +
            `💾 *CPU Cores:* ${cpuCount}\n` +
            `📦 *Node Version:* ${process.version}\n\n` +
            `💾 *Memory Usage:*\n` +
            `   • Heap Used: ${formatBytes(memUsage.heapUsed)}\n` +
            `   • Heap Total: ${formatBytes(memUsage.heapTotal)}\n` +
            `   • RSS: ${formatBytes(memUsage.rss)}\n` +
            `   • System Total: ${formatBytes(totalMem)}\n` +
            `   • System Free: ${formatBytes(freeMem)}\n` +
            `   • System Used: ${formatBytes(usedMem)}\n\n` +
            `⏰ *Uptime:* ${days}d ${hours}h ${minutes}m\n` +
            `🏠 *Hostname:* ${os.hostname()}\n` +
            `👤 *User:* ${os.userInfo().username}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;
        
        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('System command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching system information.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = systemCommand;

