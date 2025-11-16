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

const riddles = [
    { question: "I can fly without wings, who am I?", answer: "The weather" },
    { question: "I'm always hungry, the more I eat, the fatter I become. Who am I?", answer: "A black hole" },
    { question: "I'm strong when I'm down, but I'm weak when I'm up. Who am I?", answer: "The number 6" },
    { question: "I can be short or long, hard or soft, I can be used by anyone, from young children to experienced musicians. Who am I?", answer: "A pencil" },
    { question: "I am the beginning of the end, the end of every place. I am the beginning of eternity, the end of time and space. Who am I?", answer: "The letter 'e'" },
    { question: "I am white when I am dirty and black when I am clean. Who am I?", answer: "A slate" },
    { question: "I'm liquid, but if you take water away from me, I become solid. Who am I?", answer: "Tea" },
    { question: "I fly without wings, I cry without eyes. Wherever I am, death always accompanies me. Who am I?", answer: "The wind" },
    { question: "I have towns, but no houses. I have mountains, but no trees. I have water, but no fish. Who am I?", answer: "A map" },
    { question: "I can be read, but you can't write about me. You always give to me, but rarely keep me. Who am I?", answer: "A borrowed book" },
    { question: "I come twice in a week, once in a year, but never in a day. Who am I?", answer: "The letter 'E'" },
    { question: "I'm hard to grasp, but you will hold me in your hand when you find me. Who am I?", answer: "Your breath" },
    { question: "The hotter I am, the colder I become. Who am I?", answer: "Coffee" },
    { question: "I am the stuff of dreams. I cover broken ideas. I change souls into wings. Who am I?", answer: "A book" },
    { question: "I can fly without having wings. I can cry without having eyes. Who am I?", answer: "A cloud" },
    { question: "I start at night and finish in the morning. Who am I?", answer: "The letter 'N'" },
    { question: "I feed on everything around me, the air, the earth and even the trees. Who am I?", answer: "A fire" }
];

const activeRiddles = new Map();

async function riddleCommand(sock, chatId, message, args) {
    try {
        const chatKey = chatId;
        
        if (args && args.length > 0 && args[0].toLowerCase() === 'answer') {
            const activeRiddle = activeRiddles.get(chatKey);
            if (!activeRiddle) {
                return await sock.sendMessage(chatId, {
                    text: '❌ No active riddle. Use .riddle to get a new one.',
                    ...channelInfo
                }, { quoted: message });
            }
            
            const userAnswer = args.slice(1).join(' ').toLowerCase();
            const correctAnswer = activeRiddle.answer.toLowerCase();
            
            if (userAnswer === correctAnswer || userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer)) {
                activeRiddles.delete(chatKey);
                await sock.sendMessage(chatId, {
                    text: `✅ *Correct!* The answer is: *${activeRiddle.answer}*\n\n🎉 Well done!`,
                    ...channelInfo
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, {
                    text: `❌ Wrong answer! Try again or use .riddle to get a new riddle.`,
                    ...channelInfo
                }, { quoted: message });
            }
            return;
        }
        
        const randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
        activeRiddles.set(chatKey, randomRiddle);
        
        const text = `╔══「 🧩 *RIDDLE* 」══╗\n\n` +
            `❓ *Question:*\n${randomRiddle.question}\n\n` +
            `💡 *Hint:* Think carefully!\n\n` +
            `*Type .riddle answer <your answer> to answer*\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;
        
        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Riddle command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error generating riddle. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = riddleCommand;

