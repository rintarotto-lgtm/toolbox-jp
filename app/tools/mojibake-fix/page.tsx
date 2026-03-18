"use client";

import { useState, useCallback } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface DecodeAttempt {
  label: string;
  description: string;
  result: string;
  success: boolean;
}

function tryDecode(
  input: string,
  encodeAs: string,
  decodeAs: string
): string | null {
  try {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);

    // Try to decode the raw bytes as if they were in a different encoding
    const decoder = new TextDecoder(decodeAs, { fatal: true });
    const result = decoder.decode(bytes);
    return result;
  } catch {
    return null;
  }
}

function reinterpretBytes(
  input: string,
  sourceEncoding: string,
  targetEncoding: string
): string | null {
  try {
    // Convert string to bytes using source encoding interpretation
    const bytes = new Uint8Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const code = input.charCodeAt(i);
      if (code > 255) {
        // Has multi-byte chars - encode properly first
        const encoder = new TextEncoder();
        const encoded = encoder.encode(input);
        const decoder = new TextDecoder(targetEncoding, { fatal: true });
        return decoder.decode(encoded);
      }
      bytes[i] = code & 0xff;
    }

    const decoder = new TextDecoder(targetEncoding, { fatal: true });
    return decoder.decode(bytes);
  } catch {
    return null;
  }
}

function isLikelyJapanese(text: string): boolean {
  // Check if text contains Japanese characters (hiragana, katakana, kanji)
  return /[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/.test(text);
}

export default function MojibakeFix() {
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState<DecodeAttempt[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  const handleFix = useCallback(() => {
    if (!input.trim()) return;

    const results: DecodeAttempt[] = [];

    // Pattern 1: UTF-8 bytes misread as Shift_JIS (Latin-1)
    const r1 = reinterpretBytes(input, "windows-1252", "utf-8");
    if (r1 && r1 !== input) {
      results.push({
        label: "Latin-1 → UTF-8",
        description: "UTF-8のバイト列がLatin-1として読まれた場合",
        result: r1,
        success: isLikelyJapanese(r1),
      });
    }

    // Pattern 2: Shift_JIS bytes read as UTF-8
    const r2 = reinterpretBytes(input, "utf-8", "shift_jis");
    if (r2 && r2 !== input) {
      results.push({
        label: "UTF-8バイト → Shift_JIS",
        description: "Shift_JISのテキストがUTF-8として読まれた場合",
        result: r2,
        success: isLikelyJapanese(r2),
      });
    }

    // Pattern 3: EUC-JP
    const r3 = reinterpretBytes(input, "utf-8", "euc-jp");
    if (r3 && r3 !== input) {
      results.push({
        label: "UTF-8バイト → EUC-JP",
        description: "EUC-JPのテキストがUTF-8として読まれた場合",
        result: r3,
        success: isLikelyJapanese(r3),
      });
    }

    // Pattern 4: ISO-2022-JP
    const r4 = reinterpretBytes(input, "utf-8", "iso-2022-jp");
    if (r4 && r4 !== input) {
      results.push({
        label: "UTF-8バイト → ISO-2022-JP",
        description: "ISO-2022-JPのテキストがUTF-8として読まれた場合",
        result: r4,
        success: isLikelyJapanese(r4),
      });
    }

    // Pattern 5: Try simple TextDecoder with different encodings on raw bytes
    const rawBytes = new TextEncoder().encode(input);
    for (const enc of ["shift_jis", "euc-jp", "iso-2022-jp"]) {
      try {
        const decoded = new TextDecoder(enc, { fatal: true }).decode(rawBytes);
        if (decoded !== input && !results.some((r) => r.result === decoded)) {
          results.push({
            label: `UTF-8エンコード → ${enc}デコード`,
            description: `テキストをUTF-8でエンコードし${enc}でデコード`,
            result: decoded,
            success: isLikelyJapanese(decoded),
          });
        }
      } catch {
        // Skip failed decodings
      }
    }

    // Sort: likely Japanese results first
    results.sort((a, b) => (b.success ? 1 : 0) - (a.success ? 1 : 0));

    if (results.length === 0) {
      results.push({
        label: "変換候補なし",
        description: "一般的な文字化けパターンに一致しませんでした",
        result: input,
        success: false,
      });
    }

    setAttempts(results);
  }, [input]);

  const copyResult = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">文字化け修復</h1>
      <p className="text-gray-500 text-sm mb-6">
        文字化けしたテキストを複数のエンコーディングパターンで復元を試みます。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            文字化けしたテキストを入力
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="文字化けしたテキストをここに貼り付けてください..."
            className="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <button
          onClick={handleFix}
          disabled={!input.trim()}
          className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          修復を試みる
        </button>

        {attempts.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">復元候補</h3>
            {attempts.map((a, i) => (
              <div
                key={i}
                className={`border rounded-lg p-4 ${
                  a.success
                    ? "border-green-300 bg-green-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      {a.label}
                    </span>
                    {a.success && (
                      <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">
                        日本語検出
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copyResult(a.result, i)}
                    className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-white transition-colors"
                  >
                    {copied === i ? "コピー済み" : "コピー"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-2">{a.description}</p>
                <div className="bg-white border border-gray-200 rounded p-3 text-sm font-mono break-all">
                  {a.result}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Common patterns explanation */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            よくある文字化けパターン
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex gap-2">
              <span className="font-medium text-gray-800 shrink-0">UTF-8 → Shift_JIS:</span>
              <span>メールやCSVファイルで発生しやすい。「繧」「縺」などの漢字が連続する。</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-800 shrink-0">Shift_JIS → UTF-8:</span>
              <span>古いWebサイトのデータで発生。「?」や「□」に置き換わることが多い。</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-800 shrink-0">EUC-JP → UTF-8:</span>
              <span>Linux/Unixサーバーからのデータで発生することがある。</span>
            </div>
            <div className="flex gap-2">
              <span className="font-medium text-gray-800 shrink-0">ISO-2022-JP → UTF-8:</span>
              <span>古い日本語メールで使われていたエンコーディング。</span>
            </div>
          </div>
        </div>
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">文字化け修復ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          文字化けしたテキストを入力欄に貼り付け、「修復を試みる」ボタンをクリックしてください。
          UTF-8、Shift_JIS、EUC-JP、ISO-2022-JPなど一般的なエンコーディングの組み合わせで
          復元を試み、候補を一覧表示します。日本語として認識できる候補にはマークが付きます。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "文字化けの原因は何ですか？",
            answer:
              "文字化けは、テキストのエンコーディング（文字コード）が正しく認識されない場合に発生します。例えば、UTF-8で保存されたファイルをShift_JISとして開くと文字化けします。",
          },
          {
            question: "すべての文字化けを修復できますか？",
            answer:
              "残念ながら、すべてのケースで修復できるわけではありません。特に、文字化けが複数回発生している場合や、データの一部が失われている場合は復元が困難です。",
          },
          {
            question: "ブラウザのTextDecoder APIはどのエンコーディングに対応していますか？",
            answer:
              "主要なブラウザではUTF-8、Shift_JIS（Windows-31J）、EUC-JP、ISO-2022-JPに対応しています。このツールではこれらのエンコーディング間の変換を試みます。",
          },
          {
            question: "入力データはサーバーに送信されますか？",
            answer:
              "いいえ。すべての処理はブラウザ上のTextDecoder/TextEncoder APIで行われるため、データがサーバーに送信されることはありません。",
          },
          {
            question: "文字化けを予防する方法はありますか？",
            answer:
              "ファイルの保存時にUTF-8を指定する、HTMLにcharset=UTF-8を明記する、メールソフトのエンコーディング設定を確認するなどが有効です。",
          },
        ]}
      />

      <RelatedTools currentToolId="mojibake-fix" />
    </div>
  );
}
