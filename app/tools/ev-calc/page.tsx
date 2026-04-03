"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// CO2排出係数 (kg-CO2/kWh 電力) / ガソリン (kg-CO2/L: 2.322)
const CO2_ELECTRIC = 0.434; // kg-CO2/kWh
const CO2_GASOLINE_PER_L = 2.322; // kg-CO2/L

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}
function formatMan(n: number): string {
  return `${n.toFixed(1)}万円`;
}

export default function EvCalcPage() {
  // EV
  const [evPriceMan, setEvPriceMan] = useState(450);
  const [evSubsidyMan, setEvSubsidyMan] = useState(65);
  const [evRangeKm, setEvRangeKm] = useState(400);
  const [evEfficiency, setEvEfficiency] = useState(6.5); // km/kWh
  const [homeChargeRate, setHomeChargeRate] = useState(25); // 円/kWh
  const [chargeEquipCostMan, setChargeEquipCostMan] = useState(20);
  const [homeChargeRatio, setHomeChargeRatio] = useState(80); // %

  // ガソリン車
  const [gasPriceMan, setGasPriceMan] = useState(350);
  const [gasFuelEff, setGasFuelEff] = useState(15); // km/L
  const [gasPrice, setGasPrice] = useState(170); // 円/L

  // 共通
  const [annualKm, setAnnualKm] = useState(10000);
  const [years, setYears] = useState(10);

  const results = useMemo(() => {
    // EV初期費用
    const evInitialYen = (evPriceMan - evSubsidyMan + chargeEquipCostMan) * 10000;

    // ガソリン車初期費用
    const gasInitialYen = gasPriceMan * 10000;

    // 年間燃料費 EV
    const homeKm = annualKm * (homeChargeRatio / 100);
    const externalKm = annualKm * (1 - homeChargeRatio / 100);
    const externalChargeRate = homeChargeRate * 2.5; // 外部充電は割高
    const annualEvFuelYen =
      (homeKm / evEfficiency) * homeChargeRate +
      (externalKm / evEfficiency) * externalChargeRate;

    // 年間燃料費 ガソリン車
    const annualGasFuelYen = (annualKm / gasFuelEff) * gasPrice;

    // 年間燃料費差額
    const annualSavingYen = annualGasFuelYen - annualEvFuelYen;

    // 初期費用差 (正=EVが高い)
    const initialDiffYen = evInitialYen - gasInitialYen;

    // 損益分岐点: initialDiff / annualSaving
    const breakEvenYears =
      annualSavingYen > 0 ? initialDiffYen / annualSavingYen : Infinity;

    // 比較期間分の総コスト
    const evTotalYen = evInitialYen + annualEvFuelYen * years;
    const gasTotalYen = gasInitialYen + annualGasFuelYen * years;
    const totalSavingYen = gasTotalYen - evTotalYen;

    // CO2削減量
    const evCo2Annual = (annualKm / evEfficiency) * CO2_ELECTRIC;
    const gasCo2Annual = (annualKm / gasFuelEff) * CO2_GASOLINE_PER_L;
    const co2ReduceAnnual = gasCo2Annual - evCo2Annual;
    const co2ReduceTotal = co2ReduceAnnual * years;

    // 年別累計コスト差 (EV有利度)
    const yearlyData = Array.from({ length: years }, (_, i) => {
      const yr = i + 1;
      const evCumulative = evInitialYen + annualEvFuelYen * yr;
      const gasCumulative = gasInitialYen + annualGasFuelYen * yr;
      return { yr, diff: gasCumulative - evCumulative };
    });

    return {
      evInitialYen,
      gasInitialYen,
      annualEvFuelYen,
      annualGasFuelYen,
      annualSavingYen,
      initialDiffYen,
      breakEvenYears,
      evTotalYen,
      gasTotalYen,
      totalSavingYen,
      co2ReduceAnnual,
      co2ReduceTotal,
      yearlyData,
    };
  }, [
    evPriceMan,
    evSubsidyMan,
    chargeEquipCostMan,
    gasPriceMan,
    gasFuelEff,
    gasPrice,
    evEfficiency,
    homeChargeRate,
    homeChargeRatio,
    annualKm,
    years,
  ]);

  const maxAbsDiff = Math.max(
    ...results.yearlyData.map((d) => Math.abs(d.diff)),
    1
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-8 text-white">
        <div className="text-4xl mb-2">⚡</div>
        <h1 className="text-2xl font-bold mb-1">電気自動車コスト計算</h1>
        <p className="text-sm opacity-90">
          EVとガソリン車のトータルコストを無料比較・損益分岐点も計算
        </p>
      </div>

      {/* Input panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* EV panel */}
        <div className="bg-white rounded-xl border-2 border-green-300 p-5 space-y-3">
          <h2 className="font-bold text-green-700 flex items-center gap-1">
            ⚡ 電気自動車（EV）
          </h2>
          <InputRow
            label="車両本体価格"
            unit="万円"
            value={evPriceMan}
            onChange={setEvPriceMan}
          />
          <InputRow
            label="補助金（国・自治体）"
            unit="万円"
            value={evSubsidyMan}
            onChange={setEvSubsidyMan}
          />
          <InputRow
            label="電費"
            unit="km/kWh"
            value={evEfficiency}
            step={0.5}
            onChange={setEvEfficiency}
          />
          <InputRow
            label="自宅充電 電気料金"
            unit="円/kWh"
            value={homeChargeRate}
            onChange={setHomeChargeRate}
          />
          <InputRow
            label="充電設備設置費"
            unit="万円"
            value={chargeEquipCostMan}
            onChange={setChargeEquipCostMan}
          />
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              自宅充電割合:{" "}
              <span className="font-bold text-green-700">{homeChargeRatio}%</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={homeChargeRatio}
              onChange={(e) => setHomeChargeRatio(parseInt(e.target.value))}
              className="w-full accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>外部100%</span>
              <span>自宅100%</span>
            </div>
          </div>
        </div>

        {/* ガソリン車 panel */}
        <div className="bg-white rounded-xl border-2 border-gray-300 p-5 space-y-3">
          <h2 className="font-bold text-gray-700 flex items-center gap-1">
            ⛽ ガソリン車
          </h2>
          <InputRow
            label="車両本体価格"
            unit="万円"
            value={gasPriceMan}
            onChange={setGasPriceMan}
          />
          <InputRow
            label="燃費"
            unit="km/L"
            value={gasFuelEff}
            step={0.5}
            onChange={setGasFuelEff}
          />
          <InputRow
            label="ガソリン単価"
            unit="円/L"
            value={gasPrice}
            onChange={setGasPrice}
          />
        </div>
      </div>

      {/* 共通設定 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-4">
        <h2 className="font-bold text-gray-700">共通設定</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputRow
            label="年間走行距離"
            unit="km"
            value={annualKm}
            step={1000}
            onChange={setAnnualKm}
          />
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              比較期間:{" "}
              <span className="font-bold text-gray-800">{years}年</span>
            </label>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={years}
              onChange={(e) => setYears(parseInt(e.target.value))}
              className="w-full accent-green-500"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>1年</span>
              <span>10年</span>
              <span>20年</span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4 mb-6">
        <h2 className="font-bold text-gray-800 text-lg">計算結果</h2>

        {/* 年間燃料費比較 */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3">年間燃料費</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-xl p-3 text-center border border-green-200">
              <div className="text-xl font-bold text-green-700">
                {formatYen(results.annualEvFuelYen)}
              </div>
              <div className="text-xs text-green-600 mt-0.5">EV / 年</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-200">
              <div className="text-xl font-bold text-gray-700">
                {formatYen(results.annualGasFuelYen)}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">ガソリン車 / 年</div>
            </div>
          </div>
          <div className="mt-3 text-center text-sm text-green-600 font-medium">
            年間燃料費差額:{" "}
            <span className="text-base font-bold">
              {results.annualSavingYen >= 0
                ? `EV が ${formatYen(results.annualSavingYen)} お得`
                : `ガソリン車が ${formatYen(Math.abs(results.annualSavingYen))} お得`}
            </span>
          </div>
        </div>

        {/* 損益分岐点 */}
        <div
          className={`rounded-xl p-5 border-2 ${
            results.breakEvenYears <= years
              ? "bg-green-50 border-green-400"
              : "bg-yellow-50 border-yellow-400"
          }`}
        >
          <div className="text-xs text-gray-600 mb-1">損益分岐点</div>
          <div
            className={`text-3xl font-bold ${
              results.breakEvenYears <= years ? "text-green-700" : "text-yellow-700"
            }`}
          >
            {results.breakEvenYears < Infinity
              ? results.breakEvenYears <= 0
                ? "初年度からEVが有利"
                : `約 ${results.breakEvenYears.toFixed(1)} 年目`
              : "EVが有利にならない"}
          </div>
          <div className="text-sm mt-1 text-gray-600">
            初期費用差{" "}
            {results.initialDiffYen >= 0
              ? `(EVが${formatYen(results.initialDiffYen)}高い)`
              : `(EVが${formatYen(Math.abs(results.initialDiffYen))}安い)`}{" "}
            ÷ 年間節約額 {formatYen(results.annualSavingYen)}
          </div>
        </div>

        {/* 総保有コスト */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            {years}年間の総保有コスト
          </h3>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>⚡ EV</span>
                <span className="font-medium">{formatYen(results.evTotalYen)}</span>
              </div>
              <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (results.evTotalYen /
                        Math.max(results.evTotalYen, results.gasTotalYen)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>⛽ ガソリン車</span>
                <span className="font-medium">{formatYen(results.gasTotalYen)}</span>
              </div>
              <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gray-400 to-gray-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      (results.gasTotalYen /
                        Math.max(results.evTotalYen, results.gasTotalYen)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
          <div
            className={`mt-3 text-center text-sm font-bold ${
              results.totalSavingYen >= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {results.totalSavingYen >= 0
              ? `${years}年間でEVが ${formatYen(results.totalSavingYen)} お得`
              : `${years}年間でガソリン車が ${formatYen(Math.abs(results.totalSavingYen))} お得`}
          </div>
        </div>

        {/* 年別累計差額グラフ */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-3">
            年別累計コスト差（プラス = EV有利）
          </h3>
          <div className="flex items-end gap-1 h-28">
            {results.yearlyData.map(({ yr, diff }) => {
              const ratio = Math.abs(diff) / maxAbsDiff;
              const isPositive = diff >= 0;
              return (
                <div
                  key={yr}
                  className="flex-1 flex flex-col items-center justify-end"
                  title={`${yr}年目: ${diff >= 0 ? "+" : ""}${formatYen(diff)}`}
                >
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isPositive ? "bg-green-400" : "bg-red-400"
                    }`}
                    style={{ height: `${ratio * 100}%`, minHeight: 2 }}
                  />
                  {yr % Math.ceil(years / 5) === 0 && (
                    <span className="text-xs text-gray-400 mt-0.5">{yr}年</span>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span className="text-red-400">EV不利 ▼</span>
            <span className="text-green-400">▲ EV有利</span>
          </div>
        </div>

        {/* CO2削減 */}
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
          <h3 className="text-sm font-bold text-emerald-700 mb-2">CO2削減効果</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-700">
                {results.co2ReduceAnnual.toFixed(0)} kg
              </div>
              <div className="text-xs text-emerald-600">年間CO2削減</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-emerald-700">
                {(results.co2ReduceTotal / 1000).toFixed(1)} t
              </div>
              <div className="text-xs text-emerald-600">{years}年累計削減</div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner />
      <RelatedTools currentToolId="ev-calc" />

      {/* FAQ */}
      <section className="mt-10 space-y-4">
        <h2 className="font-bold text-gray-900 text-lg">よくある質問</h2>
        {[
          {
            q: "電気自動車の維持費はガソリン車と比べてどうですか？",
            a: "燃料費はEVが大幅に安く（1km約3〜5円 vs ガソリン車約10〜15円）、エンジンオイル交換が不要なため整備費も安い傾向があります。ただし車両価格と充電設備設置費用が高めです。",
          },
          {
            q: "EV購入の補助金はいくらですか？",
            a: "CEV補助金（クリーンエネルギー自動車補助金）として普通乗用EVには最大65万円の補助があります（2024年度）。自治体の上乗せ補助もあります。",
          },
          {
            q: "自宅充電の電気代はいくらですか？",
            a: "深夜電力（約16〜20円/kWh）を利用すると1回満充電で400〜600円程度です。急速充電器の場合は1回1,000〜2,000円程度かかります。",
          },
          {
            q: "EVの電池交換費用はいくらですか？",
            a: "バッテリー保証は多くのメーカーで8年/16万km程度ですが、交換費用は50〜100万円以上になることも。近年はバッテリー技術が向上し、交換不要なケースも増えています。",
          },
        ].map(({ q, a }) => (
          <div key={q} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="font-medium text-gray-800 text-sm mb-1">Q. {q}</p>
            <p className="text-sm text-gray-600">A. {a}</p>
          </div>
        ))}
      </section>

      <p className="mt-8 text-xs text-gray-400 leading-relaxed">
        ※本シミュレーションは概算値です。実際のコストは走行条件・車種・充電環境等により異なります。購入判断はディーラーや専門家にご相談ください。
      </p>
    </div>
  );
}

/* ─── Helper Input Component ─── */
function InputRow({
  label,
  unit,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1">
        {label}
        <span className="ml-1 text-gray-400">({unit})</span>
      </label>
      <input
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
      />
    </div>
  );
}
