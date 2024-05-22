const admin = require("firebase-admin");
// import serviceAccount from "./serviceKey.json" assert { type: "json" }; // Use assert { type: 'json' }
const serviceAccount = require("./serviceKey.json"); // Use require for JSON files

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
