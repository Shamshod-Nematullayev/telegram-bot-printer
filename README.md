# Telegram Printer Bot

Bu bot Telegram orqali PDF fayllarni qabul qilib, avtomatik ravishda printerni ishga tushiradi va qog'ozga chiqaradi.

## Xususiyatlari

- Faqatgina ma'lum foydalanuvchi ID uchun ishlaydi.
- Faqat PDF formatidagi hujjatlarni qabul qiladi.
- Printerning nomini belgilash imkoniyati mavjud.
- Chop etish jarayoni haqida foydalanuvchini xabardor qiladi (qabul qilindi, chop etilmoqda, chop etildi yoki xato yuz berdi).

---

## Talablar

Quyidagi vositalar va modullar o'rnatilgan bo'lishi kerak:

- **Node.js** (v14 yoki undan yuqori)
- **npm** (Node Package Manager)
- Printer sozlangan va o'rnatilgan bo'lishi kerak.

---

## O'rnatish

1. Repositoriyani klonlang:

   ```bash
   git clone <repository_url>
   cd telegram-printer-bot
   ```

2. Zarur modullarni o'rnating:

   ```bash
   npm install
   ```

3. Muhit o'zgaruvchisini sozlang: `.env` fayl yarating va Telegram bot tokeningizni kiriting:

   ```
   BOT_TOKEN=your_telegram_bot_token
   ```

4. Printer nomini o'zgartirish (agar kerak bo'lsa):\
   Kodning quyidagi qismini tahrirlang va printeringiz nomini kiriting:

   ```javascript
   await print(tempFilePath, {
     printer: "Canon MF3010",
   });
   ```

5. Fayllarni saqlash uchun `uploads` papkasini yarating:

   ```bash
   mkdir uploads
   ```

---

## Ishga tushirish

Botni ishga tushirish uchun quyidagi buyruqni bajaring:

```bash
node index.js
```

---

## Foydalanish

1. Botga ulaning va PDF formatidagi hujjatni yuboring.
2. Bot javob beradi:
   - **"Qabul qilindi"**: Fayl muvaffaqiyatli yuklandi.
   - **"Chop etilmoqda"**: Fayl printerga yuborilmoqda.
   - **"Fayl chop etildi"**: Fayl muvaffaqiyatli chop etildi.
   - **"Xatolik kuzatildi"**: Chop etishda muammo yuzaga keldi.

---

## Xatoliklarni bartaraf etish

- **"Siz bu xizmatga ulanmagansiz"**: Botga ulanishga ruxsat berilgan foydalanuvchilar ro‘yxatiga kiritilmadingiz. Kodning quyidagi qismini tahrir qiling:
  ```javascript
  const user_id = 5347896070; // Bu yerga o'z ID'ingizni kiriting
  ```
- **Chop etish ishlamaydi**: Printer nomi to‘g‘ri kiritilganligini tekshiring.
- **Uploads papkasi mavjud emas**: Kod chop etilishdan oldin vaqtinchalik faylni saqlaydi, shuning uchun `uploads` papkasi yaratilgan bo‘lishi kerak.

---

## Hissa qo‘shish

Hissa qo‘shish uchun `fork` qiling, o‘zgartirish kiriting va `pull request` yuboring.

---

## Muallif

- Shamshod Ne'matullayev
