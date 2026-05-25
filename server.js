const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const http = require('http'); // အသစ်ထည့်ရန်

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Port အလွတ်တစ်ခု ထောင်ပေးခြင်း (Render အတွက်)
http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running');
}).listen(process.env.PORT || 3000);

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
