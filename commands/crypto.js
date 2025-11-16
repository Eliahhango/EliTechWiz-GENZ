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

async function cryptoCommand(sock, chatId, message, args) {
    try {
        const symbol = args && args.length > 0 ? args[0].toUpperCase() : 'BTC';
        
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
            params: {
                ids: symbol.toLowerCase(),
                vs_currencies: 'usd,eur,btc',
                include_24hr_change: true,
                include_24hr_vol: true,
                include_market_cap: true
            }
        });

        if (response.data && response.data[symbol.toLowerCase()]) {
            const data = response.data[symbol.toLowerCase()];
            const text = `╔══「 💰 *CRYPTO PRICE* 」══╗\n\n` +
                `🪙 *Cryptocurrency:* ${symbol}\n` +
                `💵 *USD:* $${data.usd?.toLocaleString() || 'N/A'}\n` +
                `💶 *EUR:* €${data.eur?.toLocaleString() || 'N/A'}\n` +
                `₿ *BTC:* ${data.btc || 'N/A'}\n` +
                `📈 *24h Change:* ${data.usd_24h_change?.toFixed(2) || 'N/A'}%\n` +
                `📊 *24h Volume:* $${data.usd_24h_vol?.toLocaleString() || 'N/A'}\n` +
                `💼 *Market Cap:* $${data.usd_market_cap?.toLocaleString() || 'N/A'}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `❌ Cryptocurrency "${symbol}" not found. Try BTC, ETH, etc.`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Crypto command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching crypto price. Please check the symbol and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = cryptoCommand;

