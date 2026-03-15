"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

export default function CharCounter() {
  const [text, setText] = useState("");

  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, "").length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split("\n").length : 0;
  const bytes = new Blob([text]).size;
  const fullWidth = (text.match(/[^\x00-\x7F]/g) || []).length;
  const halfWidth = chars - fullWidth;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">文字数カウンター</h1>
      <p className="text-gray-500 text-sm mb-6">
        テキストの文字数・単語数・行数をリアルタイムでカウントします。
      </p>

      <AdBanner />

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="ここにテキストを入力またはペーストしてください..."
        className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
        {[
          { label: "文字数", value: chars },
          { label: "文字数（空白除く）", value: charsNoSpace },
          { label: "単語数", value: words },
          { label: "行数", value: lines },
          { label: "バイト数", value: bytes },
          { label: "全角", value: fullWidth },
          { label: "半角", value: halfWidth },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{item.value.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">{item.label}</div>
          </div>
        ))}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">文字数カウンターの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          テキストエリアに文字を入力またはペーストすると、文字数・単語数・行数・バイト数がリアルタイムで表示されます。
          全角・半角の文字数も区別して表示します。TwitterやInstagramの文字数制限の確認、レポートの文字数チェックなどにご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "全角と半角の違いは何ですか？",
            answer: "全角文字は日本語の漢字・ひらがな・カタカナなどで、1文字あたり2〜3バイトを使用します。半角文字は英数字や一部の記号で、1バイトで表現されます。",
          },
          {
            question: "Twitterの文字数制限は何文字ですか？",
            answer: "Twitter（X）の投稿は全角・半角問わず280文字までです。日本語の場合、全角1文字は2文字としてカウントされるため、実質140文字程度になります。",
          },
          {
            question: "入力したデータはサーバーに送信されますか？",
            answer: "いいえ。このツールは全てブラウザ上で動作するため、入力したテキストがサーバーに送信されることは一切ありません。安心してご利用ください。",
          },
          {
            question: "バイト数とは何ですか？",
            answer: "バイト数はテキストのデータサイズです。UTF-8エンコーディングでは、半角英数字は1バイト、日本語は3バイトを使用します。メール添付やデータベースの容量確認に便利です。",
          },
        ]}
      />

      <RelatedTools currentToolId="char-counter" />
    </div>
  );
}
