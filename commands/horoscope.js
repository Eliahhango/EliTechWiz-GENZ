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

const zodiacSigns = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 
                     'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

async function horoscopeCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔮 Horoscope Command*\n\n*Usage:* .horoscope <sign>\n\n*Signs:* ${zodiacSigns.join(', ')}\n\n*Example:* .horoscope leo`,
                ...channelInfo
            }, { quoted: message });
        }

        const sign = args[0].toLowerCase();
        
        if (!zodiacSigns.includes(sign)) {
            return await sock.sendMessage(chatId, {
                text: `❌ Invalid zodiac sign. Available signs: ${zodiacSigns.join(', ')}`,
                ...channelInfo
            }, { quoted: message });
        }

        try {
            const response = await axios.get(`https://aztro.sameerkumar.website/`, {
                method: 'POST',
                params: {
                    sign: sign,
                    day: 'today'
                }
            });

            if (response.data) {
                const data = response.data;
                const text = `╔══「 🔮 *HOROSCOPE* 」══╗\n\n` +
                    `⭐ *Sign:* ${sign.charAt(0).toUpperCase() + sign.slice(1)}\n` +
                    `📅 *Date:* ${data.current_date}\n` +
                    `📊 *Compatibility:* ${data.compatibility}\n` +
                    `😊 *Mood:* ${data.mood}\n` +
                    `🎨 *Color:* ${data.color}\n` +
                    `🔢 *Lucky Number:* ${data.lucky_number}\n` +
                    `⏰ *Lucky Time:* ${data.lucky_time}\n\n` +
                    `📖 *Description:*\n${data.description}\n\n` +
                    `╚═══════════════════╝\n*Powered by EliTechWiz*`;

                await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
            } else {
                throw new Error('No data received');
            }
        } catch (apiError) {
            await sock.sendMessage(chatId, {
                text: '❌ Error fetching horoscope. Please try again.',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Horoscope command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing horoscope. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = horoscopeCommand;

