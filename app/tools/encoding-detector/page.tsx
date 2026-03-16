"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function textToUtf8Bytes(text: string): number[] {
  return [...new TextEncoder().encode(text)];
}

function bytesToHexDump(bytes: number[], cols: number = 16): string[] {
  const lines: string[] = [];
  for (let i = 0; i < bytes.length; i += cols) {
    const chunk = bytes.slice(i, i + cols);
    const offset = i.toString(16).padStart(8, "0");
    const hex = chunk.map(b => b.toString(16).padStart(2, "0")).join(" ");
    const ascii = chunk.map(b => (b >= 0x20 && b <= 0x7e) ? String.fromCharCode(b) : ".").join("");
    lines.push(`${offset}  ${hex.padEnd(cols * 3 - 1)}  |${ascii}|`);
  }
  return lines;
}

function analyzeEncoding(text: string) {
  const bytes = textToUtf8Bytes(text);
  const hasMultibyte = bytes.some(b => b > 0x7f);
  const hasAsciiOnly = !hasMultibyte;

  const analysis: { encoding: string; confidence: string; reason: string }[] = [];

  if (hasAsciiOnly) {
    analysis.push({ encoding: "ASCII", confidence: "確実", reason: "全て7ビットASCII文字のみ" });
    analysis.push({ encoding: "UTF-8", confidence: "互換", reason: "ASCIIはUTF-8のサブセット" });
    analysis.push({ encoding: "Shift_JIS", confidence: "互換", reason: "ASCIIはShift_JISのサブセット" });
  } else {
    // Check UTF-8 validity
    let validUtf8 = true;
    let i = 0;
    while (i < bytes.length) {
      if (bytes[i] < 0x80) { i++; }
      else if ((bytes[i] & 0xe0) === 0xc0) { if (i + 1 >= bytes.length || (bytes[i+1] & 0xc0) !== 0x80) { validUtf8 = false; break; } i += 2; }
      else if ((bytes[i] & 0xf0) === 0xe0) { if (i + 2 >= bytes.length || (bytes[i+1] & 0xc0) !== 0x80 || (bytes[i+2] & 0xc0) !== 0x80) { validUtf8 = false; break; } i += 3; }
      else if ((bytes[i] & 0xf8) === 0xf0) { if (i + 3 >= bytes.length || (bytes[i+1] & 0xc0) !== 0x80 || (bytes[i+2] & 0xc0) !== 0x80 || (bytes[i+3] & 0xc0) !== 0x80) { validUtf8 = false; break; } i += 4; }
      else { validUtf8 = false; break; }
    }

    if (validUtf8) {
      analysis.push({ encoding: "UTF-8", confidence: "高い", reason: "有効なUTF-8マルチバイトシーケンス検出" });
    }

    // Check for BOM
    if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
      analysis.unshift({ encoding: "UTF-8 (BOM付き)", confidence: "確実", reason: "UTF-8 BOM (EF BB BF) 検出" });
    }

    // Check CJK range (common for Japanese)
    const hasCjk = text.split("").some(c => {
      const code = c.charCodeAt(0);
      return (code >= 0x3000 && code <= 0x9fff) || (code >= 0xff00 && code <= 0xffef);
    });

    if (hasCjk) {
      analysis.push({ encoding: "Shift_JIS (推定)", confidence: "低い", reason: "日本語文字を含むが、このツールの入力はUTF-8" });
      analysis.push({ encoding: "EUC-JP (推定)", confidence: "低い", reason: "日本語文字を含むが、このツールの入力はUTF-8" });
    }
  }

  return { bytes, analysis, hasMultibyte };
}

function getCharInfo(text: string) {
  const chars = [...text];
  return chars.slice(0, 50).map(c => {
    const code = c.codePointAt(0) || 0;
    const utf8Bytes = textToUtf8Bytes(c);
    return {
      char: c,
      unicode: `U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
      utf8Hex: utf8Bytes.map(b => b.toString(16).toUpperCase().padStart(2, "0")).join(" "),
      utf8Len: utf8Bytes.length,
    };
  });
}

export default function EncodingDetector() {
  const [input, setInput] = useState("こんにちは World! 日本語テスト 🎉");

  const { bytes, analysis, hasMultibyte } = analyzeEncoding(input);
  const hexDump = bytesToHexDump(bytes);
  const charInfo = getCharInfo(input);
  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">文字コード判定</h1>
      <p className="text-gray-500 text-sm mb-6">
        テキストのバイト列から文字コードを推定。16進ダンプ表示。UTF-8・Shift_JIS・EUC-JP対応。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">入力テキスト</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="テキストを入力..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-800">{[...input].length}</div>
            <div className="text-xs text-gray-500">文字数</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-800">{bytes.length}</div>
            <div className="text-xs text-gray-500">UTF-8バイト数</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold text-gray-800">{hasMultibyte ? "マルチバイト" : "ASCII"}</div>
            <div className="text-xs text-gray-500">文字種別</div>
          </div>
        </div>

        {/* Encoding Analysis */}
        {analysis.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">🔍 文字コード推定結果</div>
            <div className="space-y-2">
              {analysis.map((a, i) => (
                <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${a.confidence === "確実" ? "bg-green-100 text-green-700" : a.confidence === "高い" || a.confidence === "互換" ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"}`}>{a.confidence}</span>
                  <span className="font-mono text-sm font-medium text-gray-800">{a.encoding}</span>
                  <span className="text-xs text-gray-500 ml-auto">{a.reason}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Character Table */}
        {input && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-700">📊 文字別詳細（先頭50文字）</div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-2 py-1.5 text-gray-500">文字</th>
                    <th className="text-left px-2 py-1.5 text-gray-500">Unicode</th>
                    <th className="text-left px-2 py-1.5 text-gray-500">UTF-8 (HEX)</th>
                    <th className="text-left px-2 py-1.5 text-gray-500">バイト数</th>
                  </tr>
                </thead>
                <tbody>
                  {charInfo.map((c, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-2 py-1.5 text-base">{c.char === " " ? "␣" : c.char === "\n" ? "↵" : c.char}</td>
                      <td className="px-2 py-1.5 text-gray-600">{c.unicode}</td>
                      <td className="px-2 py-1.5 text-gray-600">{c.utf8Hex}</td>
                      <td className="px-2 py-1.5 text-gray-600">{c.utf8Len}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hex Dump */}
        {hexDump.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm font-medium text-gray-700">💾 16進ダンプ (UTF-8)</div>
              <button onClick={() => copy(hexDump.join("\n"))} className="text-xs text-blue-600 hover:underline">コピー</button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto leading-relaxed">
              {hexDump.join("\n")}
            </pre>
          </div>
        )}
      </div>

      <ToolFAQ faqs={[
        { question: "文字コードとは何ですか？", answer: "文字コードは、文字をコンピュータで扱うための数値の割り当て規則です。代表的なものにUTF-8（Unicode）、Shift_JIS、EUC-JPがあります。UTF-8が現在の標準で、世界中の文字を扱えます。" },
        { question: "UTF-8とShift_JISの違いは？", answer: "UTF-8はUnicodeの符号化方式で世界中の文字を表現可能。Shift_JISはWindows日本語環境で広く使われた文字コードで、日本語文字を2バイトで表現します。現在はUTF-8の使用が推奨されています。" },
        { question: "文字化けの原因は？", answer: "文字化けは、テキストの文字コードと、それを読み取る側が想定する文字コードが異なる場合に発生します。例えばUTF-8のファイルをShift_JISとして開くと文字化けします。" },
        { question: "BOMとは何ですか？", answer: "BOM（Byte Order Mark）はテキストファイルの先頭に付与される特殊なバイト列で、文字コードを識別するための目印です。UTF-8のBOMは EF BB BF の3バイトです。" },
      ]} />
      <AdBanner />
      <RelatedTools currentToolId="encoding-detector" />
    </div>
  );
}
