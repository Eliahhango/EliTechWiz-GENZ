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

const notesPath = path.join(__dirname, '../data/notes.json');

function readNotes() {
    try {
        if (fs.existsSync(notesPath)) {
            return JSON.parse(fs.readFileSync(notesPath, 'utf8'));
        }
    } catch (error) {
        console.error('Error reading notes:', error);
    }
    return {};
}

function writeNotes(data) {
    try {
        fs.writeFileSync(notesPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing notes:', error);
    }
}

async function notesCommand(sock, chatId, message, args, senderId) {
    try {
        const action = args && args[0] ? args[0].toLowerCase() : 'list';
        const notes = readNotes();
        const userNotes = notes[senderId] || [];

        if (action === 'add' || action === 'new') {
            const noteText = args.slice(1).join(' ');
            if (!noteText) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Please provide note text.\n\n*Usage:* .notes add <text>',
                    ...channelInfo
                }, { quoted: message });
            }

            const noteId = Date.now();
            if (!notes[senderId]) notes[senderId] = [];
            notes[senderId].push({
                id: noteId,
                text: noteText,
                createdAt: Date.now()
            });
            writeNotes(notes);

            await sock.sendMessage(chatId, {
                text: `✅ *Note Added!*\n\n📝 ${noteText}`,
                ...channelInfo
            }, { quoted: message });
        } else if (action === 'list' || action === 'all') {
            if (userNotes.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: '📝 You have no notes. Use .notes add <text> to create one.',
                    ...channelInfo
                }, { quoted: message });
            }

            let text = `╔══「 📝 *YOUR NOTES* 」══╗\n\n`;
            userNotes.forEach((note, index) => {
                const date = new Date(note.createdAt).toLocaleDateString();
                text += `${index + 1}. ${note.text}\n   📅 ${date}\n\n`;
            });
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else if (action === 'delete' || action === 'del') {
            const noteIndex = parseInt(args[1]) - 1;
            if (isNaN(noteIndex) || noteIndex < 0 || noteIndex >= userNotes.length) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Invalid note number. Use .notes list to see your notes.',
                    ...channelInfo
                }, { quoted: message });
            }

            notes[senderId].splice(noteIndex, 1);
            writeNotes(notes);

            await sock.sendMessage(chatId, {
                text: `✅ Note #${noteIndex + 1} deleted.`,
                ...channelInfo
            }, { quoted: message });
        } else {
            return await sock.sendMessage(chatId, {
                text: `*📝 Notes Command*\n\n*Usage:*\n.notes add <text> - Add a note\n.notes list - List all notes\n.notes delete <number> - Delete a note\n\n*Example:*\n.notes add Buy groceries\n.notes list\n.notes delete 1`,
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Notes command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error managing notes. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = notesCommand;

