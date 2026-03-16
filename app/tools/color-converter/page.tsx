"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.replace("#", "").match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6");
  const [r, setR] = useState(59);
  const [g, setG] = useState(130);
  const [b, setB] = useState(246);

  const updateFromHex = (val: string) => {
    setHex(val);
    const rgb = hexToRgb(val);
    if (rgb) { setR(rgb[0]); setG(rgb[1]); setB(rgb[2]); }
  };

  const updateFromRgb = (nr: number, ng: number, nb: number) => {
    setR(nr); setG(ng); setB(nb);
    setHex(rgbToHex(nr, ng, nb));
  };

  const hsl = rgbToHsl(r, g, b);
  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">カラーコード変換</h1>
      <p className="text-gray-500 text-sm mb-6">
        HEX・RGB・HSLを相互変換。カラーピッカーで直感的に色を選択。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-20 h-20 rounded-lg border-0 cursor-pointer"
          />
          <div className="w-full h-20 rounded-lg border border-gray-200" style={{ backgroundColor: hex }} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">HEX</label>
            <div className="flex gap-2">
              <input value={hex} onChange={(e) => updateFromHex(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg font-mono text-sm" />
              <button onClick={() => copy(hex)} className="text-xs text-blue-600 shrink-0">Copy</button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">RGB</label>
            <div className="flex gap-2">
              <input value={`rgb(${r}, ${g}, ${b})`} readOnly
                className="w-full p-2 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50" />
              <button onClick={() => copy(`rgb(${r}, ${g}, ${b})`)} className="text-xs text-blue-600 shrink-0">Copy</button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">HSL</label>
            <div className="flex gap-2">
              <input value={`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`} readOnly
                className="w-full p-2 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50" />
              <button onClick={() => copy(`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`)} className="text-xs text-blue-600 shrink-0">Copy</button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {[
            { label: "R", value: r, set: (v: number) => updateFromRgb(v, g, b), color: "accent-red-500" },
            { label: "G", value: g, set: (v: number) => updateFromRgb(r, v, b), color: "accent-green-500" },
            { label: "B", value: b, set: (v: number) => updateFromRgb(r, g, v), color: "accent-blue-500" },
          ].map(({ label, value, set, color }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="w-4 text-sm font-mono text-gray-500">{label}</span>
              <input type="range" min={0} max={255} value={value} onChange={(e) => set(Number(e.target.value))}
                className={`flex-1 ${color}`} />
              <span className="w-8 text-sm font-mono text-gray-700 text-right">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <ToolFAQ faqs={[
        { question: "HEX、RGB、HSLの違いは何ですか？", answer: "HEXは16進数6桁で色を表現（例: #FF0000）。RGBは赤・緑・青の0-255の値で色を表現。HSLは色相・彩度・輝度で色を表現します。CSSではいずれの形式も使用できます。" },
        { question: "Webデザインではどのカラーコードを使うべきですか？", answer: "CSSではHEXが最も一般的です。透明度が必要な場合はRGBA、色の調整がしやすいのはHSLです。プロジェクトの規約に合わせて選択してください。" },
        { question: "カラーコードの変換は正確ですか？", answer: "はい、数学的に正確な変換を行います。HEX↔RGB は完全な変換が可能です。HSLへの変換では四捨五入により微小な誤差が生じる場合がありますが、視覚的な差はありません。" },
      ]} />
      <AdBanner />
      <RelatedTools currentToolId="color-converter" />
    </div>
  );
}
