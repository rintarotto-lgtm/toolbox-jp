"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type NewlineType = "LF" | "CRLF" | "CR";

function detectNewline(text: string): { type: NewlineType | "混在" | "なし"; lf: number; crlf: number; cr: number } {
  const crlf = (text.match(/\r\n/g) || []).length;
  const cr = (text.replace(/\r\n/g, "").match(/\r/g) || []).length;
  const lf = (text.replace(/\r\n/g, "").match(/\n/g) || []).length;
  const total = crlf + cr + lf;

  let type: NewlineType | "混在" | "なし" = "なし";
  if (total === 0) type = "なし";
  else if (crlf > 0 && lf === 0 && cr === 0) type = "CRLF";
  else if (lf > 0 && crlf === 0 && cr === 0) type = "LF";
  else if (cr > 0 && crlf === 0 && lf === 0) type = "CR";
  else type = "混在";

  return { type, lf, crlf, cr };
}

function convertNewline(text: string, target: NewlineType): string {
  // Normalize all newlines to LF first
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  switch (target) {
    case "LF":
      return normalized;
    case "CRLF":
      return normalized.replace(/\n/g, "\r\n");
    case "CR":
      return normalized.replace(/\n/g, "\r");
  }
}

export default function NewlineConverterTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [target, setTarget] = useState<NewlineType>("LF");
  const [copied, setCopied] = useState(false);

  const detected = detectNewline(input);
  const lineCount = input === "" ? 0 : input.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").length;

  const convert = () => {
    const result = convertNewline(input, target);
    setOutput(result);
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const typeLabel = (t: NewlineType) => {
    switch (t) {
      case "LF": return "LF（Unix / macOS）";
      case "CRLF": return "CRLF（Windows）";
      case "CR": return "CR（旧Mac）";
    }
  };

  const typeBadgeColor = (t: string) => {
    switch (t) {
      case "LF": return "bg-green-100 text-green-700";
      case "CRLF": return "bg-blue-100 text-blue-700";
      case "CR": return "bg-orange-100 text-orange-700";
      case "混在": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-500";
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">改行コード変換</h1>
      <p className="text-gray-500 text-sm mb-6">
        テキストの改行コードを自動判定し、LF・CRLF・CR間で変換。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* Input */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            入力テキスト
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="テキストを貼り付けてください..."
            className="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Detection info */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">検出された改行コード:</span>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeBadgeColor(detected.type)}`}>
              {detected.type}
            </span>
          </div>
          <span className="text-sm text-gray-500">行数: {lineCount}</span>
          {detected.type !== "なし" && (
            <span className="text-xs text-gray-400">
              （LF: {detected.lf} / CRLF: {detected.crlf} / CR: {detected.cr}）
            </span>
          )}
        </div>

        {/* Target selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            変換先の改行コード
          </label>
          <div className="flex gap-2 flex-wrap">
            {(["LF", "CRLF", "CR"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`px-4 py-2 rounded-lg text-sm border ${
                  target === t
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {typeLabel(t)}
              </button>
            ))}
          </div>
        </div>

        {/* Convert button */}
        <button
          onClick={convert}
          disabled={!input}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          変換
        </button>

        {/* Output */}
        {output && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">変換結果</label>
              <button
                onClick={copy}
                className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                {copied ? "OK!" : "コピー"}
              </button>
            </div>
            <textarea
              value={output}
              readOnly
              className="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm font-mono resize-y bg-gray-50 focus:outline-none"
            />
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-gray-600">変換後の改行コード:</span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeBadgeColor(target)}`}>
                {target}
              </span>
            </div>
          </div>
        )}
      </div>

      <AdBanner />

      <ToolFAQ
        faqs={[
          {
            question: "改行コードとは何ですか？",
            answer:
              "改行コードはテキストファイルで「行の終わり」を表す制御文字です。OS によって異なり、Unix/macOS では LF（\\n）、Windows では CRLF（\\r\\n）、旧 Mac OS では CR（\\r）が使われます。",
          },
          {
            question: "改行コードが異なるとどんな問題が起きますか？",
            answer:
              "異なるOS間でファイルを共有する際、改行コードの違いにより改行が正しく表示されない、Gitで差分が大量に表示される、スクリプトが正しく動作しないなどの問題が発生することがあります。",
          },
          {
            question: "現在主流の改行コードは？",
            answer:
              "現在のmacOS・LinuxではLF、WindowsではCRLFが標準です。Web開発やGitでは一般的にLFを推奨することが多く、.editorconfigやGitの設定で統一するのがベストプラクティスです。",
          },
        ]}
      />

      <RelatedTools currentToolId="newline-converter" />
    </div>
  );
}
