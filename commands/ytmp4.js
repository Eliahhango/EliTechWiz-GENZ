const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');
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

async function ytmp4Command(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📺 YouTube MP4 Downloader*\n\n*Usage:* .ytmp4 <youtube_url>\n\n*Example:* .ytmp4 https://www.youtube.com/watch?v=dQw4w9WgXcQ`,
                ...channelInfo
            }, { quoted: message });
        }

        const url = args[0];
        
        if (!ytdl.validateURL(url)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid YouTube URL. Please provide a valid YouTube video URL.',
                ...channelInfo
            }, { quoted: message });
        }

        await sock.sendMessage(chatId, {
            text: '⏳ *Downloading video... Please wait.*',
            ...channelInfo
        }, { quoted: message });

        const info = await ytdl.getInfo(url);
        const videoDetails = info.videoDetails;
        const videoTitle = videoDetails.title || 'Video';
        
        const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
        if (!videoFormat) {
            return await sock.sendMessage(chatId, {
                text: '❌ No video format available for this video.',
                ...channelInfo
            }, { quoted: message });
        }

        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const videoPath = path.join(tempDir, `${Date.now()}.mp4`);
        const videoStream = ytdl(url, { format: videoFormat });
        const writeStream = fs.createWriteStream(videoPath);

        videoStream.pipe(writeStream);

        videoStream.on('end', async () => {
            try {
                const stats = fs.statSync(videoPath);
                const fileSizeInMB = stats.size / (1024 * 1024);

                if (fileSizeInMB > 64) {
                    fs.unlinkSync(videoPath);
                    return await sock.sendMessage(chatId, {
                        text: '❌ Video file is too large (>64MB). WhatsApp has a file size limit.',
                        ...channelInfo
                    }, { quoted: message });
                }

                await sock.sendMessage(chatId, {
                    video: fs.readFileSync(videoPath),
                    caption: `*${videoTitle}*\n\n> *_Downloaded by EliTechWiz_*`,
                    ...channelInfo
                }, { quoted: message });

                // Clean up
                setTimeout(() => {
                    if (fs.existsSync(videoPath)) {
                        fs.unlinkSync(videoPath);
                    }
                }, 5000);
            } catch (error) {
                console.error('Error sending video:', error);
                await sock.sendMessage(chatId, {
                    text: '❌ Error sending video. Please try again.',
                    ...channelInfo
                }, { quoted: message });
            }
        });

        videoStream.on('error', async (error) => {
            console.error('Video download error:', error);
            await sock.sendMessage(chatId, {
                text: '❌ Error downloading video. Please check the URL and try again.',
                ...channelInfo
            }, { quoted: message });
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath);
            }
        });
    } catch (error) {
        console.error('YTMP4 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error processing YouTube video. Please check the URL and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = ytmp4Command;

