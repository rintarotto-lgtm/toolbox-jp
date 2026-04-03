"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

// 給与所得控除額の計算
function calcSalaryDeduction(income: number): number {
  // income: 万円
  if (income <= 162.5) return 55;
  if (income <= 180) return income * 0.4 - 10;
  if (income <= 360) return income * 0.3 + 8;
  if (income <= 660) return income * 0.2 + 44;
  if (income <= 850) return income * 0.1 + 110;
  return 195;
}

// 事業所得控除（青色申告特別控除 65万円を簡易適用）
function calcBusinessDeduction(): number {
  return 65;
}

// 税率テーブル
const TAX_BRACKETS = [
  { limit: 195, rate: 0.05, deduction: 0 },
  { limit: 330, rate: 0.10, deduction: 9.75 },
  { limit: 695, rate: 0.20, deduction: 42.75 },
  { limit: 900, rate: 0.23, deduction: 63.6 },
  { limit: 1800, rate: 0.33, deduction: 153.6 },
  { limit: 4000, rate: 0.40, deduction: 279.6 },
  { limit: Infinity, rate: 0.45, deduction: 479.6 },
];

function calcTax(taxableIncome: number): { tax: number; rate: number; deduction: number } {
  if (taxableIncome <= 0) return { tax: 0, rate: 0, deduction: 0 };
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      const tax = taxableIncome * bracket.rate - bracket.deduction;
      return { tax: Math.max(0, tax), rate: bracket.rate, deduction: bracket.deduction };
    }
  }
  return { tax: 0, rate: 0, deduction: 0 };
}

export default function IncomeTaxCalc() {
  const [incomeType, setIncomeType] = useState<"salary" | "business">("salary");
  const [annualIncome, setAnnualIncome] = useState("500");
  const [dependents, setDependents] = useState("0");
  const [spouseDeduction, setSpouseDeduction] = useState(false);
  const [socialInsuranceAuto, setSocialInsuranceAuto] = useState(true);
  const [socialInsurance, setSocialInsurance] = useState("");
  const [lifeInsurance, setLifeInsurance] = useState("0");
  const [earthquakeInsurance, setEarthquakeInsurance] = useState("0");
  const [ideco, setIdeco] = useState("0");
  const [medical, setMedical] = useState("0");
  const [otherDeduction, setOtherDeduction] = useState("0");

  const result = useMemo(() => {
    const income = parseFloat(annualIncome) || 0;
    if (income <= 0) return null;

    // Step 1: 給与所得 or 事業所得
    const incomeDeduction =
      incomeType === "salary"
        ? calcSalaryDeduction(income)
        : calcBusinessDeduction();
    const earnedIncome = Math.max(0, income - incomeDeduction);

    // 社会保険料
    const socialIns = socialInsuranceAuto
      ? Math.round(income * 0.14 * 10) / 10
      : parseFloat(socialInsurance) || 0;

    // 基礎控除
    const basicDeduction = income <= 2400 ? 48 : income <= 2450 ? 32 : income <= 2500 ? 16 : 0;

    // 扶養控除（一般扶養 38万円×人数）
    const dependentDeduction = parseInt(dependents) * 38;

    // 配偶者控除（38万円）
    const spouseD = spouseDeduction ? 38 : 0;

    // 生命保険料控除（上限12万円）
    const lifeIns = Math.min(parseFloat(lifeInsurance) || 0, 12);

    // 地震保険料控除（上限5万円）
    const earthIns = Math.min(parseFloat(earthquakeInsurance) || 0, 5);

    // iDeCo（全額控除）
    const idecoD = parseFloat(ideco) || 0;

    // 医療費控除（10万円 or 所得の5%を超えた分）
    const medicalD = Math.max(0, (parseFloat(medical) || 0) - Math.min(10, income * 0.05));

    // その他控除
    const otherD = parseFloat(otherDeduction) || 0;

    // Step 2: 課税所得
    const totalDeductions =
      socialIns +
      basicDeduction +
      dependentDeduction +
      spouseD +
      lifeIns +
      earthIns +
      idecoD +
      medicalD +
      otherD;
    const taxableIncome = Math.max(0, earnedIncome - totalDeductions);

    // Step 3: 所得税額（千円未満切り捨て）
    const taxableIncomeFloor = Math.floor(taxableIncome / 10) * 10;
    const { tax, rate, deduction: taxDeduction } = calcTax(taxableIncomeFloor);

    // Step 4: 復興特別所得税
    const taxWithReconstruction = Math.round(tax * 1.021 * 100) / 100;

    // 実効税率（収入に対する割合）
    const effectiveRate = income > 0 ? (taxWithReconstruction / income) * 100 : 0;

    return {
      income,
      incomeDeduction,
      earnedIncome,
      socialIns,
      basicDeduction,
      dependentDeduction,
      spouseD,
      lifeIns,
      earthIns,
      idecoD,
      medicalD,
      otherD,
      totalDeductions,
      taxableIncome: taxableIncomeFloor,
      taxRate: rate,
      taxDeduction,
      tax: Math.round(tax * 10) / 10,
      taxWithReconstruction: Math.round(taxWithReconstruction * 10) / 10,
      effectiveRate: Math.round(effectiveRate * 100) / 100,
    };
  }, [
    incomeType, annualIncome, dependents, spouseDeduction,
    socialInsuranceAuto, socialInsurance, lifeInsurance,
    earthquakeInsurance, ideco, medical, otherDeduction,
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📋</span>
          <h1 className="text-2xl font-bold">所得税計算シミュレーター</h1>
        </div>
        <p className="text-red-100 text-sm">
          年収・各種控除を入力して所得税額を計算します。課税所得・税率の内訳も表示。
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5 mb-8">
        {/* 収入の種類 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">収入の種類</label>
          <div className="flex gap-3">
            {(["salary", "business"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setIncomeType(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  incomeType === t
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t === "salary" ? "給与所得" : "事業所得"}
              </button>
            ))}
          </div>
        </div>

        {/* 年収 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            {incomeType === "salary" ? "年収（給与収入）" : "年間売上"}（万円）
          </label>
          <input
            type="number"
            value={annualIncome}
            onChange={(e) => setAnnualIncome(e.target.value)}
            placeholder="500"
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 扶養家族数 */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">扶養家族数</label>
            <select
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm bg-white"
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}人</option>
              ))}
            </select>
          </div>

          {/* 配偶者控除 */}
          <div className="flex items-center gap-3 mt-auto pb-1">
            <button
              onClick={() => setSpouseDeduction(!spouseDeduction)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                spouseDeduction ? "bg-red-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  spouseDeduction ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <label className="text-sm font-medium text-gray-700">配偶者控除（38万円）</label>
          </div>
        </div>

        {/* 社会保険料 */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">社会保険料（万円/年）</label>
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={socialInsuranceAuto}
                onChange={(e) => setSocialInsuranceAuto(e.target.checked)}
                className="rounded"
              />
              自動計算（年収の約14%）
            </label>
          </div>
          <input
            type="number"
            value={socialInsuranceAuto ? String(Math.round((parseFloat(annualIncome) || 0) * 0.14 * 10) / 10) : socialInsurance}
            onChange={(e) => setSocialInsurance(e.target.value)}
            disabled={socialInsuranceAuto}
            placeholder="70"
            min="0"
            className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm ${
              socialInsuranceAuto ? "bg-gray-50 text-gray-400" : ""
            }`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">生命保険料控除（万円, 上限12）</label>
            <input
              type="number"
              value={lifeInsurance}
              onChange={(e) => setLifeInsurance(e.target.value)}
              placeholder="0"
              min="0"
              max="12"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">地震保険料控除（万円, 上限5）</label>
            <input
              type="number"
              value={earthquakeInsurance}
              onChange={(e) => setEarthquakeInsurance(e.target.value)}
              placeholder="0"
              min="0"
              max="5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">iDeCo掛金（万円/年）</label>
            <input
              type="number"
              value={ideco}
              onChange={(e) => setIdeco(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">医療費控除（万円）</label>
            <input
              type="number"
              value={medical}
              onChange={(e) => setMedical(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">その他控除（万円）</label>
            <input
              type="number"
              value={otherDeduction}
              onChange={(e) => setOtherDeduction(e.target.value)}
              placeholder="0"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
            />
          </div>
        </div>
      </div>

      {/* 結果 */}
      {result && (
        <>
          {/* 主要結果 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <div className="text-xs text-red-600 font-medium mb-1">課税所得</div>
              <div className="text-xl font-bold text-red-700">{result.taxableIncome.toLocaleString()}万円</div>
            </div>
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-center">
              <div className="text-xs text-rose-600 font-medium mb-1">適用税率</div>
              <div className="text-xl font-bold text-rose-700">{(result.taxRate * 100).toFixed(0)}%</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
              <div className="text-xs text-orange-600 font-medium mb-1">所得税額（復興税込）</div>
              <div className="text-xl font-bold text-orange-700">{result.taxWithReconstruction.toLocaleString()}万円</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <div className="text-xs text-amber-600 font-medium mb-1">実効税率</div>
              <div className="text-xl font-bold text-amber-700">{result.effectiveRate}%</div>
            </div>
          </div>

          {/* 計算ステップ */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">計算の内訳</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">
                  {incomeType === "salary" ? "①　給与収入" : "①　年間売上"}
                </span>
                <span className="font-medium">{result.income.toLocaleString()} 万円</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">
                  {incomeType === "salary" ? "　　給与所得控除" : "　　青色申告特別控除"}
                </span>
                <span className="text-red-500">－ {result.incomeDeduction.toLocaleString()} 万円</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200 font-medium">
                <span>
                  {incomeType === "salary" ? "②　給与所得" : "②　事業所得"}
                </span>
                <span>{result.earnedIncome.toLocaleString()} 万円</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">　　社会保険料控除</span>
                <span className="text-red-500">－ {result.socialIns.toLocaleString()} 万円</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">　　基礎控除</span>
                <span className="text-red-500">－ {result.basicDeduction} 万円</span>
              </div>
              {result.dependentDeduction > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">　　扶養控除</span>
                  <span className="text-red-500">－ {result.dependentDeduction} 万円</span>
                </div>
              )}
              {result.spouseD > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">　　配偶者控除</span>
                  <span className="text-red-500">－ {result.spouseD} 万円</span>
                </div>
              )}
              {result.lifeIns > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">　　生命保険料控除</span>
                  <span className="text-red-500">－ {result.lifeIns} 万円</span>
                </div>
              )}
              {result.earthIns > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">　　地震保険料控除</span>
                  <span className="text-red-500">－ {result.earthIns} 万円</span>
                </div>
              )}
              {result.idecoD > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">　　iDeCo控除</span>
                  <span className="text-red-500">－ {result.idecoD} 万円</span>
                </div>
              )}
              {result.medicalD > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">　　医療費控除</span>
                  <span className="text-red-500">－ {result.medicalD.toFixed(1)} 万円</span>
                </div>
              )}
              {result.otherD > 0 && (
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">　　その他控除</span>
                  <span className="text-red-500">－ {result.otherD} 万円</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-200 font-medium">
                <span>③　課税所得</span>
                <span>{result.taxableIncome.toLocaleString()} 万円</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">
                  　　税率 {(result.taxRate * 100).toFixed(0)}% × 課税所得 － {result.taxDeduction} 万円
                </span>
                <span>{result.tax.toLocaleString()} 万円</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">　　復興特別所得税（× 102.1%）</span>
                <span>{(result.taxWithReconstruction - result.tax).toFixed(2)} 万円</span>
              </div>
              <div className="flex justify-between py-3 font-bold text-base bg-red-50 -mx-5 px-5 rounded-b-xl">
                <span className="text-red-800">④　所得税合計（復興税込）</span>
                <span className="text-red-700">{result.taxWithReconstruction.toLocaleString()} 万円</span>
              </div>
            </div>
          </div>

          {/* 税率ブラケット表 */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">所得税率の区分</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-2 pr-4">課税所得</th>
                    <th className="pb-2 pr-4 text-right">税率</th>
                    <th className="pb-2 text-right">控除額</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { range: "195万円以下", rate: "5%", ded: "0円" },
                    { range: "195万円超〜330万円以下", rate: "10%", ded: "97,500円" },
                    { range: "330万円超〜695万円以下", rate: "20%", ded: "427,500円" },
                    { range: "695万円超〜900万円以下", rate: "23%", ded: "636,000円" },
                    { range: "900万円超〜1,800万円以下", rate: "33%", ded: "1,536,000円" },
                    { range: "1,800万円超〜4,000万円以下", rate: "40%", ded: "2,796,000円" },
                    { range: "4,000万円超", rate: "45%", ded: "4,796,000円" },
                  ].map((row, i) => {
                    const isApplied =
                      result.taxRate * 100 ===
                      [5, 10, 20, 23, 33, 40, 45][i];
                    return (
                      <tr
                        key={i}
                        className={`border-b border-gray-100 ${isApplied ? "bg-red-50 font-semibold" : ""}`}
                      >
                        <td className={`py-2 pr-4 ${isApplied ? "text-red-700" : ""}`}>
                          {isApplied && "▶ "}{row.range}
                        </td>
                        <td className={`py-2 pr-4 text-right ${isApplied ? "text-red-700" : ""}`}>
                          {row.rate}
                        </td>
                        <td className={`py-2 text-right ${isApplied ? "text-red-700" : ""}`}>
                          {row.ded}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AdBanner />

      <section className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">このツールについて</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          年収と各種控除を入力して所得税額を計算します。給与所得・事業所得の両方に対応。基礎控除・扶養控除・社会保険料控除・iDeCo・医療費控除など主要な控除を考慮できます。復興特別所得税（2.1%）も加算して表示します。住民税は含まれていません。
        </p>
        <p className="text-xs text-gray-400 mt-2">
          ※ 本ツールはあくまで目安の計算です。実際の税額は確定申告や源泉徴収の内容により異なります。詳細は税理士または税務署にご確認ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "所得税の計算方法を教えてください",
            answer:
              "給与収入から給与所得控除を引いた給与所得に、各種控除を差し引いた課税所得に税率を掛けて計算します。最後に復興特別所得税（×2.1%）を加算します。",
          },
          {
            question: "基礎控除の金額はいくらですか？",
            answer:
              "合計所得2,400万円以下の場合48万円です。2,400万円超〜2,500万円超に応じて段階的に減額されます。",
          },
          {
            question: "扶養控除の種類と金額を教えてください",
            answer:
              "一般扶養38万円、特定扶養（19〜22歳）63万円、老人扶養（70歳以上同居）58万円などがあります。このツールは一般扶養として1人38万円で計算しています。",
          },
          {
            question: "所得税と住民税の違いは何ですか？",
            answer:
              "所得税は国税で5〜45%の超過累進課税、住民税は地方税で一律10%です。このツールは所得税のみを計算します。",
          },
        ]}
      />

      <RelatedTools currentToolId="income-tax-calc" />
    </div>
  );
}
