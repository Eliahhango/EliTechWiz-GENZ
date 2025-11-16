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

async function whoisCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔍 WHOIS Command*\n\n*Usage:* .whois <domain>\n\n*Example:* .whois google.com`,
                ...channelInfo
            }, { quoted: message });
        }

        const domain = args[0].replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
        
        const response = await axios.get(`https://api.whoisjson.com/v1/whois?domain=${encodeURIComponent(domain)}`, {
            headers: {
                'Authorization': `Bearer ${process.env.WHOIS_API_KEY || ''}`
            }
        });

        if (response.data) {
            const data = response.data;
            let text = `╔══「 🔍 *WHOIS INFORMATION* 」══╗\n\n`;
            text += `🌐 *Domain:* ${data.domain || domain}\n`;
            text += `📅 *Created:* ${data.created || 'N/A'}\n`;
            text += `📅 *Expires:* ${data.expires || 'N/A'}\n`;
            text += `👤 *Registrar:* ${data.registrar || 'N/A'}\n`;
            text += `🌍 *Country:* ${data.country || 'N/A'}\n`;
            if (data.nameServers) {
                text += `🖥️ *Name Servers:*\n${data.nameServers.slice(0, 3).join('\n')}\n`;
            }
            text += `\n╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No data received');
        }
    } catch (error) {
        console.error('WHOIS command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching WHOIS information. Please check the domain name and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = whoisCommand;

