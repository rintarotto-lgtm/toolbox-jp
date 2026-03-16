"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Format = "json" | "js" | "sql" | "csv" | "xml";

const FORMATS: { id: Format; label: string }[] = [
  { id: "json", label: "JSON" },
  { id: "js", label: "JavaScript" },
  { id: "sql", label: "SQL" },
  { id: "csv", label: "CSV" },
  { id: "xml", label: "XML" },
];

function escapeText(text: string, format: Format): string {
  switch (format) {
    case "json":
      return JSON.stringify(text).slice(1, -1);
    case "js":
      return text.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/"/g,'\\"').replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\t/g,"\\t");
    case "sql":
      return text.replace(/'/g, "''").replace(/\\/g, "\\\\");
    case "csv":
      return text.includes(",") || text.includes('"') || text.includes("\n") ? '"' + text.replace(/"/g, '""') + '"' : text;
    case "xml":
      return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&apos;");
  }
}

function unescapeText(text: string, format: Format): string {
  try {
    switch (format) {
      case "json":
        return JSON.parse('"' + text + '"');
      case "js":
        return text.replace(/\\n/g,"\n").replace(/\\r/g,"\r").replace(/\\t/g,"\t").replace(/\\"/g,'"').replace(/\\'/g,"'").replace(/\\\\/g,"\\");
      case "sql":
        return text.replace(/''/g, "'").replace(/\\\\/g, "\\");
      case "csv":
        if (text.startsWith('"') && text.endsWith('"')) return text.slice(1,-1).replace(/""/g,'"');
        return text;
      case "xml":
        return text.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&apos;/g,"'");
    }
  } catch { return "エラー: 変換に失敗しました"; }
}

export default function TextEscape() {
  const [input, setInput] = useState('Hello "World"\nLine 2\t<tag> & \'quote\'');
  const [format, setFormat] = useState<Format>("json");
  const [mode, setMode] = useState<"escape"|"unescape">("escape");
  const output = mode === "escape" ? escapeText(input, format) : unescapeText(input, format);
  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">文字列エスケープ</h1>
      <p className="text-gray-500 text-sm mb-6">JSON・JavaScript・SQL・CSV・XMLの文字列エスケープ・アンエスケープ。</p>
      <AdBanner />
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {FORMATS.map(f => (
            <button key={f.id} onClick={() => setFormat(f.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${format===f.id?"bg-blue-600 text-white":"bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{f.label}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setMode("escape")} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode==="escape"?"bg-green-600 text-white":"bg-white border border-gray-300"}`}>エスケープ</button>
          <button onClick={()=>setMode("unescape")} className={`px-4 py-2 rounded-lg text-sm font-medium ${mode==="unescape"?"bg-orange-600 text-white":"bg-white border border-gray-300"}`}>アンエスケープ</button>
        </div>
        <div><label className="text-sm font-medium text-gray-700 mb-1 block">入力</label><textarea value={input} onChange={e=>setInput(e.target.value)} className="w-full h-28 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div>
          <div className="flex justify-between items-center mb-1"><label className="text-sm font-medium text-gray-700">出力（{format.toUpperCase()} {mode==="escape"?"エスケープ":"アンエスケープ"}）</label><button onClick={copy} className="text-xs text-blue-600 hover:underline">コピー</button></div>
          <textarea value={output} readOnly className="w-full h-28 p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-y" />
        </div>
      </div>
      <ToolFAQ faqs={[
        { question: "エスケープとは何ですか？", answer: "エスケープとは、プログラミングにおいて特殊な意味を持つ文字（引用符、改行、タブ等）を安全に表現するための変換処理です。例えばJSON内の引用符は\\\"として表現します。" },
        { question: "SQLインジェクション対策になりますか？", answer: "このツールのSQLエスケープは基本的な文字列エスケープです。実際のアプリケーションでは、プリペアドステートメント（パラメータ化クエリ）を使用することが推奨されます。" },
        { question: "どのフォーマットを使うべきですか？", answer: "使用する言語やデータ形式に合わせて選択してください。API開発ではJSON、Webページ表示ではXML/HTML、データベースクエリではSQL、表データではCSVが適切です。" },
      ]} />
      <AdBanner />
      <RelatedTools currentToolId="text-escape" />
    </div>
  );
}
