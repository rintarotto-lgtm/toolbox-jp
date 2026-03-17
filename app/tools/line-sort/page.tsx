"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type SortMode = "asc" | "desc" | "num-asc" | "num-desc" | "random" | "reverse";

export default function LineSort() {
  const [input, setInput] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("asc");
  const [removeDups, setRemoveDups] = useState(false);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [trimLines, setTrimLines] = useState(false);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [copied, setCopied] = useState(false);

  const process = () => {
    let lines = input.split("\n");
    if (trimLines) lines = lines.map((l) => l.trim());
    if (removeEmpty) lines = lines.filter((l) => l.trim() !== "");

    const compare = (a: string, b: string) => {
      const la = caseInsensitive ? a.toLowerCase() : a;
      const lb = caseInsensitive ? b.toLowerCase() : b;
      return la.localeCompare(lb, "ja");
    };

    switch (sortMode) {
      case "asc": lines.sort(compare); break;
      case "desc": lines.sort((a, b) => -compare(a, b)); break;
      case "num-asc": lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0)); break;
      case "num-desc": lines.sort((a, b) => (parseFloat(b) || 0) - (parseFloat(a) || 0)); break;
      case "random": lines.sort(() => Math.random() - 0.5); break;
      case "reverse": lines.reverse(); break;
    }

    if (removeDups) {
      const seen = new Set<string>();
      lines = lines.filter((l) => {
        const key = caseInsensitive ? l.toLowerCase() : l;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    return lines;
  };

  const result = process();
  const output = result.join("\n");
  const inputLines = input.split("\n").length;
  const removedCount = inputLines - result.length;

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">行ソート・重複削除</h1>
      <p className="text-gray-500 text-sm mb-6">テキストの行を並べ替え、重複行や空行を削除。</p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">入力</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={"apple\nbanana\napple\ncherry\nbanana"} className="w-full h-64 p-4 border border-gray-300 rounded-lg text-sm font-mono resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">出力</label>
              <button onClick={copy} className="text-xs text-blue-600 hover:underline">{copied ? "OK!" : "コピー"}</button>
            </div>
            <textarea readOnly value={output} className="w-full h-64 p-4 border border-gray-200 bg-gray-50 rounded-lg text-sm font-mono resize-y" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value as SortMode)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="asc">昇順 (A→Z)</option>
            <option value="desc">降順 (Z→A)</option>
            <option value="num-asc">数値昇順</option>
            <option value="num-desc">数値降順</option>
            <option value="random">ランダム</option>
            <option value="reverse">逆順</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-4">
          {[
            { label: "重複行を削除", checked: removeDups, set: setRemoveDups },
            { label: "空行を削除", checked: removeEmpty, set: setRemoveEmpty },
            { label: "前後の空白を除去", checked: trimLines, set: setTrimLines },
            { label: "大小文字を区別しない", checked: caseInsensitive, set: setCaseInsensitive },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)} className="accent-blue-600" />
              {opt.label}
            </label>
          ))}
        </div>

        <div className="flex gap-4 text-xs text-gray-500">
          <span>入力: {inputLines}行</span>
          <span>出力: {result.length}行</span>
          {removedCount > 0 && <span className="text-orange-600">削除: {removedCount}行</span>}
        </div>
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "数値ソートとは？", answer: "行頭の数値を基準に並べ替えます。通常のアルファベットソートでは「10」が「2」の前に来ますが、数値ソートでは正しく「2, 10」の順になります。" },
        { question: "重複削除の仕組みは？", answer: "完全に同一の行を検出して最初の出現のみを残します。「大小文字を区別しない」を有効にすると、「Apple」と「apple」も同一とみなされます。" },
        { question: "大量の行でも処理できますか？", answer: "ブラウザ上で処理するため、数万行程度であれば問題なく動作します。非常に大量のデータの場合は、コマンドラインの sort コマンドをお勧めします。" },
      ]} />

      <RelatedTools currentToolId="line-sort" />
    </div>
  );
}
