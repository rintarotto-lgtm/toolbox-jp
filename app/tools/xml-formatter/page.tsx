"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function formatXml(xml: string, indent: number): string {
  let formatted = "";
  let pad = 0;
  const lines = xml.replace(/(>)(<)(\/*)/g, "$1\n$2$3").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.match(/^<\/\w/)) pad--;
    formatted += " ".repeat(Math.max(0, pad) * indent) + trimmed + "\n";
    if (trimmed.match(/^<\w[^>]*[^/]>$/) && !trimmed.match(/^<\?/)) pad++;
  }
  return formatted.trim();
}

function minifyXml(xml: string): string {
  return xml.replace(/>\s+</g, "><").replace(/\s*\n\s*/g, "").trim();
}

export default function XmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    try {
      setError("");
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "text/xml");
      const err = doc.querySelector("parsererror");
      if (err) { setError("XMLの構文エラーが検出されました"); return; }
      setOutput(formatXml(input, indentSize));
    } catch { setError("XMLの解析に失敗しました"); }
  };

  const handleMinify = () => {
    try {
      setError("");
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "text/xml");
      const err = doc.querySelector("parsererror");
      if (err) { setError("XMLの構文エラーが検出されました"); return; }
      setOutput(minifyXml(input));
    } catch { setError("XMLの解析に失敗しました"); }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">XML整形ツール</h1>
      <p className="text-gray-500 text-sm mb-6">XMLを見やすく整形、または圧縮（ミニファイ）。</p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={'<?xml version="1.0"?>\n<root><item id="1"><name>テスト</name></item></root>'} className="w-full h-48 p-4 border border-gray-300 rounded-lg text-sm font-mono resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />

        <div className="flex flex-wrap gap-3 items-center">
          <select value={indentSize} onChange={(e) => setIndentSize(Number(e.target.value))} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value={2}>2スペース</option>
            <option value={4}>4スペース</option>
          </select>
          <button onClick={handleFormat} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">整形</button>
          <button onClick={handleMinify} className="px-6 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700">圧縮</button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {output && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">出力</span>
              <button onClick={copy} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50">{copied ? "OK!" : "コピー"}</button>
            </div>
            <pre className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre max-h-96">{output}</pre>
          </div>
        )}
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "XML整形とは？", answer: "XMLのタグ構造にインデントと改行を追加し、人間が読みやすい形式にすることです。データの階層構造が一目でわかるようになります。" },
        { question: "XML圧縮のメリットは？", answer: "不要な空白や改行を削除してファイルサイズを小さくします。APIレスポンスやネットワーク転送の効率化に有効です。" },
        { question: "XMLとHTMLの違いは？", answer: "XMLはデータの構造化と転送を目的とし、タグ名を自由に定義できます。HTMLはWebページの表示が目的で、定義済みのタグを使用します。" },
      ]} />

      <RelatedTools currentToolId="xml-formatter" />
    </div>
  );
}
