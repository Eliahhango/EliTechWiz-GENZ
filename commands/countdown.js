const moment = require('moment-timezone');
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

const activeCountdowns = new Map();

async function countdownCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*⏰ Countdown Command*\n\n*Usage:* .countdown <date/time>\n\n*Examples:*\n.countdown 2024-12-31 23:59:59\n.countdown 2025-01-01\n.countdown +1h (1 hour from now)\n.countdown +30m (30 minutes from now)`,
                ...channelInfo
            }, { quoted: message });
        }

        const input = args.join(' ');
        let targetTime;

        if (input.startsWith('+')) {
            const duration = moment.duration(input.substring(1));
            if (duration.isValid()) {
                targetTime = moment().add(duration);
            } else {
                return await sock.sendMessage(chatId, {
                    text: '❌ Invalid duration format. Use +1h, +30m, +2d, etc.',
                    ...channelInfo
                }, { quoted: message });
            }
        } else {
            targetTime = moment(input);
            if (!targetTime.isValid()) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Invalid date/time format. Use YYYY-MM-DD HH:mm:ss or similar.',
                    ...channelInfo
                }, { quoted: message });
            }
        }

        const now = moment();
        const diff = targetTime.diff(now);

        if (diff <= 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ The target time is in the past!',
                ...channelInfo
            }, { quoted: message });
        }

        const duration = moment.duration(diff);
        const days = Math.floor(duration.asDays());
        const hours = duration.hours();
        const minutes = duration.minutes();
        const seconds = duration.seconds();

        const text = `╔══「 ⏰ *COUNTDOWN* 」══╗\n\n` +
            `🎯 *Target:* ${targetTime.format('YYYY-MM-DD HH:mm:ss')}\n` +
            `⏰ *Time Remaining:*\n` +
            `   📅 ${days} days\n` +
            `   🕐 ${hours} hours\n` +
            `   ⏱️ ${minutes} minutes\n` +
            `   ⏲️ ${seconds} seconds\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Countdown command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error calculating countdown. Please check the format and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = countdownCommand;

