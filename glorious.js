/* ═══════════════════════════════════════════════════════════
   Glorious Pipeline — a small code editor you can click:
   the workspace files on the left, a file in the middle,
   Claude Code on the right with prompts that play a scenario.
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
  const FILES = {
    "CLAUDE.md": [
      "# House rules",
      "Every agent reads this first.",
      "",
      "- Explain in plain words, short sentences.",
      "- Nothing leaves without a human: drafts only.",
      "- Read contexte/ before writing to anyone.",
      "- Change only what the task needs.",
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
      ["Read contexte/voice/ first.", "One idea per message. Drafts only."],
      "The Ghostwriter. Disappears behind the rep.",
    ),
    [A + "boussole.md"]: agent(
      "boussole",
      "Guide. Walks a new team through the whole setup.",
      "Read, Write, Skill",
      ["One step at a time. Ask, then do.", "Works in English and in French."],
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
      "# Runs before any tool that sends to a person.",
      "",
      'if is_send "$TOOL"; then',
      '  echo "Blocked: drafts only, a human must approve." >&2',
      "  exit 2",
      "fi",
    ],
    [HK + "crm-bulk-write-guard.sh"]: [
      "#!/bin/bash",
      "# Runs before a bulk write to the CRM.",
      "",
      'if [ ! -f "$BACKUP" ] || [ "$DRY_RUN" != "ok" ]; then',
      '  echo "Blocked: backup + dry run first." >&2',
      "  exit 2",
      "fi",
    ],
    [HK + "credit-ceiling.sh"]: [
      "#!/bin/bash",
      "# Stops a run that would spend past the ceiling.",
      "",
      'if [ "$ESTIMATE" -gt "$CEILING" ]; then',
      '  echo "Blocked: over the credit ceiling." >&2',
      "  exit 2",
      "fi",
    ],
    [HK + "team-email-guard.sh"]: [
      "#!/bin/bash",
      "# No teammate's email goes to an outside service.",
      "",
      'if leaks_team_email "$PAYLOAD"; then',
      '  echo "Blocked: a teammate\'s email was leaving." >&2',
      "  exit 2",
      "fi",
    ],
    ".mcp.json": [
      "{",
      '  "mcpServers": {',
      '    "hubspot": { "type": "http" },',
      '    "cargo":   { "type": "http" },',
      '    "slack":   { "type": "http" },',
      '    "notion":  { "type": "http" }',
      "  }",
      "}",
    ],
    "contexte/icp.md": [
      "# Who we sell to",
      "B2B companies with a sales team that prospects.",
      "",
      "## Knock-out gates",
      "- sells to businesses",
      "- in a zone we cover",
      "- not already a customer",
      "",
      "## Persona 1",
      "The person who runs the GTM tooling.",
    ],
    "contexte/personas.md": [
      "# Personas",
      "",
      "1. The operator: runs the tools, feels the pain.",
      "2. The leader: owns the number, signs.",
      "",
      "Write to the operator first.",
    ],
    "contexte/voice/claire.md": [
      "# Claire's voice",
      "",
      "- First name, short sentences.",
      "- One idea per message.",
      '- Never "I hope this finds you well".',
      "- Signs with her first name only.",
    ],
  };
  const KEEPER = agent(
    "crm-keeper",
    "Finds and merges duplicate records in the CRM.",
    "Read, mcp: hubspot",
    ["Backup first. Dry run next.", "Merge only sure matches, in small waves."],
    "The Archivist. Careful, a bit dry, hates duplicates.",
  );
  const PROMPTS = [
    ["agent", "Create an agent that cleans CRM duplicates"],
    ["review", "Review my PR"],
    ["send", "Send this email to the prospect"],
    ["score", "Score 200 accounts"],
    ["boussole", "Boussole, set this up at my new company"],
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
            .replace(/\b(if|then|fi|exit|echo)\b/g, '<i class="c-k">$1</i>');
    if (path.endsWith(".json"))
      return t
        .replace(/("[^"]*")(\s*:)/g, '<i class="c-k">$1</i>$2')
        .replace(/: ("[^"]*")/g, ': <i class="c-s">$1</i>');
    if (line === "---") return `<i class="c-c">---</i>`;
    const fm = lines.indexOf("---") === 0 && i < lines.indexOf("---", 1);
    if (fm) return t.replace(/^([a-z]+)(:)/, '<i class="c-k">$1</i>$2');
    if (/^#/.test(line)) return `<i class="c-h">${t}</i>`;
    if (/^soul:/.test(line)) return `<i class="c-soul">${t}</i>`;
    return t;
  }

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
    root.innerHTML = `
      <div class="gp">
        <header class="gp__top">
          <img src="assets/glorious/loki.webp" width="34" height="34" alt="">
          <p><b>Glorious Pipeline</b> — an agentic Claude Code machine any GTM team can install.</p>
          <a class="gp__cta" href="${opts.url || "#"}" target="_blank" rel="noopener">Want the kit? Ask me on LinkedIn ↗</a>
        </header>
        <div class="gp__ide">
          <details class="gp__files" open><summary>Explorer <span>your-gtm-workspace</span></summary><div class="gp__tree"></div></details>
          <section class="gp__editor" aria-label="Editor"><div class="gp__tabs"></div><pre class="gp__code" tabindex="0"></pre></section>
          <section class="gp__chat" aria-label="Claude Code">
            <header>${bot(26)}<b>Claude Code</b><span class="gp__state"></span><button class="gp__pp" disabled aria-label="Pause">❚❚</button><button class="gp__re" disabled aria-label="Replay">↻</button></header>
            <div class="gp__msgs" aria-live="polite"><p class="gp__hint">Open a file, or try a prompt <span>↓</span></p></div>
            <div class="gp__prompts">${PROMPTS.map(([id, t]) => `<button data-run="${id}">${t}</button>`).join("")}</div>
          </section>
        </div>
        <footer class="gp__status"><span>⎇ main</span><span>4 guards on</span><span>4 plugs connected</span><span class="gp__sp"></span><span>Markdown</span><span>EN · FR</span></footer>
      </div>`;
    const $ = (s) => root.querySelector(s),
      $$ = (s) => [...root.querySelectorAll(s)];
    const tree = $(".gp__tree"),
      code = $(".gp__code"),
      msgs = $(".gp__msgs"),
      pp = $(".gp__pp"),
      re = $(".gp__re");
    let seq = null,
      current = null,
      last = null;

    /* ── explorer ── */
    function drawTree(flash) {
      const dirs = new Set();
      let html = "";
      const order = Object.keys(files);
      const seen = [];
      order.forEach((p) => {
        const parts = p.split("/");
        parts.slice(0, -1).forEach((_, d) => {
          const dir = parts.slice(0, d + 1).join("/");
          if (!dirs.has(dir)) {
            dirs.add(dir);
            seen.push(["d", dir, d]);
          }
        });
        seen.push(["f", p, parts.length - 1]);
      });
      // folders first at the root, loose files after, like an editor
      const rootFiles = seen.filter(([k, p]) => k === "f" && !p.includes("/"));
      const rest = seen.filter(([k, p]) => !(k === "f" && !p.includes("/")));
      [...rest, ...rootFiles].forEach(([k, p, d]) => {
        const name = p.split("/").pop();
        html +=
          k === "d"
            ? `<div class="gp-dir" style="--d:${d}"><i>▾</i>${name}</div>`
            : `<button class="gp-file ${p === current ? "on" : ""}" data-path="${p}" style="--d:${d}"><i class="gp-ic gp-ic--${name.split(".").pop()}"></i>${name}</button>`;
      });
      tree.innerHTML = html;
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
        ext === "sh" ? "Shell" : ext === "json" ? "JSON" : "Markdown";
      if (mark !== undefined) {
        const l = code.children[mark];
        if (l) {
          l.classList.add("hit");
          code.scrollTop = Math.max(0, l.offsetTop - 60);
        }
      } else if (!RM)
        gsap.fromTo(code, { opacity: 0.4 }, { opacity: 1, duration: 0.25 });
    }
    tree.addEventListener("click", (e) => {
      const b = e.target.closest(".gp-file");
      if (b) openFile(b.dataset.path);
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

    const SCEN = {
      async agent(q) {
        say("On it. Handing this to <b>agent-creator</b>.");
        openFile(A + "agent-creator.md");
        await q.wait(0.9);
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
        openFile(S + "create-soul/SKILL.md");
        await tool(
          q,
          "Skill",
          "create-soul",
          1.1,
          "soul picked: <b>The Archivist</b>",
        );
        const path = A + "crm-keeper.md";
        const t = tool(q, "Write", path, 1.9);
        files[path] = [];
        const keys = Object.keys(files).filter((k) => k !== path),
          pos = keys.indexOf(A + "copywriter.md");
        const next = {};
        keys.forEach((k, i) => {
            if (i === pos) next[path] = [];
            next[k] = files[k];
          });
        Object.keys(files).forEach((k) => delete files[k]);
        Object.assign(files, next);
        drawTree(path);
        openFile(path);
        for (let i = 1; i <= KEEPER.length; i++) {
          files[path] = KEEPER.slice(0, i);
          code.innerHTML =
            lineHTML(path, files[path]) + '<span class="gp-cur"></span>';
          await q.wait(0.16);
        }
        code.innerHTML = lineHTML(path, files[path]);
        await t;
        ok(
          "<b>crm-keeper</b> is ready. It appeared in the explorer, soul included.",
        );
      },
      async review(q) {
        openFile(S + "code-reviewer/SKILL.md");
        say("Three reviewers, at the same time.");
        await q.wait(0.6);
        await bars(q, [
          ["security-reviewer", 2.2, "nothing leaks"],
          ["architecture-reviewer", 3.0, "one duplication"],
          ["specification-reviewer", 2.6, "matches the ticket"],
        ]);
        await q.wait(0.4);
        add(
          "gp-m--grade",
          `<span>🟢</span><div><b>Merge confidence: high</b><small>0 blocking · 1 suggestion · read in 30 seconds</small></div>`,
        );
        await q.wait(0.6);
        ok("One message, one grade. You decide.");
      },
      async send(q) {
        await tool(q, "Bash", "send-email --to prospect", 1.0);
        openFile(HK + "gtm-send-guard.sh", 4);
        add(
          "gp-m--block",
          `<span>🚫</span><div><b>Blocked by gtm-send-guard</b><small>Drafts only. A human must approve.</small></div>`,
        );
        await q.wait(1.6);
        say("Fair. I'll write it, you'll send it.");
        await tool(q, "Write", "drafts/prospect-email.md", 0.9);
        ok("Saved as a draft. It is waiting for you.");
      },
      async score(q) {
        openFile(S + "scoring-grid/SKILL.md", 7);
        say("Pilot first: 15 accounts.");
        await bars(q, [
          [
            "pilot · 15 accounts",
            1.8,
            "4 Gold · 6 Silver · 3 Bronze · 2 Excluded",
          ],
        ]);
        await ask(
          q,
          "icp-scorer",
          "Looks good? Shall I run the rest?",
          "Yes, run the 200",
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
        await tool(q, "HubSpot", "bulk update · 200 companies", 0.9);
        openFile(HK + "crm-bulk-write-guard.sh", 4);
        add(
          "gp-m--block gp-m--warn",
          `<span>✋</span><div><b>crm-bulk-write-guard</b><small>Backup and dry run first.</small></div>`,
        );
        await q.wait(1.3);
        await tool(q, "Bash", "backup companies.csv", 0.8, "backup saved");
        await tool(q, "HubSpot", "dry run", 1.0, "200 would change · 0 errors");
        ok("Tiers written to the CRM, with a backup behind them.");
      },
      async boussole(q) {
        openFile(A + "boussole.md");
        say("Handing this to <b>Boussole</b>, the guide.");
        await q.wait(0.7);
        await ask(
          q,
          "Boussole",
          "What do you sell, and to whom?",
          "Software, to B2B sales teams",
        );
        await ask(
          q,
          "Boussole",
          "Which tools do you already use?",
          "HubSpot and Slack",
        );
        await ask(q, "Boussole", "Who approves before anything is sent?", "Me");
        const steps = [
          ["CLAUDE.md", "house rules written"],
          ["contexte/icp.md", "your target, in plain words"],
          [".mcp.json", "HubSpot and Slack plugged in"],
          [HK + "gtm-send-guard.sh", "guards switched on"],
          [A + "copywriter.md", "first agent, with its soul"],
        ];
        const list = add(
          "gp-m--check",
          steps.map(([, t]) => `<div><i>○</i>${t}</div>`).join(""),
        );
        for (let k = 0; k < steps.length; k++) {
          openFile(steps[k][0]);
          drawTree(steps[k][0]);
          await q.wait(0.85);
          list.children[k].classList.add("done");
          list.children[k].firstChild.textContent = "✓";
        }
        ok("Your machine is ready. In English or in French.");
      },
    };

    const setState = (cls, txt) => {
      $(".gp__state").className = "gp__state " + cls;
      $(".gp__state").textContent = txt;
    };
    function run(id) {
      if (!SCEN[id]) return;
      seq?.kill();
      const q = (seq = new Seq());
      last = id;
      msgs.innerHTML = "";
      $$(".gp__prompts button").forEach((b) =>
        b.classList.toggle("on", b.dataset.run === id),
      );
      root.querySelector(".gp").classList.add("has-run");
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
        });
    }
    $(".gp__prompts").addEventListener("click", (e) => {
      const b = e.target.closest("button");
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

    if (matchMedia("(max-width: 760px)").matches) $(".gp__files").open = false;
    drawTree();
    openFile("CLAUDE.md");
    return { dispose: () => seq?.kill(), run, open: openFile };
  }

  window.Glorious = { mount };
})();
