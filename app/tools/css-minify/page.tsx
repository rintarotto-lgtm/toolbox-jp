"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function getByteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

function minifyCss(css: string): string {
  let result = css;
  // Remove comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  // Remove newlines and carriage returns
  result = result.replace(/[\r\n]+/g, "");
  // Collapse multiple spaces into one
  result = result.replace(/\s{2,}/g, " ");
  // Remove spaces around { } : ; ,
  result = result.replace(/\s*\{\s*/g, "{");
  result = result.replace(/\s*\}\s*/g, "}");
  result = result.replace(/\s*:\s*/g, ":");
  result = result.replace(/\s*;\s*/g, ";");
  result = result.replace(/\s*,\s*/g, ",");
  // Remove trailing semicolons before }
  result = result.replace(/;}/g, "}");
  // Remove leading/trailing whitespace
  result = result.trim();
  return result;
}

function formatCss(css: string): string {
  let result = css;
  // Remove existing comments for clean processing
  const comments: string[] = [];
  result = result.replace(/\/\*[\s\S]*?\*\//g, (match) => {
    comments.push(match);
    return `/*__COMMENT_${comments.length - 1}__*/`;
  });
  // Normalize whitespace
  result = result.replace(/[\r\n]+/g, " ");
  result = result.replace(/\s{2,}/g, " ");
  result = result.trim();

  // Add newline after {
  result = result.replace(/\s*\{\s*/g, " {\n");
  // Add newline after ;
  result = result.replace(/\s*;\s*/g, ";\n");
  // Add newline after and before }
  result = result.replace(/\s*\}\s*/g, "\n}\n");
  // Clean up multiple newlines
  result = result.replace(/\n{3,}/g, "\n\n");

  // Apply indentation
  const lines = result.split("\n");
  const formatted: string[] = [];
  let indent = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (line === "}") {
      indent = Math.max(0, indent - 1);
    }

    formatted.push("  ".repeat(indent) + line);

    if (line.endsWith("{")) {
      indent += 1;
    }
  }

  result = formatted.join("\n");

  // Ensure space after : in properties
  result = result.replace(/:\s*/g, ": ");
  // Ensure space before {
  result = result.replace(/\s*\{/g, " {");
  // Fix selector at start of line (no extra space before {)
  result = result.replace(/^(\s*)/gm, "$1");

  // Restore comments
  comments.forEach((comment, i) => {
    result = result.replace(`/*__COMMENT_${i}__*/`, comment);
  });

  return result.trim();
}

export default function CssMinify() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"minify" | "format">("minify");
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    if (mode === "minify") {
      setOutput(minifyCss(input));
    } else {
      setOutput(formatCss(input));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputBytes = getByteSize(input);
  const outputBytes = getByteSize(output);
  const ratio =
    inputBytes > 0
      ? (((inputBytes - outputBytes) / inputBytes) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">CSS圧縮・整形ツール</h1>
      <p className="text-gray-500 text-sm mb-6">
        CSSを圧縮（ミニファイ）して軽量化、または整形して可読性を向上させます。
      </p>

      <AdBanner />

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setMode("minify")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "minify"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          圧縮（Minify）
        </button>
        <button
          onClick={() => setMode("format")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            mode === "format"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          整形（Format）
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            入力CSS
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`body {\n  margin: 0;\n  padding: 0;\n}`}
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            出力
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-y"
          />
        </div>
      </div>

      {output && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800 flex flex-wrap gap-4">
          <span>入力: {inputBytes.toLocaleString()} bytes</span>
          <span>出力: {outputBytes.toLocaleString()} bytes</span>
          <span
            className={`font-medium ${
              Number(ratio) > 0 ? "text-green-700" : "text-gray-600"
            }`}
          >
            {Number(ratio) > 0
              ? `${ratio}% 削減`
              : Number(ratio) < 0
              ? `${Math.abs(Number(ratio))}% 増加（整形による）`
              : "変化なし"}
          </span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={handleProcess}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {mode === "minify" ? "圧縮する" : "整形する"}
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40"
        >
          {copied ? "コピーしました!" : "コピー"}
        </button>
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">CSS圧縮・整形ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          左の入力欄にCSSコードをペーストし、「圧縮」または「整形」モードを選択して変換します。
          圧縮モードではコメント・空白・改行を除去してファイルサイズを削減します。
          整形モードでは適切なインデントと改行を追加して可読性を向上させます。
          変換後のサイズ比較と削減率も表示されます。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "CSSの圧縮（ミニファイ）とは何ですか？",
            answer:
              "CSSファイルからコメント、不要な空白、改行を除去してファイルサイズを最小化することです。Webページの読み込み速度を向上させ、帯域幅を節約できます。",
          },
          {
            question: "圧縮するとCSSの動作に影響はありますか？",
            answer:
              "いいえ、圧縮はコメントや空白のみを除去するため、CSSの見た目や動作は変わりません。ブラウザは圧縮されたCSSも通常通り解釈します。",
          },
          {
            question: "どのくらいサイズが削減できますか？",
            answer:
              "CSSの記述内容によりますが、一般的にコメントやインデントが多いファイルでは20〜40%程度の削減が期待できます。変換後に削減率が表示されるので確認してください。",
          },
          {
            question: "整形（フォーマット）はいつ使うべきですか？",
            answer:
              "圧縮されたCSSを読みやすくしたい場合や、他の開発者と共有する前にコードの可読性を高めたい場合に使用します。デバッグ時にも整形されたCSSは便利です。",
          },
        ]}
      />

      <RelatedTools currentToolId="css-minify" />
    </div>
  );
}
