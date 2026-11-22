# Radia Altilia — Portfolio OS

An interactive portfolio that behaves like a Mac: a lock screen, a calm desktop, a dock, and apps that open full screen, one at a time. The visitor is in control: nothing opens by itself.

Static site, no build step: `index.html`, `styles.css`, `app.js`, `reach.js`, `motion.js`, `flows.js`, `glorious.js`, `assets/`.

## Preview locally

```bash
cd site
python3 -m http.server 8000
# then open http://localhost:8000
```

Open it through a local server (not by double-clicking the file), so images and fonts load the same way as online.

## What is inside

| App (dock) | What it is |
| --- | --- |
| Me | Who Radia is, key facts, LinkedIn button. The dock icon is her face. |
| Claude Code | A chat with prompt chips. Each prompt is handed to one of her agents, whose live session plays next to the chat (Pause, Replay). |
| Sillage Reach | A view-only replica of the product: sidebar navigation, Today, Dialer, Inbox, Campaigns, Performance, Events, Settings, mailbox gauge. Buttons that would change data only show "View only — this is a demo". |
| Data & Scoring | Every tool built in Cargo, drawn as a flow with a record travelling through it. Four groups: Scoring, Enrichment, Pipeline, Knowledge base. |
| CRM & PLG automation | HubSpot-style diagrams: PLG engine (product + Stripe → HubSpot), inbound routing, retention alerts, CRM structure. |
| Glorious Pipeline | Her latest project, shown as a small code editor. A first card explains what it is, then the visitor sets up a company (the only prompt open at first): a guide agent asks a few questions and the files fill in. The other prompts then unlock: send an email on a yes-rule, review a PR, create an agent, score accounts. The setup is remembered in the browser. The kit is private: a LinkedIn button asks for it. |
| Content & Design | Six motion pieces coded in HTML/CSS/GSAP, with a player (play, pause, seek), plus three stills. |
| Captain | A scripted guide (no AI call). It lives in a pill at the bottom right, knows which app is open, and answers "how does this work?" questions about it. |

Also: **⌘K** (or Ctrl+K) search · **Esc** closes what is in front · the glyph menu (top left) and the power icon (top right) log out to a closing screen with the LinkedIn button.

## URLs

| URL | What it does |
| --- | --- |
| `/` | Lock screen. Press **Enter** or click **Open session**. |
| `/?fast=1` | Skips the lock screen. |
| `/?fast=1&quiet=1` | Skips the lock screen, and Captain stays quiet. |
| `/?tour=1` | Hidden recording mode: a scripted tour of about 75 seconds. There is no button for it in the interface. |

## Where to edit name, title and contact

Everything is in one block at the top of `app.js`:

```js
const PROFILE = {
  name: "Radia Altilia",
  initials: "RA",
  title: "Founding Sales",
  tagline: "GTM · Product builder",
  contactUrl: "https://www.linkedin.com/in/radia-altilia-54a807276",
  contactLabel: "linkedin.com/in/radia-altilia-54a807276",
  ...
};
```

- The lock screen, the About window, the phone header and the closing screen all read from it.
- Case-study texts: the `CASES` object in `app.js`.
- Captain's lines: `CAP_CTX` (one intro per app) and `CAP_A` (the answers) in `app.js`.
- Claude Code chat prompts: `CC_PROMPT` and `CC_DONE` in `app.js`.
- Agent sessions: `SCRIPTS` in `app.js` (one function per agent). Tour timing: `tour()`.
- Sillage Reach replica: `reach.js` (the demo people, threads, campaigns and events are at the top of the file).
- Flow diagrams (nodes, connectors, texts): the `SETS` object in `flows.js`.
- Wallpaper and face: `assets/me/wallpaper.webp` and `assets/me/avatar.webp` (replace the files, keep the names).
- Motion pieces: `motion.js` (one `build()` per piece; the tag shown on each tile is the `TAG` constant).
- Also update `<title>` and `<meta name="description">` in `index.html` if the name changes.

## Deploy for free

**GitHub Pages**

1. Create a repository and push the content of `site/` (the `_review/` folder is not needed online).
2. In the repository: Settings → Pages → "Deploy from a branch" → `main` / root.
3. The site is live at `https://<user>.github.io/<repo>/` a minute later.

**Vercel**

1. `npm i -g vercel`, then run `vercel` inside `site/`.
2. Framework preset: "Other". No build command, output directory `.`.

All paths are relative, so the site works at a domain root or in a sub-folder.

## Share preview

- `og.png` (1200 × 630) is the image shown when the link is shared. The Open Graph tags in `index.html` point to `https://radiateurteur.github.io/portfolio/`: change them if the address changes.
- Favicon and touch icon: `assets/me/favicon.png` and `assets/me/apple-touch-icon.png`.

## Notes

- GSAP 3.12.5 is loaded from cdnjs; fonts (Inter, JetBrains Mono, Urbanist) from Google Fonts. Nothing else is external.
- Every person and company shown is fictional. The Sillage Reach replica never sends anything anywhere.
- On a phone, the desktop becomes a stacked feed of cards; the lock screen and the closing screen stay.
- `prefers-reduced-motion` is respected: text appears at once, windows fade, motion pieces stay on a still frame until played.

## Record a video

Open `/?tour=1` in a 1440 × 900 window and record the screen (macOS: ⌘⇧5). The tour is scripted, so every take is the same, and it ends on the closing screen.
