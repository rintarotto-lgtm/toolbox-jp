"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError((e as Error).message);
      setOutput("");
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">JSON整形ツール</h1>
      <p className="text-gray-500 text-sm mb-6">
        JSONデータを見やすく整形・圧縮。シンタックスエラーも検出します。
      </p>

      <AdBanner />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">入力</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">出力</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-y"
          />
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-4 items-center">
        <button onClick={format} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          整形
        </button>
        <button onClick={minify} className="px-5 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700">
          圧縮
        </button>
        <button onClick={copy} disabled={!output} className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40">
          コピー
        </button>
        <label className="flex items-center gap-2 text-sm text-gray-600 ml-auto">
          インデント:
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="border border-gray-300 rounded px-2 py-1">
            <option value={2}>2スペース</option>
            <option value={4}>4スペース</option>
            <option value={1}>タブ</option>
          </select>
        </label>
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">JSON整形ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          左の入力欄にJSONデータをペーストし、「整形」ボタンで見やすく整形します。
          「圧縮」ボタンで不要な空白を除去したミニファイ版を生成できます。
          シンタックスエラーがある場合は、エラーメッセージで問題箇所を特定できます。
          APIレスポンスの確認やJSON設定ファイルの編集に最適です。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "JSON整形とは何ですか？",
            answer: "JSONデータにインデント（字下げ）と改行を追加して、人間が読みやすい形式に変換することです。開発中のデバッグやデータ構造の確認に便利です。",
          },
          {
            question: "JSONの圧縮（ミニファイ）は何に使いますか？",
            answer: "不要な空白や改行を除去してデータサイズを最小化します。APIのリクエストボディや設定ファイルのサイズ削減、通信量の節約に使われます。",
          },
          {
            question: "エラーが表示されるのですが？",
            answer: "JSONの構文に問題がある場合にエラーが表示されます。よくある原因は、末尾のカンマ、引用符の不一致、キー名の引用符忘れなどです。エラーメッセージを参考に修正してください。",
          },
        ]}
      />

      <RelatedTools currentToolId="json-formatter" />
    </div>
  );
}
