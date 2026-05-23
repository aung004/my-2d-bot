const TelegramBot = require('node-telegram-bot-api');
const token = '8014324965:AAE7azq1CGD7CGo2W1yIJFyXUK3R7r7BsxE';
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    let text = msg.text ? msg.text.trim().toUpperCase() : '';

    // /start command အတွက် တုံ့ပြန်ချက်
    if (text === '/START') {
        bot.sendMessage(chatId, "ကြိုဆိုပါတယ်ခင်ဗျာ။ 2D ဂဏန်းနှင့် ငွေပမာဏကို အောက်ပါ Format အတိုင်း ရိုက်ပို့ပေးပါ-\n\nဥပမာ - 41-34-56 R 50");
        return;
    }

    // Format စစ်ဆေးခြင်း (ဥပမာ- 23-34-56 R 250)
    let match = text.match(/^([\d-]+)\s+R\s+(\d+)$/);

    if (match) {
        let numbersStr = match[1];
        let amount = parseInt(match[2]);

        let numbersList = numbersStr.split('-');
        let totalSets = numbersList.length;

        // R (အလှည့်) အတွက် စုစုပေါင်းတွက်ချက်ခြင်း (ဂဏန်းအကွက်အရေအတွက် x ၂ ဆ x ငွေပမာဏ)
        let totalAmount = totalSets * 2 * amount;

        // ပြန်စာ ပုံစံထုတ်ခြင်း
        let response = `${numbersStr} R ${amount}\n* Total = ${totalAmount.toLocaleString()} ကျပ်`;
        bot.sendMessage(chatId, response);
    }
});

console.log("Bot is running...");
