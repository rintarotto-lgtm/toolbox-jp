"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/** 給与所得控除を計算 */
function calcEmploymentDeduction(salary: number): number {
  if (salary <= 1_625_000) return 550_000;
  if (salary <= 1_800_000) return salary * 0.4 - 100_000;
  if (salary <= 3_600_000) return salary * 0.3 + 80_000;
  if (salary <= 6_600_000) return salary * 0.2 + 440_000;
  if (salary <= 8_500_000) return salary * 0.1 + 1_100_000;
  return 1_950_000;
}

/** 所得税を累進課税で計算 */
function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  const brackets = [
    { limit: 1_950_000, rate: 0.05, deduction: 0 },
    { limit: 3_300_000, rate: 0.1, deduction: 97_500 },
    { limit: 6_950_000, rate: 0.2, deduction: 427_500 },
    { limit: 9_000_000, rate: 0.23, deduction: 636_000 },
    { limit: 18_000_000, rate: 0.33, deduction: 1_536_000 },
    { limit: 40_000_000, rate: 0.4, deduction: 2_796_000 },
    { limit: Infinity, rate: 0.45, deduction: 4_796_000 },
  ];
  const bracket = brackets.find((b) => taxableIncome <= b.limit)!;
  const base = taxableIncome * bracket.rate - bracket.deduction;
  // 復興特別所得税 2.1%
  return Math.floor(base * 1.021);
}

/** 手取り計算のコア */
function calcTakeHome(salary: number, sideIncome: number, expenses: number) {
  const basicDeduction = 480_000;
  const socialInsuranceRate = 0.15;
  const socialInsurance = Math.floor(salary * socialInsuranceRate);

  // 給与所得
  const employmentDeduction = calcEmploymentDeduction(salary);
  const employmentIncome = Math.max(0, salary - employmentDeduction);

  // 副業所得（雑所得）
  const sideJobIncome = Math.max(0, sideIncome - expenses);

  // === 副業なしの場合 ===
  const taxableWithout = Math.max(
    0,
    employmentIncome - socialInsurance - basicDeduction
  );
  const incomeTaxWithout = calcIncomeTax(taxableWithout);
  const residentTaxWithout = Math.floor(Math.max(0, taxableWithout) * 0.1);
  const takeHomeWithout =
    salary - socialInsurance - incomeTaxWithout - residentTaxWithout;

  // === 副業ありの場合 ===
  const taxableWith = Math.max(
    0,
    employmentIncome + sideJobIncome - socialInsurance - basicDeduction
  );
  const incomeTaxWith = calcIncomeTax(taxableWith);
  const residentTaxWith = Math.floor(Math.max(0, taxableWith) * 0.1);
  const takeHomeWith =
    salary +
    sideIncome -
    expenses -
    socialInsurance -
    incomeTaxWith -
    residentTaxWith;

  // 追加税額
  const additionalIncomeTax = incomeTaxWith - incomeTaxWithout;
  const additionalResidentTax = residentTaxWith - residentTaxWithout;
  const netIncrease = takeHomeWith - takeHomeWithout;

  return {
    takeHomeWithout,
    takeHomeWith,
    sideJobIncome,
    additionalIncomeTax,
    additionalResidentTax,
    netIncrease,
  };
}

function formatYen(n: number): string {
  if (Math.abs(n) >= 10_000) {
    const man = n / 10_000;
    return `${man.toLocaleString("ja-JP", { maximumFractionDigits: 1 })}万円`;
  }
  return `${n.toLocaleString("ja-JP")}円`;
}

function formatYenFull(n: number): string {
  return `¥${n.toLocaleString("ja-JP")}`;
}

export default function SideJobTaxCalc() {
  const [salary, setSalary] = useState(4_000_000);
  const [sideIncome, setSideIncome] = useState(500_000);
  const [expenses, setExpenses] = useState(0);

  const result = useMemo(
    () => calcTakeHome(salary, sideIncome, expenses),
    [salary, sideIncome, expenses]
  );

  const filingStatus = useMemo(() => {
    if (result.sideJobIncome <= 0) {
      return {
        label: "申告不要",
        desc: "副業所得がないため、申告は不要です。",
        color: "bg-green-50 border-green-200 text-green-800",
        icon: "✓",
      };
    }
    if (result.sideJobIncome <= 200_000) {
      return {
        label: "住民税の申告が必要",
        desc: "所得税の確定申告は不要ですが、住民税の申告は必要です。",
        color: "bg-yellow-50 border-yellow-200 text-yellow-800",
        icon: "!",
      };
    }
    return {
      label: "確定申告が必要",
      desc: "副業所得が20万円を超えるため、確定申告が必要です。",
      color: "bg-red-50 border-red-200 text-red-800",
      icon: "!",
    };
  }, [result.sideJobIncome]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">
        副業の税金計算機
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        副業したら手取りは結局いくら増える？3つの数字を入れるだけで瞬時に計算します。
      </p>

      <AdBanner />

      {/* 入力セクション */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* 本業の年収 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            本業の年収
          </label>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatYen(salary)}
          </div>
          <input
            type="range"
            min={2_000_000}
            max={20_000_000}
            step={100_000}
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>200万</span>
            <span>2000万</span>
          </div>
        </div>

        {/* 副業の年間収入 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            副業の年間収入
          </label>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {formatYen(sideIncome)}
          </div>
          <input
            type="range"
            min={0}
            max={10_000_000}
            step={10_000}
            value={sideIncome}
            onChange={(e) => setSideIncome(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>1000万</span>
          </div>
        </div>

        {/* 副業の経費 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            副業の経費（任意）
          </label>
          <input
            type="number"
            min={0}
            step={10000}
            value={expenses || ""}
            onChange={(e) => setExpenses(Number(e.target.value) || 0)}
            placeholder="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            PC代・通信費・交通費など副業に関わる経費
          </p>
        </div>
      </div>

      {/* 結果セクション */}
      <div className="mt-6 space-y-4">
        {/* ヒーローカード: 手取り増加額 */}
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 text-center">
          <p className="text-sm text-emerald-700 mb-1">
            副業で手取りが増える額
          </p>
          <p className="text-4xl font-extrabold text-emerald-600">
            +{formatYen(Math.max(0, result.netIncrease))}
          </p>
          {result.netIncrease < result.sideJobIncome && sideIncome > 0 && (
            <p className="text-xs text-emerald-600 mt-2">
              副業収入{formatYen(sideIncome)}のうち
              {formatYen(Math.max(0, result.netIncrease))}が手元に残ります
            </p>
          )}
        </div>

        {/* 比較カード */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">副業しない場合の手取り</p>
            <p className="text-xl font-bold text-gray-900">
              {formatYen(result.takeHomeWithout)}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">副業した場合の手取り</p>
            <p className="text-xl font-bold text-blue-600">
              {formatYen(result.takeHomeWith)}
            </p>
          </div>
        </div>

        {/* 内訳 */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">内訳</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">副業収入</span>
              <span className="font-medium">{formatYenFull(sideIncome)}</span>
            </div>
            {expenses > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">経費</span>
                <span className="font-medium text-gray-500">
                  -{formatYenFull(expenses)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-2">
              <span className="text-gray-600">副業所得</span>
              <span className="font-medium">
                {formatYenFull(result.sideJobIncome)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">追加の所得税（復興税込）</span>
              <span className="font-medium text-red-500">
                -{formatYenFull(Math.max(0, result.additionalIncomeTax))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">追加の住民税（10%）</span>
              <span className="font-medium text-red-500">
                -{formatYenFull(Math.max(0, result.additionalResidentTax))}
              </span>
            </div>
            <div className="flex justify-between border-t-2 border-gray-200 pt-3">
              <span className="font-bold text-gray-900">
                実質手取り増加
              </span>
              <span className="font-bold text-emerald-600 text-lg">
                +{formatYenFull(Math.max(0, result.netIncrease))}
              </span>
            </div>
          </div>
        </div>

        {/* 確定申告の判定 */}
        <div
          className={`border rounded-xl p-4 ${filingStatus.color}`}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg font-bold mt-0.5">{filingStatus.icon}</span>
            <div>
              <p className="font-bold">{filingStatus.label}</p>
              <p className="text-sm mt-1 opacity-80">{filingStatus.desc}</p>
            </div>
          </div>
        </div>
      </div>

      <AdBanner />
      <RelatedTools currentToolId="side-job-tax" />

      {/* 使い方 */}
      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">
          副業の税金計算ツールの使い方
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          本業の年収と副業の収入を入力するだけで、副業によって手取りがいくら増えるかを瞬時に計算します。
          所得税（累進課税・復興特別所得税込）と住民税（10%）を自動計算し、確定申告の必要性も判定します。
          給与所得控除・基礎控除・社会保険料（年収の15%概算）を考慮した概算値です。
        </p>
      </section>

      {/* 免責事項 */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-400 leading-relaxed">
          免責事項：この計算は概算です。実際の税額は扶養控除・医療費控除・ふるさと納税など各種控除の状況により異なります。正確な税額は税理士にご相談ください。
          計算に使用している税率は2026年時点の情報に基づいています。
        </p>
      </div>
    </div>
  );
}
