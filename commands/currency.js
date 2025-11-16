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

async function currencyCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length < 3) {
            return await sock.sendMessage(chatId, {
                text: `*💱 Currency Converter Command*\n\n*Usage:* .currency <amount> <from> <to>\n\n*Examples:*\n.currency 100 USD EUR\n.currency 50 GBP USD\n\n*Supported currencies:* USD, EUR, GBP, JPY, INR, etc.`,
                ...channelInfo
            }, { quoted: message });
        }

        const amount = parseFloat(args[0]);
        const from = args[1].toUpperCase();
        const to = args[2].toUpperCase();

        if (isNaN(amount) || amount <= 0) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid amount. Please provide a valid number.',
                ...channelInfo
            }, { quoted: message });
        }

        try {
            const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${from}`);
            
            if (!response.data || !response.data.rates || !response.data.rates[to]) {
                throw new Error('Currency not found');
            }

            const rate = response.data.rates[to];
            const converted = (amount * rate).toFixed(2);

            const text = `╔══「 💱 *CURRENCY CONVERTER* 」══╗\n\n` +
                `💰 *Amount:* ${amount} ${from}\n` +
                `💱 *Rate:* 1 ${from} = ${rate} ${to}\n` +
                `✅ *Result:* ${converted} ${to}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } catch (apiError) {
            // Fallback to alternative API
            try {
                const fallback = await axios.get(`https://api.fixer.io/latest?base=${from}&symbols=${to}`);
                if (fallback.data && fallback.data.rates) {
                    const rate = fallback.data.rates[to];
                    const converted = (amount * rate).toFixed(2);
                    
                    const text = `╔══「 💱 *CURRENCY CONVERTER* 」══╗\n\n` +
                        `💰 *Amount:* ${amount} ${from}\n` +
                        `💱 *Rate:* 1 ${from} = ${rate} ${to}\n` +
                        `✅ *Result:* ${converted} ${to}\n\n` +
                        `╚═══════════════════╝\n*Powered by EliTechWiz*`;
                    
                    await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
                } else {
                    throw new Error('API failed');
                }
            } catch (fallbackError) {
                throw new Error('All currency APIs failed');
            }
        }
    } catch (error) {
        console.error('Currency command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error converting currency. Please check the currency codes and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = currencyCommand;

