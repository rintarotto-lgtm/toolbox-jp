"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";

/* ─── Helpers ─── */

/** 給与所得控除 */
function employmentDeduction(income: number): number {
  if (income <= 1_625_000) return 550_000;
  if (income <= 1_800_000) return income * 0.4 - 100_000;
  if (income <= 3_600_000) return income * 0.3 + 80_000;
  if (income <= 6_600_000) return income * 0.2 + 440_000;
  if (income <= 8_500_000) return income * 0.1 + 1_100_000;
  return 1_950_000;
}

/** 所得税（累進課税） */
function incomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 1_950_000) return taxableIncome * 0.05;
  if (taxableIncome <= 3_300_000)
    return taxableIncome * 0.1 - 97_500;
  if (taxableIncome <= 6_950_000)
    return taxableIncome * 0.2 - 427_500;
  if (taxableIncome <= 9_000_000)
    return taxableIncome * 0.23 - 636_000;
  if (taxableIncome <= 18_000_000)
    return taxableIncome * 0.33 - 1_536_000;
  if (taxableIncome <= 40_000_000)
    return taxableIncome * 0.4 - 2_796_000;
  return taxableIncome * 0.45 - 4_796_000;
}

/** 全計算 */
function calcTakeHome(annualSalary: number) {
  // 社会保険料 (~15%)
  const socialInsurance = Math.floor(annualSalary * 0.15);

  // 給与所得
  const employmentIncome = annualSalary - employmentDeduction(annualSalary);

  // 所得税の課税所得
  const taxableIncomeForIncome = Math.max(
    0,
    employmentIncome - 480_000 - socialInsurance
  );
  // 所得税
  const rawIncomeTax = Math.floor(incomeTax(taxableIncomeForIncome));
  // 復興特別所得税
  const reconstructionTax = Math.floor(rawIncomeTax * 0.021);
  const totalIncomeTax = rawIncomeTax + reconstructionTax;

  // 住民税
  const taxableIncomeForResident = Math.max(
    0,
    employmentIncome - 430_000 - socialInsurance
  );
  const residentTax = Math.floor(taxableIncomeForResident * 0.1 + 5_000);

  // 手取り
  const takeHome = annualSalary - socialInsurance - totalIncomeTax - residentTax;

  return {
    annualSalary,
    socialInsurance,
    rawIncomeTax,
    reconstructionTax,
    totalIncomeTax,
    residentTax,
    takeHome,
    takeHomeRate: annualSalary > 0 ? (takeHome / annualSalary) * 100 : 0,
  };
}

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

function formatMan(n: number): string {
  const man = n / 10_000;
  if (man >= 100) return `${Math.round(man)}万`;
  return `${man.toFixed(1)}万`;
}

/* ─── Quick comparison salaries ─── */
const COMPARISON_SALARIES = [
  3_000_000, 4_000_000, 5_000_000, 6_000_000, 7_000_000, 8_000_000,
  10_000_000,
];

/* ─── Component ─── */
export default function SalaryCalc() {
  const [salary, setSalary] = useState(4_500_000);

  const result = useMemo(() => calcTakeHome(salary), [salary]);

  const comparisonData = useMemo(
    () => COMPARISON_SALARIES.map((s) => calcTakeHome(s)),
    []
  );

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSalary(Number(e.target.value));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value.replace(/[^0-9]/g, ""));
    if (!isNaN(v)) setSalary(Math.min(Math.max(v, 0), 100_000_000));
  };

  // Stacked bar percentages
  const takeHomePct = result.annualSalary > 0
    ? (result.takeHome / result.annualSalary) * 100
    : 0;
  const socialPct = result.annualSalary > 0
    ? (result.socialInsurance / result.annualSalary) * 100
    : 0;
  const incomeTaxPct = result.annualSalary > 0
    ? (result.totalIncomeTax / result.annualSalary) * 100
    : 0;
  const residentTaxPct = result.annualSalary > 0
    ? (result.residentTax / result.annualSalary) * 100
    : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        💴 給料手取り計算ツール
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        年収○○万円の手取りは？スライダーで瞬時に計算
      </p>

      {/* ─── Salary Input ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          年収（額面）
        </label>

        {/* Slider */}
        <input
          type="range"
          min={2_000_000}
          max={20_000_000}
          step={100_000}
          value={salary}
          onChange={handleSlider}
          className="w-full h-3 rounded-full appearance-none cursor-pointer accent-emerald-600
            [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-600
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
            [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
            bg-gradient-to-r from-emerald-200 to-emerald-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1 mb-4">
          <span>200万</span>
          <span>600万</span>
          <span>1,000万</span>
          <span>1,500万</span>
          <span>2,000万</span>
        </div>

        {/* Direct input */}
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm">¥</span>
          <input
            type="text"
            inputMode="numeric"
            value={salary.toLocaleString()}
            onChange={handleInput}
            className="flex-1 text-2xl font-bold text-gray-900 border border-gray-300 rounded-xl px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <span className="text-gray-400 text-sm">円</span>
        </div>
        <p className="text-center text-sm text-gray-400 mt-2">
          = {formatMan(salary)}円
        </p>
      </div>

      {/* ─── Hero Result ─── */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-6 mb-6 text-center">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-1">年収（額面）</p>
          <p className="text-xl font-bold text-gray-800">
            {formatYen(result.annualSalary)}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-emerald-700 mb-1">手取り額</p>
          <p className="text-4xl sm:text-5xl font-extrabold text-emerald-700">
            {formatYen(result.takeHome)}
          </p>
          <p className="text-lg font-semibold text-emerald-600 mt-1">
            手取り率 {result.takeHomeRate.toFixed(1)}%
          </p>
        </div>

        {/* Monthly */}
        <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-emerald-200">
          <div>
            <p className="text-xs text-gray-500">月収（税込）</p>
            <p className="text-lg font-bold text-gray-800">
              {formatYen(Math.round(result.annualSalary / 12))}
            </p>
          </div>
          <div>
            <p className="text-xs text-emerald-600">月の手取り</p>
            <p className="text-lg font-bold text-emerald-700">
              {formatYen(Math.round(result.takeHome / 12))}
            </p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── Stacked Bar Chart ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          内訳グラフ
        </h2>

        {/* Bar */}
        <div className="flex w-full h-10 rounded-xl overflow-hidden mb-5 text-xs font-semibold text-white">
          {takeHomePct > 0 && (
            <div
              className="bg-emerald-500 flex items-center justify-center transition-all duration-300"
              style={{ width: `${takeHomePct}%` }}
            >
              {takeHomePct > 10 && `手取り ${takeHomePct.toFixed(0)}%`}
            </div>
          )}
          {socialPct > 0 && (
            <div
              className="bg-amber-500 flex items-center justify-center transition-all duration-300"
              style={{ width: `${socialPct}%` }}
            >
              {socialPct > 5 && `社保 ${socialPct.toFixed(0)}%`}
            </div>
          )}
          {incomeTaxPct > 0 && (
            <div
              className="bg-blue-500 flex items-center justify-center transition-all duration-300"
              style={{ width: `${incomeTaxPct}%` }}
            >
              {incomeTaxPct > 4 && `所得税 ${incomeTaxPct.toFixed(0)}%`}
            </div>
          )}
          {residentTaxPct > 0 && (
            <div
              className="bg-purple-500 flex items-center justify-center transition-all duration-300"
              style={{ width: `${residentTaxPct}%` }}
            >
              {residentTaxPct > 4 && `住民税 ${residentTaxPct.toFixed(0)}%`}
            </div>
          )}
        </div>

        {/* Breakdown list */}
        <div className="space-y-3">
          <BreakdownRow
            label="手取り"
            amount={result.takeHome}
            pct={takeHomePct}
            color="bg-emerald-500"
          />
          <BreakdownRow
            label="社会保険料"
            sublabel="健康保険・厚生年金・雇用保険"
            amount={result.socialInsurance}
            pct={socialPct}
            color="bg-amber-500"
          />
          <BreakdownRow
            label="所得税 + 復興特別所得税"
            sublabel={`${formatYen(result.rawIncomeTax)} + ${formatYen(result.reconstructionTax)}`}
            amount={result.totalIncomeTax}
            pct={incomeTaxPct}
            color="bg-blue-500"
          />
          <BreakdownRow
            label="住民税"
            sublabel="都道府県民税 + 市区町村民税"
            amount={result.residentTax}
            pct={residentTaxPct}
            color="bg-purple-500"
          />
        </div>
      </div>

      <AdBanner />

      {/* ─── Quick Comparison Table ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          年収別 手取り早見表
        </h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">年収</th>
                <th className="text-right py-2 px-2 font-medium">手取り</th>
                <th className="text-right py-2 px-2 font-medium">手取り率</th>
                <th className="text-right py-2 px-2 font-medium">月の手取り</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((d) => (
                <tr
                  key={d.annualSalary}
                  className={`border-b border-gray-100 ${
                    d.annualSalary === salary
                      ? "bg-emerald-50 font-bold"
                      : ""
                  }`}
                >
                  <td className="py-2.5 px-2 text-gray-800">
                    {formatMan(d.annualSalary)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-emerald-700 font-semibold">
                    {formatMan(d.takeHome)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-gray-600">
                    {d.takeHomeRate.toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-2 text-right text-gray-600">
                    {formatMan(Math.round(d.takeHome / 12))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdBanner />

      {/* ─── Calculation Details ─── */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">計算の仕組み</h2>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li>
            <strong>給与所得</strong> = 年収 - 給与所得控除
          </li>
          <li>
            <strong>社会保険料</strong> = 年収 × 約15%（健康保険 + 厚生年金 + 雇用保険）
          </li>
          <li>
            <strong>課税所得</strong> = 給与所得 - 基礎控除(48万) - 社会保険料
          </li>
          <li>
            <strong>所得税</strong> = 課税所得 × 累進税率 - 控除額
          </li>
          <li>
            <strong>復興特別所得税</strong> = 所得税 × 2.1%
          </li>
          <li>
            <strong>住民税</strong> = (給与所得 - 基礎控除(43万) - 社会保険料) × 10% + 均等割5,000円
          </li>
          <li>
            <strong>手取り</strong> = 年収 - 社会保険料 - 所得税 - 復興税 - 住民税
          </li>
        </ol>
      </div>

      {/* ─── Disclaimer ─── */}
      <p className="text-xs text-gray-400 leading-relaxed">
        ※
        この計算は概算です。実際の手取り額は扶養家族の有無、各種控除、お住まいの自治体等により異なります。正確な金額は税理士にご相談ください。
      </p>
    </div>
  );
}

/* ─── Breakdown Row Sub-component ─── */
function BreakdownRow({
  label,
  sublabel,
  amount,
  pct,
  color,
}: {
  label: string;
  sublabel?: string;
  amount: number;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className={`w-3 h-3 rounded-full shrink-0 ${color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        {sublabel && (
          <p className="text-xs text-gray-400 truncate">{sublabel}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-gray-900">{formatYen(amount)}</p>
        <p className="text-xs text-gray-400">{pct.toFixed(1)}%</p>
      </div>
    </div>
  );
}
