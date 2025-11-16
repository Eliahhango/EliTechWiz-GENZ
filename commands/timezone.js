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

async function timezoneCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🕐 Timezone Command*\n\n*Usage:* .timezone <timezone>\n\n*Examples:*\n.timezone America/New_York\n.timezone Europe/London\n.timezone Asia/Tokyo\n\n*Or use:* .timezone list - to see common timezones`,
                ...channelInfo
            }, { quoted: message });
        }

        if (args[0].toLowerCase() === 'list') {
            const commonTimezones = [
                'America/New_York', 'America/Los_Angeles', 'America/Chicago',
                'Europe/London', 'Europe/Paris', 'Europe/Berlin',
                'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Dubai',
                'Australia/Sydney', 'Pacific/Auckland'
            ];
            
            let text = `╔══「 🕐 *COMMON TIMEZONES* 」══╗\n\n`;
            commonTimezones.forEach(tz => {
                const time = moment.tz(tz).format('YYYY-MM-DD HH:mm:ss');
                text += `🌍 *${tz}*\n   ${time}\n\n`;
            });
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            return await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        }

        const timezone = args.join(' ');
        
        if (!moment.tz.zone(timezone)) {
            return await sock.sendMessage(chatId, {
                text: `❌ Invalid timezone. Use .timezone list to see valid timezones.`,
                ...channelInfo
            }, { quoted: message });
        }

        const time = moment.tz(timezone);
        const utc = moment.utc();
        const offset = time.utcOffset();

        const text = `╔══「 🕐 *TIMEZONE INFO* 」══╗\n\n` +
            `🌍 *Timezone:* ${timezone}\n` +
            `🕐 *Local Time:* ${time.format('YYYY-MM-DD HH:mm:ss')}\n` +
            `🌐 *UTC Time:* ${utc.format('YYYY-MM-DD HH:mm:ss')}\n` +
            `⏰ *Offset:* ${offset >= 0 ? '+' : ''}${offset/60} hours\n` +
            `📅 *Day:* ${time.format('dddd')}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Timezone command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching timezone. Please check the timezone name and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = timezoneCommand;

