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

async function covidCommand(sock, chatId, message, args) {
    try {
        const country = args && args.length > 0 ? args.join(' ') : 'all';
        
        let url = 'https://disease.sh/v3/covid-19/all';
        if (country.toLowerCase() !== 'all') {
            url = `https://disease.sh/v3/covid-19/countries/${encodeURIComponent(country)}`;
        }

        const response = await axios.get(url);

        if (response.data) {
            const data = response.data;
            let text = `╔══「 🦠 *COVID-19 STATS* 」══╗\n\n`;
            
            if (data.country) {
                text += `🌍 *Country:* ${data.country}\n`;
            } else {
                text += `🌍 *Global Statistics*\n`;
            }
            
            text += `\n📊 *Cases:*\n`;
            text += `   • Total: ${data.cases?.toLocaleString() || 'N/A'}\n`;
            text += `   • Today: ${data.todayCases?.toLocaleString() || 'N/A'}\n`;
            text += `   • Active: ${data.active?.toLocaleString() || 'N/A'}\n`;
            text += `   • Recovered: ${data.recovered?.toLocaleString() || 'N/A'}\n`;
            text += `   • Critical: ${data.critical?.toLocaleString() || 'N/A'}\n`;
            text += `\n💀 *Deaths:*\n`;
            text += `   • Total: ${data.deaths?.toLocaleString() || 'N/A'}\n`;
            text += `   • Today: ${data.todayDeaths?.toLocaleString() || 'N/A'}\n`;
            text += `\n📈 *Tests:* ${data.tests?.toLocaleString() || 'N/A'}\n`;
            text += `\n📅 *Updated:* ${new Date(data.updated).toLocaleString()}\n\n`;
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No data received');
        }
    } catch (error) {
        console.error('Covid command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching COVID-19 data. Please check the country name and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = covidCommand;

