const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

bot.on('message', async (msg) => {
  if (!msg.text || msg.text === '/start') return;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent(msg.text);
    bot.sendMessage(msg.chat.id, result.response.text());
  } catch (err) {
    bot.sendMessage(msg.chat.id, "စနစ်အဆင်သင့်ဖြစ်နေပါပြီ။");
  }
});
