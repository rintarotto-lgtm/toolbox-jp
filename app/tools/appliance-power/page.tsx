"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface ApplianceItem {
  id: number;
  name: string;
  watts: number;
  hoursPerDay: number;
  daysPerMonth: number;
  emoji: string;
}

const PRESET_APPLIANCES = [
  { name: "エアコン 冷房", watts: 600, emoji: "❄️" },
  { name: "エアコン 暖房", watts: 900, emoji: "🌡️" },
  { name: "テレビ 50型", watts: 150, emoji: "📺" },
  { name: "炊飯器 炊飯中", watts: 1200, emoji: "🍚" },
  { name: "炊飯器 保温", watts: 30, emoji: "🍚" },
  { name: "電気ポット", watts: 900, emoji: "♨️" },
  { name: "食洗機", watts: 800, emoji: "🫧" },
  { name: "洗濯乾燥機", watts: 1000, emoji: "👗" },
  { name: "ノートPC", watts: 40, emoji: "💻" },
  { name: "デスクトップPC", watts: 200, emoji: "🖥️" },
  { name: "LED電球", watts: 8, emoji: "💡" },
  { name: "蛍光灯", watts: 40, emoji: "💡" },
  { name: "電気ストーブ", watts: 1200, emoji: "🔥" },
];

let nextId = 100;

export default function AppliancePower() {
  const [unitPrice, setUnitPrice] = useState("31");
  const [appliances, setAppliances] = useState<ApplianceItem[]>([
    { id: 1, name: "エアコン 冷房", watts: 600, hoursPerDay: 8, daysPerMonth: 30, emoji: "❄️" },
    { id: 2, name: "テレビ 50型", watts: 150, hoursPerDay: 4, daysPerMonth: 30, emoji: "📺" },
  ]);
  const [customName, setCustomName] = useState("");
  const [customWatts, setCustomWatts] = useState("");

  const price = parseFloat(unitPrice) || 31;

  const calcCosts = (watts: number, hours: number, days: number) => {
    const kw = watts / 1000;
    const perHour = kw * price;
    const perDay = kw * hours * price;
    const perMonth = kw * hours * days * price;
    return { perHour, perDay, perMonth };
  };

  const results = useMemo(() => {
    return appliances.map((a) => ({
      ...a,
      ...calcCosts(a.watts, a.hoursPerDay, a.daysPerMonth),
    }));
  }, [appliances, price]);

  const totalMonthly = useMemo(
    () => results.reduce((sum, r) => sum + r.perMonth, 0),
    [results]
  );

  const top3 = useMemo(
    () => [...results].sort((a, b) => b.perMonth - a.perMonth).slice(0, 3),
    [results]
  );

  const addPreset = (preset: (typeof PRESET_APPLIANCES)[0]) => {
    setAppliances((prev) => [
      ...prev,
      {
        id: nextId++,
        name: preset.name,
        watts: preset.watts,
        hoursPerDay: 4,
        daysPerMonth: 30,
        emoji: preset.emoji,
      },
    ]);
  };

  const addCustom = () => {
    const w = parseFloat(customWatts);
    if (!customName || !w || w <= 0) return;
    setAppliances((prev) => [
      ...prev,
      { id: nextId++, name: customName, watts: w, hoursPerDay: 4, daysPerMonth: 30, emoji: "⚡" },
    ]);
    setCustomName("");
    setCustomWatts("");
  };

  const removeAppliance = (id: number) => {
    setAppliances((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAppliance = (id: number, field: "hoursPerDay" | "daysPerMonth", value: number) => {
    setAppliances((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🔌</span>
          <h1 className="text-2xl font-bold">家電電気代計算</h1>
        </div>
        <p className="text-yellow-100 text-sm">
          消費電力（W）・使用時間・電気料金単価から1時間・1日・1ヶ月の電気代を計算します。
        </p>
      </div>

      <AdBanner />

      {/* Unit price */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          電力料金単価（円/kWh）
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            min="0"
            step="0.1"
            className="w-40 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
          <span className="text-sm text-gray-500">円/kWh（全国平均目安：31円）</span>
        </div>
      </div>

      {/* Preset picker */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-gray-800 mb-3 text-sm">主要家電から追加</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {PRESET_APPLIANCES.map((p) => (
            <button
              key={p.name}
              onClick={() => addPreset(p)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors text-gray-700"
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
              <span className="text-gray-400">({p.watts}W)</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="家電名"
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
          <input
            type="number"
            value={customWatts}
            onChange={(e) => setCustomWatts(e.target.value)}
            placeholder="消費電力(W)"
            min="0"
            className="w-36 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
          />
          <button
            onClick={addCustom}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-lg transition-colors"
          >
            追加
          </button>
        </div>
      </div>

      {/* Appliance list */}
      {appliances.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">登録家電リスト</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {appliances.map((a) => (
              <div key={a.id} className="px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{a.emoji}</span>
                    <span className="font-medium text-gray-800 text-sm">{a.name}</span>
                    <span className="text-xs text-gray-400">{a.watts}W</span>
                  </div>
                  <button
                    onClick={() => removeAppliance(a.id)}
                    className="text-gray-300 hover:text-red-400 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      1日の使用時間: <span className="font-medium text-gray-700">{a.hoursPerDay}時間</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="0.5"
                      value={a.hoursPerDay}
                      onChange={(e) => updateAppliance(a.id, "hoursPerDay", parseFloat(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      月の使用日数: <span className="font-medium text-gray-700">{a.daysPerMonth}日</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="31"
                      step="1"
                      value={a.daysPerMonth}
                      onChange={(e) => updateAppliance(a.id, "daysPerMonth", parseInt(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <>
          {/* Total */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="sm:col-span-2 bg-amber-50 border border-amber-300 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-amber-600 mb-1">
                ¥{Math.round(totalMonthly).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">合計月間電気代</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-gray-700 mb-1">
                ¥{Math.round(totalMonthly * 12).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">年間電気代</div>
            </div>
          </div>

          <AdBanner />

          {/* Breakdown table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">家電別内訳</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">家電</th>
                    <th className="px-4 py-3 text-right text-gray-600 font-medium">1時間</th>
                    <th className="px-4 py-3 text-right text-gray-600 font-medium">1日</th>
                    <th className="px-4 py-3 text-right text-gray-600 font-medium">1ヶ月</th>
                    <th className="px-4 py-3 text-right text-gray-600 font-medium">割合</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {results.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="mr-1.5">{r.emoji}</span>
                        {r.name}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        ¥{r.perHour.toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        ¥{Math.round(r.perDay).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-amber-600">
                        ¥{Math.round(r.perMonth).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500 text-xs">
                        {totalMonthly > 0
                          ? ((r.perMonth / totalMonthly) * 100).toFixed(1)
                          : "0"}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top 3 */}
          {top3.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
              <h2 className="font-bold text-gray-800 mb-4">節電ランキング（電気代TOP3）</h2>
              <div className="space-y-3">
                {top3.map((item, i) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                        i === 0
                          ? "bg-amber-500"
                          : i === 1
                          ? "bg-gray-400"
                          : "bg-orange-400"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="text-lg">{item.emoji}</span>
                    <span className="flex-1 text-sm text-gray-700">{item.name}</span>
                    <span className="font-bold text-amber-600 text-sm">
                      ¥{Math.round(item.perMonth).toLocaleString()}/月
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-3">家電電気代計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          電力料金単価を設定し、計算したい家電を選択して追加します。各家電の1日の使用時間と月の使用日数をスライダーで設定すると、1時間・1日・1ヶ月の電気代を自動計算します。節電ランキングで最も電気代のかかっている家電を把握できます。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "電気代の計算方法は？",
            answer:
              "電気代 = 消費電力(kW) × 使用時間(h) × 電力料金単価(円/kWh)で計算します。1,000Wの家電を1時間使うと1kWh消費し、単価30円なら30円かかります。",
          },
          {
            question: "エアコンの電気代はどのくらいですか？",
            answer:
              "6畳用エアコン（消費電力500〜700W）を1日8時間使用した場合、月額3,000〜5,000円程度が目安です。設定温度を1度上げるだけで約10%節電できます。",
          },
          {
            question: "冷蔵庫は常に電気を使っているのですか？",
            answer:
              "冷蔵庫は24時間365日稼働していますが、コンプレッサーが断続的に動作します。年間消費電力量は機種によって200〜600kWhで、電気代換算で年間6,000〜18,000円程度です。",
          },
          {
            question: "待機電力はどのくらいかかっていますか？",
            answer:
              "テレビ・エアコン・電子レンジなどの待機電力は1台あたり1〜6W程度です。家全体で20〜30W程度の待機電力があり、年間約5,000〜8,000円かかっているとされています。",
          },
        ]}
      />

      <RelatedTools currentToolId="appliance-power" />

      <p className="text-xs text-gray-400 mt-6 text-center">
        ※本ツールは目安計算です。実際の電気代は電力会社・契約プラン・季節・使用環境によって異なります。
      </p>
    </div>
  );
}
