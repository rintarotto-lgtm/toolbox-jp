"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const convert = (text: string, m: "encode" | "decode") => {
    setInput(text);
    setMode(m);
    setError("");
    try {
      if (m === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch {
      setError("変換に失敗しました。入力を確認してください。");
      setOutput("");
    }
  };

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Base64変換</h1>
      <p className="text-gray-500 text-sm mb-6">
        テキストをBase64にエンコード・デコードします。日本語も対応。
      </p>

      <AdBanner />

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => convert(input, "encode")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "encode" ? "bg-blue-600 text-white" : "bg-white border border-gray-300"}`}
        >
          エンコード
        </button>
        <button
          onClick={() => convert(input, "decode")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "decode" ? "bg-blue-600 text-white" : "bg-white border border-gray-300"}`}
        >
          デコード
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">入力</label>
          <textarea
            value={input}
            onChange={(e) => convert(e.target.value, mode)}
            placeholder={mode === "encode" ? "テキストを入力..." : "Base64文字列を入力..."}
            className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">出力</label>
            <button onClick={copy} disabled={!output} className="text-xs text-blue-600 hover:underline disabled:opacity-40">コピー</button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-32 p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-y"
          />
        </div>
      </div>

      <ToolFAQ faqs={[
        { question: "Base64とは何ですか？", answer: "Base64は、バイナリデータをASCII文字列に変換するエンコード方式です。メール添付やURLに安全にデータを埋め込む際に使用されます。" },
        { question: "Base64エンコードするとデータサイズはどうなりますか？", answer: "Base64エンコードすると、元のデータより約33%サイズが増加します。3バイトのデータが4文字に変換されるためです。" },
        { question: "日本語テキストもBase64変換できますか？", answer: "はい、このツールはUTF-8エンコーディングに対応しているため、日本語テキストも正しくBase64変換できます。" },
        { question: "Base64はデータの暗号化に使えますか？", answer: "いいえ、Base64は暗号化ではなくエンコード方式です。誰でも簡単にデコードできるため、機密データの保護には適していません。暗号化にはAESなどを使用してください。" },
      ]} />
      <AdBanner />
      <RelatedTools currentToolId="base64" />
    </div>
  );
}
