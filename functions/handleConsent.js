require("dotenv").config();

const admin = require("firebase-admin");
const twilio = require("twilio");
const serviceAccount = JSON.parse(require("fs").readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function sendInvite(userId, grandmaPhone, sarahName, inviteLink) {
    await client.messages.create({
        body: `Hi! This is a message from ${sarahName}. She'd love to have an app call and check in on you every day. Tap here to learn more and say yes: ${inviteLink}`,
        to: grandmaPhone,
        from: process.env.TWILIO_PHONE_NUMBER,
    });

    await db.collection("users").doc(userId).update({
        consentStatus: "pending",
    });

    console.log("Invite sent and status set to pending");
}

async function updateConsent(userId, accepted) {
    const status = accepted ? "accepted" : "declined";

    await db.collection("users").doc(userId).update({
        consentStatus: status,
    });

    console.log("Consent status updated to:", status);
}

module.exports = { sendInvite, updateConsent };

// Test accepted
updateConsent("test-user-123", true)
    .catch((err) => console.error("Error:", err));

// Test declined
updateConsent("test-user-123", false)
    .catch((err) => console.error("Error:", err));