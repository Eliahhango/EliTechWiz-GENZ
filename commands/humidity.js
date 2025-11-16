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

async function humidityCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*💧 Humidity Command*\n\n*Usage:* .humidity <city>\n\n*Example:* .humidity London`,
                ...channelInfo
            }, { quoted: message });
        }

        const city = args.join(' ');
        const apiKey = process.env.OPENWEATHER_API_KEY || 'your_key';
        
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );

        if (response.data) {
            const data = response.data;
            const text = `╔══「 💧 *HUMIDITY INFO* 」══╗\n\n` +
                `🌍 *Location:* ${data.name}, ${data.sys.country}\n` +
                `💧 *Humidity:* ${data.main.humidity}%\n` +
                `🌡️ *Temperature:* ${data.main.temp}°C\n` +
                `🌡️ *Feels Like:* ${data.main.feels_like}°C\n` +
                `📊 *Pressure:* ${data.main.pressure} hPa\n` +
                `🌬️ *Wind Speed:* ${data.wind.speed} m/s\n` +
                `☁️ *Weather:* ${data.weather[0].description}\n\n` +
                `╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No data received');
        }
    } catch (error) {
        console.error('Humidity command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching humidity data. Please check the city name and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = humidityCommand;

