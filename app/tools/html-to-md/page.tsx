"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function htmlToMarkdown(html: string): string {
  let md = html;
  // Remove scripts and styles
  md = md.replace(/<script[\s\S]*?<\/script>/gi, "");
  md = md.replace(/<style[\s\S]*?<\/style>/gi, "");
  // Headings
  md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, "\n# $1\n");
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, "\n## $1\n");
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, "\n### $1\n");
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, "\n#### $1\n");
  md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, "\n##### $1\n");
  md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, "\n###### $1\n");
  // Bold and italic
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, "**$2**");
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, "*$2*");
  md = md.replace(/<(del|s|strike)[^>]*>([\s\S]*?)<\/(del|s|strike)>/gi, "~~$2~~");
  // Code
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, "`$1`");
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, "\n```\n$1\n```\n");
  // Links and images
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, "[$2]($1)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)");
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*\/?>/gi, "![$1]($2)");
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)");
  // Lists
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, "- $1\n");
  md = md.replace(/<\/?[uo]l[^>]*>/gi, "\n");
  // Line breaks and paragraphs
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, "\n$1\n");
  // Blockquote
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, content) => {
    return "\n" + content.trim().split("\n").map((l: string) => "> " + l.trim()).join("\n") + "\n";
  });
  // HR
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n");
  // Remove remaining tags
  md = md.replace(/<[^>]+>/g, "");
  // Decode entities
  md = md.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g," ");
  // Clean up whitespace
  md = md.replace(/\n{3,}/g, "\n\n").trim();
  return md;
}

const SAMPLE = `<h1>サンプル記事</h1>
<p>これは<strong>太字</strong>と<em>斜体</em>のテストです。</p>
<h2>リスト</h2>
<ul>
  <li>項目1</li>
  <li>項目2</li>
  <li>項目3</li>
</ul>
<p>リンク: <a href="https://example.com">Example</a></p>
<blockquote>引用テキストです。</blockquote>
<pre><code>console.log("Hello");</code></pre>`;

export default function HtmlToMd() {
  const [input, setInput] = useState(SAMPLE);
  const output = htmlToMarkdown(input);
  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">HTML → Markdown変換</h1>
      <p className="text-gray-500 text-sm mb-6">HTMLコードをMarkdown形式に変換。ブログ移行やドキュメント変換に便利。</p>
      <AdBanner />
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div><label className="text-sm font-medium text-gray-700 mb-1 block">HTML入力</label><textarea value={input} onChange={e=>setInput(e.target.value)} placeholder="HTMLコードを貼り付け..." className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div>
          <div className="flex justify-between items-center mb-1"><label className="text-sm font-medium text-gray-700">Markdown出力</label><button onClick={copy} disabled={!output} className="text-xs text-blue-600 hover:underline disabled:opacity-40">コピー</button></div>
          <textarea value={output} readOnly className="w-full h-40 p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 resize-y" />
        </div>
      </div>
      <ToolFAQ faqs={[
        { question: "どのHTMLタグに対応していますか？", answer: "見出し(h1-h6)、段落(p)、太字(strong/b)、斜体(em/i)、リンク(a)、画像(img)、リスト(ul/ol/li)、コード(code/pre)、引用(blockquote)、水平線(hr)、改行(br)に対応しています。" },
        { question: "複雑なHTMLも変換できますか？", answer: "基本的なHTML構造は変換できますが、CSSスタイルやJavaScript、テーブル(table)など複雑な要素は正確に変換できない場合があります。その場合は手動で調整してください。" },
        { question: "WordPressからの移行に使えますか？", answer: "はい、WordPressの記事HTMLをコピーしてこのツールに貼り付ければ、Markdown形式に変換できます。画像URLはそのまま保持されます。" },
      ]} />
      <AdBanner />
      <RelatedTools currentToolId="html-to-md" />
    </div>
  );
}
