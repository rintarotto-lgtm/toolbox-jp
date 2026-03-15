"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const jaTexts = [
  "吾輩は猫である。名前はまだ無い。どこで生れたかとんと見当がつかぬ。",
  "何でも薄暗いじめじめした所でニャーニャー泣いていた事だけは記憶している。",
  "吾輩はここで始めて人間というものを見た。しかもあとで聞くとそれは書生という人間中で一番獰悪な種族であったそうだ。",
  "この書生というのは時々我々を捕えて煮て食うという話である。",
  "しかしその当時は何という考もなかったから別段恐しいとも思わなかった。",
  "ただ彼の掌に載せられてスーと持ち上げられた時何だかフワフワした感じがあったばかりである。",
  "掌の上で少し落ちついて書生の顔を見たのがいわゆる人間というものの見始であろう。",
  "この時妙なものだと思った感じが今でも残っている。",
  "第一毛をもって装飾されべきはずの顔がつるつるしてまるで薬缶だ。",
  "その後猫にもだいぶ逢ったがこんな片輪には一度も出会わした事がない。",
];

const enTexts = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
  "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
  "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit.",
  "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis.",
];

export default function LoremIpsumTool() {
  const [count, setCount] = useState(3);
  const [lang, setLang] = useState<"ja" | "en">("ja");
  const [unit, setUnit] = useState<"paragraph" | "sentence">("paragraph");

  const texts = lang === "ja" ? jaTexts : enTexts;

  const generateText = () => {
    if (unit === "sentence") {
      return Array.from({ length: count }, (_, i) => texts[i % texts.length]).join("\n");
    }
    return Array.from({ length: count }, (_, i) => {
      const start = (i * 3) % texts.length;
      return [texts[start], texts[(start + 1) % texts.length], texts[(start + 2) % texts.length]].join("");
    }).join("\n\n");
  };

  const output = generateText();
  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">ダミーテキスト生成</h1>
      <p className="text-gray-500 text-sm mb-6">
        デザインやレイアウト確認用のダミーテキストを生成。日本語・英語対応。
      </p>

      <AdBanner />

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2">
            <button onClick={() => setLang("ja")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${lang === "ja" ? "bg-blue-600 text-white" : "bg-white border border-gray-300"}`}>
              日本語
            </button>
            <button onClick={() => setLang("en")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${lang === "en" ? "bg-blue-600 text-white" : "bg-white border border-gray-300"}`}>
              English
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setUnit("paragraph")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${unit === "paragraph" ? "bg-blue-600 text-white" : "bg-white border border-gray-300"}`}>
              段落
            </button>
            <button onClick={() => setUnit("sentence")} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${unit === "sentence" ? "bg-blue-600 text-white" : "bg-white border border-gray-300"}`}>
              文
            </button>
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            数:
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value))))}
              className="w-16 p-1.5 border border-gray-300 rounded text-center"
            />
          </label>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">生成結果</label>
            <button onClick={copy} className="text-xs text-blue-600 hover:underline">コピー</button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 resize-y"
          />
        </div>
      </div>

      <AdBanner />
      <RelatedTools currentToolId="lorem-ipsum" />
    </div>
  );
}
