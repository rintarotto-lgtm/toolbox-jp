"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type MeatFrequency = "daily" | "3-4" | "1-2" | "rarely";

interface CategoryResult {
  label: string;
  icon: string;
  monthlyKg: number;
  color: string;
}

const MEAT_CO2: Record<MeatFrequency, number> = {
  daily: 60,
  "3-4": 35,
  "1-2": 15,
  rarely: 5,
};

const MEAT_LABELS: Record<MeatFrequency, string> = {
  daily: "ほぼ毎日",
  "3-4": "週3〜4回",
  "1-2": "週1〜2回",
  rarely: "ほぼ食べない",
};

const JAPAN_AVERAGE_ANNUAL_T = 8.7;

export default function CarbonFootprintCalc() {
  const [electricity, setElectricity] = useState<string>("");
  const [gas, setGas] = useState<string>("");
  const [carKm, setCarKm] = useState<string>("");
  const [carFuel, setCarFuel] = useState<string>("");
  const [meatFreq, setMeatFreq] = useState<MeatFrequency>("3-4");
  const [flightDomestic, setFlightDomestic] = useState<string>("");
  const [flightInternational, setFlightInternational] = useState<string>("");

  const results: CategoryResult[] = useMemo(() => {
    const elec = parseFloat(electricity) || 0;
    const gasM3 = parseFloat(gas) || 0;
    const km = parseFloat(carKm) || 0;
    const fuelEff = parseFloat(carFuel) || 0;
    const domFlights = parseFloat(flightDomestic) || 0;
    const intlFlights = parseFloat(flightInternational) || 0;

    const elecCo2 = elec * 0.462;
    const gasCo2 = gasM3 * 2.23;
    const carCo2 = fuelEff > 0 ? (km / fuelEff) * 2.32 : 0;
    const meatCo2 = MEAT_CO2[meatFreq];
    const flightCo2 = domFlights * 55 + intlFlights * 500;

    const rows: CategoryResult[] = [
      { label: "電気", icon: "⚡", monthlyKg: elecCo2, color: "bg-yellow-400" },
      { label: "都市ガス", icon: "🔥", monthlyKg: gasCo2, color: "bg-orange-400" },
      { label: "自動車", icon: "🚗", monthlyKg: carCo2, color: "bg-gray-400" },
      { label: "食事（肉類）", icon: "🥩", monthlyKg: meatCo2, color: "bg-red-400" },
      {
        label: "飛行機",
        icon: "✈️",
        monthlyKg: flightCo2 / 12,
        color: "bg-blue-400",
      },
    ];
    return rows;
  }, [electricity, gas, carKm, carFuel, meatFreq, flightDomestic, flightInternational]);

  const totalMonthlyKg = useMemo(
    () => results.reduce((sum, r) => sum + r.monthlyKg, 0),
    [results]
  );
  const totalAnnualT = useMemo(() => (totalMonthlyKg * 12) / 1000, [totalMonthlyKg]);

  const comparisonPct = useMemo(
    () => (totalAnnualT / JAPAN_AVERAGE_ANNUAL_T) * 100,
    [totalAnnualT]
  );

  const advice = useMemo((): string[] => {
    const tips: string[] = [];
    const elec = parseFloat(electricity) || 0;
    const km = parseFloat(carKm) || 0;
    if (elec > 300) tips.push("電気使用量が多めです。LED照明への切り替えや省エネ家電の導入をご検討ください。");
    if (km > 500) tips.push("車の走行距離が長めです。公共交通機関の活用や電気自動車への移行が効果的です。");
    if (meatFreq === "daily" || meatFreq === "3-4") tips.push("肉食頻度を減らすと大幅にCO2を削減できます。週に1〜2日は植物性食品中心の食事を試してみてください。");
    if (totalAnnualT > JAPAN_AVERAGE_ANNUAL_T) tips.push("年間排出量が日本平均を上回っています。再生可能エネルギーへの切り替えが最も効果的な削減策の一つです。");
    if (tips.length === 0) tips.push("素晴らしい！現在の排出量は日本平均を下回っています。この調子で環境への取り組みを続けましょう。");
    return tips;
  }, [electricity, carKm, meatFreq, totalAnnualT]);

  const hasInput = useMemo(
    () =>
      [electricity, gas, carKm, flightDomestic, flightInternational].some(
        (v) => v !== ""
      ),
    [electricity, gas, carKm, flightDomestic, flightInternational]
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">カーボンフットプリント計算</h1>
      <p className="text-gray-500 text-sm mb-6">
        日常生活のCO2排出量を計算し、日本人平均と比較します。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 mt-6">
        <h2 className="font-bold text-gray-800">各カテゴリの情報を入力</h2>

        {/* 電気 */}
        <div className="border border-gray-100 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <span>⚡</span> 電気使用量
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={electricity}
              onChange={(e) => setElectricity(e.target.value)}
              placeholder="例：250"
              className="w-32 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="text-sm text-gray-500">kWh/月</span>
            {electricity && (
              <span className="text-sm text-green-600 font-medium ml-auto">
                {((parseFloat(electricity) || 0) * 0.462).toFixed(1)} kg-CO2/月
              </span>
            )}
          </div>
        </div>

        {/* 都市ガス */}
        <div className="border border-gray-100 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <span>🔥</span> 都市ガス使用量
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              value={gas}
              onChange={(e) => setGas(e.target.value)}
              placeholder="例：15"
              className="w-32 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <span className="text-sm text-gray-500">m³/月</span>
            {gas && (
              <span className="text-sm text-green-600 font-medium ml-auto">
                {((parseFloat(gas) || 0) * 2.23).toFixed(1)} kg-CO2/月
              </span>
            )}
          </div>
        </div>

        {/* 車 */}
        <div className="border border-gray-100 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <span>🚗</span> 自動車走行距離
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={carKm}
                onChange={(e) => setCarKm(e.target.value)}
                placeholder="例：500"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">km/月</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={carFuel}
                onChange={(e) => setCarFuel(e.target.value)}
                placeholder="燃費 例：15"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">km/L</span>
            </div>
          </div>
          {carKm && carFuel && (
            <div className="text-sm text-green-600 font-medium">
              {(((parseFloat(carKm) || 0) / (parseFloat(carFuel) || 1)) * 2.32).toFixed(1)} kg-CO2/月
            </div>
          )}
        </div>

        {/* 食事 */}
        <div className="border border-gray-100 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <span>🥩</span> 肉食頻度
          </div>
          <select
            value={meatFreq}
            onChange={(e) => setMeatFreq(e.target.value as MeatFrequency)}
            className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {(Object.keys(MEAT_LABELS) as MeatFrequency[]).map((key) => (
              <option key={key} value={key}>
                {MEAT_LABELS[key]}
              </option>
            ))}
          </select>
          <div className="text-sm text-green-600 font-medium">
            約 {MEAT_CO2[meatFreq]} kg-CO2/月
          </div>
        </div>

        {/* 飛行機 */}
        <div className="border border-gray-100 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 font-medium text-gray-700">
            <span>✈️</span> 飛行機搭乗（年間）
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={flightDomestic}
                onChange={(e) => setFlightDomestic(e.target.value)}
                placeholder="例：2"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">回（国内）</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                value={flightInternational}
                onChange={(e) => setFlightInternational(e.target.value)}
                placeholder="例：1"
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">回（国際）</span>
            </div>
          </div>
        </div>

        {/* 結果 */}
        {hasInput && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-green-700">
                  {totalMonthlyKg.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 mt-1">kg-CO2/月</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-green-700">
                  {totalAnnualT.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">t-CO2/年</div>
              </div>
            </div>

            {/* 日本平均比較 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>日本人平均比較</span>
                <span className="font-medium">
                  平均の{comparisonPct.toFixed(0)}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    comparisonPct <= 100 ? "bg-green-500" : "bg-orange-500"
                  }`}
                  style={{ width: `${Math.min(comparisonPct, 200) / 2}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0 t</span>
                <span>日本平均 {JAPAN_AVERAGE_ANNUAL_T} t</span>
              </div>
            </div>

            {/* 内訳 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                カテゴリ別内訳（月間）
              </h3>
              <div className="space-y-2">
                {results.map((cat) => (
                  <div key={cat.label} className="flex items-center gap-3">
                    <span className="text-lg w-6 text-center">{cat.icon}</span>
                    <span className="text-sm text-gray-600 w-28">{cat.label}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cat.color}`}
                        style={{
                          width:
                            totalMonthlyKg > 0
                              ? `${(cat.monthlyKg / totalMonthlyKg) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-20 text-right">
                      {cat.monthlyKg.toFixed(1)} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* アドバイス */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <h3 className="text-sm font-bold text-green-800 mb-2">
                🌱 削減アドバイス
              </h3>
              <ul className="space-y-1">
                {advice.map((tip, i) => (
                  <li key={i} className="text-sm text-green-700 flex gap-2">
                    <span>•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <AdBanner />

      <ToolFAQ
        faqs={[
          {
            question: "日本人のCO2排出量の平均は？",
            answer:
              "1人あたり年間約8〜10トンCO2換算。世界平均は約4.7トン。",
          },
          {
            question: "家庭でできるCO2削減は？",
            answer:
              "電力会社の切り替え、省エネ家電、食肉消費削減が効果的。",
          },
          {
            question: "カーボンオフセットとは？",
            answer:
              "削減困難なCO2排出量を植林等の活動で相殺する取り組み。",
          },
        ]}
      />

      <RelatedTools currentToolId="carbon-footprint-calc" />
    </div>
  );
}
