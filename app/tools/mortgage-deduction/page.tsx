"use client";

import { useState, useMemo } from "react";

// ─── 定数 ───────────────────────────────────────────────────────────────────

type HousingType = {
  label: string;
  limitMan: number; // 万円
  years: number;
};

const HOUSING_TYPES: HousingType[] = [
  { label: "認定長期優良住宅・低炭素住宅", limitMan: 5000, years: 13 },
  { label: "ZEH水準省エネ住宅", limitMan: 4500, years: 13 },
  { label: "省エネ基準適合住宅", limitMan: 4000, years: 13 },
  { label: "一般新築住宅", limitMan: 3000, years: 13 },
  { label: "中古住宅", limitMan: 2000, years: 10 },
];

const DEDUCTION_RATE = 0.007; // 0.7%

// ─── 税額概算ロジック ────────────────────────────────────────────────────────

/** 給与所得控除額 */
function salaryDeduction(income: number): number {
  if (income <= 1_625_000) return 550_000;
  if (income <= 1_800_000) return income * 0.4 - 100_000;
  if (income <= 3_600_000) return income * 0.3 + 80_000;
  if (income <= 6_600_000) return income * 0.2 + 440_000;
  if (income <= 8_500_000) return income * 0.1 + 1_100_000;
  return 1_950_000;
}

/** 所得税概算（基礎控除 48万円を差し引いた後の課税所得に対する税額） */
function estimateIncomeTax(annualIncome: number): number {
  const salaryDed = salaryDeduction(annualIncome);
  const basicDed = 480_000;
  const taxableIncome = Math.max(0, annualIncome - salaryDed - basicDed);

  // 累進税率 (令和5年以降)
  const brackets: [number, number, number][] = [
    [1_950_000, 0.05, 0],
    [3_300_000, 0.1, 97_500],
    [6_950_000, 0.2, 427_500],
    [9_000_000, 0.23, 636_000],
    [18_000_000, 0.33, 1_536_000],
    [40_000_000, 0.4, 2_796_000],
    [Infinity, 0.45, 4_796_000],
  ];

  for (const [limit, rate, deduction] of brackets) {
    if (taxableIncome <= limit) {
      return Math.floor(taxableIncome * rate - deduction);
    }
  }
  return 0;
}

/** 住民税控除上限 (課税所得の5%、最大97,500円/年) */
function estimateJuminzeiLimit(annualIncome: number): number {
  const salaryDed = salaryDeduction(annualIncome);
  const basicDed = 430_000; // 住民税の基礎控除
  const taxableIncome = Math.max(0, annualIncome - salaryDed - basicDed);
  return Math.min(Math.floor(taxableIncome * 0.05), 97_500);
}

// ─── 元利均等計算 ────────────────────────────────────────────────────────────

interface YearRow {
  year: number;
  yearEndBalance: number;
  deductionBase: number;
  deductionAmount: number;
  incomeTaxPart: number;
  juminzeiPart: number;
  cumulative: number;
}

function calcRows(
  loanAmount: number,
  ratePercent: number,
  repaymentYears: number,
  limitMan: number,
  deductionYears: number,
  annualIncome: number
): YearRow[] {
  const monthlyRate = ratePercent / 100 / 12;
  const totalMonths = repaymentYears * 12;
  const limitYen = limitMan * 10_000;

  let monthlyPayment: number;
  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / totalMonths;
  } else {
    monthlyPayment =
      (loanAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -totalMonths));
  }

  const incomeTax = estimateIncomeTax(annualIncome);
  const juminzeiLimit = estimateJuminzeiLimit(annualIncome);

  const rows: YearRow[] = [];
  let balance = loanAmount;
  let cumulative = 0;

  for (let year = 1; year <= deductionYears; year++) {
    // 当年の12ヶ月分を計算
    for (let m = 0; m < 12; m++) {
      if (balance <= 0) break;
      const interest = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance = Math.max(0, balance - principal);
    }

    const yearEndBalance = balance;
    const deductionBase = Math.min(yearEndBalance, limitYen);
    const rawDeduction = Math.floor(deductionBase * DEDUCTION_RATE);

    // 所得税から控除できる分
    const incomeTaxPart = Math.min(rawDeduction, incomeTax);
    // 残りを住民税から（住民税控除上限あり）
    const remaining = rawDeduction - incomeTaxPart;
    const juminzeiPart = Math.min(remaining, juminzeiLimit);
    const deductionAmount = incomeTaxPart + juminzeiPart;

    cumulative += deductionAmount;

    rows.push({
      year,
      yearEndBalance,
      deductionBase,
      deductionAmount,
      incomeTaxPart,
      juminzeiPart,
      cumulative,
    });
  }

  return rows;
}

// ─── フォーマットヘルパー ────────────────────────────────────────────────────

function fmt(yen: number): string {
  return Math.round(yen).toLocaleString("ja-JP");
}

function fmtMan(yen: number): string {
  return Math.round(yen / 10_000).toLocaleString("ja-JP") + "万円";
}

// ─── コンポーネント ──────────────────────────────────────────────────────────

export default function MortgageDeductionPage() {
  // ── 入力状態 ──────────────────────────────────────────────────────────────
  const [housingTypeIndex, setHousingTypeIndex] = useState(3); // 一般新築
  const [loanMan, setLoanMan] = useState(3000); // 万円
  const [ratePercent, setRatePercent] = useState(1.5);
  const [repaymentYears, setRepaymentYears] = useState(35);
  const [incomeMan, setIncomeMan] = useState(600); // 万円
  const [entryYear, setEntryYear] = useState<2024 | 2025>(2024);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const housingType = HOUSING_TYPES[housingTypeIndex];
  const loanAmount = loanMan * 10_000;
  const annualIncome = incomeMan * 10_000;

  // ── 計算 ──────────────────────────────────────────────────────────────────
  const rows = useMemo(
    () =>
      calcRows(
        loanAmount,
        ratePercent,
        repaymentYears,
        housingType.limitMan,
        housingType.years,
        annualIncome
      ),
    [loanAmount, ratePercent, repaymentYears, housingType, annualIncome]
  );

  const totalDeduction = rows[rows.length - 1]?.cumulative ?? 0;
  const firstYearDeduction = rows[0]?.deductionAmount ?? 0;
  const totalIncomeTax = rows.reduce((s, r) => s + r.incomeTaxPart, 0);
  const totalJuminzei = rows.reduce((s, r) => s + r.juminzeiPart, 0);

  // ── バーチャート用スケール ─────────────────────────────────────────────────
  const maxDeduction = Math.max(...rows.map((r) => r.deductionAmount), 1);

  // ── FAQ ──────────────────────────────────────────────────────────────────
  const faqs = [
    {
      q: "住宅ローン控除はいくら戻ってきますか？",
      a: "住宅ローン控除は年末残高の0.7%が所得税・住民税から控除されます。新築の場合、最大控除額は年35万円（借入限度額5,000万円×0.7%）で、最長13年間適用されます。",
    },
    {
      q: "住宅ローン控除の期間は何年ですか？",
      a: "2022年以降に入居の場合、新築住宅・認定住宅は13年間、中古住宅は10年間です。控除期間中に年末残高の0.7%が毎年控除されます。",
    },
    {
      q: "住宅ローン控除の借入限度額はいくらですか？",
      a: "2024〜2025年入居の場合: 認定長期優良住宅・低炭素住宅5,000万円、ZEH水準省エネ住宅4,500万円、省エネ基準適合住宅4,000万円、一般新築3,000万円です。",
    },
    {
      q: "住宅ローン控除は確定申告が必要ですか？",
      a: "初年度は確定申告が必要です。2年目以降は会社員であれば年末調整で手続き可能です。",
    },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      {/* ページヘッダー */}
      <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-indigo-800 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            住宅ローン控除シミュレーター
          </h1>
          <p className="mt-2 text-blue-200 text-sm md:text-base">
            借入額・金利・住宅種別から13年間の節税額を無料計算。2024年税制対応。
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-6">
        {/* ── 入力カード ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <h2 className="text-base font-semibold text-slate-700">条件を入力</h2>

          {/* 住宅種別 */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              住宅種別
            </label>
            <select
              value={housingTypeIndex}
              onChange={(e) => setHousingTypeIndex(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {HOUSING_TYPES.map((t, i) => (
                <option key={i} value={i}>
                  {t.label}（上限{t.limitMan.toLocaleString()}万円・{t.years}年）
                </option>
              ))}
            </select>
          </div>

          {/* 入居予定年 */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              入居予定年
            </label>
            <div className="flex gap-4">
              {([2024, 2025] as const).map((y) => (
                <label key={y} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="entryYear"
                    value={y}
                    checked={entryYear === y}
                    onChange={() => setEntryYear(y)}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-slate-700">{y}年</span>
                </label>
              ))}
            </div>
          </div>

          {/* 借入金額 */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="font-medium text-slate-600">借入金額</label>
              <span className="text-indigo-700 font-bold">
                {loanMan.toLocaleString()}万円
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={50}
              value={loanMan}
              onChange={(e) => setLoanMan(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>500万円</span>
              <span>1億円</span>
            </div>
          </div>

          {/* 金利 */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="font-medium text-slate-600">適用金利</label>
              <span className="text-indigo-700 font-bold">
                {ratePercent.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={0.1}
              max={5.0}
              step={0.1}
              value={ratePercent}
              onChange={(e) => setRatePercent(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>0.1%</span>
              <span>5.0%</span>
            </div>
          </div>

          {/* 返済期間 */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="font-medium text-slate-600">返済期間</label>
              <span className="text-indigo-700 font-bold">
                {repaymentYears}年
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={35}
              step={1}
              value={repaymentYears}
              onChange={(e) => setRepaymentYears(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>10年</span>
              <span>35年</span>
            </div>
          </div>

          {/* 年収 */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="font-medium text-slate-600">
                年収（控除上限の算出に使用）
              </label>
              <span className="text-indigo-700 font-bold">
                {incomeMan.toLocaleString()}万円
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={2000}
              step={10}
              value={incomeMan}
              onChange={(e) => setIncomeMan(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>200万円</span>
              <span>2,000万円</span>
            </div>
          </div>
        </section>

        {/* ── ヒーローカード ── */}
        <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 rounded-2xl shadow-md text-white p-6">
          <p className="text-sm text-blue-200 font-medium tracking-wide uppercase">
            控除期間 合計節税額
          </p>
          <p className="text-4xl md:text-5xl font-extrabold mt-1 tabular-nums">
            {fmt(totalDeduction)}
            <span className="text-2xl font-semibold ml-1">円</span>
          </p>
          <p className="text-blue-200 text-xs mt-1">
            {housingType.years}年間（{entryYear}年入居・{housingType.label}）
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="bg-white/15 rounded-xl px-4 py-3">
              <p className="text-xs text-blue-200">初年度控除額</p>
              <p className="text-xl font-bold tabular-nums">
                {fmt(firstYearDeduction)}円
              </p>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-3">
              <p className="text-xs text-blue-200">年間最大控除額</p>
              <p className="text-xl font-bold tabular-nums">
                {fmt(Math.max(...rows.map((r) => r.deductionAmount)))}円
              </p>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-3">
              <p className="text-xs text-blue-200">所得税控除合計</p>
              <p className="text-xl font-bold tabular-nums">
                {fmt(totalIncomeTax)}円
              </p>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-3">
              <p className="text-xs text-blue-200">住民税控除合計</p>
              <p className="text-xl font-bold tabular-nums">
                {fmt(totalJuminzei)}円
              </p>
            </div>
          </div>
        </section>

        {/* ── 所得税 vs 住民税 バー ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            所得税・住民税 控除内訳（合計）
          </h2>
          {totalDeduction > 0 ? (
            <>
              <div className="flex rounded-full overflow-hidden h-6 text-xs font-semibold">
                <div
                  className="bg-indigo-500 flex items-center justify-center text-white transition-all"
                  style={{
                    width: `${(totalIncomeTax / totalDeduction) * 100}%`,
                    minWidth: totalIncomeTax > 0 ? "2rem" : "0",
                  }}
                >
                  {totalIncomeTax > 0 &&
                    `${Math.round((totalIncomeTax / totalDeduction) * 100)}%`}
                </div>
                <div
                  className="bg-blue-300 flex items-center justify-center text-blue-900 transition-all"
                  style={{
                    width: `${(totalJuminzei / totalDeduction) * 100}%`,
                    minWidth: totalJuminzei > 0 ? "2rem" : "0",
                  }}
                >
                  {totalJuminzei > 0 &&
                    `${Math.round((totalJuminzei / totalDeduction) * 100)}%`}
                </div>
              </div>
              <div className="flex gap-6 mt-3 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-sm bg-indigo-500" />
                  所得税 {fmtMan(totalIncomeTax)}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-sm bg-blue-300" />
                  住民税 {fmtMan(totalJuminzei)}
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">控除額がありません。</p>
          )}
        </section>

        {/* ── 年別グラフ ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            年別控除額グラフ
          </h2>
          <div className="space-y-1.5">
            {rows.map((row) => (
              <div key={row.year} className="flex items-center gap-2 text-xs">
                <span className="w-8 text-right text-slate-500 shrink-0">
                  {row.year}年
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-4 bg-gradient-to-r from-indigo-500 to-blue-400 rounded-full transition-all"
                    style={{
                      width: `${(row.deductionAmount / maxDeduction) * 100}%`,
                    }}
                  />
                </div>
                <span className="w-20 text-right text-slate-700 font-medium tabular-nums shrink-0">
                  {fmt(row.deductionAmount)}円
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ── 年別テーブル ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-x-auto">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            年別控除額一覧
          </h2>
          <table className="w-full text-xs text-slate-700 min-w-[520px]">
            <thead>
              <tr className="text-slate-500 border-b border-slate-100">
                <th className="text-right pb-2 pr-3 font-medium">年</th>
                <th className="text-right pb-2 pr-3 font-medium">年末残高</th>
                <th className="text-right pb-2 pr-3 font-medium">控除対象額</th>
                <th className="text-right pb-2 pr-3 font-medium">
                  控除率
                </th>
                <th className="text-right pb-2 pr-3 font-medium">控除額</th>
                <th className="text-right pb-2 font-medium">累計</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.year}
                  className={
                    i % 2 === 0 ? "bg-white" : "bg-slate-50/70"
                  }
                >
                  <td className="py-1.5 pr-3 text-right font-medium text-slate-600">
                    {row.year}年目
                  </td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">
                    {fmtMan(row.yearEndBalance)}
                  </td>
                  <td className="py-1.5 pr-3 text-right tabular-nums">
                    {fmtMan(row.deductionBase)}
                  </td>
                  <td className="py-1.5 pr-3 text-right text-slate-500">
                    0.7%
                  </td>
                  <td className="py-1.5 pr-3 text-right tabular-nums font-semibold text-indigo-700">
                    {fmt(row.deductionAmount)}円
                  </td>
                  <td className="py-1.5 text-right tabular-nums text-blue-700">
                    {fmtMan(row.cumulative)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-slate-200 font-bold">
                <td className="pt-2 pr-3 text-right text-slate-700" colSpan={4}>
                  合計
                </td>
                <td className="pt-2 pr-3 text-right tabular-nums text-indigo-700">
                  {fmt(totalDeduction)}円
                </td>
                <td className="pt-2 text-right tabular-nums text-blue-700">
                  {fmtMan(totalDeduction)}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* ── 注意書き ── */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 space-y-1">
          <p className="font-semibold">ご注意</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>
              所得税額を超える部分は控除されません。年収が低い場合、控除額が制限されます。
            </li>
            <li>
              住民税からの控除は課税所得の5%または97,500円/年のいずれか低い額が上限です。
            </li>
            <li>
              本シミュレーターは概算です。正確な控除額は税理士または税務署にご確認ください。
            </li>
            <li>
              2025年12月31日以降に入居する場合、借入限度額が引き下げられる可能性があります。
            </li>
          </ul>
        </div>

        {/* ── FAQ ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">
            よくある質問
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-slate-200 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full text-left px-4 py-3 flex justify-between items-center gap-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.q}</span>
                  <span
                    className={`text-indigo-500 shrink-0 transition-transform duration-200 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-1 text-sm text-slate-600 bg-slate-50 border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
