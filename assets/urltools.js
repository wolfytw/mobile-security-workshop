// 網址拆解：找出「真正的家」（可註冊網域）
// 注意：這是教學用的簡化版公共後綴清單，涵蓋台灣與常見國家的兩層結尾。
(function () {
  const MULTI_SUFFIX = new Set([
    // 台灣
    "com.tw", "org.tw", "gov.tw", "edu.tw", "net.tw", "idv.tw", "mil.tw", "game.tw", "ebiz.tw", "club.tw",
    // 日本
    "co.jp", "ne.jp", "or.jp", "ac.jp", "go.jp", "ed.jp", "gr.jp",
    // 英國
    "co.uk", "org.uk", "ac.uk", "gov.uk", "me.uk", "ltd.uk", "plc.uk",
    // 中國、香港、澳門
    "com.cn", "net.cn", "org.cn", "gov.cn", "edu.cn", "com.hk", "org.hk", "gov.hk", "edu.hk", "net.hk", "com.mo",
    // 東南亞、澳洲、韓國、其他
    "com.sg", "gov.sg", "edu.sg", "com.my", "gov.my", "com.ph", "gov.ph", "com.vn", "com.kh", "com.au", "net.au",
    "org.au", "gov.au", "edu.au", "co.kr", "or.kr", "go.kr", "co.nz", "co.th", "go.th", "co.id", "com.br", "com.mx",
    "co.in", "gov.in",
  ]);

  // 常見短網址服務
  const SHORTENERS = new Set([
    "bit.ly", "reurl.cc", "tinyurl.com", "t.co", "lihi.cc", "lihi1.cc", "lihi2.cc", "ppt.cc", "goo.gl", "is.gd",
    "shorturl.at", "pse.is", "rb.gy", "cutt.ly", "ow.ly", "s.id", "t.ly", "x.gd", "lin.ee", "forms.gle", "maps.app.goo.gl",
  ]);

  // 已知官方網域（只代表網域屬於該單位，不代表內容一定安全）
  const OFFICIAL = {
    "cathaybk.com.tw": "國泰世華銀行",
    "post.gov.tw": "中華郵政",
    "npa.gov.tw": "內政部警政署（165 反詐騙在 165.npa.gov.tw）",
    "www.gov.tw": "我的 E 政府",
    "nat.gov.tw": "財政部電子申報繳稅服務（etax.nat.gov.tw）",
    "google.com": "Google",
    "apple.com": "Apple",
    "microsoft.com": "Microsoft",
    "line.me": "LINE",
    "momoshop.com.tw": "momo 購物網",
    "shopee.tw": "蝦皮購物",
    "pchome.com.tw": "PChome",
    "ctbcbank.com": "中國信託銀行",
    "esunbank.com": "玉山銀行",
    "taipeifubon.com.tw": "台北富邦銀行",
    "openai.com": "OpenAI",
    "chatgpt.com": "ChatGPT",
    "youtube.com": "YouTube",
    "googleusercontent.com": "Google",
    "facebook.com": "Facebook",
    "instagram.com": "Instagram",
    "paypal.com": "PayPal",
    "netflix.com": "Netflix",
    "icloud.com": "Apple iCloud",
  };

  // 釣魚常冒用的品牌關鍵字
  const BRANDS = ["cathaybk", "cathay", "google", "apple", "icloud", "microsoft", "line", "momo", "momoshop", "shopee",
    "post", "ctbc", "esun", "fubon", "pchome", "paypal", "netflix", "facebook", "instagram", "chatgpt", "openai", "etax", "gov"];

  function normalize(input) {
    let s = String(input || "").trim();
    if (!s) return null;
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(s)) s = "https://" + s;
    try { return new URL(s); } catch (e) { return null; }
  }

  function isIP(host) {
    return /^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith("[");
  }

  function split(host) {
    const labels = host.replace(/\.$/, "").split(".");
    if (labels.length < 2 || isIP(host)) return { sub: "", domain: host, suffix: "" };
    const last2 = labels.slice(-2).join(".");
    const n = MULTI_SUFFIX.has(last2) && labels.length >= 3 ? 3 : 2;
    const domain = labels.slice(-n).join(".");
    const sub = labels.slice(0, -n).join(".");
    const suffix = n === 3 ? last2 : labels[labels.length - 1];
    return { sub, domain, suffix };
  }

  function analyze(input) {
    const raw = String(input || "").trim();
    const u = normalize(raw);
    if (!u) return { error: "這看起來不是一個網址，請再檢查一次。" };
    const host = u.hostname.toLowerCase();
    const parts = split(host);
    const warnings = [];
    const notes = [];

    if (u.username || u.password || /^[a-z]+:\/\/[^/]*@/i.test(raw)) {
      warnings.push("網址裡有「@」：瀏覽器會忽略 @ 前面的字，真正連去的是 @ 後面的 " + host + "。這是常見的偽裝手法。");
    }
    if (isIP(host)) warnings.push("網址直接用 IP 位址，不是一般網站會用的名稱，要特別小心。");
    if (host.split(".").some(l => l.startsWith("xn--"))) {
      warnings.push("網址含有特殊字元（xn-- 開頭），可能是用長得很像的外國字母假冒知名網站。");
    }
    if (SHORTENERS.has(host) || SHORTENERS.has(parts.domain)) {
      warnings.push("這是短網址服務（" + parts.domain + "），看不出真正會連去哪裡。先別點，用官方管道確認。");
    }
    // 品牌名出現在子網域或路徑，但主網域不是該品牌
    const outsideTokens = (parts.sub + " " + u.pathname + " " + u.search).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const domainLow = parts.domain.toLowerCase();
    const hit = BRANDS.find(b => outsideTokens.includes(b) && !domainLow.includes(b));
    if (hit && !OFFICIAL[parts.domain]) {
      warnings.push("「" + hit + "」出現在子網域或路徑裡，但真正的家是 " + parts.domain + "。駭客最愛把真品牌名放在前面當偽裝。");
    }
    // 主網域「像」某個品牌但不是官方網域（rn→m、0→o、1→l、多了 -secure 之類的字）
    if (!OFFICIAL[parts.domain] && !isIP(host)) {
      const name = domainLow.split(".")[0];
      const look = name.replace(/rn/g, "m").replace(/0/g, "o").replace(/1/g, "l").replace(/vv/g, "w");
      const long = BRANDS.filter(b => b.length >= 5);
      const close = long.find(b => look !== name && (look === b || look.startsWith(b) || look.split("-").includes(b)));
      const twin = name.length >= 5 && Object.keys(OFFICIAL).find(d => d.split(".")[0] === name && d !== domainLow);
      if (twin) {
        warnings.push("主網域 " + parts.domain + " 名字跟品牌一樣，但結尾不同。官方網域是 " + twin + "，結尾不對就不是同一個家。");
      } else if (close) {
        warnings.push("主網域 " + parts.domain + " 用了長得很像的字元（例如 rn 假裝 m、0 假裝 o），看起來像「" + close + "」但不是。");
      } else if (long.some(b => name !== b && (name.startsWith(b) || name.split("-").includes(b)))) {
        warnings.push("主網域 " + parts.domain + " 裡有品牌名，但多了其他字（例如 -secure、-login），不是該品牌的官方網域。");
      }
    }
    if (u.protocol === "http:") notes.push("開頭是 http:// 沒有加密，輸入的資料可能被旁人看到。");
    if (u.protocol === "https:") notes.push("有 https（鎖頭）只代表連線有加密，不能用來判斷網站真假。");
    if (parts.suffix.includes(".")) notes.push("「." + parts.suffix + "」是一組結尾，所以主網域要再往左一格：" + parts.domain + "。");
    if (OFFICIAL[parts.domain]) notes.push(parts.domain + " 是「" + OFFICIAL[parts.domain] + "」的官方網域。網域對了，仍要看內容是否合理。");

    return { url: u, raw, host, parts, warnings, notes };
  }

  window.UrlTools = { analyze, split, OFFICIAL };
})();
