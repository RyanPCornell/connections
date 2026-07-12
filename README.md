# Connections — Family Edition

A [NYT *Connections*](https://www.nytimes.com/games/connections)–style group-the-words
game you can host for friends and family. Players enter their name, solve the puzzle,
and land on a **weekly leaderboard**. You (the host) type in the answers through a
friendly form — no code editing needed.

Everything is plain HTML/CSS/JS, so it runs on **GitHub Pages for free**. Puzzles and
scores are stored in **Firebase** (also free for this scale).

## Pages

| File | Who it's for | What it does |
|------|--------------|--------------|
| `index.html` | Players | Enter name → play the live puzzle. One attempt per person per puzzle. |
| `leaderboard.html` | Everyone | Weekly standings: who solved it, mistakes, who didn't finish. |
| `host.html` | You | Log in, type the four groups/answers, publish the live puzzle. |

## Try it right now (no setup)

**Just double-click `index.html`** to open it in your browser — no server needed.
Until Firebase is connected it runs in **Demo Mode**: a sample puzzle, and results
saved only in your own browser. Great for kicking the tires. Build your own demo
puzzle on `host.html` (no login needed in demo mode).

## Connect Firebase (so everyone shares the same puzzle + leaderboard)

1. **Create a project** at <https://console.firebase.google.com> → *Add project* (free
   "Spark" plan is plenty).
2. **Register a web app**: in the project, click the `</>` icon, give it a nickname,
   and Firebase shows you a `firebaseConfig` snippet.
3. **Paste those values** into `firebase-config.js` (replace every `REPLACE_ME`).
4. **Create the database**: *Build → Firestore Database → Create database* →
   *Production mode*. Then open the **Rules** tab, paste the contents of
   `firestore.rules`, and click **Publish**.
5. **Turn on host login**: *Build → Authentication → Get started →* enable
   **Email/Password**. Then *Authentication → Users → Add user* and create your own
   host email + password. That's your login for `host.html`.

That's it. Reload the pages — the demo banners disappear and everyone now shares the
same puzzles and leaderboard.

## Put it on GitHub Pages

1. Create a repo and upload this whole folder (or push it with git).
2. Repo **Settings → Pages → Build from a branch →** pick `main` / root → **Save**.
3. Your game is live at `https://<your-username>.github.io/<repo-name>/`.
   Share that link. The host page is at `.../host.html`.

> Note: `firebase-config.js` values are *meant* to be public — that's normal for
> Firebase web apps. Your Firestore **rules** are what keep puzzle-writing locked to
> your host login, so make sure you published them in step 4 above.

## How to run a game night

1. Go to `host.html`, sign in.
2. Fill in the four categories easiest→hardest (yellow, green, blue, purple), four
   answers each. Watch the live preview.
3. Click **Save & make it the live puzzle**.
4. Send everyone the `index.html` link. They type their name and play.
5. Check `leaderboard.html` to see how everyone did this week.

## Notes / tweaks

- **One attempt per person per puzzle** is enforced by name — if someone plays under a
  name that already has a result for that puzzle, they see their earlier result instead
  of replaying.
- **Weeks** run Monday–Sunday (ISO weeks) and the leaderboard resets automatically.
- **Colors / difficulty labels** live in `LEVELS` at the top of `shared.js`.
- **Multiple future puzzles**: set different dates in the host form and save each; use
  *Save & make it the live puzzle* to choose which one players see.
