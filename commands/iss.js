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

async function issCommand(sock, chatId, message) {
    try {
        const response = await axios.get('http://api.open-notify.org/iss-now.json');

        if (response.data && response.data.iss_position) {
            const position = response.data.iss_position;
            const timestamp = response.data.timestamp;
            const date = new Date(timestamp * 1000);

            const text = `╔══「 🛰️ *ISS LOCATION* 」══╗\n\n` +
                `🌍 *Latitude:* ${position.latitude}°\n` +
                `🌍 *Longitude:* ${position.longitude}°\n` +
                `🕐 *Time:* ${date.toLocaleString()}\n\n` +
                `🌐 *Map:* https://www.google.com/maps?q=${position.latitude},${position.longitude}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No position data received');
        }
    } catch (error) {
        console.error('ISS command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching ISS location. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = issCommand;

