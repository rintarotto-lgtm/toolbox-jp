"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

const escapeMap: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
};
const unescapeMap: Record<string, string> = Object.fromEntries(
  Object.entries(escapeMap).map(([k, v]) => [v, k])
);

export default function HtmlEscapeTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"escape" | "unescape">("escape");

  const convert = (text: string, m: "escape" | "unescape") => {
    setInput(text);
    setMode(m);
    if (m === "escape") {
      setOutput(text.replace(/[&<>"']/g, (c) => escapeMap[c] || c));
    } else {
      setOutput(
        text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (c) => unescapeMap[c] || c)
      );
    }
  };

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">HTMLエスケープ/アンエスケープ</h1>
      <p className="text-gray-500 text-sm mb-6">
        HTML特殊文字をエスケープ・アンエスケープします。XSS対策にも。
      </p>

      <AdBanner />

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => convert(input, "escape")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "escape" ? "bg-blue-600 text-white" : "bg-white border border-gray-300"}`}
        >
          エスケープ
        </button>
        <button
          onClick={() => convert(input, "unescape")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "unescape" ? "bg-blue-600 text-white" : "bg-white border border-gray-300"}`}
        >
          アンエスケープ
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">入力</label>
          <textarea
            value={input}
            onChange={(e) => convert(e.target.value, mode)}
            placeholder={mode === "escape" ? '<div class="test">' : "&lt;div class=&quot;test&quot;&gt;"}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">出力</label>
            <button onClick={copy} disabled={!output} className="text-xs text-blue-600 hover:underline disabled:opacity-40">コピー</button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-32 p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-y"
          />
        </div>
      </div>

      <AdBanner />
      <ToolFAQ faqs={[
        { question: "HTMLエスケープとは何ですか？", answer: "HTMLエスケープとは、HTMLで特殊な意味を持つ文字（<, >, &, \", '）を文字参照（&lt;, &gt;など）に変換する処理です。Webページ上でHTMLタグをそのまま表示したい場合や、XSS（クロスサイトスクリプティング）対策に必須です。" },
        { question: "HTMLアンエスケープとは何ですか？", answer: "HTMLアンエスケープとは、&lt;や&amp;などの文字参照を元の文字（<, &）に戻す処理です。HTMLソースからプレーンテキストを取得したい場合や、エスケープ済みデータを復元する際に使用します。" },
        { question: "XSS対策にHTMLエスケープが必要な理由は？", answer: "ユーザー入力をエスケープせずにHTMLに埋め込むと、悪意のあるスクリプトが実行されるXSS攻撃のリスクがあります。HTMLエスケープにより、入力値がHTMLタグとして解釈されることを防ぎ、Webアプリケーションの安全性を確保できます。" },
      ]} />
      <RelatedTools currentToolId="html-escape" />
    </div>
  );
}
