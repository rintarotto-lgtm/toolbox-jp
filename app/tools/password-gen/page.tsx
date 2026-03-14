"use client";

import { useState, useCallback } from "react";
import AdBanner from "@/components/AdBanner";

export default function PasswordGen() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let chars = "";
    if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    if (!chars) { setPassword("文字種を1つ以上選択してください"); return; }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const pw = Array.from(array, (v) => chars[v % chars.length]).join("");
    setPassword(pw);
    setCopied(false);
  }, [length, upper, lower, numbers, symbols]);

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = () => {
    let chars = 0;
    if (upper) chars += 26;
    if (lower) chars += 26;
    if (numbers) chars += 10;
    if (symbols) chars += 26;
    const entropy = Math.log2(Math.pow(chars || 1, length));
    if (entropy >= 80) return { label: "非常に強い", color: "text-green-600", bg: "bg-green-500", pct: 100 };
    if (entropy >= 60) return { label: "強い", color: "text-blue-600", bg: "bg-blue-500", pct: 75 };
    if (entropy >= 40) return { label: "普通", color: "text-yellow-600", bg: "bg-yellow-500", pct: 50 };
    return { label: "弱い", color: "text-red-600", bg: "bg-red-500", pct: 25 };
  };

  const s = strength();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">パスワード生成</h1>
      <p className="text-gray-500 text-sm mb-6">
        安全なランダムパスワードを生成します。長さや文字種をカスタマイズ可能。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700">パスワードの長さ: {length}</label>
          <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600" />
          <div className="flex justify-between text-xs text-gray-400"><span>4</span><span>64</span></div>
        </div>

        <div className="flex flex-wrap gap-4">
          {[
            { label: "大文字 (A-Z)", checked: upper, set: setUpper },
            { label: "小文字 (a-z)", checked: lower, set: setLower },
            { label: "数字 (0-9)", checked: numbers, set: setNumbers },
            { label: "記号 (!@#$)", checked: symbols, set: setSymbols },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={opt.checked} onChange={(e) => opt.set(e.target.checked)} className="accent-blue-600" />
              {opt.label}
            </label>
          ))}
        </div>

        <button onClick={generate} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
          パスワードを生成
        </button>

        {password && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm break-all select-all">
                {password}
              </code>
              <button onClick={copy} className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 shrink-0">
                {copied ? "OK!" : "コピー"}
              </button>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">強度</span>
                <span className={s.color}>{s.label}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${s.bg} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <AdBanner />
    </div>
  );
}
