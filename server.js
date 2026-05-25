const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Render အတွက် Port ဖွင့်ခြင်း
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
}).listen(process.env.PORT || 3000);

bot.on('message', async (msg) => {
  if (!msg.text || msg.text === '/start') return;
  
  // Model နာမည်ကို gemini-1.5-flash သို့ ပြန်ပြောင်းထားပါတယ်
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  try {
    const result = await model.generateContent(msg.text);
    const response = await result.response;
    bot.sendMessage(msg.chat.id, response.text());
  } catch (err) {
    bot.sendMessage(msg.chat.id, "Error: " + err.message);
  }
});
