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

async function vcfCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: `*📇 VCF Contact Card Command*\n\n*Usage:* .vcf <name> <number>\n\n*Example:* .vcf John Doe 1234567890`,
                ...channelInfo
            }, { quoted: message });
        }

        if (args.length < 2) {
            return await sock.sendMessage(chatId, {
                text: '❌ Please provide both name and number.\n\n*Example:* .vcf John Doe 1234567890',
                ...channelInfo
            }, { quoted: message });
        }

        const name = args.slice(0, -1).join(' ');
        const number = args[args.length - 1].replace(/[^0-9]/g, '');
        
        if (!number || number.length < 10) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid phone number. Please provide a valid number.',
                ...channelInfo
            }, { quoted: message });
        }

        // Create VCF content
        const vcfContent = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL;TYPE=CELL:${number}
END:VCARD`;

        // Save to temp file
        const tempPath = path.join(__dirname, '../temp', `contact_${Date.now()}.vcf`);
        const tempDir = path.dirname(tempPath);
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        fs.writeFileSync(tempPath, vcfContent);

        // Send as document
        const vcfBuffer = fs.readFileSync(tempPath);
        await sock.sendMessage(chatId, {
            document: vcfBuffer,
            mimetype: 'text/vcard',
            fileName: `${name.replace(/\s+/g, '_')}.vcf`,
            caption: `📇 *Contact Card*\n\n👤 *Name:* ${name}\n📱 *Number:* ${number}\n\n*Powered by EliTechWiz*`,
            ...channelInfo
        }, { quoted: message });

        // Clean up
        setTimeout(() => {
            try {
                fs.unlinkSync(tempPath);
            } catch (e) {}
        }, 5000);
    } catch (error) {
        console.error('VCF command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error creating contact card. Please try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = vcfCommand;

