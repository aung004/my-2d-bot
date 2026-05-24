const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const bot = new TelegramBot('8999801174:AAEfeQqGFOidmk0FIWjFlWu1T3_p70IZyDo', {polling: true});
const genAI = new GoogleGenerativeAI("ဒီနေရာမှာ-အစ်ကို့-Gemini-Key-ကို-ထည့်ပါ");

bot.on('message', async (msg) => {
  const text = msg.text;
  if (!text) return;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(text);
    bot.sendMessage(msg.chat.id, result.response.text());
  } catch (err) {
    bot.sendMessage(msg.chat.id, "ခဏလေးနော် အစ်ကို၊ AI စနစ်အနည်းငယ် အလုပ်များနေလို့ပါ။");
  }
});
