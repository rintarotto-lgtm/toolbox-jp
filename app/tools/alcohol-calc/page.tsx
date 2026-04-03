"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface DrinkItem {
  id: string;
  emoji: string;
  name: string;
  ml: number;
  pct: number;
  count: number;
}

const PRESET_DRINKS: Omit<DrinkItem, "count">[] = [
  { id: "beer350", emoji: "🍺", name: "ビール（350ml缶）", ml: 350, pct: 5 },
  { id: "beer500", emoji: "🍺", name: "ビール（500ml缶）", ml: 500, pct: 5 },
  { id: "sake", emoji: "🍶", name: "日本酒（1合 180ml）", ml: 180, pct: 15 },
  { id: "wine", emoji: "🍷", name: "ワイン（グラス 150ml）", ml: 150, pct: 12 },
  { id: "champagne", emoji: "🥂", name: "シャンパン（グラス 150ml）", ml: 150, pct: 12 },
  { id: "whisky_s", emoji: "🥃", name: "ウイスキー（シングル 30ml）", ml: 30, pct: 40 },
  { id: "whisky_d", emoji: "🥃", name: "ウイスキー（ダブル 60ml）", ml: 60, pct: 40 },
  { id: "chuhai", emoji: "🍸", name: "チューハイ（350ml）", ml: 350, pct: 5 },
  { id: "strong", emoji: "🍸", name: "ストロング系（350ml）", ml: 350, pct: 9 },
  { id: "shochu", emoji: "🍾", name: "焼酎（グラス 100ml）", ml: 100, pct: 25 },
];

function calcPureAlcohol(ml: number, pct: number): number {
  return (ml * pct) / 100 * 0.8;
}

function getLevel(g: number) {
  if (g <= 20) return { label: "適量", color: "bg-green-500", text: "text-green-700", bg: "bg-green-50 border-green-200" };
  if (g <= 40) return { label: "やや多い", color: "bg-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" };
  if (g <= 60) return { label: "多い", color: "bg-orange-500", text: "text-orange-700", bg: "bg-orange-50 border-orange-200" };
  return { label: "飲みすぎ", color: "bg-red-500", text: "text-red-700", bg: "bg-red-50 border-red-200" };
}

export default function AlcoholCalc() {
  const [weight, setWeight] = useState("60");
  const [isFemale, setIsFemale] = useState(false);
  const [drinks, setDrinks] = useState<DrinkItem[]>(
    PRESET_DRINKS.map((d) => ({ ...d, count: 0 }))
  );
  const [customName, setCustomName] = useState("");
  const [customMl, setCustomMl] = useState("");
  const [customPct, setCustomPct] = useState("");
  const [customCount, setCustomCount] = useState(0);

  function changeCount(id: string, delta: number) {
    setDrinks((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, count: Math.max(0, d.count + delta) } : d
      )
    );
  }

  const result = useMemo(() => {
    const w = parseFloat(weight);
    let totalAlcohol = drinks.reduce(
      (sum, d) => sum + calcPureAlcohol(d.ml, d.pct) * d.count,
      0
    );
    const customA =
      customCount > 0 && parseFloat(customMl) > 0 && parseFloat(customPct) > 0
        ? calcPureAlcohol(parseFloat(customMl), parseFloat(customPct)) * customCount
        : 0;
    totalAlcohol += customA;

    if (totalAlcohol === 0) return null;

    // Calories: alcohol kcal + 20% for sugars/etc
    const alcoholKcal = totalAlcohol * 7;
    const totalKcal = Math.round(alcoholKcal * 1.2);

    // Decomposition time (hours)
    // rate = body_weight * 0.1 g/h; female factor 0.6 reduces effective rate or increases time
    let decompHours = 0;
    if (w > 0) {
      const ratePerHour = w * 0.1 * (isFemale ? 0.6 : 1);
      decompHours = totalAlcohol / ratePerHour;
    }

    const level = getLevel(totalAlcohol);

    // Gauge bar percent (0-80g range)
    const gaugePercent = Math.min(100, (totalAlcohol / 80) * 100);

    return {
      totalAlcohol,
      totalKcal,
      decompHours,
      level,
      gaugePercent,
      weeklyTotal: totalAlcohol * 7,
    };
  }, [drinks, weight, isFemale, customCount, customMl, customPct]);

  const hasDrinks = drinks.some((d) => d.count > 0) || customCount > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-600 to-yellow-700 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🍺</span>
          <h1 className="text-2xl font-bold">アルコール量計算</h1>
        </div>
        <p className="text-amber-100 text-sm">
          飲み物の種類と量から純アルコール量・カロリー・分解時間を計算します。
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Body inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              体重（kg）
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="60"
              min="1"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              性別
            </label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <button
                onClick={() => setIsFemale(false)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  !isFemale ? "bg-amber-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                男性
              </button>
              <button
                onClick={() => setIsFemale(true)}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  isFemale ? "bg-amber-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                女性
              </button>
            </div>
          </div>
        </div>

        {/* Drink counters */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">飲んだお酒を選んでください</h2>
          <div className="space-y-2">
            {drinks.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl shrink-0">{d.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{d.name}</div>
                    <div className="text-xs text-gray-500">{d.pct}% / {d.ml}ml → {calcPureAlcohol(d.ml, d.pct).toFixed(1)}g</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button
                    onClick={() => changeCount(d.id, -1)}
                    disabled={d.count === 0}
                    className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-600 flex items-center justify-center text-lg font-bold hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="w-6 text-center font-bold text-gray-800">{d.count}</span>
                  <button
                    onClick={() => changeCount(d.id, 1)}
                    className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-lg font-bold hover:bg-amber-700"
                  >
                    ＋
                  </button>
                </div>
              </div>
            ))}

            {/* Custom item */}
            <div className="border border-dashed border-gray-300 rounded-lg px-4 py-3 bg-gray-50">
              <div className="text-xs font-medium text-gray-500 mb-2">カスタム（その他のお酒）</div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="名前"
                  className="p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <input
                  type="number"
                  value={customMl}
                  onChange={(e) => setCustomMl(e.target.value)}
                  placeholder="量 (ml)"
                  min="1"
                  className="p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <input
                  type="number"
                  value={customPct}
                  onChange={(e) => setCustomPct(e.target.value)}
                  placeholder="度数 (%)"
                  min="0"
                  max="100"
                  step="0.1"
                  className="p-2 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCustomCount(Math.max(0, customCount - 1))}
                  disabled={customCount === 0}
                  className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-600 flex items-center justify-center text-lg font-bold hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <span className="w-6 text-center font-bold text-gray-800">{customCount}</span>
                <button
                  onClick={() => setCustomCount(customCount + 1)}
                  className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-lg font-bold hover:bg-amber-700"
                >
                  ＋
                </button>
                {customCount > 0 && parseFloat(customMl) > 0 && parseFloat(customPct) > 0 && (
                  <span className="text-xs text-gray-500 ml-1">
                    → 純ア: {(calcPureAlcohol(parseFloat(customMl), parseFloat(customPct)) * customCount).toFixed(1)}g
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reset */}
        {hasDrinks && (
          <button
            onClick={() => {
              setDrinks(PRESET_DRINKS.map((d) => ({ ...d, count: 0 })));
              setCustomCount(0);
            }}
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            リセット
          </button>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Main card */}
            <div className={`border rounded-xl p-5 ${result.level.bg}`}>
              <div className="text-center mb-4">
                <div className={`text-5xl font-bold ${result.level.text}`}>
                  {result.totalAlcohol.toFixed(1)}
                  <span className="text-2xl ml-1">g</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">純アルコール量</div>
                <div className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-bold ${result.level.text} bg-white border`}>
                  {result.level.label}
                </div>
              </div>

              {/* Gauge bar */}
              <div className="mb-1">
                <div className="relative h-4 rounded-full overflow-hidden flex">
                  <div className="bg-green-400" style={{ width: "25%" }} />
                  <div className="bg-yellow-400" style={{ width: "25%" }} />
                  <div className="bg-orange-400" style={{ width: "25%" }} />
                  <div className="bg-red-500" style={{ width: "25%" }} />
                </div>
                <div
                  className="relative"
                  style={{ marginTop: "-16px" }}
                >
                  <div
                    className="absolute top-0 w-1 h-6 bg-gray-900 -translate-x-1/2"
                    style={{ left: `${result.gaugePercent}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-6 px-1">
                <span>0g</span>
                <span>20g 適量</span>
                <span>40g</span>
                <span>60g</span>
                <span>80g+</span>
              </div>
            </div>

            {/* Sub stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{result.totalKcal}</div>
                <div className="text-xs text-gray-500 mt-1">推定カロリー (kcal)</div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {parseFloat(weight) > 0 ? result.decompHours.toFixed(1) : "—"}
                </div>
                <div className="text-xs text-gray-500 mt-1">分解時間 (時間)</div>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-purple-50 border border-purple-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{result.weeklyTotal.toFixed(0)}</div>
                <div className="text-xs text-gray-500 mt-1">週換算 (g/週)</div>
              </div>
            </div>

            {/* Liver indicator */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">肝臓への負担</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => {
                  const filled = result.totalAlcohol >= i * 16;
                  return (
                    <div
                      key={i}
                      className={`flex-1 h-3 rounded-full ${filled ? "bg-red-400" : "bg-gray-200"}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>低</span>
                <span>高</span>
              </div>
            </div>

            {/* Driving note */}
            {parseFloat(weight) > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                <span className="font-bold">運転の目安：</span>
                約 <span className="font-bold">{result.decompHours.toFixed(1)} 時間後</span>
                に分解が完了する計算です（個人差があります。必ず余裕をもって判断してください）。
              </div>
            )}
          </>
        )}

        {!hasDrinks && (
          <div className="text-center text-gray-400 text-sm py-6">
            飲んだお酒の「＋」ボタンを押してください
          </div>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">アルコール量計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          体重・性別を入力し、飲んだお酒の「＋」ボタンを押すだけで純アルコール量（g）をリアルタイム計算します。
          厚生労働省の目安（1日20g）を基準に適量・やや多い・多い・飲みすぎの4段階で判定。
          カロリーの推定値、肝臓での分解完了までの時間、週換算のアルコール量も表示します。
          飲酒運転防止や健康管理にご活用ください。
        </p>
        <p className="text-xs text-gray-400 mt-3">
          ※本ツールの計算結果は目安です。個人差・体調・食事量等により実際の影響は異なります。医療的な判断には医師にご相談ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "適度な飲酒量の目安はどのくらいですか？",
            answer:
              "厚生労働省は1日あたりの純アルコール量20g程度を適量としています。ビールなら500ml、日本酒なら1合、ワインなら200ml程度に相当します。女性はこの半量が目安です。",
          },
          {
            question: "純アルコール量の計算方法は？",
            answer:
              "純アルコール量(g) = 飲み物の量(ml) × アルコール度数(%) ÷ 100 × 0.8（アルコールの比重）で計算します。",
          },
          {
            question: "アルコールのカロリーはどのくらいですか？",
            answer:
              "アルコールは1gあたり7kcalです。ビール500mlなら約200kcal、日本酒1合(180ml)なら約200kcal、ウイスキーダブル(60ml)なら約140kcalです。",
          },
          {
            question: "飲酒後、運転できるようになるまで何時間かかりますか？",
            answer:
              "アルコールは1時間に体重1kgあたり約0.1gが分解されます。体重60kgの人がビール500ml（純アルコール約20g）を飲んだ場合、分解に約3.3時間かかります。個人差があるため余裕をもって判断してください。",
          },
        ]}
      />

      <RelatedTools currentToolId="alcohol-calc" />
    </div>
  );
}
