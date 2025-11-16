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

async function gitCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📦 Git Info Command*\n\n*Usage:* .git <username/repo>\n\n*Example:* .git Eliahhango/EliTechWiz-GENZ`,
                ...channelInfo
            }, { quoted: message });
        }

        const repo = args[0];
        const [username, repoName] = repo.split('/');

        if (!username || !repoName) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid format. Use: username/repo',
                ...channelInfo
            }, { quoted: message });
        }

        try {
            const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);

            if (response.data) {
                const data = response.data;
                const text = `╔══「 📦 *GIT REPOSITORY* 」══╗\n\n` +
                    `📦 *Repository:* ${data.full_name}\n` +
                    `📝 *Description:* ${data.description || 'No description'}\n` +
                    `⭐ *Stars:* ${data.stargazers_count}\n` +
                    `🍴 *Forks:* ${data.forks_count}\n` +
                    `👁️ *Watchers:* ${data.watchers_count}\n` +
                    `🌿 *Language:* ${data.language || 'N/A'}\n` +
                    `📅 *Created:* ${new Date(data.created_at).toLocaleDateString()}\n` +
                    `🔄 *Updated:* ${new Date(data.updated_at).toLocaleDateString()}\n` +
                    `🔗 *URL:* ${data.html_url}\n\n` +
                    `╚═══════════════════╝\n*Powered by EliTechWiz*`;

                await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
            } else {
                throw new Error('No data received');
            }
        } catch (apiError) {
            await sock.sendMessage(chatId, {
                text: `❌ Repository "${repo}" not found. Please check the username and repository name.`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Git command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching repository info. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = gitCommand;

