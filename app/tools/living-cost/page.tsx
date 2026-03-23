"use client";

import { useState, useMemo, useCallback } from "react";
import AdBanner from "@/components/AdBanner";

/* ─── Types ─── */
interface CostItem {
  key: string;
  label: string;
  emoji: string;
  default: number;
  min: number;
  max: number;
  step: number;
  color: string;
}

interface Preset {
  name: string;
  emoji: string;
  values: Record<string, number>;
}

/* ─── Cost Items ─── */
const FIXED_COSTS: CostItem[] = [
  { key: "rent", label: "家賃", emoji: "🏠", default: 60000, min: 30000, max: 150000, step: 5000, color: "#f97316" },
  { key: "utility", label: "水道光熱費", emoji: "💡", default: 10000, min: 5000, max: 25000, step: 1000, color: "#fb923c" },
  { key: "telecom", label: "通信費（スマホ+Wi-Fi）", emoji: "📱", default: 8000, min: 2000, max: 20000, step: 1000, color: "#fdba74" },
  { key: "insurance", label: "保険料", emoji: "🛡️", default: 3000, min: 0, max: 30000, step: 1000, color: "#fed7aa" },
  { key: "subscription", label: "サブスク", emoji: "📺", default: 2000, min: 0, max: 10000, step: 500, color: "#ffedd5" },
];

const VARIABLE_COSTS: CostItem[] = [
  { key: "food", label: "食費", emoji: "🍚", default: 40000, min: 20000, max: 100000, step: 5000, color: "#3b82f6" },
  { key: "daily", label: "日用品", emoji: "🧴", default: 5000, min: 2000, max: 15000, step: 1000, color: "#60a5fa" },
  { key: "transport", label: "交通費", emoji: "🚃", default: 10000, min: 0, max: 30000, step: 1000, color: "#93c5fd" },
  { key: "social", label: "交際費", emoji: "🍻", default: 15000, min: 0, max: 50000, step: 1000, color: "#bfdbfe" },
  { key: "hobby", label: "趣味・娯楽", emoji: "🎮", default: 10000, min: 0, max: 50000, step: 1000, color: "#dbeafe" },
  { key: "clothing", label: "衣服・美容", emoji: "👔", default: 10000, min: 0, max: 30000, step: 1000, color: "#818cf8" },
  { key: "medical", label: "医療費", emoji: "🏥", default: 3000, min: 0, max: 10000, step: 1000, color: "#a5b4fc" },
];

const SAVING_ITEM: CostItem = {
  key: "saving",
  label: "月の貯金目標額",
  emoji: "🐷",
  default: 30000,
  min: 0,
  max: 100000,
  step: 5000,
  color: "#22c55e",
};

const ALL_ITEMS = [...FIXED_COSTS, ...VARIABLE_COSTS];

/* ─── Presets ─── */
const PRESETS: Preset[] = [
  {
    name: "新社会人（都内）",
    emoji: "💼",
    values: {
      rent: 70000, utility: 10000, telecom: 8000, insurance: 5000, subscription: 2000,
      food: 45000, daily: 5000, transport: 10000, social: 20000, hobby: 10000, clothing: 10000, medical: 3000,
      saving: 30000,
    },
  },
  {
    name: "大学生",
    emoji: "🎓",
    values: {
      rent: 50000, utility: 8000, telecom: 5000, insurance: 0, subscription: 1500,
      food: 30000, daily: 3000, transport: 8000, social: 15000, hobby: 8000, clothing: 5000, medical: 2000,
      saving: 10000,
    },
  },
  {
    name: "節約志向",
    emoji: "💰",
    values: {
      rent: 45000, utility: 7000, telecom: 3000, insurance: 2000, subscription: 1000,
      food: 25000, daily: 3000, transport: 5000, social: 5000, hobby: 3000, clothing: 3000, medical: 2000,
      saving: 40000,
    },
  },
  {
    name: "都会の余裕ある暮らし",
    emoji: "🏙️",
    values: {
      rent: 100000, utility: 15000, telecom: 12000, insurance: 10000, subscription: 5000,
      food: 60000, daily: 8000, transport: 15000, social: 30000, hobby: 20000, clothing: 20000, medical: 5000,
      saving: 50000,
    },
  },
];

/* ─── Helpers ─── */
function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

function buildDefaults(): Record<string, number> {
  const d: Record<string, number> = {};
  ALL_ITEMS.forEach((item) => (d[item.key] = item.default));
  d[SAVING_ITEM.key] = SAVING_ITEM.default;
  return d;
}

/* ─── Slider Component ─── */
function CostSlider({
  item,
  value,
  onChange,
}: {
  item: CostItem;
  value: number;
  onChange: (key: string, val: number) => void;
}) {
  const pct = ((value - item.min) / (item.max - item.min)) * 100;

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700">
          {item.emoji} {item.label}
        </label>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-amber-700 tabular-nums">
            {formatYen(value)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={item.min}
          max={item.max}
          step={item.step}
          value={value}
          onChange={(e) => onChange(item.key, Number(e.target.value))}
          className="flex-1 h-2 rounded-full appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
          style={{
            background: `linear-gradient(to right, #f97316 0%, #f97316 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
          }}
        />
        <input
          type="number"
          min={item.min}
          max={item.max}
          step={item.step}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!isNaN(v)) onChange(item.key, Math.min(item.max, Math.max(item.min, v)));
          }}
          className="w-24 text-right text-sm border border-gray-300 rounded-lg px-2 py-1.5
            focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 tabular-nums"
        />
      </div>
    </div>
  );
}

/* ─── Donut Chart (CSS only) ─── */
function DonutChart({
  segments,
}: {
  segments: { label: string; value: number; color: string; pct: number }[];
}) {
  let cumulative = 0;
  const gradientParts = segments
    .filter((s) => s.pct > 0)
    .map((s) => {
      const start = cumulative;
      cumulative += s.pct;
      return `${s.color} ${start}% ${cumulative}%`;
    });

  const gradient = `conic-gradient(${gradientParts.join(", ")})`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-52 h-52 rounded-full relative"
        style={{ background: gradient }}
      >
        <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center">
          <span className="text-xs text-gray-400 font-medium">支出内訳</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 w-full">
        {segments
          .filter((s) => s.pct > 0.5)
          .map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-3 h-3 rounded-sm shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-gray-600 truncate">{s.label}</span>
              <span className="ml-auto font-medium tabular-nums text-gray-800">
                {s.pct.toFixed(1)}%
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function LivingCostSimulator() {
  const [values, setValues] = useState<Record<string, number>>(buildDefaults);

  const handleChange = useCallback((key: string, val: number) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  }, []);

  const applyPreset = useCallback((preset: Preset) => {
    setValues({ ...preset.values });
  }, []);

  /* ─── Calculations ─── */
  const calc = useMemo(() => {
    const fixedTotal = FIXED_COSTS.reduce((sum, i) => sum + (values[i.key] || 0), 0);
    const variableTotal = VARIABLE_COSTS.reduce((sum, i) => sum + (values[i.key] || 0), 0);
    const savingAmount = values[SAVING_ITEM.key] || 0;
    const monthlyTotal = fixedTotal + variableTotal;
    const yearlyTotal = monthlyTotal * 12;
    const requiredTakeHome = monthlyTotal + savingAmount;
    const requiredGross = Math.round(requiredTakeHome * 1.25);
    const totalWithSaving = monthlyTotal + savingAmount;

    const fixedPct = totalWithSaving > 0 ? (fixedTotal / totalWithSaving) * 100 : 0;
    const variablePct = totalWithSaving > 0 ? (variableTotal / totalWithSaving) * 100 : 0;
    const savingPct = totalWithSaving > 0 ? (savingAmount / totalWithSaving) * 100 : 0;

    const segments = ALL_ITEMS.map((item) => ({
      label: item.label,
      value: values[item.key] || 0,
      color: item.color,
      pct: monthlyTotal > 0 ? ((values[item.key] || 0) / monthlyTotal) * 100 : 0,
    }));

    return {
      fixedTotal,
      variableTotal,
      savingAmount,
      monthlyTotal,
      yearlyTotal,
      requiredTakeHome,
      requiredGross,
      fixedPct,
      variablePct,
      savingPct,
      segments,
    };
  }, [values]);

  /* ─── Tips ─── */
  const tips = useMemo(() => {
    const t: string[] = [];
    const rentRatio = calc.requiredTakeHome > 0 ? (values.rent / calc.requiredTakeHome) * 100 : 0;
    if (rentRatio > 30) {
      t.push("💡 家賃が手取りの30%を超えています。一般的に手取りの25〜30%が目安です。");
    }
    if (values.food > 50000) {
      const saving = values.food - 30000;
      t.push(`💡 食費を自炊で抑えると月${formatYen(saving)}節約できます。`);
    }
    if (calc.savingAmount < 10000) {
      t.push("💡 少額でも毎月の貯金習慣が大切です。まずは月1万円から始めてみましょう。");
    }
    return t;
  }, [calc, values]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ── Header ── */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        🏠 生活費シミュレーター
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        一人暮らし、月いくらかかる？ 項目ごとにスライダーで調整して、必要な月収・年収を確認しましょう。
      </p>

      <AdBanner />

      {/* ── Preset Profiles ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-800 mb-3">
          ワンクリックで設定
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="flex flex-col items-center gap-1 rounded-xl border border-amber-200
                bg-amber-50 px-3 py-3 text-sm font-medium text-amber-800
                hover:bg-amber-100 hover:border-amber-300 transition-colors cursor-pointer"
            >
              <span className="text-xl">{preset.emoji}</span>
              <span className="text-xs text-center leading-tight">{preset.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Hero Output ── */}
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 text-center pb-3 border-b border-amber-200">
            <p className="text-sm text-amber-700 font-medium mb-1">月の生活費合計</p>
            <p className="text-4xl font-extrabold text-amber-900 tabular-nums">
              {formatYen(calc.monthlyTotal)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-0.5">年間の生活費</p>
            <p className="text-lg font-bold text-gray-800 tabular-nums">
              {formatYen(calc.yearlyTotal)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-0.5">必要な手取り月収</p>
            <p className="text-lg font-bold text-gray-800 tabular-nums">
              {formatYen(calc.requiredTakeHome)}
            </p>
          </div>
          <div className="col-span-2 text-center pt-3 border-t border-amber-200">
            <p className="text-xs text-gray-500 mb-0.5">必要な年収（税込目安）</p>
            <p className="text-2xl font-bold text-amber-800 tabular-nums">
              {formatYen(calc.requiredGross * 12)}
            </p>
            <p className="text-xs text-gray-400 mt-1">※ 手取りの約1.25倍で概算</p>
          </div>
        </div>
      </section>

      {/* ── Fixed vs Variable bar ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-800 mb-3">固定費 vs 変動費 vs 貯金</h2>
        <div className="w-full h-10 rounded-xl overflow-hidden flex text-xs font-medium">
          {calc.fixedPct > 0 && (
            <div
              className="flex items-center justify-center text-white bg-amber-500 transition-all duration-300"
              style={{ width: `${calc.fixedPct}%` }}
            >
              {calc.fixedPct > 8 && `固定費 ${calc.fixedPct.toFixed(0)}%`}
            </div>
          )}
          {calc.variablePct > 0 && (
            <div
              className="flex items-center justify-center text-white bg-blue-500 transition-all duration-300"
              style={{ width: `${calc.variablePct}%` }}
            >
              {calc.variablePct > 8 && `変動費 ${calc.variablePct.toFixed(0)}%`}
            </div>
          )}
          {calc.savingPct > 0 && (
            <div
              className="flex items-center justify-center text-white bg-green-500 transition-all duration-300"
              style={{ width: `${calc.savingPct}%` }}
            >
              {calc.savingPct > 8 && `貯金 ${calc.savingPct.toFixed(0)}%`}
            </div>
          )}
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-amber-500" /> 固定費 {formatYen(calc.fixedTotal)}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-blue-500" /> 変動費 {formatYen(calc.variableTotal)}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-sm bg-green-500" /> 貯金 {formatYen(calc.savingAmount)}
          </span>
        </div>
      </section>

      <AdBanner />

      {/* ── Donut Chart ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-800 mb-4">支出内訳</h2>
        <DonutChart segments={calc.segments} />
      </section>

      <AdBanner />

      {/* ── Fixed Costs ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-800 mb-1">固定費</h2>
        <p className="text-xs text-gray-400 mb-2">
          毎月ほぼ一定の支出（合計: {formatYen(calc.fixedTotal)}）
        </p>
        <div className="divide-y divide-gray-100">
          {FIXED_COSTS.map((item) => (
            <CostSlider
              key={item.key}
              item={item}
              value={values[item.key]}
              onChange={handleChange}
            />
          ))}
        </div>
      </section>

      {/* ── Variable Costs ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-800 mb-1">変動費</h2>
        <p className="text-xs text-gray-400 mb-2">
          月によって変わる支出（合計: {formatYen(calc.variableTotal)}）
        </p>
        <div className="divide-y divide-gray-100">
          {VARIABLE_COSTS.map((item) => (
            <CostSlider
              key={item.key}
              item={item}
              value={values[item.key]}
              onChange={handleChange}
            />
          ))}
        </div>
      </section>

      <AdBanner />

      {/* ── Saving Goal ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-800 mb-1">貯金目標</h2>
        <p className="text-xs text-gray-400 mb-2">将来のために毎月積み立てる金額</p>
        <CostSlider
          item={SAVING_ITEM}
          value={values[SAVING_ITEM.key]}
          onChange={handleChange}
        />
      </section>

      {/* ── Tips ── */}
      {tips.length > 0 && (
        <section className="mb-8">
          <h2 className="text-base font-bold text-gray-800 mb-3">アドバイス</h2>
          <div className="space-y-2">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800"
              >
                {tip}
              </div>
            ))}
          </div>
        </section>
      )}

      <AdBanner />
    </div>
  );
}
