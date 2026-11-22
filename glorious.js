/* ═══════════════════════════════════════════════════════════
   Glorious Pipeline — a small code editor you can click:
   the workspace files on the left, a file in the middle,
   Claude Code on the right with prompts that play a scenario.
   The visitor first reads what this is, then sets up a company,
   and only then the other prompts unlock.
   Every file and every answer here is written for the demo.
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bot = (w) =>
    `<svg width="${w}" viewBox="-1 -3 16 13" shape-rendering="crispEdges" aria-hidden="true"><g fill="#d97757"><rect x="2" y="0" width="10" height="7"/><rect x="0" y="3" width="14" height="2"/><rect x="2" y="7" width="1" height="2"/><rect x="4" y="7" width="1" height="2"/><rect x="9" y="7" width="1" height="2"/><rect x="11" y="7" width="1" height="2"/></g><rect x="4" y="2" width="1" height="2" fill="#1a0f0b"/><rect x="9" y="2" width="1" height="2" fill="#1a0f0b"/></svg>`;
  const agent = (name, description, tools, body, soul) => [
    "---",
    `name: ${name}`,
    `description: ${description}`,
    `tools: ${tools}`,
    "---",
    ...body,
    "",
    `soul: ${soul}`,
  ];

  const A = ".claude/agents/",
    S = ".claude/skills/",
    HK = ".claude/hooks/";
  const RULES = ".claude/approval-rules.json",
    LOG = "gtm-runs/approvals.log";
  const FILES = {
    "CLAUDE.md": [
      "# House rules",
      "Every agent reads this first.",
      "",
      "- Explain in plain words, short sentences.",
      "- What may go out on its own is written in",
      "  .claude/approval-rules.json. Anything else: ask.",
      "- Read contexte/ before writing to anyone.",
      "- A human correction goes in the red bin,",
      "  and becomes a rule in this file.",
    ],
    [A + "agent-creator.md"]: agent(
      "agent-creator",
      "Builds a new agent from a short interview.",
      "Read, Write, Skill",
      [
        "Ask what the agent does, what it must never do,",
        "and in which voice. Then write its file and give",
        "it a soul with the create-soul skill.",
      ],
      "The Architect. Patient, asks before it builds.",
    ),
    [A + "security-reviewer.md"]: agent(
      "security-reviewer",
      "Reads a change for security only.",
      "Read, Grep",
      [
        "Report what could leak, break access or expose",
        "data. Never edits anything.",
      ],
      "The Lockpick. Suspicious by trade, polite about it.",
    ),
    [A + "architecture-reviewer.md"]: agent(
      "architecture-reviewer",
      "Reads a change for structure only.",
      "Read, Grep",
      [
        "Look for duplication, tangled modules and broken",
        "conventions. Never edits anything.",
      ],
      "The Surveyor. Likes straight lines.",
    ),
    [A + "specification-reviewer.md"]: agent(
      "specification-reviewer",
      "Checks the change does what was asked.",
      "Read, Grep",
      ["No less than the ticket, and no more.", "Never edits anything."],
      "The Notary. Reads the ticket twice.",
    ),
    [A + "feature-implementer.md"]: agent(
      "feature-implementer",
      "Builds one step of the plan, in its own worktree.",
      "Read, Write, Edit, Bash",
      ["One step, one commit. Never pushes."],
      "The Mason. One brick at a time.",
    ),
    [A + "icp-scorer.md"]: agent(
      "icp-scorer",
      "Scores accounts on the grid.",
      "Read, Skill, mcp: cargo, hubspot",
      [
        "Gather facts, each with a proof. Never invent one.",
        "Run a pilot first. Show it. Wait for a yes.",
      ],
      "The Assayer. Weighs everything, trusts nothing unproven.",
    ),
    [A + "copywriter.md"]: agent(
      "copywriter",
      "Writes outreach in each rep's own voice.",
      "Read, Write",
      [
        "Read contexte/ first. One idea per message.",
        "Send only what a yes-rule allows. Else, ask.",
      ],
      "The Ghostwriter. Disappears behind the rep.",
    ),
    [A + "boussole.md"]: agent(
      "boussole",
      "Guide. Sets a new company up, step by step.",
      "Read, Write, Skill",
      [
        "One question at a time. Ask, then write the file.",
        "Works in English and in French.",
      ],
      "Boussole. Calm, never in a hurry, knows where north is.",
    ),
    [S + "create-soul/SKILL.md"]: [
      "# create-soul",
      "Give an agent a personality that lasts.",
      "",
      "1. Ask for its voice, its values, what it refuses.",
      "2. Propose three souls. The human picks one.",
      "3. Write it as the last line of the agent file.",
    ],
    [S + "code-reviewer/SKILL.md"]: [
      "# code-reviewer",
      "Three reviewers, at the same time, on one change.",
      "",
      "- security-reviewer",
      "- architecture-reviewer",
      "- specification-reviewer",
      "",
      "Merge their findings into one message.",
      "Give one grade: 🟢 🟡 🟠 🔴",
      "It says how much human attention is still needed.",
    ],
    [S + "scoring-grid/SKILL.md"]: [
      "# scoring-grid",
      "Knock-out gates first. Then a weighted score.",
      "",
      "- The AI gathers facts, each with a proof.",
      "- A fixed script computes the score.",
      "- Tiers: Gold, Silver, Bronze, Excluded.",
      "",
      "Always pilot on a few accounts before a full run.",
    ],
    [S + "enrichment-cascade/SKILL.md"]: [
      "# enrichment-cascade",
      "Check the person first. Spend second.",
      "",
      "1. Still at the company? Right role?",
      "2. Cheap provider.",
      "3. Expensive provider, only if nothing was found.",
      "",
      "Keep the source of every value.",
    ],
    [HK + "gtm-send-guard.sh"]: [
      "#!/bin/bash",
      "# Runs before anything is sent to a person.",
      "",
      'if rule_says_yes "$ACTION" .claude/approval-rules.json; then',
      '  log "$ACTION" >> gtm-runs/approvals.log',
      "  exit 0   # goes out, and shows in the daily recap",
      "fi",
      'echo "Ask: a human must say yes first." >&2',
      "exit 2",
    ],
    [HK + "crm-bulk-write-guard.sh"]: [
      "#!/bin/bash",
      "# Runs before a bulk write to the CRM.",
      "",
      "backup_crm > gtm-runs/backup.csv   # always",
      'if pilot_was_approved "$RUN"; then',
      '  log "$RUN" >> gtm-runs/approvals.log',
      "  exit 0   # the pilot got a yes: the full run may go",
      "fi",
      'echo "Ask: show a pilot first." >&2',
      "exit 2",
    ],
    [HK + "team-email-guard.sh"]: [
      "#!/bin/bash",
      "# No teammate's email goes to an outside service.",
      "",
      'if leaks_team_email "$PAYLOAD"; then',
      '  echo "Ask: a teammate\'s email was leaving." >&2',
      "  exit 2",
      "fi",
    ],
    ".mcp.json": ["{", '  "mcpServers": {}', "}"],
  };
  const KEEPER = agent(
    "crm-keeper",
    "Finds and merges duplicate records in the CRM.",
    "Read, mcp: hubspot",
    [
      "Backup first. Trial run next.",
      "Merge only sure matches, in small waves.",
    ],
    "The Archivist. Careful, a bit dry, hates duplicates.",
  );
  /* what the setup writes, one file per answer */
  const SETUP = [
    {
      who: "What is your company called?",
      a: "Northwind",
      path: "contexte/company.md",
      lines: [
        "# Northwind",
        "",
        "The name every agent uses when it writes for us.",
      ],
      now: "Boussole, the guide agent, asks about your company. Click the suggested answer.",
    },
    {
      who: "What do you sell?",
      a: "Software that tells sales teams who to call",
      path: "contexte/company.md",
      lines: [
        "# Northwind",
        "",
        "We sell software that tells sales teams",
        "who to call, and why now.",
        "",
        "Never promise what the product does not do.",
      ],
      now: "Each answer is written into a file. That file is the company's memory.",
    },
    {
      who: "Who do you sell to?",
      a: "B2B companies with a sales team",
      path: "contexte/icp.md",
      lines: [
        "# Who we sell to",
        "B2B companies with a sales team that prospects.",
        "",
        "## Not for us",
        "- companies that sell to consumers",
        "- companies that are already customers",
      ],
      now: "Now the target: who the agents should go after, and who to leave alone.",
    },
    {
      who: "Who do the agents write to?",
      a: "The person who runs the sales tools",
      path: "contexte/personas.md",
      lines: [
        "# Personas",
        "",
        "1. The operator: runs the sales tools, feels the pain.",
        "2. The leader: owns the number, signs.",
        "",
        "Write to the operator first.",
      ],
      now: "Then the people: who gets the messages.",
    },
    {
      who: "Which tools do you already use?",
      a: "HubSpot and Slack",
      path: ".mcp.json",
      lines: [
        "{",
        '  "mcpServers": {',
        '    "hubspot": { "type": "http" },',
        '    "slack":   { "type": "http" }',
        "  }",
        "}",
      ],
      now: "The tools are plugged in, so the agents can read and write where you already work.",
    },
    {
      who: "Last one. What may go out without asking you?",
      a: "Emails from a sequence I validated",
      path: RULES,
      lines: [
        "{",
        '  "auto_send": true,',
        '  "rules": [',
        "    {",
        '      "say_yes_to": "emails from a sequence I validated",',
        '      "written_by": "you"',
        "    }",
        "  ],",
        '  "everything_else": "ask"',
        "}",
      ],
      now: "The yes-rule: you write it once. What matches goes out alone. Everything else asks you.",
    },
  ];
  const PROMPTS = [
    ["setup", "Set up my company"],
    ["send", "Send this email to the prospect"],
    ["review", "Review my PR"],
    ["agent", "Create an agent that cleans CRM duplicates"],
    ["score", "Score 200 accounts"],
  ];

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  /** Tiny syntax colouring: enough to read like an editor. */
  function paint(line, path, i, lines) {
    const t = esc(line);
    if (path.endsWith(".sh"))
      return /^\s*#/.test(line)
        ? `<i class="c-c">${t}</i>`
        : t
            .replace(/("[^"]*")/g, '<i class="c-s">$1</i>')
            .replace(/(#[^"]*)$/, '<i class="c-c">$1</i>')
            .replace(/\b(if|then|fi|exit|echo)\b/g, '<i class="c-k">$1</i>');
    if (path.endsWith(".json"))
      return t
        .replace(/("[^"]*")(\s*:)/g, '<i class="c-k">$1</i>$2')
        .replace(/: ("[^"]*")/g, ': <i class="c-s">$1</i>')
        .replace(/: (true|false)/g, ': <i class="c-h">$1</i>');
    if (path.endsWith(".log"))
      return t
        .replace(/^(\S+)/, '<i class="c-c">$1</i>')
        .replace(/(sent|written)/, '<i class="c-ok">$1</i>');
    if (line === "---") return `<i class="c-c">---</i>`;
    const fm = lines.indexOf("---") === 0 && i < lines.indexOf("---", 1);
    if (fm) return t.replace(/^([a-z]+)(:)/, '<i class="c-k">$1</i>$2');
    if (/^#/.test(line)) return `<i class="c-h">${t}</i>`;
    if (/^soul:/.test(line)) return `<i class="c-soul">${t}</i>`;
    return t;
  }
  const mem = (k, v) => {
    try {
      if (v === undefined) return localStorage.getItem(k);
      localStorage.setItem(k, v);
    } catch (e) {
      /* private mode: nothing is remembered, the demo simply starts over */
    }
    return null;
  };

  /** Cancelable, pausable sequence of waits and tweens. */
  class Seq {
    constructor() {
      this.items = new Set();
      this.dead = false;
      this.paused = false;
    }
    wait(s) {
      return new Promise((res) => {
        if (this.dead) return;
        const c = gsap.delayedCall(RM ? Math.min(s, 0.12) : s, () => {
          this.items.delete(c);
          if (!this.dead) res();
        });
        if (this.paused) c.pause();
        this.items.add(c);
      });
    }
    tween(target, vars) {
      const t = gsap.to(target, RM ? { ...vars, duration: 0.01 } : vars);
      if (this.paused) t.pause();
      this.items.add(t);
      return t;
    }
    pause() {
      this.paused = true;
      this.items.forEach((x) => x.pause());
    }
    resume() {
      this.paused = false;
      this.items.forEach((x) => x.resume());
    }
    kill() {
      this.dead = true;
      this.items.forEach((x) => x.kill());
      this.items.clear();
    }
  }

  function mount(root, opts = {}) {
    const files = { ...FILES };
    const url = opts.url || "#";
    root.innerHTML = `
      <div class="gp is-locked">
        <header class="gp__top">
          <img src="assets/glorious/loki.webp" width="34" height="34" alt="">
          <p><b>Glorious Pipeline</b> — an agentic Claude Code machine any GTM team can install.</p>
          <a class="gp__cta" href="${url}" target="_blank" rel="noopener">Want the kit? Ask me on LinkedIn ↗</a>
        </header>
        <div class="gp__ide">
          <details class="gp__files" open><summary>Explorer <span>your-gtm-workspace</span></summary><div class="gp__tree"></div></details>
          <section class="gp__editor" aria-label="Editor"><div class="gp__tabs"></div><pre class="gp__code" tabindex="0"></pre></section>
          <section class="gp__chat" aria-label="Claude Code">
            <header>${bot(26)}<b>Claude Code</b><span class="gp__state"></span><button class="gp__pp" disabled aria-label="Pause">❚❚</button><button class="gp__re" disabled aria-label="Replay">↻</button><button class="gp__help" aria-label="Show the explanation again">?</button></header>
            <p class="gp__now" aria-live="polite" hidden></p>
            <div class="gp__msgs" aria-live="polite"></div>
            <div class="gp__prompts"><p class="gp__seen"><span></span><em></em></p>${PROMPTS.map(([id, t]) => `<button data-run="${id}"><i class="gp-tick" aria-hidden="true"></i><span>${t}</span></button>`).join("")}</div>
          </section>
        </div>
        <footer class="gp__status"><span>⎇ main</span><span>3 guards on</span><span class="gp__plugs">0 plugs connected</span><span class="gp__sp"></span><span>Markdown</span><span>EN · FR</span></footer>
        <div class="gp-intro" role="dialog" aria-label="What this is" hidden>
          <div class="gp-intro__card">
            <span class="gp-intro__k">Before you click anything</span>
            <h3>A real GTM infrastructure, run like a mini company.</h3>
            <p>You talk to Claude. The agents do the work.</p>
            <ul>
              <li><i class="a"></i><span><b>Agents</b> are the team. Each file is one member: their job and their rules.</span></li>
              <li><i class="s"></i><span><b>Skills</b> are their know-how. Recipes any agent can follow.</span></li>
              <li><i class="g"></i><span><b>Guards</b> are the house rules. They decide what may go out, and what asks you first.</span></li>
              <li><i class="c"></i><span><b>contexte/</b> is the company's memory. Who you are, what you sell, to whom.</span></li>
            </ul>
            <div class="gp-intro__f"><button class="gp-intro__go"></button><button class="gp-intro__skip">Look around first</button></div>
          </div>
        </div>
        <div class="gp-tour" role="dialog" aria-label="Short tour" hidden><p></p><div><span></span><button data-t="skip">Skip</button><button data-t="next">Next</button></div></div>
      </div>`;
    const $ = (s) => root.querySelector(s),
      $$ = (s) => [...root.querySelectorAll(s)];
    const gp = $(".gp"),
      tree = $(".gp__tree"),
      code = $(".gp__code"),
      msgs = $(".gp__msgs"),
      pp = $(".gp__pp"),
      re = $(".gp__re");
    let seq = null,
      current = null,
      last = null,
      ready = false;
    const seen = new Set();

    /* ── explorer ── */
    function drawTree(flash) {
      const top = { dirs: {}, files: [] };
      Object.keys(files).forEach((p) => {
        const parts = p.split("/");
        let n = top;
        parts
          .slice(0, -1)
          .forEach(
            (d) => (n = n.dirs[d] = n.dirs[d] || { dirs: {}, files: [] }),
          );
        n.files.push(p);
      });
      const walk = (n, d) =>
        Object.entries(n.dirs)
          .map(
            ([name, sub]) =>
              `<div class="gp-dir" style="--d:${d}"><i>▾</i>${name}</div>` +
              walk(sub, d + 1),
          )
          .join("") +
        n.files
          .map((p) => {
            const name = p.split("/").pop();
            return `<button class="gp-file ${p === current ? "on" : ""}" data-path="${p}" style="--d:${d}"><i class="gp-ic gp-ic--${name.split(".").pop()}"></i>${name}</button>`;
          })
          .join("");
      tree.innerHTML = walk(top, 0);
      if (flash) {
        const b = tree.querySelector(`[data-path="${flash}"]`);
        if (b) {
          tree.parentNode.scrollTop = Math.max(0, b.offsetTop - 80);
          if (!RM)
            gsap.fromTo(
              b,
              { backgroundColor: "rgba(233,185,73,.55)" },
              {
                backgroundColor: "rgba(233,185,73,0)",
                duration: 1.6,
                clearProps: "backgroundColor",
              },
            );
        }
      }
    }
    const lineHTML = (path, lines) =>
      lines
        .map(
          (l, i) =>
            `<span class="gp-l"><em>${i + 1}</em>${paint(l, path, i, lines) || " "}</span>`,
        )
        .join("");
    function openFile(path, mark) {
      if (!files[path]) return;
      current = path;
      $$(".gp-file").forEach((b) =>
        b.classList.toggle("on", b.dataset.path === path),
      );
      $(".gp__tabs").innerHTML =
        `<span class="on"><i class="gp-ic gp-ic--${path.split(".").pop()}"></i>${path.split("/").pop()}</span><small>${path}</small>`;
      code.innerHTML = lineHTML(path, files[path]);
      code.scrollTop = 0;
      const ext = path.split(".").pop();
      $(".gp__status span:nth-last-child(2)").textContent =
        ext === "sh"
          ? "Shell"
          : ext === "json"
            ? "JSON"
            : ext === "log"
              ? "Log"
              : "Markdown";
      if (mark !== undefined) {
        const l = code.children[mark];
        if (l) {
          l.classList.add("hit");
          code.scrollTop = Math.max(0, l.offsetTop - 60);
        }
      } else if (!RM)
        gsap.fromTo(code, { opacity: 0.4 }, { opacity: 1, duration: 0.25 });
    }
    /** Writes a file line by line in the editor, and shows it in the explorer. */
    async function typeFile(q, path, lines) {
      const isNew = !files[path];
      files[path] = [];
      drawTree(isNew ? path : null);
      openFile(path);
      if (!isNew) drawTree(path);
      for (let i = 1; i <= lines.length; i++) {
        files[path] = lines.slice(0, i);
        code.innerHTML =
          lineHTML(path, files[path]) + '<span class="gp-cur"></span>';
        await q.wait(0.13);
      }
      code.innerHTML = lineHTML(path, files[path]);
    }
    tree.addEventListener("click", (e) => {
      const b = e.target.closest(".gp-file");
      if (!b) return;
      openFile(b.dataset.path);
      if (tourAt === 1) tourStep(2);
    });

    /* ── chat ── */
    const add = (cls, html) => {
      const d = document.createElement("div");
      d.className = "gp-m " + cls;
      d.innerHTML = html;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      if (!RM)
        gsap.fromTo(
          d,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.25, clearProps: "opacity,transform" },
        );
      return d;
    };
    const say = (t) => add("gp-m--c", t);
    const ok = (t) => add("gp-m--ok", t);
    const now = (text) => {
      const n = $(".gp__now");
      n.hidden = !text;
      n.textContent = text || "";
      if (text && !RM)
        gsap.fromTo(n, { opacity: 0.3 }, { opacity: 1, duration: 0.3 });
    };
    async function tool(q, name, arg, dur, res) {
      const d = add(
        "gp-m--tool",
        `<span class="dot">●</span><b>${name}</b><span class="arg">(${arg})</span>`,
      );
      d.classList.add("run");
      await q.wait(dur);
      d.classList.remove("run");
      d.classList.add("done");
      if (res) add("gp-m--res", res);
    }
    /** A question from an agent, answered for the visitor after a beat. */
    async function ask(q, who, question, answer) {
      add("gp-m--q", `<small>${who} asks</small>${question}`);
      await q.wait(1.1);
      add("gp-m--u gp-m--auto", answer);
      await q.wait(0.6);
    }
    /** A question the visitor answers: one suggested answer, ready to click. */
    function choose(q, who, question, answer) {
      add("gp-m--q", `<small>${who} asks</small>${question}`);
      const row = add(
        "gp-m--pick",
        `<button>${answer}</button><span>← click to answer</span>`,
      );
      return new Promise((res) => {
        row.querySelector("button").addEventListener(
          "click",
          () => {
            if (q.dead) return;
            row.remove();
            add("gp-m--u", answer);
            res();
          },
          { once: true },
        );
      });
    }
    async function bars(q, rows) {
      const box = add(
        "gp-m--bars",
        rows
          .map(([n]) => `<div><span>${n}</span><u><i></i></u><em></em></div>`)
          .join(""),
      );
      const els = [...box.children];
      await Promise.all(
        rows.map(
          ([, dur, verdict], k) =>
            new Promise((res) =>
              q.tween(els[k].querySelector("i"), {
                width: "100%",
                duration: dur,
                ease: "power1.inOut",
                onComplete: () => {
                  els[k].classList.add("done");
                  els[k].querySelector("em").textContent = "✓ " + verdict;
                  res();
                },
              }),
            ),
        ),
      );
    }
    const logLine = (line) => {
      files[LOG] = [
        ...(files[LOG] || ["# everything that went out on a yes-rule"]),
        line,
      ];
      drawTree(LOG);
    };

    const SCEN = {
      /* the mandatory first step: Boussole sets the company up */
      async setup(q) {
        [
          "contexte/company.md",
          "contexte/icp.md",
          "contexte/personas.md",
          RULES,
          LOG,
        ].forEach((p) => delete files[p]);
        files[".mcp.json"] = FILES[".mcp.json"];
        drawTree();
        openFile(A + "boussole.md");
        say("Handing this to <b>Boussole</b>, the guide agent.");
        await q.wait(0.6);
        for (const step of SETUP) {
          now(step.now);
          await choose(q, "Boussole", step.who, step.a);
          await q.wait(0.25);
          const t = tool(q, "Write", step.path, step.lines.length * 0.13 + 0.3);
          await typeFile(q, step.path, step.lines);
          await t;
          if (step.path === ".mcp.json")
            $(".gp__plugs").textContent = "2 plugs connected";
        }
        now(
          "Done. Your company has a memory, its tools, and one yes-rule written by you.",
        );
        ok("<b>Your company is set up.</b> The agents now know who you are.");
        unlock(true);
      },
      async send(q) {
        now("Claude reads the company's memory, then writes the email.");
        openFile("contexte/icp.md");
        await tool(q, "Read", "contexte/company.md, contexte/icp.md", 0.9);
        await tool(q, "Agent", "copywriter", 1.1, "one idea, in your voice");
        add(
          "gp-m--mail",
          `<small>To: Marie D. · sequence “New VP Sales”, validated by you</small>Hi Marie, congrats on the new role. We show sales teams who to call, and why now. Worth a look?`,
        );
        await q.wait(1.2);
        now("Before it leaves, a guard checks the yes-rules you wrote.");
        openFile(HK + "gtm-send-guard.sh", 3);
        await tool(q, "Guard", "gtm-send-guard", 1.1);
        openFile(RULES, 4);
        add(
          "gp-m--rule",
          `<span>📜</span><div><b>A rule says yes</b><small>“emails from a sequence I validated” · written by you</small></div>`,
        );
        await q.wait(1.3);
        now(
          "The rule matches, so the email goes out on its own. And it is written down.",
        );
        add(
          "gp-m--sent",
          `<span>✅</span><div><b>Sent automatically</b><small>No click needed: you already said yes, once.</small></div>`,
        );
        logLine("09:14  sent     email to Marie D.   rule: validated sequence");
        await q.wait(0.9);
        openFile(LOG, files[LOG].length - 1);
        await tool(q, "Write", LOG, 0.7, "it will be in today's recap");
        now(
          "The human touch: you wrote the rule, you see everything in the recap, and one switch stops it all.",
        );
        const sw = add(
          "gp-m--recap",
          `<small>Today's recap · for you</small><div><span>1 email sent on a yes-rule · 0 waiting for you</span><button class="gp-switch on" role="switch" aria-checked="true"><i></i><b>Auto-send is on</b></button></div>`,
        );
        sw.querySelector("button").addEventListener("click", (e) => {
          const b = e.currentTarget,
            on = !b.classList.contains("on");
          b.classList.toggle("on", on);
          b.setAttribute("aria-checked", on);
          b.querySelector("b").textContent = on
            ? "Auto-send is on"
            : "Auto-send is off";
          files[RULES] = files[RULES].map((l) =>
            l.includes('"auto_send"') ? `  "auto_send": ${on},` : l,
          );
          openFile(RULES, 1);
          now(
            on
              ? "Back on: what matches a yes-rule goes out on its own again."
              : "One click, and everything waits for your yes again.",
          );
        });
        ok("Sent, logged, and still yours to stop. Try the switch.");
      },
      async review(q) {
        now("Three reviewer agents read the same change at the same time.");
        openFile(S + "code-reviewer/SKILL.md");
        say("Three reviewers, at the same time.");
        await q.wait(0.6);
        await bars(q, [
          ["security-reviewer", 2.2, "nothing leaks"],
          ["architecture-reviewer", 3.0, "one duplication"],
          ["specification-reviewer", 2.6, "matches the ticket"],
        ]);
        await q.wait(0.4);
        now(
          "They merge what they found into one grade: how much of your attention it still needs.",
        );
        add(
          "gp-m--grade",
          `<span>🟢</span><div><b>Merge confidence: high</b><small>0 blocking · 1 suggestion · read in 30 seconds</small></div>`,
        );
        await q.wait(0.6);
        ok("One message, one grade. You decide.");
      },
      async agent(q) {
        now(
          "Claude hands the job to a specialist: an agent that builds other agents.",
        );
        say("On it. Handing this to <b>agent-creator</b>.");
        openFile(A + "agent-creator.md");
        await q.wait(0.9);
        now(
          "The agent asks two questions before it builds. They are answered for you here.",
        );
        await ask(
          q,
          "agent-creator",
          "What must it never do?",
          "Merge anything without a backup",
        );
        await ask(
          q,
          "agent-creator",
          "Which voice should it have?",
          "Careful, a bit dry",
        );
        now(
          "It picks a personality, called a soul, so the new agent always behaves the same way.",
        );
        openFile(S + "create-soul/SKILL.md");
        await tool(
          q,
          "Skill",
          "create-soul",
          1.1,
          "soul picked: <b>The Archivist</b>",
        );
        now(
          "It writes the new team member as a file. Watch the explorer on the left.",
        );
        const path = A + "crm-keeper.md";
        const t = tool(q, "Write", path, 1.9);
        delete files[path];
        await typeFile(q, path, KEEPER);
        await t;
        now("Done: a new team member now lives in the workspace.");
        ok("<b>crm-keeper</b> joined the team, soul included.");
      },
      async score(q) {
        now("Claude tests on 15 accounts first, before running 200.");
        openFile(S + "scoring-grid/SKILL.md", 7);
        say("Pilot first: 15 accounts.");
        await bars(q, [
          [
            "pilot · 15 accounts",
            1.8,
            "4 Gold · 6 Silver · 3 Bronze · 2 Excluded",
          ],
        ]);
        now("It shows the pilot and waits for your yes. Click the answer.");
        await choose(
          q,
          "icp-scorer",
          "Looks good? Shall I run the rest?",
          "Yes, run the 200",
        );
        now(
          "Your yes on the pilot is the rule for this run. The rest goes through on its own.",
        );
        await bars(q, [["full run · 200 accounts", 2.6, "200 scored"]]);
        add(
          "gp-m--tiers",
          [
            ["Gold", 38, "g"],
            ["Silver", 71, "s"],
            ["Bronze", 56, "b"],
            ["Excluded", 35, "x"],
          ]
            .map(
              ([n, v, c]) =>
                `<div class="${c}" style="flex:${v}"><b>${v}</b>${n}</div>`,
            )
            .join(""),
        );
        await q.wait(0.9);
        now(
          "Before the CRM is written, the guard makes a backup, then checks the pilot got a yes.",
        );
        openFile(HK + "crm-bulk-write-guard.sh", 4);
        await tool(
          q,
          "Guard",
          "crm-bulk-write-guard",
          1.0,
          "backup saved · pilot approved by you",
        );
        add(
          "gp-m--sent",
          `<span>✅</span><div><b>Written to the CRM automatically</b><small>200 companies · a backup is behind them.</small></div>`,
        );
        logLine("09:31  written  200 tiers to the CRM   rule: pilot approved");
        await q.wait(0.7);
        now(
          "Done: every account has a tier, it is logged, and there is a backup to go back to.",
        );
        ok("Tiers written, logged, and reversible.");
      },
    };

    /* ── running, locking, progress ── */
    const setState = (cls, txt) => {
      $(".gp__state").className = "gp__state " + cls;
      $(".gp__state").textContent = txt;
    };
    const touched = () =>
      $$(".gp__prompts .pulse").forEach((b) => b.classList.remove("pulse"));
    function paintPrompts() {
      $$(".gp__prompts button").forEach((b) => {
        const id = b.dataset.run,
          locked = !ready && id !== "setup";
        b.classList.toggle("locked", locked);
        b.classList.toggle("seen", seen.has(id));
        b.setAttribute("aria-disabled", locked);
        b.title = locked ? "Set up your company first" : "";
      });
      $(".gp__seen span").textContent = ready
        ? "Try a prompt"
        : "🔒 Set up your company first";
      $(".gp__seen em").textContent =
        `${seen.size} of ${PROMPTS.length} explored`;
      gp.classList.toggle("is-locked", !ready);
    }
    /** The company exists: the other prompts open up. `fresh` = it just happened. */
    function unlock(fresh) {
      ready = true;
      seen.add("setup");
      mem("gp-setup-done", "1");
      paintPrompts();
      if (fresh && !RM)
        gsap.fromTo(
          $$(".gp__prompts button:not([data-run='setup'])"),
          { x: -8, opacity: 0.4 },
          {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.07,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
        );
    }
    function finished(id) {
      seen.add(id);
      paintPrompts();
      const next = PROMPTS.find(([k]) => !seen.has(k));
      add(
        "gp-m--next",
        next
          ? `<span>Next, try:</span><button data-run="${next[0]}">${next[1]} →</button><a href="${url}" target="_blank" rel="noopener">Want this for your team? Ask me on LinkedIn ↗</a>`
          : `<span>You have seen all five.</span><a href="${url}" target="_blank" rel="noopener">Want this for your team? Ask me on LinkedIn ↗</a>`,
      );
      if (id === "setup" && !mem("gp-tour-done"))
        tourCall = gsap.delayedCall(RM ? 0.1 : 0.9, () => tourStep(0));
    }
    function run(id) {
      if (!SCEN[id]) return;
      if (!ready && id !== "setup") {
        const b = $('.gp__prompts [data-run="setup"]');
        b.classList.add("pulse");
        if (!RM)
          gsap.fromTo(
            b,
            { x: -5 },
            {
              x: 0,
              duration: 0.4,
              ease: "elastic.out(1.2,0.3)",
              clearProps: "transform",
            },
          );
        now("Set up your company first: the agents need to know who you are.");
        return;
      }
      seq?.kill();
      endTour();
      closeIntro();
      touched();
      const q = (seq = new Seq());
      last = id;
      msgs.innerHTML = "";
      $$(".gp__prompts button").forEach((b) =>
        b.classList.toggle("on", b.dataset.run === id),
      );
      add("gp-m--u", PROMPTS.find(([k]) => k === id)[1]);
      pp.disabled = re.disabled = false;
      pp.textContent = "❚❚";
      setState("run", "working");
      q.wait(0.5)
        .then(() => SCEN[id](q))
        .then(() => {
          if (q.dead) return;
          setState("done", "done");
          pp.disabled = true;
          finished(id);
        });
    }
    $(".gp__chat").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-run]");
      if (b) run(b.dataset.run);
    });
    re.addEventListener("click", () => last && run(last));
    pp.addEventListener("click", () => {
      if (!seq || seq.dead) return;
      if (seq.paused) {
        seq.resume();
        pp.textContent = "❚❚";
        setState("run", "working");
      } else {
        seq.pause();
        pp.textContent = "▶";
        setState("pause", "paused");
      }
    });

    /* ── step 0: what this is ── */
    const intro = $(".gp-intro");
    function openIntro() {
      endTour(false);
      $(".gp-intro__go").textContent = ready
        ? "Show me around →"
        : "Set up my company →";
      $(".gp-intro__skip").hidden = ready;
      intro.hidden = false;
      if (!RM) {
        gsap.fromTo(intro, { opacity: 0 }, { opacity: 1, duration: 0.3 });
        gsap.fromTo(
          $(".gp-intro__card"),
          { y: 18, scale: 0.96 },
          {
            y: 0,
            scale: 1,
            duration: 0.45,
            ease: "back.out(1.4)",
            clearProps: "transform",
          },
        );
        gsap.fromTo(
          $$(".gp-intro li"),
          { opacity: 0, x: -10 },
          {
            opacity: 1,
            x: 0,
            duration: 0.35,
            stagger: 0.09,
            delay: 0.2,
            clearProps: "transform,opacity",
          },
        );
      }
      $(".gp-intro__go").focus({ preventScroll: true });
    }
    function closeIntro() {
      if (intro.hidden) return;
      intro.hidden = true;
    }
    $(".gp-intro__go").addEventListener("click", () => {
      closeIntro();
      if (ready) tourStep(0);
      else run("setup");
    });
    $(".gp-intro__skip").addEventListener("click", () => {
      closeIntro();
      $('.gp__prompts [data-run="setup"]').classList.add("pulse");
    });
    $(".gp__help").addEventListener("click", openIntro);

    /* ── a three-bubble tour, shown once after the setup ── */
    const tourEl = $(".gp-tour");
    const TOUR = [
      [
        ".gp__prompts",
        "Your company is set up. Now ask Claude for something: click a prompt.",
        "prompts",
      ],
      [
        ".gp__files",
        "Every file is a team member, a skill, a guard or a memory. Click one.",
        "files",
      ],
      [
        ".gp__editor",
        "Open files show up here. Short, and written in plain words.",
        "editor",
      ],
    ];
    let tourAt = -1,
      tourCall = null;
    function placeTour() {
      if (tourAt < 0) return;
      const [sel, , kind] = TOUR[tourAt],
        t = $(sel).getBoundingClientRect(),
        c = gp.getBoundingClientRect();
      const stacked = getComputedStyle($(".gp__ide")).display !== "grid";
      const w = Math.min(280, c.width - 24),
        h = tourEl.offsetHeight;
      let x, y, side;
      if (stacked) {
        // on a phone the bubble sits just above what it points at, so it never hides it
        const above = t.top - c.top - h - 14;
        side = above >= 8 ? "down" : "up";
        x = t.left - c.left + 16;
        y = above >= 8 ? above : t.top - c.top + Math.min(54, t.height - 8);
      } else if (kind === "prompts") {
        side = "right";
        x = t.left - c.left - w - 16;
        y = t.top - c.top + 34;
      } else if (kind === "files") {
        side = "left";
        x = t.right - c.left + 16;
        y = t.top - c.top + 70;
      } else {
        side = "up";
        x = t.left - c.left + 60;
        y = t.top - c.top + 52;
      }
      tourEl.style.width = w + "px";
      tourEl.style.left = Math.max(12, Math.min(c.width - w - 12, x)) + "px";
      tourEl.style.top = Math.max(8, Math.min(c.height - h - 8, y)) + "px";
      tourEl.dataset.side = side;
    }
    function tourStep(i) {
      $$(".gp-spot").forEach((s) => s.classList.remove("gp-spot"));
      if (i >= TOUR.length) return endTour(true);
      tourAt = i;
      const target = $(TOUR[i][0]);
      target.classList.add("gp-spot");
      if (i === 1 && !$(".gp__files").open) $(".gp__files").open = true;
      tourEl.hidden = false;
      tourEl.querySelector("p").textContent = TOUR[i][1];
      tourEl.querySelector("span").textContent = `${i + 1} of ${TOUR.length}`;
      tourEl.querySelector('[data-t="next"]').textContent =
        i === TOUR.length - 1 ? "Got it" : "Next";
      if (getComputedStyle($(".gp__ide")).display !== "grid" && i > 0)
        target.scrollIntoView({
          block: "center",
          behavior: RM ? "auto" : "smooth",
        });
      placeTour();
      // phone, first bubble: the page may sit lower after the setup, bring the bubble back in view
      if (getComputedStyle($(".gp__ide")).display !== "grid" && i === 0)
        tourEl.scrollIntoView({
          block: "center",
          behavior: RM ? "auto" : "smooth",
        });
      if (!RM)
        gsap.fromTo(
          tourEl,
          { opacity: 0, scale: 0.92 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.6)",
            clearProps: "transform",
          },
        );
    }
    function endTour(remember) {
      tourCall?.kill();
      if (tourAt < 0 && tourEl.hidden) return;
      tourAt = -1;
      tourEl.hidden = true;
      $$(".gp-spot").forEach((s) => s.classList.remove("gp-spot"));
      if (remember !== false) mem("gp-tour-done", "1");
    }
    tourEl.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.t === "skip") endTour(true);
      else tourStep(tourAt + 1);
    });
    const onResize = () => placeTour();
    addEventListener("resize", onResize);

    /* ── first paint ── */
    if (matchMedia("(max-width: 760px)").matches) $(".gp__files").open = false;
    let io = null;
    if (mem("gp-setup-done")) {
      // a returning visitor: the company is already there, nothing to redo
      SETUP.forEach((s) => (files[s.path] = s.lines));
      $(".gp__plugs").textContent = "2 plugs connected";
      ready = true;
      seen.add("setup");
      add(
        "gp-m--c gp-m--hello",
        `<b>Welcome back 👋 Your company is still set up.</b>The agents know who you are. Pick a prompt below and watch them work. <span>↓</span>`,
      );
    } else {
      add(
        "gp-m--c gp-m--hello",
        `<b>Hi 👋 This is a real GTM infrastructure, run like a mini company.</b>A team of AI agents, each with its own job. First, tell them who you are: <b>set up your company</b> below. <span>↓</span>`,
      );
      $('.gp__prompts [data-run="setup"]').classList.add("pulse");
      if (matchMedia("(max-width: 760px)").matches) {
        io = new IntersectionObserver(
          (es) =>
            es.forEach((en) => {
              if (en.isIntersecting) {
                io.disconnect();
                openIntro();
              }
            }),
          { threshold: 0.25 },
        );
        io.observe(gp);
      } else tourCall = gsap.delayedCall(RM ? 0.1 : 0.8, openIntro);
    }
    paintPrompts();
    drawTree();
    openFile("CLAUDE.md");
    return {
      dispose: () => {
        seq?.kill();
        tourCall?.kill();
        io?.disconnect();
        removeEventListener("resize", onResize);
      },
      run: (id) => run(ready ? id : "setup"),
      open: openFile,
      ready: () => ready,
    };
  }

  window.Glorious = { mount };
})();
