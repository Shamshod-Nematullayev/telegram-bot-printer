const { default: axios } = require("axios");
const { print } = require("pdf-to-printer");
const { Telegraf } = require("telegraf");
const path = require("path");
const fs = require("fs");
const user_id = 5347896070; // Bu yerga o'z ID'ingizni kiriting

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use((ctx, next) => {
  if (ctx.from.id === user_id) {
    next();
  } else {
    ctx.reply("Siz bu xizmatga ulanmagansiz");
  }
});
bot.on("document", async (ctx) => {
  const msg = await ctx.reply("Qabul qilindi");
  try {
    const fileDetails = await bot.telegram.getFile(
      ctx.message.document.file_id
    );
    const response = await axios.get(
      `https://api.telegram.org/file/bot${bot.token}/${fileDetails.file_path}`,
      {
        responseType: "arraybuffer",
      }
    );
    const pdfBuffer = response.data; // Bu PDF buffer
    const tempFilePath = path.join("uploads", "temp.pdf"); // Vaqtinchalik fayl yo'li
    fs.writeFileSync(tempFilePath, pdfBuffer);
    ctx.telegram.editMessageText(
      ctx.chat.id,
      msg.message_id,
      1,
      "Chop etilmoqda"
    );
    await print(tempFilePath, {
      printer: "Canon MF3010",
    });
    ctx.telegram.editMessageText(
      ctx.chat.id,
      msg.message_id,
      1,
      "Fayl chop etildi"
    );
  } catch (error) {
    ctx.telegram.editMessageText(
      ctx.chat.id,
      msg.message_id,
      1,
      "Xatolik kuzatildi"
    );
    console.error(error);
  }
});

bot.on("message", (ctx) => {
  ctx.reply("Chop etilishi kerak bo'lgan PDF faylni yuboring");
});

bot.catch((err) => {
  console.error(err);
});

module.exports = bot;
