# 手機資安防護、瀏覽器與 AI 安全操作：課堂互動網站

搭配一小時資安意識課程使用的互動練習。純 HTML／CSS／JavaScript，不需要伺服器，直接放在 GitHub Pages 就能用。學員用手機掃 QR Code 進入首頁即可參與。

## 內容

| 單元 | 頁面 | 類型 |
|---|---|---|
| 01 | `ai-sms.html` AI 釣魚簡訊拆解（三則範例，點選標出四個特徵） | 講師示範 |
| 01 | `ai-image.html` AI 假圖片（尾牙合照提示詞、找破綻、查證三步驟） | 講師示範 |
| 01 | `sms-vote.html` 訊息真假投票（4 則：2 真 2 假，1 則 AI 生成；`?present=1` 有揭曉按鈕與組別計分板） | 學員實作 |
| 02 | `url.html` 網址拆解器（由右往左標出主網域，支援 .com.tw 等兩段式結尾、@ 偽裝、短網址、相似字） | 講師示範 |
| 02 | `search-ad.html` 認出搜尋廣告（虛構銀行的搜尋結果示意，點選看拆解） | 講師示範 |
| 02 | `phish-quiz.html` 釣魚網址測驗（10 題） | 學員實作 |
| 03 | `qr.html` QR Code 掃碼演練（A 可疑／B 對照組，可自訂網址）＋ `gotcha.html` 演練落地頁 | 講師示範 |
| 03–07 | `checklist.html` 手機安全設定檢核清單（Wi-Fi、權限、AI 訓練開關、密碼與 MFA、165 與檢舉，iPhone／Android 切換） | 跟著做 |
| 05 | `datacards.html` 資料卡紅綠燈（8 張卡＋灰色地帶解說） | 學員實作 |
| 05 | `ai-verify.html` AI 會自信地答錯（請 AI 給參考連結並逐一查證，含示意備援） | 講師示範 |
| 06 | `second-channel.html` 第二管道演練（主管出題／員工確認流程） | 學員實作 |
| 07 | `scenarios.html` 情境桌遊（3 張情境卡＋停存改報參考答案） | 學員實作 |
| 08 | `final-quiz.html` 總測驗 10 題、`cheatsheet.html` 十條守則小抄（可列印） | 學員實作 |

## 網站以外的教材

- 總測驗 Kahoot 匯入檔（5 題）另外提供，不放在網站上。

## 使用方式

- 投影時在任一頁網址後面加 `?present=1`，字體會放大。
- `url.html?u=網址` 可以直接帶入要拆解的網址。
- 學員的打勾與作答只存在各自手機的瀏覽器裡，網站不收集任何資料。
- 要修改題目或情境卡，直接編輯對應 HTML 檔案裡 `<script>` 區塊開頭的資料陣列即可。

## 部署到 GitHub Pages

1. 把整個資料夾推到 GitHub repo。
2. 到 repo 的 **Settings → Pages**，Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾選 `/ (root)`，按 Save。
3. 約一分鐘後網址會出現在同一頁，格式是 `https://<帳號>.github.io/<repo 名稱>/`。

## 授權

- 課程內容與程式碼：講師田振嘉（Wolfy Tien）。
- `vendor/qrcode.js`：QR Code Generator for JavaScript，Copyright (c) 2009 Kazuhiko Arase，MIT License。
