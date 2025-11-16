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

const activeTimers = new Map();

async function timerCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*⏰ Timer Command*\n\n*Usage:* .timer <seconds>\n\n*Examples:*\n.timer 60 - Set 60 second timer\n.timer 300 - Set 5 minute timer`,
                ...channelInfo
            }, { quoted: message });
        }

        const seconds = parseInt(args[0]);
        
        if (isNaN(seconds) || seconds <= 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid time. Please provide a positive number of seconds.',
                ...channelInfo
            }, { quoted: message });
        }

        if (seconds > 3600) {
            return await sock.sendMessage(chatId, {
                text: '❌ Maximum timer is 3600 seconds (1 hour).',
                ...channelInfo
            }, { quoted: message });
        }

        const timerId = `${chatId}_${Date.now()}`;
        
        await sock.sendMessage(chatId, {
            text: `⏰ Timer set for ${seconds} seconds. I'll notify you when it's done!`,
            ...channelInfo
        }, { quoted: message });

        activeTimers.set(timerId, { chatId, seconds, startTime: Date.now() });

        setTimeout(async () => {
            activeTimers.delete(timerId);
            await sock.sendMessage(chatId, {
                text: `⏰ *Timer Complete!*\n\nYour ${seconds} second timer has finished!`,
                ...channelInfo
            });
        }, seconds * 1000);
    } catch (error) {
        console.error('Timer command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error setting timer. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = timerCommand;

