"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

export default function NumberConverterTool() {
  const [input, setInput] = useState("");
  const [base, setBase] = useState(10);

  let decimal = 0;
  let valid = false;
  try {
    decimal = parseInt(input, base);
    valid = !isNaN(decimal) && input.trim() !== "";
  } catch {
    valid = false;
  }

  const results = valid
    ? [
        { label: "2進数 (BIN)", value: decimal.toString(2) },
        { label: "8進数 (OCT)", value: decimal.toString(8) },
        { label: "10進数 (DEC)", value: decimal.toString(10) },
        { label: "16進数 (HEX)", value: decimal.toString(16).toUpperCase() },
      ]
    : [];

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">進数変換</h1>
      <p className="text-gray-500 text-sm mb-6">
        2進数・8進数・10進数・16進数を相互変換。プログラミングに便利。
      </p>

      <AdBanner />

      <div className="space-y-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">入力値</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={base === 16 ? "例: FF" : base === 2 ? "例: 1010" : "例: 255"}
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-36">
            <label className="text-sm font-medium text-gray-700 mb-1 block">入力の基数</label>
            <select
              value={base}
              onChange={(e) => setBase(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            >
              <option value={2}>2進数</option>
              <option value={8}>8進数</option>
              <option value={10}>10進数</option>
              <option value={16}>16進数</option>
            </select>
          </div>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {results.map((r) => (
              <div key={r.label} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-500">{r.label}</span>
                  <button onClick={() => copy(r.value)} className="text-xs text-blue-600 hover:underline">コピー</button>
                </div>
                <p className="font-mono text-lg font-bold text-gray-800 break-all">{r.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdBanner />
      <RelatedTools currentToolId="number-converter" />
    </div>
  );
}
