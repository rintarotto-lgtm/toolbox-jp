"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

// Hepburn romanization map
const hepburnMap: Record<string, string> = {
  あ: "a", い: "i", う: "u", え: "e", お: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", ゐ: "i", ゑ: "e", を: "wo", ん: "n",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  だ: "da", ぢ: "di", づ: "zu", で: "de", ど: "do",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  きゃ: "kya", きゅ: "kyu", きょ: "kyo",
  しゃ: "sha", しゅ: "shu", しょ: "sho",
  ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo",
  ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
  みゃ: "mya", みゅ: "myu", みょ: "myo",
  りゃ: "rya", りゅ: "ryu", りょ: "ryo",
  ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
  じゃ: "ja", じゅ: "ju", じょ: "jo",
  びゃ: "bya", びゅ: "byu", びょ: "byo",
  ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
  ー: "-",
};

// Kunrei-shiki differences
const kunreiOverrides: Record<string, string> = {
  し: "si", ち: "ti", つ: "tu", ふ: "hu",
  じ: "zi", ぢ: "di", づ: "du",
  しゃ: "sya", しゅ: "syu", しょ: "syo",
  ちゃ: "tya", ちゅ: "tyu", ちょ: "tyo",
  じゃ: "zya", じゅ: "zyu", じょ: "zyo",
};

function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

function toRomaji(text: string, style: "hepburn" | "kunrei"): string {
  const hiragana = katakanaToHiragana(text);
  const map = style === "kunrei" ? { ...hepburnMap, ...kunreiOverrides } : hepburnMap;

  let result = "";
  let i = 0;

  while (i < hiragana.length) {
    // Handle っ (sokuon / double consonant)
    if (hiragana[i] === "っ" || hiragana[i] === "ッ") {
      // Look ahead for next character's romaji to double the consonant
      const nextTwo = hiragana.substring(i + 1, i + 3);
      const nextOne = hiragana.substring(i + 1, i + 2);
      const nextRomaji = map[nextTwo] || map[nextOne];
      if (nextRomaji) {
        result += nextRomaji[0];
      } else {
        result += "t";
      }
      i++;
      continue;
    }

    // Try two-character combinations first (for yoon like きゃ)
    if (i + 1 < hiragana.length) {
      const twoChar = hiragana.substring(i, i + 2);
      if (map[twoChar]) {
        result += map[twoChar];
        i += 2;
        continue;
      }
    }

    // Single character
    const oneChar = hiragana[i];
    if (map[oneChar]) {
      // Handle ん before vowel or ya/yu/yo
      if (oneChar === "ん" && i + 1 < hiragana.length) {
        const next = hiragana[i + 1];
        if ("あいうえおやゆよ".includes(next)) {
          result += style === "hepburn" ? "n'" : "n'";
          i++;
          continue;
        }
        // Double n before b, m, p in hepburn
        if (style === "hepburn" && "ばびぶべぼまみむめもぱぴぷぺぽ".includes(next)) {
          result += "m";
          i++;
          continue;
        }
      }
      result += map[oneChar];
    } else {
      result += oneChar;
    }
    i++;
  }

  return result;
}

// Reverse: romaji to hiragana
const romajiToHiraganaMap: [string, string][] = [
  ["sha", "しゃ"], ["shi", "し"], ["shu", "しゅ"], ["sho", "しょ"],
  ["cha", "ちゃ"], ["chi", "ち"], ["chu", "ちゅ"], ["cho", "ちょ"],
  ["tsu", "つ"],
  ["kya", "きゃ"], ["kyu", "きゅ"], ["kyo", "きょ"],
  ["nya", "にゃ"], ["nyu", "にゅ"], ["nyo", "にょ"],
  ["hya", "ひゃ"], ["hyu", "ひゅ"], ["hyo", "ひょ"],
  ["mya", "みゃ"], ["myu", "みゅ"], ["myo", "みょ"],
  ["rya", "りゃ"], ["ryu", "りゅ"], ["ryo", "りょ"],
  ["gya", "ぎゃ"], ["gyu", "ぎゅ"], ["gyo", "ぎょ"],
  ["bya", "びゃ"], ["byu", "びゅ"], ["byo", "びょ"],
  ["pya", "ぴゃ"], ["pyu", "ぴゅ"], ["pyo", "ぴょ"],
  ["ja", "じゃ"], ["ju", "じゅ"], ["jo", "じょ"],
  ["ka", "か"], ["ki", "き"], ["ku", "く"], ["ke", "け"], ["ko", "こ"],
  ["sa", "さ"], ["si", "し"], ["su", "す"], ["se", "せ"], ["so", "そ"],
  ["ta", "た"], ["ti", "ち"], ["tu", "つ"], ["te", "て"], ["to", "と"],
  ["na", "な"], ["ni", "に"], ["nu", "ぬ"], ["ne", "ね"], ["no", "の"],
  ["ha", "は"], ["hi", "ひ"], ["hu", "ふ"], ["fu", "ふ"], ["he", "へ"], ["ho", "ほ"],
  ["ma", "ま"], ["mi", "み"], ["mu", "む"], ["me", "め"], ["mo", "も"],
  ["ya", "や"], ["yu", "ゆ"], ["yo", "よ"],
  ["ra", "ら"], ["ri", "り"], ["ru", "る"], ["re", "れ"], ["ro", "ろ"],
  ["wa", "わ"], ["wi", "ゐ"], ["we", "ゑ"], ["wo", "を"],
  ["ga", "が"], ["gi", "ぎ"], ["gu", "ぐ"], ["ge", "げ"], ["go", "ご"],
  ["za", "ざ"], ["zi", "じ"], ["ji", "じ"], ["zu", "ず"], ["ze", "ぜ"], ["zo", "ぞ"],
  ["da", "だ"], ["di", "ぢ"], ["du", "づ"], ["de", "で"], ["do", "ど"],
  ["ba", "ば"], ["bi", "び"], ["bu", "ぶ"], ["be", "べ"], ["bo", "ぼ"],
  ["pa", "ぱ"], ["pi", "ぴ"], ["pu", "ぷ"], ["pe", "ぺ"], ["po", "ぽ"],
  ["n'", "ん"], ["n", "ん"],
  ["a", "あ"], ["i", "い"], ["u", "う"], ["e", "え"], ["o", "お"],
];

function fromRomaji(text: string): string {
  let result = "";
  let i = 0;
  const lower = text.toLowerCase();

  while (i < lower.length) {
    // Handle double consonant (sokuon)
    if (
      i + 1 < lower.length &&
      lower[i] === lower[i + 1] &&
      "bcdfghjklmpqrstvwxyz".includes(lower[i])
    ) {
      result += "っ";
      i++;
      continue;
    }

    let matched = false;
    for (const [rom, hira] of romajiToHiraganaMap) {
      if (lower.substring(i, i + rom.length) === rom) {
        // Special case: "n" followed by a vowel or y should not match standalone "n"
        if (rom === "n" && i + 1 < lower.length) {
          const next = lower[i + 1];
          if ("aiueoy".includes(next)) {
            continue;
          }
        }
        result += hira;
        i += rom.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result += text[i];
      i++;
    }
  }

  return result;
}

export default function Romaji() {
  const [input, setInput] = useState("");
  const [style, setStyle] = useState<"hepburn" | "kunrei">("hepburn");
  const [direction, setDirection] = useState<"toRomaji" | "toHiragana">("toRomaji");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input) return "";
    if (direction === "toRomaji") {
      return toRomaji(input, style);
    }
    return fromRomaji(input);
  }, [input, style, direction]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">ローマ字変換</h1>
      <p className="text-gray-500 text-sm mb-6">
        ひらがな・カタカナをローマ字に変換、またはローマ字からひらがなに変換します。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setDirection("toRomaji")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                direction === "toRomaji"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              かな → ローマ字
            </button>
            <button
              onClick={() => setDirection("toHiragana")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                direction === "toHiragana"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              ローマ字 → ひらがな
            </button>
          </div>

          {direction === "toRomaji" && (
            <div className="flex gap-2">
              <button
                onClick={() => setStyle("hepburn")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  style === "hepburn"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ヘボン式
              </button>
              <button
                onClick={() => setStyle("kunrei")}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  style === "kunrei"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                訓令式
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {direction === "toRomaji" ? "ひらがな・カタカナを入力" : "ローマ字を入力"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              direction === "toRomaji"
                ? "たなか たろう"
                : "tanaka tarou"
            }
            className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            変換結果
          </label>
          <div className="relative">
            <textarea
              value={output}
              readOnly
              className="w-full h-32 p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 resize-y font-mono"
            />
            {output && (
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-3 py-1 bg-white border border-gray-300 rounded text-xs font-medium hover:bg-gray-50"
              >
                {copied ? "コピー済み" : "コピー"}
              </button>
            )}
          </div>
        </div>

        {direction === "toRomaji" && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              ヘボン式と訓令式の違い
            </h3>
            <div className="overflow-x-auto">
              <table className="text-sm text-gray-600 w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-1 pr-4 font-medium">かな</th>
                    <th className="text-left py-1 pr-4 font-medium">ヘボン式</th>
                    <th className="text-left py-1 font-medium">訓令式</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["し", "shi", "si"],
                    ["ち", "chi", "ti"],
                    ["つ", "tsu", "tu"],
                    ["ふ", "fu", "hu"],
                    ["じ", "ji", "zi"],
                    ["しゃ", "sha", "sya"],
                    ["ちゃ", "cha", "tya"],
                  ].map(([kana, hep, kun]) => (
                    <tr key={kana} className="border-b border-gray-100">
                      <td className="py-1 pr-4">{kana}</td>
                      <td className="py-1 pr-4 font-mono">{hep}</td>
                      <td className="py-1 font-mono">{kun}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">ローマ字変換ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          ひらがなまたはカタカナを入力すると、リアルタイムでローマ字に変換されます。
          ヘボン式（パスポートで使用）と訓令式（学校教育で使用）を切り替えられます。
          逆方向のローマ字からひらがなへの変換にも対応しています。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "ヘボン式と訓令式はどちらを使うべきですか？",
            answer:
              "パスポートや国際的な場面ではヘボン式が標準です。学校教育では訓令式が使われます。一般的にはヘボン式が広く使われています。",
          },
          {
            question: "パスポートの名前のローマ字表記に使えますか？",
            answer:
              "ヘボン式を選択すれば、パスポートで使われるローマ字表記を確認できます。ただし、長音の扱いなど例外がある場合があるため、最終的には外務省の規則をご確認ください。",
          },
          {
            question: "カタカナも変換できますか？",
            answer:
              "はい、ひらがなとカタカナの両方に対応しています。カタカナは自動的にひらがなに変換してからローマ字に変換されます。",
          },
        ]}
      />

      <RelatedTools currentToolId="romaji" />
    </div>
  );
}
