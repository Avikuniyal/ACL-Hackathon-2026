require("dotenv").config();

const admin = require("firebase-admin");
const serviceAccount = JSON.parse(require("fs").readFileSync("./serviceAccountKey.json", "utf8"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function createUser(sarahData, grandmaData) {
    const userRef = await db.collection("users").add({
        sarah: {
            name: sarahData.name,
            photoURL: sarahData.photoURL,
            relationship: sarahData.relationship,
            nickname: sarahData.nickname,
        },
        grandma: {
            name: grandmaData.name,
            phone: grandmaData.phone,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("User created! Document ID:", userRef.id);
    return userRef.id;
}

module.exports = { createUser };

// Test it
createUser(
    {
        name: "Sarah",
        photoURL: "https://example.com/photo.jpg",
        relationship: "granddaughter",
        nickname: "Sarebear",
    },
    {
        name: "Dorothy",
        phone: "+11234567890",
    })
        .catch((err) => console.error("Error:", err));