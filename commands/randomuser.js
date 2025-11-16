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

async function randomuserCommand(sock, chatId, message) {
    try {
        const response = await axios.get('https://randomuser.me/api/');
        
        if (response.data && response.data.results && response.data.results.length > 0) {
            const user = response.data.results[0];
            const text = `╔══「 👤 *RANDOM USER* 」══╗\n\n` +
                `👤 *Name:* ${user.name.title} ${user.name.first} ${user.name.last}\n` +
                `📧 *Email:* ${user.email}\n` +
                `📱 *Phone:* ${user.phone}\n` +
                `📱 *Cell:* ${user.cell}\n` +
                `🌍 *Location:* ${user.location.city}, ${user.location.country}\n` +
                `🎂 *Age:* ${user.dob.age}\n` +
                `📅 *DOB:* ${new Date(user.dob.date).toLocaleDateString()}\n` +
                `👤 *Gender:* ${user.gender}\n` +
                `🌐 *Nationality:* ${user.nat}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, {
                image: { url: user.picture.large },
                caption: text,
                ...channelInfo
            }, { quoted: message });
        } else {
            throw new Error('No user data received');
        }
    } catch (error) {
        console.error('Randomuser command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching random user. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = randomuserCommand;

