/* ═══════════════════════════════════════════════════════════
   Sillage Reach — view-only replica for the portfolio.
   Rebuilt in HTML/CSS. Fictional people and companies only.
   Nothing here talks to a server: every "write" button is inert.
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ic = (d) =>
    `<svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    today: ic(
      '<path d="M3 4.5l1.5 1.5L7 3.5M3 10.5l1.5 1.5L7 9.5M10 5h7M10 11h7M10 16.5h7M3.5 16.5h3"/>',
    ),
    dialer: ic(
      '<path d="M5 3h3l1.4 4-1.9 1.2a9 9 0 0 0 4.3 4.3l1.2-1.900 4 1.400v3a1.500 1.500 0 0 1-1.600 1.500C9.500 16.800 3.200 10.500 3.500 4.600A1.500 1.500 0 0 1 5 3z"/>',
    ),
    inbox: ic(
      '<path d="M3 11l2.200-6h9.600L17 11v4.500a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M3 11h4l1 2h4l1-2h4"/>',
    ),
    campaigns: ic('<path d="M17 3L9 11M17 3l-5 14-3-6-6-3z"/>'),
    performance: ic('<path d="M4 17V9M10 17V4M16 17v-6M3 17h14"/>'),
    events: ic(
      '<rect x="3" y="4.500" width="14" height="12.500" rx="2"/><path d="M3 8.500h14M7 3v3M13 3v3"/>',
    ),
    settings: ic(
      '<path d="M3 6h9M15.500 6H17M3 14h2M8.500 14H17"/><circle cx="13.500" cy="6" r="1.600"/><circle cx="6.500" cy="14" r="1.600"/>',
    ),
    mail: ic(
      '<rect x="3" y="4.500" width="14" height="11" rx="2"/><path d="M3.500 6l6.500 5 6.500-5"/>',
    ),
    li: `<svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true"><rect x="2" y="2" width="16" height="16" rx="3.500" fill="#2a6f9e"/><path d="M6 8.500v6M6 5.800v.1M9.500 14.500v-6M9.500 11c0-3 4.500-3.400 4.500 0v3.500" stroke="#fff" stroke-width="1.700" stroke-linecap="round" fill="none"/></svg>`,
    bolt: ic('<path d="M11 2.500L4.500 11.500h5L9 17.500l6.500-9h-5z"/>'),
    chev: ic('<path d="M7 8l3 3 3-3"/>'),
    search: ic('<circle cx="9" cy="9" r="5"/><path d="M13 13l4 4"/>'),
    ext: ic('<path d="M11 4h5v5M16 4l-7 7M14 11.500V16H4V6h4.500"/>'),
  };
  const sign = ["Claire Dubois", "Head of Sales", "Sillage"];
  const LEADS = [
    {
      n: "Laure Faure",
      i: "LF",
      role: "Key Account Director",
      co: "Northwind",
      ci: "NW",
      meta: ["6 months in role", "Nantes, France"],
      email: "laure@northwind.example",
      why: "Joined Northwind as Key Account Director",
      when: "spotted 6d ago",
      detail: "New role detected on LinkedIn.",
      facts: ["1,200 employees", "B2B software, Series B"],
      subject: "Congrats on Northwind",
      f1: [
        "Hi Laure,",
        "Congrats on the move to Northwind. New company, new priorities, so I wanted to be early.",
        "We help teams like yours see which accounts have a reason to talk this week, and I would be glad to show you how.",
        "Want me to show you?",
      ],
      f2: [
        "Hi Laure,",
        "One concrete example: a new VP Sales landing at one of your target accounts, flagged the same morning.",
        "Worth 15 minutes?",
      ],
      w1: "39 of 70 words",
      w2: "22 of 45 words",
    },
    {
      n: "Marc Dupuis",
      i: "MD",
      role: "Chief Revenue Officer",
      co: "Brightwave",
      ci: "BW",
      meta: ["3 years in role", "Lyon, France"],
      email: "marc@brightwave.example",
      why: "Opened 3 sales roles this week",
      when: "spotted 2d ago",
      detail: "Hiring signal on the sales team.",
      facts: ["640 employees", "Fintech, Series C"],
      subject: "Three sales hires at once",
      f1: [
        "Hi Marc,",
        "Three sales roles opened at Brightwave this week. When a team grows that fast, the hard part is knowing where to point it first.",
        "We flag the accounts that have a reason to talk now. Happy to show you on your own territory.",
        "Open to a quick look?",
      ],
      f2: [
        "Hi Marc,",
        "If the new hires start next month, their first call list could already be sorted by signal.",
        "Shall I send two slots?",
      ],
      w1: "47 of 70 words",
      w2: "24 of 45 words",
    },
    {
      n: "Sarah Kim",
      i: "SK",
      role: "VP Revenue",
      co: "Halloway",
      ci: "HA",
      meta: ["1 year in role", "London, UK"],
      email: "sarah@halloway.example",
      why: "Commented on a post about signal-based selling",
      when: "spotted 1d ago",
      detail: "Keyword signal on LinkedIn.",
      facts: ["180 employees", "HR tech, Series A"],
      subject: "Your comment on signal-based selling",
      f1: [
        "Hi Sarah,",
        "I saw your comment on signal-based selling. You said timing beats volume, and I agree.",
        "That is exactly what we work on: the right account, the week it matters.",
        "Curious how you handle it today?",
      ],
      f2: [
        "Hi Sarah,",
        "Happy to share what we see working for teams of your size, no deck.",
        "Does Thursday suit you?",
      ],
      w1: "44 of 70 words",
      w2: "21 of 45 words",
    },
  ];
  const THREADS = [
    {
      ch: "linkedin",
      n: "Carla Bianchi",
      i: "CB",
      role: "Enterprise Sales Director",
      co: "Orbit Labs",
      t: "10:58",
      last: "Yes, happy to chat. Do you have time Thursday afternoon?",
      msgs: [
        [
          "me",
          "Thanks for connecting, Carla. I noticed your team just opened a London office. Curious how you decide who to reach out to first?",
          "Nov 16",
        ],
        [
          "them",
          "Hi! Good question, honestly it is mostly gut feeling right now.",
          "Yesterday",
        ],
        [
          "me",
          "That is what we hear a lot. We turn signals like hiring and funding into a short list each morning. Would a 15 minute demo help?",
          "",
        ],
        [
          "them",
          "Yes, happy to chat. Do you have time Thursday afternoon?",
          "Today",
        ],
      ],
    },
    {
      ch: "linkedin",
      n: "Antoine Girard",
      i: "AG",
      role: "Head of Growth",
      co: "Lumen Works",
      t: "09:38",
      last: "Easier here, yes. Tuesday at 10 works for me.",
      msgs: [
        [
          "me",
          "Hi Antoine, would it be easier to continue here than by email?",
          "Yesterday",
        ],
        ["them", "Easier here, yes. Tuesday at 10 works for me.", "Today"],
      ],
    },
    {
      ch: "linkedin",
      n: "Marie Dupont",
      i: "MD",
      role: "VP Revenue Operations",
      co: "Brightwave",
      t: "06:38",
      last: "Thanks for the message. Who else at my level uses this?",
      msgs: [
        [
          "me",
          "Hi Marie, congrats on the new role. I can show you how RevOps teams sort their accounts by signal.",
          "Monday",
        ],
        [
          "them",
          "Thanks for the message. Who else at my level uses this?",
          "Today",
        ],
      ],
    },
    {
      ch: "email",
      n: "Nina Costa",
      i: "NC",
      role: "Head of Partnerships",
      co: "Tallyboard",
      t: "09:57",
      last: "Thanks for reaching out! Happy to chat next week.",
      msgs: [
        [
          "me",
          "Hi Nina, a short note after your team's announcement last week. Would it be useful to see which partners' customers are in-market right now?",
          "Monday",
        ],
        ["them", "Thanks for reaching out! Happy to chat next week.", "Today"],
      ],
    },
    {
      ch: "email",
      n: "Paul Girard",
      i: "PG",
      role: "VP Sales",
      co: "Fernhill",
      t: "Tue",
      last: "Not now, try me again next quarter.",
      msgs: [
        [
          "me",
          "Hi Paul, a short note, and why it could be useful to you.",
          "Last week",
        ],
        ["them", "Not now, try me again next quarter.", "Tuesday"],
      ],
    },
  ];
  const CAMPS = [
    {
      n: "Promotions & keyword signals — Tier 1",
      st: "Active",
      enrolled: 14,
      review: 8,
      approved: 6,
      rep: "3 of 6 replied",
      sig: "Job change, Keyword — “signal-based”, “intent data”, Keyword — competitor engagement",
      obj: "Catch promotions, new roles and keyword signals at target accounts within a day, and open with something specific enough to earn a reply.",
      where: [
        ["In review", 8],
        ["In sequence", 3],
        ["Replied", 3],
      ],
    },
    {
      n: "Key accounts — new decision makers",
      st: "Active",
      enrolled: 22,
      review: 5,
      approved: 17,
      rep: "6 of 17 replied",
      sig: "Job change at a key account",
      obj: "When a new decision maker lands at a key account, be the first relevant message in their inbox.",
      where: [
        ["In review", 5],
        ["In sequence", 11],
        ["Replied", 6],
      ],
    },
    {
      n: "Event follow-up — Paris RevOps Dinner",
      st: "Paused",
      enrolled: 9,
      review: 0,
      approved: 9,
      rep: "4 of 9 replied",
      sig: "People met at an event",
      obj: "Follow up within two days with the people met at the dinner, mentioning what was discussed.",
      where: [
        ["In sequence", 5],
        ["Replied", 4],
      ],
    },
  ];
  const EVENTS = [
    {
      wk: "This week",
      m: "NOV",
      d: 19,
      w: "Thu",
      n: "Lyon Growth Breakfast",
      city: "🇫🇷 Lyon",
      tag: "Prospect",
      desc: "Growth leads from Lyon scale-ups over breakfast.",
      who: ["CD"],
      going: true,
      ppl: [
        ["Marie Dupont · Acme", "In review →", 1],
        ["Sam Lee · Orbit", "In review →", 1],
        ["Cyd Buyer · Customer Co", "Skipped: key-account customer", 0],
      ],
    },
    {
      wk: "This week",
      m: "NOV",
      d: 22,
      w: "Sun",
      n: "Paris RevOps Dinner",
      city: "🇫🇷 Paris",
      tag: "Prospect",
      desc: "Twelve RevOps and Sales Ops leads from scale-ups, the exact buyers of signal tooling.",
      who: ["TE", "SL", "CD"],
      going: true,
      ppl: [],
    },
    {
      wk: "Next week",
      m: "NOV",
      d: 25,
      w: "Wed",
      n: "GTM Builders Meetup",
      city: "🇬🇧 London",
      tag: "Partner",
      desc: "People who build their own GTM workflows share what works.",
      who: ["TE", "SL"],
      going: false,
      ppl: [],
    },
    {
      wk: "Next week",
      m: "NOV",
      d: 28,
      w: "Sat",
      n: "AI on Draught",
      city: "🇬🇧 London",
      tag: "Prospect",
      desc: "Heads of Sales and RevOps meet over a pint.",
      who: ["TE"],
      going: false,
      ppl: [],
    },
  ];
  const OBJ = {
    "No budget":
      "“Understood. Most teams start with one territory to prove it. Can I show you what that looks like?”",
    "Not now":
      "“Fair. When would be a better moment, and what will have changed by then?”",
    "Not a priority":
      "“What is the priority this quarter? I ask because signals often feed exactly that.”",
    Other: "Listen, note it, and book a follow-up.",
  };
  const NAV = [
    ["today", "Today", 3],
    ["dialer", "Dialer"],
    ["inbox", "Inbox", 2],
    ["campaigns", "Campaigns"],
    ["performance", "Performance"],
    ["events", "Events"],
    ["settings", "Settings"],
  ];
  const TITLES = {
    today: "Today",
    dialer: "Dialer",
    inbox: "Inbox",
    campaigns: "Campaigns",
    performance: "Performance",
    events: "Events",
    settings: "Settings",
  };
  const ro = 'data-ro="1"';
  const kbd = (k) => `<kbd>${k}</kbd>`;

  function mount(root, opts = {}) {
    const S = {
      view: "today",
      lead: 0,
      open: { 1: true },
      thread: 0,
      ch: "linkedin",
      camp: null,
      range: 3,
      stab: "messages",
      gauge: false,
      add: null,
      ans: null,
      going: EVENTS.map((e) => e.going),
      tone: 0,
    };
    root.innerHTML = `
      <div class="rx">
        <aside class="rx-side">
          <div class="rx-brand"><span class="rx-logo">${I.campaigns}</span><span><b>Sillage Reach</b><small>Sillage — demo workspace</small></span></div>
          <div class="rx-lbl">Outreach</div>
          <nav class="rx-nav">${NAV.map(([id, n, b]) => `<button data-nav="${id}">${I[id]}<span>${n}</span>${b ? `<i>${b}</i>` : ""}</button>`).join("")}</nav>
          <div class="rx-gauge"></div>
          <div class="rx-user"><span class="rx-av">CD</span><span><b>Claire Dubois</b><small>claire@sillage.demo</small><u ${ro}>Sign out</u></span></div>
        </aside>
        <section class="rx-main">
          <header class="rx-top"><span class="rx-col">»</span><b class="rx-title"></b><span class="rx-sub"></span><span class="rx-topr"></span><button class="rx-about" data-act="about"><i></i>View-only replica · About this build</button></header>
          <div class="rx-view"></div>
        </section>
        <aside class="rx-drawer" hidden><button class="rx-x" data-act="about" aria-label="Close">×</button><div class="cs">${opts.about || ""}</div></aside>
        <div class="rx-tip" role="status">View only — this is a demo</div>
      </div>`;
    const $ = (s) => root.querySelector(s),
      $$ = (s) => [...root.querySelectorAll(s)];
    const view = $(".rx-view");

    /* ── views ── */
    const V = {
      today() {
        const L = LEADS[S.lead];
        const step = (k, icon, t, sub, words, body) => `
          <div class="rx-step ${S.open[k] ? "is-open" : ""}">
            <button class="rx-step__h" data-act="step" data-k="${k}"><span class="rx-num">${k + 1}</span>${icon}<span class="rx-step__t"><b>${t}</b><small>${sub}</small></span><em>${words}</em><span class="rx-chev">${I.chev}</span></button>
            ${S.open[k] ? `<div class="rx-step__b">${body}</div>` : ""}
          </div>`;
        const mail = (subject, lines) =>
          `${subject ? `<label class="rx-flbl">Subject</label><div class="rx-input" ${ro}>${subject}</div>` : ""}<div class="rx-mail" ${ro}>${lines.map((l) => `<p>${l}</p>`).join("")}<p class="rx-sign">${sign.join("<br>")}</p></div><a class="rx-link" ${ro}>Show the LinkedIn version</a>`;
        return `
          <div class="rx-today">
            <div class="rx-tl">
              <a class="rx-link rx-pos" data-nav="inbox">1 positive reply waiting</a>
              <div class="rx-seq"><span class="rx-seq__ic">${I.campaigns}</span><b>Sequence</b><span class="rx-rule"></span><small>${CAMPS[0].n}</small></div>
              <div class="rx-via"><b>Send via</b><span class="rx-select" ${ro}>Automatic: LinkedIn if they accept, email if not ${I.chev}</span></div>
              ${step(0, I.li, "LinkedIn invitation", "On approval", "no note", `<label class="rx-check" ${ro}><span></span>Add a personal note<em>0 of 5 used this month</em></label>`)}
              ${step(1, I.mail, "Follow-up 1: LinkedIn message if they accepted, email if not", "Day 2", L.w1, mail(L.subject, L.f1))}
              ${step(2, I.mail, "Follow-up 2: LinkedIn message if they accepted, email if not", "Day 5", L.w2, mail("Re: " + L.subject, L.f2))}
            </div>
            <div class="rx-tr">
              <div class="rx-card rx-person"><span class="rx-av rx-av--sq">${L.i}</span><div><b>${L.n}</b><span>${L.role} at ${L.co}</span><small>${L.meta.join("   ")}</small><a class="rx-link" ${ro}>${I.li} LinkedIn profile</a><small>${L.email}</small></div></div>
              <div class="rx-card"><h6>Why now</h6><p class="rx-why">${I.bolt}<b>${L.why}</b></p><small class="rx-ind">${L.when}</small><p class="rx-quote">${L.detail}</p></div>
              <div class="rx-card"><h6>Why this company</h6><p class="rx-co"><span class="rx-av rx-av--co">${L.ci}</span><b>${L.co}</b></p><ul>${L.facts.map((f) => `<li>${f}</li>`).join("")}</ul></div>
              <div class="rx-card"><h6>Sender</h6><span class="rx-select rx-select--w" ${ro}>Claire Dubois <i class="rx-dot"></i><i class="rx-dot"></i>${I.chev}</span><small class="rx-seats"><i class="rx-dot"></i> mailbox <i class="rx-dot"></i> LinkedIn seat</small></div>
            </div>
          </div>
          <footer class="rx-bar">
            <button class="rx-pg" data-act="prev" aria-label="Previous lead">‹</button><span>${S.lead + 1} of ${LEADS.length}</span><button class="rx-pg" data-act="next" aria-label="Next lead">›</button>
            <span class="rx-sp"></span>
            <button class="rx-btn" ${ro}>↻ Regenerate ${kbd("R")}</button><button class="rx-btn" ${ro}>✕ Reject ${kbd("S")}</button><button class="rx-btn rx-btn--p" ${ro}>${I.campaigns} Approve 3 messages ${kbd("⌘↵")}</button>
          </footer>`;
      },
      dialer() {
        return `
          <div class="rx-dial">
            <div class="rx-card rx-call">
              <div class="rx-call__h"><div><b>Marie Dupont</b><span>VP Revenue Operations · Brightwave</span></div><small><i class="rx-dot"></i> 17:22 in Paris</small></div>
              <button class="rx-btn rx-btn--call" ${ro}>${I.dialer} Call +33 6 00 00 00 00 ${kbd("C")}</button>
              <h6>Say first</h6><p class="rx-say">“Hi Marie, this is Claire from Sillage. I saw your team is growing fast on the sales side, do you have two minutes?”</p>
              <h6>If they say</h6><div class="rx-chips">${Object.keys(OBJ)
                .map(
                  (o) =>
                    `<button class="rx-chip ${S.ans === o ? "on" : ""}" data-act="ans" data-k="${o}">${o}</button>`,
                )
                .join("")}</div>
              ${S.ans ? `<p class="rx-ans">${OBJ[S.ans]}</p>` : ""}
              <a class="rx-link rx-log" ${ro}>Already called? Log the result ${kbd("L")}</a>
            </div>
            <div class="rx-card"><h6>Why now</h6><p class="rx-why">${I.bolt}<b>Visited the pricing page twice this week</b></p><small class="rx-ind">spotted 2d ago</small><a class="rx-link" ${ro}>› More about Marie and Brightwave</a></div>
          </div>`;
      },
      inbox() {
        const list = THREADS.filter((t) => t.ch === S.ch);
        const T = list[Math.min(S.thread, list.length - 1)];
        return `
          <div class="rx-inbox">
            <div class="rx-ix-l">
              <p class="rx-pos">${list.length} people are waiting for your answer</p>
              <div class="rx-tabs"><span class="on">To answer <i>${list.length}</i></span><span>Follow up <i>0</i></span><span>Replied <i>4</i></span><span>Sent <i>5</i></span></div>
              <div class="rx-card rx-list"><div class="rx-search">${I.search} Search</div>
                ${list.map((t, k) => `<button class="rx-th ${t === T ? "on" : ""}" data-act="thread" data-k="${k}"><span class="rx-av">${t.i}</span><span class="rx-th__t"><b>${t.n} <small>· ${t.co}</small></b><span>${t.last}</span><em>Question</em></span><time>${t.t}</time></button>`).join("")}
              </div>
            </div>
            <div class="rx-card rx-conv">
              <div class="rx-conv__h"><span class="rx-av">${T.i}</span><div><b>${T.n}</b><small>${T.role} · ${T.co}</small></div></div>
              <div class="rx-conv__a"><span class="rx-select" ${ro}>Question ${I.chev}</span><button class="rx-btn" ${ro}>${I.events} Meeting booked</button><a class="rx-link rx-red" ${ro}>⊘ Do not contact again</a><a class="rx-link" ${ro}>Export data</a></div>
              <div class="rx-msgs">${T.msgs.map(([who, tx, day]) => `${day ? `<time>${day}</time>` : ""}<p class="rx-msg rx-msg--${who}">${tx}</p>`).join("")}</div>
              <div class="rx-compose"><div class="rx-input" ${ro}>Write a message…</div><button class="rx-btn rx-btn--p" ${ro}>Send</button></div>
            </div>
          </div>`;
      },
      campaigns() {
        if (S.camp === null)
          return `
          <div class="rx-pad">
            <div class="rx-row"><p class="rx-pos">${CAMPS.length} campaigns · 2 active</p><span class="rx-sp"></span><button class="rx-btn rx-btn--p" ${ro}>+ New campaign</button></div>
            <div class="rx-card rx-table">
              <div class="rx-tr0"><span>Campaign</span><span>Enrolled</span><span>In review</span><span>Replies</span><span>Status</span></div>
              ${CAMPS.map((c, k) => `<button class="rx-trow" data-act="camp" data-k="${k}"><b>${c.n}</b><span>${c.enrolled}</span><span>${c.review}</span><span>${c.rep}</span><span><em class="rx-st rx-st--${c.st.toLowerCase()}">${c.st}</em></span></button>`).join("")}
            </div>
          </div>`;
        const c = CAMPS[S.camp];
        return `
          <div class="rx-pad">
            <div class="rx-row"><a class="rx-link" data-act="camp" data-k="-1">← Campaigns</a><b class="rx-cname">${c.n}</b><em class="rx-st rx-st--${c.st.toLowerCase()}">${c.st}</em><span class="rx-sp"></span><span class="rx-select" ${ro}>No owner ${I.chev}</span><button class="rx-btn" ${ro}>❚❚ Pause</button><button class="rx-btn" ${ro}>Delete campaign</button></div>
            <div class="rx-tiles">${[
              ["Enrolled", c.enrolled],
              ["In review", c.review, 1],
              [
                "Sequences approved",
                c.approved,
                0,
                c.rep + " · see performance",
              ],
              ["Failed sends", 0],
            ]
              .map(
                ([l, v, hi, sub]) =>
                  `<div class="rx-tile ${hi ? "hi" : ""}"><small>${l}</small><b>${v}</b>${sub ? `<a class="rx-link" data-nav="performance">${sub}</a>` : ""}</div>`,
              )
              .join("")}</div>
            <div class="rx-card"><b class="rx-h">Brief</b><h6>Signals</h6><p>${c.sig}</p><h6>Objective</h6><p>${c.obj}</p></div>
            <b class="rx-h">Where people are</b>
            <div class="rx-chips">${c.where.map(([l, v]) => `<span class="rx-chip">${l} <b>${v}</b></span>`).join("")}</div>
          </div>`;
      },
      performance() {
        const k = [0.06, 0.25, 0.5, 1, 2.4][S.range],
          n = (v) => Math.round(v * k);
        const row = (dot, name, cells) =>
          `<div class="rx-card rx-fun"><b class="rx-h"><i class="rx-dot" style="background:${dot}"></i>${name}</b><div class="rx-funrow">${cells.map(([v, l], j) => `${j ? "<span>→</span>" : ""}<div class="rx-tile ${j === cells.length - 1 ? "hi" : ""}"><b>${v}</b><small>${l}</small></div>`).join("")}</div></div>`;
        return `
          <div class="rx-pad">
            <div class="rx-row"><div class="rx-seg">${["Today", "7 days", "14 days", "30 days", "All time"].map((r, j) => `<button class="${j === S.range ? "on" : ""}" data-act="range" data-k="${j}">${r}</button>`).join("")}</div><span class="rx-sp"></span><span class="rx-select" ${ro}>All campaigns ${I.chev}</span><span class="rx-select" ${ro}>Everyone ${I.chev}</span></div>
            ${row("#3da5bb", "Email", [
              [n(48), "emails sent"],
              [n(12), "people replied"],
              [n(7), "were interested"],
              [n(4), "meetings"],
            ])}
            ${row("#7c6ff0", "LinkedIn", [
              [n(48), "invitations sent"],
              [`${n(21)} <i>of ${n(48)}</i>`, "accepted"],
              [n(19), "messages sent"],
              [n(9), "people replied"],
              [n(5), "meetings"],
            ])}
            ${row("#e9a23b", "Calls", [
              [n(34), "calls made"],
              [`${n(11)} <i>of ${n(34)}</i>`, "picked up"],
              [n(3), "meetings"],
            ])}
            <b class="rx-h">The team</b>
            <div class="rx-tiles">${[
              ["Claire Dubois", 7, 14],
              ["Hugo Martin", 5, 7],
            ]
              .map(
                ([p, m, r]) =>
                  `<div class="rx-tile"><small>${p}</small><b>${n(m)}</b><small>meetings · ${n(r)} people replied</small></div>`,
              )
              .join("")}</div>
          </div>`;
      },
      events() {
        const card = (e, k) => `
          <div class="rx-card rx-ev">
            <div class="rx-ev__h"><div class="rx-date"><small>${e.m}</small><b>${e.d}</b><small>${e.w}</small></div><div><b>${e.n}</b><span><i class="rx-tag">${e.city}</i><i class="rx-tag rx-tag--${e.tag.toLowerCase()}">${e.tag}</i></span></div></div>
            <p>${e.desc}</p>
            <div class="rx-ev__f"><span class="rx-who">${e.who.map((w) => `<i>${w}</i>`).join("")}</span><div class="rx-seg rx-seg--sm"><button class="${S.going[k] ? "on" : ""}" data-act="going" data-k="${k}" data-v="1">Going</button><button class="${S.going[k] ? "" : "on"}" data-act="going" data-k="${k}" data-v="0">Not going</button></div></div>
            ${
              S.going[k]
                ? `<div class="rx-ppl">${e.ppl.map(([p, st, ok]) => `<div><span>${p}</span><span class="${ok ? "rx-link" : "rx-mute"}">${st}</span></div>`).join("")}
              ${S.add === k ? `<div class="rx-addf"><div class="rx-input" ${ro}>https://www.linkedin.com/in/new-person</div><div class="rx-input rx-ph" ${ro}>Email (optional)</div><div class="rx-row"><span class="rx-select rx-select--w" ${ro}>Job Change ${I.chev}</span><button class="rx-btn rx-btn--p" ${ro}>Add</button></div></div>` : `<button class="rx-link rx-addb" data-act="add" data-k="${k}">+ Add someone you met</button>`}</div>`
                : ""
            }
          </div>`;
        const wk = (name) =>
          `<b class="rx-h">${name}</b><div class="rx-evgrid">${EVENTS.map((e, k) => (e.wk === name ? card(e, k) : "")).join("")}</div>`;
        return `<div class="rx-pad"><div class="rx-row"><div class="rx-seg"><button class="on">All</button><button>🇫🇷</button><button>🇬🇧</button><button>🇺🇸</button></div><span class="rx-select" ${ro}>All cities ${I.chev}</span><span class="rx-sp"></span><div class="rx-input rx-ph rx-evadd" ${ro}>Add an event by its link</div><button class="rx-btn" ${ro}>+ Add</button></div>${wk("This week")}${wk("Next week")}</div>`;
      },
      settings() {
        const tabs = [
          ["account", "My account"],
          ["team", "Team"],
          ["messages", "Messages"],
          ["sending", "Sending"],
        ];
        const body = {
          account: `<div class="rx-card"><b class="rx-h">Connected accounts</b><div class="rx-line"><span>${I.li} LinkedIn seat</span><em class="rx-st rx-st--active">Connected</em></div><div class="rx-line"><span>${I.mail} Mailbox · claire@sillage.demo</span><em class="rx-st rx-st--active">Connected</em></div><div class="rx-line"><span>CRM sync · contacts, companies, messages, calls, deals</span><em class="rx-st rx-st--active">On</em></div></div>`,
          team: `<div class="rx-card"><b class="rx-h">Team</b>${[
            ["Claire Dubois", "Admin"],
            ["Hugo Martin", "Member"],
            ["Léa Petit", "Member"],
          ]
            .map(
              ([p, r]) =>
                `<div class="rx-line"><span><i class="rx-av">${p
                  .split(" ")
                  .map((x) => x[0])
                  .join(
                    "",
                  )}</i> ${p}</span><span class="rx-mute">${r}</span></div>`,
            )
            .join(
              "",
            )}<button class="rx-btn" ${ro}>+ Invite someone</button></div>`,
          messages: `<div class="rx-card"><b class="rx-h">Your tone of voice</b><p class="rx-mute">Pick how you write. Your messages are drafted in that voice.</p><div class="rx-tones">${[
            ["Friendly & direct", "Warm and plain, on a first-name basis."],
            ["Formal", "Polished and respectful, full sentences."],
            ["Short & punchy", "Few words, one idea at a time."],
          ]
            .map(
              ([t, d], j) =>
                `<button class="${S.tone === j ? "on" : ""}" data-act="tone" data-k="${j}"><b>${t}</b><span>${d}</span></button>`,
            )
            .join(
              "",
            )}</div><div class="rx-mail rx-ex"><p>${["Hey Marie, congrats on the new role at Northwind. We show sales teams which accounts to call this week. Worth a quick look?", "Dear Marie, congratulations on your new role at Northwind. We help sales teams identify which accounts to contact each week. Would you be open to a short conversation?", "Marie, congrats on Northwind. We tell sales teams who to call this week. Quick look?"][S.tone]}</p></div><button class="rx-btn rx-btn--p" ${ro}>Save</button></div>
                     <div class="rx-card"><b class="rx-h">Company sheet</b><p class="rx-mute">What every draft knows about your company: who you sell to, what you never say, proof you can quote.</p><div class="rx-mail" ${ro}><p>We sell to B2B sales teams of 50 to 2,000 people. We never invent a fact about the prospect. One idea per message.</p></div></div>`,
          sending: `<div class="rx-card"><b class="rx-h">Sending rules</b><div class="rx-line"><span>Send hours follow the prospect's time zone</span><em class="rx-st rx-st--active">On</em></div><div class="rx-line"><span>Nothing is sent on a public holiday in the prospect's country</span><em class="rx-st rx-st--active">On</em></div><div class="rx-line"><span>Customers and open opportunities are never contacted</span><em class="rx-st rx-st--active">Always</em></div><div class="rx-line"><span>Unsubscribe line in every email</span><em class="rx-st rx-st--active">Always</em></div><div class="rx-line"><span>Daily cap per mailbox</span><span class="rx-mute">Follows the mailbox level</span></div></div>`,
        };
        return `<div class="rx-pad rx-pad--n"><div class="rx-seg">${tabs.map(([id, n]) => `<button class="${S.stab === id ? "on" : ""}" data-act="stab" data-k="${id}">${n}</button>`).join("")}</div>${body[S.stab]}</div>`;
      },
    };

    const gauge = () => {
      $(".rx-gauge").innerHTML = `
        <button class="rx-g__h" data-act="gauge" aria-expanded="${S.gauge}">${I.mail}<span>Level 2 · 15 of 15 today</span><span class="rx-chev ${S.gauge ? "up" : ""}">${I.chev}</span></button>
        ${S.gauge ? `<div class="rx-g__b"><div class="rx-g__c"><p>${I.mail}<b>Mailbox · Level 2 of 4</b></p><small>a daily cap that grows with the level</small><p>◎ <b>Quest: send 54 by Mon 23</b></p><div class="rx-g__bar"><i></i></div><small class="rx-g__n">38 of 54</small><small>Reward: Level 3, a higher daily cap</small><div class="rx-g__d"><span>Today</span><span class="hot">15 of 15</span><span>Tomorrow</span><span>3 of 15</span><span>Tue 24</span><span>0 of 15 · approve 15</span></div></div><div class="rx-g__c"><p><i class="rx-dot"></i><b>Sending is on</b></p><small>Nothing approved is waiting.</small></div></div>` : ""}`;
      if (S.gauge && !RM && window.gsap) {
        gsap.from($(".rx-g__b"), {
          height: 0,
          opacity: 0,
          duration: 0.35,
          ease: "power2.out",
        });
        gsap.fromTo(
          $(".rx-g__bar i"),
          { width: 0 },
          { width: "70%", duration: 0.9, delay: 0.2, ease: "power3.out" },
        );
      }
    };
    const render = (anim = true) => {
      $$(".rx-nav button").forEach((b) =>
        b.classList.toggle("on", b.dataset.nav === S.view),
      );
      $(".rx-title").textContent = TITLES[S.view];
      $(".rx-sub").textContent =
        S.view === "dialer"
          ? "Main campaign · 1 of 8"
          : S.view === "performance"
            ? "Sequences approved in the period"
            : "";
      $(".rx-topr").innerHTML =
        S.view === "inbox"
          ? `<div class="rx-seg rx-seg--sm">${["linkedin", "email"].map((c) => `<button class="${S.ch === c ? "on" : ""}" data-act="ch" data-k="${c}">${c === "linkedin" ? "LinkedIn" : "Email"} ${THREADS.filter((t) => t.ch === c).length}</button>`).join("")}</div>`
          : S.view === "today"
            ? `<span class="rx-select" ${ro}>All campaigns ${I.chev}</span>`
            : "";
      view.innerHTML = V[S.view]();
      view.scrollTop = 0;
      if (anim && !RM && window.gsap)
        gsap.fromTo(
          view.children,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.04,
            ease: "power2.out",
            clearProps: "transform",
          },
        );
    };
    const tipEl = $(".rx-tip");
    let tipT;
    const tip = (e) => {
      const r = root.getBoundingClientRect();
      tipEl.style.left =
        Math.min(r.width - 120, Math.max(110, e.clientX - r.left)) + "px";
      tipEl.style.top = Math.max(40, e.clientY - r.top - 14) + "px";
      tipEl.classList.add("on");
      clearTimeout(tipT);
      tipT = setTimeout(() => tipEl.classList.remove("on"), 1500);
    };
    const go = (v) => {
      S.view = v;
      if (v === "campaigns") S.camp = null;
      render();
    };
    const drawer = (on) => {
      const d = $(".rx-drawer");
      on = on ?? d.hidden;
      if (on) {
        d.hidden = false;
        if (!RM && window.gsap)
          gsap.fromTo(
            d,
            { xPercent: 100 },
            { xPercent: 0, duration: 0.45, ease: "expo.out" },
          );
      } else if (!RM && window.gsap)
        gsap.to(d, {
          xPercent: 100,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => (d.hidden = true),
        });
      else d.hidden = true;
    };
    const lead = (d) => {
      S.lead = (S.lead + d + LEADS.length) % LEADS.length;
      S.open = { 1: true };
      render(false);
      if (!RM && window.gsap)
        gsap.fromTo(
          $$(".rx-tl, .rx-tr"),
          { opacity: 0, x: 24 * d },
          {
            opacity: 1,
            x: 0,
            duration: 0.35,
            ease: "power3.out",
            clearProps: "transform",
          },
        );
    };

    root.addEventListener("click", (e) => {
      const t = e.target.closest("[data-nav],[data-act],[data-ro]");
      if (!t) return;
      if (t.dataset.nav) return go(t.dataset.nav);
      if (t.dataset.ro) return tip(e);
      const k = t.dataset.k;
      switch (t.dataset.act) {
        case "about":
          return drawer();
        case "gauge":
          S.gauge = !S.gauge;
          return gauge();
        case "next":
          return lead(1);
        case "prev":
          return lead(-1);
        case "step":
          S.open[k] = !S.open[k];
          return render(false);
        case "thread":
          S.thread = +k;
          return render(false);
        case "ch":
          S.ch = k;
          S.thread = 0;
          return render(false);
        case "camp":
          S.camp = +k < 0 ? null : +k;
          return render();
        case "range":
          S.range = +k;
          return render(false);
        case "stab":
          S.stab = k;
          return render(false);
        case "tone":
          S.tone = +k;
          return render(false);
        case "ans":
          S.ans = S.ans === k ? null : k;
          return render(false);
        case "going":
          S.going[k] = t.dataset.v === "1";
          S.add = null;
          return render(false);
        case "add":
          S.add = +k;
          return render(false);
      }
    });
    gauge();
    render(false);
    return {
      go,
      next: () => lead(1),
      prev: () => lead(-1),
      gauge: (on) => {
        S.gauge = on;
        gauge();
      },
      thread: (i) => {
        S.thread = i;
        render(false);
      },
      add: (k) => {
        S.add = k;
        render(false);
      },
      drawer,
    };
  }

  window.ReachApp = { mount };
})();
