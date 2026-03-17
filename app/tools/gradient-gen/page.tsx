"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface ColorStop { color: string; position: number; }

const presetGradients = [
  { name: "サンセット", stops: [{ color: "#ff6b6b", position: 0 }, { color: "#feca57", position: 100 }] },
  { name: "オーシャン", stops: [{ color: "#667eea", position: 0 }, { color: "#764ba2", position: 100 }] },
  { name: "グリーン", stops: [{ color: "#11998e", position: 0 }, { color: "#38ef7d", position: 100 }] },
  { name: "ピンク", stops: [{ color: "#f093fb", position: 0 }, { color: "#f5576c", position: 100 }] },
  { name: "ダーク", stops: [{ color: "#0f0c29", position: 0 }, { color: "#302b63", position: 50 }, { color: "#24243e", position: 100 }] },
  { name: "スカイ", stops: [{ color: "#a1c4fd", position: 0 }, { color: "#c2e9fb", position: 100 }] },
  { name: "ファイヤー", stops: [{ color: "#f12711", position: 0 }, { color: "#f5af19", position: 100 }] },
  { name: "ミント", stops: [{ color: "#00b09b", position: 0 }, { color: "#96c93d", position: 100 }] },
];

export default function GradientGen() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: "#667eea", position: 0 },
    { color: "#764ba2", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(", ");
  const css = type === "linear"
    ? `linear-gradient(${angle}deg, ${stopsStr})`
    : `radial-gradient(circle, ${stopsStr})`;

  const addStop = () => {
    setStops([...stops, { color: "#ffffff", position: 50 }]);
  };

  const removeStop = (i: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, idx) => idx !== i));
  };

  const updateStop = (i: number, field: keyof ColorStop, value: string | number) => {
    const next = [...stops];
    next[i] = { ...next[i], [field]: value };
    setStops(next);
  };

  const copy = () => { navigator.clipboard.writeText(`background: ${css};`); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">CSSグラデーション生成</h1>
      <p className="text-gray-500 text-sm mb-6">視覚的にグラデーションを作成。CSSコードをそのままコピー。</p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div className="w-full h-48 rounded-xl border border-gray-200" style={{ background: css }} />

        <div className="flex flex-wrap gap-3 items-center">
          <select value={type} onChange={(e) => setType(e.target.value as "linear" | "radial")} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="linear">linear-gradient</option>
            <option value="radial">radial-gradient</option>
          </select>
          {type === "linear" && (
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">角度:</label>
              <input type="range" min={0} max={360} value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="accent-blue-600" />
              <span className="text-sm font-mono w-12">{angle}°</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">カラーストップ</span>
            <button onClick={addStop} className="text-xs text-blue-600 hover:underline">+ 追加</button>
          </div>
          {stops.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <input type="color" value={s.color} onChange={(e) => updateStop(i, "color", e.target.value)} className="w-10 h-10 rounded cursor-pointer border-0" />
              <input type="text" value={s.color} onChange={(e) => updateStop(i, "color", e.target.value)} className="w-24 px-2 py-1 border border-gray-300 rounded text-sm font-mono" />
              <input type="range" min={0} max={100} value={s.position} onChange={(e) => updateStop(i, "position", Number(e.target.value))} className="flex-1 accent-blue-600" />
              <span className="text-sm font-mono w-10">{s.position}%</span>
              {stops.length > 2 && <button onClick={() => removeStop(i)} className="text-red-400 hover:text-red-600 text-lg">×</button>}
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">CSS</span>
            <button onClick={copy} className="px-4 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50">{copied ? "OK!" : "コピー"}</button>
          </div>
          <code className="text-sm font-mono text-gray-900 break-all">background: {css};</code>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">プリセット</h3>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {presetGradients.map((p) => {
              const bg = `linear-gradient(135deg, ${p.stops.map((s) => `${s.color} ${s.position}%`).join(", ")})`;
              return (
                <button key={p.name} onClick={() => { setStops(p.stops); setType("linear"); setAngle(135); }} className="group text-center">
                  <div className="w-full aspect-square rounded-lg border border-gray-200 group-hover:ring-2 group-hover:ring-blue-400" style={{ background: bg }} />
                  <span className="text-[10px] text-gray-500">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AdBanner />

      <ToolFAQ faqs={[
        { question: "linear-gradientとradial-gradientの違いは？", answer: "linear-gradientは直線方向にグラデーションが変化し、角度で方向を指定します。radial-gradientは中心から外側に向かって変化します。" },
        { question: "グラデーションのブラウザ対応は？", answer: "現在のモダンブラウザはすべてCSS3グラデーションに対応しています。IE9以下のみ非対応ですが、現在のブラウザシェアではほぼ問題ありません。" },
        { question: "カラーストップとは？", answer: "グラデーション上の各色の位置を指定するポイントです。位置はパーセンテージで指定し、ブラウザが各ストップ間の色を自動的に補間します。" },
      ]} />

      <RelatedTools currentToolId="gradient-gen" />
    </div>
  );
}
