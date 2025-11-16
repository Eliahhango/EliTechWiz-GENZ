const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function helpCommand(sock, chatId, message) {
    const botName = settings.botName || 'EliTechWiz';
    const version = settings.version || '4.0.0';
    const owner = settings.botOwner || 'EliTechWiz';
    const ytChannel = global.ytch || 'https://youtube.com/@eliahhango';
    
    const helpMessage = `
╭─────────────────────────────────────────╮
│                                         │
│    ╔═══╗ ╦  ╔╦╗ ╔═╗ ╦ ╔╦╗ ╔═╗ ╦ ╔╗╔     │
│    ║ ═ ║ ║   ║  ║ ║ ║  ║║ ║ ║ ║ ║║║     │
│    ╚═══╝ ╩   ╩  ╚═╝ ╩ ╩ ╩ ╚═╝ ╩ ╝╚╝     │
│                                         │
│         ⚡ ${botName} ⚡                 │
│                                         │
│    ┌─────────────────────────────┐     │
│    │  Version: ${version.padEnd(20)}│     │
│    │  Owner: ${owner.padEnd(23)}│     │
│    │  YT: ${ytChannel.padEnd(25)}│     │
│    └─────────────────────────────┘     │
│                                         │
╰─────────────────────────────────────────╯

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎯 CORE COMMANDS                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .help / .menu - Show this menu
  • .ping - Check bot response time
  • .alive - Check if bot is online
  • .owner - Contact bot owner
  • .vv - Bot version info
  • .uptime - Bot uptime
  • .system - System information
  • .rank - Message rankings
  • .url - Bot links

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎮 FUN & ENTERTAINMENT                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .joke / .joke2 - Random jokes
  • .dadjoke - Dad jokes
  • .quote / .quote2 / .quote3 - Quotes
  • .fact / .fact2 - Random facts
  • .advice - Get advice
  • .chucknorris - Chuck Norris jokes
  • .riddle - Solve riddles
  • .trivia / .trivia2 - Trivia games
  • .truth - Truth questions
  • .dare - Dare challenges
  • .8ball <question> - Magic 8 ball
  • .compliment @user - Compliment someone
  • .insult @user - Insult someone
  • .flirt - Flirty messages
  • .shayari - Romantic shayari
  • .goodnight - Good night messages
  • .roseday - Rose day messages

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎨 ANIME & REACTIONS                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .neko - Random neko images
  • .waifu - Random waifu images
  • .loli - Random loli images
  • .kiss @user - Kiss reaction
  • .hug @user - Hug reaction
  • .pat @user - Pat reaction
  • .slap @user - Slap reaction
  • .poke @user - Poke reaction
  • .cry - Cry reaction
  • .wink - Wink reaction
  • .smile - Smile reaction
  • .facepalm - Facepalm reaction
  • .highfive @user - High five
  • .cuddle @user - Cuddle
  • .bite @user - Bite reaction
  • .nom - Nom reaction
  • .kick2 @user - Kick reaction
  • .bonk @user - Bonk reaction

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🖼️ IMAGE FILTERS & EFFECTS            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .comrade (reply image) - Comrade filter
  • .gay (reply image) - Rainbow filter
  • .jail (reply image) - Jail bars
  • .glass (reply image) - Glass effect
  • .passed (reply image) - Passed away
  • .triggered (reply image) - Triggered
  • .lolice (reply image) - Lolice filter
  • .lgbt (reply image) - LGBT filter
  • .heart (reply image) - Heart filter
  • .horny (reply image) - Horny license
  • .circle (reply image) - Circle crop
  • .its-so-stupid (reply image) - Stupid filter
  • .wasted @user - Wasted effect
  • .character @user - Character info

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📸 IMAGE & STICKER TOOLS              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .sticker (reply image) - Make sticker
  • .simage (reply sticker) - Sticker to image
  • .blur (reply image) - Blur image
  • .removebg (reply image) - Remove background
  • .remini (reply image) - Enhance image
  • .crop (reply image) - Crop image
  • .wallpaper <query> - Search wallpapers
  • .cat - Random cat image
  • .dog - Random dog image
  • .meme / .meme2 - Random memes
  • .emojimix <emoji1>+<emoji2> - Mix emojis
  • .attp <text> - Animated text sticker
  • .take <packname> - Create sticker pack

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📥 DOWNLOADERS                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .youtube <url> - Download YouTube video
  • .ytmp4 <url> - YouTube video as MP4
  • .play <song> - Play music
  • .song <song> - Download song
  • .video <song> - Download video
  • .spotify <query> - Spotify search
  • .instagram <url> - Download IG post
  • .igs <url> - Instagram story/post
  • .igsc <url> - Instagram story
  • .facebook <url> - Download FB video
  • .tiktok <url> - Download TikTok video
  • .ytsearch <query> - Search YouTube

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔤 TEXT TOOLS & CONVERTERS            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .textmaker <style> <text> - Text styles
  • .uppercase <text> - Convert to uppercase
  • .lowercase <text> - Convert to lowercase
  • .capitalize <text> - Capitalize text
  • .reverse <text> - Reverse text
  • .emojify <text> - Convert to emojis
  • .wordcount <text> - Count words/chars
  • .hash <algorithm> <text> - Generate hash
  • .base64 encode/decode <text> - Base64
  • .binary encode/decode <text> - Binary
  • .hex encode/decode <text> - Hexadecimal
  • .ascii encode/decode <text> - ASCII codes
  • .unicode <text> - Unicode conversion
  • .password [length] - Generate password

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📚 DICTIONARY & LANGUAGE              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .define <word> - Word definition
  • .dictionary <word> - Full dictionary
  • .urban <word> - Urban dictionary
  • .synonym <word> - Find synonyms
  • .antonym <word> - Find antonyms
  • .rhyme <word> - Find rhymes
  • .spellcheck <word> - Spell checker
  • .wordinfo <word> - Complete word info
  • .translate <lang> <text> - Translate
  • .trt <lang> <text> - Quick translate
  • .say <text> - Text to speech (EN)
  • .dit <text> - Text to speech (FR)
  • .itta <text> - Text to speech (JP)

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🌐 WEB & SEARCH                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .google <query> - Google search
  • .ytsearch <query> - YouTube search
  • .imdb <movie> - Movie information
  • .animeinfo - Random anime info
  • .news - Latest news
  • .wanews - WhatsApp news
  • .iosnews - iOS news
  • .ss <url> - Screenshot website
  • .urlshort <url> - Shorten URL
  • .urlexpand <url> - Expand short URL
  • .urlstatus <url> - Check URL status
  • .whois <domain> - Domain information
  • .domain <domain> - Domain details
  • .ipinfo [ip] - IP information
  • .ping2 <host> - Ping host

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💰 FINANCE & CRYPTO                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .crypto <symbol> - Crypto prices
  • .stock <symbol> - Stock prices
  • .exchange <amount> <from> <to> - Currency
  • .currency <amount> <from> <to> - Convert

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🌍 WEATHER & LOCATION                 ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .weather <city> - Weather forecast
  • .weather2 <city> - Detailed weather
  • .humidity <city> - Humidity info

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎬 ENTERTAINMENT & MEDIA              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .movie <name> - Movie information
  • .cricket - Cricket scores
  • .lyrics <song> - Song lyrics
  • .lyrics2 <song> - Alternative lyrics
  • .imdb <movie> - IMDB information
  • .animeinfo - Anime information

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📖 RELIGIOUS                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .bible <reference> - Bible verses
  • .quran <surah> - Quran verses
  • .quran <surah> <ayah> - Specific ayah
  • .asmaulhusna - Asmaul Husna

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎮 GAMES                              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .tictactoe @user - Play tic-tac-toe
  • .hangman - Play hangman
  • .trivia - Trivia game
  • .trivia2 - Advanced trivia
  • .truth - Truth questions
  • .dare - Dare challenges
  • .coin - Flip a coin
  • .dice - Roll a dice
  • .random <min> <max> - Random number

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🛠️ UTILITIES                         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .qrcode <text> - Generate QR code
  • .qrcode2 <text> - Alternative QR
  • .color <hex/rgb> - Color information
  • .color2 <hex/rgb> - Detailed color
  • .randomcolor - Random color
  • .unit <value> <from> <to> - Unit converter
  • .timezone <tz> - Timezone info
  • .calendar [date] - Show calendar
  • .countdown <date/time> - Countdown timer
  • .timer <duration> - Set timer
  • .age <birthdate> - Calculate age
  • .math <expression> - Calculator
  • .calc2 <expression> - Advanced calc
  • .percentage <value> <total> - Percentage
  • .percentageof <percent> <number> - Percent of

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📝 PRODUCTIVITY                       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .afk <reason> - Set AFK status
  • .remind <time> <message> - Set reminder
  • .reminder2 <action> - Advanced reminders
  • .todo <action> - TODO list manager
  • .notes <action> - Personal notes
  • .poll <question> / <options> - Create poll

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎭 SOCIAL MEDIA GENERATORS           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .tweet <user> | <text> - Fake tweet
  • .ytcomment <user> | <comment> - YT comment
  • .oogway <text> - Master Oogway quote
  • .namecard <name> | <number> | <email>

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔮 FUN & RANDOM                      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .horoscope <sign> - Daily horoscope
  • .randomuser - Random user generator
  • .covid [country] - COVID-19 stats
  • .nasa - NASA APOD
  • .iss - ISS location
  • .ship @user1 @user2 - Ship calculator
  • .simp @user - Simp calculator

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👮 ADMIN COMMANDS                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .ban @user - Ban user
  • .unban @user - Unban user
  • .kick @user - Kick user
  • .promote @user - Promote to admin
  • .demote @user - Remove admin
  • .mute [minutes] - Mute group
  • .unmute - Unmute group
  • .warn @user - Warn user
  • .warnings @user - Check warnings
  • .antilink - Toggle antilink
  • .antibadword - Toggle bad words
  • .antitag <on/off> - Toggle antitag
  • .tag <message> - Tag all
  • .tagall - Tag everyone
  • .hidetag <message> - Hidden tag
  • .clear - Clear chat
  • .delete / .del - Delete message
  • .setgname <name> - Change group name
  • .setgdesc <desc> - Change description
  • .setgpp (reply image) - Set group pic
  • .welcome <on/off> - Welcome message
  • .goodbye <on/off> - Goodbye message
  • .chatbot <on/off> - Toggle chatbot
  • .resetlink - Reset invite link
  • .groupinfo - Group information
  • .staff / .admins - List admins

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔒 OWNER COMMANDS                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .mode <public/private> - Bot mode
  • .settings - Bot settings
  • .update - Update bot
  • .reboot - Reboot bot
  • .clearsession - Clear session
  • .cleartmp - Clear temp files
  • .antidelete - Toggle antidelete
  • .setpp (reply image) - Set bot picture
  • .autoreact <on/off> - Auto reactions
  • .autostatus <on/off> - Auto status
  • .autostatusview <on/off> - Auto view status
  • .autostatuslike <on/off> - Auto like status
  • .autoblue <on/off> - Auto read receipts
  • .autotyping <on/off> - Auto typing
  • .autoread <on/off> - Auto read messages
  • .anticall <on/off> - Block calls
  • .pmblocker <on/off> - Block PMs
  • .mention <on/off> - Auto mention
  • .blocklist <action> - Manage blocklist
  • .bug <description> - Report bug

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🤖 AI COMMANDS                        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .gpt <question> - ChatGPT
  • .gemini <question> - Google Gemini
  • .imagine <prompt> - AI image generation
  • .flux <prompt> - Flux AI images
  • .sora <prompt> - Sora AI videos

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  💻 GITHUB & DEVELOPMENT               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .github - GitHub info
  • .git <user/repo> - Repository info
  • .sc <user/repo> - Source code info
  • .script - Script information
  • .repo - Repository links
  • .scan - Pairing & QR code
  • .stats - Bot statistics

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📊 STATISTICS & INFO                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
  • .rank - Message rankings
  • .topmembers - Top active members
  • .groupinfo - Group information
  • .jid [@user] - Get JID
  • .system - System information
  • .uptime - Bot uptime

╔═══════════════════════════════════════╗
║  📊 TOTAL COMMANDS: 262+               ║
║  ⚡ Status: Online & Ready             ║
║  🚀 More features coming soon!         ║
╚═══════════════════════════════════════╝

🔗 *Links:*
📺 YouTube: ${ytChannel}
💻 GitHub: https://github.com/Eliahhango/EliTechWiz-GENZ
📱 Channel: ${global.channelLink || 'N/A'}

*Powered by ${botName} ⚡*`;

    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        const buttons = [
            { buttonId: 'channel', buttonText: { displayText: '📢 Join Channel' }, type: 1 },
            { buttonId: 'owner', buttonText: { displayText: '👤 Contact Owner' }, type: 1 },
            { buttonId: 'github', buttonText: { displayText: '💻 GitHub' }, type: 1 }
        ];

        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
                buttons: buttons,
                headerType: 1
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { 
                text: helpMessage,
                buttons: buttons,
                headerType: 1
            }, { quoted: message });
        }
    } catch (error) {
        const { handleError } = require('../lib/errorHandler');
        await handleError(sock, chatId, message, error, 'processing');
    }
}

module.exports = helpCommand;
