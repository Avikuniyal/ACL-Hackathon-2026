require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({apiKey: process.env.GROQ_API_KEY});

async function getGroqResponse(message) {
    const response = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: message,
            },
        ],
        model: "llama-3.1-8b-instant"
    });

    return response.choices[0].message.content;
}

module.exports = {getGroqResponse};