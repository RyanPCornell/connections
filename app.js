// ============================================================================
//  Shared game logic + data access for all three pages.
//  Classic (non-module) script so the app works whether you open the HTML file
//  directly (file://), run a local server, or deploy to GitHub Pages.
//  Everything is exposed on the global `App` object.
// ============================================================================
window.App = (function () {
  const CFG = window.FIREBASE_CONFIG || {};
  const CONFIGURED = window.FIREBASE_CONFIGURED === true;

  let db = null;
  let auth = null;
  let fbPromise = null;

  // Lazily load the Firebase "compat" SDK (only when configured).
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = () => rej(new Error("Could not load " + src));
      document.head.appendChild(s);
    });
  }
  function ensureFirebase() {
    if (!CONFIGURED) return Promise.resolve(false);
    if (fbPromise) return fbPromise;
    fbPromise = (async () => {
      const base = "https://www.gstatic.com/firebasejs/10.12.0/";
      await loadScript(base + "firebase-app-compat.js");
      await loadScript(base + "firebase-firestore-compat.js");
      await loadScript(base + "firebase-auth-compat.js");
      firebase.initializeApp(CFG);
      db = firebase.firestore();
      auth = firebase.auth();
      return true;
    })();
    return fbPromise;
  }
  function serverTimestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  // The four difficulty levels, easiest (0) to hardest (3), matching NYT colors.
  const LEVELS = [
    { name: "Straightforward", color: "#f9df6d", emoji: "🟨" }, // yellow
    { name: "Medium", color: "#a0c35a", emoji: "🟩" }, // green
    { name: "Tricky", color: "#b0c4ef", emoji: "🟦" }, // blue
    { name: "Trickiest", color: "#ba81c5", emoji: "🟪" }, // purple
  ];

  // ---- Date + week helpers ------------------------------------------------
  function todayKey() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  // ISO-8601 week key like "2026-W28". Groups leaderboards by week.
  function weekKey(dateStr) {
    const d = dateStr ? new Date(dateStr + "T00:00:00") : new Date();
    const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const day = t.getUTCDay() || 7; // Mon=1..Sun=7
    t.setUTCDate(t.getUTCDate() + 4 - day); // nearest Thursday
    const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil(((t - yearStart) / 86400000 + 1) / 7);
    return `${t.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
  }
  function normalizeName(name) {
    return String(name || "").trim().replace(/\s+/g, " ");
  }

  // ---- Demo fallback puzzle (used when Firebase isn't configured) ----------
  const DEMO_PUZZLE = {
    date: todayKey(),
    title: "Family Puzzle #1",
    groups: [
      { level: 0, category: "CAR BRANDS", words: ["FORD", "KIA", "TESLA", "MINI"] },
      { level: 1, category: "SNEAKER BRANDS", words: ["NIKE", "VANS", "FILA", "PUMA"] },
      { level: 2, category: "BIG CATS", words: ["LION", "TIGER", "JAGUAR", "PANTHER"] },
      { level: 3, category: "WILD ___", words: ["CARD", "FIRE", "LIFE", "FLOWER"] },
    ],
  };

  // ---- Puzzle data access -------------------------------------------------
  async function loadActivePuzzle() {
    if (!CONFIGURED) {
      const local = localStorage.getItem("demoPuzzle");
      return local ? JSON.parse(local) : DEMO_PUZZLE;
    }
    await ensureFirebase();
    let activeDate = todayKey();
    const cur = await db.collection("settings").doc("current").get();
    if (cur.exists && cur.data().activePuzzleDate) {
      activeDate = cur.data().activePuzzleDate;
    }
    const snap = await db.collection("puzzles").doc(activeDate).get();
    if (snap.exists) return Object.assign({ date: activeDate }, snap.data());
    return null; // no puzzle published
  }
  async function getPuzzle(dateStr) {
    if (!CONFIGURED) {
      const local = localStorage.getItem("demoPuzzle");
      return local ? JSON.parse(local) : DEMO_PUZZLE;
    }
    await ensureFirebase();
    const snap = await db.collection("puzzles").doc(dateStr).get();
    return snap.exists ? Object.assign({ date: dateStr }, snap.data()) : null;
  }
  async function savePuzzle(puzzle) {
    if (!CONFIGURED) {
      localStorage.setItem("demoPuzzle", JSON.stringify(puzzle));
      return;
    }
    await ensureFirebase();
    await db.collection("puzzles").doc(puzzle.date).set({
      title: puzzle.title || "",
      groups: puzzle.groups,
      updatedAt: serverTimestamp(),
    });
  }
  async function setActivePuzzle(dateStr) {
    if (!CONFIGURED) return;
    await ensureFirebase();
    await db.collection("settings").doc("current").set({ activePuzzleDate: dateStr });
  }
  async function getActivePuzzleDate() {
    if (!CONFIGURED) return todayKey();
    await ensureFirebase();
    const cur = await db.collection("settings").doc("current").get();
    return cur.exists ? cur.data().activePuzzleDate : todayKey();
  }

  // ---- Results / leaderboard ----------------------------------------------
  function resultId(dateStr, name) {
    const safe = normalizeName(name).toLowerCase().replace(/[^a-z0-9]+/g, "_");
    return `${dateStr}__${safe}`;
  }
  async function getExistingResult(dateStr, name) {
    const id = resultId(dateStr, name);
    if (!CONFIGURED) {
      const raw = localStorage.getItem("result_" + id);
      return raw ? JSON.parse(raw) : null;
    }
    await ensureFirebase();
    const snap = await db.collection("results").doc(id).get();
    return snap.exists ? snap.data() : null;
  }
  async function saveResult(o) {
    const id = resultId(o.date, o.name);
    const payload = {
      name: normalizeName(o.name),
      date: o.date,
      week: weekKey(o.date),
      solved: o.solved,
      mistakes: o.mistakes,
      grid: o.grid || "",
      completedAt: CONFIGURED ? serverTimestamp() : Date.now(),
    };
    if (!CONFIGURED) {
      localStorage.setItem("result_" + id, JSON.stringify(payload));
      return;
    }
    await ensureFirebase();
    await db.collection("results").doc(id).set(payload);
  }
  async function getWeekResults(wKey) {
    if (!CONFIGURED) {
      const out = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf("result_") === 0) {
          const r = JSON.parse(localStorage.getItem(k));
          if (r.week === wKey) out.push(r);
        }
      }
      return out;
    }
    await ensureFirebase();
    const qs = await db.collection("results").where("week", "==", wKey).get();
    return qs.docs.map((d) => d.data());
  }

  // ---- Host auth ----------------------------------------------------------
  async function hostSignIn(email, password) {
    await ensureFirebase();
    return auth.signInWithEmailAndPassword(email, password);
  }
  async function hostSignOut() {
    await ensureFirebase();
    return auth.signOut();
  }
  async function onHostAuth(cb) {
    await ensureFirebase();
    auth.onAuthStateChanged(cb);
  }

  return {
    CONFIGURED,
    LEVELS,
    DEMO_PUZZLE,
    todayKey,
    weekKey,
    normalizeName,
    loadActivePuzzle,
    getPuzzle,
    savePuzzle,
    setActivePuzzle,
    getActivePuzzleDate,
    getExistingResult,
    saveResult,
    getWeekResults,
    hostSignIn,
    hostSignOut,
    onHostAuth,
  };
})();
