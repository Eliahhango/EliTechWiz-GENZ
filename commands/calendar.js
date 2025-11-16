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

async function calendarCommand(sock, chatId, message, args) {
    try {
        let date = moment();
        
        if (args && args.length > 0) {
            const input = args.join(' ');
            const parsed = moment(input);
            if (parsed.isValid()) {
                date = parsed;
            }
        }

        const year = date.year();
        const month = date.month();
        const monthName = date.format('MMMM');
        const daysInMonth = date.daysInMonth();
        const firstDay = moment(date).startOf('month').day();

        let calendar = `╔══「 📅 *CALENDAR* 」══╗\n\n`;
        calendar += `📆 *${monthName} ${year}*\n\n`;
        calendar += `Su Mo Tu We Th Fr Sa\n`;

        let days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push('  ');
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i.toString().padStart(2, ' '));
        }

        for (let i = 0; i < days.length; i += 7) {
            calendar += days.slice(i, i + 7).join(' ') + '\n';
        }

        calendar += `\n📅 *Today:* ${moment().format('YYYY-MM-DD')}\n`;
        calendar += `📅 *Selected:* ${date.format('YYYY-MM-DD')}\n\n`;
        calendar += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: calendar, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Calendar command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating calendar. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = calendarCommand;

