"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Mode = "word" | "char" | "bigram";

export default function WordFreq() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("word");
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [copied, setCopied] = useState(false);

  const analyze = () => {
    const text = caseInsensitive ? input.toLowerCase() : input;
    const freq = new Map<string, number>();

    if (mode === "word") {
      const words = text.match(/[\p{L}\p{N}]+/gu) || [];
      words.forEach((w) => freq.set(w, (freq.get(w) || 0) + 1));
    } else if (mode === "char") {
      [...text.replace(/\s/g, "")].forEach((c) => freq.set(c, (freq.get(c) || 0) + 1));
    } else {
      const words = text.match(/[\p{L}\p{N}]+/gu) || [];
      for (let i = 0; i < words.length - 1; i++) {
        const bg = `${words[i]} ${words[i + 1]}`;
        freq.set(bg, (freq.get(bg) || 0) + 1);
      }
    }

    return [...freq.entries()].sort((a, b) => b[1] - a[1]);
  };

  const results = input.trim() ? analyze() : [];
  const total = results.reduce((s, [, c]) => s + c, 0);

  const exportCsv = () => {
    const csv = "単語,出現回数,割合(%)\n" + results.map(([w, c]) => `${w},${c},${((c / total) * 100).toFixed(1)}`).join("\n");
    navigator.clipboard.writeText(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">単語出現頻度カウンター</h1>
      <p className="text-gray-500 text-sm mb-6">テキスト内の単語・文字の出現頻度を分析。</p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="分析したいテキストを入力..." className="w-full h-40 p-4 border border-gray-300 rounded-lg text-sm resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

        <div className="flex flex-wrap gap-3 items-center">
          <select value={mode} onChange={(e) => setMode(e.target.value as Mode)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="word">単語</option>
            <option value="char">文字</option>
            <option value="bigram">バイグラム（2語組）</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={caseInsensitive} onChange={(e) => setCaseInsensitive(e.target.checked)} className="accent-blue-600" />
            大小文字を区別しない
          </label>
        </div>

        {results.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-500">ユニーク: {results.length} / 合計: {total}</span>
              <button onClick={exportCsv} className="px-4 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">{copied ? "OK!" : "CSVコピー"}</button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white"><tr className="border-b border-gray-200"><th className="text-left py-2 text-gray-500 w-8">#</th><th className="text-left py-2 text-gray-500">単語</th><th className="text-right py-2 text-gray-500 w-16">回数</th><th className="text-right py-2 text-gray-500 w-24">割合</th><th className="py-2 w-32"></th></tr></thead>
                <tbody>
                  {results.slice(0, 100).map(([word, count], i) => {
                    const pct = (count / total) * 100;
                    return (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="py-1.5 text-gray-400">{i + 1}</td>
                        <td className="py-1.5 font-mono">{word}</td>
                        <td className="py-1.5 text-right font-mono">{count}</td>
                        <td className="py-1.5 text-right text-gray-500">{pct.toFixed(1)}%</td>
                        <td className="py-1.5 px-2"><div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(100, (count / results[0][1]) * 100)}%` }} /></div></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {results.length > 100 && <p className="text-xs text-gray-400 mt-2 text-center">上位100件を表示</p>}
            </div>
          </div>
        )}
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "バイグラムとは？", answer: "連続する2つの単語の組み合わせです。テキストの特徴的なフレーズや共起語の発見に役立ちます。SEOキーワード分析にも活用できます。" },
        { question: "日本語の単語区切りは？", answer: "本ツールはUnicodeのワード境界で分割します。日本語は形態素解析なしでは完全な単語分割が難しいため、文字単位の分析も併用することをお勧めします。" },
        { question: "SEO分析に使えますか？", answer: "特定のキーワードの出現頻度や密度を確認できるため、コンテンツのSEO最適化に役立ちます。ただし、キーワード密度だけでなく自然な文章を心がけることが重要です。" },
      ]} />

      <RelatedTools currentToolId="word-freq" />
    </div>
  );
}
