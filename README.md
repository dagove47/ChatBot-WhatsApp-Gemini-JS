# 🚀 ChatBot-WhatsApp-Gemini-JS

A WhatsApp bot that uses the Gemini API to respond to your messages.

##  📌 Requirements

* Node.js installed (version 18 or higher recommended)
* A Google AI Studio account to obtain the Gemini API key

##  ⚡ Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/dagove47/ChatBot-WhatsApp-Gemini-JS](https://github.com/dagove47/ChatBot-WhatsApp-Gemini-JS)
    cd ChatBot-WhatsApp-Gemini-JS
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up the API key:**

    * Create a `.env` file in the project root.
    * Open the `.env` file and add your Gemini API key:

        ```ini
        GEMINI_API_KEY=YOUR_KEY_HERE
        ```

    * Make sure to replace `YOUR_KEY_HERE` with your actual API key.

4.  **Edit the context in `index.js`:**

    * Open index.js and look for the following section:

        ```js
        const CONTEXT = `
        You are an AI assistant specialized in...
        `;
        ```

    * Customize the `CONTEXT` variable to define the scope and behavior of your bot's responses. This allows you to adjust how the bot interacts based on the context you provide.

5.  **Start the bot:**

    ```bash
    npm start
    ```

    * A QR code will appear in the terminal.
    * Scan the QR code with your WhatsApp app to connect the bot.

6.  **You're all set!🎉**

    * Send a message to your WhatsApp number, and the bot will respond using the Gemini API.
