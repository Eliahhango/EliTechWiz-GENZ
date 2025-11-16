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

async function randomCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🎲 Random Number Generator Command*\n\n*Usage:*\n.random - Random number 1-100\n.random <max> - Random number 1 to max\n.random <min> <max> - Random number between min and max\n\n*Examples:*\n.random\n.random 50\n.random 10 100`,
                ...channelInfo
            }, { quoted: message });
        }

        let min, max;
        
        if (args.length === 1) {
            min = 1;
            max = parseInt(args[0]);
        } else if (args.length === 2) {
            min = parseInt(args[0]);
            max = parseInt(args[1]);
        } else {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid format. Use: .random <max> or .random <min> <max>',
                ...channelInfo
            }, { quoted: message });
        }

        if (isNaN(min) || isNaN(max) || min >= max) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid range. Min must be less than max.',
                ...channelInfo
            }, { quoted: message });
        }

        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

        await sock.sendMessage(chatId, {
            text: `╔══「 🎲 *RANDOM NUMBER* 」══╗\n\n🎯 *Range:* ${min} - ${max}\n🎲 *Result:* ${randomNum}\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Random command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating random number. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = randomCommand;

