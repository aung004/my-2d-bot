const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Railway မှာ ထည့်ထားတဲ့ Variable တွေကို ခေါ်သုံးတာပါ
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

bot.on('message', async (msg) => {
  const text = msg.text;
  if (!text) return;
  
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  try {
    const result = await model.generateContent(text);
    bot.sendMessage(msg.chat.id, result.response.text());
  } catch (err) {
    console.log(err);
    bot.sendMessage(msg.chat.id, "စနစ်အနည်းငယ် အလုပ်များနေလို့ပါ။ ခဏနေမှ ပြန်မေးပေးပါဦးခင်ဗျာ။");
  }
});
