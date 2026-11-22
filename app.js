/* ═══════════════════════════════════════════════════════════
   Radia Altilia — Portfolio OS
   Vanilla JS + GSAP. No build step.
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  /* ───────────────────────────────────────────────────────
     EDIT ME — name, title, contact
     ─────────────────────────────────────────────────────── */
  const PROFILE = {
    name: "Radia Altilia",
    initials: "RA",
    title: "Founding Sales",
    tagline: "GTM · Product builder",
    company: "Sillage",
    year: "2026",
    contactUrl: "https://www.linkedin.com/in/radia-altilia-54a807276",
    contactLabel: "linkedin.com/in/radia-altilia-54a807276",
  };

  /* ───────── helpers ───────── */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const el = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  };
  const Q = new URLSearchParams(location.search);
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MOBILE = matchMedia("(max-width: 760px)").matches;
  const A = "assets/";
  const MB = 28;
  const DOCK = 86;

  /** Cancelable timeline of awaits. Killing it stops every pending step. */
  class Run {
    constructor() {
      this.dead = false;
      this.calls = new Set();
    }
    sleep(s) {
      return new Promise((res) => {
        if (this.dead) return;
        const c = gsap.delayedCall(s, () => {
          this.calls.delete(c);
          if (!this.dead) res();
        });
        this.calls.add(c);
      });
    }
    pause() {
      this.paused = true;
      this.calls.forEach((c) => c.pause());
    }
    resume() {
      this.paused = false;
      this.calls.forEach((c) => c.resume());
    }
    kill() {
      this.dead = true;
      this.calls.forEach((c) => c.kill());
      this.calls.clear();
    }
  }

  /* ───────── mascot (pixel art, drawn here) ───────── */
  const mascot = (w = 28, cls = "") => `
    <svg class="mascot ${cls}" width="${w}" viewBox="-1 -3 16 13" shape-rendering="crispEdges" aria-hidden="true">
      <g class="m-all">
        <rect class="m-leg m-l1" x="2" y="7" width="1" height="2"/><rect class="m-leg m-l2" x="4" y="7" width="1" height="2"/>
        <rect class="m-leg m-l3" x="9" y="7" width="1" height="2"/><rect class="m-leg m-l4" x="11" y="7" width="1" height="2"/>
        <rect class="m-arm m-armL" x="0" y="3" width="2" height="2"/><rect class="m-arm m-armR" x="12" y="3" width="2" height="2"/>
        <rect class="m-body" x="2" y="0" width="10" height="7"/>
        <rect class="m-eye" x="4" y="2" width="1" height="2"/><rect class="m-eye" x="9" y="2" width="1" height="2"/>
      </g>
    </svg>`;
  const setMascot = (root, state) => {
    $$(".mascot", root).forEach((m) => {
      m.classList.remove("is-working", "is-happy");
      if (state) m.classList.add("is-" + state);
    });
  };

  /* ───────── icons ───────── */
  const GLYPH = {
    reach: `<svg viewBox="0 0 24 24"><path d="M21 3L10.5 13.5M21 3l-6.6 18-3.9-7.5L3 9.6z" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
    data: `<svg viewBox="0 0 24 24"><rect x="3" y="13" width="4" height="8" rx="1.2" fill="#e9a23b"/><rect x="10" y="8" width="4" height="13" rx="1.2" fill="#3da5bb"/><rect x="17" y="3" width="4" height="18" rx="1.2" fill="#7fe3b3"/></svg>`,
    crm: `<svg viewBox="0 0 24 24" fill="none" stroke="#5a3200" stroke-width="2" stroke-linecap="round"><circle cx="5" cy="6" r="2.4" fill="#fff8"/><circle cx="5" cy="18" r="2.4" fill="#fff8"/><circle cx="19" cy="12" r="2.8" fill="#fff"/><path d="M7.4 6.6C12 7 12 12 16.2 12M7.4 17.4C12 17 12 12 16.2 12"/></svg>`,
    agents: `<svg viewBox="0 0 24 24"><path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z" fill="#d97757"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" fill="#f4b9a3"/></svg>`,
    content: `<svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="5" fill="#3da5bb"/><rect x="11" y="11" width="10" height="10" rx="2" fill="#d97757"/><path d="M3 21l5-8 5 8z" fill="#16191b"/></svg>`,
    strategy: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#0d3b47" stroke-width="2"/><path d="M15.8 8.2l-2.2 5.4-5.4 2.2 2.2-5.4z" fill="#3da5bb" stroke="#0d3b47" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
    term: `<svg viewBox="0 0 24 24" fill="none" stroke="#7fe3b3" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7l5 5-5 5"/><path d="M12 18h8" stroke="#fff"/></svg>`,
    tour: `<svg viewBox="0 0 24 24"><path d="M8 5.2v13.6a1 1 0 0 0 1.5.9l11-6.8a1 1 0 0 0 0-1.8l-11-6.8A1 1 0 0 0 8 5.2z" fill="#fff"/></svg>`,
  };
  const captainSVG = (w = 34) => `
    <svg width="${w}" viewBox="-1 -6 16 16" shape-rendering="crispEdges" aria-hidden="true">
      <rect x="4" y="-5" width="6" height="2" fill="#fbfaf7"/><rect x="6" y="-4" width="2" height="1" fill="#e9a23b"/>
      <rect x="2" y="-3" width="10" height="2" fill="#0d3b47"/><rect x="1" y="-1" width="12" height="1" fill="#0d3b47"/>
      <g fill="#3da5bb"><rect x="2" y="0" width="10" height="7"/><rect x="0" y="3" width="14" height="2"/><rect x="2" y="7" width="1" height="2"/><rect x="4" y="7" width="1" height="2"/><rect x="9" y="7" width="1" height="2"/><rect x="11" y="7" width="1" height="2"/></g>
      <rect x="4" y="2" width="1" height="2" fill="#082a33"/><rect x="9" y="2" width="1" height="2" fill="#082a33"/>
    </svg>`;
  const tile = (id) => {
    if (id === "about")
      return `<span class="tile tile--about"><span>${PROFILE.initials}</span></span>`;
    if (id === "glorious") return `<span class="tile tile--glorious"><img src="${A}glorious/loki.webp" alt=""></span>`;
    if (id === "captain") return `<span class="tile tile--captain">${captainSVG(30)}</span>`;
    if (id === "claude")
      return `<span class="tile tile--claude">${mascot(30)}</span>`;
    return `<span class="tile tile--${id}">${GLYPH[id]}</span>`;
  };

  /* ═══════════════════════════════════════════════════════
     CONTENT
     ═══════════════════════════════════════════════════════ */
  const SHOTS = [
    {
      src: "today",
      t: "Today review",
      c: "The AI draft on the left; the signal, the person and the company on the right. One click approves the whole sequence.",
    },
    {
      src: "inbox",
      t: "Unified inbox",
      c: "LinkedIn and email replies in one place, replies first. “Meeting booked” creates the deal in the CRM.",
    },
    {
      src: "campaign",
      t: "Campaign",
      c: "A campaign starts from signals, key accounts, a CSV or CRM contacts. Its brief drives every draft.",
    },
    {
      src: "performance",
      t: "Performance",
      c: "One funnel per channel, from message to meeting, in plain numbers. No lone percentages.",
    },
    {
      src: "dialer",
      t: "Power dialer",
      c: "The call, an opener and objection answers on one screen, with the “why now” right next to it.",
    },
    {
      src: "events",
      t: "Events radar",
      c: "An AI watch of GTM events. Say you are going, then add the people you met to a campaign.",
    },
    {
      src: "events-add",
      t: "Add someone you met",
      c: "Paste a LinkedIn URL after the event: the person enters a campaign, and untouchable contacts are skipped automatically.",
      small: 1.25,
    },
    {
      src: "gauge",
      t: "Gamified mailbox gauge",
      c: "Each mailbox has a level and a weekly quest. Volume ramps up step by step and slows down on bounces.",
      small: 1.7,
    },
    {
      src: "onboarding",
      t: "Guided onboarding",
      c: "Client teams connect their accounts, pick a tone of voice and launch a first campaign in minutes.",
    },
    {
      src: "captain",
      t: "Captain, the AI assistant",
      c: "In the app and in Slack: answers on campaigns, drafts new ones with a preview first, sends health alerts.",
      small: 0.72,
    },
  ];

  const VISUALS = [
    { src: "decoder", t: "Every line is a signal", c: "LinkedIn post · decoding a job post as a buying signal." },
    { src: "champion-signal-v2", t: "Champion tracking", c: "LinkedIn post · a champion changes company: one risk, one opportunity." },
    { src: "ai-team", t: "The AI team", c: "LinkedIn post · the agents that run next to the sales team." },
  ];

  const AGENTS = [
    {
      id: "jinx",
      name: "Jinx",
      role: "visual creator",
      desc: "Turns a brief into on-brand visuals, static or animated. Brainstorms three concepts, picks one, renders it, runs a QA checklist.",
      pane: 292,
      slot: 0,
    },
    {
      id: "captain",
      name: "Captain Jack",
      role: "sequencer keeper",
      desc: "Keeps the outbound cockpit running: answers questions, checks production health, ships changes through three automated reviews.",
      pane: 300,
      slot: 1,
    },
    {
      id: "cargo",
      name: "Cargo",
      role: "ICP scorer",
      desc: "Scores every account on a 7-axis grid. The agent gathers the facts, a deterministic script computes the score.",
      pane: 404,
      slot: 2,
    },
    {
      id: "router",
      name: "Inbound router",
      role: "PLG engine",
      desc: "Scores each sign-up, updates the CRM and pings sales in Slack when a product-qualified lead shows up.",
      pane: 318,
      slot: 3,
    },
    {
      id: "vegas",
      name: "Mr. New Vegas",
      role: "product storyteller",
      desc: "Turns the week's shipped work into the right story: client email, changelog, LinkedIn angle. Never sends anything itself.",
      pane: 330,
      slot: 0,
    },
  ];
  const agentById = (id) => AGENTS.find((a) => a.id === id);

  const CASES = {
    reach: {
      name: "Sillage Reach",
      sub: "Product build",
      kicker: "Product build · Sept → Nov 2026",
      title: "An outbound cockpit, from <em>signal</em> to meeting.",
      lede: "A full-stack product I designed, built with Claude Code agents and put in production.",
      problem:
        "The GTM team juggled a sequencer, manual LinkedIn, the CRM, a dialer and spreadsheets. The buying signals our product detected never reached the right message at the right time.",
      built: [
        "<b>Today</b>: every lead to review with its AI draft and its context. One click approves.",
        "<b>LinkedIn + email sequences</b> triggered by signals, with an LLM draft per signal type, in each rep's tone.",
        "<b>One inbox</b> for both channels, a <b>power dialer</b>, and a <b>performance</b> funnel in plain numbers.",
        "<b>Captain</b>, an AI assistant in Slack and in the app, with tool calling.",
        "<b>Two-way HubSpot sync</b>: contacts, companies, emails, LinkedIn messages, calls, deals.",
        "<b>Guardrails first</b>: customers and open deals are never contacted, send times follow the prospect's time zone and public holidays, GDPR built in.",
        "<b>Deliverability</b>: progressive mailbox warm-up, turned into levels and weekly quests.",
        "<b>Multi-tenant</b>, with a guided onboarding for client teams.",
      ],
      how: [
        "Claude Code agents wrote the code in parallel, each in its own copy of the project.",
        "Three reviewer agents (security, architecture, spec) read every change before merge.",
        "A before/after mock-up was validated before any daily screen was redesigned.",
      ],
      stack: [
        "Next.js",
        "Postgres",
        "Claude Code",
        "Unipile",
        "HubSpot API",
        "Ringover",
        "Slack",
        "OpenRouter",
        "Coolify",
        "Playwright",
      ],
      outcome:
        "In production since November 2026 and used every day by the GTM team. Then opened to client teams as a paid add-on.",
      viz: "gallery",
      w: 1140,
      h: 730,
    },
    data: {
      name: "Data & Scoring",
      sub: "ICP · TAM · lists",
      kicker: "Data & scoring",
      title: "Who should sales call <em>first</em>?",
      lede: "A scoring system built on deal data instead of gut feeling.",
      problem:
        "The old scoring put almost a third of the base in the top tier and ranked off-target accounts first. Sales could not tell who to call first.",
      built: [
        "<b>ICP analysis of 218 deals</b> (won, lost, churned) to find what separates customers who stay from those who leave.",
        "<b>A 7-axis scoring grid out of 100</b>, with knock-out gates applied before any points.",
        "<b>A Cargo agent gathers the facts</b> (Sales Navigator, job posts, an LLM for the fuzzy criteria); <b>a deterministic script computes the score</b>.",
        "<b>Tiers written to HubSpot</b>: Gold, Silver, Bronze, Excluded, with the exclusion reason.",
        "<b>An audit of the existing TAM</b>: duplicates, unjustified top tiers, two scales in one column. A backup before every bulk write.",
        "<b>A call-ready list for a new UK/US rep</b>, built in two days: strict persona, verified country, enriched phone and email.",
      ],
      stack: [
        "Cargo",
        "HubSpot API",
        "Sales Navigator",
        "FullEnrich",
        "LLM node + JavaScript",
        "Python",
        "Claude Code + MCP",
      ],
      outcome:
        "8,000 accounts scored and tiered in the CRM. Company size turned out to be the best predictor of churn, and became a knock-out gate.",
      viz: "data",
      w: 1080,
      h: 730,
    },
    crm: {
      name: "CRM & PLG automation",
      sub: "HubSpot · Cargo · n8n",
      kicker: "Automation, CRM & PLG",
      title: "Every sign-up scored and routed, <em>hands-free</em>.",
      lede: "The plumbing between the product, the CRM and the sales team.",
      problem:
        "Self-serve sign-ups landed in the CRM unqualified. A workflow action never returned its answer, so good leads were silently lost.",
      built: [
        "<b>Product events</b> (sign-up, payment, cancellation) synced to HubSpot.",
        "<b>Automatic ICP scoring</b> of each sign-up by a Cargo agent, written to a CRM field.",
        "<b>PQL routing</b> to onboarding or to a demo, with Slack alerts. Six workflows, no manual step.",
        "<b>Retention alerts</b> on plan change, cancelled trial and churn.",
        "<b>n8n workflows</b>: automated target-account lists, Slack notifications, HubSpot sync.",
        "<b>HubSpot overhaul</b>: account ownership, lead status taxonomy, deduplication, bulk updates through the API.",
        "<b>One-click phone lookup</b>: a checkbox in HubSpot triggers an enrichment waterfall.",
      ],
      stack: [
        "HubSpot workflows",
        "HubSpot API",
        "Cargo",
        "n8n",
        "Slack",
        "FullEnrich",
      ],
      outcome:
        "Out-of-target sign-ups stay quiet. Everything else reaches the right person within minutes, with the score attached.",
      viz: "crm",
      w: 1080,
      h: 730,
    },
    content: {
      name: "Content & Design",
      sub: "Motion · visuals",
      kicker: "Content & design",
      title: "Motion that <em>explains</em>, in the time of a scroll.",
      lede: "I brief, choose and iterate. Claude builds. Every piece on the right is code, not video.",
      problem: "No designer on the team: every visual took hours and came out generic.",
      built: [
        "<b>Six motion pieces</b>, 8 to 12 seconds each, coded in HTML, CSS and GSAP timelines. Click one to watch it.",
        "<b>About 35 visual projects at Sillage</b>: posts, carousels, GIFs and MP4s, event material, made with my visual agent.",
        "<b>Art-direction rules</b>: one palette, realistic interface mock-ups rather than posters, never a competitor's name.",
        "<b>A reusable visual library</b> in slide format to explain the product.",
      ],
      stack: ["HTML/CSS", "GSAP", "SVG", "Playwright", "HyperFrames", "Claude Code"],
      outcome: "Brand visuals in minutes instead of hours, and a pipeline the whole team now builds on.",
      viz: "content",
    },
    glorious: { name: "Glorious Pipeline", sub: "Latest project", viz: "glorious" },
  };

  const APPS = [
    { id: "about", name: "Me", type: "about" },
    { id: "claude", name: "Claude Code", type: "claude" },
    ...Object.keys(CASES).map((id) => ({ id, name: CASES[id].name, type: "case" })),
  ];
  const appById = (id) => APPS.find((a) => a.id === id);
  const DOCK_ITEMS = ["about", "claude", "reach", "data", "crm", "content", "glorious", "|", "captain"];
  const DOCK_NAMES = { captain: "Captain · your guide" };

  /* ───────── case-study HTML ───────── */
  const caseTextHTML = (id) => {
    const c = CASES[id];
    return `
      <div class="cs__text">
        <span class="cs__kicker">${c.kicker}</span>
        <h2>${c.title}</h2>
        <p class="cs__lede">${c.lede}</p>
        <h3>The problem</h3><p>${c.problem}</p>
        <h3>What I built</h3><ul>${c.built.map((b) => `<li>${b}</li>`).join("")}</ul>
        ${c.how ? `<h3>How</h3><ul>${c.how.map((b) => `<li>${b}</li>`).join("")}</ul>` : ""}
        <h3>Stack</h3><div class="chips">${c.stack.map((x) => `<span class="chip">${x}</span>`).join("")}</div>
        <div class="outcome"><small>Outcome</small>${c.outcome}</div>
      </div>`;
  };
  const caseHTML = (id) =>
    CASES[id].built
      ? `<div class="cs" data-case="${id}">${caseTextHTML(id)}<div class="cs__viz">${VIZ[CASES[id].viz]()}</div></div>`
      : `<div class="cs cs--single cs--app" data-case="${id}"><div class="cs__viz">${VIZ[CASES[id].viz]()}</div></div>`;

  const VIZ = {
    gallery: () => `
      <div class="gal">
        <div class="gal__stage">
          <button class="gal__nav gal__nav--p" aria-label="Previous screenshot">‹</button>
          <div class="gal__frame" role="button" tabindex="0" aria-label="Enlarge screenshot">
            <div class="gal__chrome"><i></i><i></i><i></i><span>Sillage Reach · demo workspace, fictional data</span></div>
            <img alt="">
          </div>
          <button class="gal__nav gal__nav--n" aria-label="Next screenshot">›</button>
        </div>
        <div class="gal__cap"><b></b><span></span><em class="gal__n"></em></div>
        <div class="gal__thumbs">${SHOTS.map((s, i) => `<button data-i="${i}" aria-label="${s.t}"><img src="${A}reach/${s.src}.webp" alt="" loading="lazy"></button>`).join("")}</div>
      </div>`,
    data: () => {
      const axes = [
        ["Company size", 90],
        ["GTM operator in post", 100],
        ["Outbound tool in use", 100],
        ["Market", 80],
        ["Buyers active on LinkedIn", 85],
        ["SDR / BDR team", 100],
        ["Open GTM roles", 90],
      ];
      return `
      <div class="viz-pad">
        <div class="flows" data-set="data"></div>
        <h4 class="show__h">The grid behind the score</h4>
        <div class="card">
          <h4>7-axis grid · example account <span>Northwind · <b data-count="92">0</b>/100 · Gold</span></h4>
          ${axes.map(([n, v]) => `<div class="axis-row"><span>${n}</span><div class="trk"><i data-w="${v}"></i></div><em></em></div>`).join("")}
        </div>
        <div class="card">
          <h4>Knock-out gates · checked before any points</h4>
          <div class="gates">${["Not B2B", "Offline sector", "Too small", "Outside the region", "Not independent", "Deal already open"].map((g) => `<span class="gate">✕ ${g}</span>`).join("")}</div>
        </div>
        <div class="tiers">
          <div class="tier tier--gold"><b>Gold</b>Call first</div>
          <div class="tier tier--silver"><b>Silver</b>Sequence</div>
          <div class="tier tier--bronze"><b>Bronze</b>Nurture</div>
          <div class="tier tier--excluded"><b>Excluded</b>Reason kept</div>
        </div>
        <div class="card card--two">
          <div class="bignum"><b data-count="8000">0</b><span>accounts scored<br>and tiered in the CRM</span></div>
          <div class="bignum"><b data-count="218">0</b><span>deals analysed: company<br>size predicts churn</span></div>
        </div>
      </div>`;
    },
    crm: () => `
      <div class="viz-pad">
        <div class="flows" data-set="crm"></div>
        <div class="card">
          <h4>What sales sees</h4>
          <div class="slackmsg">
            <div class="av">🔔</div>
            <div><b>Inbound router <small>APP · 10:42</small></b>
              <p><b>New PQL</b> · Halloway · <b>Gold</b> (84/100)<br>Signed up 2 minutes ago, trial started → <b>book a demo</b></p>
              <div class="btns"><span>Open in HubSpot</span><span>Assign to me</span></div>
            </div>
          </div>
        </div>
        <div class="card">
          <h4>Also running</h4>
          <div class="lane" style="grid-template-columns:1fr 1fr;gap:8px">
            <div class="lnode"><span class="tag tag--n8">n8n</span><b>Target-account lists</b>Fed automatically, with Slack notifications and HubSpot sync</div>
            <div class="lnode"><span class="tag tag--hs">HubSpot API</span><b>CRM overhaul</b>Ownership, lead status taxonomy, deduplication, bulk updates</div>
            <div class="lnode"><span class="tag tag--sl">Slack</span><b>Retention alerts</b>Plan change, cancelled trial, churn</div>
            <div class="lnode"><span class="tag tag--cg">Cargo</span><b>One-click phone</b>A checkbox in HubSpot triggers an enrichment waterfall</div>
          </div>
        </div>
      </div>`,
    glorious: () => `<div class="glo-host"></div>`,
    content: () => `
      <div class="show">
        <div class="show__grid">
          ${Motion.pieces.map((p, i) => `<button class="mo-tile" data-i="${i}" aria-label="Play ${p.title}"><div class="mo-fit"></div><span class="mo-tile__play">▶</span><span class="mo-tile__f"><b>${p.title}</b><small>${p.tag}</small></span></button>`).join("")}
        </div>
        <h4 class="show__h">Stills · made at Sillage with Jinx, my visual agent (HTML/CSS → PNG)</h4>
        <div class="show__stills">
          ${VISUALS.map((v, i) => `<button data-still="${i}" aria-label="${v.t}"><img src="${A}visuals/${v.src}.webp" alt="${v.t}. ${v.c}" loading="lazy"></button>`).join("")}
        </div>
      </div>`,
  };

  const aboutHTML = () => `
    <div class="about">
      <div class="about__side">
        <div class="avatar avatar--lg"><span>${PROFILE.initials}</span></div>
        <h2>${PROFILE.name}</h2>
        <p>${PROFILE.title}<br>${PROFILE.tagline}</p>
        <a class="cta" href="${PROFILE.contactUrl}" target="_blank" rel="noopener">Connect on LinkedIn ↗</a>
        <button class="cta cta--ghost" data-act="claude">Watch the agents work</button>
        <span class="mini">${PROFILE.contactLabel}</span>
      </div>
      <div class="about__main">
        <section class="fast" aria-label="30-second version">
          <span class="fast__k">30-second version</span>
          <p><b>${PROFILE.name}</b> is a founding sales who builds her own GTM tools with AI agents. In one year at ${PROFILE.company} she sold, then built what the sales team was missing:</p>
          <ul>
            <li><b>Sillage Reach</b>, an outbound cockpit in production: signals in, meetings out.</li>
            <li><b>Scoring and enrichment tools in Cargo</b>: a whole market scored and tiered, contacts verified before any spend.</li>
            <li><b>HubSpot and PLG automation</b>: every sign-up scored and routed with no manual step.</li>
            <li><b>AI agents with Claude Code</b> that the team still runs every week.</li>
            <li><b>Glorious Pipeline</b>, her latest project: that whole agentic workspace, packaged as a kit any GTM team can install.</li>
          </ul>
          <div class="chips">${["Claude Code", "Cargo", "HubSpot", "n8n", "Next.js / Postgres", "GSAP"].map((x) => `<span class="chip">${x}</span>`).join("")}</div>
          <a class="cta fast__cta" href="${PROFILE.contactUrl}" target="_blank" rel="noopener">Connect on LinkedIn ↗</a>
        </section>
        <h2>I sell, then I build what the <em>sales team</em> is missing.</h2>
        <p>I joined ${PROFILE.company}, a B2B buying-signal startup, as founding sales. I built the outbound cycle from scratch and ran a portfolio of 132 tech accounts, from qualification through to signature.</p>
        <p>Then I started building: a scoring system for the whole market, the automation between the product and the CRM, a handful of AI agents, and finally a full outbound product, designed and shipped with Claude Code.</p>
        <p>I work where sales meets engineering. I know what a rep needs on a Monday morning, and I can have it in production by Friday.</p>
        <div class="facts">
          <div class="fact"><b>132</b>tech accounts, from qualification to signature</div>
          <div class="fact"><b>8,000</b>accounts scored on a 7-axis ICP grid</div>
          <div class="fact"><b>1</b>product in production, sold as a paid add-on</div>
        </div>
        <h3>Toolbelt</h3>
        <div class="chips">${["Claude Code", "Cargo", "HubSpot", "n8n", "Sales Navigator", "FullEnrich", "Unipile", "Next.js / Postgres", "Playwright", "GSAP", "Notion", "Slack", "Coolify"].map((s) => `<span class="chip">${s}</span>`).join("")}</div>
        <h3>This portfolio</h3>
        <p style="color:var(--grey);font-size:12.6px">The Sillage Reach app here is a view-only replica with fictional data. Company names in the animations are invented. Try <b>⌘K</b>, or ask <b>Captain</b> in the dock.</p>
      </div>
    </div>`;

  /* ═══════════════════════════════════════════════════════
     NOTIFICATIONS
     ═══════════════════════════════════════════════════════ */
  function notify({ icon = mascot(26), cls = "", title, body, ttl = 5.2 }) {
    if (MOBILE) return;
    const t = el(
      `<div class="toast" role="status"><div class="toast__ic ${cls}">${icon}</div><div><div class="toast__h"><span>${title}</span><time>now</time></div><div class="toast__b">${body}</div></div></div>`,
    );
    $("#toasts").prepend(t);
    const out = () => {
      if (t._gone) return;
      t._gone = true;
      gsap.to(t, {
        x: 380,
        opacity: 0,
        duration: RM ? 0.01 : 0.35,
        ease: "power2.in",
        onComplete: () =>
          gsap.to(t, {
            height: 0,
            padding: 0,
            margin: 0,
            duration: 0.2,
            onComplete: () => t.remove(),
          }),
      });
    };
    gsap.fromTo(
      t,
      { x: 380, opacity: 0 },
      { x: 0, opacity: 1, duration: RM ? 0.01 : 0.6, ease: "expo.out" },
    );
    gsap.delayedCall(ttl, out);
    t.addEventListener("click", out);
    return t;
  }

  /* ═══════════════════════════════════════════════════════
     WINDOW MANAGER
     ═══════════════════════════════════════════════════════ */
  const wins = new Map();
  let zTop = 20;
  const dockIcon = (app) => $(`#dk-${app.id}`);
  const refreshDock = () => {
    $$(".dk:not(#dk-captain)").forEach((d) => d.classList.remove("is-running"));
    wins.forEach((w) => dockIcon(w.app)?.classList.add("is-running"));
  };
  const originDelta = (w) => {
    const ic = dockIcon(w.app)?.getBoundingClientRect();
    if (!ic) return { x: 0, y: 200 };
    const n = w.el;
    return {
      x: ic.left + ic.width / 2 - (n.offsetLeft + n.offsetWidth / 2),
      y: ic.top + ic.height / 2 - (n.offsetTop + n.offsetHeight / 2),
    };
  };
  const FULL = "polygon(0% 0%,100% 0%,100% 100%,0% 100%)";
  const GENIE = "polygon(0% 0%,100% 0%,58% 100%,42% 100%)";

  function focusWin(w) {
    if (!w || w.min) return;
    wins.forEach((o) => o.el.classList.toggle("is-focused", o === w));
    w.el.style.zIndex = ++zTop;
    $("#mbApp").textContent = w.app.name;
  }
  const topWin = () => [...wins.values()].find((w) => !w.min);
  const refocus = () => {
    const t = topWin();
    if (t) focusWin(t);
    else $("#mbApp").textContent = PROFILE.name;
  };

  /** Opens an app maximised. Any other open app is closed first: one app at a time. */
  function openApp(id, opts = {}) {
    const app = appById(id);
    if (!app) return null;
    closeCaptain();
    let w = wins.get(id);
    [...wins.values()].forEach((o) => o !== w && closeWin(o));
    if (w) {
      if (w.min) restoreWin(w);
      else focusWin(w);
      if (opts.agent) w.api.select(opts.agent);
      captainContext(id);
      return w;
    }
    const dark = app.type === "claude" || id === "glorious";
    const title =
      app.type === "claude"
        ? `${mascot(24)}<span><b>Claude Code</b> <span class="sep">·</span> <span class="role">agents at work</span></span>`
        : app.type === "case"
          ? `${app.name} <small>— ${CASES[id].sub}</small>`
          : app.name;
    const node = el(`
      <section class="win win--${dark ? "dark" : "light"}" role="dialog" aria-label="${app.name}" data-app="${id}">
        <header class="win__bar">
          <div class="lights">
            <button class="l-c" aria-label="Close window"><svg viewBox="0 0 8 8"><path d="M1.5 1.5l5 5M6.5 1.5l-5 5"/></svg></button>
            <button class="l-m" aria-label="Minimise window"><svg viewBox="0 0 8 8"><path d="M1.2 4h5.6"/></svg></button>
            <button class="l-z" aria-label="Resize window"><svg viewBox="0 0 8 8"><path d="M1.2 4h5.6M4 1.2v5.6"/></svg></button>
          </div>
          <div class="win__title">${title}</div>
        </header>
        <div class="win__body"></div>
      </section>`);
    $("#windows").appendChild(node);
    w = { id, app, el: node, body: $(".win__body", node), min: false, api: {} };
    wins.set(id, w);
    captainContext(id);

    if (id === "reach") {
      w.api = ReachApp.mount(w.body, { about: caseTextHTML("reach") });
    } else if (app.type === "case") {
      w.body.innerHTML = caseHTML(id);
      initCase(w, w.body);
    } else if (app.type === "about") {
      w.body.innerHTML = aboutHTML();
      bindActs(w.body);
    } else if (app.type === "claude") initClaude(w, opts.agent);

    const resize = () => node.classList.toggle("is-small");
    $(".l-c", node).addEventListener("click", () => closeWin(w));
    $(".l-m", node).addEventListener("click", () => minimiseWin(w));
    $(".l-z", node).addEventListener("click", resize);
    $(".win__bar", node).addEventListener("dblclick", (e) => !e.target.closest(".lights") && resize());

    focusWin(w);
    refreshDock();
    const d = originDelta(w);
    if (RM) gsap.fromTo(node, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    else
      gsap.fromTo(
        node,
        { x: d.x, y: d.y, scale: 0.06, opacity: 0, clipPath: GENIE },
        { x: 0, y: 0, scale: 1, opacity: 1, clipPath: FULL, duration: 0.7, ease: "expo.out", clearProps: "clipPath,transform" },
      );
    return w;
  }

  function closeWin(w, quick) {
    if (!wins.has(w.id)) return;
    w.run?.kill();
    w.ro?.disconnect();
    w.dispose?.();
    wins.delete(w.id);
    refreshDock();
    gsap.killTweensOf(w.el);
    gsap.to(w.el, { scale: 0.96, opacity: 0, duration: quick || RM ? 0.12 : 0.24, ease: "power2.in", onComplete: () => w.el.remove() });
    refocus();
    captainContext(topWin()?.id);
  }
  function minimiseWin(w) {
    if (w.min) return;
    w.min = true;
    const d = originDelta(w);
    w.el.classList.remove("is-focused");
    if (RM) gsap.to(w.el, { opacity: 0, duration: 0.15, onComplete: () => (w.el.style.visibility = "hidden") });
    else
      gsap.to(w.el, { x: d.x, y: d.y, scale: 0.05, opacity: 0, clipPath: GENIE, duration: 0.52, ease: "power3.in", onComplete: () => (w.el.style.visibility = "hidden") });
    refocus();
  }
  function restoreWin(w) {
    w.min = false;
    w.el.style.visibility = "";
    gsap.killTweensOf(w.el);
    if (RM) gsap.to(w.el, { opacity: 1, duration: 0.15 });
    else gsap.to(w.el, { x: 0, y: 0, scale: 1, opacity: 1, clipPath: FULL, duration: 0.55, ease: "expo.out", clearProps: "clipPath,transform" });
    focusWin(w);
  }
  const closeAll = (quick) =>
    [...wins.values()].forEach((w) => closeWin(w, quick));

  function bindActs(root) {
    $$("[data-act]", root).forEach((b) =>
      b.addEventListener("click", () => act(b.dataset.act)),
    );
  }
  function act(name) {
    if (name === "lock") lockScreen();
    else if (name === "logout") logout();
    else if (name === "spotlight") openSpotlight();
    else if (name === "contact") window.open(PROFILE.contactUrl, "_blank", "noopener");
    else openApp(name);
  }

  /* ───────── case-study behaviour ───────── */
  function countUp(node, dur = 1.4, delay = 0) {
    const to = +node.dataset.count;
    const o = { v: 0 };
    gsap.to(o, {
      v: to,
      duration: RM ? 0.01 : dur,
      delay,
      ease: "power2.out",
      onUpdate: () =>
        (node.textContent = Math.round(o.v).toLocaleString("en-US")),
    });
  }
  function initCase(w, root) {
    const id = $(".cs", root).dataset.case;
    const viz = $(".cs__viz", root);
    if (!RM && !MOBILE) {
      gsap.from($$(".cs__text > *", root), {
        opacity: 0,
        y: 14,
        duration: 0.5,
        stagger: 0.045,
        delay: 0.25,
        ease: "power2.out",
      });
      gsap.from($$(".card, .tiers, .persona, .vgrid button", viz), {
        opacity: 0,
        y: 22,
        scale: 0.97,
        duration: 0.55,
        stagger: 0.06,
        delay: 0.35,
        ease: "power3.out",
        clearProps: "transform",
      });
    }
    $$("[data-w]", viz).forEach((b, i) =>
      gsap.to(b, {
        width: b.dataset.w + "%",
        duration: RM ? 0.01 : 0.9,
        delay: 0.7 + i * 0.08,
        ease: "power3.out",
      }),
    );
    $$("[data-count]", viz).forEach((n) => countUp(n, 1.6, 0.7));
    $$("[data-agent]", viz).forEach((b) =>
      b.addEventListener("click", () =>
        MOBILE
          ? $(`#fa-${b.dataset.agent}`)?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            })
          : launchAgent(b.dataset.agent),
      ),
    );
    if (id === "content") initShowcase(w, viz);
    if (id === "glorious") {
      welcomeCall?.kill(); // Captain would cover the prompts the tour points at
      closeCaptain();
      const glo = Glorious.mount($(".glo-host", viz), { url: PROFILE.contactUrl });
      w.api.glo = glo;
      w.dispose = glo.dispose;
    }
    const flows = $$(".flows", viz).map((f) => Flows.mountSet(f, f.dataset.set));
    if (flows.length) {
      w.api.flow = flows[0];
      w.dispose = () => flows.forEach((f) => f.dispose());
    }
    if (id === "reach") initGallery(w, viz);
  }

  /** Motion showcase: live tiles (paused on a poster frame, playing on hover) + a player. */
  function initShowcase(w, viz) {
    const mounts = $$(".mo-tile", viz).map((t) => {
      const p = Motion.pieces[+t.dataset.i], m = Motion.mount($(".mo-fit", t), p);
      m.tl.progress(p.poster).pause();
      if (!RM && !MOBILE) {
        t.addEventListener("mouseenter", () => m.tl.play());
        t.addEventListener("mouseleave", () => m.tl.pause());
      }
      t.addEventListener("click", () => openPlayer(+t.dataset.i));
      return m;
    });
    $$("[data-still]", viz).forEach((b) => b.addEventListener("click", () => { const v = VISUALS[b.dataset.still]; quickLook(`${A}visuals/${v.src}.webp`, `${v.t} — ${v.c}`); }));
    w.dispose = () => mounts.forEach((m) => m.destroy());
  }

  let player = null;
  function openPlayer(i) {
    closePlayer(true);
    const p = Motion.pieces[i];
    const node = el(`
      <div id="player" role="dialog" aria-label="${p.title}">
        <div class="pl">
          <div class="pl__box"><div class="mo-fit"></div></div>
          <div class="pl__bar">
            <button class="pl__pp" aria-label="Pause">❚❚</button>
            <div class="pl__trk" role="slider" aria-label="Progress" aria-valuemin="0" aria-valuemax="100"><i></i></div>
            <div class="pl__meta"><b>${p.title}</b><small>${p.tag}</small></div>
            <button class="pl__x" aria-label="Close">×</button>
          </div>
          <p class="pl__desc">${p.desc} Coded in HTML, CSS and a GSAP timeline, not a rendered video.</p>
        </div>
      </div>`);
    document.body.appendChild(node);
    const m = Motion.mount($(".mo-fit", node), p), pp = $(".pl__pp", node), bar = $(".pl__trk i", node);
    const sync = () => { pp.textContent = m.tl.paused() ? "▶" : "❚❚"; pp.setAttribute("aria-label", m.tl.paused() ? "Play" : "Pause"); };
    m.tl.eventCallback("onUpdate", () => (bar.style.width = m.tl.progress() * 100 + "%"));
    const toggle = () => { m.tl.paused(!m.tl.paused()); sync(); };
    pp.addEventListener("click", toggle);
    $(".pl__trk", node).addEventListener("click", (e) => { const r = e.currentTarget.getBoundingClientRect(); m.tl.progress(Math.min(0.999, Math.max(0, (e.clientX - r.left) / r.width))); });
    $(".pl__x", node).addEventListener("click", () => closePlayer());
    node.addEventListener("click", (e) => e.target === node && closePlayer());
    player = { node, m, toggle };
    if (RM) m.tl.progress(p.poster).pause();
    else {
      m.tl.play(0);
      gsap.fromTo(node, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo($(".pl", node), { scale: 0.92, y: 18 }, { scale: 1, y: 0, duration: 0.5, ease: "expo.out" });
    }
    sync();
    pp.focus({ preventScroll: true });
  }
  function closePlayer(now) {
    if (!player) return false;
    const { node, m } = player;
    player = null;
    const end = () => { m.destroy(); node.remove(); };
    if (now || RM) end();
    else gsap.to(node, { opacity: 0, duration: 0.2, onComplete: end });
    return true;
  }

  function initGallery(w, viz) {
    const stg = $(".gal__stage", viz),
      frame = $(".gal__frame", viz),
      img = $("img", frame);
    const cap = $(".gal__cap", viz),
      thumbs = $$(".gal__thumbs button", viz);
    let cur = -1;
    const fit = () => {
      const s = SHOTS[cur];
      if (!s || !img.naturalWidth) return;
      const sw = stg.clientWidth,
        sh = MOBILE ? 1e4 : stg.clientHeight - 24;
      const k = Math.min(
        sw / img.naturalWidth,
        sh / img.naturalHeight,
        s.small || 1,
      );
      frame.style.width = Math.round(img.naturalWidth * k) + "px";
      img.style.width = "100%";
      img.style.height = Math.round(img.naturalHeight * k) + "px";
    };
    const show = (i, dir = 1) => {
      i = (i + SHOTS.length) % SHOTS.length;
      if (i === cur) return;
      cur = i;
      const s = SHOTS[i];
      thumbs.forEach((t, k) => t.classList.toggle("on", k === i));
      const strip = thumbs[i].parentNode;
      strip.scrollTo({ left: thumbs[i].offsetLeft - strip.clientWidth / 2 + 42, behavior: RM ? "auto" : "smooth" });
      const swap = () => {
        img.onload = () => {
          fit();
          if (!RM)
            gsap.fromTo(
              frame,
              { opacity: 0, x: 26 * dir, scale: 0.985 },
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 0.45,
                ease: "power3.out",
              },
            );
          else gsap.set(frame, { opacity: 1 });
        };
        img.src = `${A}reach/${s.src}.webp`;
        img.alt = `${s.t}. ${s.c}`;
        $("b", cap).textContent = s.t;
        $("span", cap).textContent = s.c;
        $(".gal__n", cap).textContent = `${i + 1} / ${SHOTS.length}`;
        if (!RM)
          gsap.fromTo(
            [$("b", cap), $("span", cap)],
            { opacity: 0, y: 6 },
            { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 },
          );
      };
      if (RM || !img.src) swap();
      else
        gsap.to(frame, {
          opacity: 0,
          x: -20 * dir,
          duration: 0.16,
          ease: "power2.in",
          onComplete: swap,
        });
    };
    thumbs.forEach((t) =>
      t.addEventListener("click", () =>
        show(+t.dataset.i, +t.dataset.i > cur ? 1 : -1),
      ),
    );
    $(".gal__nav--p", viz).addEventListener("click", () => show(cur - 1, -1));
    $(".gal__nav--n", viz).addEventListener("click", () => show(cur + 1, 1));
    const zoom = () => quickLook(img.src, `${SHOTS[cur].t} — ${SHOTS[cur].c}`);
    frame.addEventListener("click", zoom);
    frame.addEventListener("keydown", (e) => e.key === "Enter" && zoom());
    w.ro = new ResizeObserver(() => requestAnimationFrame(fit));
    w.ro.observe(stg);
    w.api.show = show;
    w.api.next = () => show(cur + 1, 1);
    w.api.prev = () => show(cur - 1, -1);
    show(0);
  }

  function quickLook(src, caption) {
    const q = $("#quicklook");
    $("img", q).src = src;
    $("img", q).alt = caption;
    $("figcaption", q).textContent = caption;
    q.hidden = false;
    if (!RM) {
      gsap.fromTo(q, { opacity: 0 }, { opacity: 1, duration: 0.22 });
      gsap.fromTo(
        $("figure", q),
        { scale: 0.9, y: 16 },
        { scale: 1, y: 0, duration: 0.42, ease: "expo.out" },
      );
    }
  }
  function closeQuickLook() {
    const q = $("#quicklook");
    if (q.hidden) return false;
    gsap.to(q, {
      opacity: 0,
      duration: RM ? 0.01 : 0.18,
      onComplete: () => {
        q.hidden = true;
        gsap.set(q, { opacity: 1 });
      },
    });
    return true;
  }

  /* ═══════════════════════════════════════════════════════
     AGENTS — scripted, deterministic
     ═══════════════════════════════════════════════════════ */
  const termHTML = () => `
    <div class="term">
      <div class="term__log"><div class="term__lines"></div></div>
      <div class="term__pane"><div class="pane-empty">waiting for a task…</div></div>
    </div>`;

  function makeTerm(root, run) {
    const lines = $(".term__lines", root);
    const add = (cls, html) => {
      const d = document.createElement("div");
      d.className = "tl " + cls;
      d.innerHTML = html;
      lines.appendChild(d);
      while (lines.children.length > 40) lines.firstChild.remove();
      const lg = lines.parentNode;
      lg.scrollTop = lg.scrollHeight;
      lg.classList.toggle("is-scrolled", lg.scrollTop > 2);
      if (!RM)
        gsap.from(d, { opacity: 0, y: 5, duration: 0.25, ease: "power2.out" });
      return d;
    };
    return {
      add,
      async prompt(text) {
        const d = add(
          "tl--prompt",
          `<span class="ps">❯</span><span class="tx"></span><span class="cur"></span>`,
        );
        const tx = $(".tx", d);
        if (RM) {
          tx.textContent = text;
          await run.sleep(text.length * 0.026);
        } else
          for (let i = 0; i < text.length; i += 2) {
            tx.textContent = text.slice(0, i + 2);
            await run.sleep(0.052);
          }
        $(".cur", d).remove();
        await run.sleep(0.4);
      },
      async tool(name, arg, dur = 1, res) {
        const d = add(
          "tl--tool",
          `<span class="dot">●</span><b>${name}</b>${arg ? `<span class="arg">(${arg})</span>` : ""}`,
        );
        const dot = $(".dot", d);
        const tw = RM
          ? null
          : gsap.to(dot, {
              opacity: 0.2,
              duration: 0.32,
              yoyo: true,
              repeat: -1,
            });
        await run.sleep(dur);
        tw?.kill();
        gsap.set(dot, { opacity: 1 });
        d.classList.add("is-done");
        if (res) add("tl--res", res);
        await run.sleep(0.18);
      },
      say: (t) => add("tl--say", t),
      ok: (t) => add("tl--ok", t),
      clear: () => (lines.innerHTML = ""),
    };
  }
  const layer = (pane, html) => {
    const old = $$(".pane-layer, .pane-empty", pane);
    const l = el(`<div class="pane-layer">${html}</div>`);
    pane.appendChild(l);
    if (!RM) {
      gsap.to(old, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => old.forEach((o) => o.remove()),
      });
      gsap.from(l, { opacity: 0, duration: 0.35 });
    } else old.forEach((o) => o.remove());
    return l;
  };
  /** Types rich text (bold via **…**) into a node. */
  async function typeInto(node, text, run, cps = 110) {
    const html = (s) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
        .replace(/\*\*/g, "");
    if (RM) {
      node.innerHTML = html(text);
      await run.sleep(text.length / cps);
      return;
    }
    const step = Math.max(2, Math.round(cps / 40));
    for (let i = 0; i <= text.length; i += step) {
      node.innerHTML = html(text.slice(0, i)) + `<span class="cur"></span>`;
      await run.sleep(step / cps);
    }
    node.innerHTML = html(text);
  }

  const SCRIPTS = {
    /* ── Jinx · visual creator ── */
    async jinx({ run, t, pane }) {
      await t.prompt("LinkedIn carousel: decode a job post as a buying signal");
      await t.tool(
        "Read",
        "rules/brand-guidelines.md",
        0.7,
        "palette, type, 21 layout patterns",
      );
      t.say("Three ways to tell it. Let me sketch them.");
      const cons = [
        [
          "A",
          "Before / after split",
          "What you read vs what you should see",
          [
            [6, 8, 16, 36],
            [30, 8, 16, 36],
          ],
        ],
        [
          "B",
          "Annotated job post",
          "Each line of the post becomes a signal card",
          [
            [6, 8, 22, 36],
            [32, 9, 14, 9],
            [32, 22, 14, 9],
            [32, 35, 14, 9],
          ],
        ],
        [
          "C",
          "Signal roadmap",
          "Four arrows around the posting",
          [
            [16, 16, 20, 20],
            [4, 6, 9, 5],
            [39, 6, 9, 5],
            [4, 41, 9, 5],
          ],
        ],
      ];
      const L = layer(
        pane,
        `<div class="pane-h"><span>3 concepts</span><span>brainstorm</span></div><div class="concepts">${cons.map(([k, n, d, sh]) => `<div class="concept"><div class="thumb">${sh.map(([x, y, w, h]) => `<i style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"></i>`).join("")}</div><div><b>${k} · ${n}</b><span>${d}</span></div><span class="pick">PICKED</span></div>`).join("")}</div>`,
      );
      const cards = $$(".concept", L);
      if (!RM)
        gsap.from(cards, {
          opacity: 0,
          x: 30,
          duration: 0.5,
          stagger: 0.28,
          ease: "power3.out",
        });
      await run.sleep(1.9);
      cards[1].classList.add("is-picked");
      if (!RM) {
        gsap.to([cards[0], cards[2]], {
          opacity: 0.32,
          scale: 0.97,
          duration: 0.4,
        });
        gsap.fromTo(
          cards[1],
          { scale: 1 },
          { scale: 1.035, duration: 0.2, yoyo: true, repeat: 1 },
        );
      }
      t.say("Going with B. The job post itself is the hero.");
      await run.sleep(1.1);
      await t.tool(
        "Write",
        "decoder-offre-emploi.html",
        1.0,
        "1080 × 1080 · light background · 3 signal cards",
      );
      const L2 = layer(
        pane,
        `<div class="assemble"><div class="assemble__frame">${Array.from({ length: 16 }, (_, i) => `<div class="piece" style="left:${(i % 4) * 25}%;top:${Math.floor(i / 4) * 25}%;width:25.6%;height:25.6%;background-image:url(${A}visuals/decoder.webp);background-position:${(i % 4) * 33.333}% ${Math.floor(i / 4) * 33.333}%"></div>`).join("")}<img class="assemble__full" src="${A}visuals/decoder.webp" alt="The finished visual: a job post decoded as buying signals"><div class="shine"></div></div></div><div class="pane-cap"><span>decoder.png</span><b></b></div>`,
      );
      const tiles = $$(".piece", L2);
      if (!RM) {
        gsap.set(tiles, { opacity: 0 });
        tiles.forEach((tl, i) =>
          gsap.fromTo(
            tl,
            {
              opacity: 0,
              x: ((i * 37) % 120) - 60,
              y: ((i * 53) % 110) - 40,
              rotation: ((i * 29) % 50) - 25,
              scale: 0.4,
            },
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              duration: 0.7,
              delay: 0.25 + ((i * 7) % 16) * 0.07,
              ease: "back.out(1.5)",
            },
          ),
        );
      }
      await t.tool(
        "Bash",
        "playwright render --png",
        1.9,
        "rendered in one pass",
      );
      if (!RM)
        gsap.fromTo(
          $(".shine", L2),
          { backgroundPosition: "120% 0" },
          { backgroundPosition: "-60% 0", duration: 0.9, ease: "power2.inOut" },
        );
      await t.tool(
        "Read",
        "qa-checklist.md",
        0.7,
        "brand ✓  contrast ✓  no competitor names ✓",
      );
      $(".pane-cap b", L2).textContent = "QA passed";
      gsap.to($(".assemble__full", L2), { opacity: 1, duration: RM ? 0.01 : 0.4 });
      t.ok("decoder.png delivered — ready to post");
    },

    /* ── Captain Jack · sequencer keeper ── */
    async captain({ run, t, pane }) {
      await t.prompt("ship it: follow-up delays configurable per campaign");
      await t.tool("Read", "lib/sequences/schedule.ts", 0.7);
      await t.tool(
        "Edit",
        "lib/sequences/schedule.ts",
        0.9,
        "per-campaign delays, recommended default kept",
      );
      t.say("Aye. Three pairs of eyes before anything sails.");
      const blk = t.add(
        "tl--tool",
        `<span class="dot">●</span><b>Agent</b><span class="arg">(3 reviewers in parallel)</span><div class="reviewers">${["security-reviewer", "architecture-reviewer", "specification-reviewer"].map((r) => `<div><span class="sp">◌</span>${r}</div>`).join("")}</div>`,
      );
      const rows = $$(".reviewers div", blk);
      const spin = RM
        ? null
        : gsap.to($$(".sp", blk), {
            opacity: 0.25,
            duration: 0.3,
            yoyo: true,
            repeat: -1,
            stagger: 0.1,
          });
      const verdict = [
        "tenant isolation ok",
        "no duplication",
        "matches the ticket",
      ];
      for (const i of [0, 2, 1]) {
        await run.sleep(0.75);
        rows[i].classList.add("is-ok");
        const sp = $(".sp", rows[i]);
        gsap.killTweensOf(sp);
        gsap.set(sp, { opacity: 1 });
        sp.textContent = "✓";
        rows[i].insertAdjacentHTML(
          "beforeend",
          ` <span style="opacity:.5">— ${verdict[i]}</span>`,
        );
      }
      spin?.kill();
      blk.classList.add("is-done");
      await run.sleep(0.3);
      await t.tool("Bash", "npm run smoke", 1.5, "all green");
      const steps = [
        ["Build", "image"],
        ["Migrate", "database"],
        ["Health check", "/api/health"],
      ];
      const L = layer(
        pane,
        `<div class="pane-h"><span>Redeploy</span><span>production</span></div><div class="deploy">${steps.map(([a, b]) => `<div class="deploy__row"><span class="st">○</span>${a}<em>${b}</em></div>`).join("")}<div class="bar"><i></i></div></div>`,
      );
      const drows = $$(".deploy__row", L);
      gsap.to($(".bar i", L), {
        width: "100%",
        duration: RM ? 0.01 : 2.3,
        ease: "power1.inOut",
      });
      const dep = t.tool("Bash", "coolify redeploy reach", 2.4, "health: ok");
      for (const r of drows) {
        r.classList.add("is-run");
        $(".st", r).textContent = "◐";
        await run.sleep(0.76);
        r.classList.replace("is-run", "is-ok");
        $(".st", r).textContent = "✓";
      }
      await dep;
      const L2 = layer(
        pane,
        `<div class="browser"><div class="browser__bar"><i></i><i></i><i></i><span>Sillage Reach · Today</span></div><img src="${A}reach/today.webp" alt="Sillage Reach, Today review screen (demo data)"></div><span class="live">Live</span>`,
      );
      if (!RM) {
        gsap.from($(".browser", L2), {
          y: 60,
          opacity: 0,
          scale: 0.94,
          duration: 0.7,
          ease: "expo.out",
        });
        gsap.from($(".live", L2), {
          scale: 0,
          duration: 0.4,
          delay: 0.5,
          ease: "back.out(2.4)",
        });
      }
      t.ok("deployed — the team can set delays per campaign");
      notify({
        title: "Deployed ✓",
        body: "Sillage Reach is live. Health check passed.",
      });
    },

    /* ── Cargo · ICP scorer ── */
    async cargo({ run, t, pane }) {
      const rows = [
        ["Northwind", "B2B SaaS · 1,200", [9, 10, 10, 8, 9, 10, 9], 92, "gold"],
        ["Brightwave", "Fintech · 640", [8, 10, 10, 8, 7, 9, 8], 86, "gold"],
        ["Orbit Labs", "Dev tools · 310", [7, 10, 8, 6, 8, 6, 7], 74, "silver"],
        ["Halloway", "HR tech · 180", [6, 8, 9, 6, 7, 6, 6], 68, "silver"],
        ["Tallyboard", "Analytics · 95", [5, 6, 5, 7, 6, 4, 5], 55, "bronze"],
        [
          "Kestrel Freight",
          "Logistics SaaS · 70",
          [4, 6, 3, 6, 5, 4, 5],
          47,
          "bronze",
        ],
        [
          "Fernhill",
          "Too small",
          [1, 0, 0, 0, 0, 0, 0],
          0,
          "excluded",
        ],
        ["Corner Bakery Co", "Not B2B", [0, 0, 0, 0, 0, 0, 0], 0, "excluded"],
      ];
      await t.prompt("score the whole TAM on the 7-axis grid");
      await t.tool(
        "Read",
        "context/icp/scoring-grid.md",
        0.7,
        "knock-out gates · 7 weighted axes · /100",
      );
      const L = layer(
        pane,
        `<table class="score-t"><thead><tr><th>Account</th><th>7 axes</th><th>Score</th><th>Tier</th></tr></thead><tbody></tbody></table><div class="score-foot"><span>scored · tier written to HubSpot</span><b><span data-n>0</span> accounts</b></div>`,
      );
      const tb = $("tbody", L),
        n = $("[data-n]", L);
      const batch = t.tool(
        "Cargo",
        "batch.run · icp-score",
        rows.length * 0.78 + 0.3,
        "facts by the agent, score by the script",
      );
      const cnt = { v: 0 };
      for (let i = 0; i < rows.length; i++) {
        const [co, meta, ax, sc, tier] = rows[i];
        const tr = el(
          `<tr><td class="co">${co}<small>${meta}</small></td><td><span class="axes">${ax.map(() => "<i><b></b></i>").join("")}</span></td><td class="sc">${tier === "excluded" ? "—" : "0"}</td><td><span class="pill pill--${tier}">${tier[0].toUpperCase() + tier.slice(1)}</span></td></tr>`,
        );
        tb.appendChild(tr);
        const bars = $$(".axes b", tr),
          pill = $(".pill", tr),
          scn = $(".sc", tr);
        if (RM) {
          bars.forEach((b, k) => (b.style.height = ax[k] * 10 + "%"));
          if (sc) scn.textContent = sc;
        } else {
          gsap.from(tr, { opacity: 0, x: -14, duration: 0.3 });
          bars.forEach((b, k) =>
            gsap.to(b, {
              height: ax[k] * 10 + "%",
              duration: 0.4,
              delay: 0.1 + k * 0.035,
              ease: "power2.out",
            }),
          );
          if (sc) {
            const o = { v: 0 };
            gsap.to(o, {
              v: sc,
              duration: 0.5,
              delay: 0.15,
              onUpdate: () => (scn.textContent = Math.round(o.v)),
            });
          }
          gsap.fromTo(
            pill,
            { rotationX: -95, opacity: 0, transformPerspective: 300 },
            {
              rotationX: 0,
              opacity: 1,
              duration: 0.5,
              delay: 0.42,
              ease: "back.out(2)",
            },
          );
        }
        gsap.to(cnt, {
          v: Math.round(((i + 1) / rows.length) * 6400),
          duration: 0.7,
          onUpdate: () =>
            (n.textContent = Math.round(cnt.v).toLocaleString("en-US")),
        });
        await run.sleep(0.78);
      }
      await batch;
      await t.tool(
        "HubSpot",
        "write tier + exclusion reason",
        0.9,
        "Gold · Silver · Bronze · Excluded",
      );
      gsap.to(cnt, {
        v: 8000,
        duration: RM ? 0.01 : 1.1,
        ease: "power2.out",
        onUpdate: () =>
          (n.textContent = Math.round(cnt.v).toLocaleString("en-US")),
      });
      await run.sleep(1.0);
      t.ok("8,000 accounts scored — sales know who to call first");
    },

    /* ── Inbound router · PLG ── */
    async router({ run, t, pane }) {
      const L = layer(
        pane,
        `<div class="pane-h"><span>Inbound self-serve</span><span>live</span></div><div class="flow">
        <div class="fnode"><span class="ic">⚡</span><span class="tx"><b>Sign-up event</b><span data-a>waiting…</span></span></div>
        <div class="fnode"><span class="ic">🎯</span><span class="tx"><b>ICP score</b><span data-b>—</span></span><span class="rt" data-s></span></div>
        <div class="fnode"><span class="ic">🗂️</span><span class="tx"><b>HubSpot company</b><span data-c><i class="hs-f">icp_inbound: —</i><i class="hs-f">stage: lead</i></span></span></div>
        <div class="fnode is-slack"><span class="ic">💬</span><span class="tx"><b>Slack · #sales-alerts</b><span data-d>—</span></span></div>
      </div>`,
      );
      const nodes = $$(".fnode", L);
      const on = (i) => {
        nodes[i].classList.add("is-on");
        if (!RM)
          gsap.fromTo(
            nodes[i],
            { scale: 0.97 },
            { scale: 1, duration: 0.45, ease: "back.out(3)" },
          );
      };
      await t.prompt("watch sign-ups, route the good ones to sales");
      await t.tool(
        "Webhook",
        "product.signup",
        0.9,
        "halloway.example · trial started",
      );
      on(0);
      $("[data-a]", L).textContent = "halloway.example · trial started";
      const sc = t.tool(
        "Cargo",
        "icp-score · halloway.example",
        1.4,
        "84 / 100 · Gold",
      );
      on(1);
      $("[data-b]", L).textContent = "7 axes · knock-out gates passed";
      const o = { v: 0 };
      gsap.to(o, {
        v: 84,
        duration: RM ? 0.01 : 1.2,
        ease: "power2.out",
        onUpdate: () => ($("[data-s]", L).textContent = Math.round(o.v)),
      });
      await sc;
      await t.tool(
        "HubSpot",
        "company.update",
        0.9,
        "icp_inbound = Gold · stage = PQL",
      );
      on(2);
      const f = $$(".hs-f", L);
      f[0].textContent = "icp_inbound: Gold";
      f[1].textContent = "stage: PQL";
      f.forEach((x) => x.classList.add("flash"));
      await run.sleep(0.5);
      await t.tool("Slack", "#sales-alerts", 0.7, "🔔 New PQL → book a demo");
      on(3);
      $("[data-d]", L).textContent = "🔔 New PQL → book a demo";
      notify({
        icon: "💬",
        cls: "toast__ic--slack",
        title: "Slack · #sales-alerts",
        body: "🔔 <b>New PQL</b> · Halloway · Gold (84) → book a demo",
      });
      t.ok("routed in under a minute, no manual step");
    },

    /* ── Mr. New Vegas · product storyteller ── */
    async vegas({ run, t, pane }) {
      await t.prompt("what did we ship this week? tell it three ways");
      t.say("It's me again, Mr. New Vegas. And this week, you shipped.");
      await t.tool(
        "Collect",
        "merged work · closed issues · usage",
        1.2,
        "14 items → 3 candidate stories",
      );
      const st = [
        ["Follow-up delays, set per campaign", "8.5"],
        ["A calmer Today screen", "7.0"],
        ["Internal refactor of the queue", "4.0"],
      ];
      const L = layer(
        pane,
        `<div class="pane-h"><span>Quality gate</span><span>/ 10</span></div><div class="stories">${st.map(([a, q]) => `<div class="story"><span>${a}</span><span class="q">${q}</span></div>`).join("")}</div>`,
      );
      const ss = $$(".story", L);
      if (!RM)
        gsap.from(ss, { opacity: 0, y: 12, duration: 0.4, stagger: 0.25 });
      await run.sleep(1.5);
      ss[2].classList.add("is-cut");
      t.say("Under 6 out of 10, a story never leaves the building.");
      await run.sleep(1.3);
      const L2 = layer(
        pane,
        `<div class="tabs"><span class="on">Client email</span><span>Changelog</span><span>LinkedIn angle</span></div><div class="draft"></div>`,
      );
      const tabs = $$(".tabs span", L2),
        draft = $(".draft", L2);
      const docs = [
        [
          "Write",
          "drafts/client-email.md",
          "**Subject: You now set the pace of every campaign**\n\nHi Claire,\n\nTwo things landed this week. Follow-up delays are now set per campaign, with our recommended default already filled in. And the Today screen got calmer: fewer numbers, the same decisions.\n\nNothing to do on your side.",
        ],
        [
          "Write",
          "drafts/changelog.md",
          "**Added** · Follow-up delays per campaign. The recommended default stays in place until you change it.\n\n**Improved** · Today: one line per lead, the draft first, the context second.\n\n**Fixed** · A reply now stops every pending step, on both channels.",
        ],
        [
          "Write",
          "drafts/linkedin-angle.md",
          "**Angle #1 · 8.5 / 10**\n\n“The best thing we shipped this month was removing information.”\n\nHook: an internal tool is only worth what it gets used. Proof: the Today screen, before and after. In Radia's voice, first person, no jargon.",
        ],
      ];
      for (let i = 0; i < docs.length; i++) {
        tabs.forEach((x, k) => x.classList.toggle("on", k === i));
        draft.innerHTML = "";
        const tk = t.tool(
          docs[i][0],
          docs[i][1],
          docs[i][2].length / 135 + 0.2,
        );
        await typeInto(draft, docs[i][2], run, 135);
        await tk;
        await run.sleep(0.75);
      }
      t.ok("3 drafts ready — nothing is sent without a human");
    },
  };

  /** Plays one agent's scripted session. `w` says where: { term, state, roots(), onState }. */
  function startAgent(w, a) {
    w.run?.kill();
    const run = (w.run = new Run());
    w.setState = (cls, txt, m) => {
      w.state.className = "agent-state " + cls;
      $("span", w.state).textContent = txt;
      w.roots().forEach((r) => setMascot(r, m));
      w.onState?.(cls);
    };
    w.term.innerHTML = termHTML();
    const t = makeTerm(w.term, run);
    w.done = false;
    w.setState("is-working", "working", "working");
    SCRIPTS[a.id]({ run, t, pane: $(".term__pane", w.term), w }).then(async () => {
      w.done = true;
      w.setState("is-done", "done", "happy");
      await run.sleep(1.7);
      w.roots().forEach((r) => setMascot(r, null));
    });
  }

  /** The Claude Code app: agents in a sidebar, the selected one working live on the right. */
  /** The Claude Code app: a chat on the left hands each prompt to one of the agents, whose live session plays on the right. */
  const CC_PROMPT = {
    jinx: "Make a LinkedIn visual about hiring signals",
    cargo: "Score these 8 accounts",
    captain: "Ship a fix to the sequencer",
    router: "Route today's sign-ups",
    vegas: "Write this week's product update",
  };
  const CC_DONE = {
    jinx: "The visual is rendered and it passed the QA checklist.",
    cargo: "Eight accounts scored, tiers written to the CRM.",
    captain: "Three reviewers approved. It is deployed and healthy.",
    router: "One sign-up was in target: sales has the Slack alert.",
    vegas: "Three drafts are ready. Nothing goes out without a human.",
  };
  function initClaude(w, first) {
    w.body.innerHTML = `
      <div class="cc">
        <aside class="cc__side">
          <h5>Agents</h5>
          ${AGENTS.map((a) => `<button class="cc__item" data-id="${a.id}">${mascot(30)}<span class="cc__nm"><b>${a.name}</b><small>${a.role}</small></span><i class="cc__st"></i></button>`).join("")}
          <div class="cc__note"><b>Also in production</b>A power dialer connected to HubSpot · a Slack agent recommending which accounts to contact · a GTM knowledge base of 19 notes for the Cargo agents.</div>
        </aside>
        <section class="cc__chat" aria-label="Chat with Claude">
          <p class="cc__intro"><b>Claude Code</b> is Anthropic's coding agent. These are agents Radia built on top of it, each with a job and a name. Ask for something:</p>
          <div class="cc__msgs" aria-live="polite"></div>
          <div class="cc__prompts">${AGENTS.map((a) => `<button data-id="${a.id}">${CC_PROMPT[a.id]}</button>`).join("")}</div>
          <div class="cc__ask">Pick a prompt above <span>↵</span></div>
        </section>
        <div class="cc__main">
          <header class="cc__head">
            <div class="cc__who"><h3>No agent running</h3></div>
            <div class="agent-state"><i></i><span>idle</span></div>
            <button class="cc__btn cc__pause" aria-label="Pause this session" disabled>❚❚ Pause</button>
            <button class="cc__btn cc__replay" aria-label="Replay this session" disabled>↻ Replay</button>
          </header>
          <div class="cc__body"><div class="cc__empty">${mascot(64)}<b>The agent's live session plays here</b><span>Pick a prompt in the chat, or an agent on the left.</span></div></div>
        </div>
      </div>`;
    const items = $$(".cc__item", w.body), pause = $(".cc__pause", w.body), replay = $(".cc__replay", w.body), msgs = $(".cc__msgs", w.body);
    const say = (cls, html) => {
      const m = el(`<div class="cc__m ${cls}">${html}</div>`);
      msgs.appendChild(m);
      msgs.scrollTop = msgs.scrollHeight;
      if (!RM) gsap.fromTo(m, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", clearProps: "opacity,transform" });
    };
    w.term = $(".cc__body", w.body);
    w.state = $(".agent-state", w.body);
    w.roots = () => [$(".cc__item.on", w.body), $(".win__title", w.el)].filter(Boolean);
    w.onState = (cls) => {
      const on = $(".cc__item.on", w.body);
      on.classList.toggle("is-working", cls === "is-working");
      on.classList.toggle("is-done", cls === "is-done");
      pause.disabled = cls === "is-done";
      pause.textContent = cls === "is-paused" ? "▶ Resume" : "❚❚ Pause";
      if (cls === "is-done" && !w.told) { w.told = true; say("cc__m--c", `✓ Done. ${CC_DONE[w.agent.id]}`); }
    };
    const select = (id) => {
      const a = agentById(id);
      if (!a) return;
      setMascot(w.el, null);
      items.forEach((b) => {
        b.classList.remove("is-working");
        b.classList.toggle("on", b.dataset.id === id);
        b.setAttribute("aria-current", b.dataset.id === id);
      });
      $(".cc__who h3", w.body).innerHTML = `${a.name} <span>· ${a.role}</span>`;
      say("cc__m--u", CC_PROMPT[id]);
      say("cc__m--c", `On it. Handing this to <b>${a.name}</b>, the ${a.role}.`);
      replay.disabled = false;
      w.agent = a;
      w.told = false;
      startAgent(w, a);
    };
    $$(".cc__item, .cc__prompts button", w.body).forEach((b) => b.addEventListener("click", () => select(b.dataset.id)));
    replay.addEventListener("click", () => w.agent && select(w.agent.id));
    pause.addEventListener("click", () => {
      const r = w.run;
      if (!r || w.done) return;
      if (r.paused) { r.resume(); w.setState("is-working", "working", "working"); }
      else { r.pause(); w.setState("is-paused", "paused", null); }
    });
    w.api.select = select;
    if (first) select(first);
  }
  const launchAgent = (id) => openApp("claude", { agent: id });

  /* ═══════════════════════════════════════════════════════
     TERMINAL APP (easter egg)
     ═══════════════════════════════════════════════════════ */

  /* ═══════════════════════════════════════════════════════
     DOCK
     ═══════════════════════════════════════════════════════ */
  function buildDock() {
    const dock = $("#dock");
    DOCK_ITEMS.forEach((id) => {
      if (id === "|")
        return dock.appendChild(
          el(`<span class="dk-sep" aria-hidden="true"></span>`),
        );
      const name = DOCK_NAMES[id] || appById(id).name;
      const b = el(
        `<button class="dk" id="dk-${id}" aria-label="${name}"><span class="dk__tip">${name}</span><span class="dk__ic">${tile(id)}</span></button>`,
      );
      b.addEventListener("click", () => dockClick(id, b));
      dock.appendChild(b);
    });
    const items = $$(".dk", dock);
    if (!RM) {
      dock.addEventListener("mousemove", (e) => {
        dock.classList.add("is-hot");
        items.forEach((it) => {
          const r = it.getBoundingClientRect();
          const d = e.clientX - (r.left + r.width / 2);
          it.style.setProperty(
            "--s",
            (1 + 0.62 * Math.exp(-(d * d) / (2 * 64 * 64))).toFixed(3),
          );
        });
      });
      dock.addEventListener("mouseleave", () => {
        dock.classList.remove("is-hot");
        items.forEach((it) => it.style.setProperty("--s", 1));
      });
    }
  }
  function bounce(btn, n = 1) {
    if (RM) return;
    gsap.fromTo(
      $(".dk__ic", btn),
      { y: 0 },
      {
        y: -20,
        duration: 0.24,
        yoyo: true,
        repeat: n * 2 - 1,
        ease: "power2.out",
      },
    );
  }
  function dockClick(id, btn) {
    if (id === "captain") return captainToggle();
    const w = wins.get(id);
    if (w) return w.min ? restoreWin(w) : focusWin(w);
    bounce(btn);
    gsap.delayedCall(RM ? 0 : 0.26, () => openApp(id));
  }

  /* ═══════════════════════════════════════════════════════
     SPOTLIGHT (⌘K)
     ═══════════════════════════════════════════════════════ */
  let spItems = [],
    spIdx = 0;
  const spAll = () => [
    ...["about", "claude", ...Object.keys(CASES)].map((id) => ({
      ic: tile(id),
      name: appById(id).name,
      kind: "App",
      go: () => openApp(id),
    })),
    ...AGENTS.map((a) => ({
      ic: tile("claude"),
      name: `${a.name} — ${a.role}`,
      kind: "Agent",
      go: () => launchAgent(a.id),
    })),
    { ic: tile("captain"), name: "Ask Captain, the guide", kind: "Guide", go: () => captainOpen() },
    {
      ic: tile("about"),
      name: "Contact Radia on LinkedIn",
      kind: "Action",
      go: () => act("contact"),
    },
    { ic: tile("about"), name: "Lock screen", kind: "Action", go: lockScreen },
    { ic: tile("about"), name: "Log out Radia…", kind: "Action", go: () => logout() },
  ];
  function renderSpot() {
    const q = $("#spInput").value.trim().toLowerCase();
    spItems = spAll().filter(
      (i) => !q || (i.name + " " + i.kind).toLowerCase().includes(q),
    );
    spIdx = Math.min(spIdx, Math.max(0, spItems.length - 1));
    $("#spList").innerHTML = spItems.length
      ? spItems
          .map(
            (i, k) =>
              `<li role="option" data-k="${k}" class="${k === spIdx ? "on" : ""}" aria-selected="${k === spIdx}"><span class="ic">${i.ic}</span>${i.name}<small>${i.kind}</small></li>`,
          )
          .join("")
      : `<div class="sp-empty">Nothing here. Try “reach”, “jinx” or “tour”.</div>`;
    $(`#spList .on`)?.scrollIntoView({ block: "nearest" });
  }
  function openSpotlight() {
    if (MOBILE || document.body.classList.contains("is-locked")) return;
    const sp = $("#spotlight");
    sp.hidden = false;
    $("#spInput").value = "";
    spIdx = 0;
    renderSpot();
    if (!RM)
      gsap.fromTo(
        $(".sp-box", sp),
        { opacity: 0, y: -14, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.26, ease: "power3.out" },
      );
    $("#spInput").focus();
  }
  function closeSpotlight() {
    const sp = $("#spotlight");
    if (sp.hidden) return false;
    sp.hidden = true;
    return true;
  }
  function initSpotlight() {
    const inp = $("#spInput");
    inp.addEventListener("input", () => {
      spIdx = 0;
      renderSpot();
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        spIdx = (spIdx + 1) % Math.max(1, spItems.length);
        renderSpot();
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        spIdx = (spIdx - 1 + spItems.length) % Math.max(1, spItems.length);
        renderSpot();
        e.preventDefault();
      } else if (e.key === "Enter") {
        const it = spItems[spIdx];
        closeSpotlight();
        it?.go();
        e.stopPropagation();
      }
    });
    $("#spList").addEventListener("click", (e) => {
      const li = e.target.closest("li");
      if (!li) return;
      const it = spItems[+li.dataset.k];
      closeSpotlight();
      it.go();
    });
    $("#spotlight").addEventListener(
      "pointerdown",
      (e) => e.target.id === "spotlight" && closeSpotlight(),
    );
    $("#spotBtn").addEventListener("click", openSpotlight);
  }

  /* ═══════════════════════════════════════════════════════
     LOCK SCREEN
     ═══════════════════════════════════════════════════════ */
  let lockRun = null;
  const fmtTime = (d) =>
    d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  function tick() {
    const d = new Date();
    $("#lockTime").textContent = fmtTime(d);
    $("#lockDate").textContent = d.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    $("#mbClock").textContent =
      d.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }) +
      "  " +
      fmtTime(d);
  }
  async function typePassword() {
    lockRun?.kill();
    const run = (lockRun = new Run());
    const dots = $("#lockDots");
    dots.innerHTML = "";
    $(".lock-go").classList.remove("is-ready");
    await run.sleep(0.9);
    for (let i = 0; i < 9; i++) {
      const d = document.createElement("i");
      dots.appendChild(d);
      if (!RM) gsap.from(d, { scale: 0, duration: 0.18, ease: "back.out(3)" });
      await run.sleep(0.11 + (i % 3) * 0.03);
    }
    $(".lock-go").classList.add("is-ready");
  }
  function lockScreen() {
    stopTour();
    closeSpotlight();
    closeCaptain(true);
    closePlayer(true);
    $("#mbMenu").hidden = true;
    const lock = $("#lock");
    lock.hidden = false;
    document.body.classList.add("is-locked");
    gsap.set(lock, { opacity: 1, scale: 1 });
    if (!RM)
      gsap.from($$(".lock-top, .lock-user, .lock-foot"), {
        opacity: 0,
        y: 14,
        duration: 0.6,
        stagger: 0.08,
      });
    typePassword();
  }
  /** Unlocks: zoom/fade from the lock screen into the desktop. Resolves when settled. */
  function unlock() {
    return new Promise((res) => {
      if (!document.body.classList.contains("is-locked")) return res();
      lockRun?.kill();
      const lock = $("#lock");
      document.body.classList.remove("is-locked");
      const done = () => {
        lock.hidden = true;
        res();
      };
      if (MOBILE) {
        gsap.to(lock, {
          opacity: 0,
          y: -40,
          duration: RM ? 0.01 : 0.5,
          ease: "power2.in",
          onComplete: done,
        });
        if (!RM)
          gsap.from("#feed > *", {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.07,
            delay: 0.25,
            ease: "power3.out",
            clearProps: "all",
          });
        return;
      }
      if (RM) {
        gsap.set(lock, { opacity: 0 });
        return done();
      }
      gsap.to(lock, {
        opacity: 0,
        scale: 1.12,
        duration: 0.75,
        ease: "power2.inOut",
        onComplete: done,
      });
      gsap.fromTo(
        "#windows, #icons",
        { scale: 1.08, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "all",
        },
      );
      gsap.fromTo(
        "#menubar",
        { y: -MB },
        {
          y: 0,
          duration: 0.6,
          delay: 0.25,
          ease: "power3.out",
          clearProps: "transform",
        },
      );
      gsap.fromTo(
        "#dock",
        { y: 110 },
        {
          y: 0,
          duration: 0.8,
          delay: 0.3,
          ease: "back.out(1.3)",
          clearProps: "y",
        },
      );
      gsap.from(".dk", {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.035,
        delay: 0.42,
        ease: "back.out(2)",
        clearProps: "transform,opacity",
      });
    });
  }

  /* ═══════════════════════════════════════════════════════
     CHOREOGRAPHY — the agents' show + the tour
     ═══════════════════════════════════════════════════════ */
  let showRun = null;
  /** Staggered launch of the five agents, 3–4 visible at once. ~36 s. */

  let tourRun = null;
  const tourOn = () => !!tourRun && !tourRun.dead;
  function setTourBtn(on) {
    document.body.classList.toggle("is-tour", on);
  }
  function stopTour() {
    if (!tourOn()) return;
    tourRun.kill();
    showRun?.kill();
    setTourBtn(false);
  }
  function hideEnd() {
    const e = $("#endcard");
    if (e.hidden) return false;
    gsap.to(e, {
      opacity: 0,
      duration: RM ? 0.01 : 0.35,
      onComplete: () => {
        e.hidden = true;
        gsap.set(e, { opacity: 1 });
      },
    });
    return true;
  }
  /** The closing screen: shown after logging out, and at the end of the tour. */
  function showEnd() {
    const e = $("#endcard");
    e.innerHTML = `
      <div class="end">
        <div class="avatar avatar--xl" role="img" aria-label="${PROFILE.name}"></div>
        <h2>Thanks for stopping by.</h2>
        <p class="role"><b>${PROFILE.name}</b><span>·</span>${PROFILE.title}</p>
        <p class="sub">${PROFILE.tagline} · what I built at ${PROFILE.company}, ${PROFILE.year}</p>
        <a class="cta" href="${PROFILE.contactUrl}" target="_blank" rel="noopener">Connect on LinkedIn ↗</a>
        <span class="url">${PROFILE.contactLabel}</span>
        <button class="end__back" data-e="back">Log back in</button>
      </div>`;
    e.hidden = false;
    $('[data-e="back"]', e).addEventListener("click", () => {
      hideEnd();
      lockScreen();
    });
    if (!RM) {
      gsap.fromTo(e, { opacity: 0 }, { opacity: 1, duration: 0.7 });
      gsap.from($$(".end > *", e), { opacity: 0, y: 26, duration: 0.8, stagger: 0.11, delay: 0.3, ease: "power3.out" });
    }
  }

  /** Log out: the desktop recedes, then the closing screen invites the visitor to connect. */
  function logout(fromTour) {
    if (!fromTour) stopTour();
    if (document.body.classList.contains("is-locked")) return;
    closeSpotlight();
    closeQuickLook();
    $("#mbMenu").hidden = true;
    closeCaptain(true);
    closePlayer(true);
    closeAll();
    $$(".toast").forEach((t) => t.remove());
    const done = () => {
      document.body.classList.add("is-locked");
      gsap.set("#desktop, #feed", { clearProps: "all" });
      scrollTo(0, 0);
      showEnd();
    };
    if (RM) return done();
    gsap.to(MOBILE ? "#feed" : "#desktop", { opacity: 0, scale: MOBILE ? 1 : 0.94, duration: 0.75, delay: 0.15, ease: "power2.in", onComplete: done });
  }

  /* ───────── Captain, the guide (scripted, no AI call) ─────────
     Lives in a small pill at the bottom right. Knows which app is in front. */
  const capGo = (id, label) => [label, "open:" + id];
  const CAP_A = {
    built: { q: "What did Radia build?", say: ["Four things, in one year at Sillage:", "• Sillage Reach, an outbound product in production\n• A 7-axis scoring of 8,000 accounts\n• The automation between product, CRM and sales\n• AI agents the team still uses"], go: [capGo("reach", "Open Sillage Reach"), capGo("data", "Data & Scoring"), capGo("crm", "CRM & PLG")] },
    tools: { q: "Which tools does she use?", say: ["Claude Code to build: agents, skills, MCP.", "Cargo, HubSpot and n8n for data and automation. Next.js and Postgres for the product. GSAP for motion."], go: [capGo("claude", "See the agents work")] },
    contact: { q: "How do I contact her?", say: ["LinkedIn is the best way. She answers fast."], go: [["Connect on LinkedIn ↗", "link"], capGo("about", "Who is Radia?")] },
    first: { q: "What should I look at first?", say: ["Start with Sillage Reach. It's a view-only copy of the real product, so click around.", "Then open Claude Code and give Jinx something to draw."], go: [capGo("reach", "Open Sillage Reach"), capGo("claude", "Open Claude Code")] },
    // Sillage Reach
    r1: { q: "How does a signal become a message?", say: ["A signal is something that just happened at a target account: a job change, three sales roles opening, a comment on a post.", "The app writes a draft for that exact signal, in the rep's tone. You see it on Today, next to the reason."], do: (w) => w.api.go("today") },
    r2: { q: "Why do I approve each lead?", say: ["Because a person should read what goes out in their name. One click approves the whole sequence.", "Customers, open deals and people who said no are never contacted, whatever happens."], do: (w) => w.api.go("today") },
    r3: { q: "What's the mailbox level?", say: ["A new mailbox that sends too much lands in spam. So each one starts small and levels up when its weekly quest is done.", "It slows down by itself if emails bounce. I opened the gauge for you, bottom left."], do: (w) => w.api.gauge(true) },
    r4: { q: "How do Events turn into meetings?", say: ["You say which events you're going to. Afterwards you paste the LinkedIn profile of the people you met.", "They enter a campaign with a message about that event. I opened the form for you."], do: (w) => { w.api.go("events"); w.api.add(0); } },
    // Data & Scoring
    d1: { q: "How is a company scored?", say: ["Seven things are checked, like its size, whether a GTM person is in post, or open sales roles. Each gives points, out of 100.", "Knock-out gates come first. Then the weighted score gives the tier: Gold, Silver, Bronze or Excluded."], do: (w) => w.api.flow.show("score") },
    d2: { q: "What are the knock-out gates?", say: ["Six questions asked before any points. One “no” and the account is excluded, whatever its score.", "Too small, outside the zone, not B2B, a dead sector, not independent, or already in a deal."], do: (w) => w.api.flow.show("score") },
    d3: { q: "How does the contact enrichment cascade work?", say: ["First it checks the person is still at the company and in the right role. Only then it looks for the email and the phone.", "The cheap provider goes first. The expensive one is only called if the first finds nothing."], do: (w) => w.api.flow.show("enrich") },
    d4: { q: "Why AI + a fixed formula?", say: ["The AI is good at reading a website and bad at being consistent. So it only gathers facts, each with a proof.", "A small script turns the facts into the score. Same facts, same score, every time."], do: (w) => w.api.flow.show("score") },
    // CRM & PLG
    c1: { q: "What happens when someone signs up?", say: ["The product tells HubSpot. Cargo scores the company. After a short delay HubSpot checks: did they pay?", "If not, and they're in target, sales gets a Slack alert."], do: (w) => w.api.flow.show("inbound") },
    c2: { q: "What's a PQL here?", say: ["A product-qualified lead: someone who signed up on their own, fits the target, and hasn't paid yet.", "That's the person sales should call."], do: (w) => w.api.flow.show("inbound") },
    c3: { q: "How are churn risks caught?", say: ["Three triggers: a plan change, a cancelled trial, a cancelled subscription.", "Each one sends a Slack alert to the person who can act on it."], do: (w) => w.api.flow.show("retention") },
    c4: { q: "How is HubSpot kept clean?", say: ["One rule: each tool writes its own fields, and nobody writes in someone else's.", "Plus a backup before every bulk change, and duplicates merged in small waves."], do: (w) => w.api.flow.show("structure") },
    // Claude Code
    a1: { q: "What are these agents?", say: ["Each one is Claude Code with a job, a set of rules and a name. Jinx makes visuals, Cargo scores accounts, Captain Jack looks after the sequencer.", "Pick a prompt in the chat and watch one work."] },
    a2: { q: "How do 3 reviewers check code?", say: ["Before a change is merged, three agents read it at the same time: one for security, one for architecture, one against the ticket.", "I asked Captain Jack to ship something so you can see them."], do: (w) => w.api.select("captain") },
    a3: { q: "What's a soul?", say: ["A short text that gives an agent its personality: its voice, what it cares about, what it refuses to do.", "It keeps the agent consistent from one day to the next."] },
    // Glorious Pipeline
    g1: { q: "What is Glorious Pipeline?", say: ["A whole Claude Code workspace, packed as a kit: rules, agents, skills, guards and plugs.", "What you see is a copy you can click. I opened the house rules for you."], do: (w) => w.api.glo.open("CLAUDE.md") },
    g2: { q: "How does a team install it?", say: ["They paste one prompt. A guide agent called Boussole then sets it up with them, one question at a time.", "I asked Boussole to start, look at the chat."], do: (w) => w.api.glo.run("boussole") },
    g3: { q: "What are souls?", say: ["A soul gives an agent its personality: its voice, what it cares about, what it refuses.", "It is the last line of every agent file. I opened one."], do: (w) => w.api.glo.open(".claude/agents/icp-scorer.md") },
    g4: { q: "What do the guards block?", say: ["Sending anything without a human. Bulk CRM writes without a backup and a dry run. Spending past the credit ceiling. Leaking a teammate's email.", "I asked Claude to send an email so you can watch one fire."], do: (w) => w.api.glo.run("send") },
    // Content & Design
    m1: { q: "How are these animations made?", say: ["They're code, not video: HTML, CSS and a GSAP timeline.", "That's why they stay sharp at any size."] },
    m2: { q: "Who designs them?", say: ["Radia briefs, chooses and iterates. Claude writes the code.", "Same method as Jinx, the visual agent she built at Sillage."] },
    m3: { q: "Which one should I watch?", say: ["Signal radar. It's the product in ten seconds. I started it for you."], do: () => openPlayer(0) },
  };
  const CAP_CTX = {
    desk: { pill: "Ask Captain", say: ["Hello 👋 I'm Captain, Radia's assistant.", "Want a quick tour? Here's what to look at:"], go: [capGo("reach", "See the product she built"), capGo("claude", "Meet her AI agents"), capGo("content", "Watch the motion work"), capGo("about", "Who is Radia?")], q: [], more: ["built", "tools", "contact", "first"] },
    reach: { pill: "How does Sillage Reach work?", say: ["You're in <b>Sillage Reach</b>, the outbound product Radia built. It's a view-only copy, so click around."], q: ["r1", "r2", "r3", "r4"] },
    data: { pill: "How does the scoring work?", say: ["These are the tools Radia built in <b>Cargo</b>. Each diagram is one tool, with a record going through it."], q: ["d1", "d2", "d3", "d4"] },
    crm: { pill: "How does the routing work?", say: ["This is the plumbing between the product, <b>HubSpot</b> and the sales team."], q: ["c1", "c2", "c3", "c4"] },
    claude: { pill: "What are these agents?", say: ["<b>Claude Code</b> is Anthropic's coding agent. These five agents are Radia's. Pick a prompt in the chat to see one work."], q: ["a1", "a2", "a3"] },
    content: { pill: "How is this made?", say: ["Six short animations, all written in code. Click one to play it."], q: ["m1", "m2", "m3"] },
    glorious: { pill: "What is Glorious Pipeline?", say: ["This is <b>Glorious Pipeline</b>, Radia's latest project: her agentic workspace, packaged as a kit. Open a file, or send Claude a prompt."], q: ["g1", "g2", "g3", "g4"] },
    about: { pill: "Ask me about Radia", say: ["That's Radia. Founding sales, and the person who built everything on this computer."], q: ["built", "tools", "contact"] },
  };
  let capRun = null, capCtx = "desk";
  function initCaptain() {
    const c = el(`
      <section id="captain" hidden aria-label="Captain, Radia's assistant">
        <header><span class="cap-face">${captainSVG(30)}</span><div><b>Captain</b><small>Radia's assistant · scripted guide</small></div><button class="cap-x" aria-label="Minimise Captain">⌄</button></header>
        <div class="cap-msgs" aria-live="polite"></div>
        <div class="cap-chips"></div>
      </section>`);
    const pill = el(`<button id="capPill" aria-label="Open Captain, the guide"><span class="cap-face">${captainSVG(22)}</span><span class="cap-pill__t">Ask Captain</span></button>`);
    $("#desktop").append(c, pill);
    pill.addEventListener("click", captainToggle);
    $(".cap-x", c).addEventListener("click", () => closeCaptain());
    $(".cap-chips", c).addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      const [kind, arg] = b.dataset.do.split(":");
      if (kind === "q") capPlay(arg);
      else if (kind === "link") act("contact");
      else if (kind === "ask") capChips([], CAP_CTX.desk.more);
      else if (kind === "open") {
        closeCaptain();
        bounce($(`#dk-${arg}`));
        gsap.delayedCall(RM ? 0 : 0.26, () => openApp(arg));
      }
    });
  }
  function capChips(go, keys, extra = "") {
    const box = $("#captain .cap-chips");
    box.innerHTML = go.map(([t, d]) => `<button class="cap-chip cap-chip--go" data-do="${d}">${t}</button>`).join("") + keys.map((k) => `<button class="cap-chip cap-chip--q" data-do="q:${k}">${CAP_A[k].q}</button>`).join("") + extra;
    if (!RM) gsap.fromTo(box.children, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out", clearProps: "opacity,transform", overwrite: true });
  }
  /** Says a few lines (with the typing dots), then shows the chips. */
  async function capSay(lines, after) {
    capRun?.kill();
    const run = (capRun = new Run()), msgs = $("#captain .cap-msgs");
    $$(".cap-typing", msgs).forEach((t) => t.remove());
    $("#captain .cap-chips").innerHTML = "";
    for (const text of lines) {
      const t = capAdd("cap-m--c cap-typing", "<i></i><i></i><i></i>");
      await run.sleep(RM ? 0.05 : 0.7);
      t.remove();
      capAdd("cap-m--c", text);
      await run.sleep(RM ? 0.05 : 0.25);
    }
    after();
  }
  function capAdd(cls, html) {
    const msgs = $("#captain .cap-msgs"), m = el(`<div class="cap-m ${cls}">${html}</div>`);
    msgs.appendChild(m);
    msgs.scrollTop = msgs.scrollHeight;
    if (!RM) gsap.fromTo(m, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", clearProps: "opacity,transform" });
    return m;
  }
  const capIntro = () => {
    const c = CAP_CTX[capCtx];
    capSay(c.say, () => capChips(c.go || [], c.q, c.more ? `<button class="cap-chip cap-chip--q" data-do="ask">Ask me something else</button>` : ""));
  };
  function capPlay(key) {
    const a = CAP_A[key], c = CAP_CTX[capCtx];
    capAdd("cap-m--u", a.q);
    const w = wins.get(capCtx);
    if (a.do && w && !w.min) a.do(w);
    capSay(a.say, () => capChips(a.go || [], (c.q.length ? c.q : c.more).filter((k) => k !== key)));
  }
  /** Called whenever the app in front changes: Captain's line and questions follow. */
  function captainContext(id) {
    const key = CAP_CTX[id] ? id : "desk", c = $("#captain");
    if (!c || key === capCtx) return;
    capCtx = key;
    capRun?.kill();
    $(".cap-msgs", c).innerHTML = "";
    $(".cap-chips", c).innerHTML = "";
    $("#capPill .cap-pill__t").textContent = CAP_CTX[key].pill;
    if (!c.hidden) capIntro();
    else if (!RM) gsap.fromTo("#capPill", { scale: 1 }, { scale: 1.07, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out", clearProps: "transform" });
  }
  function captainOpen() {
    const c = $("#captain");
    if (!c || !c.hidden || document.body.classList.contains("is-locked")) return;
    c.hidden = false;
    $("#dk-captain")?.classList.add("is-running");
    $("#capPill").classList.add("is-open");
    gsap.killTweensOf(c);
    if (!RM) gsap.fromTo(c, { opacity: 0, scale: 0.86, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" });
    else gsap.set(c, { opacity: 1, scale: 1, y: 0 });
    if (!$(".cap-msgs", c).children.length) capIntro();
  }
  /** Folds the chat back into its pill. `reset` also forgets the conversation (lock, log out). */
  function closeCaptain(reset) {
    const c = $("#captain");
    if (!c) return false;
    if (reset) {
      capRun?.kill();
      capCtx = "desk";
      $(".cap-msgs", c).innerHTML = "";
      $(".cap-chips", c).innerHTML = "";
      $("#capPill .cap-pill__t").textContent = CAP_CTX.desk.pill;
    }
    if (c.hidden) return false;
    $("#dk-captain")?.classList.remove("is-running");
    $("#capPill").classList.remove("is-open");
    gsap.killTweensOf(c);
    const end = () => (c.hidden = true);
    if (RM || reset) end();
    else gsap.to(c, { opacity: 0, scale: 0.9, y: 16, duration: 0.22, ease: "power2.in", onComplete: end });
    return true;
  }
  const captainToggle = () => ($("#captain").hidden ? captainOpen() : closeCaptain());

  /** The guided tour: deterministic, ~85 s, made for screen recording. */
  /** Hidden recording mode (?tour=1): deterministic, ~80 s. Not reachable from the interface. */
  /** Hidden recording mode (?tour=1): deterministic, ~80 s. Not reachable from the interface. */
  async function tour() {
    stopTour();
    hideEnd();
    closePlayer(true);
    closeQuickLook();
    closeSpotlight();
    closeAll(true);
    $$(".toast").forEach((t) => t.remove());

    // 1 · lock screen → calm desktop, Captain says hello
    lockScreen();
    const run = (tourRun = new Run());
    setTourBtn(true);
    await run.sleep(4.2);
    await unlock();
    welcome();
    await run.sleep(5.6);
    const open = async (id, opts) => {
      closeCaptain();
      bounce($(`#dk-${id}`));
      await run.sleep(0.3);
      return openApp(id, opts);
    };

    // 2 · Claude Code: two agents, one after the other
    const cc = await open("claude", { agent: "jinx" });
    const done = async () => {
      await run.sleep(0.6);
      while (!cc.done) await run.sleep(0.2);
      await run.sleep(1.5);
    };
    await done();
    cc.api.select("cargo");
    await done();

    // 3 · Sillage Reach, navigated like the real product
    const reach = await open("reach");
    await run.sleep(4.0);
    reach.api.next();
    await run.sleep(2.4);
    reach.api.go("inbox");
    await run.sleep(2.4);
    reach.api.go("performance");
    await run.sleep(2.2);
    reach.api.go("events");
    await run.sleep(1.3);
    reach.api.add(0);
    await run.sleep(1.9);
    reach.api.gauge(true);
    gsap.delayedCall(0.8, () => !run.dead && notify({ icon: "🎉", cls: "toast__ic--reach", title: "Level up!", body: "Your mailbox can now send more each day." }));
    await run.sleep(3.0);

    // 4 · scoring, then motion
    await open("data");
    await run.sleep(6.6);
    await open("content");
    await run.sleep(3.6);
    openPlayer(0);
    await run.sleep(8.6);
    closePlayer();
    await run.sleep(0.7);

    // 5 · log out → closing screen
    logout(true);
    await run.sleep(2.2);
    run.kill();
    setTourBtn(false);
    document.body.dataset.tour = "done";
  }

  let welcomeCall;
  const welcome = () => !MOBILE && (welcomeCall = gsap.delayedCall(RM ? 0.05 : 1.0, captainOpen));

  /** Soft abstract gradient: a few large colour fields drifting very slowly. Drawn small, scaled up. */

  /* ═══════════════════════════════════════════════════════
     PHONE FEED
     ═══════════════════════════════════════════════════════ */
  function buildFeed() {
    const f = $("#feed");
    f.innerHTML = `
      <header class="f-hero">
        <div class="avatar avatar--lg"><span>${PROFILE.initials}</span></div>
        <h1>${PROFILE.name}</h1>
        <p>${PROFILE.title} · ${PROFILE.tagline}<br>What I built at ${PROFILE.company}, ${PROFILE.year}</p>
        <a class="cta" href="${PROFILE.contactUrl}" target="_blank" rel="noopener">Connect on LinkedIn ↗</a>
      </header>
      <div class="f-h">Claude Code · agents at work</div>
      <p class="f-intro">Agents I built with Claude Code, each with a job and a name. Tap one to watch its session.</p>
      ${AGENTS.map((a) => `<section class="f-agent" id="fa-${a.id}"><button class="f-agent__h" aria-label="Play ${a.name}">${mascot(26)}<span><b>${a.name}</b> <span>· ${a.role}</span></span><div class="agent-state" style="position:static;margin-left:auto"><i></i><span>▶ play</span></div></button><p class="f-agent__d">${a.desc}</p><div class="f-body"></div></section>`).join("")}
      <div class="f-h">Case studies</div>
      ${Object.keys(CASES).map((id) => `<section class="f-card" id="fc-${id}"><div class="f-card__h">${tile(id)}<span><b>${CASES[id].name}</b><small>${CASES[id].sub}</small></span></div>${caseHTML(id)}</section>`).join("")}
      <div class="f-h">Me</div>
      <section class="f-card">${aboutHTML()}</section>
      <button class="f-logout" id="fLogout">Log out Radia…</button>
      <p class="f-foot">Open on a computer for the full desktop experience.<br>Screenshots use fictional demo data.</p>`;
    Object.keys(CASES).forEach((id) => initCase({ api: {} }, $(`#fc-${id}`)));
    let playing = null;
    $$(".f-agent", f).forEach((sec) => {
      const w = { term: $(".f-body", sec), state: $(".agent-state", sec), roots: () => [sec] };
      $(".f-agent__h", sec).addEventListener("click", () => {
        if (playing && playing !== w) { playing.run?.kill(); playing.term.innerHTML = ""; playing.setState("", "▶ play", null); }
        playing = w;
        sec.classList.add("is-open");
        startAgent(w, agentById(sec.id.slice(3)));
      });
    });
    $$(".about [data-act]", f).forEach((b) => b.remove());
    $("#fLogout").addEventListener("click", () => logout());
  }

  /* ═══════════════════════════════════════════════════════
     BOOT
     ═══════════════════════════════════════════════════════ */
  function boot() {
    gsap.config({ nullTargetWarn: false });
    document.title = `${PROFILE.name} — ${PROFILE.title}`;
    $("#lockInitials").textContent = PROFILE.initials;
    $("#lockName").textContent = PROFILE.name;
    $("#lockRole").innerHTML = `<b>${PROFILE.title}</b><br>${PROFILE.tagline}`;
    tick();
    setInterval(tick, 5000);

    if (MOBILE) {
      document.body.classList.add("is-mobile");
      buildFeed();
    } else {
      buildDock();
      initSpotlight();
      const ic = $("#icons");
      [
        [
          "Read me",
          "about",
          `<svg viewBox="0 0 48 48"><path d="M10 4h20l10 10v28a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fbfaf7"/><path d="M30 4l10 10H32a2 2 0 0 1-2-2z" fill="#d9d4c5"/><path d="M14 22h20M14 28h20M14 34h13" stroke="#3da5bb" stroke-width="2.4" stroke-linecap="round"/></svg>`,
        ],
      ].forEach(([n, a, svg]) => {
        const b = el(
          `<button class="dicon" aria-label="${n}">${svg}<span>${n}</span></button>`,
        );
        b.addEventListener("dblclick", () => act(a));
        b.addEventListener("keydown", (e) => e.key === "Enter" && act(a));
        ic.appendChild(b);
      });
      $("#powerBtn").addEventListener("click", () => logout());
      initCaptain();
      const menu = $("#mbMenu"),
        glyph = $("#mbGlyph");
      glyph.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.hidden = !menu.hidden;
        glyph.setAttribute("aria-expanded", !menu.hidden);
      });
      $$("button", menu).forEach((b) =>
        b.addEventListener("click", () => {
          menu.hidden = true;
          act(b.dataset.act);
        }),
      );
      document.addEventListener("pointerdown", (e) => {
        if (!e.target.closest("#mbMenu, #mbGlyph")) menu.hidden = true;
        if (
          !e.target.closest(".win") &&
          !e.target.closest(
            "#dock, #menubar, .launcher, #spotlight, #toasts, #quicklook, #endcard, #lock",
          )
        ) {
          wins.forEach((w) => w.el.classList.remove("is-focused"));
        }
      });
      $("#quicklook").addEventListener("click", closeQuickLook);
    }

    // lock screen
    const go = async (e) => {
      e?.preventDefault();
      if (tourOn() || !$("#endcard").hidden || !document.body.classList.contains("is-locked")) return;
      await unlock();
      welcome();
    };
    $("#lockForm").addEventListener("submit", go);
    $("#lockOpen").addEventListener("click", go);
    if (MOBILE) $("#lock").addEventListener("click", go);

    document.addEventListener("keydown", (e) => {
      const locked = document.body.classList.contains("is-locked");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        $("#spotlight").hidden ? openSpotlight() : closeSpotlight();
        return;
      }
      if (e.key === "Enter" && locked) return go(e);
      if (e.key === "Escape") {
        if (closePlayer() || closeQuickLook() || closeSpotlight() || closeCaptain()) return;
        if (!$("#mbMenu").hidden) return ($("#mbMenu").hidden = true);
        if (tourOn()) return stopTour();
        if (!$("#endcard").hidden) return hideEnd(), lockScreen();
        const w = topWin();
        if (w && !e.target.closest?.("input")) closeWin(w);
        return;
      }
      if (e.target.closest?.("input")) return;
      const w = topWin();
      if (w?.id === "reach" && e.key === "ArrowRight") w.api.next();
      if (w?.id === "reach" && e.key === "ArrowLeft") w.api.prev();
    });

    // entry modes
    if (!MOBILE && Q.has("tour")) tour();
    else if (Q.has("fast")) {
      document.body.classList.remove("is-locked");
      $("#lock").hidden = true;
      if (!MOBILE && !Q.has("quiet")) gsap.delayedCall(0.4, welcome);
    } else {
      typePassword();
      if (!RM)
        gsap.from($$(".lock-top, .lock-user, .lock-foot"), {
          opacity: 0,
          y: 16,
          duration: 0.9,
          stagger: 0.12,
          delay: 0.15,
          ease: "power3.out",
        });
    }

    // tiny API for tests and recordings
    window.portfolio = { showEnd, logout, captainOpen, openPlayer,
      openApp,
      launchAgent,
      tour,
      stopTour,
      unlock,
      lockScreen,
      notify,
      wins,
      PROFILE,
    };
  }

  if (window.gsap) boot();
  else addEventListener("load", boot);
})();
