"use client";

import { useState, useMemo, useCallback } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type SchemeType = "complementary" | "analogous" | "triadic" | "split-complementary";

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  const sn = s / 100;
  const ln = l / 100;

  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;

  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }

  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function generatePalette(hex: string, scheme: SchemeType): string[] {
  const [h, s, l] = hexToHsl(hex);

  switch (scheme) {
    case "complementary":
      return [
        hex,
        hslToHex(h, Math.max(s - 15, 0), Math.min(l + 15, 100)),
        hslToHex(h + 180, s, l),
        hslToHex(h + 180, Math.max(s - 15, 0), Math.min(l + 15, 100)),
        hslToHex(h, s, Math.max(l - 20, 0)),
      ];
    case "analogous":
      return [
        hslToHex(h - 30, s, l),
        hslToHex(h - 15, s, l),
        hex,
        hslToHex(h + 15, s, l),
        hslToHex(h + 30, s, l),
      ];
    case "triadic":
      return [
        hex,
        hslToHex(h + 120, s, l),
        hslToHex(h + 240, s, l),
        hslToHex(h, Math.max(s - 20, 0), Math.min(l + 20, 100)),
        hslToHex(h + 120, Math.max(s - 20, 0), Math.min(l + 20, 100)),
      ];
    case "split-complementary":
      return [
        hex,
        hslToHex(h + 150, s, l),
        hslToHex(h + 210, s, l),
        hslToHex(h + 150, Math.max(s - 15, 0), Math.min(l + 15, 100)),
        hslToHex(h + 210, Math.max(s - 15, 0), Math.min(l + 15, 100)),
      ];
  }
}

const schemes: { id: SchemeType; name: string }[] = [
  { id: "complementary", name: "補色" },
  { id: "analogous", name: "類似色" },
  { id: "triadic", name: "トライアド" },
  { id: "split-complementary", name: "スプリット補色" },
];

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [scheme, setScheme] = useState<SchemeType>("complementary");
  const [copied, setCopied] = useState<string | null>(null);

  const palette = useMemo(
    () => generatePalette(baseColor, scheme),
    [baseColor, scheme]
  );

  const copyColor = useCallback((color: string) => {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">カラーパレット生成</h1>
      <p className="text-gray-500 text-sm mb-6">
        ベースカラーから配色スキームに基づいたカラーパレットを自動生成します。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              ベースカラー
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(e) => {
                  const v = e.target.value;
                  if (/^#[0-9a-fA-F]{6}$/.test(v)) setBaseColor(v);
                }}
                className="w-28 p-2 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              配色スキーム
            </label>
            <div className="flex flex-wrap gap-2">
              {schemes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setScheme(s.id)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    scheme === s.id
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Palette display */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 h-32">
          {palette.map((color, i) => (
            <div
              key={i}
              className="flex-1 cursor-pointer relative group transition-all hover:flex-[1.3]"
              style={{ backgroundColor: color }}
              onClick={() => copyColor(color)}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <span className="text-white text-xs font-mono font-bold bg-black/50 px-2 py-1 rounded">
                  {copied === color ? "コピー済み!" : color}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Color details */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {palette.map((color, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-3 text-center"
            >
              <div
                className="w-full h-16 rounded-lg mb-2 border border-gray-100"
                style={{ backgroundColor: color }}
              />
              <button
                onClick={() => copyColor(color)}
                className="text-xs font-mono font-medium text-gray-800 hover:text-blue-600 transition-colors"
              >
                {color.toUpperCase()}
              </button>
              <div className="text-xs text-gray-400 mt-1">{hexToRgb(color)}</div>
              {copied === color && (
                <div className="text-xs text-green-600 mt-1">コピー済み</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">カラーパレット生成ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          ベースカラーを選択し、配色スキーム（補色・類似色・トライアド・スプリット補色）を選ぶと、
          5色のカラーパレットが自動生成されます。各色をクリックするとHEXコードがクリップボードにコピーされます。
          Webデザイン、UIデザイン、ブランディングの配色選定にご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "補色とは何ですか？",
            answer:
              "補色は色相環で正反対に位置する色のことです。コントラストが強く、互いを引き立てる効果があります。アクセントカラーとして使うと目を引くデザインになります。",
          },
          {
            question: "トライアドとスプリット補色の違いは？",
            answer:
              "トライアドは色相環を3等分した位置の3色を使う配色です。スプリット補色は補色の両隣の色を使う配色で、補色よりも柔らかい印象になります。",
          },
          {
            question: "生成された色をそのまま使っても大丈夫ですか？",
            answer:
              "配色の出発点として最適です。実際のデザインでは、コントラスト比やアクセシビリティ（WCAG基準）も考慮して微調整することをお勧めします。",
          },
          {
            question: "入力データはサーバーに送信されますか？",
            answer:
              "いいえ。すべての計算はブラウザ上で行われるため、データがサーバーに送信されることはありません。",
          },
        ]}
      />

      <RelatedTools currentToolId="color-palette" />
    </div>
  );
}
