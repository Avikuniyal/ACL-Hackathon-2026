require("dotenv").config();
const twilio = require("twilio");

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function scheduleCall(grandmaPhone){
    const call = await client.calls.create({
        url: process.env.NGROK_URL + "/voice",
        to: grandmaPhone,
        from: process.env.TWILIO_PHONE_NUMBER,
    });

    console.log("Call started: ", call.sid);
    return call.sid;
}

module.exports = {scheduleCall};

scheduleCall("+15715996751")
    .catch((err) => console.error("Error: ", err));