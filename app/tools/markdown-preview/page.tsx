"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function parseMarkdown(md: string): string {
  let html = md
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // Headers
    .replace(/^### (.+)$/gm, "<h3 class='text-lg font-bold mt-4 mb-2'>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2 class='text-xl font-bold mt-5 mb-2'>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1 class='text-2xl font-bold mt-6 mb-3'>$1</h1>")
    // Bold & italic
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Code
    .replace(/`(.+?)`/g, "<code class='bg-gray-100 px-1 py-0.5 rounded text-sm font-mono'>$1</code>")
    // Unordered list
    .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc'>$1</li>")
    // Ordered list
    .replace(/^\d+\. (.+)$/gm, "<li class='ml-4 list-decimal'>$1</li>")
    // Blockquote
    .replace(/^&gt; (.+)$/gm, "<blockquote class='border-l-4 border-gray-300 pl-4 text-gray-600 italic'>$1</blockquote>")
    // Horizontal rule
    .replace(/^---$/gm, "<hr class='my-4 border-gray-300' />")
    // Line breaks
    .replace(/\n\n/g, "</p><p class='mb-3'>")
    .replace(/\n/g, "<br />");

  return `<p class='mb-3'>${html}</p>`;
}

const sampleMd = `# Markdownプレビュー

## 見出し2

これは**太字**と*斜体*のテストです。

- リスト項目1
- リスト項目2
- リスト項目3

\`inline code\` もサポートしています。

> 引用テキスト

---

1. 番号付きリスト
2. 番号付きリスト`;

export default function MarkdownPreview() {
  const [md, setMd] = useState(sampleMd);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Markdownプレビュー</h1>
      <p className="text-gray-500 text-sm mb-6">
        Markdownをリアルタイムでプレビューします。
      </p>

      <AdBanner />

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Markdown入力</label>
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            className="w-full h-96 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">プレビュー</label>
          <div
            className="w-full h-96 p-4 border border-gray-200 rounded-lg bg-white overflow-y-auto text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(md) }}
          />
        </div>
      </div>

      <AdBanner />
      <ToolFAQ faqs={[
        { question: "Markdownとは何ですか？", answer: "Markdownは、テキストを簡単な記法で構造化できる軽量マークアップ言語です。見出し、太字、リスト、リンクなどをシンプルな記号で記述でき、GitHubのREADMEやブログ記事、技術ドキュメントで広く使われています。" },
        { question: "Markdownプレビューの使い方は？", answer: "左側のエディタにMarkdown記法でテキストを入力すると、右側にリアルタイムでHTML変換されたプレビューが表示されます。見出し（#）、太字（**）、リスト（-）などの基本記法に対応しています。" },
        { question: "Markdownで使える主な記法は？", answer: "主な記法として、# 見出し、** 太字 **、* 斜体 *、- 箇条書きリスト、1. 番号付きリスト、> 引用、` インラインコード `、--- 水平線などがあります。" },
      ]} />
      <RelatedTools currentToolId="markdown-preview" />
    </div>
  );
}
