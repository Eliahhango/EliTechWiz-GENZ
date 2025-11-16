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

const activeTrivia = new Map();

async function trivia2Command(sock, chatId, message, args) {
    try {
        const chatKey = chatId;
        
        if (args && args.length > 0 && args[0].toLowerCase() === 'answer') {
            const active = activeTrivia.get(chatKey);
            if (!active) {
                return await sock.sendMessage(chatId, {
                    text: '❌ No active trivia. Use .trivia2 to get a new question.',
                    ...channelInfo
                }, { quoted: message });
            }
            
            const userAnswer = args.slice(1).join(' ').toLowerCase();
            const correctAnswer = active.correct_answer.toLowerCase();
            
            if (userAnswer === correctAnswer || userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer)) {
                activeTrivia.delete(chatKey);
                await sock.sendMessage(chatId, {
                    text: `✅ *Correct!* The answer is: *${active.correct_answer}*\n\n🎉 Well done!`,
                    ...channelInfo
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, {
                    text: `❌ Wrong answer! The correct answer is: *${active.correct_answer}*\n\nTry again with .trivia2`,
                    ...channelInfo
                }, { quoted: message });
                activeTrivia.delete(chatKey);
            }
            return;
        }
        
        const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
        
        if (response.data && response.data.results && response.data.results.length > 0) {
            const trivia = response.data.results[0];
            const allAnswers = [...trivia.incorrect_answers, trivia.correct_answer].sort(() => Math.random() - 0.5);
            
            activeTrivia.set(chatKey, {
                question: trivia.question,
                correct_answer: trivia.correct_answer,
                category: trivia.category,
                difficulty: trivia.difficulty
            });
            
            let text = `╔══「 🧠 *TRIVIA QUESTION* 」══╗\n\n`;
            text += `📚 *Category:* ${trivia.category}\n`;
            text += `⚡ *Difficulty:* ${trivia.difficulty}\n\n`;
            text += `❓ *Question:*\n${trivia.question}\n\n`;
            text += `📋 *Options:*\n`;
            allAnswers.forEach((answer, index) => {
                text += `${index + 1}. ${answer}\n`;
            });
            text += `\n*Type .trivia2 answer <your answer> to answer*\n\n`;
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;
            
            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else {
            throw new Error('No trivia received');
        }
    } catch (error) {
        console.error('Trivia2 command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error fetching trivia. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = trivia2Command;

