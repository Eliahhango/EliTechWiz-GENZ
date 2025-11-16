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

async function ipCommand(sock, chatId, message, args) {
    try {
        const ip = args && args[0] ? args[0] : null;
        
        let apiUrl;
        if (ip) {
            // Validate IP format
            if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(ip)) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Invalid IP address format. Please use: xxx.xxx.xxx.xxx',
                    ...channelInfo
                }, { quoted: message });
            }
            apiUrl = `http://ip-api.com/json/${ip}`;
        } else {
            // Get own IP info
            apiUrl = 'http://ip-api.com/json/';
        }

        const response = await axios.get(apiUrl);
        
        if (response.data && response.data.status === 'success') {
            const data = response.data;
            let text = `╔══「 🌐 *IP INFORMATION* 」══╗\n\n`;
            text += `📍 *IP Address:* ${data.query}\n`;
            text += `🌍 *Country:* ${data.country}\n`;
            text += `🏙️ *Region:* ${data.regionName}\n`;
            text += `🏘️ *City:* ${data.city}\n`;
            text += `📮 *ZIP:* ${data.zip || 'N/A'}\n`;
            text += `📍 *Latitude:* ${data.lat}\n`;
            text += `📍 *Longitude:* ${data.lon}\n`;
            text += `🌐 *ISP:* ${data.isp}\n`;
            text += `🏢 *Organization:* ${data.org || 'N/A'}\n`;
            text += `⏰ *Timezone:* ${data.timezone}\n\n`;
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('Failed to fetch IP info');
        }
    } catch (error) {
        console.error('IP command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching IP information. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = ipCommand;

