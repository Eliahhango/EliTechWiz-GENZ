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

async function domainCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🌐 Domain Info Command*\n\n*Usage:* .domain <domain>\n\n*Example:* .domain google.com`,
                ...channelInfo
            }, { quoted: message });
        }

        const domain = args[0].replace(/^https?:\/\//, '').replace(/\/$/, '');

        try {
            const dns = require('dns').promises;
            const addresses = await dns.resolve4(domain);
            const mxRecords = await dns.resolveMx(domain).catch(() => []);
            const txtRecords = await dns.resolveTxt(domain).catch(() => []);

            let text = `╔══「 🌐 *DOMAIN INFO* 」══╗\n\n`;
            text += `🌐 *Domain:* ${domain}\n\n`;
            text += `📍 *IP Addresses:*\n`;
            addresses.forEach(ip => {
                text += `   • ${ip}\n`;
            });

            if (mxRecords.length > 0) {
                text += `\n📧 *MX Records:*\n`;
                mxRecords.slice(0, 3).forEach(mx => {
                    text += `   • ${mx.exchange} (priority: ${mx.priority})\n`;
                });
            }

            if (txtRecords.length > 0) {
                text += `\n📝 *TXT Records:*\n`;
                txtRecords.slice(0, 2).forEach(txt => {
                    text += `   • ${txt.join(' ')}\n`;
                });
            }

            text += `\n╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } catch (dnsError) {
            await sock.sendMessage(chatId, {
                text: `❌ Error resolving domain: ${dnsError.message}`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Domain command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching domain information. Please check the domain and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = domainCommand;

