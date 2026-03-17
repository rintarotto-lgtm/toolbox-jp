"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function toWords(text: string): string[] {
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-./]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

const converters: { label: string; fn: (t: string) => string }[] = [
  { label: "UPPERCASE（大文字）", fn: (t) => t.toUpperCase() },
  { label: "lowercase（小文字）", fn: (t) => t.toLowerCase() },
  {
    label: "Title Case（タイトルケース）",
    fn: (t) => toWords(t).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" "),
  },
  {
    label: "camelCase（キャメルケース）",
    fn: (t) => {
      const w = toWords(t);
      return w.map((s, i) => (i === 0 ? s.toLowerCase() : s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())).join("");
    },
  },
  {
    label: "PascalCase（パスカルケース）",
    fn: (t) => toWords(t).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(""),
  },
  {
    label: "snake_case（スネークケース）",
    fn: (t) => toWords(t).map((w) => w.toLowerCase()).join("_"),
  },
  {
    label: "kebab-case（ケバブケース）",
    fn: (t) => toWords(t).map((w) => w.toLowerCase()).join("-"),
  },
  {
    label: "CONSTANT_CASE（定数ケース）",
    fn: (t) => toWords(t).map((w) => w.toUpperCase()).join("_"),
  },
  {
    label: "dot.case（ドットケース）",
    fn: (t) => toWords(t).map((w) => w.toLowerCase()).join("."),
  },
];

export default function TextCase() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  const copy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">テキスト変換ツール</h1>
      <p className="text-gray-500 text-sm mb-6">
        大文字・小文字・キャメルケース・スネークケース等に一括変換。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="変換したいテキストを入力... 例: hello world, myVariableName, some-kebab-text"
          className="w-full h-28 p-4 border border-gray-300 rounded-lg text-sm font-mono resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {input.trim() && (
          <div className="grid gap-3">
            {converters.map((c, i) => {
              const result = c.fn(input);
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-500 mb-1">{c.label}</div>
                    <code className="block p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono break-all">
                      {result}
                    </code>
                  </div>
                  <button
                    onClick={() => copy(result, i)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-xs hover:bg-gray-50 shrink-0"
                  >
                    {copied === i ? "OK!" : "コピー"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AdBanner />

      <ToolFAQ
        faqs={[
          { question: "キャメルケースとパスカルケースの違いは？", answer: "キャメルケース（camelCase）は先頭が小文字、パスカルケース（PascalCase）は先頭が大文字です。JavaScriptでは変数にキャメル、クラスにパスカルを使うのが一般的です。" },
          { question: "スネークケースはどこで使われますか？", answer: "Python、Ruby、データベースのカラム名などで広く使われます。単語をアンダースコアで繋ぐ形式（user_name等）で、可読性が高いのが特徴です。" },
          { question: "ケバブケースの用途は？", answer: "主にURL、CSSクラス名、ファイル名で使用されます。HTMLの属性名（data-*）やコマンドラインのオプションでも一般的です。" },
        ]}
      />

      <RelatedTools currentToolId="text-case" />
    </div>
  );
}
