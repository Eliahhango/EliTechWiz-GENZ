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

const conversions = {
    length: {
        m: { factor: 1, name: 'Meters' },
        km: { factor: 0.001, name: 'Kilometers' },
        cm: { factor: 100, name: 'Centimeters' },
        mm: { factor: 1000, name: 'Millimeters' },
        mi: { factor: 0.000621371, name: 'Miles' },
        ft: { factor: 3.28084, name: 'Feet' },
        in: { factor: 39.3701, name: 'Inches' },
        yd: { factor: 1.09361, name: 'Yards' }
    },
    weight: {
        kg: { factor: 1, name: 'Kilograms' },
        g: { factor: 1000, name: 'Grams' },
        lb: { factor: 2.20462, name: 'Pounds' },
        oz: { factor: 35.274, name: 'Ounces' },
        ton: { factor: 0.001, name: 'Metric Tons' }
    },
    temperature: {
        c: { name: 'Celsius' },
        f: { name: 'Fahrenheit' },
        k: { name: 'Kelvin' }
    }
};

async function unitCommand(sock, chatId, message, args) {
    try {
        if (!args || args.length < 3) {
            return await sock.sendMessage(chatId, {
                text: `*📏 Unit Converter Command*\n\n*Usage:* .unit <value> <from_unit> <to_unit>\n\n*Examples:*\n.unit 100 km mi\n.unit 50 kg lb\n.unit 25 c f`,
                ...channelInfo
            }, { quoted: message });
        }

        const value = parseFloat(args[0]);
        const fromUnit = args[1].toLowerCase();
        const toUnit = args[2].toLowerCase();

        if (isNaN(value)) {
            return await sock.sendMessage(chatId, {
                text: '❌ Invalid number. Please provide a valid number.',
                ...channelInfo
            }, { quoted: message });
        }

        let result;
        let category = '';

        if (conversions.length[fromUnit] && conversions.length[toUnit]) {
            category = 'Length';
            const fromFactor = conversions.length[fromUnit].factor;
            const toFactor = conversions.length[toUnit].factor;
            result = (value / fromFactor) * toFactor;
        } else if (conversions.weight[fromUnit] && conversions.weight[toUnit]) {
            category = 'Weight';
            const fromFactor = conversions.weight[fromUnit].factor;
            const toFactor = conversions.weight[toUnit].factor;
            result = (value / fromFactor) * toFactor;
        } else if (conversions.temperature[fromUnit] && conversions.temperature[toUnit]) {
            category = 'Temperature';
            let celsius;
            if (fromUnit === 'c') celsius = value;
            else if (fromUnit === 'f') celsius = (value - 32) * 5/9;
            else if (fromUnit === 'k') celsius = value - 273.15;

            if (toUnit === 'c') result = celsius;
            else if (toUnit === 'f') result = (celsius * 9/5) + 32;
            else if (toUnit === 'k') result = celsius + 273.15;
        } else {
            return await sock.sendMessage(chatId, {
                text: '❌ Unsupported units. Use compatible units (length, weight, or temperature).',
                ...channelInfo
            }, { quoted: message });
        }

        const text = `╔══「 📏 *UNIT CONVERTER* 」══╗\n\n` +
            `📊 *Category:* ${category}\n` +
            `📝 *From:* ${value} ${fromUnit.toUpperCase()}\n` +
            `✅ *To:* ${result.toFixed(4)} ${toUnit.toUpperCase()}\n\n` +
            `╚═══════════════════╝\n*Powered by EliTechWiz*`;

        await sock.sendMessage(chatId, { text: text, ...channelInfo }, { quoted: message });
    } catch (error) {
        console.error('Unit command error:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error converting units. Please check the format and try again.',
            ...channelInfo
        }, { quoted: message });
    }
}

module.exports = unitCommand;

