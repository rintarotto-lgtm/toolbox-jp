"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

export default function OgPreview() {
  const [title, setTitle] = useState("ツールボックス - 無料オンラインツール集");
  const [description, setDescription] = useState("開発者・デザイナー向けの便利なオンラインツールを50種類以上無料で提供。");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("https://www.toolbox-jp.net");
  const [siteName, setSiteName] = useState("ツールボックス");
  const [preview, setPreview] = useState<"twitter" | "facebook" | "slack">("twitter");

  const Field = ({ label, value, set }: { label: string; value: string; set: (v: string) => void }) => (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input type="text" value={value} onChange={(e) => set(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
    </div>
  );

  const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">OGP画像プレビュー</h1>
      <p className="text-gray-500 text-sm mb-6">SNSでシェアされた時の表示をプレビュー確認。</p>

      <AdBanner />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-bold text-gray-900">OGPデータ入力</h2>
          <Field label="og:title" value={title} set={setTitle} />
          <Field label="og:description" value={description} set={setDescription} />
          <Field label="og:image（URL）" value={image} set={setImage} />
          <Field label="og:url" value={url} set={setUrl} />
          <Field label="og:site_name" value={siteName} set={setSiteName} />
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            {(["twitter", "facebook", "slack"] as const).map((p) => (
              <button key={p} onClick={() => setPreview(p)} className={`px-3 py-1.5 rounded-lg text-sm ${preview === p ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
                {p === "twitter" ? "X (Twitter)" : p === "facebook" ? "Facebook" : "Slack"}
              </button>
            ))}
          </div>

          {preview === "twitter" && (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden max-w-md">
              {image && (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                  <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              <div className="p-3">
                <div className="text-xs text-gray-500">{domain}</div>
                <div className="font-bold text-sm text-gray-900 line-clamp-2">{title}</div>
                <div className="text-xs text-gray-500 line-clamp-2 mt-0.5">{description}</div>
              </div>
            </div>
          )}

          {preview === "facebook" && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden max-w-md">
              {image && (
                <div className="w-full h-52 bg-gray-200 overflow-hidden">
                  <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              <div className="p-3 bg-gray-50">
                <div className="text-xs text-gray-500 uppercase">{domain}</div>
                <div className="font-bold text-sm text-gray-900 mt-1">{title}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-1">{description}</div>
              </div>
            </div>
          )}

          {preview === "slack" && (
            <div className="max-w-md">
              <div className="border-l-4 border-gray-300 pl-3 py-1">
                <div className="text-xs font-bold text-gray-500">{siteName}</div>
                <div className="text-blue-600 font-bold text-sm hover:underline">{title}</div>
                <div className="text-xs text-gray-600 mt-1 line-clamp-2">{description}</div>
                {image && (
                  <div className="mt-2 w-48 h-24 bg-gray-200 rounded overflow-hidden">
                    <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "OGPとは？", answer: "Open Graph Protocolの略で、SNSでURLがシェアされた時の表示内容を制御するメタタグの仕様です。Facebook が策定し、Twitter、Slack等でも広く採用されています。" },
        { question: "最適なOGP画像サイズは？", answer: "推奨サイズは1200×630ピクセルです。Twitterのsummary_large_imageカードとFacebookの両方で最適に表示されます。" },
        { question: "OGPが反映されない場合は？", answer: "SNSはOGP情報をキャッシュするため、更新が即反映されないことがあります。TwitterではCard Validator、FacebookではSharing Debuggerでキャッシュをクリアできます。" },
      ]} />

      <RelatedTools currentToolId="og-preview" />
    </div>
  );
}
