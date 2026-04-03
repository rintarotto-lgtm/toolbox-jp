"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/* ─── Types ─── */
interface ExpenseCategory {
  key: string;
  label: string;
  icon: string;
  idealPct: number;
  adviceTip: string;
}

interface HouseholdPreset {
  label: string;
  income: number;
  expenses: Record<string, number>;
}

/* ─── Constants ─── */
const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    key: "housing",
    label: "住居費（家賃・ローン）",
    icon: "🏠",
    idealPct: 25,
    adviceTip: "住居費が高い場合は、住み替えや家賃交渉、シェアハウスの検討が有効です。",
  },
  {
    key: "food",
    label: "食費",
    icon: "🍚",
    idealPct: 15,
    adviceTip: "食費を抑えるには自炊の増加、まとめ買い、食材の使い回しがおすすめです。",
  },
  {
    key: "utilities",
    label: "光熱費（電気・ガス・水道）",
    icon: "💡",
    idealPct: 5,
    adviceTip: "電力会社の見直し、LED照明への切替、節水シャワーヘッドで削減できます。",
  },
  {
    key: "communication",
    label: "通信費（スマホ・ネット）",
    icon: "📱",
    idealPct: 3,
    adviceTip: "格安SIMへの乗り換えで月数千円の節約になります。不要なサブスクも見直しましょう。",
  },
  {
    key: "transport",
    label: "交通費",
    icon: "🚗",
    idealPct: 5,
    adviceTip: "定期券の最適化や自転車の活用、カーシェアリングの検討が効果的です。",
  },
  {
    key: "clothing",
    label: "衣服・日用品",
    icon: "👔",
    idealPct: 5,
    adviceTip: "季節ごとのセールの活用や、必要なものだけを買う習慣づけが有効です。",
  },
  {
    key: "entertainment",
    label: "娯楽・趣味",
    icon: "🎮",
    idealPct: 5,
    adviceTip: "無料・低コストの娯楽（図書館・公園等）を活用し、楽しみながら節約しましょう。",
  },
  {
    key: "medical",
    label: "医療・保険",
    icon: "🏥",
    idealPct: 5,
    adviceTip: "保険の見直しで無駄な保険料を削減できます。掛捨て保険の検討も有効です。",
  },
  {
    key: "education",
    label: "教育・自己投資",
    icon: "📚",
    idealPct: 5,
    adviceTip: "無料の学習リソース（YouTube・図書館・無料講座）を活用しましょう。",
  },
  {
    key: "other",
    label: "その他",
    icon: "💰",
    idealPct: 2,
    adviceTip: "「その他」の金額が多い場合は家計簿で内訳を把握し、無駄を見つけましょう。",
  },
];

const HOUSEHOLD_PRESETS: HouseholdPreset[] = [
  {
    label: "一人暮らし",
    income: 20,
    expenses: {
      housing: 6,
      food: 3,
      utilities: 1,
      communication: 0.5,
      transport: 1,
      clothing: 1,
      entertainment: 1,
      medical: 0.5,
      education: 0.5,
      other: 0.5,
    },
  },
  {
    label: "二人暮らし",
    income: 40,
    expenses: {
      housing: 10,
      food: 6,
      utilities: 2,
      communication: 1,
      transport: 2,
      clothing: 2,
      entertainment: 2,
      medical: 1,
      education: 1,
      other: 1,
    },
  },
  {
    label: "ファミリー(子1人)",
    income: 50,
    expenses: {
      housing: 12,
      food: 8,
      utilities: 2.5,
      communication: 1.5,
      transport: 3,
      clothing: 2.5,
      entertainment: 2.5,
      medical: 1.5,
      education: 3,
      other: 1,
    },
  },
  {
    label: "ファミリー(子2人)",
    income: 60,
    expenses: {
      housing: 14,
      food: 10,
      utilities: 3,
      communication: 2,
      transport: 4,
      clothing: 3,
      entertainment: 3,
      medical: 2,
      education: 5,
      other: 2,
    },
  },
];

const FAQ_ITEMS = [
  {
    q: "理想的な家計の支出割合はどのくらいですか？",
    a: "手取り収入を100%とした場合、住居費25%以下、食費15%、光熱費5%、通信費3%以下、趣味・娯楽5%、貯蓄20%以上が理想とされています。ただし地域や家族構成によって異なります。",
  },
  {
    q: "貯蓄はどのくらいするのが正解ですか？",
    a: "一般的に手取り収入の20%以上が理想とされています。まず生活費の3〜6ヶ月分の緊急予備資金を確保し、その後iDeCo・NISAなどの投資に回すのがおすすめです。",
  },
  {
    q: "一人暮らしの平均的な生活費はいくらですか？",
    a: "総務省の家計調査によると、単身世帯の月間消費支出は約15〜17万円程度です。ただし東京などの都市部では家賃が高いため20万円以上かかることも珍しくありません。",
  },
  {
    q: "固定費と変動費の違いは何ですか？",
    a: "固定費は毎月ほぼ一定の支出（家賃・保険料・サブスク等）で、変動費は月によって変動する支出（食費・光熱費・娯楽費等）です。節約は固定費の削減が効果的です。",
  },
];

/* ─── Helpers ─── */
function calcFutureValue(
  monthlySaving: number,
  months: number,
  annualRate: number
): number {
  const r = annualRate / 12;
  if (r === 0) return monthlySaving * months;
  return (monthlySaving * ((Math.pow(1 + r, months) - 1) / r));
}

function formatMan(n: number): string {
  const man = n / 10_000;
  if (man >= 10_000) return `${(man / 10_000).toFixed(1)}億`;
  if (man >= 100) return `${Math.round(man)}万`;
  return `${man.toFixed(1)}万`;
}

/* ─── Component ─── */
export default function HomeBudget() {
  const [income, setIncome] = useState<string>("30");
  const [expenses, setExpenses] = useState<Record<string, string>>(() =>
    Object.fromEntries(EXPENSE_CATEGORIES.map((c) => [c.key, ""]))
  );

  const incomeYen = useMemo(
    () => (parseFloat(income) || 0) * 10_000,
    [income]
  );

  const expensesYen = useMemo(() => {
    const result: Record<string, number> = {};
    for (const c of EXPENSE_CATEGORIES) {
      result[c.key] = (parseFloat(expenses[c.key]) || 0) * 10_000;
    }
    return result;
  }, [expenses]);

  const totalExpenseYen = useMemo(
    () => Object.values(expensesYen).reduce((s, v) => s + v, 0),
    [expensesYen]
  );

  const savingsYen = incomeYen - totalExpenseYen;
  const savingsRate = incomeYen > 0 ? (savingsYen / incomeYen) * 100 : 0;

  const handlePreset = (preset: HouseholdPreset) => {
    setIncome(String(preset.income));
    const newExp: Record<string, string> = {};
    for (const c of EXPENSE_CATEGORIES) {
      newExp[c.key] = String(preset.expenses[c.key] ?? "");
    }
    setExpenses(newExp);
  };

  const handleExpense = (key: string, val: string) => {
    setExpenses((prev) => ({ ...prev, [key]: val }));
  };

  // Over-budget categories (actual > ideal)
  const overBudgetCategories = useMemo(() => {
    if (incomeYen === 0) return [];
    return EXPENSE_CATEGORIES.filter((c) => {
      const actualPct = (expensesYen[c.key] / incomeYen) * 100;
      return actualPct > c.idealPct;
    }).sort(
      (a, b) =>
        (expensesYen[b.key] / incomeYen) * 100 -
        b.idealPct -
        ((expensesYen[a.key] / incomeYen) * 100 - a.idealPct)
    );
  }, [expensesYen, incomeYen]);

  // Savings status
  const savingsColor =
    savingsRate >= 20
      ? "text-green-600"
      : savingsRate >= 10
      ? "text-yellow-600"
      : savingsRate >= 0
      ? "text-orange-500"
      : "text-red-600";

  const savingsBg =
    savingsRate >= 20
      ? "bg-green-50 border-green-200"
      : savingsRate >= 10
      ? "bg-yellow-50 border-yellow-200"
      : savingsRate >= 0
      ? "bg-orange-50 border-orange-200"
      : "bg-red-50 border-red-200";

  const diagnosisComment = useMemo(() => {
    if (incomeYen === 0) return "";
    if (savingsRate >= 20) {
      return `貯蓄率${savingsRate.toFixed(1)}%は優秀です！このペースを維持しながら、NISAやiDeCoで資産運用も検討してみましょう。`;
    }
    if (savingsRate >= 10) {
      const tips = overBudgetCategories.slice(0, 2).map((c) => c.label);
      return `貯蓄率${savingsRate.toFixed(1)}%です。あと少しで理想の20%に届きます。${tips.length > 0 ? `${tips.join("・")}の見直しで改善できそうです。` : ""}`;
    }
    if (savingsRate >= 0) {
      const tips = overBudgetCategories.slice(0, 3).map((c) => c.label);
      return `貯蓄率${savingsRate.toFixed(1)}%は改善の余地があります。${tips.length > 0 ? `特に${tips.join("・")}が予算オーバーです。` : "固定費の見直しから始めてみましょう。"}`;
    }
    return `支出が収入を上回っています（月${formatMan(Math.abs(savingsYen))}円の赤字）。固定費の削減を最優先に検討してください。`;
  }, [savingsRate, incomeYen, overBudgetCategories, savingsYen]);

  // Annual simulation
  const annualSavings = savingsYen * 12;
  const after5years = calcFutureValue(Math.max(0, savingsYen), 60, 0.01);
  const after10years = calcFutureValue(Math.max(0, savingsYen), 120, 0.01);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── Hero ─── */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 mb-8 text-white">
        <div className="text-4xl mb-2">📊</div>
        <h1 className="text-2xl font-bold mb-1">家計簿シミュレーター</h1>
        <p className="text-green-100 text-sm">
          月の収入・支出を入力して家計の収支バランスを診断。理想割合と比較して節約ポイントを発見
        </p>
      </div>

      {/* ─── Household Presets ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
        <p className="text-sm font-medium text-gray-700 mb-3">世帯プリセット</p>
        <div className="flex flex-wrap gap-2">
          {HOUSEHOLD_PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => handlePreset(p)}
              className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Input Form ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        {/* 手取り収入 */}
        <div className="mb-5 pb-5 border-b border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💴 手取り収入（月）
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              step={0.5}
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-32 border border-gray-300 rounded-xl px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-gray-600 text-sm">万円</span>
          </div>
        </div>

        {/* Expense Categories */}
        <p className="text-sm font-semibold text-gray-700 mb-3">支出項目（月額）</p>
        <div className="space-y-3">
          {EXPENSE_CATEGORIES.map((cat) => {
            const actualPct =
              incomeYen > 0
                ? (expensesYen[cat.key] / incomeYen) * 100
                : 0;
            const isOver = actualPct > cat.idealPct && incomeYen > 0 && expensesYen[cat.key] > 0;
            return (
              <div key={cat.key} className="flex items-center gap-3">
                <span className="text-xl w-6 shrink-0">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600 truncate">{cat.label}</p>
                  <p className="text-xs text-gray-400">理想: {cat.idealPct}%</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    value={expenses[cat.key]}
                    onChange={(e) => handleExpense(cat.key, e.target.value)}
                    placeholder="0"
                    className={`w-24 border rounded-lg px-2 py-1.5 text-right text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isOver
                        ? "border-red-300 bg-red-50 focus:ring-red-400"
                        : "border-gray-300"
                    }`}
                  />
                  <span className="text-xs text-gray-500">万円</span>
                  {isOver && (
                    <span className="text-xs text-red-500 font-medium whitespace-nowrap">
                      {actualPct.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Results (only when income is set) ─── */}
      {incomeYen > 0 && (
        <>
          {/* ─── Summary Cards ─── */}
          <div className={`border rounded-2xl p-5 mb-6 ${savingsBg}`}>
            <h2 className="text-base font-bold text-gray-800 mb-3">
              月間収支サマリー
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
                <p className="text-xs text-gray-500 mb-0.5">収入</p>
                <p className="text-base font-bold text-gray-800">
                  {formatMan(incomeYen)}円
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
                <p className="text-xs text-gray-500 mb-0.5">支出合計</p>
                <p className="text-base font-bold text-gray-800">
                  {formatMan(totalExpenseYen)}円
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
                <p className="text-xs text-gray-500 mb-0.5">貯蓄額</p>
                <p className={`text-base font-bold ${savingsColor}`}>
                  {savingsYen >= 0 ? "+" : ""}
                  {formatMan(savingsYen)}円
                </p>
              </div>
              <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
                <p className="text-xs text-gray-500 mb-0.5">貯蓄率</p>
                <p className={`text-xl font-extrabold ${savingsColor}`}>
                  {savingsRate.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Diagnosis Comment */}
            {diagnosisComment && (
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">
                {diagnosisComment}
              </p>
            )}
          </div>

          <AdBanner />

          {/* ─── Bar Chart Comparison ─── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              支出割合の比較（実際 vs 理想）
            </h2>
            <div className="space-y-3">
              {EXPENSE_CATEGORIES.map((cat) => {
                const actualPct =
                  incomeYen > 0
                    ? (expensesYen[cat.key] / incomeYen) * 100
                    : 0;
                const isOver = actualPct > cat.idealPct;
                const maxPct = Math.max(actualPct, cat.idealPct, 1);
                return (
                  <div key={cat.key}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">
                        {cat.icon} {cat.label}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          isOver && expensesYen[cat.key] > 0
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {actualPct.toFixed(1)}% / {cat.idealPct}%
                      </span>
                    </div>
                    {/* Actual bar */}
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs text-gray-400 w-8 shrink-0">実際</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOver && expensesYen[cat.key] > 0
                              ? "bg-red-400"
                              : "bg-green-400"
                          }`}
                          style={{ width: `${Math.min((actualPct / maxPct) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    {/* Ideal bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-8 shrink-0">理想</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-300 transition-all duration-300"
                          style={{ width: `${Math.min((cat.idealPct / maxPct) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Annual Simulation ─── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              年間シミュレーション（利率1%複利）
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">年間貯蓄額</p>
                <p className="text-lg font-bold text-emerald-700">
                  {savingsYen >= 0 ? formatMan(annualSavings) : "0"}円
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">5年後の資産</p>
                <p className="text-lg font-bold text-emerald-700">
                  {savingsYen >= 0 ? formatMan(after5years) : "0"}円
                </p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">10年後の資産</p>
                <p className="text-lg font-bold text-emerald-700">
                  {savingsYen >= 0 ? formatMan(after10years) : "0"}円
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              ※ 毎月の貯蓄額が一定で、年利1%の複利運用を仮定した場合の試算です。
            </p>
          </div>

          <AdBanner />

          {/* ─── Savings Advice ─── */}
          {overBudgetCategories.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                節約アドバイス
              </h2>
              <div className="space-y-3">
                {overBudgetCategories.slice(0, 3).map((cat) => {
                  const actualPct =
                    incomeYen > 0
                      ? (expensesYen[cat.key] / incomeYen) * 100
                      : 0;
                  const overBy = actualPct - cat.idealPct;
                  return (
                    <div
                      key={cat.key}
                      className="flex gap-3 p-3 bg-red-50 border border-red-100 rounded-xl"
                    >
                      <span className="text-xl shrink-0">{cat.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 mb-0.5">
                          {cat.label}
                          <span className="ml-2 text-xs text-red-500 font-normal">
                            （理想より{overBy.toFixed(1)}%超過）
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">{cat.adviceTip}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map(({ q, a }) => (
            <details
              key={q}
              className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
              <summary className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-emerald-600 list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 ml-2 shrink-0">＋</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="home-budget" />

      {/* ─── Disclaimer ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-6">
        ※ 本ツールの計算結果は概算です。正確な金額は専門家にご相談ください。
      </p>
    </div>
  );
}
