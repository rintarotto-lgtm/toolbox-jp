"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function generateUUIDv4(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGen() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [uppercase, setUppercase] = useState(false);
  const [noHyphens, setNoHyphens] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const formatUuid = (uuid: string) => {
    let result = uuid;
    if (uppercase) result = result.toUpperCase();
    if (noHyphens) result = result.replace(/-/g, "");
    return result;
  };

  const generate = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      newUuids.push(generateUUIDv4());
    }
    setUuids(newUuids);
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  const copyOne = (index: number) => {
    navigator.clipboard.writeText(formatUuid(uuids[index]));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = () => {
    const text = uuids.map(formatUuid).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">UUID/GUID 生成ツール</h1>
      <p className="text-gray-500 text-sm mb-6">
        v4ランダムUUIDをワンクリックで生成。1〜100個まで一括生成できます。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* 生成数 */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            生成数: {count}
          </label>
          <input
            type="range"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full mt-2 accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>

        {/* フォーマットオプション */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="accent-blue-600"
            />
            大文字 (UPPERCASE)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={noHyphens}
              onChange={(e) => setNoHyphens(e.target.checked)}
              className="accent-blue-600"
            />
            ハイフンなし
          </label>
        </div>

        {/* 生成ボタン */}
        <button
          onClick={generate}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          UUIDを生成
        </button>

        {/* 結果表示 */}
        {uuids.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                生成数: {uuids.length}件
              </span>
              <button
                onClick={copyAll}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
              >
                {copiedAll ? "OK!" : "すべてコピー"}
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {uuids.map((uuid, i) => (
                <div key={i} className="flex items-center gap-2">
                  <code className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm break-all select-all">
                    {formatUuid(uuid)}
                  </code>
                  <button
                    onClick={() => copyOne(i)}
                    className="px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm hover:bg-gray-50 shrink-0"
                  >
                    {copiedIndex === i ? "OK!" : "コピー"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">UUID生成ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          スライダーで生成数を選び「UUIDを生成」ボタンを押すだけ。大文字変換やハイフン除去のフォーマットオプションにも対応。
          個別コピーまたは一括コピーで即座に利用できます。すべての処理はブラウザ上で完結し、サーバーへのデータ送信はありません。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "UUIDとGUIDの違いは何ですか？",
            answer:
              "UUIDとGUIDは本質的に同じものです。UUID（Universally Unique Identifier）は標準的な名称で、GUID（Globally Unique Identifier）はMicrosoftが使用する呼称です。どちらも128ビットの一意な識別子を指します。",
          },
          {
            question: "UUID v4はどのように生成されますか？",
            answer:
              "UUID v4は暗号学的に安全な乱数生成器を使用してランダムに生成されます。バージョンを示す4ビットとバリアントを示す2ビットを除き、残りの122ビットがランダムです。衝突確率は極めて低く、実用上は一意と見なせます。",
          },
          {
            question: "生成したUUIDが重複することはありますか？",
            answer:
              "理論上はあり得ますが、確率は極めて低いです。UUID v4の衝突確率は、毎秒10億個生成しても約85年間は50%に達しません。実用上、重複を心配する必要はありません。",
          },
          {
            question: "ハイフンなしのUUIDは使っても問題ないですか？",
            answer:
              "はい、問題ありません。ハイフンはUUIDの可読性を高めるための区切り文字であり、省略しても一意性や機能に影響はありません。データベースやAPIの仕様に合わせてお選びください。",
          },
        ]}
      />

      <RelatedTools currentToolId="uuid-gen" />
    </div>
  );
}
