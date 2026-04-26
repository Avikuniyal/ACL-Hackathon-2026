require("dotenv").config();
const express = require("express");
const twilio = require("twilio");
const {getGroqResponse} = require("./getGroqResponse");
const {voiceTest} = require("./voiceTest");

const app = express();
app.use(express.urlencoded({extended: false}));

app.post("/voice", async (req, res) => {
    const twiml = new twilio.twiml.VoiceResponse();
    const speechResult = req.body.SpeechResult;

    if(!speechResult){
        twiml.say("Hello Dorory. This is Sarah's app calling to check in. How are you doing today?");
        twiml.gather({
            input: "speech",
            action: "/voice",
            speechTimeout: "auto",
        });
    } 
    else{
        console.log("Grandma said: ", speechResult);
        const groqResponse = await getGroqResponse(speechResult);
        console.log("Groq Responded: ", groqResponse);
        twiml.say(groqResponse);
        twiml.gather({
            input: "speech",
            action: "/voice",
            speechTimeout: "auto", 
        });
    }

    res.type("text/xml");
    res.send(twiml.toString());
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
})