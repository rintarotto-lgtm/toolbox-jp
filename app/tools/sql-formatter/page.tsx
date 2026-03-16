"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

/* ---- SQL keywords that trigger a newline (order matters: longer first) ---- */
const MAJOR_KEYWORDS = [
  "LEFT OUTER JOIN",
  "RIGHT OUTER JOIN",
  "FULL OUTER JOIN",
  "CROSS JOIN",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "FULL JOIN",
  "ORDER BY",
  "GROUP BY",
  "INSERT INTO",
  "DELETE FROM",
  "CREATE TABLE",
  "ALTER TABLE",
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "ON",
  "AND",
  "OR",
  "HAVING",
  "LIMIT",
  "OFFSET",
  "VALUES",
  "UPDATE",
  "SET",
  "UNION ALL",
  "UNION",
  "CASE",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
];

/* Keywords that receive extra indentation (sub-clauses) */
const INDENT_KEYWORDS = new Set([
  "AND",
  "OR",
  "ON",
  "WHEN",
  "THEN",
  "ELSE",
  "END",
]);

function formatSQL(
  raw: string,
  uppercaseKeywords: boolean,
  indentSize: number
): string {
  if (!raw.trim()) return "";

  const indent = " ".repeat(indentSize);

  /* Tokenise: preserve strings, identifiers, and whitespace-separated tokens */
  const tokens: string[] = [];
  let i = 0;
  while (i < raw.length) {
    // Skip whitespace, collapse to single space
    if (/\s/.test(raw[i])) {
      while (i < raw.length && /\s/.test(raw[i])) i++;
      tokens.push(" ");
      continue;
    }
    // Quoted string (single or double)
    if (raw[i] === "'" || raw[i] === '"') {
      const q = raw[i];
      let s = q;
      i++;
      while (i < raw.length && raw[i] !== q) {
        if (raw[i] === "\\" && i + 1 < raw.length) {
          s += raw[i] + raw[i + 1];
          i += 2;
        } else {
          s += raw[i];
          i++;
        }
      }
      if (i < raw.length) {
        s += raw[i];
        i++;
      }
      tokens.push(s);
      continue;
    }
    // Backtick-quoted identifier
    if (raw[i] === "`") {
      let s = "`";
      i++;
      while (i < raw.length && raw[i] !== "`") {
        s += raw[i];
        i++;
      }
      if (i < raw.length) {
        s += raw[i];
        i++;
      }
      tokens.push(s);
      continue;
    }
    // Parentheses and special chars
    if ("(),;".includes(raw[i])) {
      tokens.push(raw[i]);
      i++;
      continue;
    }
    // Regular word / operator
    let word = "";
    while (
      i < raw.length &&
      !/\s/.test(raw[i]) &&
      !"(),;'\"`".includes(raw[i])
    ) {
      word += raw[i];
      i++;
    }
    if (word) tokens.push(word);
  }

  /* Build formatted output */
  const lines: string[] = [];
  let currentLine = "";
  let depth = 0; // parenthesis depth for extra indent

  const pushLine = (line: string) => {
    if (line.trim()) lines.push(line);
  };

  const getIndent = (extra: number = 0) =>
    " ".repeat(depth * indentSize) + indent.repeat(extra);

  let idx = 0;
  while (idx < tokens.length) {
    const token = tokens[idx];

    // Skip whitespace-only tokens (we handle spacing ourselves)
    if (token === " ") {
      idx++;
      continue;
    }

    // Try to match multi-word keywords
    let matched = "";
    for (const kw of MAJOR_KEYWORDS) {
      const parts = kw.split(" ");
      const upcoming: string[] = [];
      let peek = idx;
      let partIdx = 0;
      while (peek < tokens.length && partIdx < parts.length) {
        if (tokens[peek] === " ") {
          peek++;
          continue;
        }
        upcoming.push(tokens[peek].toUpperCase());
        peek++;
        partIdx++;
      }
      if (upcoming.join(" ") === kw) {
        matched = kw;
        // Advance idx past the matched tokens
        let consumed = 0;
        let advance = idx;
        while (advance < tokens.length && consumed < parts.length) {
          if (tokens[advance] === " ") {
            advance++;
            continue;
          }
          consumed++;
          advance++;
        }
        idx = advance;
        break;
      }
    }

    if (matched) {
      const display = uppercaseKeywords ? matched : matched.toLowerCase();
      const isSubClause = INDENT_KEYWORDS.has(matched);

      // Push any accumulated content
      pushLine(currentLine);

      if (isSubClause) {
        currentLine = getIndent(1) + display;
      } else {
        currentLine = getIndent() + display;
      }
    } else if (token === "(") {
      currentLine += " (";
      depth++;
    } else if (token === ")") {
      depth = Math.max(0, depth - 1);
      currentLine += ")";
    } else if (token === ",") {
      currentLine += ",";
      // Add newline after comma in SELECT lists etc.
      pushLine(currentLine);
      currentLine = getIndent(1);
    } else if (token === ";") {
      currentLine += ";";
      pushLine(currentLine);
      currentLine = "";
      lines.push(""); // blank line between statements
    } else {
      currentLine += (currentLine.trim() ? " " : "") + token;
    }

    if (!matched) idx++;
  }

  pushLine(currentLine);

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [uppercaseKw, setUppercaseKw] = useState(true);
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setOutput(formatSQL(input, uppercaseKw, indentSize));
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setCopied(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">SQL整形ツール</h1>
      <p className="text-gray-500 text-sm mb-6">
        SQLクエリを見やすくフォーマット。SELECT / INSERT / UPDATE /
        DELETE文などに対応し、インデント付きで可読性を向上させます。
      </p>

      <AdBanner />

      {/* Options */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={uppercaseKw}
            onChange={(e) => setUppercaseKw(e.target.checked)}
            className="rounded border-gray-300"
          />
          キーワード大文字化
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-600">
          インデント:
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value={2}>2スペース</option>
            <option value={4}>4スペース</option>
          </select>
        </label>
      </div>

      {/* Input / Output */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            入力 SQL
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="SELECT id, name FROM users WHERE active = 1 ORDER BY name;"
            className="w-full h-72 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            整形結果
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-72 p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-y"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={handleFormat}
          disabled={!input.trim()}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40"
        >
          整形
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40"
        >
          {copied ? "コピー済み" : "コピー"}
        </button>
        <button
          onClick={handleClear}
          disabled={!input && !output}
          className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40"
        >
          クリア
        </button>
      </div>

      <AdBanner />

      {/* How to use */}
      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">SQL整形ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          左の入力欄にSQLクエリをペーストし、「整形」ボタンを押すとインデント付きのフォーマット済みSQLが右側に表示されます。
          キーワード大文字化のオン/オフやインデント幅の変更も可能です。
          SELECT / INSERT / UPDATE / DELETE / CREATE TABLE
          など主要なSQL文に対応しています。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "どのようなSQL文に対応していますか？",
            answer:
              "SELECT、INSERT INTO、UPDATE、DELETE FROM、CREATE TABLE、ALTER TABLE、JOINの各種（INNER / LEFT / RIGHT / FULL / CROSS）、サブクエリ、UNION、CASE式など、主要なSQL構文に対応しています。",
          },
          {
            question: "キーワード大文字化とは何ですか？",
            answer:
              "SQLのキーワード（SELECT、FROM、WHERE など）をすべて大文字に統一する機能です。大文字のキーワードはテーブル名やカラム名と区別しやすく、SQLの可読性が向上します。",
          },
          {
            question: "整形結果が意図どおりにならない場合は？",
            answer:
              "本ツールは簡易的なフォーマッターのため、非常に複雑なネストや方言固有の構文では期待どおりにならない場合があります。その場合は手動で微調整してください。",
          },
          {
            question: "入力したSQLはサーバーに送信されますか？",
            answer:
              "いいえ。すべての処理はブラウザ上で完結しており、入力データがサーバーに送信されることはありません。安心してご利用ください。",
          },
        ]}
      />

      <RelatedTools currentToolId="sql-formatter" />
    </div>
  );
}
