const { default: axios } = require("axios");
const { print } = require("pdf-to-printer");
const { Telegraf } = require("telegraf");
const path = require("path");
const fs = require("fs");
const { PDFDocument } = require("pdf-lib");
const user_id = [5347896070, 6000992564]; // Bu yerga o'z ID'ingizni kiriting

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use((ctx, next) => {
  if (user_id.includes(ctx.from.id)) {
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
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();

    if (pageCount <= 20) {
      ctx.telegram.editMessageText(
        ctx.chat.id,
        msg.message_id,
        1,
        "Chop etilmoqda"
      );
      await print(tempFilePath, {
        printer: "Canon MF3010",
      });

      await delay(5000 + pageCount * 4000);
      ctx.telegram.editMessageText(
        ctx.chat.id,
        msg.message_id,
        1,
        "Fayl chop etildi"
      );
    } else {
      for (let i = 0; i < pageCount; i += 20) {
        let lastPage = i + 20 > pageCount ? pageCount : i + 20;
        ctx.telegram.editMessageText(
          ctx.chat.id,
          msg.message_id,
          1,
          `Chop etilmoqda ${i + 1}-${lastPage}/${pageCount}`
        );
        await print(tempFilePath, {
          printer: "Canon MF3010",
          pages: `${i + 1}-${lastPage}`,
        });
        await delay(20 * 4000 + 5000 + 1000 * 60);
      }
      ctx.telegram.editMessageText(
        ctx.chat.id,
        msg.message_id,
        1,
        `Fayl chop etildi`
      );
    }
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
