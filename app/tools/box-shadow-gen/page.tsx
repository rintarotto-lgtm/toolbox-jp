"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface Shadow { x: number; y: number; blur: number; spread: number; color: string; opacity: number; inset: boolean; }

const defaultShadow: Shadow = { x: 4, y: 4, blur: 15, spread: 0, color: "#000000", opacity: 0.2, inset: false };

const presets: { name: string; shadows: Shadow[] }[] = [
  { name: "ソフト", shadows: [{ x: 0, y: 2, blur: 15, spread: -3, color: "#000000", opacity: 0.1, inset: false }] },
  { name: "ミディアム", shadows: [{ x: 0, y: 4, blur: 20, spread: 0, color: "#000000", opacity: 0.15, inset: false }] },
  { name: "ハード", shadows: [{ x: 0, y: 10, blur: 30, spread: -5, color: "#000000", opacity: 0.3, inset: false }] },
  { name: "フラット", shadows: [{ x: 5, y: 5, blur: 0, spread: 0, color: "#000000", opacity: 0.2, inset: false }] },
  { name: "インセット", shadows: [{ x: 0, y: 2, blur: 10, spread: 0, color: "#000000", opacity: 0.15, inset: true }] },
  { name: "ネオ", shadows: [{ x: 5, y: 5, blur: 10, spread: 0, color: "#000000", opacity: 0.15, inset: false }, { x: -5, y: -5, blur: 10, spread: 0, color: "#ffffff", opacity: 0.8, inset: false }] },
];

function hexToRgba(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function shadowToCss(shadows: Shadow[]) {
  return shadows.map((s) => `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${hexToRgba(s.color, s.opacity)}`).join(", ");
}

export default function BoxShadowGen() {
  const [shadows, setShadows] = useState<Shadow[]>([{ ...defaultShadow }]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const active = shadows[activeIndex] || shadows[0];
  const css = shadowToCss(shadows);

  const update = (field: keyof Shadow, value: number | string | boolean) => {
    const next = [...shadows];
    next[activeIndex] = { ...next[activeIndex], [field]: value };
    setShadows(next);
  };

  const addShadow = () => { setShadows([...shadows, { ...defaultShadow }]); setActiveIndex(shadows.length); };
  const removeShadow = (i: number) => {
    if (shadows.length <= 1) return;
    const next = shadows.filter((_, idx) => idx !== i);
    setShadows(next);
    setActiveIndex(Math.min(activeIndex, next.length - 1));
  };

  const copy = () => { navigator.clipboard.writeText(`box-shadow: ${css};`); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const sliders: { label: string; field: keyof Shadow; min: number; max: number; step?: number; unit: string }[] = [
    { label: "水平", field: "x", min: -50, max: 50, unit: "px" },
    { label: "垂直", field: "y", min: -50, max: 50, unit: "px" },
    { label: "ぼかし", field: "blur", min: 0, max: 100, unit: "px" },
    { label: "広がり", field: "spread", min: -50, max: 50, unit: "px" },
    { label: "不透明度", field: "opacity", min: 0, max: 1, step: 0.05, unit: "" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">CSSボックスシャドウ生成</h1>
      <p className="text-gray-500 text-sm mb-6">box-shadowをスライダーで直感操作。複数レイヤーにも対応。</p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-center p-16 bg-gray-100 rounded-xl">
          <div className="w-48 h-48 bg-white rounded-xl" style={{ boxShadow: css }} />
        </div>

        <div className="flex gap-2 flex-wrap items-center">
          {shadows.map((_, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} className={`px-3 py-1 rounded-lg text-sm ${i === activeIndex ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
              影 {i + 1} {shadows.length > 1 && <span onClick={(e) => { e.stopPropagation(); removeShadow(i); }} className="ml-1 text-xs">×</span>}
            </button>
          ))}
          <button onClick={addShadow} className="px-3 py-1 rounded-lg text-sm border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50">+ 追加</button>
        </div>

        {sliders.map(({ label, field, min, max, step, unit }) => (
          <div key={field} className="flex items-center gap-3">
            <span className="text-sm text-gray-600 w-20">{label}</span>
            <input type="range" min={min} max={max} step={step || 1} value={active[field] as number} onChange={(e) => update(field, Number(e.target.value))} className="flex-1 accent-blue-600" />
            <span className="text-sm font-mono w-16 text-right">{active[field]}{unit}</span>
          </div>
        ))}

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">色:</span>
            <input type="color" value={active.color} onChange={(e) => update("color", e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={active.inset} onChange={(e) => update("inset", e.target.checked)} className="accent-blue-600" />
            inset（内側）
          </label>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">CSS</span>
            <button onClick={copy} className="px-4 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">{copied ? "OK!" : "コピー"}</button>
          </div>
          <code className="text-sm font-mono text-gray-900 break-all">box-shadow: {css};</code>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">プリセット</h3>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {presets.map((p) => (
              <button key={p.name} onClick={() => { setShadows(p.shadows.map((s) => ({ ...s }))); setActiveIndex(0); }} className="group text-center">
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded" style={{ boxShadow: shadowToCss(p.shadows) }} />
                </div>
                <span className="text-[10px] text-gray-500">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "box-shadowの各値の意味は？", answer: "左から順に、水平オフセット、垂直オフセット、ぼかし半径、広がり半径、色です。insetを付けると内側の影になります。" },
        { question: "複数の影を重ねるメリットは？", answer: "複数の影を組み合わせることで、よりリアルで立体的な表現が可能になります。ネオモーフィズムのようなデザインも影の重ね合わせで実現できます。" },
        { question: "パフォーマンスへの影響は？", answer: "box-shadowはGPU合成レイヤーを使用しないため、多用するとレンダリングコストが高くなります。アニメーションにはtransformの使用を検討してください。" },
      ]} />

      <RelatedTools currentToolId="box-shadow-gen" />
    </div>
  );
}
