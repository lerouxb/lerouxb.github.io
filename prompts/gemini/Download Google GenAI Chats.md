# Download Google GenAI Chats

> Exported on: 10/02/2026, 20:46:34

---

## 👤 You

using node.js, how can I download my google genai chats?

## 🤖 Gemini

To download your Google Gemini (GenAI) chats using Node.js, it is important to distinguish between **personal chats** from the Gemini web app and **API-based chats** you created yourself.

### 1\. Personal Gemini App Chats (The "Catch")

Currently, Google does **not** provide a public API to programmatically fetch the history of your personal conversations from [gemini.google.com](https://gemini.google.com).

To get this data, you must use **Google Takeout**:

1.  Go to [Google Takeout](https://takeout.google.com/).
2.  Deselect all and select only **Gemini**.
3.  Export the data (usually arrives as a `.json` or `.html` file).
4.  **Use Node.js** to parse the resulting file locally.

**Example Node.js script to read a Takeout JSON export:**

JavaScript

```
const fs = require('fs');

// Path to the JSON file from your Google Takeout export
const filePath = './gemini_history.json';

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) throw err;
    const history = JSON.parse(data);

    // Google Takeout format typically nests chats in a 'conversations' array
    history.conversations.forEach(chat => {
        console.log(`Chat Title: ${chat.title}`);
        chat.messages.forEach(msg => {
            console.log(`${msg.role}: ${msg.content}`);
        });
        console.log('---');
    });
});
```

---

### 2\. Developer API Chats (Vertex AI / Google AI Studio)

If you are building your own application using `@google/generative-ai` and want to save the history of those sessions, you are responsible for managing the state. The API does not "store" history for you to fetch later; you must pass the `history` array back to the model in each session.

**How to save a session to a local file:**

JavaScript

```
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI("YOUR_API_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function runChat() {
  const chat = model.startChat({
    history: [], // You would load previous history here from a file
  });

  const msg = "Hello, can you explain Node.js?";
  const result = await chat.sendMessage(msg);
  const response = await result.response;

  // Get current history including the new exchange
  const history = await chat.getHistory();

  // Save to a local JSON file
  fs.writeFileSync('my_api_chats.json', JSON.stringify(history, null, 2));
  console.log("Chat history saved!");
}

runChat();
```

### Summary of Options

| Method             | Data Source                  | Automation Level                                                                          |
| ------------------ | ---------------------------- | ----------------------------------------------------------------------------------------- |
| **Google Takeout** | Personal web app chats       | Manual export, then Node.js to parse.                                                     |
| **GenAI SDK**      | Your own API implementation  | Full control via `chat.getHistory()`.                                                     |
| **AI Studio Logs** | API requests made via Studio | Can be exported as JSON/CSV from the [AI Studio Dashboard](https://aistudio.google.com/). |

**Would you like me to help you write a script to convert the Google Takeout HTML/JSON files into a more readable Markdown format?**

---
