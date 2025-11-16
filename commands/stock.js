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

async function stockCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📈 Stock Price Command*\n\n*Usage:* .stock <symbol>\n\n*Example:* .stock AAPL`,
                ...channelInfo
            }, { quoted: message });
        }

        const symbol = args[0].toUpperCase();
        
        try {
            const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`, {
                params: {
                    interval: '1d',
                    range: '1d'
                }
            });

            if (response.data && response.data.chart && response.data.chart.result) {
                const result = response.data.chart.result[0];
                const meta = result.meta;
                const quote = result.indicators.quote[0];
                
                const currentPrice = meta.regularMarketPrice;
                const previousClose = meta.previousClose;
                const change = currentPrice - previousClose;
                const changePercent = (change / previousClose) * 100;
                const high = meta.regularMarketDayHigh;
                const low = meta.regularMarketDayLow;
                const volume = meta.regularMarketVolume;

                const text = `╔══「 📈 *STOCK PRICE* 」══╗\n\n` +
                    `📊 *Symbol:* ${symbol}\n` +
                    `💵 *Price:* $${currentPrice?.toFixed(2) || 'N/A'}\n` +
                    `📈 *Change:* ${change >= 0 ? '+' : ''}${change?.toFixed(2) || 'N/A'} (${changePercent >= 0 ? '+' : ''}${changePercent?.toFixed(2) || 'N/A'}%)\n` +
                    `📊 *Previous Close:* $${previousClose?.toFixed(2) || 'N/A'}\n` +
                    `⬆️ *High:* $${high?.toFixed(2) || 'N/A'}\n` +
                    `⬇️ *Low:* $${low?.toFixed(2) || 'N/A'}\n` +
                    `📦 *Volume:* ${volume?.toLocaleString() || 'N/A'}\n\n` +
                    `╚═══════════════════╝\n*Powered by EliTechWiz*`;

                await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
            } else {
                throw new Error('Invalid response');
            }
        } catch (apiError) {
            await sock.sendMessage(chatId, {
                text: `❌ Stock symbol "${symbol}" not found or invalid.`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Stock command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching stock price. Please check the symbol and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = stockCommand;

