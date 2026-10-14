// 共用小工具
(function () {
  const COURSE = "手機資安防護、瀏覽器與 AI 安全操作";

  // 在每頁頂端放「回首頁」列；首頁不放
  function topbar() {
    if (document.body.dataset.home === "1") return;
    const bar = document.createElement("div");
    bar.className = "topbar";
    bar.innerHTML =
      '<div class="wrap"><a class="home" href="index.html">← 課程首頁</a>' +
      '<span class="crumb">' + COURSE + "</span></div>";
    document.body.prepend(bar);
  }

  function footer() {
    const f = document.createElement("footer");
    f.className = "site";
    f.textContent = COURSE + " · 課堂互動練習";
    document.body.append(f);
  }

  // 依頁面設定單元色
  function unitColor() {
    const u = document.body.dataset.unit;
    if (u) document.documentElement.style.setProperty("--accent", "var(--u" + u + ")");
  }

  // 網址加 ?present=1 進入投影放大模式
  function presentMode() {
    if (new URLSearchParams(location.search).get("present") === "1") {
      document.body.classList.add("present");
    }
  }

  window.App = {
    el(tag, attrs, ...kids) {
      const n = document.createElement(tag);
      for (const [k, v] of Object.entries(attrs || {})) {
        if (k === "class") n.className = v;
        else if (k === "html") n.innerHTML = v;
        else if (k.startsWith("on")) n.addEventListener(k.slice(2), v);
        else if (v !== false && v != null) n.setAttribute(k, v);
      }
      for (const kid of kids.flat()) {
        if (kid == null || kid === false) continue;
        n.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
      }
      return n;
    },
    shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    // 瀏覽器儲存可能被封鎖（無痕模式等），一律包 try/catch
    load(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v == null ? fallback : JSON.parse(v);
      } catch (e) { return fallback; }
    },
    save(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* 忽略 */ }
    },
    escape(s) {
      return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    },
  };

  document.addEventListener("DOMContentLoaded", () => {
    unitColor();
    presentMode();
    topbar();
    footer();
  });
})();
