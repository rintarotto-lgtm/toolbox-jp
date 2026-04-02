"use client";

import { useState, useMemo } from "react";

type ScholarshipType = "first" | "second-fixed" | "second-variable";

function calcRepaymentMonths(
  principal: number,
  monthlyRate: number,
  payment: number
): number {
  if (payment <= 0) return Infinity;
  if (monthlyRate === 0) return Math.ceil(principal / payment);
  const inner = 1 - (principal * monthlyRate) / payment;
  if (inner <= 0) return Infinity;
  const n = -Math.log(inner) / Math.log(1 + monthlyRate);
  return Math.ceil(n);
}

function formatYM(months: number): string {
  if (!isFinite(months)) return "返済不可";
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}ヶ月`;
  if (m === 0) return `${y}年`;
  return `${y}年${m}ヶ月`;
}

function formatJPY(value: number): string {
  return value.toLocaleString("ja-JP", { maximumFractionDigits: 0 }) + "円";
}

const FAQ_ITEMS = [
  {
    q: "奨学金返済期間の計算方法は？",
    a: "返済期間は元利均等返済方式で計算します。計算式は n = -log(1 - 元本 × 月利 ÷ 月々返済額) ÷ log(1 + 月利) です。第一種奨学金（無利子）の場合は借入総額 ÷ 月々返済額で求めます。",
  },
  {
    q: "繰り上げ返済の効果はどのくらいですか？",
    a: "繰り上げ返済により元金が直接減るため、将来の利息を大幅に削減できます。毎月少額でも追加返済を続けると、数年単位で期間を短縮し、総利息を数十万円節約できるケースがあります。",
  },
  {
    q: "返還猶予・免除制度とは？",
    a: "JASSOの奨学金には、経済的困難・傷病・災害等による「返還期限猶予制度」があります。また死亡や高度障害で返還困難な場合は「返還免除制度」が適用されます。第一種奨学金には特に優れた業績による一部・全部免除制度もあります。",
  },
  {
    q: "奨学金の利子の計算方法は？",
    a: "毎月の利息 = 残元金 × 月利（年利 ÷ 12）で計算され、返済額から利息分を差し引いた残りが元金返済に充てられます。総利息 = 総返済額 − 借入総額で求められます。",
  },
];

export default function ScholarshipRepayPage() {
  const [scholarshipType, setScholarshipType] =
    useState<ScholarshipType>("second-fixed");
  const [principal, setPrincipal] = useState(3_000_000);
  const [monthlyPayment, setMonthlyPayment] = useState(16_000);
  const [annualRate, setAnnualRate] = useState(1.5);
  const [extraPayment, setExtraPayment] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const isFirstType = scholarshipType === "first";
  const effectiveRate = isFirstType ? 0 : annualRate;

  const result = useMemo(() => {
    const monthlyRate = effectiveRate / 100 / 12;

    // Minimum payment check: must be more than monthly interest
    const minPayment =
      monthlyRate > 0 ? Math.ceil(principal * monthlyRate) + 1 : 1;
    const safePayment = Math.max(monthlyPayment, minPayment);

    const baseMonths = calcRepaymentMonths(principal, monthlyRate, safePayment);
    const baseTotal = isFinite(baseMonths) ? safePayment * baseMonths : Infinity;
    const baseInterest = isFinite(baseTotal) ? baseTotal - principal : Infinity;

    const combinedPayment = safePayment + extraPayment;
    const extraMonths =
      extraPayment > 0
        ? calcRepaymentMonths(principal, monthlyRate, combinedPayment)
        : baseMonths;
    const extraTotal = isFinite(extraMonths)
      ? combinedPayment * extraMonths
      : Infinity;
    const extraInterest = isFinite(extraTotal)
      ? extraTotal - principal
      : Infinity;

    const interestSaved =
      isFinite(baseInterest) && isFinite(extraInterest)
        ? baseInterest - extraInterest
        : 0;
    const monthsSaved = isFinite(baseMonths) && isFinite(extraMonths)
      ? baseMonths - extraMonths
      : 0;

    // 5-year balance steps for chart
    const chartSteps: { label: string; balance: number }[] = [];
    let balance = principal;
    const totalYears = isFinite(baseMonths) ? Math.ceil(baseMonths / 12) : 30;
    const stepYears = Math.max(1, Math.floor(totalYears / 6));
    for (let y = 0; y <= totalYears; y += stepYears) {
      const months = y * 12;
      let bal = principal;
      for (let i = 0; i < months && bal > 0; i++) {
        const interest = bal * monthlyRate;
        const principalPaid = Math.min(safePayment - interest, bal);
        bal = Math.max(0, bal - principalPaid);
      }
      chartSteps.push({ label: `${y}年`, balance: bal });
    }
    // Always include final 0
    if (chartSteps[chartSteps.length - 1].balance > 0) {
      chartSteps.push({ label: `${totalYears}年`, balance: 0 });
    }

    // Monthly income burden rates
    const incomes = [200_000, 250_000, 300_000, 350_000, 400_000];
    const burdens = incomes.map((inc) => ({
      income: inc,
      rate: ((safePayment / inc) * 100).toFixed(1),
    }));

    return {
      baseMonths,
      baseTotal,
      baseInterest,
      extraMonths,
      extraTotal,
      extraInterest,
      interestSaved,
      monthsSaved,
      chartSteps,
      burdens,
      safePayment,
    };
  }, [effectiveRate, principal, monthlyPayment, extraPayment, isFirstType]);

  const maxBalance = result.chartSteps[0]?.balance || principal;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            奨学金返済シミュレーター
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            借入総額・利率・月々返済額から総返済額と返済期間を計算
          </p>
        </div>

        {/* Inputs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          {/* 奨学金の種類 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              奨学金の種類
            </label>
            <select
              value={scholarshipType}
              onChange={(e) =>
                setScholarshipType(e.target.value as ScholarshipType)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="first">第一種（無利子）</option>
              <option value="second-fixed">第二種（有利子・固定）</option>
              <option value="second-variable">第二種（有利子・変動）</option>
            </select>
          </div>

          {/* 借入総額 */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">
                借入総額
              </label>
              <span className="text-sm font-semibold text-indigo-600">
                {(principal / 10_000).toLocaleString()}万円
              </span>
            </div>
            <input
              type="range"
              min={500_000}
              max={10_000_000}
              step={100_000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>50万</span>
              <span>1000万</span>
            </div>
          </div>

          {/* 月々の返済額 */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">
                月々の返済額
              </label>
              <span className="text-sm font-semibold text-indigo-600">
                {monthlyPayment.toLocaleString()}円
              </span>
            </div>
            <input
              type="range"
              min={5_000}
              max={100_000}
              step={1_000}
              value={monthlyPayment}
              onChange={(e) => setMonthlyPayment(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>5,000円</span>
              <span>10万円</span>
            </div>
          </div>

          {/* 年利率 */}
          <div>
            <div className="flex justify-between mb-1">
              <label
                className={`text-sm font-medium ${isFirstType ? "text-gray-400" : "text-gray-700"}`}
              >
                年利率
                {isFirstType && (
                  <span className="ml-2 text-xs text-gray-400">
                    （第一種は無利子）
                  </span>
                )}
              </label>
              <span
                className={`text-sm font-semibold ${isFirstType ? "text-gray-400" : "text-indigo-600"}`}
              >
                {isFirstType ? "0.0" : annualRate.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={3.0}
              step={0.1}
              value={isFirstType ? 0 : annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              disabled={isFirstType}
              className={`w-full ${isFirstType ? "accent-gray-300 opacity-40 cursor-not-allowed" : "accent-indigo-600"}`}
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>0.0%</span>
              <span>3.0%</span>
            </div>
          </div>

          {/* 繰り上げ返済 追加額 */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium text-gray-700">
                繰り上げ返済 毎月追加額
              </label>
              <span className="text-sm font-semibold text-violet-600">
                {extraPayment === 0
                  ? "なし"
                  : `+${extraPayment.toLocaleString()}円`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50_000}
              step={1_000}
              value={extraPayment}
              onChange={(e) => setExtraPayment(Number(e.target.value))}
              className="w-full accent-violet-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>0円</span>
              <span>5万円</span>
            </div>
          </div>
        </div>

        {/* Hero result card */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 p-6 text-white shadow-lg">
          <p className="text-sm font-medium opacity-80 mb-1">返済完了まで</p>
          <p className="text-4xl font-extrabold tracking-tight mb-4">
            {isFinite(result.baseMonths)
              ? formatYM(result.baseMonths)
              : "返済不可（月返済額が不足）"}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/15 rounded-xl p-3">
              <p className="text-xs opacity-75 mb-0.5">総返済額</p>
              <p className="text-xl font-bold">
                {isFinite(result.baseTotal)
                  ? formatJPY(result.baseTotal)
                  : "—"}
              </p>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <p className="text-xs opacity-75 mb-0.5">うち利息</p>
              <p className="text-xl font-bold">
                {isFinite(result.baseInterest)
                  ? formatJPY(result.baseInterest)
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* 繰り上げ返済効果カード */}
        {extraPayment > 0 && isFinite(result.monthsSaved) && (
          <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-5">
            <h2 className="text-sm font-semibold text-emerald-700 mb-3">
              繰り上げ返済効果（毎月+{extraPayment.toLocaleString()}円）
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">返済期間の短縮</p>
                <p className="text-2xl font-extrabold text-emerald-600">
                  {result.monthsSaved > 0
                    ? formatYM(result.monthsSaved)
                    : "変化なし"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">節約できる利息</p>
                <p className="text-2xl font-extrabold text-emerald-600">
                  {result.interestSaved > 0
                    ? formatJPY(result.interestSaved)
                    : "—"}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              繰り上げ後の返済完了：
              <span className="font-semibold text-emerald-700">
                {formatYM(result.extraMonths)}
              </span>
              　総返済額：
              <span className="font-semibold text-emerald-700">
                {isFinite(result.extraTotal)
                  ? formatJPY(result.extraTotal)
                  : "—"}
              </span>
            </p>
          </div>
        )}

        {/* 返済スケジュールグラフ */}
        {isFinite(result.baseMonths) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              元本残高の推移
            </h2>
            <div className="space-y-2">
              {result.chartSteps.map(({ label, balance }) => {
                const pct =
                  maxBalance > 0
                    ? Math.round((balance / maxBalance) * 100)
                    : 0;
                return (
                  <div key={label} className="flex items-center gap-3">
                    <span className="w-10 text-xs text-gray-500 text-right shrink-0">
                      {label}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300"
                        style={{ width: `${Math.max(pct, balance === 0 ? 0 : 1)}%` }}
                      />
                    </div>
                    <span className="w-24 text-xs text-gray-600 text-right shrink-0">
                      {formatJPY(balance)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 比較テーブル */}
        {isFinite(result.baseMonths) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">
              通常返済 vs 繰り上げ返済
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="py-2 text-left text-xs text-gray-400 font-medium w-1/3">
                      項目
                    </th>
                    <th className="py-2 text-right text-xs text-gray-400 font-medium">
                      通常返済
                    </th>
                    <th className="py-2 text-right text-xs text-gray-400 font-medium">
                      繰り上げ返済
                    </th>
                    {extraPayment > 0 && (
                      <th className="py-2 text-right text-xs text-emerald-500 font-medium">
                        節約額
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr>
                    <td className="py-2.5 text-gray-600">月々の返済</td>
                    <td className="py-2.5 text-right font-medium">
                      {formatJPY(result.safePayment)}
                    </td>
                    <td className="py-2.5 text-right font-medium text-violet-600">
                      {formatJPY(result.safePayment + extraPayment)}
                    </td>
                    {extraPayment > 0 && (
                      <td className="py-2.5 text-right text-gray-400 text-xs">
                        +{formatJPY(extraPayment)}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-2.5 text-gray-600">返済期間</td>
                    <td className="py-2.5 text-right font-medium">
                      {formatYM(result.baseMonths)}
                    </td>
                    <td className="py-2.5 text-right font-medium text-violet-600">
                      {extraPayment > 0
                        ? formatYM(result.extraMonths)
                        : formatYM(result.baseMonths)}
                    </td>
                    {extraPayment > 0 && (
                      <td className="py-2.5 text-right text-emerald-600 font-semibold text-xs">
                        {result.monthsSaved > 0
                          ? `▲ ${formatYM(result.monthsSaved)}`
                          : "—"}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-2.5 text-gray-600">総返済額</td>
                    <td className="py-2.5 text-right font-medium">
                      {isFinite(result.baseTotal)
                        ? formatJPY(result.baseTotal)
                        : "—"}
                    </td>
                    <td className="py-2.5 text-right font-medium text-violet-600">
                      {extraPayment > 0 && isFinite(result.extraTotal)
                        ? formatJPY(result.extraTotal)
                        : isFinite(result.baseTotal)
                          ? formatJPY(result.baseTotal)
                          : "—"}
                    </td>
                    {extraPayment > 0 && (
                      <td className="py-2.5 text-right text-emerald-600 font-semibold text-xs">
                        {isFinite(result.baseTotal) &&
                        isFinite(result.extraTotal) &&
                        result.baseTotal > result.extraTotal
                          ? `▲ ${formatJPY(result.baseTotal - result.extraTotal)}`
                          : "—"}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td className="py-2.5 text-gray-600">うち利息</td>
                    <td className="py-2.5 text-right font-medium">
                      {isFinite(result.baseInterest)
                        ? formatJPY(result.baseInterest)
                        : "—"}
                    </td>
                    <td className="py-2.5 text-right font-medium text-violet-600">
                      {extraPayment > 0 && isFinite(result.extraInterest)
                        ? formatJPY(result.extraInterest)
                        : isFinite(result.baseInterest)
                          ? formatJPY(result.baseInterest)
                          : "—"}
                    </td>
                    {extraPayment > 0 && (
                      <td className="py-2.5 text-right text-emerald-600 font-semibold text-xs">
                        {result.interestSaved > 0
                          ? `▲ ${formatJPY(result.interestSaved)}`
                          : "—"}
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 月収別シミュレーション */}
        {isFinite(result.baseMonths) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-1">
              月収別 返済負担率
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              月々{formatJPY(result.safePayment)}の返済が月収に占める割合
            </p>
            <div className="space-y-3">
              {result.burdens.map(({ income, rate }) => {
                const rateNum = parseFloat(rate);
                const color =
                  rateNum <= 10
                    ? "from-emerald-400 to-emerald-500"
                    : rateNum <= 15
                      ? "from-indigo-400 to-indigo-500"
                      : rateNum <= 20
                        ? "from-amber-400 to-amber-500"
                        : "from-red-400 to-red-500";
                const textColor =
                  rateNum <= 10
                    ? "text-emerald-600"
                    : rateNum <= 15
                      ? "text-indigo-600"
                      : rateNum <= 20
                        ? "text-amber-600"
                        : "text-red-600";
                return (
                  <div key={income} className="flex items-center gap-3">
                    <span className="w-14 text-xs text-gray-500 shrink-0">
                      月収{(income / 10_000).toFixed(0)}万
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-300`}
                        style={{ width: `${Math.min(rateNum * 2, 100)}%` }}
                      />
                    </div>
                    <span className={`w-14 text-xs font-semibold text-right shrink-0 ${textColor}`}>
                      {rate}%
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              ※ 一般的に返済負担率15%以下が望ましいとされています
            </p>
          </div>
        )}

        {/* FAQ accordion */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            よくある質問
          </h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                >
                  <span>{item.q}</span>
                  <span
                    className={`ml-2 shrink-0 text-indigo-500 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed bg-gray-50">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          ※
          本ツールは参考値の提供を目的としています。実際の返済額はJASSOまたは金融機関にご確認ください。
        </p>
      </div>
    </div>
  );
}
