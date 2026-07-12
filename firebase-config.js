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
  apiKey: "REPLACE_ME",
  authDomain: "REPLACE_ME.firebaseapp.com",
  projectId: "REPLACE_ME",
  storageBucket: "REPLACE_ME.appspot.com",
  messagingSenderId: "REPLACE_ME",
  appId: "REPLACE_ME",
};

// You do not need to change anything below this line.
window.FIREBASE_CONFIGURED = !Object.values(window.FIREBASE_CONFIG).some(
  (v) => typeof v === "string" && v.indexOf("REPLACE_ME") === 0
);
