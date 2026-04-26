require("dotenv").config();
const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function sendAlert(sarahPhone, transcriptLink) {
    const message = await client.messages.create({
        body: `Dorothy may need your help - tap here to see what she said: ${transcriptLink}`,
        to: sarahPhone,
        from: process.env.TWILIO_PHONE_NUMBER,
    });

    console.log("Alert sent. Message SID: ", message.sid);
    return message.sid;
}

module.exports = { sendAlert};

sendAlert(
    +15715996751,
    "https://yourapp.com/logs/test123",
)   .catch((err) => console.error("Error:", err));
