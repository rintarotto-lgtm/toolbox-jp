"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

const colors = [
  "bg-blue-400",
  "bg-green-400",
  "bg-orange-400",
  "bg-purple-400",
  "bg-pink-400",
  "bg-teal-400",
];

export default function FlexboxGen() {
  const [direction, setDirection] = useState("row");
  const [justifyContent, setJustifyContent] = useState("flex-start");
  const [alignItems, setAlignItems] = useState("stretch");
  const [flexWrap, setFlexWrap] = useState("nowrap");
  const [gap, setGap] = useState("8");
  const [itemCount, setItemCount] = useState(4);
  const [copied, setCopied] = useState(false);

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: direction as React.CSSProperties["flexDirection"],
    justifyContent,
    alignItems,
    flexWrap: flexWrap as React.CSSProperties["flexWrap"],
    gap: `${gap}px`,
    minHeight: "200px",
    padding: "16px",
  };

  const cssCode = `.container {
  display: flex;
  flex-direction: ${direction};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap}px;
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const directionOptions = [
    { value: "row", label: "row" },
    { value: "row-reverse", label: "row-reverse" },
    { value: "column", label: "column" },
    { value: "column-reverse", label: "column-reverse" },
  ];

  const justifyOptions = [
    { value: "flex-start", label: "flex-start" },
    { value: "flex-end", label: "flex-end" },
    { value: "center", label: "center" },
    { value: "space-between", label: "space-between" },
    { value: "space-around", label: "space-around" },
    { value: "space-evenly", label: "space-evenly" },
  ];

  const alignOptions = [
    { value: "stretch", label: "stretch" },
    { value: "flex-start", label: "flex-start" },
    { value: "flex-end", label: "flex-end" },
    { value: "center", label: "center" },
    { value: "baseline", label: "baseline" },
  ];

  const wrapOptions = [
    { value: "nowrap", label: "nowrap" },
    { value: "wrap", label: "wrap" },
    { value: "wrap-reverse", label: "wrap-reverse" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">CSS Flexbox生成</h1>
      <p className="text-gray-500 text-sm mb-6">
        Flexboxレイアウトを視覚的に作成し、CSSコードを生成します。
      </p>

      <AdBanner />

      <div className="grid lg:grid-cols-[300px,1fr] gap-6">
        {/* Controls */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-5">
          <h2 className="text-sm font-bold text-gray-800">コントロール</h2>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              flex-direction
            </label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm font-mono"
            >
              {directionOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              justify-content
            </label>
            <select
              value={justifyContent}
              onChange={(e) => setJustifyContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm font-mono"
            >
              {justifyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              align-items
            </label>
            <select
              value={alignItems}
              onChange={(e) => setAlignItems(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm font-mono"
            >
              {alignOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              flex-wrap
            </label>
            <select
              value={flexWrap}
              onChange={(e) => setFlexWrap(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm font-mono"
            >
              {wrapOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              gap: {gap}px
            </label>
            <input
              type="range"
              min={0}
              max={48}
              value={gap}
              onChange={(e) => setGap(e.target.value)}
              className="w-full accent-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">
              アイテム数: {itemCount}
            </label>
            <input
              type="range"
              min={1}
              max={12}
              value={itemCount}
              onChange={(e) => setItemCount(Number(e.target.value))}
              className="w-full accent-blue-500"
            />
          </div>
        </div>

        {/* Preview & Code */}
        <div className="space-y-4">
          {/* Preview */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              プレビュー
            </label>
            <div
              className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl"
              style={containerStyle}
            >
              {Array.from({ length: itemCount }, (_, i) => (
                <div
                  key={i}
                  className={`${colors[i % colors.length]} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm`}
                  style={{
                    minWidth: "60px",
                    minHeight: "60px",
                    padding: "12px 20px",
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* CSS Output */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              生成されたCSS
            </label>
            <div className="relative">
              <pre className="bg-gray-900 text-green-400 rounded-xl p-4 font-mono text-sm overflow-x-auto">
                {cssCode}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 px-3 py-1 bg-gray-700 text-gray-200 rounded text-xs font-medium hover:bg-gray-600"
              >
                {copied ? "コピー済み" : "コピー"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">
          CSS Flexbox生成ツールの使い方
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          左側のコントロールパネルでFlexboxのプロパティを調整すると、
          リアルタイムでプレビューとCSSコードが更新されます。
          flex-direction、justify-content、align-items、flex-wrap、gapを直感的に操作して
          理想のレイアウトを作成し、生成されたCSSをコピーしてプロジェクトに貼り付けてください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "Flexboxとは何ですか？",
            answer:
              "Flexbox（Flexible Box Layout）はCSSのレイアウトモジュールで、要素を横方向や縦方向に柔軟に配置できます。従来のfloatやpositionよりも直感的にレイアウトを組めるため、現在のWeb開発で広く使われています。",
          },
          {
            question: "justify-contentとalign-itemsの違いは？",
            answer:
              "justify-contentは主軸（flex-directionの方向）に沿った配置を制御します。align-itemsは交差軸（主軸と垂直な方向）に沿った配置を制御します。flex-direction: rowの場合、justify-contentは水平方向、align-itemsは垂直方向の配置になります。",
          },
          {
            question: "flex-wrapはいつ使いますか？",
            answer:
              "flex-wrapをwrapに設定すると、アイテムがコンテナからはみ出す場合に自動的に折り返されます。レスポンシブデザインで画面幅に応じてアイテムを折り返したい場合に便利です。デフォルトのnowrapでは折り返しが発生しません。",
          },
        ]}
      />

      <RelatedTools currentToolId="flexbox-gen" />
    </div>
  );
}
