"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/* ─── 非課税限度額（車通勤・距離別）─── */
const CAR_TAX_FREE_LIMITS: { min: number; max: number; limit: number; label: string }[] = [
  { min: 0,  max: 2,  limit: 0,      label: "2km未満 → 全額課税" },
  { min: 2,  max: 10, limit: 4200,   label: "2〜10km → 4,200円" },
  { min: 10, max: 15, limit: 7100,   label: "10〜15km → 7,100円" },
  { min: 15, max: 25, limit: 12900,  label: "15〜25km → 12,900円" },
  { min: 25, max: 35, limit: 18700,  label: "25〜35km → 18,700円" },
  { min: 35, max: 45, limit: 24400,  label: "35〜45km → 24,400円" },
  { min: 45, max: 55, limit: 28000,  label: "45〜55km → 28,000円" },
  { min: 55, max: Infinity, limit: 31600, label: "55km以上 → 31,600円" },
];

function getCarTaxFreeLimit(oneWayKm: number) {
  const roundTrip = oneWayKm * 2;
  return CAR_TAX_FREE_LIMITS.find((r) => roundTrip >= r.min && roundTrip < r.max)
    ?? CAR_TAX_FREE_LIMITS[CAR_TAX_FREE_LIMITS.length - 1];
}

/* ─── Helpers ─── */
function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

/* ─── Component ─── */
export default function CommuteCost() {
  // 電車・バス
  const [oneWayFare, setOneWayFare]       = useState(250);
  const [pass1m, setPass1m]               = useState(9000);
  const [pass3m, setPass3m]               = useState(25000);
  const [pass6m, setPass6m]               = useState(48000);
  const [workDays, setWorkDays]           = useState(20);

  // 車
  const [carDistance, setCarDistance]     = useState(15);
  const [carFuelEff, setCarFuelEff]       = useState(15);
  const [gasPrice, setGasPrice]           = useState(170);
  const [parking, setParking]             = useState(10000);
  const [useHighway, setUseHighway]       = useState(false);
  const [hwFeePerDay, setHwFeePerDay]     = useState(500);

  // 電車計算
  const trainResult = useMemo(() => {
    const monthlyActual = oneWayFare * 2 * workDays;
    const pass1mPerDay  = pass1m > 0 ? pass1m / workDays : Infinity;
    const pass3mPerMonth = pass3m > 0 ? pass3m / 3 : Infinity;
    const pass6mPerMonth = pass6m > 0 ? pass6m / 6 : Infinity;

    // 損益分岐点（何日出勤で定期がお得か）
    const breakeven1m = pass1m > 0 && oneWayFare > 0
      ? Math.ceil(pass1m / (oneWayFare * 2))
      : null;

    // 最安オプション
    const options = [
      { label: "実費", monthly: monthlyActual, annual: monthlyActual * 12 },
      { label: "1ヶ月定期", monthly: pass1m,       annual: pass1m * 12 },
      { label: "3ヶ月定期", monthly: pass3mPerMonth, annual: pass3m * 4 },
      { label: "6ヶ月定期", monthly: pass6mPerMonth, annual: pass6m * 2 },
    ].filter((o) => o.monthly > 0);

    const cheapest = options.reduce((a, b) => (a.monthly < b.monthly ? a : b), options[0]);

    return {
      monthlyActual,
      pass1mPerMonth: pass1m,
      pass3mPerMonth,
      pass6mPerMonth,
      breakeven1m,
      cheapest,
      options,
      taxFreeLimit: 150000,
      isTaxFreeOk: monthlyActual <= 150000,
    };
  }, [oneWayFare, pass1m, pass3m, pass6m, workDays]);

  // 車計算
  const carResult = useMemo(() => {
    const roundTripKm   = carDistance * 2;
    const fuelPerDay    = carFuelEff > 0 ? roundTripKm / carFuelEff : 0;
    const fuelCostPerDay = fuelPerDay * gasPrice;
    const hwPerDay      = useHighway ? hwFeePerDay : 0;
    const monthlyFuel   = fuelCostPerDay * workDays;
    const monthlyHw     = hwPerDay * workDays;
    const monthlyTotal  = monthlyFuel + monthlyHw + parking;
    const annualTotal   = monthlyTotal * 12;

    const taxFreeInfo   = getCarTaxFreeLimit(carDistance);

    return {
      monthlyFuel,
      monthlyHw,
      parking,
      monthlyTotal,
      annualTotal,
      taxFreeInfo,
      isTaxFreeOk: monthlyTotal <= taxFreeInfo.limit,
    };
  }, [carDistance, carFuelEff, gasPrice, parking, useHighway, hwFeePerDay, workDays]);

  // 比較
  const saving = useMemo(() => {
    const trainMonthly = trainResult.cheapest?.monthly ?? 0;
    const diff = carResult.monthlyTotal - trainMonthly;
    return { diff, annualDiff: diff * 12, trainCheaper: diff > 0 };
  }, [trainResult, carResult]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🚃</span>
          <h1 className="text-2xl font-bold">通勤費・交通費計算ツール</h1>
        </div>
        <p className="text-green-100 text-sm">
          電車定期代と車通勤のコストを比較。最もお得な通勤方法を一瞬で確認。
        </p>
      </div>

      {/* 共通: 月の出勤日数 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-5 shadow-sm flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">月の出勤日数</label>
        <div className="flex items-center gap-2">
          <input
            type="number" min={1} max={31} step={1} value={workDays}
            onChange={(e) => setWorkDays(Math.max(1, Math.min(31, Number(e.target.value) || 20)))}
            className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <span className="text-sm text-gray-500">日</span>
        </div>
      </div>

      {/* ─── 2カラム: 電車 & 車 ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* 電車・バスパネル */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">🚃</span> 電車・バス
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">片道運賃</label>
              <div className="flex items-center gap-1.5">
                <input type="number" min={0} step={10} value={oneWayFare}
                  onChange={(e) => setOneWayFare(Number(e.target.value) || 0)}
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-right text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs text-gray-500 w-6">円</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">1ヶ月定期代</label>
              <div className="flex items-center gap-1.5">
                <input type="number" min={0} step={100} value={pass1m}
                  onChange={(e) => setPass1m(Number(e.target.value) || 0)}
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-right text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs text-gray-500 w-6">円</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">3ヶ月定期代</label>
              <div className="flex items-center gap-1.5">
                <input type="number" min={0} step={100} value={pass3m}
                  onChange={(e) => setPass3m(Number(e.target.value) || 0)}
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-right text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs text-gray-500 w-6">円</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">6ヶ月定期代</label>
              <div className="flex items-center gap-1.5">
                <input type="number" min={0} step={100} value={pass6m}
                  onChange={(e) => setPass6m(Number(e.target.value) || 0)}
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-right text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs text-gray-500 w-6">円</span>
              </div>
            </div>
          </div>

          {/* 電車結果サマリー */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">実費（月{workDays}日出勤）</span>
              <span className="font-semibold">{formatYen(trainResult.monthlyActual)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">1ヶ月定期（月換算）</span>
              <span className="font-semibold">{formatYen(trainResult.pass1mPerMonth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">3ヶ月定期（月換算）</span>
              <span className="font-semibold">{formatYen(trainResult.pass3mPerMonth)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">6ヶ月定期（月換算）</span>
              <span className="font-semibold">{formatYen(trainResult.pass6mPerMonth)}</span>
            </div>
            {trainResult.breakeven1m !== null && (
              <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-teal-700 bg-teal-50 rounded-lg px-3 py-2">
                月{trainResult.breakeven1m}日以上出勤で1ヶ月定期がお得
              </div>
            )}
            <div className={`mt-2 text-xs rounded-lg px-3 py-2 ${trainResult.isTaxFreeOk ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              非課税限度額: 月15万円
              {trainResult.isTaxFreeOk ? " → 範囲内" : " → 超過あり"}
            </div>
          </div>
        </div>

        {/* 車パネル */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">🚗</span> 車
          </h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">片道距離</label>
              <div className="flex items-center gap-1.5">
                <input type="number" min={0} step={0.5} value={carDistance}
                  onChange={(e) => setCarDistance(Number(e.target.value) || 0)}
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-right text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs text-gray-500 w-8">km</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">燃費</label>
              <div className="flex items-center gap-1.5">
                <input type="number" min={1} step={0.5} value={carFuelEff}
                  onChange={(e) => setCarFuelEff(Number(e.target.value) || 15)}
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-right text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs text-gray-500 w-12">km/L</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">ガソリン単価</label>
              <div className="flex items-center gap-1.5">
                <input type="number" min={0} step={1} value={gasPrice}
                  onChange={(e) => setGasPrice(Number(e.target.value) || 170)}
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-right text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs text-gray-500 w-12">円/L</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">月極駐車場代</label>
              <div className="flex items-center gap-1.5">
                <input type="number" min={0} step={500} value={parking}
                  onChange={(e) => setParking(Number(e.target.value) || 0)}
                  className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-right text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-xs text-gray-500 w-12">円/月</span>
              </div>
            </div>
            {/* 高速 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-600">高速利用あり</label>
                <button
                  onClick={() => setUseHighway(!useHighway)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    useHighway ? "bg-teal-500" : "bg-gray-300"
                  }`}
                >
                  <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    useHighway ? "translate-x-5" : "translate-x-1"
                  }`} />
                </button>
              </div>
              {useHighway && (
                <div className="flex items-center gap-1.5">
                  <input type="number" min={0} step={100} value={hwFeePerDay}
                    onChange={(e) => setHwFeePerDay(Number(e.target.value) || 0)}
                    className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-right text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-xs text-gray-500 w-12">円/日</span>
                </div>
              )}
            </div>
          </div>

          {/* 車結果サマリー */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">燃料費（月）</span>
              <span className="font-semibold">{formatYen(carResult.monthlyFuel)}</span>
            </div>
            {useHighway && (
              <div className="flex justify-between">
                <span className="text-gray-500">高速料金（月）</span>
                <span className="font-semibold">{formatYen(carResult.monthlyHw)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">駐車場代</span>
              <span className="font-semibold">{formatYen(carResult.parking)}</span>
            </div>
            <div className={`mt-2 text-xs rounded-lg px-3 py-2 ${carResult.isTaxFreeOk ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
              非課税限度額: {carResult.taxFreeInfo.label}
              {carResult.isTaxFreeOk ? " → 範囲内" : " → 超過の可能性"}
            </div>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── 比較結果 ─── */}
      <div className="bg-gradient-to-br from-green-50 to-teal-50 border border-teal-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">電車 vs 車 比較結果</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 text-center border border-teal-100">
            <p className="text-xs text-gray-500 mb-1">電車・バス（最安）</p>
            <p className="text-2xl font-extrabold text-teal-700">
              {trainResult.cheapest ? formatYen(trainResult.cheapest.monthly) : "—"}
            </p>
            <p className="text-xs text-gray-400">
              {trainResult.cheapest?.label ?? ""}  / 月
            </p>
            <p className="text-sm font-semibold text-gray-600 mt-1">
              年間: {trainResult.cheapest ? formatYen(trainResult.cheapest.annual) : "—"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border border-teal-100">
            <p className="text-xs text-gray-500 mb-1">車通勤（合計）</p>
            <p className="text-2xl font-extrabold text-gray-800">
              {formatYen(carResult.monthlyTotal)}
            </p>
            <p className="text-xs text-gray-400">/ 月</p>
            <p className="text-sm font-semibold text-gray-600 mt-1">
              年間: {formatYen(carResult.annualTotal)}
            </p>
          </div>
        </div>

        {/* 差額ハイライト */}
        <div className={`rounded-xl p-4 text-center ${saving.trainCheaper ? "bg-teal-100" : "bg-orange-100"}`}>
          <p className="text-sm font-medium text-gray-700 mb-1">
            {saving.trainCheaper ? "電車・バスの方が安い" : "車の方が安い"}
          </p>
          <p className={`text-3xl font-extrabold ${saving.trainCheaper ? "text-teal-700" : "text-orange-600"}`}>
            月 {formatYen(Math.abs(saving.diff))} お得
          </p>
          <p className="text-sm text-gray-500 mt-1">
            年間節約額: {formatYen(Math.abs(saving.annualDiff))}
          </p>
        </div>
      </div>

      <AdBanner />
      <RelatedTools currentToolId="commute-cost" />

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          {[
            {
              q: "通勤手当の非課税限度額はいくらですか？",
              a: "電車・バス通勤は月15万円まで非課税。車通勤は距離によって2km未満は全額課税、2〜10kmは4,200円、10〜15kmは7,100円、15〜25kmは12,900円などが非課税限度額です。",
            },
            {
              q: "定期代と実費どちらがお得ですか？",
              a: "通勤日数が多い場合は定期代の方が安い場合が多いですが、リモートワーク併用や出勤日が少ない場合は実費精算の方が安くなることがあります。月の出勤日数が何日以上なら定期がお得かを本ツールで計算できます。",
            },
            {
              q: "テレワーク中の交通費はどうなりますか？",
              a: "実費精算の場合は出勤した日数分のみ支給されます。定期代支給の場合は会社の規定によりますが、テレワーク比率が高い場合は実費精算への変更を検討する価値があります。",
            },
            {
              q: "新幹線通勤の交通費は会社が全額出してくれますか？",
              a: "会社によって異なりますが、多くの会社では新幹線を含む合理的な経路の交通費を全額支給します。月15万円の非課税限度額を超える部分は課税対象になります。",
            },
          ].map(({ q, a }) => (
            <details key={q} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <summary className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-teal-600 list-none flex justify-between items-center">
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
