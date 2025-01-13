# Telegram Printer Bot

This bot receives PDF files via Telegram, automatically sends them to a printer, and prints them.

## Features

- Works only for a specific user ID.
- Accepts only PDF format documents.
- Allows setting the printer name.
- Notifies the user about the printing process (received, printing, printed, or an error occurred).

---

## Requirements

The following tools and modules must be installed:

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)
- A configured and installed printer.

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Shamshod-Nematullayev/telegram-bot-printer.git
   cd telegram-printer-bot
   ```

2. Install the required modules:

   ```bash
   npm install
   ```

3. Set up the environment variable: Create a `.env` file and add your Telegram bot token:

   ```
   BOT_TOKEN=your_telegram_bot_token
   ```

4. Update the printer name (if necessary):
   Edit the following part of the code and enter your printer's name:

   ```javascript
   await print(tempFilePath, {
     printer: "Canon MF3010",
   });
   ```

5. Create the `uploads` directory for saving files:

   ```bash
   mkdir uploads
   ```

---

## Running the Bot

To start the bot, run the following command:

```bash
node index.js
```

---

## Usage

1. Connect to the bot and send a document in PDF format.
2. The bot will respond with the following statuses:
   - **"Received"**: The file has been successfully uploaded.
   - **"Printing"**: The file is being sent to the printer.
   - **"File printed"**: The file has been successfully printed.
   - **"An error occurred"**: There was an issue during the printing process.

---

## Troubleshooting

- **"You are not authorized for this service"**: You are not in the list of users allowed to access the bot. Edit the following part of the code:
  ```javascript
  const user_id = 5347896070; // Replace this with your own ID
  ```
- **Printing fails**: Ensure the printer name is correctly specified.
- **Uploads directory missing**: The bot saves temporary files before printing, so ensure the `uploads` directory is created.

---

## Contributing

To contribute, fork the repository, make your changes, and submit a pull request.

---

## Author

- Shamshod Ne'matullayev
