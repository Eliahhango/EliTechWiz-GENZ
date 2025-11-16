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

async function jidCommand(sock, chatId, message, args) {
    try {
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const senderId = message.key.participant || message.key.remoteJid;
        
        let jidToShow = senderId;
        let name = 'You';
        
        if (mentioned.length > 0) {
            jidToShow = mentioned[0];
            try {
                name = await sock.getName(jidToShow);
            } catch (error) {
                name = 'User';
            }
        } else if (args.length > 0) {
            // Try to get JID from phone number
            const phoneNumber = args[0].replace(/[^0-9]/g, '');
            if (phoneNumber.length > 0) {
                jidToShow = `${phoneNumber}@s.whatsapp.net`;
                name = phoneNumber;
            }
        }

        const text = `╔══「 🆔 *JID INFO* 」══╗\n\n` +
            `👤 *Name:* ${name}\n` +
            `🆔 *JID:* ${jidToShow}\n` +
            `💬 *Chat JID:* ${chatId}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('JID command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching JID. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = jidCommand;

