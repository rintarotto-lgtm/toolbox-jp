"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

const sampleJson = `{
  "users": [
    { "name": "田中太郎", "age": 30, "email": "tanaka@example.com" },
    { "name": "鈴木花子", "age": 25, "email": "suzuki@example.com" },
    { "name": "佐藤次郎", "age": 35, "email": "sato@example.com" }
  ],
  "total": 3,
  "page": 1
}`;

function evaluatePath(obj: unknown, path: string): unknown {
  try {
    const parts = path.replace(/^\$\.?/, "").split(/\.|\[/).filter(Boolean).map((p) => p.replace(/\]$/, "").replace(/^['"]|['"]$/g, ""));
    let current: unknown = obj;
    for (const part of parts) {
      if (current === null || current === undefined) return undefined;
      if (part === "*" && Array.isArray(current)) return current;
      if (typeof current === "object") {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }
    return current;
  } catch { return undefined; }
}

export default function JsonPath() {
  const [json, setJson] = useState(sampleJson);
  const [path, setPath] = useState("users[0].name");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  let parsed: unknown = null;
  let result: unknown = undefined;
  let jsonError = "";

  try { parsed = JSON.parse(json); } catch (e) { jsonError = `JSON解析エラー: ${(e as Error).message}`; }

  if (parsed !== null && path.trim()) {
    try { result = evaluatePath(parsed, path); } catch { result = undefined; }
  }

  const resultStr = result !== undefined ? JSON.stringify(result, null, 2) : "（結果なし）";

  const copy = () => { navigator.clipboard.writeText(resultStr); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const examples = ["users[0].name", "users[1].email", "users[2].age", "total", "users"];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">JSONPathテスター</h1>
      <p className="text-gray-500 text-sm mb-6">JSONデータからパス指定で値を抽出。API開発・デバッグに。</p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">JSONデータ</label>
          <textarea value={json} onChange={(e) => { setJson(e.target.value); setError(""); }} className="w-full h-48 p-4 border border-gray-300 rounded-lg text-sm font-mono resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          {jsonError && <p className="text-red-500 text-sm mt-1">{jsonError}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">パス</label>
          <input type="text" value={path} onChange={(e) => setPath(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="users[0].name" />
          <div className="flex flex-wrap gap-2 mt-2">
            {examples.map((ex) => (
              <button key={ex} onClick={() => setPath(ex)} className={`px-2 py-1 rounded text-xs font-mono ${path === ex ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{ex}</button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">結果</span>
            <button onClick={copy} className="text-xs text-blue-600 hover:underline">{copied ? "OK!" : "コピー"}</button>
          </div>
          <pre className="text-sm font-mono text-gray-900 whitespace-pre-wrap">{resultStr}</pre>
        </div>

        {parsed !== null && typeof parsed === "object" && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">構造</h3>
            <div className="p-4 bg-gray-50 rounded-lg text-xs font-mono text-gray-600 max-h-48 overflow-y-auto">
              {Object.keys(parsed as object).map((key) => {
                const val = (parsed as Record<string, unknown>)[key];
                const type = Array.isArray(val) ? `Array(${(val as unknown[]).length})` : typeof val;
                return <div key={key} className="py-0.5"><span className="text-blue-700">{key}</span>: <span className="text-gray-500">{type}</span></div>;
              })}
            </div>
          </div>
        )}
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "JSONPathとは？", answer: "JSONデータ内の特定の値にアクセスするためのクエリ言語です。ドット記法（obj.key）やブラケット記法（obj['key']）で階層的にデータを辿ります。" },
        { question: "APIデバッグでの使い方は？", answer: "APIレスポンスのJSONを貼り付けて、必要なデータのパスを確認できます。フロントエンド開発でのデータアクセスコードの確認に便利です。" },
        { question: "配列のアクセス方法は？", answer: "配列はブラケット内にインデックスを指定します（例: users[0]）。0から始まるインデックスで、users[0].nameのようにチェーンできます。" },
      ]} />

      <RelatedTools currentToolId="json-path" />
    </div>
  );
}
