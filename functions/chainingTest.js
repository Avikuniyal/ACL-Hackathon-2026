require("dotenv").config();

const {getGroqResponse} = require("./getGroqResponse");
const { voiceTest } = require("./voiceTest");
const fs = require("fs");

async function chainingTest(message) {
    console.log("Asking Groq: ", message);
    const groqResponse = await getGroqResponse(message);

    console.log("Groq responded: ", groqResponse);
    const audio = await voiceTest(groqResponse);

    fs.writeFileSync("chaining_Test.mp3", audio);
    console.log("success");
}

chainingTest("Hello Groq, How are you doing Today?")
    .catch((err) => console.error("Error: ", err));