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

async function mathCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🧮 Math Calculator Command*\n\n*Usage:* .math <expression>\n\n*Examples:*\n.math 2+2\n.math 10*5\n.math 100/4\n.math (5+3)*2\n\n*Supported operations:* +, -, *, /, %, ^, sqrt(), sin(), cos(), tan()`,
                ...channelInfo
            }, { quoted: message });
        }

        const expression = args.join(' ').replace(/\s+/g, '');
        
        // Validate expression - only allow numbers, operators, parentheses, and basic functions
        if (!/^[0-9+\-*/().\s,sqrt()sincostan()]+$/i.test(expression)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid expression. Only numbers and basic math operations are allowed.\n\n*Example:* .math 2+2*3',
                ...channelInfo
            }, { quoted: message });
        }

        // Safe evaluation using Function constructor (more secure than eval)
        let result;
        try {
            // Replace common math functions
            let safeExpr = expression
                .replace(/sqrt\(([^)]+)\)/gi, 'Math.sqrt($1)')
                .replace(/sin\(([^)]+)\)/gi, 'Math.sin($1)')
                .replace(/cos\(([^)]+)\)/gi, 'Math.cos($1)')
                .replace(/tan\(([^)]+)\)/gi, 'Math.tan($1)')
                .replace(/\^/g, '**'); // Power operator
            
            // Validate the expression doesn't contain dangerous code
            if (/[a-zA-Z]/.test(safeExpr.replace(/Math\./g, '').replace(/sqrt|sin|cos|tan/gi, ''))) {
                throw new Error('Invalid characters in expression');
            }
            
            result = Function(`"use strict"; return (${safeExpr})`)();
            
            if (!isFinite(result)) {
                throw new Error('Result is not a finite number');
            }
        } catch (error) {
            return await sock.sendMessage(chatId, {
                text: `❌ Error calculating: ${error.message}\n\n*Please check your expression and try again.*\n\n*Example:* .math 2+2*3`,
                ...channelInfo
            }, { quoted: message });
        }

        const text = `╔══「 🧮 *MATH CALCULATOR* 」══╗\n\n` +
            `📝 *Expression:* ${expression}\n` +
            `✅ *Result:* ${result}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;
        
        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Math command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error performing calculation. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = mathCommand;

