const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenAI } = require('@google/genai');

// အစ်ကို့ရဲ့ Telegram Bot Token
const token = '8014324965:AAE7azq1CGD7CGo2W1yIJFyXUK3R7r7BsxE';
const bot = new TelegramBot(token, { polling: true });

// အခမဲ့ သုံးနိုင်သော Google AI စနစ် (Gemini-2.5-Flash)
const ai = new GoogleGenAI();
const MODEL_NAME = 'gemini-2.5-flash';

console.log("Moh 2D Reseller Smart AI Bot စတင်အလုပ်လုပ်ပါပြီ...");

// Bot ရဲ့ စရိုက်နှင့် အချက်အလက်များ သတ်မှတ်ခြင်း (System Instruction)
const botPersonality = `သင်သည် "Moh 2D Reseller" အဖွဲ့အစည်း၏ လူမှုရေးကောင်းမွန်ပြီး ဖော်ရွေပျူငှာသော AI လက်ထောက် ဖြစ်သည်။ 
မြန်မာလိုပဲ သဘာဝကျကျ ယဉ်ယဉ်ကျေးကျေး ပြန်ပြောပေးပါ။ လူများက 2D ဂဏန်းစာရင်းများ ရိုက်ပို့ပါက တွက်ချက်ပေးမည့်စနစ်ရှိပြီးသားမို့ သင်ဝင်ရောက်ဖြေရှင်းရန်မလိုပါ။ 
သာမန် နှုတ်ဆက်စကား၊ စျေးနှုန်းမေးမြန်းခြင်း၊ စကားစမြည်ပြောခြင်းများကိုသာ လူကဲ့သို့ အကောင်းဆုံး အပြန်အလှန် စကားပြောပေးပါ။`;

// /start လုပ်လျှင် ပြသမည့်စာ
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `👋 **Moh 2D Reseller ရဲ့ Smart AI Bot မှ ကြိုဆိုပါတယ်ဗျာ!**

📝 **2D အော်ဒါတွက်ချက်ရန် နမူနာပုံစံများ-**
• \`43 R 250\` | \`12 300 R 100\`
• \`15,26,37,48 500\`
• \`0 ထိပ် 300\` | \`5 ပိတ် 200\` | \`အပူး 1000\`

🤖 တခြား သိချင်တာရှိရင်လည်း စာရိုက်ပြီး ကျွန်တော့်ကို လူလိုမျိုး အေးဆေး စကားပြောလို့ရပါတယ်ဗျာ။`;
    
    bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown" });
});

// မက်ဆေ့ခ်ျများကို ဖတ်ပြီး ခွဲခြား處理ခြင်း
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text ? msg.text.trim() : '';

    if (text.startsWith('/')) return;

    const lines = text.split('\n');
    let responseText = "📝 **အော်ဒါစာရင်းတွက်ချက်မှု**\n\n";
    let totalAmount = 0;
    let hasValidOrder = false;

    // 2D စာရင်း ဟုတ်/မဟုတ် စစ်ဆေးခြင်း
    lines.forEach(line => {
        let currentLine = line.trim();
        if (!currentLine) return;

        const matchPattern1 = currentLine.match(/^(\d{2})\s+(\d+)\s+[Rr]\s+(\d+)$/);
        const matchPattern2 = currentLine.match(/^(\d{2})\s+[Rr]\s+(\d+)$/);
        const matchTop = currentLine.match(/^(\d)\s*ထိပ်\s*(\d+)$/);
        const matchEnd = currentLine.match(/^(\d)\s*ပိတ်\s*(\d+)$/);
        const matchDouble = currentLine.match(/^အပူး\s*(\d+)$/);
        const matchMulti = currentLine.match(/^([\d,]+)\s+(\d+)$/);

        if (matchPattern1) {
            const num = matchPattern1[1];
            const mainAmt = parseInt(matchPattern1[2]);
            const rAmt = parseInt(matchPattern1[3]);
            const rNum = num.split('').reverse().join('');
            responseText += `• ${num} = ${mainAmt}\n• ${rNum} = ${rAmt}\n`;
            totalAmount += (mainAmt + rAmt);
            hasValidOrder = true;
        } 
        else if (matchPattern2) {
            const num = matchPattern2[1];
            const amt = parseInt(matchPattern2[2]);
            const rNum = num.split('').reverse().join('');
            responseText += `• ${num} = ${amt}\n• ${rNum} = ${amt}\n`;
            totalAmount += (amt * 2);
            hasValidOrder = true;
        }
        else if (matchTop) {
            const topDigit = matchTop[1];
            const amt = parseInt(matchTop[2]);
            responseText += `• ${topDigit} ထိပ်တန်း (၁၀ ကွက်) = ${amt * 10}\n`;
            totalAmount += (amt * 10);
            hasValidOrder = true;
        }
        else if (matchEnd) {
            const endDigit = matchEnd[1];
            const amt = parseInt(matchEnd[2]);
            responseText += `• ${endDigit} နောက်ပိတ် (၁၀ ကွက်) = ${amt * 10}\n`;
            totalAmount += (amt * 10);
            hasValidOrder = true;
        }
        else if (matchDouble) {
            const amt = parseInt(matchDouble[1]);
            responseText += `• အပူးပတ် (၁၀ ကွက်) = ${amt * 10}\n`;
            totalAmount += (amt * 10);
            hasValidOrder = true;
        }
        else if (matchMulti && !currentLine.includes('ထိပ်') && !currentLine.includes('ပိတ်')) {
            const nums = matchMulti[1].split(',');
            const amt = parseInt(matchMulti[2]);
            let validNumsCount = 0;
            nums.forEach(n => {
                if (n.trim().length === 2) {
                    responseText += `• ${n.trim()} = ${amt}\n`;
                    validNumsCount++;
                }
            });
            totalAmount += (amt * validNumsCount);
            if(validNumsCount > 0) hasValidOrder = true;
        }
    });

    // 2D စာရင်းဖြစ်က တွက်ချက်မှုပြမည်
    if (hasValidOrder) {
        responseText += "-----------------------\n";
        responseText += `💰 **စုစုပေါင်းကျသင့်ငွေ = ${totalAmount} ကျပ်**`;
        bot.sendMessage(chatId, responseText, { parse_mode: "Markdown" });
    } 
    // 2D စာရင်းမဟုတ်က AI စကားပြောစနစ်ဖြင့် ပြန်လည်ဖြေကြားမည်
    else {
        try {
            // AI ဆီကနေ အဖြေတောင်းခြင်း
            const aiResponse = await ai.models.generateContent({
                model: MODEL_NAME,
                contents: text,
                config: {
                    systemInstruction: botPersonality
                }
            });
            
            const replyText = aiResponse.text || "နားမလည်လိုက်ပါဘူးဗျာ။ နောက်တစ်ခေါက်လောက် ပြန်ပြောပေးပါဦး။";
            bot.sendMessage(chatId, replyText);
        } catch (error) {
            console.error("AI Error:", error);
            bot.sendMessage(chatId, "မင်္ဂလာပါဗျာ! Moh 2D Reseller မှ ကြိုဆိုပါတယ်။");
        }
    }
});
