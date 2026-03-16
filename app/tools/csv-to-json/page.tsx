"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Delimiter = "," | "\t" | ";";
type OutputFormat = "objects" | "arrays";

function parseCSV(text: string, delimiter: Delimiter): string[][] {
  const rows: string[][] = [];
  let current = "";
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        row.push(current);
        current = "";
      } else if (ch === "\r" && next === "\n") {
        row.push(current);
        current = "";
        rows.push(row);
        row = [];
        i++;
      } else if (ch === "\n") {
        row.push(current);
        current = "";
        rows.push(row);
        row = [];
      } else {
        current += ch;
      }
    }
  }

  row.push(current);
  if (row.length > 1 || row[0] !== "") {
    rows.push(row);
  }

  return rows;
}

function detectHasHeader(rows: string[][]): boolean {
  if (rows.length < 2) return false;
  const first = rows[0];
  const second = rows[1];
  // If every cell in the first row is non-numeric and at least one cell in
  // the second row is numeric, it's likely a header row.
  const firstAllText = first.every((v) => isNaN(Number(v)) || v.trim() === "");
  const secondHasNum = second.some((v) => !isNaN(Number(v)) && v.trim() !== "");
  return firstAllText && secondHasNum;
}

export default function CsvToJsonTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [delimiter, setDelimiter] = useState<Delimiter>(",");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("objects");
  const [prettyPrint, setPrettyPrint] = useState(true);
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    setOutput("");
    setCopied(false);

    const trimmed = input.trim();
    if (!trimmed) {
      setError("CSVデータを入力してください。");
      return;
    }

    try {
      const rows = parseCSV(trimmed, delimiter);

      if (rows.length === 0) {
        setError("有効なCSVデータが見つかりませんでした。");
        return;
      }

      // Check for consistent column count
      const colCount = rows[0].length;
      const inconsistent = rows.find((r, i) => i > 0 && r.length !== colCount);
      if (inconsistent) {
        setError(
          `列数が一致しません。1行目は${colCount}列ですが、異なる列数の行があります。区切り文字の設定を確認してください。`
        );
        return;
      }

      let result: unknown;

      if (outputFormat === "objects") {
        const hasHeader = detectHasHeader(rows);
        if (hasHeader) {
          const headers = rows[0];
          result = rows.slice(1).map((row) => {
            const obj: Record<string, string> = {};
            headers.forEach((h, i) => {
              obj[h] = row[i] ?? "";
            });
            return obj;
          });
        } else {
          // Use col_0, col_1 ... as keys
          const headers = rows[0].map((_, i) => `col_${i}`);
          result = rows.map((row) => {
            const obj: Record<string, string> = {};
            headers.forEach((h, i) => {
              obj[h] = row[i] ?? "";
            });
            return obj;
          });
        }
      } else {
        result = rows;
      }

      const indent = prettyPrint ? 2 : undefined;
      setOutput(JSON.stringify(result, null, indent));
    } catch {
      setError("CSVの解析に失敗しました。データ形式を確認してください。");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">CSV → JSON変換</h1>
      <p className="text-gray-500 text-sm mb-6">
        CSVデータをJSON形式に変換します。ヘッダー行の自動検出、区切り文字の指定、出力形式の選択が可能です。
      </p>

      <AdBanner />

      {/* Options */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">区切り文字</label>
          <select
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value as Delimiter)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value=",">カンマ (,)</option>
            <option value={"\t"}>タブ</option>
            <option value=";">セミコロン (;)</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">出力形式</label>
          <select
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="objects">オブジェクト配列</option>
            <option value="arrays">2次元配列</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={prettyPrint}
              onChange={(e) => setPrettyPrint(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            整形表示
          </label>
        </div>
      </div>

      {/* Input / Output */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">CSV入力</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={'name,age,city\n田中,30,東京\n鈴木,25,大阪'}
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">JSON出力</label>
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
        <button
          onClick={convert}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          変換
        </button>
        <button
          onClick={copy}
          disabled={!output}
          className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40"
        >
          {copied ? "コピーしました" : "コピー"}
        </button>
      </div>

      <AdBanner />

      <ToolFAQ
        faqs={[
          {
            question: "CSVからJSONへの変換とは？",
            answer:
              "CSV（Comma-Separated Values）形式のデータをJSON（JavaScript Object Notation）形式に変換する処理です。APIへのデータ投入やWebアプリでのデータ活用に便利です。",
          },
          {
            question: "ヘッダー行はどのように検出されますか？",
            answer:
              "1行目がすべてテキスト（非数値）で、2行目以降に数値データが含まれる場合、自動的に1行目をヘッダーとして認識します。ヘッダーが検出されない場合は col_0, col_1 のような自動キーが使用されます。",
          },
          {
            question: "タブ区切り（TSV）やセミコロン区切りにも対応していますか？",
            answer:
              "はい、カンマ・タブ・セミコロンの3種類の区切り文字に対応しています。Excelからコピーしたデータはタブ区切りの場合が多いので、その際は「タブ」を選択してください。",
          },
          {
            question: "データのプライバシーは安全ですか？",
            answer:
              "本ツールはすべての処理をブラウザ内で実行しており、入力データがサーバーに送信されることはありません。機密データを含むCSVも安全に変換できます。",
          },
        ]}
      />

      <RelatedTools currentToolId="csv-to-json" />
    </div>
  );
}
