"use client";

import { useState, useCallback } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Tab = "number" | "string" | "color";

export default function RandomGen() {
  const [tab, setTab] = useState<Tab>("number");
  const [copied, setCopied] = useState(false);

  // Number state
  const [numMin, setNumMin] = useState(1);
  const [numMax, setNumMax] = useState(100);
  const [numCount, setNumCount] = useState(5);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [numbers, setNumbers] = useState<number[]>([]);

  // String state
  const [strLen, setStrLen] = useState(16);
  const [strCount, setStrCount] = useState(3);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [strings, setStrings] = useState<string[]>([]);

  // Color state
  const [colorCount, setColorCount] = useState(6);
  const [colors, setColors] = useState<string[]>([]);

  const generateNumbers = useCallback(() => {
    const range = numMax - numMin + 1;
    if (!allowDuplicates && numCount > range) {
      alert(`重複なしの場合、最大${range}個までしか生成できません。`);
      return;
    }
    const result: number[] = [];
    if (allowDuplicates) {
      for (let i = 0; i < numCount; i++) {
        result.push(Math.floor(Math.random() * range) + numMin);
      }
    } else {
      const pool = Array.from({ length: range }, (_, i) => numMin + i);
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      result.push(...pool.slice(0, numCount));
    }
    setNumbers(result);
  }, [numMin, numMax, numCount, allowDuplicates]);

  const generateStrings = useCallback(() => {
    let chars = "";
    if (useUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (useDigits) chars += "0123456789";
    if (useSymbols) chars += "!@#$%^&*()-_=+[]{}|;:,.<>?";
    if (!chars) {
      alert("少なくとも1つの文字種を選択してください。");
      return;
    }
    const result: string[] = [];
    for (let i = 0; i < strCount; i++) {
      let s = "";
      for (let j = 0; j < strLen; j++) {
        s += chars[Math.floor(Math.random() * chars.length)];
      }
      result.push(s);
    }
    setStrings(result);
  }, [strLen, strCount, useUpper, useLower, useDigits, useSymbols]);

  const generateColors = useCallback(() => {
    const result: string[] = [];
    for (let i = 0; i < colorCount; i++) {
      const hex = Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0");
      result.push(`#${hex}`);
    }
    setColors(result);
  }, [colorCount]);

  const copyResults = useCallback(() => {
    let text = "";
    if (tab === "number") text = numbers.join("\n");
    else if (tab === "string") text = strings.join("\n");
    else text = colors.join("\n");
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [tab, numbers, strings, colors]);

  const tabs: { id: Tab; name: string }[] = [
    { id: "number", name: "数値" },
    { id: "string", name: "文字列" },
    { id: "color", name: "色" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">ランダム生成</h1>
      <p className="text-gray-500 text-sm mb-6">
        ランダムな数値・文字列・カラーコードを生成します。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Number tab */}
        {tab === "number" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">最小値</label>
                <input
                  type="number"
                  value={numMin}
                  onChange={(e) => setNumMin(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">最大値</label>
                <input
                  type="number"
                  value={numMax}
                  onChange={(e) => setNumMax(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">生成数</label>
                <input
                  type="number"
                  value={numCount}
                  onChange={(e) => setNumCount(Math.max(1, Math.min(100, Number(e.target.value))))}
                  min={1}
                  max={100}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={allowDuplicates}
                onChange={(e) => setAllowDuplicates(e.target.checked)}
                className="rounded border-gray-300"
              />
              重複を許可
            </label>
            <button
              onClick={generateNumbers}
              className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              生成
            </button>
            {numbers.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {numbers.map((n, i) => (
                    <span key={i} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-mono">
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* String tab */}
        {tab === "string" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">文字数</label>
                <input
                  type="number"
                  value={strLen}
                  onChange={(e) => setStrLen(Math.max(1, Math.min(256, Number(e.target.value))))}
                  min={1}
                  max={256}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">生成数</label>
                <input
                  type="number"
                  value={strCount}
                  onChange={(e) => setStrCount(Math.max(1, Math.min(20, Number(e.target.value))))}
                  min={1}
                  max={20}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              {[
                { label: "大文字 (A-Z)", checked: useUpper, set: setUseUpper },
                { label: "小文字 (a-z)", checked: useLower, set: setUseLower },
                { label: "数字 (0-9)", checked: useDigits, set: setUseDigits },
                { label: "記号 (!@#...)", checked: useSymbols, set: setUseSymbols },
              ].map((opt) => (
                <label key={opt.label} className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={opt.checked}
                    onChange={(e) => opt.set(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            <button
              onClick={generateStrings}
              className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              生成
            </button>
            {strings.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                {strings.map((s, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg px-3 py-2 font-mono text-sm break-all">
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Color tab */}
        {tab === "color" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">生成数</label>
              <input
                type="number"
                value={colorCount}
                onChange={(e) => setColorCount(Math.max(1, Math.min(24, Number(e.target.value))))}
                min={1}
                max={24}
                className="w-32 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={generateColors}
              className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              生成
            </button>
            {colors.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {colors.map((c, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      navigator.clipboard.writeText(c);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1500);
                    }}
                  >
                    <div className="h-20" style={{ backgroundColor: c }} />
                    <div className="p-2 text-center text-xs font-mono text-gray-700">
                      {c.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Copy button */}
        {((tab === "number" && numbers.length > 0) ||
          (tab === "string" && strings.length > 0) ||
          (tab === "color" && colors.length > 0)) && (
          <button
            onClick={copyResults}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? "コピーしました!" : "結果をコピー"}
          </button>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">ランダム生成ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          タブを切り替えて数値・文字列・色のランダム生成ができます。数値は範囲と個数を指定でき、重複の有無も選択可能。
          文字列は文字種（大文字・小文字・数字・記号）と長さをカスタマイズできます。
          テストデータ作成、抽選、パスワード生成などにご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "生成される値は暗号学的に安全ですか？",
            answer:
              "Math.random()を使用しているため、暗号学的な安全性は保証されません。セキュリティが重要な用途（認証トークンなど）にはcrypto.getRandomValues()を使う専用ツールをご利用ください。",
          },
          {
            question: "数値の重複なし生成に上限はありますか？",
            answer:
              "重複なしの場合、指定した範囲（最大値 - 最小値 + 1）が生成数の上限になります。範囲を超える数は生成できません。",
          },
          {
            question: "文字列の最大長は何文字ですか？",
            answer:
              "256文字まで指定できます。一度に最大20個まで生成可能です。ブラウザ上で処理するため、高速に生成されます。",
          },
        ]}
      />

      <RelatedTools currentToolId="random-gen" />
    </div>
  );
}
