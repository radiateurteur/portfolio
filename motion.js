/* ═══════════════════════════════════════════════════════════
   Motion pieces — coded, not rendered video.
   Each piece draws into a 960 × 540 stage and returns a looping GSAP timeline.
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";
  const W = 960,
    H = 540;
  const TAG = "Claude Fable 5.2 · GSAP";
  const bot = (w, fill = "#d97757") =>
    `<svg width="${w}" viewBox="-1 -3 16 13" shape-rendering="crispEdges" aria-hidden="true"><g fill="${fill}"><rect x="2" y="0" width="10" height="7"/><rect x="0" y="3" width="14" height="2"/><rect x="2" y="7" width="1" height="2"/><rect x="4" y="7" width="1" height="2"/><rect x="9" y="7" width="1" height="2"/><rect x="11" y="7" width="1" height="2"/></g><rect x="4" y="2" width="1" height="2" fill="#24130d"/><rect x="9" y="2" width="1" height="2" fill="#24130d"/></svg>`;
  const head = (k, t) =>
    `<div class="mo-head"><span class="mo-k">${k}</span><h4>${t}</h4></div>`;
  const rad = (a) => (a * Math.PI) / 180;

  const pieces = [
    /* ── 1 · Signal radar ── */
    {
      id: "radar",
      title: "Signal radar",
      desc: "Accounts light up as buying signals arrive.",
      tag: TAG,
      theme: "dark",
      poster: 0.46,
      build(st, tl) {
        const cx = 650,
          cy = 285,
          R = 205,
          T = 5;
        const blips = [
          [38, 150, "Northwind", "new VP Sales"],
          [92, 96, "Brightwave", "3 sales roles open"],
          [148, 168, "Halloway", "pricing page, twice"],
          [205, 112, "Orbit Labs", "champion moved"],
          [262, 160, "Tallyboard", "funding round"],
          [318, 118, "Kestrel", "competitor post"],
        ];
        st.innerHTML =
          head("Signal radar", "Accounts light up<br>as signals arrive.") +
          `<div class="mo-count"><b>0</b><span>signals<br>this morning</span></div>
           <div class="ra" style="left:${cx - R}px;top:${cy - R}px;width:${2 * R}px;height:${2 * R}px"><i class="ra-r" style="inset:0"></i><i class="ra-r" style="inset:17%"></i><i class="ra-r" style="inset:34%"></i><i class="ra-x"></i><i class="ra-y"></i><div class="ra-sweep"></div><i class="ra-c"></i></div>` +
          blips
            .map(([a, r, n, s]) => {
              const x = cx + r * Math.sin(rad(a)),
                y = cy - r * Math.cos(rad(a));
              return `<div class="ra-b" style="left:${x}px;top:${y}px"><i class="ping"></i><i class="dot"></i><span class="${x > cx ? "r" : "l"}"><b>${n}</b>${s}</span></div>`;
            })
            .join("");
        const q = (s) => st.querySelectorAll(s),
          count = q(".mo-count b")[0];
        tl.fromTo(
          q(".ra-sweep"),
          { rotation: 0 },
          { rotation: 720, duration: 2 * T, ease: "none" },
          0,
        );
        tl.set(count, { innerText: "0" }, 0);
        blips.forEach(([a], i) => {
          const t = (a / 360) * T,
            b = q(".ra-b")[i];
          tl.fromTo(
            b.querySelector(".dot"),
            { scale: 0 },
            { scale: 1, duration: 0.4, ease: "back.out(3)" },
            t,
          );
          tl.fromTo(
            b.querySelector("span"),
            {
              opacity: 0,
              x: b.querySelector("span").className === "r" ? -10 : 10,
            },
            { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" },
            t + 0.08,
          );
          tl.set(count, { innerText: String(i + 1) }, t);
          tl.fromTo(count, { scale: 1.25 }, { scale: 1, duration: 0.3 }, t);
          [t, t + T].forEach((tt) =>
            tl.fromTo(
              b.querySelector(".ping"),
              { scale: 0.3, opacity: 0.9 },
              { scale: 3.4, opacity: 0, duration: 1.2, ease: "power2.out" },
              tt,
            ),
          );
        });
      },
    },

    /* ── 2 · Job post decoder ── */
    {
      id: "decoder",
      title: "Job post decoder",
      desc: "A job ad turns into three buying signals.",
      tag: TAG,
      theme: "light",
      poster: 0.8,
      build(st, tl) {
        const lines = [
          "Join a fast-growing sales team expanding across EMEA.",
          "You report to the <b>CRO</b> and own a <b>dedicated budget</b>.",
          "Current stack: a <b>CRM</b>, a <b>sequencer</b>, a <b>data tool</b>.",
          "One of <b>3 sales hires</b> opening this month.",
        ];
        const sig = [
          ["Budget", "Approved for a senior hire", "#2fb67c"],
          ["Stack", "Tools about to be challenged", "#3da5bb"],
          ["Scale", "The team is being built now", "#e9a23b"],
        ];
        st.innerHTML =
          head("Job post decoder", "Every line is a signal.") +
          `<div class="jd"><div class="jd-h"><i>N</i><div><b>Senior Sales Engineer</b><small>NovaTech · Lyon, France · posted today</small></div></div>${lines.map((l) => `<p>${l}</p>`).join("")}<div class="jd-scan"></div></div>` +
          sig
            .map(
              ([k, v, c], i) =>
                `<div class="jd-arrow" style="top:${262 + i * 66}px"></div><div class="jd-sig" style="top:${232 + i * 66}px;--c:${c}"><small>${k}</small><b>${v}</b></div>`,
            )
            .join("") +
          `<div class="jd-sum">1 job post <span>→</span> 3 buying signals</div>`;
        const q = (s) => st.querySelectorAll(s),
          ps = q(".jd p");
        tl.fromTo(
          q(".jd"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0.1,
        );
        tl.fromTo(
          q(".jd-scan"),
          { top: 84, opacity: 0 },
          { top: 330, opacity: 1, duration: 3.6, ease: "none" },
          0.9,
        );
        tl.to(q(".jd-scan"), { opacity: 0, duration: 0.3 }, 4.4);
        sig.forEach(([, , c], i) => {
          const t = 1.9 + i * 0.95;
          tl.fromTo(
            ps[i + 1],
            {
              backgroundColor: "rgba(0,0,0,0)",
              boxShadow: "inset 0 0 0 0 " + c,
            },
            {
              backgroundColor: c + "24",
              boxShadow: "inset 3px 0 0 0 " + c,
              duration: 0.35,
            },
            t,
          );
          tl.fromTo(
            q(".jd-arrow")[i],
            { scaleX: 0, opacity: 1 },
            { scaleX: 1, duration: 0.35, ease: "power2.out" },
            t + 0.1,
          );
          tl.fromTo(
            q(".jd-sig")[i],
            { opacity: 0, x: -34, scale: 0.94 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.55,
              ease: "back.out(1.8)",
            },
            t + 0.25,
          );
        });
        tl.fromTo(
          q(".jd-sum"),
          { opacity: 0, y: 14, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "back.out(2)" },
          5.2,
        );
        tl.to({}, { duration: 2.6 });
      },
    },

    /* ── 3 · Agent orchestra ── */
    {
      id: "orchestra",
      title: "Agent orchestra",
      desc: "Claude Code agents working in parallel.",
      tag: TAG,
      theme: "dark",
      poster: 0.5,
      build(st, tl) {
        const ag = [
          ["Jinx", "sketching 3 concepts", "rendering the visual", 3.4],
          ["Captain Jack", "reviewing the change", "redeploying", 4.6],
          ["Cargo", "gathering the facts", "scoring accounts", 3.9],
          ["Inbound router", "scoring a sign-up", "alerting sales", 2.8],
          [
            "Mr. New Vegas",
            "collecting shipped work",
            "drafting the story",
            4.2,
          ],
        ];
        st.innerHTML =
          head("Agent orchestra", "Five agents, one morning.") +
          `<div class="or">${ag.map(([n, a, b]) => `<div class="or-l"><span class="or-m">${bot(38)}</span><b>${n}</b><span class="or-t"><i>${a}</i><i>${b}</i></span><span class="or-bar"><i></i></span><span class="or-ok">✓</span></div>`).join("")}</div><div class="or-f">5 agents in parallel <span>·</span> every output checked by a human</div>`;
        const q = (s) => st.querySelectorAll(s);
        tl.fromTo(
          q(".or-l"),
          { opacity: 0, x: -26 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.09,
            ease: "power3.out",
          },
          0.1,
        );
        ag.forEach(([, , , d], i) => {
          const l = q(".or-l")[i],
            t0 = 0.7 + i * 0.3,
            bar = l.querySelector(".or-bar i"),
            ts = l.querySelectorAll(".or-t i"),
            m = l.querySelector(".or-m");
          tl.fromTo(
            bar,
            { width: "0%", backgroundColor: "#d97757" },
            { width: "100%", duration: d, ease: "power1.inOut" },
            t0,
          );
          tl.fromTo(
            m,
            { y: 0 },
            {
              y: -3,
              duration: 0.18,
              yoyo: true,
              repeat: Math.round(d / 0.18) - 1,
              ease: "steps(1)",
            },
            t0,
          );
          tl.fromTo(
            ts[0],
            { opacity: 1, y: 0 },
            { opacity: 0, y: -8, duration: 0.3 },
            t0 + d * 0.5,
          );
          tl.fromTo(
            ts[1],
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.3 },
            t0 + d * 0.5 + 0.1,
          );
          tl.to(bar, { backgroundColor: "#2fb67c", duration: 0.25 }, t0 + d);
          tl.fromTo(
            l.querySelector(".or-ok"),
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(3)" },
            t0 + d,
          );
          tl.to(
            m,
            {
              y: -12,
              duration: 0.2,
              yoyo: true,
              repeat: 3,
              ease: "power2.out",
            },
            t0 + d + 0.05,
          );
        });
        tl.fromTo(
          q(".or-f"),
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6 },
          6.6,
        );
        tl.to({}, { duration: 2.4 });
      },
    },

    /* ── 4 · Pipeline counter ── */
    {
      id: "counter",
      title: "Pipeline counter",
      desc: "A whole market, scored and tiered.",
      tag: TAG,
      theme: "light",
      poster: 0.75,
      build(st, tl) {
        const seg = [
          ["Gold", "call first", 15, "linear-gradient(180deg,#f6d27a,#e2a93a)"],
          ["Silver", "sequence", 27, "linear-gradient(180deg,#e9eef1,#b9c6cd)"],
          ["Bronze", "nurture", 31, "linear-gradient(180deg,#e7b08b,#c77d4f)"],
          [
            "Excluded",
            "reason kept",
            27,
            "repeating-linear-gradient(135deg,#f3d6d2 0 6px,#f8e6e3 6px 12px)",
          ],
        ];
        st.innerHTML =
          head("Pipeline counter", "A whole market,<br>scored and tiered.") +
          `<div class="pc"><b class="pc-n">0</b><span class="pc-l">accounts scored</span></div>
           <div class="pc-bar">${seg.map(([, , w, bg]) => `<i style="background:${bg};--w:${w}%"></i>`).join("")}</div>
           <div class="pc-lab">${seg.map(([n, s, w]) => `<span style="width:${w}%"><b>${n}</b>${s}</span>`).join("")}</div>
           <div class="pc-chips"><span>7 weighted axes</span><span>6 knock-out gates</span><span>1 field in the CRM</span></div>`;
        const q = (s) => st.querySelectorAll(s),
          num = q(".pc-n")[0],
          o = { v: 0 };
        tl.fromTo(
          o,
          { v: 0 },
          {
            v: 8000,
            duration: 3.4,
            ease: "power4.out",
            onUpdate: () =>
              (num.textContent = Math.round(o.v).toLocaleString("en-US")),
          },
          0.3,
        );
        tl.fromTo(
          num,
          { scale: 0.86, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.6)" },
          0.3,
        );
        tl.fromTo(
          num,
          { scale: 1 },
          {
            scale: 1.05,
            duration: 0.16,
            yoyo: true,
            repeat: 1,
            ease: "power2.out",
          },
          3.5,
        );
        seg.forEach(([, , w], i) => {
          tl.fromTo(
            q(".pc-bar i")[i],
            { width: "0%" },
            { width: w + "%", duration: 0.7, ease: "power3.out" },
            3.9 + i * 0.32,
          );
          tl.fromTo(
            q(".pc-lab span")[i],
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.4 },
            4.1 + i * 0.32,
          );
        });
        tl.fromTo(
          q(".pc-chips span"),
          { opacity: 0, y: 14, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.14,
            ease: "back.out(2)",
          },
          5.7,
        );
        tl.to({}, { duration: 2.6 });
      },
    },

    /* ── 5 · From signal to meeting ── */
    {
      id: "journey",
      title: "From signal to meeting",
      desc: "The journey of one lead.",
      tag: TAG,
      theme: "dark",
      poster: 0.72,
      build(st, tl) {
        const stops = [
          ["Signal", "job change spotted"],
          ["AI draft", "written for this signal"],
          ["A human approves", "one click"],
          ["Reply", "“Happy to chat.”"],
          ["Meeting booked", "deal created in the CRM"],
        ];
        const d =
          "M80 400 C 210 400, 230 250, 350 250 S 500 390, 620 350 S 770 190, 885 200";
        st.innerHTML =
          head("From signal to meeting", "The journey of one lead.") +
          `<svg class="jy" viewBox="0 0 ${W} ${H}"><path class="jy-bg" d="${d}"/><path class="jy-p" d="${d}"/></svg><i class="jy-dot"></i>` +
          stops
            .map(
              ([a, b]) =>
                `<div class="jy-s"><i></i><span><b>${a}</b>${b}</span></div>`,
            )
            .join("");
        const q = (s) => st.querySelectorAll(s),
          path = q(".jy-p")[0],
          len = path.getTotalLength(),
          dot = q(".jy-dot")[0],
          o = { p: 0 },
          D = 6.6;
        q(".jy-s").forEach((s, i) => {
          const pt = path.getPointAtLength((len * i) / (stops.length - 1));
          s.style.left = pt.x + "px";
          s.style.top = pt.y + "px";
          s.classList.add(i % 2 ? "dn" : "up", i === 0 ? "first" : i === stops.length - 1 ? "last" : "mid");
          const t = 0.5 + (D * i) / (stops.length - 1);
          tl.fromTo(
            s.querySelector("i"),
            {
              scale: 0.4,
              backgroundColor: "#0a2e38",
              borderColor: "rgba(255,255,255,.35)",
            },
            {
              scale: 1,
              backgroundColor: i === 4 ? "#2fb67c" : "#3da5bb",
              borderColor: "#fff",
              duration: 0.4,
              ease: "back.out(3)",
            },
            t,
          );
          tl.fromTo(
            s.querySelector("span"),
            { opacity: 0, y: i % 2 ? -10 : 10, scale: 0.94 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "back.out(1.7)",
            },
            t + 0.05,
          );
        });
        path.style.strokeDasharray = len;
        tl.fromTo(
          path,
          { strokeDashoffset: len },
          { strokeDashoffset: 0, duration: D, ease: "none" },
          0.5,
        );
        tl.fromTo(
          o,
          { p: 0 },
          {
            p: 1,
            duration: D,
            ease: "none",
            onUpdate: () => {
              const pt = path.getPointAtLength(len * o.p);
              dot.style.transform = `translate(${pt.x}px,${pt.y}px)`;
            },
          },
          0.5,
        );
        tl.fromTo(dot, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.4);
        tl.fromTo(
          q(".jy-s")[4].querySelector("span"),
          { boxShadow: "0 0 0 0 rgba(47,182,124,.7)" },
          {
            boxShadow: "0 0 0 16px rgba(47,182,124,0)",
            duration: 1,
            repeat: 1,
          },
          0.6 + D,
        );
        tl.to({}, { duration: 1.2 });
      },
    },

    /* ── 6 · Mailbox quest ── */
    {
      id: "quest",
      title: "Mailbox quest",
      desc: "Deliverability, turned into a level-up game.",
      tag: TAG,
      theme: "light",
      poster: 0.52,
      build(st, tl) {
        st.innerHTML =
          head("Mailbox quest", "Warm-up, as a game.") +
          `<div class="mq"><div class="mq-h"><div class="mq-lv"><small>LEVEL</small><b>2</b></div><div><b>Mailbox</b><span class="mq-rate"><i>Level 2 daily cap</i><i>Level 3: a higher daily cap</i></span></div></div>
             <div class="mq-q"><span class="mq-qt"><i>Quest: send 54 this week</i><i>New quest: send 80 this week</i></span><em>38 of 54</em></div><div class="mq-bar"><i></i></div><small class="mq-r">Reward: Level 3, a higher daily cap</small></div>
           <div class="mq-up">LEVEL UP!</div>` +
          Array.from(
            { length: 26 },
            (_, i) =>
              `<i class="mq-c" style="background:${["#3da5bb", "#d97757", "#e9a23b", "#2fb67c", "#0d3b47"][i % 5]}"></i>`,
          ).join("");
        const q = (s) => st.querySelectorAll(s),
          em = q(".mq-q em")[0],
          lv = q(".mq-lv b")[0],
          o = { v: 38 };
        tl.set(lv, { innerText: "2" }, 0);
        tl.fromTo(
          q(".mq"),
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          0.1,
        );
        tl.fromTo(
          q(".mq-bar i"),
          { width: "70%", backgroundColor: "#3da5bb" },
          { width: "100%", duration: 2.6, ease: "power2.inOut" },
          0.8,
        );
        tl.fromTo(
          o,
          { v: 38 },
          {
            v: 54,
            duration: 2.6,
            ease: "power2.inOut",
            onUpdate: () => (em.textContent = `${Math.round(o.v)} of 54`),
          },
          0.8,
        );
        tl.to(
          q(".mq-bar i"),
          { backgroundColor: "#2fb67c", duration: 0.2 },
          3.4,
        );
        tl.fromTo(
          q(".mq"),
          { scale: 1 },
          { scale: 1.035, duration: 0.18, yoyo: true, repeat: 1 },
          3.4,
        );
        tl.fromTo(
          q(".mq-up"),
          { scale: 0.2, opacity: 0, rotation: -8 },
          {
            scale: 1,
            opacity: 1,
            rotation: -4,
            duration: 0.6,
            ease: "back.out(2.6)",
          },
          3.5,
        );
        q(".mq-c").forEach((c, i) => {
          const a = rad(i * 13.85 * 4),
            r = 150 + ((i * 53) % 130);
          tl.fromTo(
            c,
            { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0 },
            {
              x: Math.cos(a) * r,
              y: Math.sin(a) * r * 0.75 + 60,
              opacity: 0,
              scale: 0.4,
              rotation: (i % 2 ? 1 : -1) * 260,
              duration: 1.5,
              ease: "power2.out",
            },
            3.5 + (i % 5) * 0.03,
          );
        });
        tl.to(
          q(".mq-lv"),
          { rotationX: 90, duration: 0.22, ease: "power2.in" },
          3.9,
        );
        tl.set(lv, { innerText: "3" }, 4.12);
        tl.to(
          q(".mq-lv"),
          { rotationX: 0, duration: 0.4, ease: "back.out(2.5)" },
          4.12,
        );
        [".mq-rate", ".mq-qt"].forEach((s, k) => {
          const [a, b] = q(s + " i");
          tl.fromTo(
            a,
            { opacity: 1, y: 0 },
            { opacity: 0, y: -10, duration: 0.3 },
            4.5 + k * 1.3,
          );
          tl.fromTo(
            b,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.35 },
            4.6 + k * 1.3,
          );
        });
        tl.to(q(".mq-up"), { opacity: 0, y: -20, duration: 0.4 }, 5.6);
        tl.to(
          q(".mq-bar i"),
          {
            width: "6%",
            backgroundColor: "#3da5bb",
            duration: 0.6,
            ease: "power3.inOut",
          },
          5.8,
        );
        tl.to(em, { opacity: 0, duration: 0.2 }, 5.8);
        tl.set(em, { innerText: "5 of 80" }, 6.0);
        tl.to(em, { opacity: 1, duration: 0.3 }, 6.0);
        tl.to({}, { duration: 2.4 });
        tl.set(em, { opacity: 1 }, 0);
      },
    },
  ];

  /** Mounts a piece into `box` (kept at 16:9) and returns { tl, destroy }. The timeline starts paused. */
  function mount(box, piece) {
    const st = document.createElement("div");
    st.className = "mo-stage mo-" + piece.theme + " mo--" + piece.id;
    box.classList.add("mo-box");
    box.appendChild(st);
    const tl = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.6 });
    piece.build(st, tl);
    const fit = () => (st.style.transform = `scale(${box.clientWidth / W})`);
    const ro = new ResizeObserver(() => requestAnimationFrame(fit));
    ro.observe(box);
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

  window.Motion = { pieces, mount };
})();
