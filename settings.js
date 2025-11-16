const settings = {
  packname: 'EliTechWiz',
  author: 'EliTechWiz',
  botName: "EliTechWiz",
  botOwner: 'EliTechWiz', // Your name
  ownerNumber: process.env.OWNER_NUMBER || '255742631101', //Set your number here without + symbol, just add country code & number without any space
  giphyApiKey: process.env.GIPHY_API_KEY || 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
  commandMode: "public",
  maxStoreMessages: 20, 
  storeWriteInterval: 10000,
  description: "EliTechWiz - Advanced WhatsApp Bot with 600+ Commands for Enhanced User Experience",
  version: "4.0.0",
  updateZipUrl: "https://github.com/Eliahhango/EliTechWiz-GENZ/archive/refs/heads/main.zip",
};

module.exports = settings;
