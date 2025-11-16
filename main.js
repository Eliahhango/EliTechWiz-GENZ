// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
  fs.readdir(customTemp, (err, files) => {
    if (err) return;
    for (const file of files) {
      const filePath = path.join(customTemp, file);
      fs.stat(filePath, (err, stats) => {
        if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
          fs.unlink(filePath, () => {});
        }
      });
    }
  });
  console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

const settings = require('./settings');
require('./config.js');
// Initialize data files
require('./lib/initData');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const { autotypingCommand, isAutotypingEnabled, handleAutotypingForMessage, handleAutotypingForCommand, showTypingAfterCommand } = require('./commands/autotyping');
const { autoreadCommand, isAutoreadEnabled, handleAutoread } = require('./commands/autoread');
const { handleAutoReact, handleAutoBlueTick, handleAutoStatusView, handleAutoStatusLike } = require('./lib/automation');
const { checkChannelMembership, isMarkedAsMember, verifyChannelJoin, getChannelJoinMessage } = require('./lib/channelEnforcer');
const { trackCommand } = require('./lib/commandStats');
const { isRateLimited, getRemainingRequests } = require('./lib/rateLimiter');

// Command imports
const tagAllCommand = require('./commands/tagall');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./commands/antitag');
const { Antilink } = require('./lib/antilink');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand } = require('./commands/mention');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const tagNotAdminCommand = require('./commands/tagnotadmin');
const hideTagCommand = require('./commands/hidetag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const { goodbyeCommand, handleLeaveEvent } = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');
const clearSessionCommand = require('./commands/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./commands/autostatus');
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const clearTmpCommand = require('./commands/cleartmp');
const setProfilePicture = require('./commands/setpp');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./commands/groupmanage');
const instagramCommand = require('./commands/instagram');
const facebookCommand = require('./commands/facebook');
const spotifyCommand = require('./commands/spotify');
const playCommand = require('./commands/play');
const tiktokCommand = require('./commands/tiktok');
const songCommand = require('./commands/song');
const aiCommand = require('./commands/ai');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');
const videoCommand = require('./commands/video');
const sudoCommand = require('./commands/sudo');
const { miscCommand, handleHeart } = require('./commands/misc');
const { animeCommand } = require('./commands/anime');
const { piesCommand, piesAlias } = require('./commands/pies');
const stickercropCommand = require('./commands/stickercrop');
const updateCommand = require('./commands/update');
const removebgCommand = require('./commands/removebg');
const { reminiCommand } = require('./commands/remini');
const { igsCommand } = require('./commands/igs');
const { anticallCommand, readState: readAnticallState } = require('./commands/anticall');
const { pmblockerCommand, readState: readPmBlockerState } = require('./commands/pmblocker');
const settingsCommand = require('./commands/settings');
const soraCommand = require('./commands/sora');
// New commands from V4
const bibleCommand = require('./commands/bible');
const { quranCommand, asmaulhusnaCommand } = require('./commands/quran');
const movieCommand = require('./commands/movie');
const defineCommand = require('./commands/define');
const pollCommand = require('./commands/poll');
const { afkCommand, isUserAfk, removeAfk } = require('./commands/afk');
const catCommand = require('./commands/cat');
const dogCommand = require('./commands/dog');
const uptimeCommand = require('./commands/uptime');
const wallpaperCommand = require('./commands/wallpaper');
const cricketCommand = require('./commands/cricket');
const pastebinCommand = require('./commands/pastebin');
const whoisCommand = require('./commands/whois');
const shortCommand = require('./commands/short');
const rankCommand = require('./commands/rank');
const systemCommand = require('./commands/system');
const mathCommand = require('./commands/math');
const ytsearchCommand = require('./commands/ytsearch');
const logohackerCommand = require('./commands/logohacker');
const logonarutoCommand = require('./commands/logonaruto');
const logodragonballCommand = require('./commands/logodragonball');
const humidityCommand = require('./commands/humidity');
const forwardCommand = require('./commands/forward');
const fakeCommand = require('./commands/fake');
const unicodeCommand = require('./commands/unicode');
const vcfCommand = require('./commands/vcf');
const youtubeCommand = require('./commands/youtube');
const base64Command = require('./commands/base64');
const qrcodeCommand = require('./commands/qrcode');
const currencyCommand = require('./commands/currency');
const ipCommand = require('./commands/ip');
const colorCommand = require('./commands/color');
const randomCommand = require('./commands/random');
const coinCommand = require('./commands/coin');
const diceCommand = require('./commands/dice');
const ageCommand = require('./commands/age');
const timerCommand = require('./commands/timer');
const remindCommand = require('./commands/remind');
const notesCommand = require('./commands/notes');
const googleCommand = require('./commands/google');
const imdbCommand = require('./commands/imdb');
const animeinfoCommand = require('./commands/animeinfo');
const wanewsCommand = require('./commands/wanews');
const iosnewsCommand = require('./commands/iosnews');
const repoCommand = require('./commands/repo');
const sayCommand = require('./commands/say');
const ditCommand = require('./commands/dit');
const ittaCommand = require('./commands/itta');
const scanCommand = require('./commands/scan');
const riddleCommand = require('./commands/riddle');
const hashCommand = require('./commands/hash');
const passwordCommand = require('./commands/password');
const wordcountCommand = require('./commands/wordcount');
const reverseCommand = require('./commands/reverse');
const uppercaseCommand = require('./commands/uppercase');
const lowercaseCommand = require('./commands/lowercase');
const capitalizeCommand = require('./commands/capitalize');
const emojifyCommand = require('./commands/emojify');
const binaryCommand = require('./commands/binary');
const hexCommand = require('./commands/hex');
const asciiCommand = require('./commands/ascii');
const joke2Command = require('./commands/joke2');
const meme2Command = require('./commands/meme2');
const adviceCommand = require('./commands/advice');
const chucknorrisCommand = require('./commands/chucknorris');
const dadjokeCommand = require('./commands/dadjoke');
const trivia2Command = require('./commands/trivia2');
const quote2Command = require('./commands/quote2');
const fact2Command = require('./commands/fact2');
const weather2Command = require('./commands/weather2');
const urbanCommand = require('./commands/urban');
const dictionaryCommand = require('./commands/dictionary');
const synonymCommand = require('./commands/synonym');
const antonymCommand = require('./commands/antonym');
const rhymeCommand = require('./commands/rhyme');
const spellcheckCommand = require('./commands/spellcheck');
const wordinfoCommand = require('./commands/wordinfo');
const qrcode2Command = require('./commands/qrcode2');
const color2Command = require('./commands/color2');
const randomcolorCommand = require('./commands/randomcolor');
const unitCommand = require('./commands/unit');
const timezoneCommand = require('./commands/timezone');
const calendarCommand = require('./commands/calendar');
const countdownCommand = require('./commands/countdown');
const ipinfoCommand = require('./commands/ipinfo');
const domainCommand = require('./commands/domain');
const ping2Command = require('./commands/ping2');
const urlshortCommand = require('./commands/urlshort');
const urlexpandCommand = require('./commands/urlexpand');
const urlstatusCommand = require('./commands/urlstatus');
const randomuserCommand = require('./commands/randomuser');
const covidCommand = require('./commands/covid');
const cryptoCommand = require('./commands/crypto');
const stockCommand = require('./commands/stock');
const exchangeCommand = require('./commands/exchange');
const nasaCommand = require('./commands/nasa');
const issCommand = require('./commands/iss');
const horoscopeCommand = require('./commands/horoscope');
const quote3Command = require('./commands/quote3');
const lyrics2Command = require('./commands/lyrics2');
const spotify2Command = require('./commands/spotify2');
const ytinfoCommand = require('./commands/ytinfo');
const ytchannelCommand = require('./commands/ytchannel');
const ytplaylistCommand = require('./commands/ytplaylist');
const reminder2Command = require('./commands/reminder2');
const todoCommand = require('./commands/todo');
const calc2Command = require('./commands/calc2');
const percentageCommand = require('./commands/percentage');
const percentageofCommand = require('./commands/percentageof');
const { autoreactCommand, isAutoreactEnabled } = require('./commands/autoreact');
const { autostatusviewCommand, isAutostatusviewEnabled } = require('./commands/autostatusview');
const { autostatuslikeCommand, isAutostatuslikeEnabled } = require('./commands/autostatuslike');
const { autoblueCommand, isAutoblueEnabled } = require('./commands/autoblue');
const nekoCommand = require('./commands/neko');
const waifuCommand = require('./commands/waifu');
const kissCommand = require('./commands/kiss');
const hugCommand = require('./commands/hug');
const patCommand = require('./commands/pat');
const slapCommand = require('./commands/slap');
const cryCommand = require('./commands/cry');
const winkCommand = require('./commands/wink');
const pokeCommand = require('./commands/poke');
const facepalmCommand = require('./commands/facepalm');
const smileCommand = require('./commands/smile');
const highfiveCommand = require('./commands/highfive');
const cuddleCommand = require('./commands/cuddle');
const biteCommand = require('./commands/bite');
const nomCommand = require('./commands/nom');
const kick2Command = require('./commands/kick2');
const bonkCommand = require('./commands/bonk');
const loliCommand = require('./commands/loli');
const ytmp4Command = require('./commands/ytmp4');
const igscCommand = require('./commands/igsc');
const vvCommand = require('./commands/vv');
const jidCommand = require('./commands/jid');
const trtCommand = require('./commands/trt');
const namecardCommand = require('./commands/namecard');
const tweetCommand = require('./commands/tweet');
const ytcommentCommand = require('./commands/ytcomment');
const comradeCommand = require('./commands/comrade');
const gayCommand = require('./commands/gay');
const jailCommand = require('./commands/jail');
const glassCommand = require('./commands/glass');
const passedCommand = require('./commands/passed');
const triggeredCommand = require('./commands/triggered');
const oogwayCommand = require('./commands/oogway');
const loliceCommand = require('./commands/lolice');
const lgbtCommand = require('./commands/lgbt');
const heartCommand = require('./commands/heart');
const hornyCommand = require('./commands/horny');
const circleCommand = require('./commands/circle');
const verifyjoinCommand = require('./commands/verifyjoin');
const joinchannelCommand = require('./commands/joinchannel');
const statsCommand = require('./commands/stats');
const itsSoStupidCommand = require('./commands/its-so-stupid');
const gitCommand = require('./commands/git');
const scCommand = require('./commands/sc');
const scriptCommand = require('./commands/script');
const { blocklistCommand, isBlocked } = require('./commands/blocklist');
const rebootCommand = require('./commands/reboot');
const bugCommand = require('./commands/bug');
const apkCommand = require('./commands/apk');
const audioeditCommand = require('./commands/audioedit');
const downloadCommand = require('./commands/download');
const dlCommand = require('./commands/dl');

// Global settings
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s";
global.ytch = "https://youtube.com/@eliahhango";

// Add this near the top of main.js with other global configurations
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

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        if (type !== 'notify') return;

        const message = messages[0];
        if (!message?.message) return;

        // Handle autoread functionality
        await handleAutoread(sock, message);
        
        // Handle automation features
        await handleAutoReact(sock, message);
        await handleAutoBlueTick(sock, message);

        // Store message for antidelete feature
        if (message.message) {
            storeMessage(sock, message);
        }

        // Handle message revocation
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);

        // Handle button responses
        if (message.message?.buttonsResponseMessage) {
            const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
            const chatId = message.key.remoteJid;
            
            if (buttonId === 'channel') {
                await sock.sendMessage(chatId, { 
                    text: '📢 *Join our Channel:*\nhttps://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s' 
                }, { quoted: message });
                return;
            } else if (buttonId === 'owner') {
                const ownerCommand = require('./commands/owner');
                await ownerCommand(sock, chatId);
                return;
            } else if (buttonId === 'support') {
                await sock.sendMessage(chatId, { 
                    text: `🔗 *Support*\n\nhttps://chat.whatsapp.com/GA4WrOFythU6g3BFVubYM7?mode=wwt` 
                }, { quoted: message });
                return;
            }
        }

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            message.message?.buttonsResponseMessage?.selectedButtonId?.trim() ||
            ''
        ).toLowerCase().replace(/\.\s+/g, '.').trim();

        // Preserve raw message for commands like .tag that need original casing
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        // Only log command usage
        if (userMessage.startsWith('.')) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${userMessage}`);
        }
        // Read bot mode once; don't early-return so moderation can still run in private mode
        let isPublic = true;
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
        } catch (error) {
            console.error('Error checking access mode:', error);
            // default isPublic=true on error
        }
        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;
        // Check if user is banned (skip ban check for unban command)
        if (isBanned(senderId) && !userMessage.startsWith('.unban')) {
            // Only respond occasionally to avoid spam
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: '❌ You are banned from using the bot. Contact an admin to get unbanned.',
                    ...channelInfo
                });
            }
            return;
        }

        // First check if it's a game move
        if (/^[1-9]$/.test(userMessage) || userMessage.toLowerCase() === 'surrender') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        /*  // Basic message response in private chat
          if (!isGroup && (userMessage === 'hi' || userMessage === 'hello' || userMessage === 'bot' || userMessage === 'hlo' || userMessage === 'hey' || userMessage === 'bro')) {
              await sock.sendMessage(chatId, {
                  text: 'Hi, How can I help you?\nYou can use .menu for more info and commands.',
                  ...channelInfo
              });
              return;
          } */

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // Check if user was AFK and remove AFK status
        const afkData = isUserAfk(senderId);
        if (afkData) {
            removeAfk(senderId);
            const afkDuration = Math.floor((Date.now() - afkData.timestamp) / 1000);
            const minutes = Math.floor(afkDuration / 60);
            const seconds = afkDuration % 60;
            await sock.sendMessage(chatId, {
                text: `👋 Welcome back! You were AFK for ${minutes}m ${seconds}s\n📝 Reason: ${afkData.reason}`,
                ...channelInfo
            });
        }

        // Check for AFK mentions
        if (isGroup && message.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
            const mentionedJids = message.message.extendedTextMessage.contextInfo.mentionedJid;
            for (const mentionedJid of mentionedJids) {
                const mentionedAfk = isUserAfk(mentionedJid);
                if (mentionedAfk) {
                    const afkDuration = Math.floor((Date.now() - mentionedAfk.timestamp) / 1000);
                    const minutes = Math.floor(afkDuration / 60);
                    const seconds = afkDuration % 60;
                    const mentionedName = await sock.getName(mentionedJid);
                    await sock.sendMessage(chatId, {
                        text: `⏸️ *${mentionedName}* is AFK\n📝 Reason: ${mentionedAfk.reason}\n⏰ Duration: ${minutes}m ${seconds}s`,
                        mentions: [mentionedJid],
                        ...channelInfo
                    });
                }
            }
        }

        // Check for bad words and antilink FIRST, before ANY other processing
        // Always run moderation in groups, regardless of mode
        if (isGroup) {
            if (userMessage) {
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            // Antilink checks message text internally, so run it even if userMessage is empty
            await Antilink(message, sock);
        }

        // PM blocker: block non-owner DMs when enabled (do not ban)
        if (!isGroup && !message.key.fromMe && !senderIsSudo) {
            try {
                const pmState = readPmBlockerState();
                if (pmState.enabled) {
                    // Inform user, delay, then block without banning globally
                    await sock.sendMessage(chatId, { text: pmState.message || 'Private messages are blocked. Please contact the owner in groups only.' });
                    await new Promise(r => setTimeout(r, 1500));
                    try { await sock.updateBlockStatus(chatId, 'block'); } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        // Channel enforcement: Check if user has joined channel (skip for owner/sudo)
        if (!senderIsOwnerOrSudo && !message.key.fromMe) {
            try {
                const userName = await sock.getName(senderId).catch(() => 'User');
                const isMember = isMarkedAsMember(senderId);
                
                // If not a member, check and enforce channel join
                if (!isMember) {
                    await checkChannelMembership(sock, senderId, userName, userMessage);
                    
                    // If user is trying to use a command, block it until they join
                    if (userMessage.startsWith('.')) {
                        // Allow help and channel-related commands
                        const allowedCommands = ['.help', '.menu', '.channel', '.joinchannel', '.verifyjoin', '.bot', '.list'];
                        const isAllowed = allowedCommands.some(cmd => {
                            const lowerMsg = userMessage.toLowerCase();
                            const lowerCmd = cmd.toLowerCase();
                            return lowerMsg === lowerCmd || lowerMsg.startsWith(lowerCmd + ' ');
                        });
                        
                        if (!isAllowed) {
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
                            
                            await sock.sendMessage(chatId, {
                                text: `⚠️ *Channel Join Required*\n\n` +
                                    `You must join our WhatsApp Channel to use bot commands.\n\n` +
                                    `🔗 *Channel:* ${global.channelLink || 'https://whatsapp.com/channel/0029VaeEYF0BvvsZpaTPfL2s'}\n\n` +
                                    `After joining, use *.verifyjoin* to verify your membership.\n\n` +
                                    `*Powered by EliTechWiz*`,
                                ...channelInfo
                            }, { quoted: message });
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error('Channel enforcement error:', error);
                // Don't block if there's an error, allow command to proceed
            }
        }

        // Then check for command prefix
        if (!userMessage.startsWith('.')) {
            // Show typing indicator if autotyping is enabled
            await handleAutotypingForMessage(sock, chatId, userMessage);

            if (isGroup) {
                // Always run moderation features (antitag) regardless of mode
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);
                
                // Only run chatbot in public mode or for owner/sudo
                if (isPublic || isOwnerOrSudoCheck) {
                    await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                }
            }
            return;
        }
        // In private mode, only owner/sudo can run commands
        if (!isPublic && !isOwnerOrSudoCheck) {
            return;
        }

        // Rate limiting check (skip for owner/sudo)
        if (!senderIsOwnerOrSudo && userMessage.startsWith('.')) {
            const commandName = userMessage.split(' ')[0].toLowerCase();
            if (isRateLimited(senderId, commandName)) {
                const remaining = getRemainingRequests(senderId, commandName);
                await sock.sendMessage(chatId, {
                    text: `⏰ *Rate Limit Exceeded*\n\n` +
                        `You're using commands too quickly. Please wait a moment before trying again.\n\n` +
                        `*Remaining requests:* ${remaining}\n\n` +
                        `*Powered by EliTechWiz*`,
                    ...channelInfo
                }, { quoted: message });
                return;
            }
        }

        // List of admin commands
        const adminCommands = ['.mute', '.unmute', '.ban', '.unban', '.promote', '.demote', '.kick', '.tagall', '.tagnotadmin', '.hidetag', '.antilink', '.antitag', '.setgdesc', '.setgname', '.setgpp'];
        const isAdminCommand = adminCommands.some(cmd => userMessage.startsWith(cmd));

        // List of owner commands
        const ownerCommands = ['.mode', '.autostatus', '.antidelete', '.cleartmp', '.setpp', '.clearsession', '.areact', '.autoreact', '.autotyping', '.autoread', '.pmblocker'];
        const isOwnerCommand = ownerCommands.some(cmd => userMessage.startsWith(cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status only for admin commands in groups
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text: 'Please make the bot an admin to use admin commands.', ...channelInfo }, { quoted: message });
                return;
            }

            if (
                userMessage.startsWith('.mute') ||
                userMessage === '.unmute' ||
                userMessage.startsWith('.ban') ||
                userMessage.startsWith('.unban') ||
                userMessage.startsWith('.promote') ||
                userMessage.startsWith('.demote')
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, {
                        text: 'Sorry, only group admins can use this command.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
            }
        }

        // Check owner status for owner commands
        if (isOwnerCommand) {
            if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                await sock.sendMessage(chatId, { text: '❌ This command is only available for the owner or sudo!' }, { quoted: message });
                return;
            }
        }

        // Command handlers - Execute commands immediately without waiting for typing indicator
        // We'll show typing indicator after command execution if needed
        let commandExecuted = false;

        switch (true) {
            case userMessage === '.simage': {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please reply to a sticker with the .simage command to convert it.', ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            }
            case userMessage.startsWith('.kick'):
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                break;
            case userMessage.startsWith('.mute'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const muteArg = parts[1];
                    const muteDuration = muteArg !== undefined ? parseInt(muteArg, 10) : undefined;
                    if (muteArg !== undefined && (isNaN(muteDuration) || muteDuration <= 0)) {
                        await sock.sendMessage(chatId, { text: 'Please provide a valid number of minutes or use .mute with no number to mute immediately.', ...channelInfo }, { quoted: message });
                    } else {
                        await muteCommand(sock, chatId, senderId, message, muteDuration);
                    }
                }
                break;
            case userMessage === '.unmute':
                await unmuteCommand(sock, chatId, senderId);
                break;
            case userMessage.startsWith('.ban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .ban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await banCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.unban'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'Only owner/sudo can use .unban in private chat.' }, { quoted: message });
                        break;
                    }
                }
                await unbanCommand(sock, chatId, message);
                break;
            case userMessage === '.help' || userMessage === '.menu' || userMessage === '.bot' || userMessage === '.list':
                await helpCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage === '.sticker' || userMessage === '.s':
                await stickerCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.warnings'):
                const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warningsCommand(sock, chatId, mentionedJidListWarnings);
                break;
            case userMessage.startsWith('.warn'):
                const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                break;
            case userMessage.startsWith('.tts'):
                const text = userMessage.slice(4).trim();
                await ttsCommand(sock, chatId, text, message);
                break;
            case userMessage.startsWith('.delete') || userMessage.startsWith('.del'):
                await deleteCommand(sock, chatId, message, senderId);
                break;
            case userMessage.startsWith('.attp'):
                await attpCommand(sock, chatId, message);
                break;

            case userMessage === '.settings':
                await settingsCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.mode'):
                // Check if sender is the owner
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'Only bot owner can use this command!', ...channelInfo }, { quoted: message });
                    return;
                }
                // Read current data first
                let data;
                try {
                    data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
                } catch (error) {
                    console.error('Error reading access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to read bot mode status', ...channelInfo });
                    return;
                }

                const action = userMessage.split(' ')[1]?.toLowerCase();
                // If no argument provided, show current status
                if (!action) {
                    const currentMode = data.isPublic ? 'public' : 'private';
                    await sock.sendMessage(chatId, {
                        text: `Current bot mode: *${currentMode}*\n\nUsage: .mode public/private\n\nExample:\n.mode public - Allow everyone to use bot\n.mode private - Restrict to owner only`,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                if (action !== 'public' && action !== 'private') {
                    await sock.sendMessage(chatId, {
                        text: 'Usage: .mode public/private\n\nExample:\n.mode public - Allow everyone to use bot\n.mode private - Restrict to owner only',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                try {
                    // Update access mode
                    data.isPublic = action === 'public';

                    // Save updated data
                    fs.writeFileSync('./data/messageCount.json', JSON.stringify(data, null, 2));

                    await sock.sendMessage(chatId, { text: `Bot is now in *${action}* mode`, ...channelInfo });
                } catch (error) {
                    console.error('Error updating access mode:', error);
                    await sock.sendMessage(chatId, { text: 'Failed to update bot access mode', ...channelInfo });
                }
                break;
            case userMessage.startsWith('.anticall'):
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'Only owner/sudo can use anticall.' }, { quoted: message });
                    break;
                }
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await anticallCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.pmblocker'):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await pmblockerCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;
            case userMessage === '.owner':
                await ownerCommand(sock, chatId);
                break;
             case userMessage === '.tagall':
                await tagAllCommand(sock, chatId, senderId, message);
                break;
            case userMessage === '.tagnotadmin':
                await tagNotAdminCommand(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith('.hidetag'):
                {
                    const messageText = rawText.slice(8).trim();
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                break;
            case userMessage.startsWith('.tag'):
                const messageText = rawText.slice(4).trim();  // use rawText here, not userMessage
                const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                await tagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                break;
            case userMessage.startsWith('.antilink'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage.startsWith('.antitag'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'This command can only be used in groups.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'Please make the bot an admin first.',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntitagCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage === '.meme':
                await memeCommand(sock, chatId, message);
                break;
            case userMessage === '.joke':
                await jokeCommand(sock, chatId, message);
                break;
            case userMessage === '.quote':
                await quoteCommand(sock, chatId, message);
                break;
            case userMessage === '.fact':
                await factCommand(sock, chatId, message, message);
                break;
            case userMessage.startsWith('.weather'):
                const city = userMessage.slice(9).trim();
                if (city) {
                    await weatherCommand(sock, chatId, message, city);
                } else {
                    await sock.sendMessage(chatId, { text: 'Please specify a city, e.g., .weather London', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === '.news':
                await newsCommand(sock, chatId);
                break;
            case userMessage.startsWith('.ttt') || userMessage.startsWith('.tictactoe'):
                const tttText = userMessage.split(' ').slice(1).join(' ');
                await tictactoeCommand(sock, chatId, senderId, tttText);
                break;
            case userMessage.startsWith('.move'):
                const position = parseInt(userMessage.split(' ')[1]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: 'Please provide a valid position number for Tic-Tac-Toe move.', ...channelInfo }, { quoted: message });
                } else {
                    tictactoeMove(sock, chatId, senderId, position);
                }
                break;
            case userMessage === '.topmembers':
                topMembers(sock, chatId, isGroup);
                break;
            case userMessage.startsWith('.hangman'):
                startHangman(sock, chatId);
                break;
            case userMessage.startsWith('.guess'):
                const guessedLetter = userMessage.split(' ')[1];
                if (guessedLetter) {
                    guessLetter(sock, chatId, guessedLetter);
                } else {
                    sock.sendMessage(chatId, { text: 'Please guess a letter using .guess <letter>', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.trivia'):
                startTrivia(sock, chatId);
                break;
            case userMessage.startsWith('.answer'):
                const answer = userMessage.split(' ').slice(1).join(' ');
                if (answer) {
                    answerTrivia(sock, chatId, answer);
                } else {
                    sock.sendMessage(chatId, { text: 'Please provide an answer using .answer <answer>', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.compliment'):
                await complimentCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.insult'):
                await insultCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.8ball'):
                const question = userMessage.split(' ').slice(1).join(' ');
                await eightBallCommand(sock, chatId, question);
                break;
            case userMessage.startsWith('.lyrics'):
                const songTitle = userMessage.split(' ').slice(1).join(' ');
                await lyricsCommand(sock, chatId, songTitle, message);
                break;
            case userMessage.startsWith('.simp'):
                const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await simpCommand(sock, chatId, quotedMsg, mentionedJid, senderId);
                break;
            case userMessage.startsWith('.stupid') || userMessage.startsWith('.itssostupid') || userMessage.startsWith('.iss'):
                const stupidQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const stupidMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const stupidArgs = userMessage.split(' ').slice(1);
                await stupidCommand(sock, chatId, stupidQuotedMsg, stupidMentionedJid, senderId, stupidArgs);
                break;
            case userMessage === '.dare':
                await dareCommand(sock, chatId, message);
                break;
            case userMessage === '.truth':
                await truthCommand(sock, chatId, message);
                break;
            case userMessage === '.clear':
                if (isGroup) await clearCommand(sock, chatId);
                break;
            case userMessage.startsWith('.promote'):
                const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                break;
            case userMessage.startsWith('.demote'):
                const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                break;
            case userMessage === '.ping':
                await pingCommand(sock, chatId, message);
                break;
            case userMessage === '.alive':
                await aliveCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.mention '):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await mentionToggleCommand(sock, chatId, message, args, isOwner);
                }
                break;
            case userMessage === '.setmention':
                {
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await setMentionCommand(sock, chatId, message, isOwner);
                }
                break;
            case userMessage.startsWith('.blur'):
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await blurCommand(sock, chatId, message, quotedMessage);
                break;
            case userMessage.startsWith('.welcome'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await welcomeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage.startsWith('.goodbye'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await goodbyeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'Sorry, only group admins can use this command.', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === '.git':
            case userMessage === '.github':
            case userMessage === '.sc':
            case userMessage === '.script':
            case userMessage === '.repo':
                await githubCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.antibadword'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                const adminStatus = await isAdmin(sock, chatId, senderId);
                isSenderAdmin = adminStatus.isSenderAdmin;
                isBotAdmin = adminStatus.isBotAdmin;

                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, { text: '*Bot must be admin to use this feature*', ...channelInfo }, { quoted: message });
                    return;
                }

                await antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin);
                break;
            case userMessage.startsWith('.chatbot'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups.', ...channelInfo }, { quoted: message });
                    return;
                }

                // Check if sender is admin or bot owner
                const chatbotAdminStatus = await isAdmin(sock, chatId, senderId);
                if (!chatbotAdminStatus.isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: '*Only admins or bot owner can use this command*', ...channelInfo }, { quoted: message });
                    return;
                }

                const match = userMessage.slice(8).trim();
                await handleChatbotCommand(sock, chatId, message, match);
                break;
            case userMessage.startsWith('.take') || userMessage.startsWith('.steal'):
                {
                    const isSteal = userMessage.startsWith('.steal');
                    const sliceLen = isSteal ? 6 : 5; // '.steal' vs '.take'
                    const takeArgs = rawText.slice(sliceLen).trim().split(' ');
                    await takeCommand(sock, chatId, message, takeArgs);
                }
                break;
            case userMessage === '.flirt':
                await flirtCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.character'):
                await characterCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.waste'):
                await wastedCommand(sock, chatId, message);
                break;
            case userMessage === '.ship':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await shipCommand(sock, chatId, message);
                break;
            case userMessage === '.groupinfo' || userMessage === '.infogp' || userMessage === '.infogrupo':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await groupInfoCommand(sock, chatId, message);
                break;
            case userMessage === '.resetlink' || userMessage === '.revoke' || userMessage === '.anularlink':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await resetlinkCommand(sock, chatId, senderId);
                break;
            case userMessage === '.staff' || userMessage === '.admins' || userMessage === '.listadmin':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'This command can only be used in groups!', ...channelInfo }, { quoted: message });
                    return;
                }
                await staffCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tourl') || userMessage.startsWith('.url'):
                await urlCommand(sock, chatId, message);
                break;
            case userMessage === '.joinchannel' || userMessage === '.channel' || userMessage === '.join':
                await joinchannelCommand(sock, chatId, message, senderId);
                commandExecuted = true;
                break;
            case userMessage === '.verifyjoin' || userMessage === '.verify':
                await verifyjoinCommand(sock, chatId, message, senderId);
                commandExecuted = true;
                break;
            case userMessage === '.stats' || userMessage === '.statistics':
                {
                    const args = userMessage.split(' ').slice(1);
                    await statsCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;
            case userMessage.startsWith('.emojimix') || userMessage.startsWith('.emix'):
                await emojimixCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tg') || userMessage.startsWith('.stickertelegram') || userMessage.startsWith('.tgsticker') || userMessage.startsWith('.telesticker'):
                await stickerTelegramCommand(sock, chatId, message);
                break;

            case userMessage === '.vv':
                await viewOnceCommand(sock, chatId, message);
                break;
            case userMessage === '.clearsession' || userMessage === '.clearsesi':
                await clearSessionCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.autostatus'):
                const autoStatusArgs = userMessage.split(' ').slice(1);
                await autoStatusCommand(sock, chatId, message, autoStatusArgs);
                break;
            case userMessage.startsWith('.simp'):
                await simpCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.metallic'):
                await textmakerCommand(sock, chatId, message, userMessage, 'metallic');
                break;
            case userMessage.startsWith('.ice'):
                await textmakerCommand(sock, chatId, message, userMessage, 'ice');
                break;
            case userMessage.startsWith('.snow'):
                await textmakerCommand(sock, chatId, message, userMessage, 'snow');
                break;
            case userMessage.startsWith('.impressive'):
                await textmakerCommand(sock, chatId, message, userMessage, 'impressive');
                break;
            case userMessage.startsWith('.matrix'):
                await textmakerCommand(sock, chatId, message, userMessage, 'matrix');
                break;
            case userMessage.startsWith('.light'):
                await textmakerCommand(sock, chatId, message, userMessage, 'light');
                break;
            case userMessage.startsWith('.neon'):
                await textmakerCommand(sock, chatId, message, userMessage, 'neon');
                break;
            case userMessage.startsWith('.devil'):
                await textmakerCommand(sock, chatId, message, userMessage, 'devil');
                break;
            case userMessage.startsWith('.purple'):
                await textmakerCommand(sock, chatId, message, userMessage, 'purple');
                break;
            case userMessage.startsWith('.thunder'):
                await textmakerCommand(sock, chatId, message, userMessage, 'thunder');
                break;
            case userMessage.startsWith('.leaves'):
                await textmakerCommand(sock, chatId, message, userMessage, 'leaves');
                break;
            case userMessage.startsWith('.1917'):
                await textmakerCommand(sock, chatId, message, userMessage, '1917');
                break;
            case userMessage.startsWith('.arena'):
                await textmakerCommand(sock, chatId, message, userMessage, 'arena');
                break;
            case userMessage.startsWith('.hacker'):
                await textmakerCommand(sock, chatId, message, userMessage, 'hacker');
                break;
            case userMessage.startsWith('.sand'):
                await textmakerCommand(sock, chatId, message, userMessage, 'sand');
                break;
            case userMessage.startsWith('.blackpink'):
                await textmakerCommand(sock, chatId, message, userMessage, 'blackpink');
                break;
            case userMessage.startsWith('.glitch'):
                await textmakerCommand(sock, chatId, message, userMessage, 'glitch');
                break;
            case userMessage.startsWith('.fire'):
                await textmakerCommand(sock, chatId, message, userMessage, 'fire');
                break;
            case userMessage.startsWith('.antidelete'):
                const antideleteMatch = userMessage.slice(11).trim();
                await handleAntideleteCommand(sock, chatId, message, antideleteMatch);
                break;
            case userMessage === '.surrender':
                // Handle surrender command for tictactoe game
                await handleTicTacToeMove(sock, chatId, senderId, 'surrender');
                break;
            case userMessage === '.cleartmp':
                await clearTmpCommand(sock, chatId, message);
                break;
            case userMessage === '.setpp':
                await setProfilePicture(sock, chatId, message);
                break;
            case userMessage.startsWith('.setgdesc'):
                {
                    const text = rawText.slice(9).trim();
                    await setGroupDescription(sock, chatId, senderId, text, message);
                }
                break;
            case userMessage.startsWith('.setgname'):
                {
                    const text = rawText.slice(9).trim();
                    await setGroupName(sock, chatId, senderId, text, message);
                }
                break;
            case userMessage.startsWith('.setgpp'):
                await setGroupPhoto(sock, chatId, senderId, message);
                break;
            case userMessage.startsWith('.instagram') || userMessage.startsWith('.insta') || (userMessage === '.ig' || userMessage.startsWith('.ig ')):
                await instagramCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.igsc'):
                await igsCommand(sock, chatId, message, true);
                break;
            case userMessage.startsWith('.igs'):
                await igsCommand(sock, chatId, message, false);
                break;
            case userMessage.startsWith('.fb') || userMessage.startsWith('.facebook'):
                await facebookCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.music'):
                await playCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.spotify'):
                await spotifyCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.play') || userMessage.startsWith('.mp3') || userMessage.startsWith('.ytmp3') || userMessage.startsWith('.song'):
                await songCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.video') || userMessage.startsWith('.ytmp4'):
                await videoCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.tiktok') || userMessage.startsWith('.tt'):
                await tiktokCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.gpt') || userMessage.startsWith('.gemini'):
                await aiCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.translate') || userMessage.startsWith('.trt'):
                const commandLength = userMessage.startsWith('.translate') ? 10 : 4;
                await handleTranslateCommand(sock, chatId, message, userMessage.slice(commandLength));
                return;
            case userMessage.startsWith('.ss') || userMessage.startsWith('.ssweb') || userMessage.startsWith('.screenshot'):
                const ssCommandLength = userMessage.startsWith('.screenshot') ? 11 : (userMessage.startsWith('.ssweb') ? 6 : 3);
                await handleSsCommand(sock, chatId, message, userMessage.slice(ssCommandLength).trim());
                break;
            case userMessage.startsWith('.areact') || userMessage.startsWith('.autoreact') || userMessage.startsWith('.autoreaction'):
                await handleAreactCommand(sock, chatId, message, isOwnerOrSudoCheck);
                break;
            case userMessage.startsWith('.sudo'):
                await sudoCommand(sock, chatId, message);
                break;
            case userMessage === '.goodnight' || userMessage === '.lovenight' || userMessage === '.gn':
                await goodnightCommand(sock, chatId, message);
                break;
            case userMessage === '.shayari' || userMessage === '.shayri':
                await shayariCommand(sock, chatId, message);
                break;
            case userMessage === '.roseday':
                await rosedayCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.imagine') || userMessage.startsWith('.flux') || userMessage.startsWith('.dalle'): await imagineCommand(sock, chatId, message);
                break;
            case userMessage === '.jid': await groupJidCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.autotyping'):
                await autotypingCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.autoread'):
                await autoreadCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.heart'):
                await handleHeart(sock, chatId, message);
                break;
            case userMessage.startsWith('.horny'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['horny', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.circle'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['circle', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lgbt'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lgbt', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lolice'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lolice', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.simpcard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['simpcard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.tonikawa'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tonikawa', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.its-so-stupid'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['its-so-stupid', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.namecard'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['namecard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case userMessage.startsWith('.oogway2'):
            case userMessage.startsWith('.oogway'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.startsWith('.oogway2') ? 'oogway2' : 'oogway';
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.tweet'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tweet', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ytcomment'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['youtube-comment', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.comrade'):
            case userMessage.startsWith('.gay'):
            case userMessage.startsWith('.glass'):
            case userMessage.startsWith('.jail'):
            case userMessage.startsWith('.passed'):
            case userMessage.startsWith('.triggered'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = userMessage.slice(1).split(/\s+/)[0];
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.animu'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await animeCommand(sock, chatId, message, args);
                }
                break;
            // animu aliases
            case userMessage.startsWith('.nom'):
            case userMessage.startsWith('.poke'):
            case userMessage.startsWith('.cry'):
            case userMessage.startsWith('.kiss'):
            case userMessage.startsWith('.pat'):
            case userMessage.startsWith('.hug'):
            case userMessage.startsWith('.wink'):
            case userMessage.startsWith('.facepalm'):
            case userMessage.startsWith('.face-palm'):
            case userMessage.startsWith('.animuquote'):
            case userMessage.startsWith('.quote'):
            case userMessage.startsWith('.loli'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    let sub = parts[0].slice(1);
                    if (sub === 'facepalm') sub = 'face-palm';
                    if (sub === 'quote' || sub === 'animuquote') sub = 'quote';
                    await animeCommand(sock, chatId, message, [sub]);
                }
                break;
            case userMessage === '.crop':
                await stickercropCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case userMessage.startsWith('.pies'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await piesCommand(sock, chatId, message, args);
                    commandExecuted = true;
                }
                break;
            case userMessage === '.china':
                await piesAlias(sock, chatId, message, 'china');
                commandExecuted = true;
                break;
            case userMessage === '.indonesia':
                await piesAlias(sock, chatId, message, 'indonesia');
                commandExecuted = true;
                break;
            case userMessage === '.japan':
                await piesAlias(sock, chatId, message, 'japan');
                commandExecuted = true;
                break;
            case userMessage === '.korea':
                await piesAlias(sock, chatId, message, 'korea');
                commandExecuted = true;
                break;
            case userMessage === '.hijab':
                await piesAlias(sock, chatId, message, 'hijab');
                commandExecuted = true;
                break;
            case userMessage.startsWith('.update'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const zipArg = parts[1] && parts[1].startsWith('http') ? parts[1] : '';
                    await updateCommand(sock, chatId, message, zipArg);
                }
                commandExecuted = true;
                break;
            case userMessage.startsWith('.removebg') || userMessage.startsWith('.rmbg') || userMessage.startsWith('.nobg'):
                await removebgCommand.exec(sock, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith('.remini') || userMessage.startsWith('.enhance') || userMessage.startsWith('.upscale'):
                await reminiCommand(sock, chatId, message, userMessage.split(' ').slice(1));
                break;
            case userMessage.startsWith('.sora'):
                await soraCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.bible'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await bibleCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.quran'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await quranCommand(sock, chatId, message, args);
                }
                break;
            case userMessage === '.asmaulhusna':
                await asmaulhusnaCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.movie'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await movieCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.define'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await defineCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.poll'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await pollCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.afk'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await afkCommand(sock, chatId, message, args, senderId);
                }
                break;
            case userMessage === '.cat':
                await catCommand(sock, chatId, message);
                break;
            case userMessage === '.dog':
                await dogCommand(sock, chatId, message);
                break;
            case userMessage === '.uptime':
                await uptimeCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.wallpaper'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await wallpaperCommand(sock, chatId, message, args);
                }
                break;
            case userMessage === '.cricket':
                await cricketCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.pastebin'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await pastebinCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.whois'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await whoisCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.short'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await shortCommand(sock, chatId, message, args);
                }
                break;
            case userMessage === '.rank':
                await rankCommand(sock, chatId, message, senderId, isGroup);
                break;
            case userMessage === '.system':
                await systemCommand(sock, chatId, message);
                break;
            case userMessage.startsWith('.math'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await mathCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ytsearch'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await ytsearchCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.logohacker'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await logohackerCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.logonaruto'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await logonarutoCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.logodragonball'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await logodragonballCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.humidity'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await humidityCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.forward'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await forwardCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.fake'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await fakeCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.unicode'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await unicodeCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.vcf'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await vcfCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.youtube'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await youtubeCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.base64'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await base64Command(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.qrcode'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await qrcodeCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.currency'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await currencyCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ip'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await ipCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.color'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await colorCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.random'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await randomCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.coin'):
                {
                    await coinCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.dice'):
                {
                    await diceCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.age'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await ageCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.timer'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await timerCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.remind'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await remindCommand(sock, chatId, message, args, senderId);
                }
                break;
            case userMessage.startsWith('.notes'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await notesCommand(sock, chatId, message, args, senderId);
                }
                break;
            case userMessage.startsWith('.google'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await googleCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.imdb'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await imdbCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.animeinfo'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await animeinfoCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.wanews'):
                {
                    await wanewsCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.iosnews'):
                {
                    await iosnewsCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.repo'):
                {
                    await repoCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.say'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await sayCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.dit'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await ditCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.itta'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await ittaCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.scan'):
                {
                    await scanCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.riddle'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await riddleCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.hash'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await hashCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.password'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await passwordCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.wordcount'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await wordcountCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.reverse'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await reverseCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.uppercase'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await uppercaseCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lowercase'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await lowercaseCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.capitalize'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await capitalizeCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.emojify'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await emojifyCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.binary'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await binaryCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.hex'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await hexCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ascii'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await asciiCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.joke2'):
                {
                    await joke2Command(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.meme2'):
                {
                    await meme2Command(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.advice'):
                {
                    await adviceCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.chucknorris'):
                {
                    await chucknorrisCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.dadjoke'):
                {
                    await dadjokeCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.trivia2'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await trivia2Command(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.quote2'):
                {
                    await quote2Command(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.fact2'):
                {
                    await fact2Command(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.weather2'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await weather2Command(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.urban'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await urbanCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.dictionary'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await dictionaryCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.synonym'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await synonymCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.antonym'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await antonymCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.rhyme'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await rhymeCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.spellcheck'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await spellcheckCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.wordinfo'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await wordinfoCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.qrcode2'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await qrcode2Command(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.color2'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await color2Command(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.randomcolor'):
                {
                    await randomcolorCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.unit'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await unitCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.timezone'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await timezoneCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.calendar'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await calendarCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.countdown'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await countdownCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ipinfo'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await ipinfoCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.domain'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await domainCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ping2'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await ping2Command(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.urlshort'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await urlshortCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.urlexpand'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await urlexpandCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.urlstatus'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await urlstatusCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.randomuser'):
                {
                    await randomuserCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.covid'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await covidCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.crypto'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await cryptoCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.stock'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await stockCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.exchange'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await exchangeCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.nasa'):
                {
                    await nasaCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.iss'):
                {
                    await issCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.horoscope'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await horoscopeCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.quote3'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await quote3Command(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lyrics2'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await lyrics2Command(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.spotify2'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await spotify2Command(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ytinfo'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await ytinfoCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ytchannel'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await ytchannelCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ytplaylist'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await ytplaylistCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.reminder2'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await reminder2Command(sock, chatId, message, args, senderId);
                }
                break;
            case userMessage.startsWith('.todo'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await todoCommand(sock, chatId, message, args, senderId);
                }
                break;
            case userMessage.startsWith('.calc2'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await calc2Command(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.percentage'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await percentageCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.percentageof'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await percentageofCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.autoreact'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await autoreactCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.autostatusview'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await autostatusviewCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.autostatuslike'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await autostatuslikeCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.autoblue'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await autoblueCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.neko'):
                {
                    await nekoCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.waifu'):
                {
                    await waifuCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.kiss'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await kissCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.hug'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await hugCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.pat'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await patCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.slap'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await slapCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.cry'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await cryCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.wink'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await winkCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.poke'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await pokeCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.facepalm'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await facepalmCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.smile'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await smileCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.highfive'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await highfiveCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.cuddle'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await cuddleCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.bite'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await biteCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.nom'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await nomCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.kick2'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await kick2Command(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.bonk'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await bonkCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.loli'):
                {
                    await loliCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.ytmp4'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await ytmp4Command(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.igsc'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await igscCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.vv'):
                {
                    await vvCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.jid'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await jidCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.namecard'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await namecardCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.tweet'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await tweetCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.ytcomment'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await ytcommentCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.comrade'):
                {
                    await comradeCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.gay'):
                {
                    await gayCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.jail'):
                {
                    await jailCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.glass'):
                {
                    await glassCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.passed'):
                {
                    await passedCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.triggered'):
                {
                    await triggeredCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.oogway'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await oogwayCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.lolice'):
                {
                    await loliceCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.lgbt'):
                {
                    await lgbtCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.heart'):
                {
                    await heartCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.horny'):
                {
                    await hornyCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.circle'):
                {
                    await circleCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.its-so-stupid'):
                {
                    await itsSoStupidCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.git'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await gitCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.sc'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await scCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.script'):
                {
                    await scriptCommand(sock, chatId, message);
                }
                break;
            case userMessage.startsWith('.blocklist'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await blocklistCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.reboot'):
                {
                    await rebootCommand(sock, chatId, message, senderId);
                }
                break;
            case userMessage.startsWith('.bug'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await bugCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.apk'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await apkCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.audioedit'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await audioeditCommand(sock, chatId, message, args);
                }
                break;
            case userMessage.startsWith('.download') || userMessage.startsWith('.dl'):
                {
                    const args = userMessage.split(' ').slice(1);
                    await downloadCommand(sock, chatId, message, args);
                }
                break;
            default:
                if (isGroup) {
                    // Handle non-command group messages
                    if (userMessage) {  // Make sure there's a message
                        await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                    }
                    await handleTagDetection(sock, chatId, message, senderId);
                    await handleMentionDetection(sock, chatId, message);
                }
                commandExecuted = false;
                break;
        }

        // If a command was executed, show typing status after command execution
        if (commandExecuted !== false) {
            // Command was executed, now show typing status after command execution
            await showTypingAfterCommand(sock, chatId);
            
            // Track command usage for statistics
            if (userMessage && userMessage.startsWith('.')) {
                try {
                    const commandName = userMessage.split(' ')[0].toLowerCase();
                    trackCommand(commandName, senderId);
                } catch (error) {
                    // Silently fail stats tracking
                }
            }
        }

        // Function to handle .groupjid command
        async function groupJidCommand(sock, chatId, message) {
            const groupJid = message.key.remoteJid;

            if (!groupJid.endsWith('@g.us')) {
                return await sock.sendMessage(chatId, {
                    text: "❌ This command can only be used in a group."
                });
            }

            await sock.sendMessage(chatId, {
                text: `✅ Group JID: ${groupJid}`
            }, {
                quoted: message
            });
        }

        if (userMessage.startsWith('.')) {
            // After command is processed successfully
            await addCommandReaction(sock, message);
        }
    } catch (error) {
        console.error('❌ Error in message handler:', error.message);
        // Only try to send error message if we have a valid chatId
        if (chatId) {
            await sock.sendMessage(chatId, {
                text: '❌ Failed to process command!',
                ...channelInfo
            });
        }
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        // Check if it's a group
        if (!id.endsWith('@g.us')) return;

        // Respect bot mode: only announce promote/demote in public mode
        let isPublic = true;
        try {
            const modeData = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof modeData.isPublic === 'boolean') isPublic = modeData.isPublic;
        } catch (e) {
            // If reading fails, default to public behavior
        }

        // Handle promotion events
        if (action === 'promote') {
            if (!isPublic) return;
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }

        // Handle demotion events
        if (action === 'demote') {
            if (!isPublic) return;
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }

        // Handle join events
        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
        }

        // Handle leave events
        if (action === 'remove') {
            await handleLeaveEvent(sock, id, participants);
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}

// Instead, export the handlers along with handleMessages
module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus: async (sock, status) => {
        // Handle existing autostatus functionality
        await handleStatusUpdate(sock, status);
        
        // Handle new automation features
        await handleAutoStatusView(sock, status);
        await handleAutoStatusLike(sock, status);
    }
};