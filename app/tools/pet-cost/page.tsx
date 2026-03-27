"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";

type PetType = "dog-small" | "dog-medium" | "dog-large" | "cat";

const petPresets: Record<PetType, { label: string; emoji: string; lifespan: number; food: number; medical: number; insurance: number; trimming: number; supplies: number; initCost: number }> = {
  "dog-small": { label: "小型犬", emoji: "🐕", lifespan: 14, food: 5000, medical: 8000, insurance: 3000, trimming: 5000, supplies: 2000, initCost: 250000 },
  "dog-medium": { label: "中型犬", emoji: "🦮", lifespan: 13, food: 8000, medical: 10000, insurance: 3500, trimming: 6000, supplies: 3000, initCost: 280000 },
  "dog-large": { label: "大型犬", emoji: "🐕‍🦺", lifespan: 11, food: 15000, medical: 12000, insurance: 4000, trimming: 8000, supplies: 4000, initCost: 300000 },
  "cat": { label: "猫", emoji: "🐈", lifespan: 15, food: 4000, medical: 7000, insurance: 2500, trimming: 0, supplies: 2000, initCost: 150000 },
};

const fmt = (n: number) => n.toLocaleString("ja-JP");

export default function PetCostCalc() {
  const [petType, setPetType] = useState<PetType>("dog-small");
  const preset = petPresets[petType];

  const [food, setFood] = useState(preset.food);
  const [medical, setMedical] = useState(preset.medical);
  const [insurance, setInsurance] = useState(preset.insurance);
  const [trimming, setTrimming] = useState(preset.trimming);
  const [supplies, setSupplies] = useState(preset.supplies);
  const [initCost, setInitCost] = useState(preset.initCost);
  const [initGoods, setInitGoods] = useState(50000);
  const [initMedical, setInitMedical] = useState(30000);
  const [lifespan, setLifespan] = useState(preset.lifespan);

  const selectPet = (type: PetType) => {
    setPetType(type);
    const p = petPresets[type];
    setFood(p.food); setMedical(p.medical); setInsurance(p.insurance);
    setTrimming(p.trimming); setSupplies(p.supplies); setInitCost(p.initCost);
    setLifespan(p.lifespan);
  };

  const monthly = food + medical + insurance + trimming + supplies;
  const yearly = monthly * 12;
  const initTotal = initCost + initGoods + initMedical;
  const lifetimeMonthly = monthly * 12 * lifespan;
  const lifetimeTotal = initTotal + lifetimeMonthly;

  const breakdownItems = [
    { label: "フード代", value: food, color: "bg-orange-400", yearly: food * 12 },
    { label: "医療費", value: medical, color: "bg-red-400", yearly: medical * 12 },
    { label: "ペット保険", value: insurance, color: "bg-blue-400", yearly: insurance * 12 },
    { label: "トリミング", value: trimming, color: "bg-purple-400", yearly: trimming * 12 },
    { label: "日用品", value: supplies, color: "bg-green-400", yearly: supplies * 12 },
  ];

  const Slider = ({ label, value, set, min, max, step, unit = "円/月" }: { label: string; value: number; set: (v: number) => void; min: number; max: number; step: number; unit?: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">¥{fmt(value)}<span className="text-xs text-gray-400 ml-1">{unit}</span></span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-orange-500" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">🐾 ペット費用シミュレーター</h1>
        <p className="text-gray-500 mt-1">犬・猫を飼うのに一生でいくらかかる？リアルな金額を計算します。</p>
      </div>

      <AdBanner />

      {/* ペット選択 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(Object.keys(petPresets) as PetType[]).map(type => {
          const p = petPresets[type];
          return (
            <button key={type} onClick={() => selectPet(type)}
              className={`p-4 rounded-xl border-2 text-center transition-all ${petType === type ? "border-orange-500 bg-orange-50 shadow-md" : "border-gray-200 hover:border-orange-300"}`}>
              <div className="text-3xl mb-1">{p.emoji}</div>
              <div className="text-sm font-semibold">{p.label}</div>
              <div className="text-xs text-gray-400">平均寿命 {p.lifespan}年</div>
            </button>
          );
        })}
      </div>

      {/* 生涯費用ヒーロー */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 text-center border border-orange-100">
        <p className="text-sm text-orange-600 font-medium">{preset.emoji} {preset.label}の生涯費用</p>
        <p className="text-4xl sm:text-5xl font-bold text-orange-600 mt-2">¥{fmt(lifetimeTotal)}</p>
        <p className="text-gray-500 mt-2 text-sm">約{Math.round(lifetimeTotal / 10000)}万円（{lifespan}年間）</p>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-orange-200">
          <div>
            <p className="text-xs text-gray-500">初期費用</p>
            <p className="font-bold text-gray-900">¥{fmt(initTotal)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">月々の費用</p>
            <p className="font-bold text-gray-900">¥{fmt(monthly)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">年間費用</p>
            <p className="font-bold text-gray-900">¥{fmt(yearly)}</p>
          </div>
        </div>
      </div>

      {/* 初期費用 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-bold text-gray-900">🏠 初期費用</h2>
        <Slider label="ペット購入/譲渡費用" value={initCost} set={setInitCost} min={0} max={500000} step={10000} unit="円" />
        <Slider label="初期グッズ（ケージ・食器等）" value={initGoods} set={setInitGoods} min={10000} max={150000} step={5000} unit="円" />
        <Slider label="初回医療費（ワクチン・去勢等）" value={initMedical} set={setInitMedical} min={10000} max={100000} step={5000} unit="円" />
        <div className="text-right font-bold text-lg text-orange-600">初期費用合計: ¥{fmt(initTotal)}</div>
      </div>

      {/* 月々の費用 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-bold text-gray-900">📅 月々の費用</h2>
        <Slider label="フード代" value={food} set={setFood} min={1000} max={30000} step={1000} />
        <Slider label="医療費（月平均）" value={medical} set={setMedical} min={0} max={30000} step={1000} />
        <Slider label="ペット保険" value={insurance} set={setInsurance} min={0} max={10000} step={500} />
        <Slider label="トリミング" value={trimming} set={setTrimming} min={0} max={15000} step={1000} />
        <Slider label="日用品（トイレ砂・おもちゃ等）" value={supplies} set={setSupplies} min={500} max={10000} step={500} />
        <div className="text-right font-bold text-lg text-orange-600">月々合計: ¥{fmt(monthly)}</div>
      </div>

      {/* 寿命 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-bold text-gray-900">⏳ 飼育年数</h2>
        <Slider label="飼育年数" value={lifespan} set={setLifespan} min={1} max={20} step={1} unit="年" />
      </div>

      {/* 内訳 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-bold text-gray-900">📊 年間費用の内訳</h2>
        {breakdownItems.filter(i => i.value > 0).map(item => {
          const pct = monthly > 0 ? Math.round(item.value / monthly * 100) : 0;
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{item.label}</span>
                <span className="font-semibold">¥{fmt(item.yearly)}/年 ({pct}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className={`${item.color} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
        <p className="font-bold mb-1">💡 知っておきたいこと</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>高齢になると医療費が2-3倍になることがあります</li>
          <li>ペット保険は若いうちに加入した方が保険料が安いです</li>
          <li>保護犬・保護猫なら購入費用を大幅に抑えられます</li>
          {petType !== "cat" && <li>トリミング不要な犬種を選ぶと年間{fmt(trimming * 12)}円節約できます</li>}
        </ul>
      </div>

      <p className="text-xs text-gray-400 text-center">※ 金額は一般的な目安です。犬種・猫種・地域・個体の健康状態により大きく異なります。</p>

      <AdBanner />
    </div>
  );
}
