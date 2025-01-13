require("dotenv").config();
const bot = require("./core/bot");
function useTelegramBot() {
  bot.launch(() => {
    console.log("Bot is active!");
  });
}

useTelegramBot();
