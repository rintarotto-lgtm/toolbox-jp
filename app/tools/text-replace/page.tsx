"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

export default function TextReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [result, setResult] = useState("");
  const [count, setCount] = useState(0);
  const [error, setError] = useState("");

  const doReplace = () => {
    if (!find) { setResult(text); setCount(0); return; }
    setError("");
    try {
      let flags = "g";
      if (!caseSensitive) flags += "i";
      const regex = useRegex ? new RegExp(find, flags) : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      const matches = text.match(regex);
      setCount(matches ? matches.length : 0);
      setResult(text.replace(regex, replace));
    } catch (e) {
      setError("正規表現が無効です: " + (e as Error).message);
    }
  };

  const copy = () => navigator.clipboard.writeText(result);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">テキスト一括置換</h1>
      <p className="text-gray-500 text-sm mb-6">
        テキスト内の文字列を一括置換します。正規表現にも対応。
      </p>

      <AdBanner />

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">テキスト</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="置換対象のテキストを入力..."
            className="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">検索文字列</label>
            <input value={find} onChange={(e) => setFind(e.target.value)} placeholder="検索..."
              className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">置換文字列</label>
            <input value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="置換..."
              className="w-full p-2 border border-gray-300 rounded-lg text-sm" />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} className="accent-blue-600" />
            正規表現を使用
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="accent-blue-600" />
            大文字/小文字を区別
          </label>
          <button onClick={doReplace} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 ml-auto">
            置換実行
          </button>
        </div>

        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

        {result && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-sm font-medium text-gray-700">{count}件置換しました</label>
              <button onClick={copy} className="text-xs text-blue-600 hover:underline">コピー</button>
            </div>
            <textarea value={result} readOnly
              className="w-full h-40 p-3 border border-gray-200 rounded-lg text-sm bg-gray-50 resize-y" />
          </div>
        )}
      </div>

      <AdBanner />
      <ToolFAQ faqs={[
        { question: "テキスト一括置換ツールの使い方は？", answer: "テキストを入力欄に貼り付け、検索文字列と置換文字列を指定して「置換実行」ボタンをクリックします。一度に全ての該当箇所が置換され、置換件数も表示されます。" },
        { question: "正規表現を使った置換はできますか？", answer: "はい、「正規表現を使用」にチェックを入れることで、正規表現パターンによる高度な一括置換が可能です。例えば、\\d+で数字のマッチング、(.*?)でグループキャプチャなどが使えます。" },
        { question: "大文字・小文字を区別せずに置換できますか？", answer: "「大文字/小文字を区別」のチェックを外すことで、大文字と小文字を区別しない置換（ケースインセンシティブ置換）が可能です。英文テキストの編集に便利です。" },
        { question: "オンラインテキスト置換のメリットは？", answer: "ブラウザ上で動作するため、ソフトウェアのインストールなしで大量のテキストを一括置換できます。データはサーバーに送信されず、すべてブラウザ内で処理されるため安全です。" },
      ]} />
      <RelatedTools currentToolId="text-replace" />
    </div>
  );
}
