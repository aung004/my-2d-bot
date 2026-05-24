const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenAI } = require('@google/genai');
const http = require('http');

// Render အတွက် Dummy Port ဖွင့်ပေးခြင်း
const port = process.env.PORT || 10000;
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Moh 2D Bot is Running\n');
}).listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Bot Token နှင့် AI Key သတ်မှတ်ခြင်း
const token = process.env.TELEGRAM_BOT_TOKEN;
const aiKey = process.env.GEMINI_API_KEY;

if (!token || !aiKey) {
  console.error("Error: TELEGRAM_BOT_TOKEN သို့မဟုတ် GEMINI_API_KEY မရှိသေးပါ။ Environment Variables မှာ ထည့်ပေးပါ။");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const ai = new GoogleGenAI({ apiKey: aiKey });

console.log("Moh 2D Reseller Smart AI Bot စတင်အလုပ်လုပ်ပါပြီ...");

// 2D စာရင်း တွက်ချက်သည့် စနစ် (Regex)
function calculate2D(text) {
  const pattern = /(\d{2})\s*[rR]?\s*[-=]?\s*(\d+)/g;
  let match;
  let total = 0;
  let details = [];

  while ((match = pattern.exec(text)) !== null) {
    let num = match[1];
    let amt = parseInt(match[2]);
    total += amt;
    details.push(`${num}: ${amt} ကျပ်`);
  }
  
  if (details.length > 0) {
    return { isList: true, text: `📊 2D စာရင်း တွက်ချက်မှု-\n------------------\n${details.join('\n')}\n------------------\nစုစုပေါင်းကျသင့်ငွေ - ${total} ကျပ်` };
  }
  return { isList: false };
}

// Bot ထံစာဝင်လာလျှင် အလုပ်လုပ်မည့်အပိုင်း
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  // 1. 2D စာရင်း ဟုတ်မဟုတ် အရင်စစ်မယ်
  const check2D = calculate2D(text);
  if (check2D.isList) {
    bot.sendMessage(chatId, check2D.text);
    return;
  }

  // 2. စာရင်းမဟုတ်ရင် Gemini AI နဲ့ စကားပြောမယ်
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `သင်သည် Moh 2D Reseller (မိုး 2D ဒိုင်ခွဲ) ၏ ဖော်ရွေပျူငှာသော လူသားအရောင်းကိုယ်စားလှယ်ဖြစ်သည်။ Customer က လာရောက်နှုတ်ဆက်ခြင်း သို့မဟုတ် အထွေထွေမေးမြန်းခြင်းကို လူလိုပဲ ယဉ်ကျေးပျူငှာစွာ တိုတိုတုတ်တုတ် ပြန်ဖြေပေးပါ။ Customer ပြောသည့်စကား: "${text}"`,
    });
    bot.sendMessage(chatId, response.text);
  } catch (error) {
    console.error("AI Error:", error);
    bot.sendMessage(chatId, "ခဏလေးနော် အစ်ကို၊ စနစ်အနည်းငယ် အလုပ်များနေလို့ပါ။");
  }
});
