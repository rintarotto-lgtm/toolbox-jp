"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

const defaultHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
    }
    .card {
      background: rgba(255,255,255,0.15);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    }
    h1 { margin: 0 0 0.5rem; font-size: 1.8rem; }
    p { margin: 0; opacity: 0.9; }
    button {
      margin-top: 1rem;
      padding: 0.5rem 1.5rem;
      border: 2px solid #fff;
      background: transparent;
      color: #fff;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
    }
    button:hover { background: rgba(255,255,255,0.2); }
  </style>
</head>
<body>
  <div class="card">
    <h1>HTMLプレビュー</h1>
    <p>HTML・CSS・JSをリアルタイムで確認できます</p>
    <button onclick="alert('JavaScript も動作します！')">クリック</button>
  </div>
</body>
</html>`;

type ViewMode = "split" | "preview";

export default function HtmlPreview() {
  const [code, setCode] = useState(defaultHTML);
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  const srcdoc = useMemo(() => code, [code]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">HTMLプレビュー</h1>
      <p className="text-gray-500 text-sm mb-6">
        HTMLコードを入力すると、リアルタイムでプレビューが表示されます。CSS・JavaScriptもインラインで記述可能です。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("split")}
              className={`py-1.5 px-3 rounded-lg text-sm font-medium border transition-colors ${
                viewMode === "split"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              分割表示
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`py-1.5 px-3 rounded-lg text-sm font-medium border transition-colors ${
                viewMode === "preview"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              プレビューのみ
            </button>
          </div>
          <button
            onClick={() => setCode(defaultHTML)}
            className="py-1.5 px-3 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            リセット
          </button>
        </div>

        {/* Editor + Preview */}
        <div
          className={`${
            viewMode === "split" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : ""
          }`}
          style={{ minHeight: "500px" }}
        >
          {viewMode === "split" && (
            <div className="flex flex-col">
              <div className="text-xs font-medium text-gray-500 mb-1 px-1">
                HTML / CSS / JS
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-900 text-green-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ minHeight: "500px", tabSize: 2 }}
              />
            </div>
          )}

          <div className="flex flex-col">
            <div className="text-xs font-medium text-gray-500 mb-1 px-1">
              プレビュー
            </div>
            <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden bg-white">
              <iframe
                srcDoc={srcdoc}
                sandbox="allow-scripts"
                title="HTMLプレビュー"
                className="w-full h-full border-0"
                style={{ minHeight: "500px" }}
              />
            </div>
          </div>
        </div>
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">HTMLプレビューツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          左側のエディタにHTML・CSS・JavaScriptを記述すると、右側のプレビューにリアルタイムで結果が表示されます。
          「プレビューのみ」モードで全画面プレビューも可能。HTMLの学習、スニペットの動作確認、簡易プロトタイプの作成にご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "JavaScriptは動作しますか？",
            answer:
              "はい。インラインの&lt;script&gt;タグ内に記述したJavaScriptはプレビュー内で実行されます。sandbox属性によりallow-scriptsが許可されています。",
          },
          {
            question: "外部ライブラリ（CDN）は使えますか？",
            answer:
              "はい。&lt;script src=\"...\"&gt;や&lt;link rel=\"stylesheet\" href=\"...\"&gt;で外部CDNからライブラリを読み込むことができます。",
          },
          {
            question: "コードは保存されますか？",
            answer:
              "いいえ。このツールは全てブラウザ上で動作し、入力したコードはページを閉じると消えます。必要に応じてコピーして保存してください。",
          },
          {
            question: "セキュリティ上の問題はありますか？",
            answer:
              "プレビューはsandbox属性付きのiframeで表示されるため、メインページへの影響は制限されています。ただし、悪意のあるコードの実行にはご注意ください。",
          },
        ]}
      />

      <RelatedTools currentToolId="html-preview" />
    </div>
  );
}
