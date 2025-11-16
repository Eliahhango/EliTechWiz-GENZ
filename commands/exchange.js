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

async function exchangeCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length < 3) {
            return await sock.sendMessage(chatId, {
                text: `*💱 Exchange Rate Command*\n\n*Usage:* .exchange <amount> <from_currency> <to_currency>\n\n*Examples:*\n.exchange 100 USD EUR\n.exchange 50 GBP JPY`,
                ...channelInfo
            }, { quoted: message });
        }

        const amount = parseFloat(args[0]);
        const fromCurrency = args[1].toUpperCase();
        const toCurrency = args[2].toUpperCase();

        if (isNaN(amount)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid amount. Please provide a valid number.',
                ...channelInfo
            }, { quoted: message });
        }

        const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);

        if (response.data && response.data.rates && response.data.rates[toCurrency]) {
            const rate = response.data.rates[toCurrency];
            const converted = amount * rate;
            const baseDate = response.data.date;

            const text = `╔══「 💱 *EXCHANGE RATE* 」══╗\n\n` +
                `💰 *Amount:* ${amount} ${fromCurrency}\n` +
                `💱 *Rate:* 1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}\n` +
                `✅ *Converted:* ${converted.toFixed(2)} ${toCurrency}\n` +
                `📅 *Date:* ${baseDate}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `❌ Currency "${toCurrency}" not found or invalid.`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Exchange command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching exchange rate. Please check the currencies and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = exchangeCommand;

