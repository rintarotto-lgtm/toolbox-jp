"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

export default function MetaTagGen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [canonical, setCanonical] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDesc, setOgDesc] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [ogType, setOgType] = useState("website");
  const [ogUrl, setOgUrl] = useState("");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [robots, setRobots] = useState("index, follow");
  const [copied, setCopied] = useState(false);

  const lines: string[] = ['<meta charset="UTF-8">', '<meta name="viewport" content="width=device-width, initial-scale=1.0">'];
  if (title) lines.push(`<title>${title}</title>`);
  if (description) lines.push(`<meta name="description" content="${description}">`);
  if (keywords) lines.push(`<meta name="keywords" content="${keywords}">`);
  if (author) lines.push(`<meta name="author" content="${author}">`);
  if (robots) lines.push(`<meta name="robots" content="${robots}">`);
  if (canonical) lines.push(`<link rel="canonical" href="${canonical}">`);
  if (ogTitle || title) { lines.push(""); lines.push("<!-- Open Graph / Facebook -->"); lines.push(`<meta property="og:type" content="${ogType}">`); lines.push(`<meta property="og:title" content="${ogTitle || title}">`); }
  if (ogDesc || description) lines.push(`<meta property="og:description" content="${ogDesc || description}">`);
  if (ogUrl || canonical) lines.push(`<meta property="og:url" content="${ogUrl || canonical}">`);
  if (ogImage) lines.push(`<meta property="og:image" content="${ogImage}">`);
  if (ogTitle || title) { lines.push(""); lines.push("<!-- Twitter Card -->"); lines.push(`<meta name="twitter:card" content="${twitterCard}">`); lines.push(`<meta name="twitter:title" content="${ogTitle || title}">`); }
  if (ogDesc || description) lines.push(`<meta name="twitter:description" content="${ogDesc || description}">`);
  if (ogImage) lines.push(`<meta name="twitter:image" content="${ogImage}">`);

  const output = lines.join("\n");
  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const Field = ({ label, value, set, warn }: { label: string; value: string; set: (v: string) => void; warn?: number }) => (
    <div>
      <div className="flex justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {warn && value.length > 0 && <span className={`text-xs ${value.length > warn ? "text-red-500" : "text-gray-400"}`}>{value.length}/{warn}</span>}
      </div>
      <input type="text" value={value} onChange={(e) => set(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">メタタグ生成ツール</h1>
      <p className="text-gray-500 text-sm mb-6">SEO・SNS対応のHTMLメタタグを入力するだけで生成。</p>

      <AdBanner />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-bold text-gray-900">基本情報</h2>
            <Field label="タイトル" value={title} set={setTitle} warn={60} />
            <Field label="ディスクリプション" value={description} set={setDescription} warn={160} />
            <Field label="キーワード" value={keywords} set={setKeywords} />
            <Field label="著者" value={author} set={setAuthor} />
            <Field label="Canonical URL" value={canonical} set={setCanonical} />
            <div>
              <label className="text-sm font-medium text-gray-700">Robots</label>
              <select value={robots} onChange={(e) => setRobots(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h2 className="font-bold text-gray-900">OGP / Twitter Card</h2>
            <Field label="OG タイトル（空ならtitleを使用）" value={ogTitle} set={setOgTitle} />
            <Field label="OG ディスクリプション" value={ogDesc} set={setOgDesc} />
            <Field label="OG 画像URL" value={ogImage} set={setOgImage} />
            <Field label="OG URL" value={ogUrl} set={setOgUrl} />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">og:type</label>
                <select value={ogType} onChange={(e) => setOgType(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="website">website</option>
                  <option value="article">article</option>
                  <option value="product">product</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Twitter Card</label>
                <select value={twitterCard} onChange={(e) => setTwitterCard(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="summary">summary</option>
                  <option value="summary_large_image">summary_large_image</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {title && (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Google検索プレビュー</h3>
              <div className="space-y-1">
                <div className="text-blue-700 text-lg hover:underline cursor-pointer truncate">{title}</div>
                <div className="text-green-700 text-sm truncate">{canonical || "https://example.com"}</div>
                <div className="text-gray-600 text-sm line-clamp-2">{description || "ディスクリプションがここに表示されます..."}</div>
              </div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700">生成コード</h3>
              <button onClick={copy} className="px-4 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">{copied ? "OK!" : "コピー"}</button>
            </div>
            <pre className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono overflow-x-auto whitespace-pre max-h-[500px]">{output}</pre>
          </div>
        </div>
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "メタタグのSEO効果は？", answer: "titleタグとmeta descriptionは検索結果に直接表示されるため、CTR（クリック率）に大きく影響します。適切なキーワードを含めつつ、魅力的な文章にすることが重要です。" },
        { question: "OGPタグの重要性は？", answer: "OGP（Open Graph Protocol）タグはSNSでURLが共有された際の表示を制御します。適切に設定することで、SNSからの流入を増やすことができます。" },
        { question: "titleの最適な文字数は？", answer: "Googleの検索結果では約30〜35文字程度が表示されます。60文字以内に収め、重要なキーワードを前半に配置するのが効果的です。" },
      ]} />

      <RelatedTools currentToolId="meta-tag-gen" />
    </div>
  );
}
