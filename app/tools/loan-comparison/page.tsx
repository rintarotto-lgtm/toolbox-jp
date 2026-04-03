"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface LoanPlan {
  name: string;
  principal: string;
  rate: string;
  years: string;
  type: "変動" | "固定";
}

interface LoanResult {
  monthly: number;
  total: number;
  totalInterest: number;
  interestRatio: number;
}

const PRESETS = [
  { label: "住宅ローン", rate: "0.5", years: "35", type: "変動" as const },
  { label: "フラット35", rate: "1.8", years: "35", type: "固定" as const },
  { label: "カーローン", rate: "3.0", years: "5", type: "固定" as const },
  { label: "マイカーローン", rate: "2.0", years: "7", type: "固定" as const },
  { label: "カードローン", rate: "15.0", years: "3", type: "変動" as const },
];

function calcLoan(principal: number, annualRate: number, years: number): LoanResult | null {
  if (!principal || !years || principal <= 0 || years <= 0 || annualRate < 0) return null;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  let monthly: number;
  if (monthlyRate === 0) {
    monthly = principal / totalMonths;
  } else {
    monthly =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }
  const total = Math.round(monthly * totalMonths);
  const totalInterest = total - principal;
  const interestRatio = (totalInterest / principal) * 100;
  return { monthly: Math.round(monthly), total, totalInterest, interestRatio };
}

function calcPrepayment(
  principal: number,
  annualRate: number,
  years: number,
  prepayAmount: number,
  prepayYear: number
): { savedInterest: number; savedMonths: number } | null {
  if (!principal || !years || principal <= 0 || prepayAmount <= 0 || prepayYear <= 0) return null;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;

  const calcMonthly = (p: number, months: number) => {
    if (monthlyRate === 0) return p / months;
    return (
      (p * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1)
    );
  };

  const originalMonthly = calcMonthly(principal, totalMonths);

  // Calculate balance at prepayYear
  let balance = principal;
  let paidInterest = 0;
  const prepayMonth = prepayYear * 12;
  for (let i = 1; i <= prepayMonth && i <= totalMonths; i++) {
    const interest = balance * monthlyRate;
    const principalPart = originalMonthly - interest;
    paidInterest += interest;
    balance = Math.max(0, balance - principalPart);
  }

  if (balance <= 0 || prepayAmount >= balance) return null;

  const newBalance = balance - prepayAmount;
  const remainingMonths = totalMonths - prepayMonth;

  // Original remaining interest
  const originalRemainingTotal = originalMonthly * remainingMonths;
  const originalRemainingInterest = originalRemainingTotal - balance;

  // New remaining interest (same monthly payment, shorter period)
  let newMonths = 0;
  let b = newBalance;
  while (b > 0 && newMonths < remainingMonths) {
    const interest = b * monthlyRate;
    const principalPart = originalMonthly - interest;
    b = Math.max(0, b - principalPart);
    newMonths++;
  }
  const newRemainingTotal = originalMonthly * newMonths;
  const newRemainingInterest = newRemainingTotal - newBalance;

  const savedInterest = Math.round(
    originalRemainingInterest - newRemainingInterest - prepayAmount
  );
  const savedMonths = remainingMonths - newMonths;

  return { savedInterest, savedMonths };
}

const PLAN_LABELS = ["A", "B", "C"];

const defaultPlans: LoanPlan[] = [
  { name: "プランA", principal: "3000", rate: "0.5", years: "35", type: "変動" },
  { name: "プランB", principal: "3000", rate: "1.8", years: "35", type: "固定" },
  { name: "プランC", principal: "3000", rate: "3.0", years: "5", type: "固定" },
];

export default function LoanComparison() {
  const [plans, setPlans] = useState<LoanPlan[]>(defaultPlans);
  const [prepayPlan, setPrepayPlan] = useState(0);
  const [prepayAmount, setPrepayAmount] = useState("");
  const [prepayYear, setPrepayYear] = useState("5");

  const results = useMemo<(LoanResult | null)[]>(() => {
    return plans.map((p) => {
      const principal = parseFloat(p.principal) * 10000;
      const rate = parseFloat(p.rate);
      const years = parseFloat(p.years);
      if (isNaN(principal) || isNaN(rate) || isNaN(years)) return null;
      return calcLoan(principal, rate, years);
    });
  }, [plans]);

  const bestIndex = useMemo(() => {
    const valids = results
      .map((r, i) => (r ? { i, total: r.total } : null))
      .filter(Boolean) as { i: number; total: number }[];
    if (valids.length === 0) return -1;
    return valids.reduce((a, b) => (a.total <= b.total ? a : b)).i;
  }, [results]);

  const prepayResult = useMemo(() => {
    const plan = plans[prepayPlan];
    const principal = parseFloat(plan.principal) * 10000;
    const rate = parseFloat(plan.rate);
    const years = parseFloat(plan.years);
    const amount = parseFloat(prepayAmount) * 10000;
    const year = parseFloat(prepayYear);
    if (isNaN(principal) || isNaN(rate) || isNaN(years) || isNaN(amount) || isNaN(year)) return null;
    return calcPrepayment(principal, rate, years, amount, year);
  }, [plans, prepayPlan, prepayAmount, prepayYear]);

  const updatePlan = (index: number, field: keyof LoanPlan, value: string) => {
    setPlans((prev) => prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)));
  };

  const applyPreset = (planIndex: number, preset: (typeof PRESETS)[0]) => {
    setPlans((prev) =>
      prev.map((p, i) =>
        i === planIndex
          ? { ...p, rate: preset.rate, years: preset.years, type: preset.type }
          : p
      )
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-700 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">🏦</span>
          <h1 className="text-2xl font-bold">ローン比較計算</h1>
        </div>
        <p className="text-blue-100 text-sm">
          複数のローンプランを並べて比較。月々返済額・総支払額・利息総額を一括計算します。
        </p>
      </div>

      <AdBanner />

      {/* Plan inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {plans.map((plan, pi) => (
          <div key={pi} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={plan.name}
                onChange={(e) => updatePlan(pi, "name", e.target.value)}
                className="font-bold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500 w-full text-sm"
              />
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 shrink-0">
                {PLAN_LABELS[pi]}
              </span>
            </div>

            {/* Presets */}
            <div>
              <p className="text-xs text-gray-500 mb-1">プリセット</p>
              <div className="flex flex-wrap gap-1">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => applyPreset(pi, preset)}
                    className="text-xs px-2 py-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 rounded transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">借入額（万円）</label>
              <input
                type="number"
                value={plan.principal}
                onChange={(e) => updatePlan(pi, "principal", e.target.value)}
                min="0"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">金利（%/年）</label>
              <input
                type="number"
                value={plan.rate}
                onChange={(e) => updatePlan(pi, "rate", e.target.value)}
                min="0"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">返済期間（年）</label>
              <input
                type="number"
                value={plan.years}
                onChange={(e) => updatePlan(pi, "years", e.target.value)}
                min="1"
                max="50"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 mb-1 block">金利タイプ</label>
              <div className="flex gap-2">
                {(["変動", "固定"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => updatePlan(pi, "type", t)}
                    className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${
                      plan.type === t
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Results Table */}
      {results.some(Boolean) && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">比較結果</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-gray-600 font-medium">項目</th>
                  {plans.map((plan, pi) => (
                    <th
                      key={pi}
                      className={`px-4 py-3 text-center font-medium ${
                        pi === bestIndex && results[pi]
                          ? "text-blue-700 bg-blue-50"
                          : "text-gray-600"
                      }`}
                    >
                      {plan.name}
                      {pi === bestIndex && results[pi] && (
                        <span className="ml-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                          最安
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { label: "月々返済額", key: "monthly", unit: "円" },
                  { label: "総支払額", key: "total", unit: "円" },
                  { label: "利息総額", key: "totalInterest", unit: "円" },
                  { label: "利息割合", key: "interestRatio", unit: "%" },
                ].map(({ label, key, unit }) => (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-700 font-medium">{label}</td>
                    {results.map((r, pi) => (
                      <td
                        key={pi}
                        className={`px-4 py-3 text-center ${
                          pi === bestIndex && r ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-800"
                        }`}
                      >
                        {r
                          ? key === "interestRatio"
                            ? `${(r[key as keyof LoanResult] as number).toFixed(1)}%`
                            : `¥${(r[key as keyof LoanResult] as number).toLocaleString()}`
                          : "—"}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">借入額</td>
                  {plans.map((plan, pi) => (
                    <td key={pi} className="px-4 py-3 text-center text-gray-800">
                      {plan.principal ? `¥${(parseFloat(plan.principal) * 10000).toLocaleString()}` : "—"}
                    </td>
                  ))}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 font-medium">金利タイプ</td>
                  {plans.map((plan, pi) => (
                    <td key={pi} className="px-4 py-3 text-center">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          plan.type === "変動"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {plan.type}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Result Cards */}
      {results.some(Boolean) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {results.map((r, pi) =>
            r ? (
              <div
                key={pi}
                className={`rounded-xl p-5 border ${
                  pi === bestIndex
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-800 text-sm">{plans[pi].name}</span>
                  {pi === bestIndex && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      一番お得
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  ¥{r.monthly.toLocaleString()}
                  <span className="text-sm font-normal text-gray-500">/月</span>
                </div>
                <div className="text-xs text-gray-500 space-y-1 mt-2">
                  <div className="flex justify-between">
                    <span>総支払額</span>
                    <span className="font-medium text-gray-700">¥{r.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>利息総額</span>
                    <span className="font-medium text-orange-600">¥{r.totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>利息割合</span>
                    <span className="font-medium text-gray-700">{r.interestRatio.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}

      <AdBanner />

      {/* Prepayment Simulator */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <h2 className="font-bold text-gray-800 mb-4">繰り上げ返済シミュレーター</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">対象プラン</label>
            <select
              value={prepayPlan}
              onChange={(e) => setPrepayPlan(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {plans.map((plan, pi) => (
                <option key={pi} value={pi}>
                  {plan.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">繰り上げ返済額（万円）</label>
            <input
              type="number"
              value={prepayAmount}
              onChange={(e) => setPrepayAmount(e.target.value)}
              placeholder="100"
              min="0"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 mb-1 block">実行タイミング（○年後）</label>
            <input
              type="number"
              value={prepayYear}
              onChange={(e) => setPrepayYear(e.target.value)}
              placeholder="5"
              min="1"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        {prepayResult && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                ¥{prepayResult.savedInterest.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">利息削減額</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.floor(prepayResult.savedMonths / 12)}年{prepayResult.savedMonths % 12}ヶ月
              </div>
              <div className="text-xs text-gray-500 mt-1">短縮期間</div>
            </div>
          </div>
        )}
        {!prepayResult && prepayAmount && (
          <p className="text-sm text-gray-400 mt-2">繰り上げ返済額と対象プランを入力してください。</p>
        )}
      </div>

      <section className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-3">ローン比較計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          最大3つのローンプランを並べて比較できます。各プランに借入額・金利・返済期間を入力すると、月々返済額・総支払額・利息総額・利息割合を自動計算。プリセットボタンで主要ローンの条件をワンクリック入力できます。住宅ローン・カーローン・借り換えの比較にご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "住宅ローンの変動金利と固定金利どちらがいいですか？",
            answer:
              "変動金利は現在低い（0.3〜0.5%程度）ですが金利上昇リスクがあります。固定金利（フラット35等）は1.5〜2%程度ですが返済額が確定します。返済期間中の金利動向の読みと家計の余裕度で選択が重要です。",
          },
          {
            question: "ローンの繰り上げ返済はいつするのがお得ですか？",
            answer:
              "早期の繰り上げ返済ほど利息削減効果が大きいです。残高が多く返済期間が長い早い時期に実行することで、後半より大幅な利息節約になります。",
          },
          {
            question: "カードローンと消費者金融の違いは何ですか？",
            answer:
              "金利面ではほぼ同様（年3〜18%程度）ですが、銀行系カードローンの方が金利が低い傾向があります。いずれも住宅・自動車ローンと比べて高金利のため、できるだけ短期返済が重要です。",
          },
          {
            question: "借り換えで得するローンの条件は何ですか？",
            answer:
              "残債が多い、残返済期間が長い、金利差が1%以上ある場合に借り換えメリットが大きいとされています。諸費用（登録免許税・保証料等）も考慮した総コスト比較が必要です。",
          },
        ]}
      />

      <RelatedTools currentToolId="loan-comparison" />

      <p className="text-xs text-gray-400 mt-6 text-center">
        ※本ツールは元利均等返済方式による簡易シミュレーションです。実際のローンでは手数料・保証料・団信保険料等が加わります。正確な条件は各金融機関にご確認ください。
      </p>
    </div>
  );
}
