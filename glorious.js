/* ═══════════════════════════════════════════════════════════
   Glorious Pipeline — the machine drawn as a building,
   plus the one-paste install typed in a terminal.
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";
  const W = 1040,
    H = 560;
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bot = (w, fill) =>
    `<svg width="${w}" viewBox="-1 -3 16 13" shape-rendering="crispEdges" aria-hidden="true"><g fill="${fill}"><rect x="2" y="0" width="10" height="7"/><rect x="0" y="3" width="14" height="2"/><rect x="2" y="7" width="1" height="2"/><rect x="4" y="7" width="1" height="2"/><rect x="9" y="7" width="1" height="2"/><rect x="11" y="7" width="1" height="2"/></g><rect x="4" y="2" width="1" height="2" fill="#1a0f0b"/><rect x="9" y="2" width="1" height="2" fill="#1a0f0b"/></svg>`;
  const at = (cls, x, y, w, h, html, extra = "") =>
    `<div class="${cls}" ${extra} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">${html}</div>`;

  const AGENTS = [
    ["ICP scorer", "#d97757"],
    ["List builder", "#3da5bb"],
    ["CRM keeper", "#e2a93a"],
    ["Copywriter", "#2fb67c"],
    ["Inbound router", "#e58a9c"],
    ["Reporter", "#7fa7e0"],
  ];
  const SKILLS = ["discover", "plan", "review", "score", "write", "report"];
  const GUARDS = [
    ["✋", "No send without a human"],
    ["⛑", "Backup + dry run first"],
    ["◔", "Credit ceiling"],
    ["✉", "No email leaks"],
  ];
  const PLUGS = ["HubSpot", "Cargo", "Slack", "Notion"];
  const STEPS = [
    "Discover",
    "Vision",
    "Plan",
    "Pre-mortem",
    "Build ×3",
    "Review trio",
    "Visual check",
    "One message",
  ];
  const CAPS = [
    ["pipe", "The pipeline: every task goes through the same eight steps."],
    [
      "trio",
      "Three AI reviewers read every change: security, architecture, spec.",
    ],
    ["skills", "Recipes: skills any agent can pick up and follow."],
    [
      "souls",
      "Agents with souls: a job, rules, and a personality that stays the same.",
    ],
    ["rules", "The rules on the roof: what every agent must respect."],
    ["guards", "Guards at the door: hooks that block what must never happen."],
    ["plugs", "Plugs: the tools the agents can reach, through MCP."],
    ["clock", "Scheduled agents: some jobs run on their own, on a timer."],
  ];

  function stageHTML() {
    return (
      `<svg class="gl-svg" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path class="gl-loop" d="M955 240 C 955 224, 880 232, 880 204 L 880 112 C 880 62, 800 48, 742 48"/><path class="gl-loop-on" d="M955 240 C 955 224, 880 232, 880 204 L 880 112 C 880 62, 800 48, 742 48"/></svg>` +
      // roof
      at(
        "gl-part gl-roof",
        150,
        22,
        590,
        54,
        `<b>RULES</b><span>the house rules every agent reads first</span>`,
        'data-p="rules"',
      ) +
      // floor 3 · souls
      at(
        "gl-part gl-floor",
        130,
        86,
        630,
        96,
        `<h6>Agents with souls</h6><div class="gl-row">${AGENTS.map(([n, c]) => `<div class="gl-agent">${bot(34, c)}<small>${n}</small></div>`).join("")}</div>`,
        'data-p="souls"',
      ) +
      // floor 2 · skills
      at(
        "gl-part gl-floor",
        130,
        192,
        630,
        82,
        `<h6>Recipes · skills</h6><div class="gl-row">${SKILLS.map((s) => `<div class="gl-skill"><i></i>${s}</div>`).join("")}</div>`,
        'data-p="skills"',
      ) +
      // floor 1 · review trio
      at(
        "gl-part gl-floor",
        130,
        284,
        630,
        92,
        `<h6>Review trio</h6><div class="gl-row gl-row--trio">${["Security", "Architecture", "Spec"].map((r) => `<div class="gl-rev"><i class="gl-light"></i>${r}</div>`).join("")}<div class="gl-grade"><span>🟢</span><span>🟡</span><span>🟠</span><span>🔴</span><em>confidence</em></div></div>`,
        'data-p="trio"',
      ) +
      // left tower · guards
      at(
        "gl-part gl-tower",
        20,
        86,
        100,
        290,
        `<h6>Guards<br>hooks</h6>${GUARDS.map(([g, t]) => `<div class="gl-guard" title="${t}"><i>${g}</i><small>${t}</small></div>`).join("")}`,
        'data-p="guards"',
      ) +
      // right tower · plugs
      at(
        "gl-part gl-tower gl-tower--r",
        770,
        86,
        100,
        290,
        `<h6>Plugs<br>MCP</h6>${PLUGS.map((p) => `<div class="gl-plug"><i></i>${p}</div>`).join("")}`,
        'data-p="plugs"',
      ) +
      // clock · scheduled agents
      at(
        "gl-part gl-clock",
        890,
        86,
        130,
        130,
        `<div class="gl-face"><i class="gl-hand"></i></div><small>Scheduled agents<br>GitHub Actions</small>`,
        'data-p="clock"',
      ) +
      // red bin · learning loop
      at(
        "gl-part gl-bin",
        890,
        240,
        130,
        104,
        `<div class="gl-binic">▥</div><b>Red bin</b><small>every human correction becomes a rule</small>`,
        'data-p="bin"',
      ) +
      // conveyor · pipeline
      at(
        "gl-part gl-pipe",
        20,
        392,
        1000,
        84,
        `<h6>The pipeline</h6><div class="gl-steps">${STEPS.map((s, i) => `<div class="gl-step" data-s="${i}">${s}</div>`).join('<span class="gl-arrow">→</span>')}</div>`,
        'data-p="pipe"',
      ) +
      `<i class="gl-token"></i><i class="gl-spark"></i>` +
      `<div class="gl-final">✓ Done. Here is what to check.</div>` +
      `<div class="gl-caps">${CAPS.map(([, c]) => `<p>${c}</p>`).join("")}<p>The grade says how much human attention the work still needs.</p><p>A human correction goes in the red bin, and comes back as a rule for every agent.</p></div>`
    );
  }

  function mount(root, opts = {}) {
    root.innerHTML = `
      <div class="glo">
        <div class="glo__scroll"><div class="glo__box"><div class="gl-stage">${stageHTML()}</div></div></div>
        <div class="glo__ctl"><span>The machine, drawn as a building</span><button class="glo__pp" aria-label="Pause">❚❚ Pause</button><button class="glo__re" aria-label="Replay">↻ Replay</button></div>
        <div class="glo__row">
          <div class="gl-term" aria-label="One-paste install">
            <div class="gl-term__bar"><i></i><i></i><i></i><span>claude · your-gtm-workspace</span><button class="gl-term__re" aria-label="Replay the install">↻</button></div>
            <div class="gl-term__body"></div>
          </div>
          <div class="gl-cta">
            <img src="assets/glorious/loki.webp" alt="The Glorious Pipeline mascot: the pixel Claude Code creature with golden horns and a green cape" width="84" height="84">
            <b>Want the kit?</b>
            <p>It is private, and shared on request. English and French.</p>
            <a class="cta" href="${opts.url || "#"}" target="_blank" rel="noopener">Ask me on LinkedIn ↗</a>
          </div>
        </div>
      </div>`;
    const $ = (s) => root.querySelector(s),
      $$ = (s) => [...root.querySelectorAll(s)];
    const st = $(".gl-stage"),
      box = $(".glo__box");
    const part = (p) => $(`[data-p="${p}"]`);

    /* ── the building ── */
    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.5 });
    const caps = $$(".gl-caps p");
    let shown = null;
    const cap = (i, t) => {
      if (shown !== null)
        tl.to(caps[shown], { opacity: 0, y: -6, duration: 0.25 }, t);
      tl.fromTo(
        caps[i],
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35 },
        t + 0.15,
      );
      shown = i;
    };
    const glow = (el, t, c = "#e9b949") =>
      tl.fromTo(
        el,
        { boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
        {
          boxShadow: `0 0 0 2px ${c}, 0 0 26px ${c}66`,
          duration: 0.3,
          yoyo: true,
          repeat: 1,
          repeatDelay: 1.0,
        },
        t,
      );
    caps.forEach((c) => tl.set(c, { opacity: 0 }, 0));
    const pos = (el) => {
      const a = el.getBoundingClientRect(),
        b = st.getBoundingClientRect(),
        k = b.width / W;
      return {
        x: (a.left - b.left + a.width / 2) / k,
        y: (a.top - b.top) / k - 12,
      };
    };
    const pts = $$(".gl-step").map(pos);
    // 1 · the building assembles, bottom to top, one caption per part
    let t = 0.2;
    CAPS.forEach(([p], i) => {
      const el = part(p),
        from =
          p === "rules"
            ? { y: -40 }
            : p === "guards"
              ? { x: -40 }
              : p === "plugs" || p === "clock"
                ? { x: 40 }
                : { y: 30 };
      tl.fromTo(
        el,
        { opacity: 0, ...from },
        { opacity: 1, x: 0, y: 0, duration: 0.55, ease: "back.out(1.4)" },
        t,
      );
      cap(i, t);
      glow(el, t + 0.35);
      const kids = el.querySelectorAll(
        ".gl-agent, .gl-skill, .gl-rev, .gl-guard, .gl-plug, .gl-step",
      );
      if (kids.length)
        tl.fromTo(
          kids,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 },
          t + 0.25,
        );
      t += 1.25;
    });
    tl.fromTo(
      part("bin"),
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, duration: 0.5, ease: "back.out(1.4)" },
      t - 0.9,
    );
    tl.fromTo(
      $(".gl-hand"),
      { rotation: 0 },
      { rotation: 720, duration: 12, ease: "none" },
      0,
    );
    // 2 · one task rides the pipeline
    const tok = $(".gl-token"),
      steps = $$(".gl-step"),
      lights = $$(".gl-light");
    tl.set(tok, { x: pts[0].x, y: pts[0].y, opacity: 0 }, 0);
    tl.set(lights, { backgroundColor: "#33444b" }, 0);
    cap(0, t);
    tl.to(tok, { opacity: 1, duration: 0.2 }, t);
    steps.forEach((s, i) => {
      if (i)
        tl.to(
          tok,
          { x: pts[i].x, y: pts[i].y, duration: 0.42, ease: "power2.inOut" },
          t,
        );
      t += i ? 0.42 : 0.2;
      tl.fromTo(
        s,
        { backgroundColor: "rgba(255,255,255,.06)", color: "#b9c7cc" },
        {
          backgroundColor: i === 7 ? "#2fb67c" : "#d97757",
          color: "#fff",
          duration: 0.25,
        },
        t,
      );
      if (i === 5) {
        cap(1, t);
        ["#2fb67c", "#2fb67c", "#e9b949"].forEach((c, k) =>
          tl.to(
            lights[k],
            { backgroundColor: c, boxShadow: `0 0 12px ${c}`, duration: 0.25 },
            t + 0.25 + k * 0.35,
          ),
        );
        tl.fromTo(
          $$(".gl-grade span")[1],
          { scale: 1 },
          {
            scale: 1.7,
            duration: 0.3,
            yoyo: true,
            repeat: 1,
            ease: "back.out(3)",
          },
          t + 1.35,
        );
        cap(8, t + 1.4);
        t += 2.6;
      } else t += 0.3;
    });
    tl.fromTo(
      $(".gl-final"),
      { opacity: 0, y: 10, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(2)" },
      t,
    );
    tl.to(tok, { opacity: 0, duration: 0.2 }, t);
    t += 1.6;
    // 3 · the red bin: a correction becomes a rule
    const loop = $(".gl-loop-on"),
      len = loop.getTotalLength(),
      spark = $(".gl-spark"),
      o = { p: 0 };
    loop.style.strokeDasharray = len;
    cap(9, t);
    glow(part("bin"), t, "#e2574c");
    tl.fromTo(
      loop,
      { strokeDashoffset: len },
      { strokeDashoffset: 0, duration: 1.5, ease: "power1.inOut" },
      t + 0.3,
    );
    tl.fromTo(
      o,
      { p: 0 },
      {
        p: 1,
        duration: 1.5,
        ease: "power1.inOut",
        onUpdate: () => {
          const q = loop.getPointAtLength(len * o.p);
          gsap.set(spark, { x: q.x, y: q.y });
        },
      },
      t + 0.3,
    );
    tl.fromTo(spark, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t + 0.3);
    tl.to(spark, { opacity: 0, duration: 0.2 }, t + 1.8);
    glow(part("rules"), t + 1.8, "#e2574c");
    tl.to(caps[9], { opacity: 0, duration: 0.3 }, t + 4.6);
    tl.to({}, { duration: 0.4 }, t + 4.8);

    const fit = () => (st.style.transform = `scale(${box.clientWidth / W})`);
    const ro = new ResizeObserver(() => requestAnimationFrame(fit));
    ro.observe(box);
    fit();
    const sync = () =>
      ($(".glo__pp").textContent = tl.paused() ? "▶ Play" : "❚❚ Pause");
    $(".glo__pp").addEventListener("click", () => {
      tl.paused(!tl.paused());
      sync();
    });
    $(".glo__re").addEventListener("click", () => {
      tl.play(0);
      sync();
    });

    /* ── the one-paste install ── */
    const body = $(".gl-term__body");
    const PROMPT =
      "Read the guide in this kit and set up this workspace with me, one step at a time. Ask before anything that sends or writes.";
    const LINES = [
      ["gl-t--agent", "● <b>Boussole</b> · guide agent"],
      [
        "gl-t--say",
        "Hello, I'm Boussole. I'll take you through the setup, one step at a time. First: who is on your team?",
      ],
      ["gl-t--ok", "rules written for your team"],
      ["gl-t--ok", "agents created, each with a soul"],
      ["gl-t--ok", "guards switched on"],
      ["gl-t--ok", "plugs connected"],
      ["gl-t--ok", "pipeline tested on a first task"],
      ["gl-t--done", "Your machine is ready."],
    ];
    let calls = [];
    const later = (s, fn) => calls.push(gsap.delayedCall(s, fn));
    function install() {
      calls.forEach((c) => c.kill());
      calls = [];
      body.innerHTML = `<div class="gl-t gl-t--prompt"><span>❯</span><span class="tx"></span><i class="gl-cur"></i></div>`;
      const tx = body.querySelector(".tx");
      const add = (cls, html) => {
        const d = document.createElement("div");
        d.className = "gl-t " + cls;
        d.innerHTML = html;
        body.appendChild(d);
        body.scrollTop = body.scrollHeight;
        if (!RM)
          gsap.fromTo(
            d,
            { opacity: 0, y: 5 },
            {
              opacity: 1,
              y: 0,
              duration: 0.25,
              clearProps: "opacity,transform",
            },
          );
      };
      if (RM) {
        tx.textContent = PROMPT;
        body.querySelector(".gl-cur").remove();
        LINES.forEach(([c, h]) => add(c, h));
        return;
      }
      for (let i = 2; i <= PROMPT.length + 1; i += 2)
        later(0.5 + i * 0.022, () => (tx.textContent = PROMPT.slice(0, i)));
      let d = 0.5 + PROMPT.length * 0.022 + 0.5;
      later(d, () => body.querySelector(".gl-cur")?.remove());
      LINES.forEach(([c, h], k) => {
        d += k < 2 ? 0.7 : 0.55;
        later(d, () => add(c, h));
      });
    }
    $(".gl-term__re").addEventListener("click", install);

    if (RM) tl.progress(0.52).pause();
    else tl.play(0);
    sync();
    install();
    return {
      dispose: () => {
        ro.disconnect();
        tl.kill();
        calls.forEach((c) => c.kill());
      },
      install: () => {
        $(".gl-term").scrollIntoView({
          block: "nearest",
          behavior: RM ? "auto" : "smooth",
        });
        install();
      },
      focus: (p) => {
        const el = part(p);
        if (!el) return;
        box.scrollIntoView({
          block: "nearest",
          behavior: RM ? "auto" : "smooth",
        });
        gsap.fromTo(
          el,
          { scale: 1 },
          {
            scale: 1.06,
            duration: 0.25,
            yoyo: true,
            repeat: 3,
            ease: "power2.out",
            clearProps: "transform",
          },
        );
      },
    };
  }

  window.Glorious = { mount };
})();
