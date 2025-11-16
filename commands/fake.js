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

async function fakeCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length < 2) {
            return await sock.sendMessage(chatId, {
                text: `*🎭 Fake Message Command*\n\n*Usage:* .fake <name> <message>\n\n*Example:* .fake John Hello everyone!`,
                ...channelInfo
            }, { quoted: message });
        }

        const name = args[0];
        const fakeMessage = args.slice(1).join(' ');
        
        // Create a fake message that appears to be from the specified name
        // Note: This is a simplified version - actual implementation would need more complex message structure
        await sock.sendMessage(chatId, {
            text: `*${name}*\n${fakeMessage}`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Fake command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error creating fake message. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = fakeCommand;

