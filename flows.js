/* ═══════════════════════════════════════════════════════════
   Flow diagrams — Cargo-style canvases and HubSpot-style workflows.
   Nodes and connectors are drawn on a fixed 1040 × 540 stage; a "record"
   travels through them on a GSAP timeline. Provider names are generic.
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";
  const W = 1040,
    H = 540,
    NH = 58;
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NW = { cargo: 176, hubspot: 196 };
  // kind → [glyph, colour]
  const K = {
    in: ["●", "#0d3b47"],
    li: ["in", "#2a6f9e"],
    sn: ["◎", "#1f6f80"],
    jobs: ["▤", "#b0632a"],
    ai: ["✦", "#d97757"],
    code: ["{ }", "#16191b"],
    branch: ["⑂", "#e9a23b"],
    tier: ["★", "#e2a93a"],
    store: ["▦", "#3da5bb"],
    hs: ["H", "#ff7a59"],
    prov: ["◆", "#2fb67c"],
    app: ["⟳", "#3da5bb"],
    cargo: ["C", "#0d3b47"],
    slack: ["#", "#1e8a5a"],
    wait: ["◷", "#7b8791"],
    trig: ["⚡", "#ff7a59"],
    stop: ["✕", "#b63f35"],
    human: ["☺", "#5a6b7f"],
    prod: ["▣", "#0d3b47"],
    end: ["✓", "#7b8791"],
    pay: ["$", "#5b5bd6"],
    doc: ["¶", "#b0632a"],
  };
  const pills = (list, cls = "") =>
    `<span class="fn-pills ${cls}">${list.map((p, i) => `<u class="${i === 0 && !cls ? "g" : ""}">${p}</u>`).join("")}</span>`;
  const line = (ids) => ids.slice(1).map((b, i) => [ids[i], b]);

  const SETS = {
    /* ───────── Data & Scoring · everything built in Cargo ───────── */
    data: [
      {
        id: "score",
        g: "Scoring",
        tab: "Score ICP · 7 axes",
        theme: "cargo",
        token: "Northwind",
        what: "Every account gets a score out of 100 and a tier. The AI gathers the facts, with proof. A fixed script does the maths.",
        stat: ["8,000", "accounts scored"],
        foot: "The AI collects and justifies. It never gives the score.",
        nodes: [
          {
            id: "in",
            x: 20,
            y: 60,
            kind: "in",
            t: "Account",
            s: "name · domain",
          },
          {
            id: "li",
            x: 224,
            y: 60,
            kind: "li",
            t: "LinkedIn company",
            s: "size · headquarters",
            out: "1,200 employees · Paris",
          },
          {
            id: "sn",
            x: 428,
            y: 60,
            kind: "sn",
            t: "Sales Navigator ×3",
            s: "persona · leaders · SDRs",
            out: "2 GTM operators · 6 SDRs",
          },
          {
            id: "jobs",
            x: 632,
            y: 60,
            kind: "jobs",
            t: "Job posts",
            s: "a recent GTM role",
            out: "1 open SDR role",
          },
          {
            id: "ai",
            x: 836,
            y: 60,
            kind: "ai",
            t: "AI + web search",
            s: "fuzzy criteria + proof",
            out: "B2B · international",
          },
          {
            id: "js",
            x: 836,
            y: 300,
            kind: "code",
            t: "Script",
            s: "gates + 7 axes",
            out: "92 / 100",
          },
          {
            id: "tier",
            x: 580,
            y: 300,
            w: 226,
            kind: "tier",
            t: "Tier",
            html: pills(["Gold", "Silver", "Bronze", "Excluded"]),
          },
          {
            id: "mir",
            x: 380,
            y: 300,
            kind: "store",
            t: "CRM copy in Cargo",
            s: "custom columns",
            out: "reason · proof · grid v1",
          },
          {
            id: "hs",
            x: 184,
            y: 300,
            kind: "hs",
            t: "HubSpot",
            s: "Tier ICP · Score ICP",
          },
        ],
        edges: line([
          "in",
          "li",
          "sn",
          "jobs",
          "ai",
          "js",
          "tier",
          "mir",
          "hs",
        ]),
        steps: line([
          "in",
          "li",
          "sn",
          "jobs",
          "ai",
          "js",
          "tier",
          "mir",
          "hs",
        ]),
        lit: { tier: ".g" },
        result: {
          x: 20,
          y: 276,
          w: 146,
          t: "On the company",
          l: [
            "Tier ICP  <b>Gold</b>",
            "Score ICP  <b>92</b>",
            "Top fit  <b>yes</b>",
          ],
        },
      },
      {
        id: "inb",
        g: "Scoring",
        tab: "Score ICP inbound",
        theme: "cargo",
        token: "Halloway",
        what: "Classifies a company that just signed up on its own. A HubSpot workflow calls it, and the tool writes the answer back itself.",
        stat: ["4", "possible answers"],
        foot: "Same grid as the outbound score: one rule, two uses.",
        nodes: [
          {
            id: "a",
            x: 20,
            y: 90,
            kind: "hs",
            t: "Sign-up company",
            s: "from a HubSpot workflow",
          },
          {
            id: "b",
            x: 224,
            y: 90,
            kind: "li",
            t: "Find LinkedIn page",
            s: "from the domain",
            out: "page found",
          },
          {
            id: "tv",
            x: 224,
            y: 236,
            kind: "stop",
            t: "To verify",
            s: "no LinkedIn page",
          },
          {
            id: "c",
            x: 428,
            y: 90,
            kind: "tier",
            t: "Score ICP · 7 axes",
            s: "the same tool",
            out: "Silver · 58",
          },
          {
            id: "d",
            x: 632,
            y: 90,
            kind: "code",
            t: "Script",
            s: "tier → inbound class",
            out: "sales",
          },
          {
            id: "e",
            x: 836,
            y: 90,
            kind: "hs",
            t: "HubSpot",
            s: "ICP inbound, written",
          },
        ],
        edges: [
          ["a", "b"],
          ["b", "tv", "no page", 1],
          ["b", "c"],
          ["c", "d"],
          ["d", "e"],
        ],
        steps: line(["a", "b", "c", "d", "e"]),
        result: {
          x: 428,
          y: 250,
          w: 584,
          t: "The four answers",
          l: [
            "<b>Sales</b> · Gold or Silver",
            "<b>Self-serve</b> · in target, but too small for sales",
            "<b>Out of target</b> · B2C, agency, investor, dead sector, outside the zone",
            "<b>To verify</b> · no LinkedIn page",
          ],
        },
      },
      {
        id: "fit",
        g: "Scoring",
        tab: "Fit ICP + Fit Persona",
        theme: "cargo",
        token: "",
        what: "Two small AI checks used inside the pipeline. One reads a company, the other a job title. Each answers yes or no, with a score and the reason.",
        stat: ["2", "AI checks, each with its reason"],
        foot: "Titles that count: VP Sales, Head of Sales, CRO, RevOps, GTM Lead, SDR Manager, Growth Ops.",
        nodes: [
          {
            id: "f1",
            x: 60,
            y: 80,
            w: 210,
            kind: "in",
            t: "Account",
            s: "domain + firmographics",
          },
          {
            id: "f2",
            x: 410,
            y: 80,
            w: 210,
            kind: "ai",
            t: "Fit ICP (account)",
            s: "the model reads and decides",
          },
          {
            id: "f3",
            x: 760,
            y: 80,
            w: 240,
            kind: "store",
            t: "Answer",
            s: "fit yes/no · score /100 · reason",
            out: "yes · 84 · B2B SaaS, 400 people",
          },
          {
            id: "p1",
            x: 60,
            y: 290,
            w: 210,
            kind: "human",
            t: "Contact",
            s: "title + seniority",
          },
          {
            id: "p2",
            x: 410,
            y: 290,
            w: 210,
            kind: "ai",
            t: "Fit Persona (contact)",
            s: "the model reads and decides",
          },
          {
            id: "p3",
            x: 760,
            y: 290,
            w: 240,
            kind: "store",
            t: "Answer",
            s: "persona yes/no · score · reason",
            out: "yes · 90 · VP Sales",
          },
        ],
        edges: [
          ["f1", "f2"],
          ["f2", "f3"],
          ["p1", "p2"],
          ["p2", "p3"],
        ],
        steps: [
          ["f1", "f2"],
          ["f2", "f3"],
          ["p1", "p2"],
          ["p2", "p3"],
        ],
      },
      {
        id: "enrich",
        g: "Enrichment",
        tab: "Contact: verify + enrich",
        theme: "cargo",
        token: "Marie D.",
        what: "First check the contact is still at the company, in the zone, in the right role. Only then look for the missing email and phone, cheapest provider first.",
        stat: ["2", "providers in cascade"],
        foot: "Every email and number keeps its source.",
        nodes: [
          {
            id: "c",
            x: 20,
            y: 50,
            w: 150,
            kind: "in",
            t: "Contact",
            s: "from the CRM",
          },
          {
            id: "lp",
            x: 192,
            y: 50,
            w: 150,
            kind: "li",
            t: "LinkedIn profile",
            s: "role · company",
            out: "VP RevOps · FR",
          },
          {
            id: "chk",
            x: 364,
            y: 50,
            w: 164,
            kind: "code",
            t: "Control script",
            s: "company? zone? title?",
            out: "all three ✓",
          },
          {
            id: "stop",
            x: 370,
            y: 196,
            w: 150,
            kind: "stop",
            t: "Stop",
            s: "status = reason",
          },
          {
            id: "em",
            x: 560,
            y: 50,
            w: 150,
            kind: "branch",
            t: "Email missing?",
            s: "CRM value first",
          },
          {
            id: "e1",
            x: 728,
            y: 50,
            w: 140,
            kind: "prov",
            t: "Provider 1",
            s: "cheap first",
            out: "email found ✓",
          },
          {
            id: "e2",
            x: 884,
            y: 50,
            w: 140,
            kind: "prov",
            t: "Provider 2",
            s: "finds more",
          },
          {
            id: "ph",
            x: 722,
            y: 330,
            w: 150,
            kind: "branch",
            t: "Phone missing?",
            s: "CRM value first",
          },
          {
            id: "t1",
            x: 556,
            y: 330,
            w: 140,
            kind: "prov",
            t: "Provider 1",
            s: "cheap first",
            out: "no mobile",
          },
          {
            id: "t2",
            x: 390,
            y: 330,
            w: 140,
            kind: "prov",
            t: "Provider 2",
            s: "finds more",
            out: "mobile found ✓",
          },
          {
            id: "fin",
            x: 212,
            y: 330,
            w: 150,
            kind: "code",
            t: "Final script",
            s: "value + its source",
          },
          {
            id: "st",
            x: 34,
            y: 330,
            w: 150,
            kind: "store",
            t: "CRM copy",
            s: "custom columns",
          },
        ],
        edges: [
          ["c", "lp"],
          ["lp", "chk"],
          ["chk", "stop", "no", 1],
          ["chk", "em", "ok"],
          ["em", "e1"],
          ["e1", "e2", "nothing", 1],
          ["e1", "ph"],
          ["e2", "ph", "", 1],
          ["ph", "t1"],
          ["t1", "t2", "nothing"],
          ["t2", "fin"],
          ["fin", "st"],
        ],
        steps: line([
          "c",
          "lp",
          "chk",
          "em",
          "e1",
          "ph",
          "t1",
          "t2",
          "fin",
          "st",
        ]),
        result: {
          x: 34,
          y: 428,
          w: 496,
          t: "Contact verified",
          l: [
            "Email  <b>found</b> · source: provider 1  ·  Mobile  <b>found</b> · source: provider 2",
          ],
        },
      },
      {
        id: "phone",
        g: "Enrichment",
        tab: "Find the phone",
        theme: "cargo",
        token: "☑ Enrich phone",
        what: "A rep ticks a box on a contact in HubSpot, or clicks “Find number” in the sequencer. A few seconds later the mobile is on the record.",
        stat: ["1", "click, no phone spend without it"],
        foot: "The cheap provider is tried first. The expensive one only if it finds nothing.",
        nodes: [
          {
            id: "hs",
            x: 30,
            y: 70,
            w: 190,
            kind: "hs",
            t: "HubSpot contact",
            s: "☑ Enrich phone",
          },
          {
            id: "sq",
            x: 30,
            y: 186,
            w: 190,
            kind: "app",
            t: "Sequencer",
            s: "“Find number” button",
          },
          {
            id: "app",
            x: 286,
            y: 70,
            w: 212,
            kind: "app",
            t: "App",
            s: "re-reads HubSpot every ~10 s",
            out: "box ticked on 1 contact",
          },
          {
            id: "tool",
            x: 564,
            y: 70,
            w: 206,
            kind: "cargo",
            t: "Cargo tool",
            s: "find the phone",
          },
          {
            id: "p1",
            x: 850,
            y: 70,
            w: 160,
            kind: "prov",
            t: "Provider 1",
            s: "cheap first",
            out: "nothing",
          },
          {
            id: "p2",
            x: 850,
            y: 310,
            w: 160,
            kind: "prov",
            t: "Provider 2",
            s: "only if nothing",
            out: "mobile found ✓",
          },
          {
            id: "back",
            x: 548,
            y: 310,
            w: 236,
            kind: "app",
            t: "App writes back",
            s: "number · status · unticks the box",
          },
          {
            id: "hs2",
            x: 262,
            y: 310,
            w: 216,
            kind: "hs",
            t: "HubSpot contact",
            s: "mobile on the record",
          },
        ],
        edges: [
          ["hs", "app"],
          ["sq", "tool", "or", 1],
          ["app", "tool"],
          ["tool", "p1"],
          ["p1", "p2", "nothing"],
          ["p2", "back"],
          ["back", "hs2"],
        ],
        steps: line(["hs", "app", "tool", "p1", "p2", "back", "hs2"]),
        result: {
          x: 30,
          y: 292,
          w: 196,
          t: "A few seconds later",
          l: [
            "Mobile  <b>+33 6 •• •• •• ••</b>",
            "☐ Enrich phone",
            "Status  <b>found</b>",
          ],
        },
      },
      {
        id: "pipe",
        g: "Pipeline",
        tab: "Lookalike → phase 1",
        theme: "cargo",
        token: "new account",
        what: "Start from four reference customers, find companies that look like them, and let each step say no. What comes out is a short list of qualified contacts.",
        stat: ["6", "steps, lookalikes in, contacts out"],
        foot: "Each step can refuse: not a fit, already in the CRM, wrong persona.",
        nodes: [
          {
            id: "r",
            x: 20,
            y: 70,
            kind: "in",
            t: "4 reference customers",
            s: "the ones to copy",
          },
          {
            id: "lk",
            x: 224,
            y: 70,
            kind: "prov",
            t: "Lookalike provider",
            s: "similar companies",
            out: "new accounts",
          },
          {
            id: "fi",
            x: 428,
            y: 70,
            kind: "ai",
            t: "Fit ICP",
            s: "AI: fit? score? why?",
            out: "fit · 84",
          },
          {
            id: "dd",
            x: 632,
            y: 70,
            kind: "store",
            t: "Dedup HubSpot",
            s: "already in the CRM?",
            out: "not in the CRM",
          },
          {
            id: "st",
            x: 836,
            y: 70,
            kind: "sn",
            t: "Find stakeholders",
            s: "the decision makers",
            out: "3 people",
          },
          {
            id: "fp",
            x: 836,
            y: 300,
            kind: "ai",
            t: "Fit Persona",
            s: "AI: title + seniority",
            out: "VP Sales ✓",
          },
          {
            id: "q",
            x: 560,
            y: 300,
            w: 220,
            kind: "tier",
            t: "Qualified contacts",
            s: "ready for a campaign",
          },
        ],
        edges: line(["r", "lk", "fi", "dd", "st", "fp", "q"]),
        steps: line(["r", "lk", "fi", "dd", "st", "fp", "q"]),
        result: {
          x: 20,
          y: 290,
          w: 480,
          t: "Lookalikes in, qualified contacts out",
          l: ["Built as a test on four customers, then reusable for any list."],
        },
      },
      {
        id: "dedup",
        g: "Pipeline",
        tab: "Dedup HubSpot",
        theme: "cargo",
        token: "northwind.example",
        what: "From a domain, says whether the company is already known, and how. Nothing is prospected twice, and customers are never touched.",
        stat: ["5", "possible states"],
        foot: "One SQL lookup on the HubSpot mirror, no API call.",
        nodes: [
          {
            id: "in",
            x: 20,
            y: 241,
            kind: "in",
            t: "Domain",
            s: "of the company",
          },
          {
            id: "m",
            x: 236,
            y: 241,
            w: 206,
            kind: "store",
            t: "HubSpot mirror in Cargo",
            s: "one SQL lookup",
          },
          {
            id: "b",
            x: 486,
            y: 241,
            kind: "branch",
            t: "Already known?",
            s: "and how",
          },
          {
            id: "o1",
            x: 770,
            y: 20,
            w: 240,
            kind: "end",
            t: "None",
            s: "new account: go",
          },
          {
            id: "o2",
            x: 770,
            y: 128,
            w: 240,
            kind: "human",
            t: "Contact only",
            s: "known, no deal yet",
          },
          {
            id: "o3",
            x: 770,
            y: 236,
            w: 240,
            kind: "wait",
            t: "Open deal",
            s: "hands off",
          },
          {
            id: "o4",
            x: 770,
            y: 344,
            w: 240,
            kind: "tier",
            t: "Won",
            s: "a customer: never prospect",
          },
          {
            id: "o5",
            x: 770,
            y: 452,
            w: 240,
            kind: "stop",
            t: "Cooling-off",
            s: "contacted recently: wait",
          },
        ],
        edges: [
          ["in", "m"],
          ["m", "b"],
          ["b", "o1"],
          ["b", "o2", "", 1],
          ["b", "o3", "", 1],
          ["b", "o4", "", 1],
          ["b", "o5", "", 1],
        ],
        steps: [
          ["in", "m"],
          ["m", "b"],
          ["b", "o1"],
        ],
      },
      {
        id: "ctx",
        g: "Knowledge base",
        tab: "Context · 19 notes",
        theme: "cargo",
        token: "rule",
        what: "Nineteen short notes describe who we sell to and how. Every Cargo agent reads them, so a rule changed in one place holds for every tool.",
        stat: ["19", "notes read by the agents"],
        foot: "Written once, in plain words, for people and for machines.",
        nodes: [
          {
            id: "kb",
            x: 20,
            y: 150,
            w: 330,
            h: 236,
            kind: "doc",
            t: "Context",
            html: pills(
              [
                "ICP 1",
                "ICP 2",
                "ICP 3",
                "Personas",
                "Jobs-to-be-done",
                "Alternatives",
                "Proof",
                "Signals",
                "Channels",
                "Prospecting play",
                "Field feedback",
              ],
              "fn-pills--wrap",
            ),
          },
          {
            id: "a1",
            x: 450,
            y: 40,
            w: 216,
            kind: "app",
            t: "Context Agent",
            s: "reads and updates the notes",
          },
          {
            id: "a2",
            x: 450,
            y: 170,
            w: 216,
            kind: "li",
            t: "LinkedIn Agent",
            s: "writes in our words",
          },
          {
            id: "a3",
            x: 450,
            y: 300,
            w: 216,
            kind: "ai",
            t: "Master Agent (GTM)",
            s: "qualifies and decides",
          },
          {
            id: "a4",
            x: 450,
            y: 430,
            w: 216,
            kind: "jobs",
            t: "Documentation Agent",
            s: "keeps the docs in line",
          },
          {
            id: "out",
            x: 770,
            y: 235,
            w: 250,
            kind: "tier",
            t: "One rule, everywhere",
            s: "change it once, all tools follow",
          },
        ],
        edges: [
          ["kb", "a1"],
          ["kb", "a2"],
          ["kb", "a3"],
          ["kb", "a4"],
          ["a1", "out"],
          ["a2", "out"],
          ["a3", "out"],
          ["a4", "out"],
        ],
        steps: [
          ["kb", "a1"],
          ["a1", "out"],
          ["kb", "a2"],
          ["a2", "out"],
          ["kb", "a3"],
          ["a3", "out"],
          ["kb", "a4"],
          ["a4", "out"],
        ],
      },
      {
        id: "models",
        g: "Knowledge base",
        tab: "Data models",
        theme: "cargo",
        token: "",
        what: "What Cargo can see. The CRM is mirrored, billing is plugged in, and the tools query all of it in one place.",
        stat: ["4", "sources plugged in"],
        foot: "Billing data is what makes the PLG engine possible.",
        nodes: [
          {
            id: "s1",
            x: 20,
            y: 40,
            w: 230,
            kind: "hs",
            t: "HubSpot mirrors",
            s: "companies · contacts",
          },
          {
            id: "s2",
            x: 20,
            y: 160,
            w: 230,
            kind: "pay",
            t: "Stripe · US + FR",
            s: "customers · subscriptions · invoices",
          },
          {
            id: "s3",
            x: 20,
            y: 280,
            w: 230,
            kind: "in",
            t: "GTM lists",
            s: "accounts · people · events",
          },
          {
            id: "s4",
            x: 20,
            y: 400,
            w: 230,
            kind: "sn",
            t: "Partner signals",
            s: "integration tested",
          },
          {
            id: "hub",
            x: 404,
            y: 210,
            w: 214,
            h: 86,
            kind: "cargo",
            t: "Cargo models",
            s: "all of it, queryable",
          },
          {
            id: "u1",
            x: 770,
            y: 80,
            w: 250,
            kind: "store",
            t: "Dedup · tiers · status",
            s: "from the CRM mirror",
          },
          {
            id: "u2",
            x: 770,
            y: 224,
            w: 250,
            kind: "prod",
            t: "PLG engine",
            s: "sign-up · payment · plan · churn",
          },
          {
            id: "u3",
            x: 770,
            y: 368,
            w: 250,
            kind: "human",
            t: "Lists for sales",
            s: "ready to call",
          },
        ],
        edges: [
          ["s1", "hub"],
          ["s2", "hub"],
          ["s3", "hub"],
          ["s4", "hub"],
          ["hub", "u1"],
          ["hub", "u2"],
          ["hub", "u3"],
        ],
        steps: [
          ["s1", "hub"],
          ["hub", "u1"],
          ["s2", "hub"],
          ["hub", "u2"],
          ["s3", "hub"],
          ["hub", "u3"],
          ["s4", "hub"],
        ],
      },
    ],

    /* ───────── CRM & PLG · HubSpot workflows ───────── */
    crm: [
      {
        id: "plg",
        tab: "PLG engine",
        theme: "hubspot",
        token: "event",
        what: "The product and Stripe tell HubSpot what just happened. Cargo adds the ICP score. Workflows then alert the right person.",
        stat: ["5", "workflows fed by the product"],
        foot: "Payment is read on the company, never on the contact.",
        nodes: [
          {
            id: "prod",
            x: 24,
            y: 110,
            w: 210,
            kind: "prod",
            t: "Product",
            s: "sign-up · onboarding intent",
          },
          {
            id: "pay",
            x: 24,
            y: 300,
            w: 210,
            kind: "pay",
            t: "Stripe · US + FR",
            s: "payment · plan change · cancel",
          },
          {
            id: "props",
            x: 300,
            y: 205,
            w: 210,
            kind: "hs",
            t: "HubSpot company",
            s: "app_* properties",
          },
          {
            id: "score",
            x: 560,
            y: 205,
            w: 190,
            kind: "cargo",
            t: "Cargo",
            s: "ICP inbound score",
          },
          {
            id: "wc",
            x: 806,
            y: 96,
            w: 214,
            kind: "slack",
            t: "CSM workflows ×3",
            s: "paid · plan change · cancelled",
          },
          {
            id: "ws",
            x: 806,
            y: 314,
            w: 214,
            kind: "slack",
            t: "Sales workflows ×2",
            s: "not paid · trial cancelled",
          },
        ],
        edges: [
          ["prod", "props"],
          ["pay", "props"],
          ["props", "score"],
          ["score", "wc"],
          ["score", "ws"],
        ],
        steps: [
          ["prod", "props"],
          ["pay", "props"],
          ["props", "score"],
          ["score", "wc"],
          ["score", "ws"],
        ],
      },
      {
        id: "inbound",
        tab: "Inbound routing",
        theme: "hubspot",
        token: "Halloway",
        what: "Every self-serve sign-up is scored and routed on its own. Sales only hears about sign-ups that are in target and did not pay.",
        stat: ["0", "manual step"],
        foot: "The delay was set from real data, so sales is not alerted about people who pay right after.",
        nodes: [
          {
            id: "t",
            x: 422,
            y: 12,
            kind: "trig",
            t: "Sign-up in the product",
            s: "event synced to HubSpot",
          },
          {
            id: "p",
            x: 422,
            y: 98,
            kind: "hs",
            t: "Company properties",
            s: "plan · trial end · intent",
            out: "App plan = free trial",
          },
          {
            id: "s",
            x: 422,
            y: 184,
            kind: "cargo",
            t: "Run Cargo tool",
            s: "ICP inbound score",
            out: "ICP inbound = Sales",
          },
          {
            id: "d",
            x: 422,
            y: 270,
            kind: "wait",
            t: "Delay",
            s: "a short wait",
          },
          {
            id: "b",
            x: 422,
            y: 356,
            kind: "branch",
            t: "Branch",
            s: "paid? · ICP inbound?",
            out: "not paid · in target",
          },
          {
            id: "o1",
            x: 56,
            y: 462,
            kind: "end",
            t: "End",
            s: "the CSM was already alerted",
          },
          {
            id: "o2",
            x: 422,
            y: 462,
            kind: "stop",
            t: "Nothing is sent",
            s: "sales is not disturbed",
          },
          {
            id: "o3",
            x: 788,
            y: 462,
            kind: "slack",
            t: "Slack #demo",
            s: "sales: book a demo",
          },
        ],
        edges: [
          ["t", "p"],
          ["p", "s"],
          ["s", "d"],
          ["d", "b"],
          ["b", "o1", "paid", 1],
          ["b", "o2", "out of target", 1],
          ["b", "o3", "in target · not paid"],
        ],
        steps: line(["t", "p", "s", "d", "b", "o3"]),
        result: {
          x: 744,
          y: 250,
          w: 270,
          t: "🔔 Slack · #demo",
          l: [
            "<b>New PQL</b> · Halloway · in target",
            "Signed up, did not pay",
            "→ <b>book a demo</b>",
          ],
        },
      },
      {
        id: "retention",
        tab: "Retention alerts",
        theme: "hubspot",
        token: "",
        what: "Three triggers watch what happens after sign-up. The CSM hears about customers, sales hears about trials that stop.",
        stat: ["3", "alerts, each with the right owner"],
        foot: "Each alert goes to the person who can act on it.",
        nodes: [
          {
            id: "a1",
            x: 40,
            y: 40,
            kind: "trig",
            t: "Plan changed",
            s: "between two paid plans",
          },
          {
            id: "a2",
            x: 40,
            y: 400,
            kind: "slack",
            t: "Slack #onboarding",
            s: "CSM: old plan → new plan",
          },
          {
            id: "b1",
            x: 422,
            y: 40,
            kind: "trig",
            t: "Trial cancelled",
            s: "never paid",
          },
          {
            id: "b2",
            x: 422,
            y: 160,
            kind: "wait",
            t: "Delay",
            s: "a short wait",
          },
          {
            id: "b3",
            x: 422,
            y: 280,
            kind: "branch",
            t: "Branch",
            s: "ICP inbound?",
            out: "in target",
          },
          {
            id: "b4",
            x: 422,
            y: 400,
            kind: "slack",
            t: "Slack #demo",
            s: "sales: what blocked?",
          },
          {
            id: "c1",
            x: 804,
            y: 40,
            kind: "trig",
            t: "Subscription cancelled",
            s: "churn",
          },
          {
            id: "c2",
            x: 804,
            y: 400,
            kind: "slack",
            t: "Slack #onboarding",
            s: "CSM: start and end dates",
          },
        ],
        edges: [
          ["a1", "a2"],
          ["b1", "b2"],
          ["b2", "b3"],
          ["b3", "b4", "in target"],
          ["c1", "c2"],
        ],
        steps: [
          ["a1", "a2"],
          ["b1", "b2"],
          ["b2", "b3"],
          ["b3", "b4"],
          ["c1", "c2"],
        ],
      },
      {
        id: "structure",
        tab: "CRM structure",
        theme: "hubspot",
        token: "",
        what: "A CRM where everyone knows which fields to trust: each source writes its own fields, and nobody writes in someone else's.",
        stat: ["1", "source per field"],
        foot: "A CSV backup comes before every bulk change, and the restore is tested on five records first.",
        nodes: [
          {
            id: "prod",
            x: 30,
            y: 26,
            w: 206,
            kind: "prod",
            t: "Product + Stripe",
            s: "app_* properties",
          },
          {
            id: "cg",
            x: 30,
            y: 122,
            w: 206,
            kind: "cargo",
            t: "Cargo",
            s: "tier · score · ICP inbound",
          },
          {
            id: "seq",
            x: 30,
            y: 218,
            w: 206,
            kind: "app",
            t: "Sequencer",
            s: "activities · sequence status",
          },
          {
            id: "call",
            x: 30,
            y: 314,
            w: 206,
            kind: "wait",
            t: "Calling tool",
            s: "calls · follow-up tasks",
          },
          {
            id: "hum",
            x: 30,
            y: 410,
            w: 206,
            kind: "human",
            t: "People",
            s: "owner · stage · lost reason",
          },
          {
            id: "hub",
            x: 364,
            y: 196,
            w: 214,
            h: 102,
            kind: "hs",
            t: "HubSpot",
            s: "one source = its own fields",
          },
          {
            id: "ls",
            x: 690,
            y: 26,
            w: 324,
            h: 128,
            kind: "branch",
            t: "Lead status",
            html: pills(
              [
                "New",
                "In Progress",
                "Attempted",
                "Connected",
                "Open Deal",
                "Bad Timing",
                "Unqualified",
              ],
              "fn-pills--wrap",
            ),
          },
          {
            id: "own",
            x: 690,
            y: 218,
            w: 324,
            kind: "human",
            t: "Ownership",
            s: "country → owner · no rep, no owner",
          },
          {
            id: "dd",
            x: 690,
            y: 340,
            w: 324,
            kind: "store",
            t: "Deduplication",
            s: "sure matches merged in waves",
          },
        ],
        edges: [
          ["prod", "hub"],
          ["cg", "hub"],
          ["seq", "hub"],
          ["call", "hub"],
          ["hum", "hub"],
          ["hub", "ls"],
          ["hub", "own"],
          ["hub", "dd"],
        ],
        steps: [
          ["prod", "hub"],
          ["cg", "hub"],
          ["seq", "hub"],
          ["call", "hub"],
          ["hum", "hub"],
          ["hub", "ls"],
          ["hub", "own"],
          ["hub", "dd"],
        ],
      },
    ],
  };

  const box = (f, n) => ({
    x: n.x,
    y: n.y,
    w: n.w || NW[f.theme],
    h: n.h || NH,
  });
  function curve(A, B) {
    const ac = { x: A.x + A.w / 2, y: A.y + A.h / 2 },
      bc = { x: B.x + B.w / 2, y: B.y + B.h / 2 };
    const dx = bc.x - ac.x,
      dy = bc.y - ac.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      const s = dx > 0 ? 1 : -1,
        x1 = ac.x + (s * A.w) / 2,
        x2 = bc.x - (s * B.w) / 2,
        k = Math.max(26, Math.abs(x2 - x1) / 2);
      return `M${x1} ${ac.y} C${x1 + s * k} ${ac.y}, ${x2 - s * k} ${bc.y}, ${x2} ${bc.y}`;
    }
    const s = dy > 0 ? 1 : -1,
      y1 = ac.y + (s * A.h) / 2,
      y2 = bc.y - (s * B.h) / 2,
      k = Math.max(22, Math.abs(y2 - y1) / 2);
    return `M${ac.x} ${y1} C${ac.x} ${y1 + s * k}, ${bc.x} ${y2 - s * k}, ${bc.x} ${y2}`;
  }

  /** Draws one flow into `host` and returns { tl, destroy }. */
  function mount(host, f) {
    const st = document.createElement("div");
    st.className = `fl-stage fl--${f.theme} fl-id--${f.id}`;
    const N = Object.fromEntries(f.nodes.map((n) => [n.id, n]));
    st.innerHTML =
      `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true">${f.edges
        .map(([a, b, , dim]) => {
          const d = curve(box(f, N[a]), box(f, N[b]));
          return `<path class="fe ${dim ? "fe--dim" : ""}" d="${d}"/><path class="fe-on" data-e="${a}>${b}" d="${d}"/>`;
        })
        .join("")}</svg>` +
      f.nodes
        .map((n) => {
          const b = box(f, n),
            [g, c] = K[n.kind];
          return `<div class="fn fn--${n.kind} ${n.h ? "fn--tall" : ""}" data-n="${n.id}" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px"><i style="background:${c}">${g}</i><span><b>${n.t}</b>${n.s ? `<small>${n.s}</small>` : ""}${n.html || ""}</span>${n.out ? `<em class="fn-out">${n.out}</em>` : ""}</div>`;
        })
        .join("") +
      (f.result
        ? `<div class="fl-res" style="left:${f.result.x}px;top:${f.result.y}px;width:${f.result.w}px"><b>${f.result.t}</b>${f.result.l.map((l) => `<span>${l}</span>`).join("")}</div>`
        : "") +
      `<div class="fl-tok ${f.token ? "" : "fl-tok--dot"}"><i></i>${f.token || ""}</div><p class="fl-foot">${f.foot}</p>`;
    host.appendChild(st);
    const q = (s) => st.querySelector(s),
      node = (id) => q(`[data-n="${id}"]`);
    // edge labels sit at the middle of their connector
    f.edges.forEach(([a, b, label]) => {
      if (!label) return;
      const p = q(`[data-e="${a}>${b}"]`),
        pt = p.getPointAtLength(p.getTotalLength() / 2),
        l = document.createElement("span");
      l.className = "fe-lbl";
      l.textContent = label;
      l.style.left = pt.x + "px";
      l.style.top = pt.y + "px";
      st.appendChild(l);
    });

    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.4 });
    const tok = q(".fl-tok"),
      accent = f.theme === "hubspot" ? "#ff7a59" : "#3da5bb";
    const lit = new Set();
    const pulse = (id, t) =>
      tl.fromTo(
        node(id),
        { scale: 1 },
        {
          scale: 1.045,
          duration: 0.16,
          yoyo: true,
          repeat: 1,
          ease: "power2.out",
        },
        t,
      );
    const light = (id, t) => {
      pulse(id, t);
      if (lit.has(id)) return;
      lit.add(id);
      const n = node(id),
        out = n.querySelector(".fn-out");
      tl.fromTo(
        n,
        {
          borderColor: "#dfe3e6",
          boxShadow: "0 2px 6px rgba(13,59,71,.07), 0 0 0 0 rgba(0,0,0,0)",
        },
        {
          borderColor: accent,
          boxShadow: `0 10px 26px rgba(13,59,71,.16), 0 0 0 4px ${accent}33`,
          duration: 0.3,
        },
        t,
      );
      if (out)
        tl.fromTo(
          out,
          { opacity: 0, y: -6, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2)" },
          t + 0.12,
        );
      if (f.lit?.[id])
        tl.fromTo(
          n.querySelector(f.lit[id]),
          { backgroundColor: "#eef0f1", color: "#7b8791", scale: 1 },
          {
            backgroundColor: "#e9b949",
            color: "#3d2a00",
            scale: 1.12,
            duration: 0.35,
            ease: "back.out(3)",
          },
          t + 0.1,
        );
    };
    gsap.set(tok, { xPercent: -50, yPercent: -50 });
    tl.set(tok, { opacity: 0 }, 0);
    let t = 0.5,
      at = null;
    f.steps.forEach(([a, b]) => {
      const p = q(`[data-e="${a}>${b}"]`),
        len = p.getTotalLength(),
        d = Math.max(0.5, len / 330),
        o = { p: 0 };
      if (at !== a) {
        light(a, t);
        t += 0.45;
      }
      p.style.strokeDasharray = len;
      const place = () => {
        const pt = p.getPointAtLength(len * o.p);
        gsap.set(tok, { x: pt.x, y: pt.y });
      };
      tl.fromTo(
        o,
        { p: 0 },
        {
          p: 1,
          duration: d,
          ease: "power1.inOut",
          onUpdate: place,
          onStart: place,
        },
        t,
      );
      tl.to(tok, { opacity: 1, duration: 0.15 }, t);
      tl.fromTo(
        p,
        { strokeDashoffset: len, opacity: 1 },
        { strokeDashoffset: 0, duration: d, ease: "power1.inOut" },
        t,
      );
      t += d;
      tl.to(tok, { opacity: 0, duration: 0.15 }, t);
      light(b, t);
      t += 0.5;
      at = b;
    });
    if (f.result)
      tl.fromTo(
        q(".fl-res"),
        { opacity: 0, y: 14, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.8)" },
        t,
      );
    tl.fromTo(
      q(".fl-foot"),
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      t + 0.2,
    );
    tl.to({}, { duration: 3.4 }, t + 0.7);
    st.querySelectorAll(".fe-on").forEach((p) => {
      if (!p.style.strokeDasharray) p.style.opacity = 0;
    });

    const fit = () => (st.style.transform = `scale(${host.clientWidth / W})`);
    const ro = new ResizeObserver(() => requestAnimationFrame(fit));
    ro.observe(host);
    fit();
    return {
      tl,
      destroy: () => {
        ro.disconnect();
        tl.kill();
        st.remove();
      },
    };
  }

  /** Groups + tabs + description + canvas for one set of flows. Returns { dispose, show(id) }. */
  function mountSet(root, setId) {
    const set = SETS[setId];
    const groups = [...new Set(set.map((f) => f.g).filter(Boolean))];
    root.innerHTML = `
      <div class="fl">
        ${groups.length ? `<div class="fl__groups" role="tablist">${groups.map((g) => `<button role="tab" data-g="${g}">${g}<i>${set.filter((f) => f.g === g).length}</i></button>`).join("")}</div>` : ""}
        <div class="fl__tabs" role="tablist"></div>
        <div class="fl__meta"><p class="fl__what"></p><div class="fl__stat"><b></b><span></span></div></div>
        <div class="fl__scroll"><div class="fl__box"></div></div>
        <div class="fl__ctl"><span class="fl__brand">${setId === "data" ? "Built in Cargo · drawn like its canvas · provider names kept generic" : "HubSpot workflows · trigger → branches → actions"}</span><button class="fl__pp" aria-label="Pause">❚❚ Pause</button><button class="fl__re" aria-label="Replay">↻ Replay</button></div>
      </div>`;
    const $ = (s) => root.querySelector(s);
    let cur = null;
    const sync = () =>
      ($(".fl__pp").textContent = cur.tl.paused() ? "▶ Play" : "❚❚ Pause");
    const show = (id) => {
      const f = set.find((x) => x.id === id) || set[0];
      cur?.destroy();
      root
        .querySelectorAll(".fl__groups button")
        .forEach((b) => b.classList.toggle("on", b.dataset.g === f.g));
      $(".fl__tabs").innerHTML = set
        .filter((x) => x.g === f.g)
        .map(
          (x) =>
            `<button role="tab" data-id="${x.id}" class="${x === f ? "on" : ""}" aria-selected="${x === f}">${x.tab}</button>`,
        )
        .join("");
      $(".fl__what").textContent = f.what;
      $(".fl__stat b").textContent = f.stat[0];
      $(".fl__stat span").textContent = f.stat[1];
      cur = mount($(".fl__box"), f);
      if (RM) cur.tl.progress(0.97).pause();
      else cur.tl.play(0);
      sync();
    };
    root.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.id) show(b.dataset.id);
      else if (b.dataset.g) show(set.find((f) => f.g === b.dataset.g).id);
      else if (b.classList.contains("fl__pp")) {
        cur.tl.paused(!cur.tl.paused());
        sync();
      } else if (b.classList.contains("fl__re")) {
        cur.tl.play(0);
        sync();
      }
    });
    show(set[0].id);
    return { dispose: () => cur?.destroy(), show };
  }

  window.Flows = { mountSet };
})();
