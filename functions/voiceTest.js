require("dotenv").config();
console.log("API Key:", process.env.ELEVENLABS_API_KEY);

const fetch = require("node-fetch");
const VOICE_ID ="eOBawcME0rW2TRqu8C29";
async function voiceTest(text) {
    const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
        {
            method: "POST",
            headers: {
                "xi-api-key": process.env.ELEVENLABS_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                text: text,
                model_id: "eleven_turbo_v2_5",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.5,
                },
            }),
        }
    );

    if(!response.ok){
        throw new Error(`ElevenLabs error: ${response.statusText}`);
    }

    const audioBuffer = await response.buffer();
    return audioBuffer;
}

module.exports = {voiceTest}


const fs = require("fs")

voiceTest("Hello, testing testing. bismillah")
    .then((audio)=> {
        fs.writeFileSync("test_output.mp3", audio);
        console.log("Success! Check test_output.mp3");
    })

     .catch((err) => console.error("Error:", err));