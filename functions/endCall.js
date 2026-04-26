require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = JSON.parse(require("fs").readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function endCall(transcript, duration, grandmaPhone) {
    const callLog = {
        transcript: transcript,
        duration: duration,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        grandmaPhone: grandmaPhone,
    };

    const docRef = await db.collection("callLogs").add(callLog);
    console.log("Call log saved! Document ID:", docRef.id);
    return docRef.id;
}

module.exports = { endCall };

endCall(
    `Hi how are you? I'm fine thanks for asking`,
    120,
    "+11234567890"
).catch((err) => console.error("Error:", err));