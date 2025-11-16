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

function generatePassword(length = 12, includeNumbers = true, includeSymbols = true) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = lowercase + uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return password;
}

async function passwordCommand(sock, chatId, message, args) {
    try {
        let length = 12;
        let includeNumbers = true;
        let includeSymbols = true;

        if (args && args.length > 0) {
            const lengthArg = parseInt(args[0]);
            if (!isNaN(lengthArg) && lengthArg > 0 && lengthArg <= 50) {
                length = lengthArg;
            }
        }

        if (args && args.includes('--no-numbers')) {
            includeNumbers = false;
        }
        if (args && args.includes('--no-symbols')) {
            includeSymbols = false;
        }

        const password = generatePassword(length, includeNumbers, includeSymbols);

        await sock.sendMessage(chatId, {
            text: `╔══「 🔑 *PASSWORD GENERATOR* 」══╗\n\n` +
                `🔐 *Password:* \`${password}\`\n` +
                `📏 *Length:* ${length} characters\n` +
                `🔢 *Numbers:* ${includeNumbers ? 'Yes' : 'No'}\n` +
                `🔣 *Symbols:* ${includeSymbols ? 'Yes' : 'No'}\n\n` +
                `*Usage:* .password [length] [--no-numbers] [--no-symbols]\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Password command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating password. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = passwordCommand;

