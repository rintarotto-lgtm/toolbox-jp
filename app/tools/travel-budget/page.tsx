"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface Preset {
  label: string;
  icon: string;
  transport: number; // 万円 (合計交通費, 2人分想定)
  accommodation: number; // 万円/泊
  food: number; // 円/日/人
  activity: number; // 円/日/人
  shopping: number; // 円/日/人
  localTransport: number; // 円/日/人
  insurance: number; // 円
  type: "domestic" | "overseas";
}

const PRESETS: Preset[] = [
  {
    label: "沖縄",
    icon: "✈️",
    transport: 6,
    accommodation: 1.5,
    food: 3000,
    activity: 3000,
    shopping: 2000,
    localTransport: 1000,
    insurance: 0,
    type: "domestic",
  },
  {
    label: "北海道",
    icon: "✈️",
    transport: 5,
    accommodation: 1.5,
    food: 3500,
    activity: 2000,
    shopping: 3000,
    localTransport: 1500,
    insurance: 0,
    type: "domestic",
  },
  {
    label: "京都",
    icon: "🏯",
    transport: 3,
    accommodation: 1.2,
    food: 3000,
    activity: 2000,
    shopping: 2500,
    localTransport: 800,
    insurance: 0,
    type: "domestic",
  },
  {
    label: "ハワイ",
    icon: "🌺",
    transport: 20,
    accommodation: 3,
    food: 5000,
    activity: 5000,
    shopping: 8000,
    localTransport: 2000,
    insurance: 3000,
    type: "overseas",
  },
  {
    label: "タイ",
    icon: "🌴",
    transport: 8,
    accommodation: 1,
    food: 2000,
    activity: 3000,
    shopping: 3000,
    localTransport: 500,
    insurance: 2000,
    type: "overseas",
  },
  {
    label: "ヨーロッパ",
    icon: "🗼",
    transport: 25,
    accommodation: 2.5,
    food: 5000,
    activity: 6000,
    shopping: 8000,
    localTransport: 2000,
    insurance: 5000,
    type: "overseas",
  },
];

export default function TravelBudget() {
  const [people, setPeople] = useState("2");
  const [days, setDays] = useState("3");
  const [destType, setDestType] = useState<"domestic" | "overseas">("domestic");

  // 固定費（合計）
  const [transport, setTransport] = useState("6");
  const [accommodation, setAccommodation] = useState("1.5");
  const [insurance, setInsurance] = useState("0");

  // 変動費（1人/日）
  const [food, setFood] = useState("3000");
  const [activity, setActivity] = useState("3000");
  const [shopping, setShopping] = useState("2000");
  const [localTransport, setLocalTransport] = useState("1000");

  // 積立
  const [savingMonths, setSavingMonths] = useState("12");

  const applyPreset = (preset: Preset) => {
    setDestType(preset.type);
    setTransport(String(preset.transport));
    setAccommodation(String(preset.accommodation));
    setInsurance(String(preset.insurance));
    setFood(String(preset.food));
    setActivity(String(preset.activity));
    setShopping(String(preset.shopping));
    setLocalTransport(String(preset.localTransport));
  };

  const result = useMemo(() => {
    const numPeople = parseInt(people) || 1;
    const numDays = parseInt(days) || 1;
    const nights = Math.max(0, numDays - 1);

    const transportTotal = (parseFloat(transport) || 0) * 10000;
    const accommodationTotal = (parseFloat(accommodation) || 0) * 10000 * nights;
    const insuranceTotal = parseFloat(insurance) || 0;

    const foodTotal = (parseFloat(food) || 0) * numDays * numPeople;
    const activityTotal = (parseFloat(activity) || 0) * numDays * numPeople;
    const shoppingTotal = (parseFloat(shopping) || 0) * numDays * numPeople;
    const localTransportTotal = (parseFloat(localTransport) || 0) * numDays * numPeople;

    const fixedTotal = transportTotal + accommodationTotal + insuranceTotal;
    const variableTotal = foodTotal + activityTotal + shoppingTotal + localTransportTotal;
    const grandTotal = fixedTotal + variableTotal;
    const perPerson = numPeople > 0 ? grandTotal / numPeople : grandTotal;
    const perDay = numDays > 0 ? grandTotal / numDays : grandTotal;

    const months = parseInt(savingMonths) || 1;
    const monthlyRequired = grandTotal / months;

    // 円グラフ用パーセンテージ
    const categories = [
      { label: "交通費", amount: transportTotal, color: "bg-sky-500" },
      { label: "宿泊費", amount: accommodationTotal, color: "bg-cyan-500" },
      { label: "食費", amount: foodTotal, color: "bg-emerald-500" },
      { label: "観光・アクティビティ", amount: activityTotal, color: "bg-violet-500" },
      { label: "お土産・ショッピング", amount: shoppingTotal, color: "bg-rose-400" },
      { label: "現地交通費", amount: localTransportTotal, color: "bg-amber-400" },
      { label: "旅行保険", amount: insuranceTotal, color: "bg-gray-400" },
    ].filter((c) => c.amount > 0);

    return {
      transportTotal,
      accommodationTotal,
      insuranceTotal,
      foodTotal,
      activityTotal,
      shoppingTotal,
      localTransportTotal,
      fixedTotal,
      variableTotal,
      grandTotal,
      perPerson,
      perDay,
      monthlyRequired,
      categories,
      nights,
      numPeople,
      numDays,
    };
  }, [people, days, transport, accommodation, insurance, food, activity, shopping, localTransport, savingMonths]);

  const fmt = (n: number) =>
    n >= 10000
      ? `${Math.round(n / 1000) / 10}万円`
      : `${Math.round(n).toLocaleString()}円`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-sky-500 to-cyan-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">✈️</span>
          <h1 className="text-2xl font-bold">旅行予算計算ツール</h1>
        </div>
        <p className="text-sky-100 text-sm">
          旅行の費用を項目別に計算。合計予算と1人当たりの費用を自動算出します。
        </p>
      </div>

      <AdBanner />

      {/* プリセット */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-gray-700 mb-3 text-sm">旅行先プリセット（クリックで入力を自動設定）</h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => applyPreset(preset)}
              className="flex items-center gap-1.5 px-3 py-2 bg-sky-50 border border-sky-200 text-sky-700 rounded-lg text-sm hover:bg-sky-100 transition-colors font-medium"
            >
              <span>{preset.icon}</span>
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 基本設定 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">基本設定</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">旅行人数</label>
            <select
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm bg-white"
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}人</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">旅行日数</label>
            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm bg-white"
            >
              {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}日（{Math.max(0, n - 1)}泊）</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">旅行先タイプ</label>
            <div className="flex gap-2 h-[46px]">
              {(["domestic", "overseas"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setDestType(t)}
                  className={`flex-1 rounded-lg text-sm font-medium transition-colors ${
                    destType === t
                      ? "bg-sky-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t === "domestic" ? "国内" : "海外"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 固定費 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">
          固定費（合計）
          <span className="text-xs font-normal text-gray-400 ml-2">全員分の合計</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              交通費（飛行機・新幹線等）（万円）
            </label>
            <input
              type="number"
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              placeholder="6"
              min="0"
              step="0.5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              宿泊費（万円/泊）× {result.nights}泊
            </label>
            <input
              type="number"
              value={accommodation}
              onChange={(e) => setAccommodation(e.target.value)}
              placeholder="1.5"
              min="0"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              旅行保険（円）
              {destType === "overseas" && (
                <span className="text-xs text-orange-500 ml-1">海外は推奨</span>
              )}
            </label>
            <input
              type="number"
              value={insurance}
              onChange={(e) => setInsurance(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 変動費 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">
          変動費（1人/日あたり）
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">食費（円/日）</label>
            <input
              type="number"
              value={food}
              onChange={(e) => setFood(e.target.value)}
              placeholder="3000"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">観光・アクティビティ（円/日）</label>
            <input
              type="number"
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              placeholder="3000"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">お土産・ショッピング（円/日）</label>
            <input
              type="number"
              value={shopping}
              onChange={(e) => setShopping(e.target.value)}
              placeholder="2000"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">現地交通費（円/日）</label>
            <input
              type="number"
              value={localTransport}
              onChange={(e) => setLocalTransport(e.target.value)}
              placeholder="1000"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 結果 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-center col-span-2">
          <div className="text-xs text-sky-600 font-medium mb-1">合計予算</div>
          <div className="text-3xl font-bold text-sky-700">{fmt(result.grandTotal)}</div>
        </div>
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 text-center">
          <div className="text-xs text-cyan-600 font-medium mb-1">1人当たり</div>
          <div className="text-xl font-bold text-cyan-700">{fmt(result.perPerson)}</div>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
          <div className="text-xs text-teal-600 font-medium mb-1">1日平均</div>
          <div className="text-xl font-bold text-teal-700">{fmt(result.perDay)}</div>
        </div>
      </div>

      {/* 費用カテゴリ内訳 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h3 className="font-bold text-gray-800 mb-4">費用カテゴリ別内訳</h3>

        {/* バーチャート */}
        <div className="space-y-3 mb-5">
          {result.categories.map((cat) => {
            const pct = result.grandTotal > 0 ? (cat.amount / result.grandTotal) * 100 : 0;
            return (
              <div key={cat.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{cat.label}</span>
                  <span className="text-gray-500">
                    {fmt(cat.amount)}
                    <span className="text-gray-400 ml-1">({pct.toFixed(1)}%)</span>
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`${cat.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* テーブル */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="pb-2 pr-4">カテゴリ</th>
                <th className="pb-2 pr-4 text-right">合計</th>
                <th className="pb-2 text-right">1人当たり</th>
              </tr>
            </thead>
            <tbody>
              {result.categories.map((cat) => (
                <tr key={cat.label} className="border-b border-gray-100">
                  <td className="py-2 pr-4">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${cat.color}`} />
                    {cat.label}
                  </td>
                  <td className="py-2 pr-4 text-right">{fmt(cat.amount)}</td>
                  <td className="py-2 text-right">
                    {result.numPeople > 0 ? fmt(cat.amount / result.numPeople) : "－"}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-300 font-bold">
                <td className="py-2 pr-4">合計</td>
                <td className="py-2 pr-4 text-right text-sky-700">{fmt(result.grandTotal)}</td>
                <td className="py-2 text-right text-sky-700">{fmt(result.perPerson)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 積立プラン */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
        <h3 className="font-bold text-amber-800 mb-3">積立プラン</h3>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium text-amber-700 whitespace-nowrap">旅行まで</label>
          <input
            type="number"
            value={savingMonths}
            onChange={(e) => setSavingMonths(e.target.value)}
            min="1"
            max="120"
            className="w-24 p-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm bg-white"
          />
          <label className="text-sm font-medium text-amber-700">ヶ月</label>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-amber-700">毎月の積立目標額：</span>
          <span className="text-3xl font-bold text-amber-800">{fmt(result.monthlyRequired)}</span>
          <span className="text-sm text-amber-600">/ 月</span>
        </div>
        <p className="text-xs text-amber-600 mt-2">
          合計 {fmt(result.grandTotal)} ÷ {savingMonths}ヶ月
        </p>
      </div>

      <AdBanner />

      <section className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">このツールについて</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          旅行の予算を交通費・宿泊費・食費・観光費などの項目別に計算できます。プリセットボタンで主要な旅行先の目安費用を自動入力できます。積立プラン機能で旅行に向けた毎月の積立目標額も計算できます。表示される金額はあくまで目安です。
        </p>
        <p className="text-xs text-gray-400 mt-2">
          ※ 実際の費用は時期・宿泊グレード・円相場等により大きく変動します。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "国内旅行の平均費用はいくらですか？",
            answer:
              "1泊2日で1人当たり約3〜5万円程度が目安です。目的地・宿泊グレードにより大きく変わります。",
          },
          {
            question: "海外旅行の平均予算はいくらですか？",
            answer:
              "アジア圏で3〜10万円、ハワイで15〜25万円、ヨーロッパで20〜40万円程度が1人当たりの目安です。",
          },
          {
            question: "旅行積立の方法を教えてください",
            answer:
              "目標金額を旅行までの月数で割って毎月の積立額を決めるのが基本です。このツールの積立プラン機能で計算できます。",
          },
          {
            question: "旅行保険は必要ですか？",
            answer:
              "海外旅行では医療費が高額になるリスクがあるため加入が強く推奨されます。クレジットカードの自動付帯保険も確認しましょう。",
          },
        ]}
      />

      <RelatedTools currentToolId="travel-budget" />
    </div>
  );
}
