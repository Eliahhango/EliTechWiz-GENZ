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

async function wallpaperCommand(sock, chatId, message, args) {
    try {
        const query = args.join(' ') || 'nature';
        
        // Using Unsplash API (free tier)
        const apiKey = process.env.UNSPLASH_ACCESS_KEY || 'your_key_here';
        let imageUrl;
        
        try {
            const response = await axios.get(`https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${apiKey}`);
            if (response.data && response.data.urls && response.data.urls.regular) {
                imageUrl = response.data.urls.regular;
            }
        } catch (unsplashError) {
            // Fallback to alternative API
            const fallback = await axios.get(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
                headers: {
                    'Authorization': process.env.PEXELS_API_KEY || ''
                }
            });
            if (fallback.data && fallback.data.photos && fallback.data.photos[0]) {
                imageUrl = fallback.data.photos[0].src.large;
            }
        }
        
        if (!imageUrl) {
            // Final fallback - use a simple wallpaper API
            imageUrl = `https://source.unsplash.com/1920x1080/?${encodeURIComponent(query)}`;
        }
        
        await sock.sendMessage(chatId, {
            image: { url: imageUrl },
            caption: `🖼️ *Wallpaper: ${query}*\n\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });
    } catch (error) {
        console.error('Wallpaper command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching wallpaper. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = wallpaperCommand;

