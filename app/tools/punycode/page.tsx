"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

// Simple Punycode encoder/decoder
function punycodeEncode(input: string): string {
  try {
    const url = new URL(`http://${input}`);
    return url.hostname;
  } catch {
    return "";
  }
}

function punycodeDecode(input: string): string {
  try {
    const url = new URL(`http://${input}`);
    // Use IDN display
    const parts = input.split(".");
    return parts.map((part) => {
      if (part.startsWith("xn--")) {
        try {
          const testUrl = new URL(`http://${part}.example`);
          // Extract decoded hostname
          const decoded = testUrl.hostname.split(".")[0];
          return decoded;
        } catch { return part; }
      }
      return part;
    }).join(".");
  } catch {
    return "";
  }
}

export default function Punycode() {
  const [unicode, setUnicode] = useState("日本語.jp");
  const [puny, setPuny] = useState("");
  const [copied, setCopied] = useState("");

  const encode = () => {
    const result = punycodeEncode(unicode);
    setPuny(result);
  };

  const decode = () => {
    const result = punycodeDecode(puny);
    setUnicode(result || puny);
  };

  const copy = (text: string, key: string) => { navigator.clipboard.writeText(text); setCopied(key); setTimeout(() => setCopied(""), 1500); };

  const examples = [
    { unicode: "日本語.jp", desc: "日本語JPドメイン" },
    { unicode: "東京.jp", desc: "都市名ドメイン" },
    { unicode: "はじめよう.みんな", desc: ".みんなドメイン" },
    { unicode: "例え.jp", desc: "テスト用" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Punycode変換</h1>
      <p className="text-gray-500 text-sm mb-6">日本語ドメインとPunycode（xn--形式）を相互変換。</p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">Unicode（日本語ドメイン）</label>
            {unicode && <button onClick={() => copy(unicode, "u")} className="text-xs text-blue-600">{copied === "u" ? "OK!" : "コピー"}</button>}
          </div>
          <input type="text" value={unicode} onChange={(e) => setUnicode(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="日本語.jp" />
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={encode} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">↓ エンコード</button>
          <button onClick={decode} className="px-6 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700">↑ デコード</button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">Punycode（ASCII形式）</label>
            {puny && <button onClick={() => copy(puny, "p")} className="text-xs text-blue-600">{copied === "p" ? "OK!" : "コピー"}</button>}
          </div>
          <input type="text" value={puny} onChange={(e) => setPuny(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="xn--wgv71a309e.jp" />
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">変換例</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {examples.map((ex) => (
              <button key={ex.unicode} onClick={() => { setUnicode(ex.unicode); setPuny(""); }} className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                <span className="font-mono text-blue-700">{ex.unicode}</span>
                <span className="block text-xs text-gray-500">{ex.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "Punycodeとは？", answer: "国際化ドメイン名（IDN）をASCII文字のみで表現するエンコーディング方式です。「xn--」で始まる文字列に変換されます。DNS はASCIIのみ対応のため、この変換が必要です。" },
        { question: "日本語ドメインは実用的？", answer: "ブラウザのアドレスバーでは日本語表示されますが、メールやSNSでの共有時にPunycode形式になり長くなります。ブランディング目的で使われることがあります。" },
        { question: "Punycodeのセキュリティリスクは？", answer: "見た目が似た文字（ホモグラフ攻撃）を使ったフィッシングのリスクがあります。ブラウザは安全でないIDNを自動的にPunycode表示して対策しています。" },
      ]} />

      <RelatedTools currentToolId="punycode" />
    </div>
  );
}
