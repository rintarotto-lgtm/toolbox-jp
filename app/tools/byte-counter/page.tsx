"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function getByteLength(str: string, encoding: string): number {
  if (encoding === "utf-8") {
    return new TextEncoder().encode(str).length;
  }
  if (encoding === "utf-16") {
    return str.length * 2;
  }
  if (encoding === "shift-jis") {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      len += code > 0x7f ? 2 : 1;
    }
    return len;
  }
  return new TextEncoder().encode(str).length;
}

const encodings = [
  { label: "UTF-8", value: "utf-8" },
  { label: "UTF-16", value: "utf-16" },
  { label: "Shift-JIS (概算)", value: "shift-jis" },
];

export default function ByteCounterTool() {
  const [input, setInput] = useState("");

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">バイト数カウント・文字コード判定</h1>
      <p className="text-gray-500 text-sm mb-6">
        テキストのバイト数を各文字エンコーディングで計算します。
      </p>

      <AdBanner />

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">テキスト入力</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="テキストを入力..."
            className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {encodings.map((enc) => (
            <div key={enc.value} className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <p className="text-xs font-bold text-gray-500 mb-1">{enc.label}</p>
              <p className="text-2xl font-mono font-bold text-gray-800">
                {input ? getByteLength(input, enc.value) : 0}
              </p>
              <p className="text-xs text-gray-400">bytes</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-bold text-gray-700 mb-3">文字情報</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-xs text-gray-500">文字数</p>
              <p className="text-lg font-mono font-bold">{[...input].length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">半角文字</p>
              <p className="text-lg font-mono font-bold">
                {[...input].filter((c) => c.charCodeAt(0) <= 0x7f).length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">全角文字</p>
              <p className="text-lg font-mono font-bold">
                {[...input].filter((c) => c.charCodeAt(0) > 0x7f).length}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">行数</p>
              <p className="text-lg font-mono font-bold">
                {input ? input.split("\n").length : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <AdBanner />
      <ToolFAQ faqs={[
        { question: "バイト数と文字数の違いは何ですか？", answer: "文字数は文字の個数を数えますが、バイト数は文字のデータサイズを表します。UTF-8では英数字は1バイト、日本語の漢字やひらがなは3バイトになるため、同じ文字数でもバイト数は異なります。" },
        { question: "UTF-8とShift-JISでバイト数が違うのはなぜ？", answer: "文字エンコーディングによって各文字のバイト表現が異なるためです。例えば日本語の「あ」はUTF-8で3バイト、Shift-JISで2バイトです。データベースやAPIのサイズ制限を確認する際は、使用するエンコーディングに注意が必要です。" },
        { question: "バイト数カウントはどのような場面で必要ですか？", answer: "データベースのカラムサイズ制限のチェック、APIリクエストのペイロードサイズ確認、メール件名の文字数制限、SMS文字数の計算、ファイルサイズの見積もりなど、開発やデータ処理の多くの場面で必要になります。" },
        { question: "全角文字と半角文字のバイト数は？", answer: "UTF-8の場合、半角英数字は1バイト、全角ひらがな・カタカナ・漢字は3バイトです。UTF-16では半角・全角ともに基本的に2バイトです。Shift-JISでは半角1バイト、全角2バイトとなります。" },
      ]} />
      <RelatedTools currentToolId="byte-counter" />
    </div>
  );
}
