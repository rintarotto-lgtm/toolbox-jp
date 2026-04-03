"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/* ─── Types ─── */
type FuelType = "regular" | "premium" | "diesel" | "electric";
type Mode = "cost" | "check";

interface FuelPreset {
  label: string;
  unit: string;
  defaultPrice: number;
}

/* ─── Constants ─── */
const FUEL_PRESETS: Record<FuelType, FuelPreset> = {
  regular:  { label: "レギュラー", unit: "円/L",   defaultPrice: 170 },
  premium:  { label: "ハイオク",   unit: "円/L",   defaultPrice: 181 },
  diesel:   { label: "軽油",       unit: "円/L",   defaultPrice: 155 },
  electric: { label: "電気",       unit: "円/kWh", defaultPrice: 30  },
};

const HIGHWAY_RATE = 30; // 円/km 概算

const REFERENCE_CARS = [
  { name: "トヨタ プリウス",       fuel: 22 },
  { name: "ホンダ フィット",       fuel: 17 },
  { name: "日産 ノート e-POWER",   fuel: 29 },
  { name: "トヨタ アクア",         fuel: 24 },
  { name: "ダイハツ タント",       fuel: 21 },
  { name: "スズキ スペーシア",     fuel: 22 },
  { name: "トヨタ ヤリス",         fuel: 20 },
  { name: "ホンダ フリード",       fuel: 17 },
  { name: "普通セダン（参考）",    fuel: 13 },
  { name: "ミニバン（参考）",      fuel: 11 },
];

/* ─── Helpers ─── */
function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

/* ─── Main Component ─── */
export default function FuelCost() {
  const [mode, setMode] = useState<Mode>("cost");

  // 燃料費計算モード
  const [distance, setDistance]     = useState(100);
  const [fuelEff, setFuelEff]       = useState(15);
  const [fuelType, setFuelType]     = useState<FuelType>("regular");
  const [fuelPrice, setFuelPrice]   = useState(170);
  const [useHighway, setUseHighway] = useState(false);
  const [hwDistance, setHwDistance] = useState(30);

  // 燃費チェックモード
  const [prevDistance, setPrevDistance] = useState(300);
  const [refueled, setRefueled]         = useState(25);
  const [dailyKm, setDailyKm]           = useState(20);

  // 燃料費計算
  const costResult = useMemo(() => {
    const fuelUsed  = fuelEff > 0 ? distance / fuelEff : 0;
    const fuelCost  = fuelUsed * fuelPrice;
    const hwCost    = useHighway ? hwDistance * HIGHWAY_RATE : 0;
    const total     = fuelCost + hwCost;
    const perKm     = distance > 0 ? total / distance : 0;
    return { fuelUsed, fuelCost, hwCost, total, perKm };
  }, [distance, fuelEff, fuelPrice, useHighway, hwDistance]);

  // 燃費チェック
  const checkResult = useMemo(() => {
    const calcFuelEff = refueled > 0 ? prevDistance / refueled : 0;
    const monthlyCost = calcFuelEff > 0
      ? (dailyKm * 30 / calcFuelEff) * fuelPrice
      : 0;
    const annualCost = monthlyCost * 12;
    return { calcFuelEff, monthlyCost, annualCost };
  }, [prevDistance, refueled, dailyKm, fuelPrice]);

  // 燃料種別変更時に単価プリセットを更新
  const handleFuelTypeChange = (t: FuelType) => {
    setFuelType(t);
    setFuelPrice(FUEL_PRESETS[t].defaultPrice);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-500 to-orange-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⛽</span>
          <h1 className="text-2xl font-bold">ガソリン代計算ツール</h1>
        </div>
        <p className="text-red-100 text-sm">
          走行距離・燃費・ガソリン単価から燃料費を自動計算。高速料金の概算も加算可能。
        </p>
      </div>

      {/* モード切替 */}
      <div className="flex gap-2 mb-6">
        {([["cost", "燃料費計算"], ["check", "燃費チェック"]] as [Mode, string][]).map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              mode === m
                ? "bg-orange-500 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "cost" ? (
        <>
          {/* ─── 燃料費計算モード ─── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">走行・燃料情報</h2>
            <div className="space-y-4">
              {/* 走行距離 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">走行距離</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} step={1} value={distance}
                    onChange={(e) => setDistance(Number(e.target.value) || 0)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <span className="text-sm text-gray-500 w-8">km</span>
                </div>
              </div>

              {/* 燃費 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">燃費</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0.1} step={0.5} value={fuelEff}
                    onChange={(e) => setFuelEff(Number(e.target.value) || 0)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <span className="text-sm text-gray-500 w-20 shrink-0">
                    {fuelType === "electric" ? "km/kWh" : "km/L"}
                  </span>
                </div>
              </div>

              {/* 燃料種別 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">燃料種別</label>
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(FUEL_PRESETS) as FuelType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleFuelTypeChange(t)}
                      className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                        fuelType === t
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {FUEL_PRESETS[t].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 燃料単価 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  燃料単価
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} step={1} value={fuelPrice}
                    onChange={(e) => setFuelPrice(Number(e.target.value) || 0)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <span className="text-sm text-gray-500 w-20 shrink-0">
                    {FUEL_PRESETS[fuelType].unit}
                  </span>
                </div>
              </div>

              {/* 高速道路 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">高速道路を使用する</label>
                  <button
                    onClick={() => setUseHighway(!useHighway)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      useHighway ? "bg-orange-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        useHighway ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {useHighway && (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number" min={0} step={1} value={hwDistance}
                      onChange={(e) => setHwDistance(Number(e.target.value) || 0)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-500 w-8">km</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 結果カード */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-orange-200 rounded-2xl p-6 mb-6 text-center">
            <p className="text-sm text-orange-700 mb-1">合計移動費用</p>
            <p className="text-5xl font-extrabold text-orange-700 mb-1">
              {formatYen(costResult.total)}
            </p>
            <p className="text-sm text-gray-500">1km当たり {costResult.perKm.toFixed(1)} 円</p>

            <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-orange-200 text-sm">
              <div>
                <p className="text-xs text-gray-500">燃料費</p>
                <p className="font-bold text-gray-800">{formatYen(costResult.fuelCost)}</p>
                <p className="text-xs text-gray-400">
                  {costResult.fuelUsed.toFixed(1)}{fuelType === "electric" ? "kWh" : "L"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">高速料金概算</p>
                <p className="font-bold text-gray-800">{formatYen(costResult.hwCost)}</p>
                <p className="text-xs text-gray-400">{useHighway ? `${hwDistance}km×${HIGHWAY_RATE}円` : "なし"}</p>
              </div>
              <div>
                <p className="text-xs text-orange-600">使用燃料量</p>
                <p className="font-bold text-orange-700">
                  {costResult.fuelUsed.toFixed(2)}{fuelType === "electric" ? "kWh" : "L"}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* ─── 燃費チェックモード ─── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">給油データを入力</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  前回給油からの走行距離
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} step={1} value={prevDistance}
                    onChange={(e) => setPrevDistance(Number(e.target.value) || 0)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <span className="text-sm text-gray-500 w-8">km</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">今回の給油量</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} step={0.5} value={refueled}
                    onChange={(e) => setRefueled(Number(e.target.value) || 0)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <span className="text-sm text-gray-500 w-8">L</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">1日の平均走行距離</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} step={1} value={dailyKm}
                    onChange={(e) => setDailyKm(Number(e.target.value) || 0)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <span className="text-sm text-gray-500 w-8">km</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ガソリン単価（月額計算用）
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} step={1} value={fuelPrice}
                    onChange={(e) => setFuelPrice(Number(e.target.value) || 0)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <span className="text-sm text-gray-500 w-16">円/L</span>
                </div>
              </div>
            </div>
          </div>

          {/* 燃費チェック結果 */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-orange-200 rounded-2xl p-6 mb-6 text-center">
            <p className="text-sm text-orange-700 mb-1">計算された燃費</p>
            <p className="text-5xl font-extrabold text-orange-700 mb-1">
              {checkResult.calcFuelEff.toFixed(1)} km/L
            </p>
            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-orange-200">
              <div>
                <p className="text-xs text-gray-500">月間燃料費概算</p>
                <p className="text-lg font-bold text-gray-800">{formatYen(checkResult.monthlyCost)}</p>
                <p className="text-xs text-gray-400">月{dailyKm * 30}km走行時</p>
              </div>
              <div>
                <p className="text-xs text-orange-600">年間燃料費概算</p>
                <p className="text-lg font-bold text-orange-700">{formatYen(checkResult.annualCost)}</p>
              </div>
            </div>
          </div>

          {/* 車種別参考燃費 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-3">車種別 参考燃費</h2>
            <div className="space-y-2">
              {REFERENCE_CARS.map((car) => (
                <div key={car.name} className="flex items-center justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">{car.name}</span>
                  <span className="font-semibold text-orange-600">{car.fuel} km/L</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2">※ WLTCモード参考値。実際の燃費は走行条件により異なります。</p>
          </div>
        </>
      )}

      <AdBanner />
      <RelatedTools currentToolId="fuel-cost" />

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          {[
            {
              q: "燃費の計算方法は？",
              a: "燃費(km/L) = 走行距離(km) ÷ 給油量(L)で計算します。例えば300km走って30L給油した場合、燃費は10km/Lです。",
            },
            {
              q: "ガソリン代の計算方法は？",
              a: "ガソリン代 = 走行距離 ÷ 燃費 × ガソリン単価で計算します。100km走って燃費15km/L、ガソリン170円/Lなら約1,133円になります。",
            },
            {
              q: "電気自動車のランニングコストはガソリン車と比べてどうですか？",
              a: "電気自動車の電費は約6〜8km/kWhで、電気代が30円/kWhなら1km約4〜5円。ガソリン車（燃費15km/L、ガソリン170円/L）の1km約11円と比べると約半分以下です。",
            },
            {
              q: "高速道路料金の目安はいくらですか？",
              a: "高速道路の普通車料金は概ね1km当たり約25〜35円程度です。東名高速（東京〜名古屋）は約5,000〜7,000円、東名・名神（東京〜大阪）は約10,000円程度です。",
            },
          ].map(({ q, a }) => (
            <details key={q} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <summary className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-orange-500 list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 ml-2 shrink-0">＋</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 leading-relaxed">
        ※ 本ツールの計算結果は概算です。正確な金額は専門家にご相談ください。
      </p>
    </div>
  );
}
