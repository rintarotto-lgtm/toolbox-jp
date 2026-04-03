"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type PowerSource = "normal" | "mixed" | "renew";
type CommuteMethod = "train" | "bus" | "car" | "bike" | "walk";
type BeefFreq = "none" | "weekly" | "daily";
type MeatFreq = "none" | "weekly" | "daily";
type EatOutFreq = "none" | "weekly" | "daily";

const POWER_FACTOR: Record<PowerSource, number> = {
  normal: 0.43,
  mixed: 0.2,
  renew: 0.0,
};

const COMMUTE_CO2_PER_KM: Record<CommuteMethod, number> = {
  train: 0.017,
  bus: 0.068,
  car: 0.21,
  bike: 0,
  walk: 0,
};

const BEEF_CO2: Record<BeefFreq, number> = {
  none: 50,
  weekly: 300,
  daily: 900,
};

const MEAT_CO2: Record<MeatFreq, number> = {
  none: 20,
  weekly: 100,
  daily: 300,
};

const EAT_OUT_CO2: Record<EatOutFreq, number> = {
  none: 0,
  weekly: 80,
  daily: 250,
};

export default function CarbonFootprint() {
  // Energy
  const [electricBill, setElectricBill] = useState(8000);
  const [gasBill, setGasBill] = useState(4000);
  const [powerSource, setPowerSource] = useState<PowerSource>("normal");

  // Commute
  const [commuteMethod, setCommuteMethod] = useState<CommuteMethod>("train");
  const [commuteDays, setCommuteDays] = useState(20);
  const [commuteDistance, setCommuteDistance] = useState(15);
  const [carDistance, setCarDistance] = useState(200);

  // Flight
  const [domesticFlights, setDomesticFlights] = useState(2);
  const [internationalFlights, setInternationalFlights] = useState(0);

  // Food
  const [beefFreq, setBeefFreq] = useState<BeefFreq>("weekly");
  const [meatFreq, setMeatFreq] = useState<MeatFreq>("weekly");
  const [eatOutFreq, setEatOutFreq] = useState<EatOutFreq>("weekly");

  // Shopping
  const [newPurchase, setNewPurchase] = useState(3);
  const [deliveries, setDeliveries] = useState(8);

  const result = useMemo(() => {
    // Energy CO2 (kg/year)
    const electricKwh = (electricBill * 12) / 30;
    const electricCo2 = electricKwh * POWER_FACTOR[powerSource];
    const gasM3 = (gasBill * 12) / 200;
    const gasCo2 = gasM3 * 2.0;
    const energyCo2 = electricCo2 + gasCo2;

    // Transport CO2 (kg/year)
    const commuteCo2 =
      COMMUTE_CO2_PER_KM[commuteMethod] * commuteDistance * 2 * commuteDays * 12;
    const carCo2 = 0.21 * carDistance * 12;
    const domesticFlightCo2 = domesticFlights * 100;
    const internationalFlightCo2 = internationalFlights * 1500;
    const transportCo2 = commuteCo2 + carCo2 + domesticFlightCo2 + internationalFlightCo2;

    // Food CO2 (kg/year)
    const foodCo2 =
      BEEF_CO2[beefFreq] +
      MEAT_CO2[meatFreq] +
      EAT_OUT_CO2[eatOutFreq] +
      200; // base food

    // Shopping CO2 (kg/year)
    const shoppingCo2 = newPurchase * 12 * 50 + deliveries * 12 * 0.5;

    const total = energyCo2 + transportCo2 + foodCo2 + shoppingCo2;
    const totalTons = total / 1000;

    // Reduction scenarios (kg/year saved)
    const reductions = [
      {
        label: "再エネ100%に切り替え",
        saving: electricKwh * POWER_FACTOR[powerSource],
        category: "エネルギー",
      },
      {
        label: "自動車→電車通勤に変更",
        saving:
          commuteMethod === "car"
            ? (COMMUTE_CO2_PER_KM["car"] - COMMUTE_CO2_PER_KM["train"]) *
              commuteDistance *
              2 *
              commuteDays *
              12
            : 0,
        category: "移動",
      },
      {
        label: "牛肉消費を週1→ゼロに",
        saving: beefFreq !== "none" ? BEEF_CO2[beefFreq] - BEEF_CO2["none"] : 0,
        category: "食事",
      },
      {
        label: "国内フライトを半減",
        saving: domesticFlightCo2 * 0.5,
        category: "移動",
      },
      {
        label: "新品購入を半減",
        saving: shoppingCo2 * 0.5,
        category: "消費",
      },
    ].filter((r) => r.saving > 0);

    const offsetCostLow = Math.round(totalTons * 500);
    const offsetCostHigh = Math.round(totalTons * 3000);

    return {
      energyCo2: Math.round(energyCo2),
      transportCo2: Math.round(transportCo2),
      foodCo2: Math.round(foodCo2),
      shoppingCo2: Math.round(shoppingCo2),
      totalKg: Math.round(total),
      totalTons: Math.round(totalTons * 10) / 10,
      reductions,
      offsetCostLow,
      offsetCostHigh,
    };
  }, [
    electricBill,
    gasBill,
    powerSource,
    commuteMethod,
    commuteDays,
    commuteDistance,
    carDistance,
    domesticFlights,
    internationalFlights,
    beefFreq,
    meatFreq,
    eatOutFreq,
    newPurchase,
    deliveries,
  ]);

  const japanAvg = 8.0;
  const compareRatio = Math.round((result.totalTons / japanAvg) * 100);

  const categories = [
    { label: "エネルギー", value: result.energyCo2, color: "bg-yellow-400" },
    { label: "移動", value: result.transportCo2, color: "bg-blue-400" },
    { label: "食事", value: result.foodCo2, color: "bg-green-400" },
    { label: "消費", value: result.shoppingCo2, color: "bg-purple-400" },
  ];
  const maxCat = Math.max(...categories.map((c) => c.value), 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-green-600 to-emerald-700 p-6 mb-6 text-white">
        <div className="text-4xl mb-2">🌍</div>
        <h1 className="text-2xl font-bold mb-1">カーボンフットプリント計算</h1>
        <p className="text-green-100 text-sm">
          日常生活のCO2排出量を無料診断・削減シミュレーション
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-8 mt-6">

        {/* Energy Section */}
        <section>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-lg">⚡</span> エネルギー
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  月間電気代（円）
                </label>
                <input
                  type="number"
                  value={electricBill}
                  onChange={(e) => setElectricBill(Number(e.target.value))}
                  min={0}
                  step={500}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  月間ガス代（円）
                </label>
                <input
                  type="number"
                  value={gasBill}
                  onChange={(e) => setGasBill(Number(e.target.value))}
                  min={0}
                  step={500}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                電力会社の電源構成
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    { value: "normal", label: "通常", desc: "0.43kg/kWh" },
                    { value: "mixed", label: "再エネ混合", desc: "0.2kg/kWh" },
                    { value: "renew", label: "再エネ100%", desc: "0.0kg/kWh" },
                  ] as { value: PowerSource; label: string; desc: string }[]
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPowerSource(opt.value)}
                    className={`py-3 rounded-lg border text-sm font-medium transition-colors flex flex-col items-center gap-0.5 ${
                      powerSource === opt.value
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span
                      className={`text-xs font-normal ${
                        powerSource === opt.value ? "text-green-100" : "text-gray-400"
                      }`}
                    >
                      {opt.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Transport Section */}
        <section>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-lg">🚗</span> 移動
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">通勤方法</label>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "train", label: "電車" },
                    { value: "bus", label: "バス" },
                    { value: "car", label: "自動車" },
                    { value: "bike", label: "自転車" },
                    { value: "walk", label: "徒歩" },
                  ] as { value: CommuteMethod; label: string }[]
                ).map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setCommuteMethod(opt.value)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      commuteMethod === opt.value
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  月の通勤日数（日）
                </label>
                <input
                  type="number"
                  value={commuteDays}
                  onChange={(e) => setCommuteDays(Number(e.target.value))}
                  min={0}
                  max={31}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  片道距離（km）
                </label>
                <input
                  type="number"
                  value={commuteDistance}
                  onChange={(e) => setCommuteDistance(Number(e.target.value))}
                  min={0}
                  step={0.5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  月の自家用車走行距離（km）
                </label>
                <input
                  type="number"
                  value={carDistance}
                  onChange={(e) => setCarDistance(Number(e.target.value))}
                  min={0}
                  step={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  年間国内フライト（回）
                </label>
                <input
                  type="number"
                  value={domesticFlights}
                  onChange={(e) => setDomesticFlights(Number(e.target.value))}
                  min={0}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  年間海外フライト（回）
                </label>
                <input
                  type="number"
                  value={internationalFlights}
                  onChange={(e) => setInternationalFlights(Number(e.target.value))}
                  min={0}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Food Section */}
        <section>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-lg">🍽️</span> 食事
          </h2>
          <div className="space-y-4">
            {(
              [
                {
                  label: "牛肉の消費頻度",
                  state: beefFreq,
                  setter: setBeefFreq as (v: string) => void,
                  type: "beef",
                },
                {
                  label: "豚・鶏肉の消費頻度",
                  state: meatFreq,
                  setter: setMeatFreq as (v: string) => void,
                  type: "meat",
                },
                {
                  label: "外食頻度",
                  state: eatOutFreq,
                  setter: setEatOutFreq as (v: string) => void,
                  type: "eatout",
                },
              ] as { label: string; state: string; setter: (v: string) => void; type: string }[]
            ).map((item) => (
              <div key={item.type}>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  {item.label}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "none", label: "ほぼ食べない" },
                    { value: "weekly", label: "週1〜2回" },
                    { value: "daily", label: "ほぼ毎日" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => item.setter(opt.value)}
                      className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        item.state === opt.value
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Shopping Section */}
        <section>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="text-lg">🛒</span> 消費
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                月の新品購入額（服・家電等, 万円）
              </label>
              <input
                type="number"
                value={newPurchase}
                onChange={(e) => setNewPurchase(Number(e.target.value))}
                min={0}
                step={0.5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                ネット通販の配送回数（回/月）
              </label>
              <input
                type="number"
                value={deliveries}
                onChange={(e) => setDeliveries(Number(e.target.value))}
                min={0}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Results */}
        <div className="border-t border-gray-100 pt-6">
          <h2 className="font-bold text-gray-800 mb-4">診断結果</h2>

          {/* Main result card */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 text-center mb-4">
            <div className="text-sm text-gray-500 mb-1">あなたの年間CO2排出量</div>
            <div className="text-5xl font-bold text-green-700 mb-1">
              {result.totalTons}
              <span className="text-xl font-normal ml-1">tCO2</span>
            </div>
            <div className="text-sm text-gray-500">({result.totalKg.toLocaleString()} kg)</div>
            <div
              className={`mt-3 inline-block px-4 py-1.5 rounded-full text-sm font-medium ${
                compareRatio <= 50
                  ? "bg-green-100 text-green-700"
                  : compareRatio <= 100
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              日本人平均（8.0t）の {compareRatio}%
            </div>
          </div>

          {/* Category bar chart */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">カテゴリ別内訳</h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div key={cat.label}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>{cat.label}</span>
                    <span>{(cat.value / 1000).toFixed(2)} tCO2</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${cat.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max((cat.value / maxCat) * 100, 2)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reduction simulations */}
          {result.reductions.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">削減効果シミュレーション</h3>
              <div className="space-y-2">
                {result.reductions.map((r) => (
                  <div key={r.label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">{r.label}</span>
                    <span className="font-medium text-blue-700">
                      −{(r.saving / 1000).toFixed(2)} t (
                      {result.totalKg > 0
                        ? Math.round((r.saving / result.totalKg) * 100)
                        : 0}
                      %削減)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Offset cost */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              カーボンオフセット費用換算
            </h3>
            <p className="text-amber-700 font-bold text-lg">
              年間 {result.offsetCostLow.toLocaleString()}〜
              {result.offsetCostHigh.toLocaleString()} 円
            </p>
            <p className="text-xs text-gray-500 mt-1">
              1tCO2あたり500〜3,000円で試算。オフセット購入により排出量を相殺できます。
            </p>
          </div>
        </div>
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">カーボンフットプリント計算の使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          電気・ガス代、通勤・移動手段、食事・外食頻度、買い物額を入力することで、
          年間のCO2排出量（カーボンフットプリント）をカテゴリ別に算出します。
          日本人平均（約8トン）との比較や、行動変容による削減効果も表示。
          パリ協定の目標（2050年に1人2トン以下）への達成度もご確認ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "日本人1人当たりのCO2排出量はどのくらいですか？",
            answer:
              "日本人の年間CO2排出量は1人当たり約7〜9トンとされています。世界平均は約4トンで、パリ協定の目標（2050年カーボンニュートラル）には1人あたり2トン以下が必要です。",
          },
          {
            question: "一番CO2を減らせる行動は何ですか？",
            answer:
              "最も効果が大きいのは食事（特に牛肉の消費削減）、航空機利用の削減、自動車からの電車・自転車への転換です。電力の再エネ切り替えも効果的です。",
          },
          {
            question: "電気1kWhあたりのCO2排出量はいくらですか？",
            answer:
              "日本の電力のCO2排出係数は約0.43kg-CO2/kWh（2022年度）です。再生可能エネルギー100%の電力会社に切り替えることで大幅削減できます。",
          },
          {
            question: "カーボンオフセットとは何ですか？",
            answer:
              "削減困難なCO2排出量を、植林や再エネ事業への投資などで相殺することです。1トンのCO2オフセットは数百〜数千円程度で購入できます。",
          },
        ]}
      />

      <RelatedTools currentToolId="carbon-footprint" />

      <p className="text-xs text-gray-400 mt-6 text-center">
        ※ 本ツールの計算結果は概算です。排出係数は代表値を使用しており、実際の数値とは異なる場合があります。
      </p>
    </div>
  );
}
