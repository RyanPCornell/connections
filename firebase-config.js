// ============================================================================
//  FIREBASE CONFIG  —  EDIT THIS FILE ONCE, THEN NEVER AGAIN
// ============================================================================
//
//  1. Go to https://console.firebase.google.com  and create a project (free).
//  2. In the project, click the </> "Web" icon to register a web app.
//  3. Firebase shows you a "firebaseConfig" object. Copy those values below,
//     replacing every "REPLACE_ME".
//  4. In the console: Build > Firestore Database > Create database (start in
//     "production mode"), then paste the rules from firestore.rules.
//  5. In the console: Build > Authentication > Get started > Email/Password >
//     Enable. Then Authentication > Users > Add user  (this is YOUR host login).
//
//  Until you fill this in, the game still runs in "DEMO MODE" using a built-in
//  sample puzzle stored in your browser only (no leaderboard sharing).
// ============================================================================

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyCTlSQVfBGMZBP5Tj3cNg6npEumKNo_-VQ",
  authDomain: "connections-47aac.firebaseapp.com",
  projectId: "connections-47aac",
  storageBucket: "connections-47aac.firebasestorage.app",
  messagingSenderId: "928107242700",
  appId: "1:928107242700:web:cf86ddb457394f1085ce69",
};

// You do not need to change anything below this line.
window.FIREBASE_CONFIGURED = !Object.values(window.FIREBASE_CONFIG).some(
  (v) => typeof v === "string" && v.indexOf("REPLACE_ME") === 0
);
