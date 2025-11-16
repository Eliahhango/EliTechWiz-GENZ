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

async function weather2Command(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🌤️ Weather Command*\n\n*Usage:* .weather2 <city>\n\n*Example:* .weather2 London`,
                ...channelInfo
            }, { quoted: message });
        }

        const city = args.join(' ');
        const apiKey = process.env.OPENWEATHER_API_KEY || '060a6bcfa19809c2cd4d97a212b19273';
        
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
            params: {
                q: city,
                units: 'metric',
                appid: apiKey,
                language: 'en'
            }
        });

        if (response.data) {
            const data = response.data;
            const temp = data.main.temp;
            const feelsLike = data.main.feels_like;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const description = data.weather[0].description;
            const country = data.sys.country;
            const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
            const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();

            const text = `╔══「 🌤️ *WEATHER* 」══╗\n\n` +
                `📍 *Location:* ${data.name}, ${country}\n` +
                `🌡️ *Temperature:* ${temp}°C\n` +
                `🌡️ *Feels Like:* ${feelsLike}°C\n` +
                `☁️ *Condition:* ${description}\n` +
                `💧 *Humidity:* ${humidity}%\n` +
                `💨 *Wind Speed:* ${windSpeed} m/s\n` +
                `🌅 *Sunrise:* ${sunrise}\n` +
                `🌇 *Sunset:* ${sunset}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No weather data received');
        }
    } catch (error) {
        console.error('Weather2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching weather. Please check the city name and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = weather2Command;

