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

async function pollCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length < 3) {
            return await sock.sendMessage(chatId, {
                text: `*📊 Poll Command*\n\n*Usage:* .poll <question> / <option1>, <option2>, ...\n\n*Example:*\n.poll What is your favorite color? / Red, Blue, Green, Yellow`,
                ...channelInfo
            }, { quoted: message });
        }

        const fullText = args.join(' ');
        const parts = fullText.split('/');
        
        if (parts.length < 2) {
            return await sock.sendMessage(chatId, {
                text: '❌ Incorrect format.\n\n*Example:* .poll What is 1+1? / 2, 3, 4',
                ...channelInfo
            }, { quoted: message });
        }

        const question = parts[0].trim();
        const optionsText = parts[1].trim();
        const options = optionsText.split(',').map(opt => opt.trim()).filter(opt => opt.length > 0);

        if (options.length < 2) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide at least 2 options for the poll.',
                ...channelInfo
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            poll: {
                name: question,
                values: options
            },
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Poll command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error creating poll. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = pollCommand;

