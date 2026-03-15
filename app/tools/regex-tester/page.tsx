"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

export default function RegexTesterTool() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testText, setTestText] = useState("");
  const [error, setError] = useState("");

  let matches: RegExpMatchArray[] = [];
  let highlightedText = testText;

  try {
    if (pattern) {
      const regex = new RegExp(pattern, flags);
      matches = [...testText.matchAll(regex)];
      if (matches.length > 0) {
        // Build highlighted version
        let result = "";
        let lastIndex = 0;
        for (const match of matches) {
          const start = match.index!;
          result += testText.slice(lastIndex, start);
          result += `【${match[0]}】`;
          lastIndex = start + match[0].length;
        }
        result += testText.slice(lastIndex);
        highlightedText = result;
      }
    }
    setError && error && setError("");
  } catch (e) {
    if (!error) setError((e as Error).message);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">正規表現テスター</h1>
      <p className="text-gray-500 text-sm mb-6">
        正規表現パターンをリアルタイムでテスト。マッチ結果をハイライト表示。
      </p>

      <AdBanner />

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">正規表現パターン</label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => { setPattern(e.target.value); setError(""); }}
              placeholder="例: \\d{3}-\\d{4}"
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-24">
            <label className="text-sm font-medium text-gray-700 mb-1 block">フラグ</label>
            <input
              type="text"
              value={flags}
              onChange={(e) => { setFlags(e.target.value); setError(""); }}
              placeholder="g"
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">テスト文字列</label>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="テスト用の文字列を入力..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-gray-700">マッチ結果</span>
            <span className="text-xs text-blue-600 font-medium">{matches.length}件のマッチ</span>
          </div>
          <pre className="font-mono text-sm text-gray-800 whitespace-pre-wrap break-all">
            {highlightedText || "（テスト文字列を入力してください）"}
          </pre>
        </div>

        {matches.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <span className="text-sm font-bold text-gray-700 block mb-2">マッチ一覧</span>
            <div className="space-y-1">
              {matches.slice(0, 20).map((m, i) => (
                <div key={i} className="flex gap-3 text-xs font-mono">
                  <span className="text-gray-400 w-8">#{i + 1}</span>
                  <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{m[0]}</span>
                  <span className="text-gray-400">位置: {m.index}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AdBanner />

      <ToolFAQ
        faqs={[
          {
            question: "正規表現のフラグとは何ですか？",
            answer: "フラグは正規表現の動作を制御するオプションです。g（グローバル：全てのマッチ）、i（大文字小文字を区別しない）、m（複数行モード）、s（ドットが改行にもマッチ）などがあります。",
          },
          {
            question: "よく使う正規表現パターンは？",
            answer: "メールアドレス: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}、電話番号: \\d{2,4}-\\d{2,4}-\\d{4}、郵便番号: \\d{3}-\\d{4} などがよく使われます。",
          },
          {
            question: "【】で囲まれている部分は何ですか？",
            answer: "正規表現にマッチした部分を【】で囲んで表示しています。これにより、テスト文字列のどの部分がパターンにマッチしたかが一目でわかります。",
          },
        ]}
      />

      <RelatedTools currentToolId="regex-tester" />
    </div>
  );
}
