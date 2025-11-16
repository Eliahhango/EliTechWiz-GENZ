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

async function googleCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*🔍 Google Search Command*\n\n*Usage:* .google <query>\n\n*Example:* .google What is a bot?`,
                ...channelInfo
            }, { quoted: message });
        }

        const query = args.join(' ');
        
        await sock.sendMessage(chatId, {
            text: '🔍 *Searching Google...*',
            ...channelInfo
        }, { quoted: message });

        try {
            // Using a simple Google search API alternative
            const response = await axios.get(`https://api.maher-zubair.tech/search/google?query=${encodeURIComponent(query)}`, {
                timeout: 10000
            });

            if (response.data && response.data.result && response.data.result.length > 0) {
                let text = `╔══「 🔍 *GOOGLE SEARCH* 」══╗\n\n`;
                text += `🔎 *Query:* ${query}\n\n`;
                
                const results = response.data.result.slice(0, 5); // Limit to 5 results
                results.forEach((result, index) => {
                    text += `*${index + 1}. ${result.title}*\n`;
                    text += `${result.description || 'No description'}\n`;
                    text += `🔗 ${result.url}\n\n`;
                });
                
                text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;
                
                await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
            } else {
                throw new Error('No results found');
            }
        } catch (apiError) {
            // Fallback to alternative method
            const fallbackUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
            await sock.sendMessage(chatId, {
                text: `╔══「 🔍 *GOOGLE SEARCH* 」══╗\n\n🔎 *Query:* ${query}\n\n🔗 *Search URL:*\n${fallbackUrl}\n\n*Note:* Direct search results are limited. Please visit the link above for full results.\n\n╚═══════════════════╝\n*Powered by EliTechWiz*`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Google command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error performing Google search. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = googleCommand;

