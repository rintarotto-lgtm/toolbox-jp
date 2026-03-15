"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

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
      <RelatedTools currentToolId="zen-han" />
    </div>
  );
}
