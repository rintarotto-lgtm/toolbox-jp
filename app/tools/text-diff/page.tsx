"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";

function computeDiff(a: string, b: string): { type: "same" | "add" | "remove"; text: string }[] {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const result: { type: "same" | "add" | "remove"; text: string }[] = [];

  const max = Math.max(linesA.length, linesB.length);
  for (let i = 0; i < max; i++) {
    const la = i < linesA.length ? linesA[i] : undefined;
    const lb = i < linesB.length ? linesB[i] : undefined;

    if (la === lb) {
      result.push({ type: "same", text: la! });
    } else {
      if (la !== undefined) result.push({ type: "remove", text: la });
      if (lb !== undefined) result.push({ type: "add", text: lb });
    }
  }
  return result;
}

export default function TextDiff() {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [diff, setDiff] = useState<ReturnType<typeof computeDiff>>([]);

  const compare = () => setDiff(computeDiff(textA, textB));

  const colors = { same: "", add: "bg-green-50 text-green-800", remove: "bg-red-50 text-red-800" };
  const prefix = { same: " ", add: "+", remove: "-" };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">テキスト差分比較</h1>
      <p className="text-gray-500 text-sm mb-6">
        2つのテキストの差分をハイライト表示します。
      </p>

      <AdBanner />

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">テキスト1（変更前）</label>
          <textarea value={textA} onChange={(e) => setTextA(e.target.value)}
            placeholder="変更前のテキスト..."
            className="w-full h-48 p-3 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">テキスト2（変更後）</label>
          <textarea value={textB} onChange={(e) => setTextB(e.target.value)}
            placeholder="変更後のテキスト..."
            className="w-full h-48 p-3 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <button onClick={compare} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 mb-4">
        比較する
      </button>

      {diff.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden font-mono text-sm">
          {diff.map((line, i) => (
            <div key={i} className={`px-4 py-1 border-b border-gray-100 ${colors[line.type]}`}>
              <span className="inline-block w-5 text-gray-400 select-none">{prefix[line.type]}</span>
              {line.text || " "}
            </div>
          ))}
        </div>
      )}

      <AdBanner />
    </div>
  );
}
