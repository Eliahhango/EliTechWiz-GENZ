const axios = require('axios');
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

async function namecardCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📇 Name Card Generator*\n\n*Usage:* .namecard <name> | <number> | <email>\n\n*Example:* .namecard John Doe | +1234567890 | john@example.com`,
                ...channelInfo
            }, { quoted: message });
        }

        const input = args.join(' ');
        const parts = input.split('|').map(p => p.trim());
        const name = parts[0] || 'User';
        const number = parts[1] || 'N/A';
        const email = parts[2] || 'N/A';

        const text = `╔══「 📇 *NAME CARD* 」══╗\n\n` +
            `👤 *Name:* ${name}\n` +
            `📱 *Number:* ${number}\n` +
            `📧 *Email:* ${email}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Namecard command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating name card. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = namecardCommand;

