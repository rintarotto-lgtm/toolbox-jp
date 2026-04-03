"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 給与所得控除の計算
function calcEmploymentDeduction(income: number): number {
  if (income <= 1_625_000) return 550_000;
  if (income <= 1_800_000) return Math.floor(income * 0.4) - 100_000;
  if (income <= 3_600_000) return Math.floor(income * 0.3) + 80_000;
  if (income <= 6_600_000) return Math.floor(income * 0.2) + 440_000;
  if (income <= 8_500_000) return Math.floor(income * 0.1) + 1_100_000;
  return 1_950_000;
}

// ─── 所得税率（税額計算用）
function calcIncomeTaxRate(taxableIncome: number): { rate: number; deduction: number } {
  if (taxableIncome <= 1_950_000) return { rate: 0.05, deduction: 0 };
  if (taxableIncome <= 3_300_000) return { rate: 0.1, deduction: 97_500 };
  if (taxableIncome <= 6_950_000) return { rate: 0.2, deduction: 427_500 };
  if (taxableIncome <= 9_000_000) return { rate: 0.23, deduction: 636_000 };
  if (taxableIncome <= 18_000_000) return { rate: 0.33, deduction: 1_536_000 };
  if (taxableIncome <= 40_000_000) return { rate: 0.4, deduction: 2_796_000 };
  return { rate: 0.45, deduction: 4_796_000 };
}

// ─── 扶養控除
function calcDependentDeduction(
  dep16to18: number,
  dep19to22: number,
  dep23to69: number,
  dep70plus: number
): number {
  return (
    dep16to18 * 380_000 +
    dep19to22 * 630_000 +
    dep23to69 * 380_000 +
    dep70plus * 480_000
  );
}

// ─── 配偶者控除
function calcSpouseDeduction(income: number, spouseType: string): number {
  if (spouseType === "none") return 0;
  if (spouseType === "full") {
    // 配偶者控除（本人の合計所得900万以下で38万）
    const employmentIncome = income - calcEmploymentDeduction(income);
    if (employmentIncome <= 9_000_000) return 380_000;
    if (employmentIncome <= 9_500_000) return 260_000;
    if (employmentIncome <= 10_000_000) return 130_000;
    return 0;
  }
  // 配偶者特別控除（簡略化: 最大38万として処理）
  return 380_000;
}

// ─── メイン計算
function calcFurusatoMax(params: {
  income: number;
  spouseType: string;
  dep16to18: number;
  dep19to22: number;
  dep23to69: number;
  dep70plus: number;
  socialInsurance: number;
  mortgageDeduction: number;
  ideco: number;
  medicalExpense: number;
}): { limit: number; taxableIncome: number; taxRate: number; residentialTax: number } {
  const {
    income,
    spouseType,
    dep16to18,
    dep19to22,
    dep23to69,
    dep70plus,
    socialInsurance,
    mortgageDeduction,
    ideco,
    medicalExpense,
  } = params;

  // 1. 給与所得
  const employmentIncome = income - calcEmploymentDeduction(income);

  // 2. 各種控除
  const basicDeduction = 480_000; // 基礎控除（所得2400万以下）
  const socialInsuranceDeduction = socialInsurance;
  const spouseDeduction = calcSpouseDeduction(income, spouseType);
  const dependentDeduction = calcDependentDeduction(dep16to18, dep19to22, dep23to69, dep70plus);
  const idecoDeduction = ideco;
  // 医療費控除: (医療費 - 10万円) または 所得の5%の低い方
  const medicalDeduction = Math.max(0, medicalExpense - Math.min(100_000, employmentIncome * 0.05));

  // 3. 課税所得
  const taxableIncome = Math.max(
    0,
    employmentIncome -
      basicDeduction -
      socialInsuranceDeduction -
      spouseDeduction -
      dependentDeduction -
      idecoDeduction -
      medicalDeduction
  );

  // 4. 所得税率・税額
  const { rate: taxRate } = calcIncomeTaxRate(taxableIncome);

  // 5. 住民税所得割（課税所得 × 10% - 調整控除 - 住宅ローン控除住民税分）
  // 調整控除（簡略化）
  const adjustmentDeduction = Math.min(25_000, (basicDeduction + spouseDeduction + dependentDeduction) * 0.05);
  const mortgageTaxDeduction = Math.min(mortgageDeduction * 0.7, taxableIncome * 0.1); // 住民税分7割上限
  const residentialTax = Math.max(
    0,
    taxableIncome * 0.1 - adjustmentDeduction - mortgageTaxDeduction
  );

  // 6. ふるさと納税上限額
  const denominator = 1 - taxRate * 1.021 - 0.1;
  const limit = denominator > 0
    ? Math.round((residentialTax * 0.2) / denominator) + 2_000
    : 2_000;

  return { limit, taxableIncome, taxRate, residentialTax };
}

// ─── 年収別テーブル用
const TABLE_INCOMES = [
  { label: "300万円", income: 3_000_000 },
  { label: "400万円", income: 4_000_000 },
  { label: "500万円", income: 5_000_000 },
  { label: "600万円", income: 6_000_000 },
  { label: "700万円", income: 7_000_000 },
  { label: "800万円", income: 8_000_000 },
  { label: "1,000万円", income: 10_000_000 },
  { label: "1,500万円", income: 15_000_000 },
];

function tableCalc(income: number, spouseType: string): number {
  const si = Math.round(income * 0.14);
  const r = calcFurusatoMax({
    income,
    spouseType,
    dep16to18: 0,
    dep19to22: 0,
    dep23to69: 0,
    dep70plus: 0,
    socialInsurance: si,
    mortgageDeduction: 0,
    ideco: 0,
    medicalExpense: 0,
  });
  return r.limit;
}

// ─── FAQ
const FAQS = [
  {
    question: "ふるさと納税の上限額の計算方法は？",
    answer:
      "(住民税所得割額 × 20%) ÷ (1 - 所得税率 × 1.021 - 10%) + 2,000円 が控除上限額の目安です。年収・扶養家族数・各種控除によって変わります。",
  },
  {
    question: "ふるさと納税で2,000円を超えて寄付するとどうなりますか？",
    answer:
      "2,000円を超えた部分が控除されます。上限額を超えた分は通常の寄付として扱われ、所得税からの控除のみとなり住民税から全額控除されません。",
  },
  {
    question: "住宅ローン控除がある場合の上限額は？",
    answer:
      "住宅ローン控除が所得税から全額控除されている場合、ふるさと納税の控除が住民税からしか受けられず、実質的な上限額が下がります。",
  },
  {
    question: "ワンストップ特例と確定申告どちらがいいですか？",
    answer:
      "給与所得者で寄付先が5自治体以下なら、手続きが簡単なワンストップ特例が便利です。ただし医療費控除など他の確定申告がある場合はワンストップ特例は使えません。",
  },
];

export default function FurusatoMax() {
  const [income, setIncome] = useState(5_000_000);
  const [spouseType, setSpouseType] = useState("none");
  const [dep16to18, setDep16to18] = useState(0);
  const [dep19to22, setDep19to22] = useState(0);
  const [dep23to69, setDep23to69] = useState(0);
  const [dep70plus, setDep70plus] = useState(0);
  const [autoSI, setAutoSI] = useState(true);
  const [socialInsuranceInput, setSocialInsuranceInput] = useState(70);
  const [hasMortgage, setHasMortgage] = useState(false);
  const [mortgageDeduction, setMortgageDeduction] = useState(20);
  const [ideco, setIdeco] = useState(0);
  const [medicalExpense, setMedicalExpense] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const socialInsurance = useMemo(
    () => (autoSI ? Math.round((income * 0.14) / 10_000) * 10_000 : socialInsuranceInput * 10_000),
    [autoSI, income, socialInsuranceInput]
  );

  const result = useMemo(() => {
    return calcFurusatoMax({
      income,
      spouseType,
      dep16to18,
      dep19to22,
      dep23to69,
      dep70plus,
      socialInsurance,
      mortgageDeduction: hasMortgage ? mortgageDeduction * 10_000 : 0,
      ideco: ideco * 10_000,
      medicalExpense: medicalExpense * 10_000,
    });
  }, [income, spouseType, dep16to18, dep19to22, dep23to69, dep70plus, socialInsurance, hasMortgage, mortgageDeduction, ideco, medicalExpense]);

  const netBenefit = result.limit - 2_000;
  const giftValue = Math.round(netBenefit * 0.3);

  const QUICK_INCOMES = [
    { label: "300万", value: 3_000_000 },
    { label: "400万", value: 4_000_000 },
    { label: "500万", value: 5_000_000 },
    { label: "600万", value: 6_000_000 },
    { label: "700万", value: 7_000_000 },
    { label: "800万", value: 8_000_000 },
    { label: "1000万", value: 10_000_000 },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── Hero ─── */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🎁</span>
          <h1 className="text-2xl font-bold">ふるさと納税上限額計算</h1>
        </div>
        <p className="text-sm opacity-90">
          年収・家族構成・各種控除から控除上限額を正確にシミュレーション。自己負担2,000円で損しない寄付額の目安を計算します。
        </p>
      </div>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3">基本情報</h2>

        {/* 給与収入 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            給与収入（額面）
          </label>
          <div className="flex items-center gap-2 mb-2">
            <input
              type="number"
              min={100}
              max={5000}
              step={10}
              value={Math.round(income / 10_000)}
              onChange={(e) => setIncome(Number(e.target.value) * 10_000)}
              className="w-32 p-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <span className="text-sm text-gray-600">万円</span>
          </div>
          <input
            type="range"
            min={1_000_000}
            max={20_000_000}
            step={100_000}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-orange-500 bg-orange-100"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            {QUICK_INCOMES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setIncome(value)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  income === value
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 配偶者 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">配偶者</label>
          <div className="flex flex-col gap-2">
            {[
              { value: "none", label: "なし" },
              { value: "full", label: "配偶者控除あり（収入103万以下）" },
              { value: "special", label: "配偶者特別控除（収入103〜201万）" },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="spouse"
                  value={opt.value}
                  checked={spouseType === opt.value}
                  onChange={() => setSpouseType(opt.value)}
                  className="accent-orange-500"
                />
                <span className="text-sm text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 扶養家族 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">扶養家族</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { label: "一般扶養（16〜18歳）", value: dep16to18, setter: setDep16to18 },
              { label: "特定扶養（19〜22歳）", value: dep19to22, setter: setDep19to22 },
              { label: "一般扶養（23〜69歳）", value: dep23to69, setter: setDep23to69 },
              { label: "老人扶養（70歳以上）", value: dep70plus, setter: setDep70plus },
            ].map(({ label, value, setter }) => (
              <div key={label} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-600">{label}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setter(Math.max(0, value - 1))}
                    className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 font-bold hover:bg-orange-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-bold text-gray-800">{value}</span>
                  <button
                    onClick={() => setter(value + 1)}
                    className="w-7 h-7 rounded-full bg-gray-200 text-gray-700 font-bold hover:bg-orange-100 transition-colors"
                  >
                    ＋
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-base font-bold text-gray-800 border-b border-gray-100 pb-3 pt-2">控除情報</h2>

        {/* 社会保険料 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">社会保険料（年間）</label>
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSI}
                onChange={(e) => setAutoSI(e.target.checked)}
                className="accent-orange-500"
              />
              給与の14%で自動計算
            </label>
          </div>
          {autoSI ? (
            <div className="p-3 bg-orange-50 rounded-lg text-sm text-orange-700 font-medium">
              {Math.round(socialInsurance / 10_000).toLocaleString("ja-JP")}万円（給与 × 14%）
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                max={500}
                value={socialInsuranceInput}
                onChange={(e) => setSocialInsuranceInput(Number(e.target.value))}
                className="w-28 p-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <span className="text-sm text-gray-600">万円/年</span>
            </div>
          )}
        </div>

        {/* 住宅ローン控除 */}
        <div>
          <label className="flex items-center gap-2 mb-3 cursor-pointer">
            <input
              type="checkbox"
              checked={hasMortgage}
              onChange={(e) => setHasMortgage(e.target.checked)}
              className="accent-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">住宅ローン控除あり</span>
          </label>
          {hasMortgage && (
            <div className="flex items-center gap-2 pl-6">
              <input
                type="number"
                min={0}
                max={100}
                value={mortgageDeduction}
                onChange={(e) => setMortgageDeduction(Number(e.target.value))}
                className="w-28 p-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <span className="text-sm text-gray-600">万円/年</span>
            </div>
          )}
        </div>

        {/* iDeCo・医療費 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">iDeCo掛金（万円/年）</label>
            <input
              type="number"
              min={0}
              max={100}
              value={ideco}
              onChange={(e) => setIdeco(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">医療費控除（万円）</label>
            <input
              type="number"
              min={0}
              max={200}
              value={medicalExpense}
              onChange={(e) => setMedicalExpense(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
      </div>

      {/* ─── 結果カード ─── */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90 mb-1">ふるさと納税 控除上限額</p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">
          ¥{result.limit.toLocaleString("ja-JP")}
        </p>
        <p className="text-xs opacity-75 mb-4">
          ※ 自己負担2,000円含む。実質無料分は¥{netBenefit.toLocaleString("ja-JP")}
        </p>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30">
          <div>
            <p className="text-xs opacity-75">自己負担 実質無料</p>
            <p className="text-xl font-bold">¥{netBenefit.toLocaleString("ja-JP")}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">返礼品目安（30%）</p>
            <p className="text-xl font-bold">¥{giftValue.toLocaleString("ja-JP")}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">適用所得税率</p>
            <p className="text-xl font-bold">{(result.taxRate * 100).toFixed(0)}%</p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── 年収別テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">年収別の目安上限額テーブル</h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">年収</th>
                <th className="text-right py-2 px-2 font-medium">独身</th>
                <th className="text-right py-2 px-2 font-medium">夫婦</th>
                <th className="text-right py-2 px-2 font-medium">夫婦+子1</th>
                <th className="text-right py-2 px-2 font-medium">夫婦+子2</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_INCOMES.map(({ label, income: inc }) => {
                const single = tableCalc(inc, "none");
                const couple = tableCalc(inc, "full");
                const coupleChild1 = Math.max(0, couple - 380_000 * 0.1 * 0.5 - 2_000);
                const coupleChild2 = Math.max(0, couple - 380_000 * 0.2 * 0.5 - 2_000);
                const isActive = inc === income;
                return (
                  <tr
                    key={inc}
                    className={`border-b border-gray-100 cursor-pointer transition-colors ${
                      isActive ? "bg-orange-50 font-semibold" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setIncome(inc)}
                  >
                    <td className="py-2.5 px-2 text-gray-800">{label}</td>
                    <td className="py-2.5 px-2 text-right text-orange-600 font-semibold">
                      {single.toLocaleString("ja-JP")}
                    </td>
                    <td className="py-2.5 px-2 text-right text-gray-700">
                      {couple.toLocaleString("ja-JP")}
                    </td>
                    <td className="py-2.5 px-2 text-right text-gray-700">
                      {coupleChild1.toLocaleString("ja-JP")}
                    </td>
                    <td className="py-2.5 px-2 text-right text-gray-700">
                      {coupleChild2.toLocaleString("ja-JP")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">※ 行をクリックすると年収に反映。単位：円（自己負担2,000円含む）</p>
      </div>

      <AdBanner />

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-orange-600"
              >
                <span>{faq.question}</span>
                <span className="text-gray-400 ml-2 shrink-0">{openFaq === i ? "−" : "＋"}</span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="furusato-max" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは目安計算です。実際の控除上限額は所得・家族構成・各種控除の有無により異なります。
        正確な上限額はふるさと納税ポータルサイトの詳細シミュレーターや税理士にご確認ください。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
