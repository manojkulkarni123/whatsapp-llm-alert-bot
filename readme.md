# WhatsApp LLM Alert Bot

A privacy-focused WhatsApp bot that uses a local Large Language Model (LLM) to filter and alert you about job opportunities, internships, freelance gigs, and other professional opportunities shared in your WhatsApp groups. The bot runs locally, ensuring your data never leaves your machine.

---

## Features

- **Automatic Filtering:** Detects and alerts you only about relevant professional opportunities.
- **Local LLM Integration:** Uses Ollama and open-source LLMs (e.g., Gemma 3B) for privacy and speed.
- **Customizable:** Easily adapt the filtering logic or LLM prompt for your needs.
- **Rich Alerts:** Sends you a summary of relevant messages directly on WhatsApp.
- **Logging:** All activity is logged for transparency and debugging.

---

## How It Works

1. **WhatsApp Client:** Listens to all incoming group messages using `whatsapp-web.js`.
2. **LLM Server:** For each message, sends the content to a FastAPI server running a local LLM via Ollama.
3. **Filtering:** The LLM determines if the message is relevant (job, internship, freelance, etc.) and generates a summary.
4. **Alert:** If relevant, the bot forwards the message and summary to your personal WhatsApp chat.

---

## Requirements

- Node.js (v16+)
- Python 3.8+
- [Ollama](https://ollama.com/) installed and running locally
- WhatsApp account (must scan QR code on first run)
- Model (e.g., `gemma3:4b`) downloaded in Ollama

---

## Setup

### 1. Clone the Repository

```sh
git clone https://github.com/yourusername/whatsapp-llm-alert-bot.git
cd whatsapp-llm-alert-bot
```

### 2. Install Dependencies

#### Node.js (WhatsApp Client)

```sh
npm install
```

#### Python (LLM Server)

```sh
pip install fastapi requests uvicorn
```

### 3. Start Ollama and Download Model

```sh
ollama run gemma:3b
```

### 4. Run the LLM Server

```sh
uvicorn llm_server:app --reload
```

### 5. Start the WhatsApp Bot

```sh
node index.js
```

- Scan the QR code with your WhatsApp mobile app.
- Your WhatsApp ID will be printed in the console. Replace the `MY_ID` value in `index.js` with your ID to receive alerts.

---

## Configuration

- **Model:** Change the model in `llm_server.py` (`"model": "gemma3:4b"`) to any supported by Ollama.
- **Prompt:** Adjust the prompt in `llm_server.py` to fine-tune filtering.
- **Logging:** Logs are saved to `combined.log` and `error.log`.

---

## File Structure

```
.
├── index.js           # WhatsApp client (Node.js)
├── llm_server.py      # FastAPI LLM filter server (Python)
├── readme.md          # Project documentation
├── package.json       # Node.js dependencies
├── requirements.txt   # Python dependencies (optional)
├── combined.log       # Info/debug logs
├── error.log          # Error logs
```

---

## Customization

- **Filter Logic:** Edit the prompt in `llm_server.py` to change what is considered "relevant."
- **Notification Format:** Edit the message sent in `index.js` for custom alerts.
- **Add More Models:** Download and use other LLMs with Ollama as needed.

---

## Troubleshooting

- **Ollama Not Running:** Ensure Ollama is running and the model is downloaded.
- **WhatsApp QR Not Scanning:** Delete the `.wwebjs_auth` folder to reset the session.
- **No Alerts:** Check logs for errors and verify your WhatsApp ID in `index.js`.

---

## Security & Privacy

- **Local Processing:** All message analysis happens on your machine.
- **No Cloud:** No messages are sent to third-party servers.
- **Logs:** Review logs to monitor bot activity.

---

## License

MIT License

---

## Credits

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [Ollama](https://ollama.com/)
- [FastAPI](https://fastapi.tiangolo.com/)

---

## Contributing

Pull requests and suggestions are welcome! Please open an issue or submit