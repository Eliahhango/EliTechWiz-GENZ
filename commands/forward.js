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

async function forwardCommand(sock, chatId, message, args) {
    try {
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        
        if (!quotedMessage) {
            return await sock.sendMessage(chatId, {
                text: `*📤 Forward Command*\n\n*Usage:* Reply to a message with .forward\n\n*Example:* Reply to any message with .forward`,
                ...channelInfo
            }, { quoted: message });
        }

        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📤 Forward Command*\n\n*Usage:* .forward <jid>\n\n*Example:* .forward 1234567890@s.whatsapp.net\n\nOr reply to a message and forward it to the current chat.`,
                ...channelInfo
            }, { quoted: message });
        }

        const targetJid = args[0];
        
        // Validate JID format
        if (!targetJid.includes('@')) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid JID format. Please use: number@s.whatsapp.net or number@g.us',
                ...channelInfo
            }, { quoted: message });
        }

        // Forward the quoted message
        await sock.sendMessage(targetJid, {
            forward: quotedMessage,
            ...channelInfo
        });

        await sock.sendMessage(chatId, {
            text: `✅ Message forwarded to ${targetJid}`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Forward command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error forwarding message. Please check the JID and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = forwardCommand;

