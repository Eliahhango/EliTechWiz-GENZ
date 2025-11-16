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

async function ageCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🎂 Age Calculator Command*\n\n*Usage:* .age <birthdate>\n\n*Format:* YYYY-MM-DD or DD/MM/YYYY\n\n*Examples:*\n.age 2000-01-15\n.age 15/01/2000`,
                ...channelInfo
            }, { quoted: message });
        }

        const dateInput = args[0];
        let birthDate;
        
        // Try different date formats
        if (dateInput.includes('-')) {
            birthDate = new Date(dateInput);
        } else if (dateInput.includes('/')) {
            const parts = dateInput.split('/');
            if (parts.length === 3) {
                // Assume DD/MM/YYYY format
                birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
        } else {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY',
                ...channelInfo
            }, { quoted: message });
        }

        if (isNaN(birthDate.getTime())) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid date. Please check the format and try again.',
                ...channelInfo
            }, { quoted: message });
        }

        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        const daysOld = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
        const monthsOld = Math.floor(daysOld / 30);
        const weeksOld = Math.floor(daysOld / 7);

        const text = `╔══「 🎂 *AGE CALCULATOR* 」══╗\n\n` +
            `📅 *Birthdate:* ${birthDate.toLocaleDateString()}\n` +
            `🎂 *Age:* ${age} years old\n` +
            `📊 *Details:*\n` +
            `   • ${monthsOld} months\n` +
            `   • ${weeksOld} weeks\n` +
            `   • ${daysOld} days\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;
        
        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Age command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error calculating age. Please check the date format and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = ageCommand;

