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

const todoFile = path.join(__dirname, '../data/todos.json');

function loadTodos() {
    try {
        if (fs.existsSync(todoFile)) {
            return JSON.parse(fs.readFileSync(todoFile, 'utf8'));
        }
    } catch (error) {
        console.error('Error loading todos:', error);
    }
    return {};
}

function saveTodos(todos) {
    try {
        const dir = path.dirname(todoFile);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(todoFile, JSON.stringify(todos, null, 2));
    } catch (error) {
        console.error('Error saving todos:', error);
    }
}

async function todoCommand(sock, chatId, message, args, senderId) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*✅ TODO Command*\n\n*Usage:*\n.todo add <task>\n.todo list\n.todo done <id>\n.todo delete <id>\n\n*Examples:*\n.todo add Buy groceries\n.todo done 1`,
                ...channelInfo
            }, { quoted: message });
        }

        const action = args[0].toLowerCase();
        const todos = loadTodos();
        const userKey = `${chatId}_${senderId}`;

        if (!todos[userKey]) {
            todos[userKey] = [];
        }

        if (action === 'add') {
            if (args.length < 2) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Usage: .todo add <task>',
                    ...channelInfo
                }, { quoted: message });
            }

            const task = args.slice(1).join(' ');
            const taskId = Date.now().toString();

            todos[userKey].push({
                id: taskId,
                task: task,
                done: false,
                created: Date.now()
            });

            saveTodos(todos);

            await sock.sendMessage(chatId, {
                text: `✅ *Task added!*\n\n📝 *Task:* ${task}\n🆔 *ID:* ${taskId}`,
                ...channelInfo
            }, { quoted: message });
        } else if (action === 'list') {
            const userTodos = todos[userKey] || [];
            if (userTodos.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: '📋 *No tasks in your TODO list*',
                    ...channelInfo
                }, { quoted: message });
            }

            let text = `╔══「 ✅ *YOUR TODOS* 」══╗\n\n`;
            userTodos.forEach((todo, index) => {
                const status = todo.done ? '✅' : '⏳';
                text += `${status} ${index + 1}. ${todo.task}\n   🆔 ${todo.id}\n\n`;
            });
            text += `╚═══════════════════╝\n*Powered by EliTechWiz*`;

            await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
        } else if (action === 'done') {
            if (args.length < 2) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Usage: .todo done <id>',
                    ...channelInfo
                }, { quoted: message });
            }

            const id = args[1];
            const task = todos[userKey].find(t => t.id === id);
            if (task) {
                task.done = true;
                saveTodos(todos);
                await sock.sendMessage(chatId, {
                    text: `✅ Task marked as done!\n\n📝 ${task.task}`,
                    ...channelInfo
                }, { quoted: message });
            } else {
                await sock.sendMessage(chatId, {
                    text: `❌ Task with ID ${id} not found`,
                    ...channelInfo
                }, { quoted: message });
            }
        } else if (action === 'delete') {
            if (args.length < 2) {
                return await sock.sendMessage(chatId, {
                    text: '❌ Usage: .todo delete <id>',
                    ...channelInfo
                }, { quoted: message });
            }

            const id = args[1];
            todos[userKey] = todos[userKey].filter(t => t.id !== id);
            saveTodos(todos);

            await sock.sendMessage(chatId, {
                text: `✅ Task ${id} deleted`,
                ...channelInfo
            }, { quoted: message });
        } else {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid action. Use: add, list, done, or delete',
                ...channelInfo
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Todo command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error managing todos. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = todoCommand;

