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
  console.log("🟢 [START] Yangi hujjat qabul qilindi");

  const msg = await ctx.reply("📥 Qabul qilindi...");

  try {
    console.log("➡️ 1. Fayl haqida ma’lumot olinmoqda...");
    const fileDetails = await bot.telegram.getFile(
      ctx.message.document.file_id
    );
    console.log("   📄 file_path:", fileDetails.file_path);

    console.log("➡️ 2. Telegram serverdan fayl yuklanmoqda...");
    const response = await axios.get(
      `https://api.telegram.org/file/bot${bot.token}/${fileDetails.file_path}`,
      { responseType: "arraybuffer" }
    );

    const pdfBuffer = response.data;
    console.log(
      `   ✅ Fayl yuklandi, hajmi: ${(pdfBuffer.byteLength / 1024).toFixed(
        2
      )} KB`
    );

    const tempFilePath = path.join("uploads", `temp_${Date.now()}.pdf`);
    fs.writeFileSync(tempFilePath, pdfBuffer);
    console.log("➡️ 3. Fayl vaqtinchalik saqlandi:", tempFilePath);

    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();
    console.log(`➡️ 4. PDF sahifalar soni: ${pageCount}`);

    if (pageCount <= 20) {
      console.log("➡️ 5. 20 sahifadan kam — to‘liq chop etiladi");
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        msg.message_id,
        1,
        "🖨️ Chop etilmoqda..."
      );

      console.log("   📤 Printerga yuborilmoqda...");
      await print(tempFilePath, { printer: "Canon MF3010" });
      console.log("   ✅ Chop etish so‘rovi yuborildi");

      console.log("⏳ Kutish (20s)...");
      await delay(20000);

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        msg.message_id,
        1,
        "✅ Fayl chop etildi"
      );
      console.log("🏁 Chop etish tugadi!");
    } else {
      console.log("➡️ 5. 20 sahifadan ko‘p — bo‘lib chop etilmoqda...");

      for (let i = 0; i < pageCount; i += 20) {
        const lastPage = i + 20 > pageCount ? pageCount : i + 20;
        const pageRange = `${i + 1}-${lastPage}`;

        console.log(`📄 Bo‘lim: ${pageRange}/${pageCount}`);

        await ctx.telegram.editMessageText(
          ctx.chat.id,
          msg.message_id,
          1,
          `🖨️ Chop etilmoqda: ${pageRange} (${pageCount} sahifadan)`
        );

        console.log("   📤 Printerga yuborilmoqda:", pageRange);
        await print(tempFilePath, {
          printer: "Canon MF3010",
          pages: pageRange,
        });
        console.log("   ✅ Chop etish so‘rovi yuborildi:", pageRange);

        const waitTime = 20000;
        console.log(`⏳ Kutish: ${(waitTime / 1000).toFixed(1)}s...`);
        await delay(waitTime);
        console.log("   ⏭️ Keyingi bo‘limga o‘tilmoqda...");
      }

      await ctx.telegram.editMessageText(
        ctx.chat.id,
        msg.message_id,
        1,
        `✅ Fayl to‘liq chop etildi (${pageCount} sahifa)`
      );
      console.log("🏁 Barcha sahifalar chop etildi!");
    }

    // Faylni o'chirish
    try {
      fs.unlinkSync(tempFilePath);
      console.log("🧹 Vaqtinchalik fayl o‘chirildi:", tempFilePath);
    } catch (cleanupError) {
      console.warn("⚠️ Faylni o‘chirishda xatolik:", cleanupError.message);
    }
  } catch (error) {
    console.error("❌ Xatolik:", util.inspect(error, { depth: 3 }));
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      msg.message_id,
      1,
      "❌ Xatolik kuzatildi, fayl chop etilmadi."
    );
  }
});

bot.on("message", (ctx) => {
  ctx.reply("Chop etilishi kerak bo'lgan PDF faylni yuboring");
});

bot.catch((err) => {
  console.error(err);
});

module.exports = bot;
