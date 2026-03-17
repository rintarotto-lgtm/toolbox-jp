"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

export default function ReadingTimeTool() {
  const [text, setText] = useState("");

  const charCount = [...text].length;
  const charCountNoSpace = [...text.replace(/\s/g, "")].length;
  const lineCount = text === "" ? 0 : text.split("\n").length;

  // Japanese reading speed: ~400-600 chars/min
  const slowMin = Math.ceil(charCountNoSpace / 400);
  const fastMin = Math.ceil(charCountNoSpace / 600);
  // Speech speed: ~300 chars/min
  const speechMin = Math.ceil(charCountNoSpace / 300);
  // 原稿用紙（400字詰め）
  const manuscriptPages = Math.ceil(charCountNoSpace / 400);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">読了時間計算</h1>
      <p className="text-gray-500 text-sm mb-6">
        テキストを貼り付けるだけで読了時間・文字数・原稿用紙枚数を自動計算。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            テキスト入力
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="計算したいテキストを貼り付けてください..."
            className="w-full h-48 p-3 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-xs text-blue-600 mb-1">文字数</p>
            <p className="text-2xl font-bold text-blue-700">{charCount.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">スペース含む</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-xs text-blue-600 mb-1">文字数（空白除く）</p>
            <p className="text-2xl font-bold text-blue-700">{charCountNoSpace.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">スペース除外</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-xs text-blue-600 mb-1">行数</p>
            <p className="text-2xl font-bold text-blue-700">{lineCount.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-xs text-green-600 mb-1">読了時間（黙読）</p>
            <p className="text-2xl font-bold text-green-700">
              {charCountNoSpace === 0
                ? "—"
                : fastMin === slowMin
                  ? `約${slowMin}分`
                  : `約${fastMin}〜${slowMin}分`}
            </p>
            <p className="text-xs text-gray-500 mt-1">400〜600字/分</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-xs text-orange-600 mb-1">スピーチ時間</p>
            <p className="text-2xl font-bold text-orange-700">
              {charCountNoSpace === 0 ? "—" : `約${speechMin}分`}
            </p>
            <p className="text-xs text-gray-500 mt-1">約300字/分</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-xs text-purple-600 mb-1">原稿用紙（400字詰め）</p>
            <p className="text-2xl font-bold text-purple-700">
              {charCountNoSpace === 0 ? "—" : `${manuscriptPages}枚`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {charCountNoSpace > 0
                ? `残り${400 - (charCountNoSpace % 400 || 400)}字で次の枚数`
                : ""}
            </p>
          </div>
        </div>
      </div>

      <AdBanner />

      <ToolFAQ
        faqs={[
          {
            question: "日本語の平均的な読書速度はどのくらいですか？",
            answer:
              "日本語の平均的な黙読速度は1分間に約400〜600文字です。速読に慣れた方は800〜1000文字/分程度読めることもあります。このツールでは一般的な400〜600文字/分を基準に計算しています。",
          },
          {
            question: "スピーチ時間はどのように計算されますか？",
            answer:
              "日本語のスピーチは一般的に1分間に約300文字程度が聞き取りやすい速度とされています。プレゼンテーションやスピーチの原稿作成時に、この目安で時間を見積もることができます。",
          },
          {
            question: "原稿用紙の枚数はどう計算されますか？",
            answer:
              "一般的な原稿用紙は400字詰め（20字×20行）です。このツールでは空白を除いた文字数を400で割って原稿用紙の枚数を算出しています。小論文や作文の文字数目安に活用できます。",
          },
        ]}
      />

      <RelatedTools currentToolId="reading-time" />
    </div>
  );
}
