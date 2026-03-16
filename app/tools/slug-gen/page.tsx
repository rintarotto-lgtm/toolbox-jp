"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s\u3000-\u9fff\uff00-\uffef-]/g, "")
    .replace(/[\s\u3000]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toAsciiSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function SlugGen() {
  const [input, setInput] = useState("My Blog Post Title - ブログ記事");
  const [separator, setSeparator] = useState("-");

  const slug = toSlug(input).replace(/-/g, separator);
  const asciiSlug = toAsciiSlug(input).replace(/-/g, separator);
  const encodedSlug = encodeURIComponent(toSlug(input).replace(/-/g, separator));
  const copy = (t: string) => navigator.clipboard.writeText(t);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">スラッグ生成</h1>
      <p className="text-gray-500 text-sm mb-6">テキストからURL用のスラッグを生成。SEOに最適なURLを簡単作成。</p>
      <AdBanner />
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">入力テキスト</label>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="タイトルやテキストを入力..."
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-gray-600">区切り文字:</span>
          {["-","_"].map(s => (
            <button key={s} onClick={() => setSeparator(s)}
              className={`px-3 py-1 rounded text-sm font-mono ${separator===s?"bg-blue-600 text-white":"bg-gray-100 text-gray-700"}`}>{s === "-" ? "ハイフン (-)" : "アンダースコア (_)"}</button>
          ))}
        </div>
        <div className="space-y-3">
          {[
            { label: "スラッグ（Unicode）", value: slug },
            { label: "スラッグ（ASCII only）", value: asciiSlug },
            { label: "URLエンコード済み", value: encodedSlug },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center gap-2 bg-gray-50 rounded-lg p-3">
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">{label}</div>
                <div className="font-mono text-sm text-gray-800 break-all">{value || "（入力してください）"}</div>
              </div>
              <button onClick={() => copy(value)} className="text-xs text-blue-600 hover:underline shrink-0">Copy</button>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-1">プレビュー URL</div>
          <div className="font-mono text-sm text-green-700">https://example.com/blog/<span className="font-bold">{asciiSlug || slug || "your-slug-here"}</span></div>
        </div>
      </div>
      <ToolFAQ faqs={[
        { question: "スラッグ（slug）とは？", answer: "スラッグはURLの一部として使われる、人間が読みやすい文字列です。例えば「/blog/my-first-post」の「my-first-post」がスラッグです。SEOにも影響するため、適切なスラッグ設定が重要です。" },
        { question: "SEOに最適なスラッグとは？", answer: "英語の小文字とハイフンで構成し、簡潔にキーワードを含めるのが理想です。日本語スラッグも使えますが、URLが長くなるためASCIIスラッグが一般的に推奨されます。" },
        { question: "日本語URLはSEOに不利ですか？", answer: "Googleは日本語URLを問題なく処理できます。ただし、日本語URLはコピー時にエンコードされて長くなるため、英語スラッグの方が扱いやすいケースが多いです。" },
      ]} />
      <AdBanner />
      <RelatedTools currentToolId="slug-gen" />
    </div>
  );
}
