require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = JSON.parse(require("fs").readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function saveMemoryCard(userId, memoryData) {
    await db.collection("users").doc(userId).set({
        memoryCard: {
            medications: memoryData.medications || [],
            appointments: memoryData.appointments || [],
            friends: memoryData.friends || [],
            topics: memoryData.topics || [],
            phrases: memoryData.phrases || [],
        }
    }, { merge: true });

    console.log("Memory card saved for user:", userId);
}

module.exports = { saveMemoryCard };

// Test it
saveMemoryCard("test-user-123", {
    medications: ["Aspirin", "Metformin"],
    appointments: ["Doctor on Monday at 2pm"],
    friends: ["Betty", "Carol"],
    topics: ["gardening", "family"],
    phrases: ["I love you honey"],
}).catch((err) => console.error("Error:", err));