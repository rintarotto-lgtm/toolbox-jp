"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Category = "length" | "weight" | "temperature" | "data" | "time";

interface UnitDef {
  name: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const categories: { key: Category; label: string }[] = [
  { key: "length", label: "長さ" },
  { key: "weight", label: "重さ" },
  { key: "temperature", label: "温度" },
  { key: "data", label: "データ容量" },
  { key: "time", label: "時間" },
];

const units: Record<Category, Record<string, UnitDef>> = {
  length: {
    mm: { name: "ミリメートル (mm)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    cm: { name: "センチメートル (cm)", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    m: { name: "メートル (m)", toBase: (v) => v, fromBase: (v) => v },
    km: { name: "キロメートル (km)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    in: { name: "インチ (in)", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ft: { name: "フィート (ft)", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    yd: { name: "ヤード (yd)", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    mi: { name: "マイル (mi)", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    sun: { name: "寸", toBase: (v) => v * 0.03030303, fromBase: (v) => v / 0.03030303 },
    shaku: { name: "尺", toBase: (v) => v * 0.3030303, fromBase: (v) => v / 0.3030303 },
  },
  weight: {
    mg: { name: "ミリグラム (mg)", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    g: { name: "グラム (g)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    kg: { name: "キログラム (kg)", toBase: (v) => v, fromBase: (v) => v },
    t: { name: "トン (t)", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    oz: { name: "オンス (oz)", toBase: (v) => v * 0.028349523, fromBase: (v) => v / 0.028349523 },
    lb: { name: "ポンド (lb)", toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
    kan: { name: "貫", toBase: (v) => v * 3.75, fromBase: (v) => v / 3.75 },
    monme: { name: "匁", toBase: (v) => v * 0.00375, fromBase: (v) => v / 0.00375 },
  },
  temperature: {
    c: { name: "摂氏 (°C)", toBase: (v) => v, fromBase: (v) => v },
    f: { name: "華氏 (°F)", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    k: { name: "ケルビン (K)", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
  data: {
    b: { name: "バイト (B)", toBase: (v) => v, fromBase: (v) => v },
    kb: { name: "キロバイト (KB)", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    mb: { name: "メガバイト (MB)", toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
    gb: { name: "ギガバイト (GB)", toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
    tb: { name: "テラバイト (TB)", toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
    bit: { name: "ビット (bit)", toBase: (v) => v / 8, fromBase: (v) => v * 8 },
    kib: { name: "キビバイト (KiB)", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    mib: { name: "メビバイト (MiB)", toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
  },
  time: {
    ms: { name: "ミリ秒 (ms)", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    s: { name: "秒 (s)", toBase: (v) => v, fromBase: (v) => v },
    min: { name: "分 (min)", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    h: { name: "時間 (h)", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    d: { name: "日 (d)", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    w: { name: "週 (w)", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    mo: { name: "月（30日）", toBase: (v) => v * 2592000, fromBase: (v) => v / 2592000 },
    y: { name: "年（365日）", toBase: (v) => v * 31536000, fromBase: (v) => v / 31536000 },
  },
};

function formatNumber(n: number): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e15 || (Math.abs(n) < 1e-10 && n !== 0)) {
    return n.toExponential(6);
  }
  // Remove trailing zeros
  const str = n.toPrecision(10);
  return parseFloat(str).toString();
}

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [value, setValue] = useState("1");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("cm");

  const unitKeys = Object.keys(units[category]);

  // Reset units when category changes
  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    const keys = Object.keys(units[cat]);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
    setValue("1");
  };

  const result = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    const base = units[category][fromUnit].toBase(num);
    const converted = units[category][toUnit].fromBase(base);
    return formatNumber(converted);
  }, [value, category, fromUnit, toUnit]);

  // Show all conversions
  const allResults = useMemo(() => {
    const num = parseFloat(value);
    if (isNaN(num)) return [];
    const base = units[category][fromUnit].toBase(num);
    return Object.entries(units[category])
      .filter(([key]) => key !== fromUnit)
      .map(([key, def]) => ({
        key,
        name: def.name,
        value: formatNumber(def.fromBase(base)),
      }));
  }, [value, category, fromUnit]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">単位変換</h1>
      <p className="text-gray-500 text-sm mb-6">
        長さ・重さ・温度・データ容量・時間の単位をリアルタイムで変換します。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                category === key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Converter */}
        <div className="grid sm:grid-cols-[1fr,auto,1fr] gap-4 items-end">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              変換元
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-2"
            >
              {unitKeys.map((key) => (
                <option key={key} value={key}>
                  {units[category][key].name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="値を入力"
            />
          </div>

          <div className="flex items-center justify-center py-2">
            <button
              onClick={() => {
                setFromUnit(toUnit);
                setToUnit(fromUnit);
              }}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="入れ替え"
            >
              ⇄
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              変換先
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm mb-2"
            >
              {unitKeys.map((key) => (
                <option key={key} value={key}>
                  {units[category][key].name}
                </option>
              ))}
            </select>
            <div className="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm bg-gray-50 min-h-[46px]">
              {result}
            </div>
          </div>
        </div>

        {/* All conversions */}
        {allResults.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              すべての変換結果
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allResults.map(({ key, name, value: val }) => (
                <div
                  key={key}
                  className={`flex justify-between items-center p-2 rounded-lg text-sm ${
                    key === toUnit
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-50"
                  }`}
                >
                  <span className="text-gray-600">{name}</span>
                  <span className="font-mono font-medium text-gray-800">
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">単位変換ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          カテゴリ（長さ・重さ・温度・データ容量・時間）を選択し、変換元の単位と値を入力すると
          リアルタイムで変換結果が表示されます。すべての単位への変換結果も一覧で確認できます。
          日本の伝統的な単位（尺、寸、貫、匁）にも対応しています。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "データ容量のKBとKiBの違いは何ですか？",
            answer:
              "KB（キロバイト）は1000バイト、KiB（キビバイト）は1024バイトです。コンピュータの世界では2進法（1024 = 2^10）が基本ですが、ストレージメーカーは10進法（1000）を使うことがあります。",
          },
          {
            question: "摂氏と華氏の変換式は？",
            answer:
              "摂氏から華氏: °F = °C × 9/5 + 32。華氏から摂氏: °C = (°F - 32) × 5/9。例えば、100°Cは212°F、0°Cは32°Fです。",
          },
          {
            question: "日本の伝統的な単位にも対応していますか？",
            answer:
              "はい、長さでは尺・寸、重さでは貫・匁に対応しています。建築や伝統工芸で使われる尺貫法の換算にご活用ください。",
          },
        ]}
      />

      <RelatedTools currentToolId="unit-converter" />
    </div>
  );
}
