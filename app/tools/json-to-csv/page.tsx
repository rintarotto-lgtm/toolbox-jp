"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

export default function JsonToCsvTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    setError("");
    try {
      const data = JSON.parse(input);
      if (!Array.isArray(data) || data.length === 0) {
        setError("JSONは配列形式で入力してください。例: [{...}, {...}]");
        return;
      }
      const headers = Object.keys(data[0]);
      const csvRows = [
        headers.join(","),
        ...data.map((row: Record<string, unknown>) =>
          headers
            .map((h) => {
              const val = row[h] ?? "";
              const str = String(val);
              return str.includes(",") || str.includes('"') || str.includes("\n")
                ? `"${str.replace(/"/g, '""')}"`
                : str;
            })
            .join(",")
        ),
      ];
      setOutput(csvRows.join("\n"));
    } catch {
      setError("JSONのパースに失敗しました。正しいJSON配列を入力してください。");
    }
  };

  const copy = () => navigator.clipboard.writeText(output);

  const download = () => {
    const blob = new Blob([output], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.csv";
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">JSON → CSV変換</h1>
      <p className="text-gray-500 text-sm mb-6">
        JSON配列をCSV形式に変換します。ExcelやGoogleスプレッドシートにそのまま貼り付け可能。
      </p>

      <AdBanner />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">JSON入力</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'[\n  {"name": "田中", "age": 30},\n  {"name": "鈴木", "age": 25}\n]'}
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">CSV出力</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-y"
          />
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      <div className="flex gap-3 mt-4">
        <button onClick={convert} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          変換
        </button>
        <button onClick={copy} disabled={!output} className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40">
          コピー
        </button>
        <button onClick={download} disabled={!output} className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40">
          CSVダウンロード
        </button>
      </div>

      <AdBanner />
      <RelatedTools currentToolId="json-to-csv" />
    </div>
  );
}
