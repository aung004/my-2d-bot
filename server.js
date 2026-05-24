const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const bot = new TelegramBot('ဒီနေရာမှာ-အစ်ကို့-Token-ကို-ထည့်ပါ', {polling: true});
const genAI = new GoogleGenerativeAI("ဒီနေရာမှာ-အစ်ကို့-Gemini-Key-ကို-ထည့်ပါ");

bot.on('message', async (msg) => {
  const text = msg.text;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(text);
    bot.sendMessage(msg.chat.id, result.response.text());
  } catch (err) {
    bot.sendMessage(msg.chat.id, "ခဏလေးနော် အစ်ကို၊ AI ပြန်ဖြေဖို့ အဆင်မပြေဖြစ်နေလို့ပါ။");
  }
});
