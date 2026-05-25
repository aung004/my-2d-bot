const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
}).listen(process.env.PORT || 3000);

bot.on('message', async (msg) => {
  if (!msg.text || msg.text === '/start') return;
  
  // Model ကို gemini-pro သို့ ပြောင်းကြည့်ပါ
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  try {
    const result = await model.generateContent(msg.text);
    const response = await result.response;
    bot.sendMessage(msg.chat.id, response.text());
  } catch (err) {
    // Error တက်တဲ့နေရာကို အတိအကျသိဖို့ Error message ကို ပြခိုင်းပါ
    bot.sendMessage(msg.chat.id, "Error: " + err.message);
  }
});
