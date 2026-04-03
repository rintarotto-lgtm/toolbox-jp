"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/* ─── 地域別日射量 (kWh/kW/日) ─── */
const REGIONS: { name: string; irradiance: number }[] = [
  { name: "北海道", irradiance: 3.3 },
  { name: "東北", irradiance: 3.5 },
  { name: "関東", irradiance: 3.8 },
  { name: "中部", irradiance: 3.7 },
  { name: "近畿", irradiance: 3.9 },
  { name: "中国", irradiance: 3.8 },
  { name: "四国", irradiance: 4.0 },
  { name: "九州", irradiance: 4.1 },
];

const SYSTEM_EFFICIENCY = 0.75;

function formatMan(n: number): string {
  return `${Math.round(n).toLocaleString()}万円`;
}

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

function formatKwh(n: number): string {
  return `${Math.round(n).toLocaleString()} kWh`;
}

export default function SolarPanelPage() {
  const [capacity, setCapacity] = useState(4.5);
  const [regionIdx, setRegionIdx] = useState(2); // 関東
  const [installCostMan, setInstallCostMan] = useState(135); // 30万/kW × 4.5kW
  const [monthlyBill, setMonthlyBill] = useState(12000);
  const [fitPrice, setFitPrice] = useState(16);
  const [electricRate, setElectricRate] = useState(31);
  const [selfConsumptionRate, setSelfConsumptionRate] = useState(40);
  const [subsidyMan, setSubsidyMan] = useState(0);
  const [addBattery, setAddBattery] = useState(false);
  const [batteryCostMan, setBatteryCostMan] = useState(100);

  // Auto-calc install cost when capacity changes (30万/kW)
  const handleCapacityChange = (val: number) => {
    setCapacity(val);
    setInstallCostMan(Math.round(val * 30));
  };

  const results = useMemo(() => {
    const irradiance = REGIONS[regionIdx].irradiance;
    // 年間発電量
    const annualGenKwh = capacity * irradiance * 365 * SYSTEM_EFFICIENCY;

    // 自家消費分 / 売電分
    const selfConsumedKwh = annualGenKwh * (selfConsumptionRate / 100);
    const exportKwh = annualGenKwh * (1 - selfConsumptionRate / 100);

    // 年間節約・収入
    const annualSavingYen = selfConsumedKwh * electricRate;
    const annualFitYen = exportKwh * fitPrice;
    const annualBenefitYen = annualSavingYen + annualFitYen;

    // 実質費用
    const totalCostMan = installCostMan - subsidyMan + (addBattery ? batteryCostMan : 0);
    const totalCostYen = totalCostMan * 10000;

    // 投資回収期間
    const paybackYears = annualBenefitYen > 0 ? totalCostYen / annualBenefitYen : Infinity;

    // 累計収益
    const profit10 = annualBenefitYen * 10 - totalCostYen;
    const profit20 = annualBenefitYen * 20 - totalCostYen;
    const profit25 = annualBenefitYen * 25 - totalCostYen;

    return {
      annualGenKwh,
      annualSavingYen,
      annualFitYen,
      annualBenefitYen,
      totalCostMan,
      totalCostYen,
      paybackYears,
      profit10,
      profit20,
      profit25,
    };
  }, [
    capacity,
    regionIdx,
    installCostMan,
    fitPrice,
    electricRate,
    selfConsumptionRate,
    subsidyMan,
    addBattery,
    batteryCostMan,
  ]);

  const paybackProgress = Math.min(
    100,
    results.paybackYears < Infinity ? (results.paybackYears / 25) * 100 : 100
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 mb-8 text-white">
        <div className="text-4xl mb-2">☀️</div>
        <h1 className="text-2xl font-bold mb-1">太陽光発電シミュレーター</h1>
        <p className="text-sm opacity-90">
          設置費用・年間発電量・売電収入・投資回収期間を無料計算
        </p>
      </div>

      {/* Inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 mb-6">
        <h2 className="font-bold text-gray-800 text-lg">設置条件を入力</h2>

        {/* 設置容量 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            設置容量:{" "}
            <span className="text-orange-600 font-bold">{capacity} kW</span>
          </label>
          <input
            type="range"
            min={2}
            max={10}
            step={0.5}
            value={capacity}
            onChange={(e) => handleCapacityChange(parseFloat(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>2kW</span>
            <span>4kW</span>
            <span>6kW</span>
            <span>8kW</span>
            <span>10kW</span>
          </div>
        </div>

        {/* 設置地域 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            設置地域
          </label>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((r, i) => (
              <button
                key={r.name}
                onClick={() => setRegionIdx(i)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  regionIdx === i
                    ? "bg-orange-100 border-orange-400 text-orange-800 font-medium"
                    : "bg-white border-gray-200 text-gray-600 hover:border-orange-300"
                }`}
              >
                {r.name}
                <span className="text-xs ml-1 opacity-60">{r.irradiance}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 設置費用 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              設置費用 (万円)
            </label>
            <input
              type="number"
              min={0}
              value={installCostMan}
              onChange={(e) => setInstallCostMan(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <p className="text-xs text-gray-400 mt-1">目安: 25〜35万円/kW</p>
          </div>

          {/* 補助金 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              補助金額 (万円)
            </label>
            <input
              type="number"
              min={0}
              value={subsidyMan}
              onChange={(e) => setSubsidyMan(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <p className="text-xs text-gray-400 mt-1">国・自治体補助金合計</p>
          </div>

          {/* 月間電気代 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              現在の月間電気代 (円)
            </label>
            <input
              type="number"
              min={0}
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* 売電単価 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              売電単価 (円/kWh)
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={fitPrice}
              onChange={(e) => setFitPrice(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <p className="text-xs text-gray-400 mt-1">FIT 2024年度: 16円</p>
          </div>

          {/* 電気料金単価 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              電気料金単価 (円/kWh)
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={electricRate}
              onChange={(e) => setElectricRate(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* 自家消費率 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              自家消費率:{" "}
              <span className="text-orange-600 font-bold">{selfConsumptionRate}%</span>
            </label>
            <input
              type="range"
              min={10}
              max={90}
              step={5}
              value={selfConsumptionRate}
              onChange={(e) => setSelfConsumptionRate(parseInt(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>10%</span>
              <span>50%</span>
              <span>90%</span>
            </div>
          </div>
        </div>

        {/* 蓄電池 */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAddBattery(!addBattery)}
              className={`w-12 h-6 rounded-full transition-colors relative ${
                addBattery ? "bg-orange-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                  addBattery ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">蓄電池を追加する</span>
          </div>
          {addBattery && (
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                蓄電池費用 (万円)
              </label>
              <input
                type="number"
                min={0}
                value={batteryCostMan}
                onChange={(e) => setBatteryCostMan(parseFloat(e.target.value) || 0)}
                className="w-48 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <p className="text-xs text-gray-400 mt-1">目安: 70〜150万円</p>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4 mb-6">
        <h2 className="font-bold text-gray-800 text-lg">シミュレーション結果</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">
              {formatKwh(results.annualGenKwh)}
            </div>
            <div className="text-xs text-yellow-600 mt-1">年間発電量</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-700">
              {formatYen(results.annualSavingYen)}
            </div>
            <div className="text-xs text-orange-600 mt-1">年間電気代節約額</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-700">
              {formatYen(results.annualFitYen)}
            </div>
            <div className="text-xs text-green-600 mt-1">年間売電収入</div>
          </div>
          <div className="bg-emerald-50 border-2 border-emerald-400 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {formatYen(results.annualBenefitYen)}
            </div>
            <div className="text-xs text-emerald-600 mt-1">年間合計メリット</div>
          </div>
        </div>

        {/* 費用・回収期間 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">設置費用（補助金差引後）</span>
            <span className="font-bold text-gray-800">{formatMan(results.totalCostMan)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">投資回収期間</span>
            <span className="font-bold text-gray-800">
              {results.paybackYears < Infinity
                ? `約 ${results.paybackYears.toFixed(1)} 年`
                : "計算不可"}
            </span>
          </div>

          {/* プログレスバー */}
          {results.paybackYears < Infinity && (
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>0年</span>
                <span>回収: {results.paybackYears.toFixed(1)}年目</span>
                <span>25年</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${paybackProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 累計収益 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3">累計収益（費用差引後）</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "10年後", value: results.profit10 },
              { label: "20年後", value: results.profit20 },
              { label: "25年後", value: results.profit25 },
            ].map(({ label, value }) => (
              <div
                key={label}
                className={`rounded-xl p-3 text-center ${
                  value >= 0
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div
                  className={`text-lg font-bold ${
                    value >= 0 ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {value >= 0 ? "+" : ""}
                  {formatYen(value)}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AdBanner />
      <RelatedTools currentToolId="solar-panel" />

      {/* FAQ */}
      <section className="mt-10 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">よくある質問</h2>
        {[
          {
            q: "太陽光発電の設置費用はいくらですか？",
            a: "4kWシステムで120〜160万円程度が相場です（2024年）。容量1kWあたり25〜35万円が目安です。補助金を活用することで実質負担を減らせます。",
          },
          {
            q: "太陽光発電の売電価格はいくらですか？",
            a: "2024年度のFIT制度による売電価格は10kW未満の住宅用で16円/kWhです（10年間固定）。余剰電力のみ売電する余剰売電が一般的です。",
          },
          {
            q: "太陽光発電の投資回収期間は何年ですか？",
            a: "一般的に10〜15年程度とされています。電気代節約効果と売電収入の合計が設置費用を上回るまでの期間です。設置環境や電気代によって大きく変わります。",
          },
          {
            q: "蓄電池と一緒に設置するメリットは？",
            a: "昼間に発電した電気を蓄電して夜間に使用でき、自家消費率が向上します。停電時の非常用電源にもなります。ただし蓄電池の追加費用（70〜150万円）も考慮が必要です。",
          },
        ].map(({ q, a }) => (
          <div key={q} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="font-medium text-gray-800 text-sm mb-1">Q. {q}</p>
            <p className="text-sm text-gray-600">A. {a}</p>
          </div>
        ))}
      </section>

      {/* Disclaimer */}
      <p className="mt-8 text-xs text-gray-400 leading-relaxed">
        ※本シミュレーションは概算値です。実際の発電量・収益は天候・設置角度・機器性能等により異なります。投資判断は専門業者にご相談ください。
      </p>
    </div>
  );
}
