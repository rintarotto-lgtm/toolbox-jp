"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const presets = [
  { name: "フルHD", w: 1920, h: 1080 },
  { name: "4K", w: 3840, h: 2160 },
  { name: "Instagram正方形", w: 1080, h: 1080 },
  { name: "Instagram縦長", w: 1080, h: 1350 },
  { name: "YouTube", w: 1920, h: 1080 },
  { name: "Twitter画像", w: 1200, h: 675 },
  { name: "OGP画像", w: 1200, h: 630 },
  { name: "A4縦", w: 2480, h: 3508 },
];

export default function AspectRatioTool() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  const g = gcd(width || 1, height || 1);
  const ratioW = (width || 1) / g;
  const ratioH = (height || 1) / g;
  const decimal = ((width || 1) / (height || 1)).toFixed(4);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">アスペクト比計算</h1>
      <p className="text-gray-500 text-sm mb-6">
        画像・動画のアスペクト比を計算。SNSや動画サイトの推奨サイズも一覧表示。
      </p>

      <AdBanner />

      <div className="space-y-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">幅（px）</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <span className="text-xl text-gray-400 pb-3">×</span>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">高さ（px）</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-600 mb-1">アスペクト比</p>
          <p className="text-3xl font-bold text-blue-800">{ratioW} : {ratioH}</p>
          <p className="text-sm text-blue-500 mt-1">（{decimal}）</p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-gray-700 mb-3">プリセット一覧</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((p) => {
              const pg = gcd(p.w, p.h);
              return (
                <button
                  key={p.name}
                  onClick={() => { setWidth(p.w); setHeight(p.h); }}
                  className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <p className="text-xs font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.w}×{p.h}</p>
                  <p className="text-xs text-blue-600 font-mono">{p.w / pg}:{p.h / pg}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <AdBanner />
      <RelatedTools currentToolId="aspect-ratio" />
    </div>
  );
}
