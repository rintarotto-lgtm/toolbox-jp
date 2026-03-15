"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

export default function UrlEncode() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const convert = (text: string, m: "encode" | "decode") => {
    setInput(text);
    setMode(m);
    setError("");
    try {
      setOutput(m === "encode" ? encodeURIComponent(text) : decodeURIComponent(text));
    } catch {
      setError("変換に失敗しました。入力を確認してください。");
      setOutput("");
    }
  };

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">URLエンコード/デコード</h1>
      <p className="text-gray-500 text-sm mb-6">
        URLの特殊文字をエンコード・デコードします。日本語URLの変換に便利。
      </p>

      <AdBanner />

      <div className="flex gap-2 mb-4">
        <button onClick={() => convert(input, "encode")} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "encode" ? "bg-blue-600 text-white" : "bg-white border border-gray-300"}`}>
          エンコード
        </button>
        <button onClick={() => convert(input, "decode")} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "decode" ? "bg-blue-600 text-white" : "bg-white border border-gray-300"}`}>
          デコード
        </button>
      </div>

      <div className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => convert(e.target.value, mode)}
          placeholder="テキストまたはURLを入力..."
          className="w-full h-28 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">出力</label>
          <button onClick={copy} disabled={!output} className="text-xs text-blue-600 hover:underline disabled:opacity-40">コピー</button>
        </div>
        <textarea value={output} readOnly className="w-full h-28 p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-y" />
      </div>

      <AdBanner />
      <RelatedTools currentToolId="url-encode" />
    </div>
  );
}
