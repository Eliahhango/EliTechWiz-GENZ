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

async function quranCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            const menu = `╔══「 🕌 *QURAN KAREEM* 」══╗\n\n` +
                `📖 *Available Commands:*\n\n` +
                `• .quran <surah_number>\n` +
                `  Example: .quran 1\n\n` +
                `• .quran <surah_number> <ayah_number>\n` +
                `  Example: .quran 1 1\n\n` +
                `• .asmaulhusna - Get Allah's 99 names\n\n` +
                `╚═══════════════════╝\n` +
                `*Powered by EliTechWiz*`;
            
            return await sock.sendMessage(chatId, { text: menu, ...channelInfo }, { quoted: message });
        }

        const surahNum = parseInt(args[0]);
        const ayahNum = args[1] ? parseInt(args[1]) : null;

        if (isNaN(surahNum) || surahNum < 1 || surahNum > 114) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid surah number. Please use a number between 1-114.',
                ...channelInfo
            }, { quoted: message });
        }

        let url = `https://api.alquran.cloud/v1/surah/${surahNum}`;
        if (ayahNum) {
            url = `https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}`;
        }

        const response = await axios.get(url);
        
        if (response.data && response.data.data) {
            const data = response.data.data;
            let text = `╔══「 🕌 *QURAN KAREEM* 」══╗\n\n`;
            
            if (ayahNum) {
                // Single ayah
                text += `📖 *Surah:* ${data.surah.name} (${data.surah.number})\n`;
                text += `🔢 *Ayah:* ${data.numberInSurah}\n\n`;
                text += `*Arabic:*\n${data.text}\n\n`;
                text += `*Translation:*\n${data.translation || 'Not available'}\n\n`;
            } else {
                // Full surah
                text += `📖 *Surah:* ${data.name} (${data.number})\n`;
                text += `📝 *English Name:* ${data.englishName}\n`;
                text += `🔢 *Number of Ayahs:* ${data.numberOfAyahs}\n`;
                text += `📚 *Revelation Type:* ${data.revelationType}\n\n`;
                text += `*First Ayah:*\n${data.ayahs[0]?.text || 'N/A'}\n\n`;
            }
            
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, {
                text: '❌ Could not fetch Quran data. Please try again.',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Quran command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching Quran data. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

async function asmaulhusnaCommand(sock, chatId, message) {
    try {
        const response = await axios.get('https://api.alquran.cloud/v1/asma-al-husna');
        
        if (response.data && response.data.data) {
            let text = `╔══「 🕌 *ASMAUL HUSNA* 」══╗\n\n`;
            text += `*The 99 Names of Allah (SWT)*\n\n`;
            
            response.data.data.forEach((name, index) => {
                text += `${index + 1}. *${name.name}*\n`;
                text += `   ${name.transliteration}\n`;
                text += `   ${name.en.meaning}\n\n`;
            });
            
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        }
    } catch (error) {
        console.error('Asmaul Husna error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching Asmaul Husna. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = { quranCommand, asmaulhusnaCommand };

