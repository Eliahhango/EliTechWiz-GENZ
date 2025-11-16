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

async function ipinfoCommand(sock, chatId, message, args) {
    try {
        const ip = args && args.length > 0 ? args[0] : null;
        
        if (!ip) {
            return await sock.sendMessage(chatId, {
                text: `*🌐 IP Info Command*\n\n*Usage:* .ipinfo [ip_address]\n\n*Example:* .ipinfo 8.8.8.8\n\n*Note:* If no IP is provided, it will show your IP info.`,
                ...channelInfo
            }, { quoted: message });
        }

        const response = await axios.get(`http://ip-api.com/json/${ip}`, {
            params: {
                fields: 'status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query'
            }
        });

        if (response.data && response.data.status === 'success') {
            const data = response.data;
            const text = `╔══「 🌐 *IP INFORMATION* 」══╗\n\n` +
                `🌐 *IP Address:* ${data.query}\n` +
                `🌍 *Country:* ${data.country} (${data.countryCode})\n` +
                `📍 *Region:* ${data.regionName}\n` +
                `🏙️ *City:* ${data.city}\n` +
                `📮 *ZIP:* ${data.zip || 'N/A'}\n` +
                `📍 *Coordinates:* ${data.lat}, ${data.lon}\n` +
                `🕐 *Timezone:* ${data.timezone}\n` +
                `📡 *ISP:* ${data.isp}\n` +
                `🏢 *Organization:* ${data.org || 'N/A'}\n` +
                `🔗 *AS:* ${data.as || 'N/A'}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: `❌ Error: ${response.data?.message || 'Invalid IP address or unable to fetch information'}`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('IPinfo command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching IP information. Please check the IP address and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = ipinfoCommand;

