const TelegramBot = require('node-telegram-bot-api');

// အစ်ကို့ရဲ့ Telegram Bot Token
const token = '8014324965:AAE7azq1CGD7CGo2W1yIJFyXUK3R7r7BsxE';
const bot = new TelegramBot(token, { polling: true });

console.log("Moh 2D Reseller Advanced Bot စတင်အလုပ်လုပ်ပါပြီ...");

// /start လုပ်လျှင် ပြသမည့် လမ်းညွှန်စာ
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const welcomeMessage = `👋 **Moh 2D Reseller မှ ကြိုဆိုပါတယ်ဗျာ!**

📝 **2D အော်ဒါတွက်ချက်ရန် နမူနာပုံစံများ-**
• \`43 R 250\`
• \`12 300 R 100\`
• \`15,26,37,48 500\`
• \`0 ထိပ် 300\`
• \`5 ပိတ် 200\`
• \`အပူး 1000\`

စာတစ်စောင်တည်းမှာ တစ်ကြောင်းချင်းစီ ခွဲပြီး အကုန်လုံး ရောရိုက်ပို့လို့ရပါတယ်ဗျာ။`;
    
    bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown" });
});

// အော်ဒါများကို ဖတ်ပြီး စာရင်းတွက်ချက်ပေးမည့်အပိုင်း
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text ? msg.text.trim() : '';

    if (text.startsWith('/')) return;

    const lines = text.split('\n');
    let responseText = "📝 **အော်ဒါစာရင်းတွက်ချက်မှု**\n\n";
    let totalAmount = 0;
    let hasValidOrder = false;

    lines.forEach(line => {
        let currentLine = line.trim();
        if (!currentLine) return;

        // 1. Pattern: 12 300 R 100
        const matchPattern1 = currentLine.match(/^(\d{2})\s+(\d+)\s+[Rr]\s+(\d+)$/);
        
        // 2. Pattern: 43 R 250
        const matchPattern2 = currentLine.match(/^(\d{2})\s+[Rr]\s+(\d+)$/);

        // 3. Pattern: 0 ထိပ် 500 သို့မဟုတ် 0ထိပ် 500
        const matchTop = currentLine.match(/^(\d)\s*ထိပ်\s*(\d+)$/);

        // 4. Pattern: 5 ပိတ် 200 သို့မဟုတ် 5ပိတ် 200
        const matchEnd = currentLine.match(/^(\d)\s*ပိတ်\s*(\d+)$/);

        // 5. Pattern: အပူး 1000
        const matchDouble = currentLine.match(/^အပူး\s*(\d+)$/);

        // 6. Pattern: 15,26,37 500
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

    if (hasValidOrder) {
        responseText += "-----------------------\n";
        responseText += `💰 **စုစုပေါင်းကျသင့်ငွေ = ${totalAmount} ကျပ်**`;
        bot.sendMessage(chatId, responseText, { parse_mode: "Markdown" });
    }
});
