"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

const limits = [
  { name: "X（Twitter）", max: 140, note: "全角基準" },
  { name: "Instagram", max: 2200, note: "キャプション" },
  { name: "YouTube タイトル", max: 100, note: "" },
  { name: "YouTube 説明", max: 5000, note: "" },
  { name: "LINE 一言", max: 500, note: "ステータスメッセージ" },
  { name: "メタディスクリプション", max: 120, note: "SEO推奨" },
];

export default function WordCounterTool() {
  const [text, setText] = useState("");
  const charCount = [...text].length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">SNS文字数チェッカー</h1>
      <p className="text-gray-500 text-sm mb-6">
        Twitter、Instagram、YouTube等の文字数制限をリアルタイムでチェック。
      </p>

      <AdBanner />

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">テキスト入力</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="投稿テキストを入力..."
            className="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-right text-sm text-gray-500 mt-1">{charCount} 文字</p>
        </div>

        <div className="space-y-2">
          {limits.map((limit) => {
            const pct = Math.min((charCount / limit.max) * 100, 100);
            const over = charCount > limit.max;
            return (
              <div key={limit.name} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800">{limit.name}</span>
                    {limit.note && <span className="text-xs text-gray-400">({limit.note})</span>}
                  </div>
                  <span className={`text-sm font-mono font-bold ${over ? "text-red-600" : "text-green-600"}`}>
                    {charCount} / {limit.max}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${over ? "bg-red-500" : pct > 80 ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {over && (
                  <p className="text-xs text-red-500 mt-1">{charCount - limit.max}文字オーバーしています</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <AdBanner />

      <ToolFAQ
        faqs={[
          {
            question: "Twitterの文字数制限は何文字ですか？",
            answer: "X（旧Twitter）は全角文字で140文字（半角280文字）が上限です。このツールでは全角基準の140文字でチェックしています。",
          },
          {
            question: "Instagramのキャプションの文字数制限は？",
            answer: "Instagramの投稿キャプションは最大2,200文字までです。ただし、フィード上では125文字以降が折りたたまれるため、重要な内容は先頭に配置することをお勧めします。",
          },
          {
            question: "メタディスクリプションの推奨文字数は？",
            answer: "SEOにおけるメタディスクリプションの推奨文字数は120文字程度です。Googleの検索結果で表示される文字数がおよそ120文字のため、この範囲に収めると効果的です。",
          },
        ]}
      />

      <RelatedTools currentToolId="word-counter" />
    </div>
  );
}
