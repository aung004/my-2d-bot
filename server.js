const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

bot.on('message', async (msg) => {
  const text = msg.text;
  if (!text || text === '/start') return; 
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent(text);
    bot.sendMessage(msg.chat.id, result.response.text());
  } catch (err) {
    bot.sendMessage(msg.chat.id, "ခဏစောင့်ပေးပါ၊ ပြန်ကြိုးစားကြည့်ပါ။");
  }
});
