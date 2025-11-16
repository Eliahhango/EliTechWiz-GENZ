const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
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

async function ping2Command(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🏓 Ping Command*\n\n*Usage:* .ping2 <host>\n\n*Example:* .ping2 google.com`,
                ...channelInfo
            }, { quoted: message });
        }

        const host = args[0];
        const startTime = Date.now();

        try {
            const { stdout } = await execAsync(`ping -c 4 ${host}`, { timeout: 10000 });
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            const lines = stdout.split('\n');
            const stats = lines.find(line => line.includes('packets transmitted'));
            const timeStats = lines.find(line => line.includes('min/avg/max'));

            let text = `╔══「 🏓 *PING RESULT* 」══╗\n\n`;
            text += `🌐 *Host:* ${host}\n`;
            text += `⏱️ *Response Time:* ${responseTime}ms\n\n`;
            
            if (stats) {
                text += `📊 *Statistics:*\n${stats}\n`;
            }
            if (timeStats) {
                text += `\n⏱️ *Time Stats:*\n${timeStats}\n`;
            }

            text += `\n╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } catch (execError) {
            await sock.sendMessage(chatId, {
                text: `❌ Error pinging ${host}. Host may be unreachable or invalid.`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Ping2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error executing ping. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = ping2Command;

