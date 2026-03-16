"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

export default function ZenHanTool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"toHan" | "toZen">("toHan");

  const toHalfWidth = (str: string) =>
    str.replace(/[Ａ-Ｚａ-ｚ０-９！-～]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) - 0xfee0)
    ).replace(/　/g, " ");

  const toFullWidth = (str: string) =>
    str.replace(/[A-Za-z0-9!-~]/g, (c) =>
      String.fromCharCode(c.charCodeAt(0) + 0xfee0)
    ).replace(/ /g, "　");

  const convert = (text: string, m: "toHan" | "toZen") => {
    setInput(text);
    setMode(m);
    setOutput(m === "toHan" ? toHalfWidth(text) : toFullWidth(text));
  };

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">半角全角変換</h1>
      <p className="text-gray-500 text-sm mb-6">
        テキストの半角・全角を一括変換します。英数字・記号に対応。
      </p>

      <AdBanner />

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => convert(input, "toHan")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "toHan" ? "bg-blue-600 text-white" : "bg-white border border-gray-300"}`}
        >
          半角に変換
        </button>
        <button
          onClick={() => convert(input, "toZen")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${mode === "toZen" ? "bg-blue-600 text-white" : "bg-white border border-gray-300"}`}
        >
          全角に変換
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">入力</label>
          <textarea
            value={input}
            onChange={(e) => convert(e.target.value, mode)}
            placeholder="テキストを入力..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">出力</label>
            <button onClick={copy} disabled={!output} className="text-xs text-blue-600 hover:underline disabled:opacity-40">コピー</button>
          </div>
          <textarea
            value={output}
            readOnly
            className="w-full h-32 p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-y"
          />
        </div>
      </div>

      <AdBanner />
      <ToolFAQ faqs={[
        { question: "全角と半角の違いは何ですか？", answer: "全角文字は日本語の文字幅に合わせた広い文字（Ａ、１、＠など）で、半角文字は英語圏で標準的な狭い文字（A、1、@など）です。データ入力やプログラミングでは半角が推奨されることが多く、統一が必要な場面で変換ツールが活躍します。" },
        { question: "半角全角変換はどのような場面で使いますか？", answer: "データベースへの登録前の文字統一、CSVファイルの整形、フォーム入力の正規化、住所や電話番号の書式統一など、データクレンジングの場面で広く使われます。特に日本語テキスト処理では必須の前処理です。" },
        { question: "カタカナの半角全角変換にも対応していますか？", answer: "本ツールは英数字と記号の半角・全角変換に対応しています。全角英数字（Ａ-Ｚ、ａ-ｚ、０-９）と半角英数字、および全角記号と半角記号の相互変換が可能です。" },
      ]} />
      <RelatedTools currentToolId="zen-han" />
    </div>
  );
}
