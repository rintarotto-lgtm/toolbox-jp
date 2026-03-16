"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

async function computeHash(text: string, algo: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algo, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const algorithms = [
  { label: "MD5", value: "" },
  { label: "SHA-1", value: "SHA-1" },
  { label: "SHA-256", value: "SHA-256" },
  { label: "SHA-384", value: "SHA-384" },
  { label: "SHA-512", value: "SHA-512" },
];

export default function HashGenTool() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<Record<string, string>>({});

  const generate = async (text: string) => {
    setInput(text);
    if (!text) {
      setResults({});
      return;
    }
    const newResults: Record<string, string> = {};
    for (const algo of algorithms) {
      if (!algo.value) continue;
      try {
        newResults[algo.label] = await computeHash(text, algo.value);
      } catch {
        newResults[algo.label] = "（非対応）";
      }
    }
    setResults(newResults);
  };

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">ハッシュ生成</h1>
      <p className="text-gray-500 text-sm mb-6">
        テキストからSHA-1、SHA-256、SHA-512等のハッシュ値を生成します。
      </p>

      <AdBanner />

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">入力テキスト</label>
          <textarea
            value={input}
            onChange={(e) => generate(e.target.value)}
            placeholder="ハッシュ化したいテキストを入力..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {Object.keys(results).length > 0 && (
          <div className="space-y-3">
            {algorithms.filter((a) => a.value).map((algo) => (
              <div key={algo.label} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-500">{algo.label}</span>
                  <button
                    onClick={() => copy(results[algo.label] || "")}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    コピー
                  </button>
                </div>
                <p className="font-mono text-xs text-gray-800 break-all">
                  {results[algo.label] || ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <AdBanner />
      <ToolFAQ faqs={[
        { question: "ハッシュ値とは何ですか？", answer: "ハッシュ値とは、任意のデータを固定長の英数字文字列に変換した値です。同じ入力からは常に同じハッシュ値が生成され、データの改ざん検知やパスワードの安全な保存に利用されます。" },
        { question: "SHA-256とMD5の違いは何ですか？", answer: "MD5は128ビットのハッシュ値を生成しますが、衝突攻撃への脆弱性が発見されておりセキュリティ用途には推奨されません。SHA-256は256ビットのハッシュ値を生成し、現在も安全とされる暗号学的ハッシュ関数です。" },
        { question: "ハッシュ値からパスワードを復元できますか？", answer: "ハッシュ関数は一方向関数のため、ハッシュ値から元のパスワードを直接復元することはできません。ただし、短い・単純なパスワードはレインボーテーブル攻撃で推測される可能性があるため、ソルト付きハッシュの使用が推奨されます。" },
        { question: "ファイルのハッシュ値チェックサムとは？", answer: "ファイルのチェックサムは、ダウンロードしたファイルが改ざんされていないか検証するために使われるハッシュ値です。配布元のハッシュ値と比較することで、ファイルの完全性を確認できます。" },
      ]} />
      <RelatedTools currentToolId="hash-gen" />
    </div>
  );
}
