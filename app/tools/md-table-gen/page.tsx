"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Align = "left" | "center" | "right";

export default function MdTableGen() {
  const [headers, setHeaders] = useState(["ヘッダー1", "ヘッダー2", "ヘッダー3"]);
  const [rows, setRows] = useState([["セル1", "セル2", "セル3"], ["セル4", "セル5", "セル6"]]);
  const [aligns, setAligns] = useState<Align[]>(["left", "left", "left"]);
  const [csvInput, setCsvInput] = useState("");
  const [copied, setCopied] = useState(false);

  const cols = headers.length;

  const updateHeader = (i: number, v: string) => { const n = [...headers]; n[i] = v; setHeaders(n); };
  const updateCell = (r: number, c: number, v: string) => { const n = rows.map((row) => [...row]); n[r][c] = v; setRows(n); };
  const toggleAlign = (i: number) => {
    const n = [...aligns];
    n[i] = n[i] === "left" ? "center" : n[i] === "center" ? "right" : "left";
    setAligns(n);
  };

  const addRow = () => setRows([...rows, new Array(cols).fill("")]);
  const addCol = () => { setHeaders([...headers, ""]); setAligns([...aligns, "left"]); setRows(rows.map((r) => [...r, ""])); };
  const removeRow = () => { if (rows.length > 1) setRows(rows.slice(0, -1)); };
  const removeCol = () => {
    if (cols <= 1) return;
    setHeaders(headers.slice(0, -1));
    setAligns(aligns.slice(0, -1));
    setRows(rows.map((r) => r.slice(0, -1)));
  };

  const importCsv = () => {
    const lines = csvInput.trim().split("\n").filter(Boolean);
    if (lines.length === 0) return;
    const parsed = lines.map((l) => l.split(",").map((c) => c.trim()));
    const numCols = Math.max(...parsed.map((r) => r.length));
    setHeaders(parsed[0].concat(new Array(Math.max(0, numCols - parsed[0].length)).fill("")));
    setAligns(new Array(numCols).fill("left"));
    setRows(parsed.slice(1).map((r) => r.concat(new Array(Math.max(0, numCols - r.length)).fill(""))));
    setCsvInput("");
  };

  const genSeparator = (a: Align) => a === "center" ? ":---:" : a === "right" ? "---:" : "---";
  const md = [
    `| ${headers.join(" | ")} |`,
    `| ${aligns.map(genSeparator).join(" | ")} |`,
    ...rows.map((r) => `| ${r.join(" | ")} |`),
  ].join("\n");

  const copy = () => { navigator.clipboard.writeText(md); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Markdownテーブル生成</h1>
      <p className="text-gray-500 text-sm mb-6">GUIで簡単にMarkdownの表を作成。CSV貼り付けにも対応。</p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap gap-2">
          <button onClick={addRow} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">+ 行追加</button>
          <button onClick={addCol} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">+ 列追加</button>
          <button onClick={removeRow} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">- 行削除</button>
          <button onClick={removeCol} className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300">- 列削除</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="p-1">
                    <input type="text" value={h} onChange={(e) => updateHeader(i, e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm font-bold bg-blue-50 focus:ring-1 focus:ring-blue-500" />
                    <button onClick={() => toggleAlign(i)} className="mt-1 text-[10px] text-gray-500 hover:text-blue-600">
                      {aligns[i] === "left" ? "← 左" : aligns[i] === "center" ? "↔ 中央" : "→ 右"}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-1">
                      <input type="text" value={cell} onChange={(e) => updateCell(ri, ci, e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Markdown</span>
            <button onClick={copy} className="px-4 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">{copied ? "OK!" : "コピー"}</button>
          </div>
          <pre className="text-sm font-mono text-gray-900 whitespace-pre overflow-x-auto">{md}</pre>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">CSVからインポート</h3>
          <textarea value={csvInput} onChange={(e) => setCsvInput(e.target.value)} placeholder={"ヘッダー1,ヘッダー2,ヘッダー3\nデータ1,データ2,データ3"} className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm font-mono resize-y" />
          <button onClick={importCsv} className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700">CSVをインポート</button>
        </div>
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "Markdownテーブルの書式は？", answer: "パイプ(|)で列を区切り、ヘッダーとデータの間にハイフン(---)のセパレータ行を入れます。コロン(:)でアライメントを指定できます。" },
        { question: "セル内で改行はできますか？", answer: "標準的なMarkdownテーブルではセル内改行はサポートされていません。<br>タグを使うことで一部の環境では改行できますが、互換性は限定的です。" },
        { question: "対応しているMarkdownエディタは？", answer: "GitHub、GitLab、Qiita、Zenn、VSCode、Notion等の主要なMarkdown対応サービス・エディタで利用できます。" },
      ]} />

      <RelatedTools currentToolId="md-table-gen" />
    </div>
  );
}
