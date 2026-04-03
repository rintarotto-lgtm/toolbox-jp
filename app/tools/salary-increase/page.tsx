"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── Helpers ───

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
  if (taxableIncome <= 3_300_000) return taxableIncome * 0.1 - 97_500;
  if (taxableIncome <= 6_950_000) return taxableIncome * 0.2 - 427_500;
  if (taxableIncome <= 9_000_000) return taxableIncome * 0.23 - 636_000;
  if (taxableIncome <= 18_000_000) return taxableIncome * 0.33 - 1_536_000;
  if (taxableIncome <= 40_000_000) return taxableIncome * 0.4 - 2_796_000;
  return taxableIncome * 0.45 - 4_796_000;
}

/** 手取り計算 */
function calcTakeHome(annualSalary: number): number {
  const socialInsurance = Math.floor(annualSalary * 0.15);
  const employmentIncome = annualSalary - employmentDeduction(annualSalary);
  const taxableIncome = Math.max(0, employmentIncome - 480_000 - socialInsurance);
  const rawIT = Math.floor(incomeTax(taxableIncome));
  const totalIncomeTax = rawIT + Math.floor(rawIT * 0.021);
  const taxableResident = Math.max(0, employmentIncome - 430_000 - socialInsurance);
  const residentTax = Math.floor(taxableResident * 0.1 + 5_000);
  return Math.max(0, annualSalary - socialInsurance - totalIncomeTax - residentTax);
}

type RaisePattern = "annual" | "biennial" | "triennial" | "random";

interface YearRow {
  year: number;
  salary: number; // 万円
  takeHome: number; // 万円
  cumulative: number; // 万円
}

/** 昇給シミュレーション */
function simulate(
  baseSalaryMan: number,
  raiseRate: number, // %
  totalYears: number,
  pattern: RaisePattern,
  seed?: number
): YearRow[] {
  const rows: YearRow[] = [];
  let salary = baseSalaryMan;
  let cumulative = 0;

  // Simple LCG for deterministic "random" raises
  let rngState = seed ?? 42;
  const rng = () => {
    rngState = (rngState * 1664525 + 1013904223) & 0xffffffff;
    return (rngState >>> 0) / 0xffffffff;
  };

  for (let yr = 1; yr <= totalYears; yr++) {
    let raised = false;
    if (pattern === "annual") {
      raised = true;
    } else if (pattern === "biennial") {
      raised = yr % 2 === 0;
    } else if (pattern === "triennial") {
      raised = yr % 3 === 0;
    } else if (pattern === "random") {
      // 60% chance of raise each year, rate ±30% variation
      raised = rng() < 0.6;
    }

    if (raised && yr > 0) {
      let effectiveRate = raiseRate;
      if (pattern === "random") {
        const variation = (rng() - 0.5) * 0.6; // ±30%
        effectiveRate = Math.max(0, raiseRate * (1 + variation));
      }
      salary = salary * (1 + effectiveRate / 100);
    }

    const salaryRounded = Math.round(salary * 10) / 10;
    const takeHomeYen = calcTakeHome(salaryRounded * 10_000);
    const takeHomeMan = Math.round(takeHomeYen / 10_000 * 10) / 10;
    cumulative += salaryRounded;

    rows.push({
      year: yr,
      salary: salaryRounded,
      takeHome: takeHomeMan,
      cumulative: Math.round(cumulative),
    });
  }
  return rows;
}

function formatMan(n: number): string {
  return `${Math.round(n).toLocaleString("ja-JP")}万円`;
}

// ─── FAQ data ───
const FAQS = [
  {
    q: "日本の平均昇給率はどのくらいですか？",
    a: "厚生労働省の調査によると、日本の平均賃金上昇率（ベースアップ＋定期昇給）は近年2〜3%程度です。2023〜2024年は物価上昇を背景に3〜5%程度の昇給を実施する企業も増えています。ただし業種・企業規模・職種によって大きく異なります。",
  },
  {
    q: "転職で年収を上げるにはどうすればよいですか？",
    a: "転職での年収アップには、①希少スキルの習得、②年収水準が高い業界・職種への移動、③実績を数値で示した交渉が効果的です。日本では転職による年収増加の中央値は約10〜20%とされています。",
  },
  {
    q: "生涯年収の平均はいくらですか？",
    a: "日本の大卒サラリーマン（男性）の生涯年収は約2億〜3億円が目安とされています。大企業勤務では3億円超、中小企業では2億円前後が一般的です。これらはあくまで平均値であり、個人差が大きい数字です。",
  },
  {
    q: "ベースアップと昇給の違いは何ですか？",
    a: "ベースアップ（ベア）は全従業員の給与水準を一律に引き上げることです。一方、昇給（定期昇給）は個人の勤続年数・評価に応じて個別に給与を上げる仕組みです。実際の昇給率はベアと定昇の合計になります。",
  },
];

const PATTERN_OPTIONS: { value: RaisePattern; label: string }[] = [
  { value: "annual", label: "毎年" },
  { value: "biennial", label: "2年ごと" },
  { value: "triennial", label: "3年ごと" },
  { value: "random", label: "不定期（ランダム）" },
];

// ─── Component ───
export default function SalaryIncrease() {
  const [baseSalary, setBaseSalary] = useState(400); // 万円
  const [raiseRate, setRaiseRate] = useState(3); // %
  const [totalYears, setTotalYears] = useState(30);
  const [pattern, setPattern] = useState<RaisePattern>("annual");
  const [transferSalary, setTransferSalary] = useState<string>(""); // 万円, optional
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  // Show all rows toggle
  const [showAll, setShowAll] = useState(false);

  const rows = useMemo(
    () => simulate(baseSalary, raiseRate, totalYears, pattern),
    [baseSalary, raiseRate, totalYears, pattern]
  );

  const transferSalaryNum = transferSalary !== "" ? Number(transferSalary) : null;

  // Transfer scenario rows (flat raise to transferSalary, then same raise rate)
  const transferRows = useMemo(() => {
    if (transferSalaryNum === null || transferSalaryNum <= 0) return null;
    return simulate(transferSalaryNum, raiseRate, totalYears, pattern);
  }, [transferSalaryNum, raiseRate, totalYears, pattern]);

  const finalRow = rows[rows.length - 1];
  const lifetimeTotal = finalRow?.cumulative ?? 0;

  // 定年60歳想定の生涯年収
  const retirementAge = 60;
  const lifeTimeRows = useMemo(() => {
    const age = Math.min(totalYears, retirementAge);
    return simulate(baseSalary, raiseRate, age, pattern);
  }, [baseSalary, raiseRate, totalYears, pattern]);
  const lifetimeSalary = lifeTimeRows[lifeTimeRows.length - 1]?.cumulative ?? 0;

  // Transfer lifetime
  const lifeTimeTransferRows = useMemo(() => {
    if (transferSalaryNum === null || transferSalaryNum <= 0) return null;
    const age = Math.min(totalYears, retirementAge);
    return simulate(transferSalaryNum, raiseRate, age, pattern);
  }, [transferSalaryNum, raiseRate, totalYears, pattern]);
  const lifetimeTransfer = lifeTimeTransferRows?.[lifeTimeTransferRows.length - 1]?.cumulative ?? 0;

  // Comparison years
  const compareYears = [5, 10, 20].filter((y) => y <= totalYears);

  // Table display
  const displayRows = showAll ? rows : rows.filter((r) => {
    if (totalYears <= 20) return true;
    const step = Math.ceil(totalYears / 20);
    return r.year % step === 0 || r.year === totalYears || r.year === 1;
  });

  // Chart max
  const maxSalary = Math.max(...rows.map((r) => r.salary), transferRows ? Math.max(...transferRows.map((r) => r.salary)) : 0, 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">💰</span>
          <h1 className="text-2xl font-bold">昇給シミュレーター</h1>
        </div>
        <p className="text-amber-100 text-sm">
          現在の年収・昇給率・勤続年数から将来の給与推移と生涯年収を予測。転職との年収比較も可能。
        </p>
      </div>

      {/* Inputs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
        {/* 現在の年収 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            現在の年収
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={100}
              max={5000}
              step={10}
              value={baseSalary}
              onChange={(e) => setBaseSalary(Math.max(100, Math.min(5000, Number(e.target.value))))}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <span className="text-gray-500 text-sm shrink-0">万円</span>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            step={10}
            value={Math.min(baseSalary, 2000)}
            onChange={(e) => setBaseSalary(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-amber-500 mt-2
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-amber-200 to-amber-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>100万</span>
            <span>500万</span>
            <span>1,000万</span>
            <span>1,500万</span>
            <span>2,000万</span>
          </div>
        </div>

        {/* 昇給率 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            昇給率: <span className="text-amber-600 font-bold">{raiseRate}%/年</span>
          </label>
          <input
            type="range"
            min={0.5}
            max={15}
            step={0.5}
            value={raiseRate}
            onChange={(e) => setRaiseRate(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-orange-500
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-orange-200 to-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0.5%</span>
            <span>3%</span>
            <span>5%</span>
            <span>10%</span>
            <span>15%</span>
          </div>
        </div>

        {/* 勤続年数 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            シミュレーション年数: <span className="text-amber-600 font-bold">{totalYears}年</span>
          </label>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={totalYears}
            onChange={(e) => setTotalYears(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-amber-600
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-amber-200 to-amber-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1年</span>
            <span>10年</span>
            <span>20年</span>
            <span>30年</span>
            <span>40年</span>
          </div>
        </div>

        {/* 昇給パターン */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">昇給パターン</label>
          <div className="grid grid-cols-2 gap-2">
            {PATTERN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPattern(opt.value)}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                  pattern === opt.value
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-amber-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 転職後年収（任意） */}
        <div className="border-t border-gray-100 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            転職後の年収（万円）
            <span className="text-gray-400 font-normal ml-1">任意・現職と比較</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={100}
              max={5000}
              step={10}
              value={transferSalary}
              placeholder="例: 500"
              onChange={(e) => setTransferSalary(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <span className="text-gray-500 text-sm shrink-0">万円</span>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <p className="text-xs text-amber-600 mb-1">{totalYears}年後の年収</p>
          <p className="text-xl font-extrabold text-amber-700">
            {formatMan(finalRow?.salary ?? 0)}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-xs text-orange-600 mb-1">{totalYears}年後の手取り</p>
          <p className="text-xl font-extrabold text-orange-700">
            {formatMan(finalRow?.takeHome ?? 0)}
          </p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center col-span-2 sm:col-span-1">
          <p className="text-xs text-yellow-700 mb-1">生涯年収合計（〜60歳）</p>
          <p className="text-xl font-extrabold text-yellow-800">
            {formatMan(lifetimeSalary)}
          </p>
        </div>
      </div>

      <AdBanner />

      {/* Bar chart */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">年収推移グラフ</h2>
        <div className="space-y-1 overflow-y-auto" style={{ maxHeight: 420 }}>
          {rows.map((row) => {
            const currentPct = (row.salary / maxSalary) * 100;
            const transferRow = transferRows?.[row.year - 1];
            const transferPct = transferRow ? (transferRow.salary / maxSalary) * 100 : 0;
            return (
              <div key={row.year} className="flex items-center gap-2 min-w-0">
                <span className="text-xs text-gray-500 w-8 shrink-0 text-right">
                  {row.year}年
                </span>
                <div className="flex-1 flex flex-col gap-0.5">
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-300"
                      style={{ width: `${currentPct}%` }}
                    />
                  </div>
                  {transferRows && (
                    <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-400 rounded-full transition-all duration-300"
                        style={{ width: `${transferPct}%` }}
                      />
                    </div>
                  )}
                </div>
                <span className="text-xs font-semibold text-amber-700 w-20 shrink-0 text-right">
                  {formatMan(row.salary)}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-amber-400" />現職
          </span>
          {transferRows && (
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-blue-400" />転職後
            </span>
          )}
        </div>
      </div>

      {/* 転職比較 */}
      {transferRows && transferSalaryNum && compareYears.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">現職 vs 転職 年収比較</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left py-2 px-2 font-medium">時点</th>
                  <th className="text-right py-2 px-2 font-medium text-amber-600">現職</th>
                  <th className="text-right py-2 px-2 font-medium text-blue-600">転職後</th>
                  <th className="text-right py-2 px-2 font-medium">差額</th>
                </tr>
              </thead>
              <tbody>
                {compareYears.map((yr) => {
                  const cur = rows[yr - 1];
                  const tr = transferRows[yr - 1];
                  if (!cur || !tr) return null;
                  const diff = tr.salary - cur.salary;
                  return (
                    <tr key={yr} className="border-b border-gray-100">
                      <td className="py-2.5 px-2 text-gray-700 font-medium">{yr}年後</td>
                      <td className="py-2.5 px-2 text-right text-amber-700 font-semibold">
                        {formatMan(cur.salary)}
                      </td>
                      <td className="py-2.5 px-2 text-right text-blue-700 font-semibold">
                        {formatMan(tr.salary)}
                      </td>
                      <td className={`py-2.5 px-2 text-right font-semibold ${diff >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {diff >= 0 ? "+" : ""}{formatMan(diff)}
                      </td>
                    </tr>
                  );
                })}
                {/* 生涯年収比較 */}
                <tr className="bg-gray-50 font-bold">
                  <td className="py-2.5 px-2 text-gray-700">生涯年収（〜60歳）</td>
                  <td className="py-2.5 px-2 text-right text-amber-700">{formatMan(lifetimeSalary)}</td>
                  <td className="py-2.5 px-2 text-right text-blue-700">{formatMan(lifetimeTransfer)}</td>
                  <td className={`py-2.5 px-2 text-right ${lifetimeTransfer - lifetimeSalary >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {lifetimeTransfer - lifetimeSalary >= 0 ? "+" : ""}
                    {formatMan(lifetimeTransfer - lifetimeSalary)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Year-by-year table */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">年度別シミュレーション</h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-right py-2 px-2 font-medium">年数</th>
                <th className="text-right py-2 px-2 font-medium">年収（万円）</th>
                <th className="text-right py-2 px-2 font-medium">手取り推定（万円）</th>
                <th className="text-right py-2 px-2 font-medium">生涯累計（万円）</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((row) => (
                <tr
                  key={row.year}
                  className={`border-b border-gray-100 ${
                    row.year === totalYears ? "bg-amber-50 font-bold" : ""
                  }`}
                >
                  <td className="py-2 px-2 text-right text-gray-600">{row.year}年目</td>
                  <td className="py-2 px-2 text-right text-amber-700 font-semibold">
                    {Math.round(row.salary).toLocaleString("ja-JP")}万
                  </td>
                  <td className="py-2 px-2 text-right text-orange-600">
                    {Math.round(row.takeHome).toLocaleString("ja-JP")}万
                  </td>
                  <td className="py-2 px-2 text-right text-gray-600">
                    {row.cumulative.toLocaleString("ja-JP")}万
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length > displayRows.length && (
          <button
            onClick={() => setShowAll(true)}
            className="mt-3 text-sm text-amber-600 hover:underline w-full text-center"
          >
            全{rows.length}行を表示
          </button>
        )}
        {showAll && rows.length > 20 && (
          <button
            onClick={() => setShowAll(false)}
            className="mt-3 text-sm text-gray-400 hover:underline w-full text-center"
          >
            折りたたむ
          </button>
        )}
      </div>

      <AdBanner />

      {/* FAQ */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-amber-600"
              >
                <span>{faq.q}</span>
                <span className="text-gray-400 ml-2 shrink-0 text-base">
                  {openFaq === i ? "−" : "＋"}
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="salary-increase" />

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ 本ツールの計算結果は概算です。正確な金額は税理士・ファイナンシャルプランナーにご相談ください。
        手取り計算は2024年度の税制を基にした概算値です。実際の金額は扶養家族の有無・各種控除・お住まいの自治体等により異なります。
      </p>
    </div>
  );
}
