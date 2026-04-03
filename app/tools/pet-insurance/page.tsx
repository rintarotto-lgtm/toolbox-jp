"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/* ─── Types ─── */
type PetType = "dog" | "cat";
type DogSize = "small" | "medium" | "large";
type Coverage = 50 | 70 | 90;
type Deductible = 0 | 3000;

/* ─── Base monthly premium lookup table (small dog, age bracket) ─── */
const DOG_SMALL_BASE: Record<number, number> = {
  1: 2800,
  5: 3500,
  8: 5200,
  10: 7000,
  13: 9500,
};

const CAT_BASE: Record<number, number> = {
  1: 1800,
  5: 2300,
  8: 3500,
  10: 5000,
  13: 7200,
};

function getAgeBracket(age: number): number {
  if (age <= 2) return 1;
  if (age <= 6) return 5;
  if (age <= 9) return 8;
  if (age <= 11) return 10;
  return 13;
}

function calcMonthlyPremium(
  petType: PetType,
  dogSize: DogSize,
  age: number,
  coverage: Coverage,
  deductible: Deductible
): number {
  const bracket = getAgeBracket(age);
  let base =
    petType === "dog" ? DOG_SMALL_BASE[bracket] : CAT_BASE[bracket];

  // Dog size multiplier
  if (petType === "dog") {
    if (dogSize === "medium") base *= 1.3;
    if (dogSize === "large") base *= 1.6;
  }

  // Coverage multiplier
  const coverageMult: Record<Coverage, number> = { 50: 1.0, 70: 1.2, 90: 1.5 };
  base *= coverageMult[coverage];

  // Deductible discount
  if (deductible === 3000) base *= 0.85;

  return Math.round(base);
}

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

/* ─── Main Component ─── */
export default function PetInsurancePage() {
  const [petType, setPetType] = useState<PetType>("dog");
  const [dogSize, setDogSize] = useState<DogSize>("small");
  const [age, setAge] = useState(1);
  const [coverage, setCoverage] = useState<Coverage>(70);
  const [deductible, setDeductible] = useState<Deductible>(0);
  const [annualMedical, setAnnualMedical] = useState(80000);

  const calc = useMemo(() => {
    const monthly = calcMonthlyPremium(petType, dogSize, age, coverage, deductible);
    const annual = monthly * 12;
    const total5 = annual * 5;
    const total10 = annual * 10;
    const totalLifetime = annual * 15;

    // Break-even: insurance pays coverage% of expenses above deductible
    // insurance_benefit = medical * (coverage/100) - deductible*365/12(approx)
    // break-even when benefit >= premium => medical * (cov/100) = annual
    const coverageRate = coverage / 100;
    const breakEven = Math.round(annual / coverageRate);

    // Simulation: with vs without insurance
    const annualDeductibleCost = deductible * 365 * 0.3; // ~30% of days need vet
    const insurancePayout = Math.max(
      0,
      annualMedical * coverageRate - annualDeductibleCost
    );
    const costWithInsurance = annual + annualMedical - insurancePayout;
    const costWithout = annualMedical;
    const saving = costWithout - costWithInsurance;

    return {
      monthly,
      annual,
      total5,
      total10,
      totalLifetime,
      breakEven,
      insurancePayout,
      costWithInsurance,
      costWithout,
      saving,
    };
  }, [petType, dogSize, age, coverage, deductible, annualMedical]);

  const agePct = (age / 15) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ── Header ── */}
      <div className="rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🐾</span>
          <h1 className="text-2xl font-bold">ペット保険シミュレーター</h1>
        </div>
        <p className="text-green-100 text-sm">
          犬・猫の種類・年齢から保険料の目安と費用対効果を計算します。
        </p>
      </div>

      <AdBanner />

      {/* ── Inputs ── */}
      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-5">ペット情報を入力</h2>

        {/* Pet type */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">ペット種別</label>
          <div className="flex gap-3">
            {(["dog", "cat"] as PetType[]).map((t) => (
              <button
                key={t}
                onClick={() => setPetType(t)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                  petType === t
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                }`}
              >
                {t === "dog" ? "🐶 犬" : "🐱 猫"}
              </button>
            ))}
          </div>
        </div>

        {/* Dog size (only when dog) */}
        {petType === "dog" && (
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">犬種カテゴリ</label>
            <div className="flex gap-3">
              {(["small", "medium", "large"] as DogSize[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setDogSize(s)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                    dogSize === s
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
                >
                  {s === "small" ? "小型犬" : s === "medium" ? "中型犬" : "大型犬"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Age slider */}
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">年齢</label>
            <span className="text-sm font-bold text-green-700">{age}歳</span>
          </div>
          <input
            type="range"
            min={0}
            max={15}
            step={1}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-500
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
              [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, #16a34a 0%, #16a34a ${agePct}%, #e5e7eb ${agePct}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0歳</span>
            <span className="text-amber-600 font-medium">7歳〜シニア期</span>
            <span>15歳</span>
          </div>
        </div>

        {/* Coverage */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-2">補償割合</label>
          <div className="flex gap-3">
            {([50, 70, 90] as Coverage[]).map((c) => (
              <button
                key={c}
                onClick={() => setCoverage(c)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                  coverage === c
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-teal-400"
                }`}
              >
                {c}%プラン
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            診療費のうち保険がカバーする割合。残りが自己負担となります。
          </p>
        </div>

        {/* Deductible */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">免責金額</label>
          <div className="flex gap-3">
            {([0, 3000] as Deductible[]).map((d) => (
              <button
                key={d}
                onClick={() => setDeductible(d)}
                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors cursor-pointer ${
                  deductible === d
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-teal-400"
                }`}
              >
                {d === 0 ? "0円（なし）" : "3,000円/日"}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1.5">
            免責金額あり（3,000円/日）を選ぶと保険料が約15%割引になります。
          </p>
        </div>
      </section>

      {/* ── Results ── */}
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">保険料シミュレーション結果</h2>

        {/* Main premium */}
        <div className="text-center pb-4 mb-4 border-b border-green-200">
          <p className="text-sm text-green-700 font-medium mb-1">月額保険料目安</p>
          <p className="text-5xl font-extrabold text-green-900 tabular-nums">
            {formatYen(calc.monthly)}
          </p>
          <p className="text-xs text-gray-400 mt-1">※ 参考値。実際の保険料は各社によって異なります</p>
        </div>

        {/* Sub stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: "年間保険料", value: formatYen(calc.annual) },
            { label: "5年間累計", value: formatYen(calc.total5) },
            { label: "10年間累計", value: formatYen(calc.total10) },
            { label: "生涯累計(15年)", value: formatYen(calc.totalLifetime) },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl border border-green-100 p-3 text-center"
            >
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="text-sm font-bold text-gray-800 tabular-nums">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Break-even */}
        <div className="bg-white rounded-xl border border-amber-200 p-4 mb-4">
          <p className="text-sm font-medium text-amber-800 mb-1">
            💡 元を取るために必要な年間医療費
          </p>
          <p className="text-2xl font-bold text-amber-900 tabular-nums">
            {formatYen(calc.breakEven)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            年間医療費がこの金額を超えると、保険に加入した方がお得になります。
          </p>
        </div>
      </section>

      <AdBanner />

      {/* ── Break-even simulation ── */}
      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-4">損益分岐点シミュレーション</h2>
        <p className="text-xs text-gray-500 mb-4">
          想定する年間医療費を入力して、保険あり・なしのコストを比較します。
        </p>

        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">想定年間医療費</label>
            <span className="text-sm font-bold text-gray-800 tabular-nums">
              {formatYen(annualMedical)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={500000}
            step={10000}
            value={annualMedical}
            onChange={(e) => setAnnualMedical(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-500
              [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
              [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
            style={{
              background: `linear-gradient(to right, #0d9488 0%, #0d9488 ${(annualMedical / 500000) * 100}%, #e5e7eb ${(annualMedical / 500000) * 100}%, #e5e7eb 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0円</span><span>50万円</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-center">
            <p className="text-xs text-red-600 font-medium mb-1">保険なし 年間コスト</p>
            <p className="text-xl font-bold text-red-800 tabular-nums">
              {formatYen(calc.costWithout)}
            </p>
            <p className="text-xs text-gray-400 mt-1">医療費のみ</p>
          </div>
          <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center">
            <p className="text-xs text-green-700 font-medium mb-1">保険あり 年間コスト</p>
            <p className="text-xl font-bold text-green-800 tabular-nums">
              {formatYen(calc.costWithInsurance)}
            </p>
            <p className="text-xs text-gray-400 mt-1">保険料＋自己負担</p>
          </div>
        </div>

        {calc.saving > 0 ? (
          <div className="mt-3 rounded-xl bg-green-100 border border-green-300 px-4 py-3 text-sm text-green-800 font-medium text-center">
            保険加入で年間 <span className="font-bold text-lg">{formatYen(calc.saving)}</span> お得！
          </div>
        ) : (
          <div className="mt-3 rounded-xl bg-gray-100 border border-gray-200 px-4 py-3 text-sm text-gray-600 text-center">
            この医療費水準では保険なしの方が
            <span className="font-bold"> {formatYen(Math.abs(calc.saving))} </span>
            安くなります
          </div>
        )}
      </section>

      {/* ── Lifetime stats ── */}
      <section className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h2 className="text-sm font-bold text-blue-800 mb-3">📊 ペットの生涯医療費の目安（参考統計）</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 text-center border border-blue-100">
            <p className="text-xs text-blue-600 mb-1">🐶 犬の生涯医療費（平均）</p>
            <p className="text-xl font-bold text-blue-900">約75万円</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-blue-100">
            <p className="text-xs text-blue-600 mb-1">🐱 猫の生涯医療費（平均）</p>
            <p className="text-xl font-bold text-blue-900">約50万円</p>
          </div>
        </div>
        <p className="text-xs text-blue-500 mt-2">
          ※ 手術が必要になった場合、1回で10〜50万円かかることもあります。上記は業界団体の調査に基づく参考値です。
        </p>
      </section>

      <AdBanner />

      {/* ── FAQ ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: "補償割合が高いほど本当にお得ですか？",
              a: "補償割合が高いほど保険料も高くなるため、ペットの健康状態や医療費の発生頻度を考慮して選ぶことが重要です。健康なペットなら50〜70%、持病がある・手術リスクが高い犬種なら90%を検討しましょう。",
            },
            {
              q: "シニア期のペットへの加入はできますか？",
              a: "多くの保険会社では7〜8歳以上での新規加入を制限しています。加入できても保険料が高く、補償内容が限定される場合があります。若いうちに加入するほど有利です。",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              <summary className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                Q. {item.q}
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-600 border-t border-gray-100">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-500 mb-8">
        ※ 本ツールの計算結果はあくまで目安であり、実際の保険料・補償内容は各保険会社によって異なります。加入を検討する際は各社の公式サイトや保険代理店にご確認ください。
      </div>

      <RelatedTools currentToolId="pet-insurance" />
    </div>
  );
}
