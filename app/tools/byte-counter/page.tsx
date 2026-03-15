"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";

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
    </div>
  );
}
