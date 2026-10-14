// 一題一題作答的小測驗引擎（phish-quiz、final-quiz 共用）
// 題目格式：{ q, code?, options: [..], answer: 索引, explain, url? }
(function () {
  const css = `
  .qz-meta { display:flex; justify-content:space-between; color:var(--muted); font-size:14px; margin-bottom:8px; }
  .qz-q { font-size: 20px; font-weight: 700; margin: 6px 0 10px; }
  .qz-code { font-family: var(--mono); font-size: clamp(16px,4.4vw,22px); word-break: break-all; background: var(--bg-2);
    border:1.5px solid var(--line); border-radius:12px; padding:12px 14px; margin: 6px 0 14px; }
  .qz-opts { display:grid; gap:10px; }
  .qz-opts button { text-align:left; justify-content:flex-start; min-height:54px; font-weight:600; }
  .qz-opts button.right { border-color: var(--ok); background: rgba(52,211,153,.15); }
  .qz-opts button.wrong { border-color: var(--bad); background: rgba(248,113,113,.15); }
  .qz-fb { margin-top: 14px; }
  .qz-dom { color: var(--ok); font-weight: 800; } .qz-sub { color: var(--bad); }
  .qz-score { font-size: 56px; font-weight: 900; color: var(--accent); line-height: 1; }
  `;
  function mount(host, questions, opts) {
    opts = opts || {};
    const st = document.createElement("style"); st.textContent = css; document.head.append(st);
    const el = App.el;
    let order = opts.shuffle ? App.shuffle(questions) : questions.slice();
    let i = 0, score = 0, wrong = [];

    function breakdown(url) {
      if (!window.UrlTools) return null;
      const r = UrlTools.analyze(url);
      if (r.error) return null;
      return el("div", { class: "small muted", style: "margin-top:8px" },
        "由右往左讀：", r.parts.sub ? el("span", { class: "qz-sub mono" }, r.parts.sub + ".") : "",
        el("span", { class: "qz-dom mono" }, r.parts.domain), " ← 真正的家");
    }

    function show() {
      host.innerHTML = "";
      if (i >= order.length) return finish();
      const q = order[i];
      host.append(el("div", { class: "qz-meta" }, el("span", {}, "第 " + (i + 1) + " / " + order.length + " 題"), el("span", {}, "答對 " + score)));
      const bar = el("div", { class: "progress" }, el("div", { style: "width:" + (i / order.length * 100) + "%" }));
      host.append(bar);
      const card = el("div", { class: "card" });
      card.append(el("div", { class: "qz-q" }, q.q));
      if (q.code) card.append(el("div", { class: "qz-code" }, q.code));
      const box = el("div", { class: "qz-opts" });
      const fb = el("div", { class: "qz-fb" });
      q.options.forEach((o, k) => {
        const b = el("button", { class: "btn", type: "button" }, o);
        b.addEventListener("click", () => {
          if (box.dataset.done) return;
          box.dataset.done = "1";
          const ok = k === q.answer;
          if (ok) score++; else wrong.push(q);
          [...box.children].forEach((x, j) => {
            x.disabled = j !== k && j !== q.answer;
            if (j === q.answer) x.classList.add("right");
            else if (j === k) x.classList.add("wrong");
          });
          fb.append(el("div", { class: "verdict " + (ok ? "ok" : "bad") }, ok ? "✅ 答對了！" : "❌ 再想想看"));
          fb.append(el("p", { style: "margin:6px 0" }, q.explain));
          if (q.url) { const d = breakdown(q.url); if (d) fb.append(d); }
          fb.append(el("div", { class: "row end", style: "margin-top:12px" },
            el("button", { class: "btn primary", type: "button", onclick: () => { i++; show(); window.scrollTo({ top: 0 }); } },
              i + 1 < order.length ? "下一題 →" : "看成績")));
        });
        box.append(b);
      });
      card.append(box, fb);
      host.append(card);
    }

    function finish() {
      const pct = Math.round(score / order.length * 100);
      const msg = pct === 100 ? "全對！你是今天的資安小隊長 🎉" : pct >= 70 ? "很不錯！把錯的那幾題再看一次。" : "沒關係，錯的地方就是今天最有價值的收穫。";
      host.append(el("div", { class: "card accent center" },
        el("div", { class: "muted" }, "你的成績"),
        el("div", { class: "qz-score" }, score + " / " + order.length),
        el("p", {}, msg)));
      if (opts.onFinish) opts.onFinish(score, order.length);
      if (wrong.length) {
        host.append(el("h2", {}, "複習答錯的題目"));
        for (const q of wrong) host.append(el("div", { class: "card" },
          el("b", {}, q.q), q.code ? el("div", { class: "qz-code", style: "margin:8px 0" }, q.code) : "",
          el("div", {}, "正解：", el("b", { class: "verdict ok" }, q.options[q.answer])),
          el("p", { class: "muted", style: "margin:6px 0 0" }, q.explain)));
      }
      host.append(el("div", { class: "row", style: "margin-top:12px" },
        el("button", { class: "btn primary", type: "button", onclick: () => { order = opts.shuffle ? App.shuffle(questions) : questions.slice(); i = 0; score = 0; wrong = []; show(); } }, "再做一次"),
        el("a", { class: "btn ghost", href: "index.html" }, "回課程首頁")));
    }
    show();
  }
  window.Quiz = { mount };
})();
