"use client";

import { useState, useMemo } from "react";

// ─── 給与所得控除 ────────────────────────────────────────────────────────────

function getSalaryDeduction(income: number): number {
  if (income <= 1_625_000) return 550_000;
  if (income <= 1_800_000) return income * 0.4 - 100_000;
  if (income <= 3_600_000) return income * 0.3 + 80_000;
  if (income <= 6_600_000) return income * 0.2 + 440_000;
  if (income <= 8_500_000) return income * 0.1 + 1_100_000;
  return 1_950_000;
}

// ─── 所得税率 ────────────────────────────────────────────────────────────────

function getTaxRate(taxableIncome: number): number {
  if (taxableIncome <= 1_950_000) return 0.05;
  if (taxableIncome <= 3_300_000) return 0.1;
  if (taxableIncome <= 6_950_000) return 0.2;
  if (taxableIncome <= 9_000_000) return 0.23;
  if (taxableIncome <= 18_000_000) return 0.33;
  if (taxableIncome <= 40_000_000) return 0.4;
  return 0.45;
}

// ─── 計算本体 ────────────────────────────────────────────────────────────────

interface CalcResult {
  salaryIncome: number;
  socialInsurance: number;
  taxableIncome: number;
  taxRate: number;
  // 通常医療費控除
  netMedical: number;
  threshold: number;
  normalDeduction: number;
  normalRefundIncomeTax: number;
  normalRefundJuminzei: number;
  normalRefundTotal: number;
  // セルフメディケーション
  selfMedDeduction: number;
  selfMedRefundIncomeTax: number;
  selfMedRefundJuminzei: number;
  selfMedRefundTotal: number;
  // おすすめ
  recommended: "normal" | "selfmed" | "none";
}

function calculate(
  incomeYen: number,
  medicalYen: number,
  insuranceYen: number,
  selfMedYen: number
): CalcResult {
  const salaryIncome = incomeYen - getSalaryDeduction(incomeYen);
  const socialInsurance = incomeYen * 0.15;
  const taxableIncome = Math.max(
    0,
    salaryIncome - 480_000 - socialInsurance
  );
  const taxRate = getTaxRate(taxableIncome);

  // 通常の医療費控除
  const netMedical = Math.max(0, medicalYen - insuranceYen);
  const threshold = Math.min(100_000, taxableIncome * 0.05);
  const normalDeduction = Math.max(
    0,
    Math.min(netMedical - threshold, 2_000_000)
  );
  const normalRefundIncomeTax = normalDeduction * taxRate * 1.021;
  const normalRefundJuminzei = normalDeduction * 0.1;
  const normalRefundTotal = normalDeduction * (taxRate * 1.021 + 0.1);

  // セルフメディケーション税制
  const selfMedDeduction = Math.max(0, selfMedYen - 12_000);
  const selfMedRefundIncomeTax = selfMedDeduction * taxRate * 1.021;
  const selfMedRefundJuminzei = selfMedDeduction * 0.1;
  const selfMedRefundTotal = selfMedDeduction * (taxRate * 1.021 + 0.1);

  let recommended: "normal" | "selfmed" | "none" = "none";
  if (normalRefundTotal > 0 || selfMedRefundTotal > 0) {
    recommended =
      normalRefundTotal >= selfMedRefundTotal ? "normal" : "selfmed";
  }

  return {
    salaryIncome,
    socialInsurance,
    taxableIncome,
    taxRate,
    netMedical,
    threshold,
    normalDeduction,
    normalRefundIncomeTax,
    normalRefundJuminzei,
    normalRefundTotal,
    selfMedDeduction,
    selfMedRefundIncomeTax,
    selfMedRefundJuminzei,
    selfMedRefundTotal,
    recommended,
  };
}

// ─── 年収別比較テーブル ───────────────────────────────────────────────────────

const INCOME_PRESETS = [300, 400, 500, 700, 1000]; // 万円

// ─── フォーマット ────────────────────────────────────────────────────────────

function fmt(yen: number): string {
  return Math.round(yen).toLocaleString("ja-JP");
}

function fmtRate(rate: number): string {
  return (rate * 100).toFixed(0) + "%";
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "医療費控除の「10万円の壁」とは何ですか？",
    a: "1年間に支払った医療費が10万円（または総所得金額の5%）を超えた部分が控除対象となります。総所得が200万円未満の方は「総所得×5%」が基準となるため、10万円以下でも控除を受けられる場合があります。",
  },
  {
    q: "医療費控除の対象になる医療費はどんなものですか？",
    a: "診察・治療費、処方薬の購入費、入院費（食事代含む）、歯の治療費、介護サービス費などが対象です。健康診断（疾病発見時は対象）、予防接種、美容整形、眼鏡・コンタクト代（治療目的除く）は原則対象外です。生計を一にする家族の医療費も合算できます。",
  },
  {
    q: "セルフメディケーション税制とは何ですか？",
    a: "市販のスイッチOTC医薬品を年間1万2千円超購入した場合に、超えた金額（上限8万8千円）を控除できる制度です。通常の医療費控除との選択制です。健康診断受診などの健康の維持増進の取り組みが要件となります。",
  },
  {
    q: "医療費控除はどうやって申告しますか？",
    a: "医療費控除は年末調整では手続きできず、確定申告が必要です。翌年の2月16日〜3月15日に確定申告書と医療費控除の明細書を提出します。領収書の提出は不要になりましたが、5年間の保管義務があります。e-Taxを使えばオンラインで申告できます。",
  },
];

// ─── コンポーネント ───────────────────────────────────────────────────────────

export default function MedicalDeductionPage() {
  // 入力状態（万円単位）
  const [incomeMan, setIncomeMan] = useState(500);
  const [medicalMan, setMedicalMan] = useState(15);
  const [familyMerge, setFamilyMerge] = useState(true);
  const [insuranceMan, setInsuranceMan] = useState(0);
  const [selfMedMan, setSelfMedMan] = useState(0);

  // 表示タブ
  const [activeTab, setActiveTab] = useState<"normal" | "selfmed">("normal");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(
    () =>
      calculate(
        incomeMan * 10_000,
        medicalMan * 10_000,
        insuranceMan * 10_000,
        selfMedMan * 10_000
      ),
    [incomeMan, medicalMan, insuranceMan, selfMedMan]
  );

  // タブを推奨に自動切り替え
  const displayTab =
    result.recommended === "none" ? activeTab : result.recommended;

  const heroAmount =
    displayTab === "normal"
      ? result.normalRefundTotal
      : result.selfMedRefundTotal;
  const heroIncomeTax =
    displayTab === "normal"
      ? result.normalRefundIncomeTax
      : result.selfMedRefundIncomeTax;
  const heroJuminzei =
    displayTab === "normal"
      ? result.normalRefundJuminzei
      : result.selfMedRefundJuminzei;

  // 年収別テーブルデータ
  const incomeTableRows = INCOME_PRESETS.map((man) => {
    const r = calculate(
      man * 10_000,
      medicalMan * 10_000,
      insuranceMan * 10_000,
      selfMedMan * 10_000
    );
    return { man, normal: r.normalRefundTotal, selfmed: r.selfMedRefundTotal };
  });

  return (
    <main className="min-h-screen bg-rose-50/40 pb-16">
      {/* ページヘッダー */}
      <div className="bg-gradient-to-br from-rose-600 via-red-600 to-red-700 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            医療費控除シミュレーター
          </h1>
          <p className="mt-2 text-rose-200 text-sm md:text-base">
            年収・医療費を入力するだけで還付額を計算。10万円の壁・セルフメディケーション税制の比較も。2024年確定申告対応。
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8 space-y-6">
        {/* ── 入力カード ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
          <h2 className="text-base font-semibold text-slate-700">条件を入力</h2>

          {/* 年収 */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="font-medium text-slate-600">
                年収（給与所得）
              </label>
              <span className="text-rose-600 font-bold">
                {incomeMan.toLocaleString()}万円
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={2000}
              step={10}
              value={incomeMan}
              onChange={(e) => setIncomeMan(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>100万円</span>
              <span>2,000万円</span>
            </div>
          </div>

          {/* 医療費合計 */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="font-medium text-slate-600">
                1年間の医療費合計
              </label>
              <span className="text-rose-600 font-bold">
                {medicalMan.toLocaleString()}万円
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              step={1}
              value={medicalMan}
              onChange={(e) => setMedicalMan(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>0万円</span>
              <span>200万円</span>
            </div>
          </div>

          {/* 家族の医療費を合算 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">
                家族の医療費を合算
              </p>
              <p className="text-xs text-slate-400">
                生計を一にする家族（配偶者・子など）
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFamilyMerge(!familyMerge)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                familyMerge ? "bg-rose-500" : "bg-slate-300"
              }`}
              aria-checked={familyMerge}
              role="switch"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  familyMerge ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
          {!familyMerge && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              家族の医療費は合算しないで計算します。合算する場合はトグルをオンにしてください。
            </p>
          )}

          {/* 保険金・補填金 */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="font-medium text-slate-600">
                保険金・補填金
              </label>
              <span className="text-rose-600 font-bold">
                {insuranceMan.toLocaleString()}万円
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-1">
              生命保険・健保から受け取った額
            </p>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={insuranceMan}
              onChange={(e) => setInsuranceMan(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>0万円</span>
              <span>100万円</span>
            </div>
          </div>

          {/* セルフメディケーション医薬品購入額 */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <label className="font-medium text-slate-600">
                セルフメディケーション医薬品購入額
              </label>
              <span className="text-rose-600 font-bold">
                {selfMedMan.toLocaleString()}万円
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-1">
              スイッチOTC医薬品の購入費（通常の医療費控除と選択制）
            </p>
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={selfMedMan}
              onChange={(e) => setSelfMedMan(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>0万円</span>
              <span>10万円</span>
            </div>
          </div>
        </section>

        {/* ── 制度選択タブ ── */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("normal")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
              displayTab === "normal"
                ? "bg-rose-600 text-white border-rose-600 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-rose-300"
            }`}
          >
            通常の医療費控除
            {result.recommended === "normal" && (
              <span className="ml-2 text-xs bg-yellow-300 text-yellow-900 rounded-full px-2 py-0.5">
                おすすめ
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("selfmed")}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-all ${
              displayTab === "selfmed"
                ? "bg-rose-600 text-white border-rose-600 shadow-md"
                : "bg-white text-slate-600 border-slate-200 hover:border-rose-300"
            }`}
          >
            セルフメディケーション税制
            {result.recommended === "selfmed" && (
              <span className="ml-2 text-xs bg-yellow-300 text-yellow-900 rounded-full px-2 py-0.5">
                おすすめ
              </span>
            )}
          </button>
        </div>

        {/* ── ヒーローカード ── */}
        <section className="bg-gradient-to-br from-rose-500 via-red-500 to-red-600 rounded-2xl shadow-md text-white p-6">
          <p className="text-sm text-rose-200 font-medium tracking-wide">
            {displayTab === "normal"
              ? "通常の医療費控除"
              : "セルフメディケーション税制"}
            &nbsp;— 還付予定額合計
          </p>
          <p className="text-4xl md:text-5xl font-extrabold mt-1 tabular-nums">
            {heroAmount > 0 ? fmt(Math.round(heroAmount)) : "0"}
            <span className="text-2xl font-semibold ml-1">円</span>
          </p>
          {heroAmount <= 0 && (
            <p className="text-rose-200 text-xs mt-1">
              医療費が控除基準額に達していません
            </p>
          )}

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="bg-white/15 rounded-xl px-4 py-3">
              <p className="text-xs text-rose-200">所得税還付</p>
              <p className="text-xl font-bold tabular-nums">
                {fmt(Math.round(heroIncomeTax))}円
              </p>
            </div>
            <div className="bg-white/15 rounded-xl px-4 py-3">
              <p className="text-xs text-rose-200">住民税減額</p>
              <p className="text-xl font-bold tabular-nums">
                {fmt(Math.round(heroJuminzei))}円
              </p>
            </div>
          </div>
        </section>

        {/* ── 計算内訳テーブル ── */}
        {displayTab === "normal" ? (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-x-auto">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              通常の医療費控除 — 計算内訳
            </h2>
            <table className="w-full text-sm text-slate-700">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 text-slate-500">医療費合計</td>
                  <td className="py-2 text-right font-medium tabular-nums">
                    {fmt(medicalMan * 10_000)}円
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">保険補填額（差引）</td>
                  <td className="py-2 text-right font-medium tabular-nums text-red-500">
                    −{fmt(insuranceMan * 10_000)}円
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">差引医療費</td>
                  <td className="py-2 text-right font-medium tabular-nums">
                    {fmt(result.netMedical)}円
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">
                    控除基準額
                    <span className="ml-1 text-xs text-slate-400">
                      （10万円 or 総所得×5%の低い方）
                    </span>
                  </td>
                  <td className="py-2 text-right font-medium tabular-nums text-red-500">
                    −{fmt(result.threshold)}円
                  </td>
                </tr>
                <tr className="bg-rose-50">
                  <td className="py-2 font-semibold text-rose-700">
                    医療費控除額
                  </td>
                  <td className="py-2 text-right font-bold tabular-nums text-rose-700">
                    {fmt(result.normalDeduction)}円
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">
                    適用税率（所得税）
                  </td>
                  <td className="py-2 text-right font-medium tabular-nums">
                    {fmtRate(result.taxRate)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">
                    所得税還付（復興税込み）
                  </td>
                  <td className="py-2 text-right font-medium tabular-nums text-rose-600">
                    {fmt(Math.round(result.normalRefundIncomeTax))}円
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">住民税減額（10%）</td>
                  <td className="py-2 text-right font-medium tabular-nums text-rose-600">
                    {fmt(Math.round(result.normalRefundJuminzei))}円
                  </td>
                </tr>
                <tr className="border-t-2 border-rose-200">
                  <td className="py-2 font-bold text-slate-800">還付合計</td>
                  <td className="py-2 text-right font-extrabold tabular-nums text-rose-600 text-base">
                    {fmt(Math.round(result.normalRefundTotal))}円
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        ) : (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-x-auto">
            <h2 className="text-sm font-semibold text-slate-700 mb-4">
              セルフメディケーション税制 — 計算内訳
            </h2>
            <table className="w-full text-sm text-slate-700">
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 text-slate-500">
                    OTC医薬品購入額
                  </td>
                  <td className="py-2 text-right font-medium tabular-nums">
                    {fmt(selfMedMan * 10_000)}円
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">
                    差引基準額（1.2万円）
                  </td>
                  <td className="py-2 text-right font-medium tabular-nums text-red-500">
                    −12,000円
                  </td>
                </tr>
                <tr className="bg-rose-50">
                  <td className="py-2 font-semibold text-rose-700">
                    控除額（上限8.8万円）
                  </td>
                  <td className="py-2 text-right font-bold tabular-nums text-rose-700">
                    {fmt(result.selfMedDeduction)}円
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">
                    適用税率（所得税）
                  </td>
                  <td className="py-2 text-right font-medium tabular-nums">
                    {fmtRate(result.taxRate)}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">
                    所得税還付（復興税込み）
                  </td>
                  <td className="py-2 text-right font-medium tabular-nums text-rose-600">
                    {fmt(Math.round(result.selfMedRefundIncomeTax))}円
                  </td>
                </tr>
                <tr>
                  <td className="py-2 text-slate-500">住民税減額（10%）</td>
                  <td className="py-2 text-right font-medium tabular-nums text-rose-600">
                    {fmt(Math.round(result.selfMedRefundJuminzei))}円
                  </td>
                </tr>
                <tr className="border-t-2 border-rose-200">
                  <td className="py-2 font-bold text-slate-800">還付合計</td>
                  <td className="py-2 text-right font-extrabold tabular-nums text-rose-600 text-base">
                    {fmt(Math.round(result.selfMedRefundTotal))}円
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        {/* ── おすすめ比較 ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-4">
            どちらが有利？ — 制度比較
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {/* 通常 */}
            <div
              className={`rounded-xl border-2 p-4 transition-all ${
                result.recommended === "normal"
                  ? "border-green-400 bg-green-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-600">
                  通常の医療費控除
                </p>
                {result.recommended === "normal" && (
                  <span className="text-xs bg-green-500 text-white rounded-full px-2 py-0.5 font-semibold">
                    有利
                  </span>
                )}
              </div>
              <p
                className={`text-xl font-extrabold tabular-nums ${
                  result.recommended === "normal"
                    ? "text-green-700"
                    : "text-slate-700"
                }`}
              >
                {fmt(Math.round(result.normalRefundTotal))}円
              </p>
              <p className="text-xs text-slate-400 mt-1">
                控除額: {fmt(result.normalDeduction)}円
              </p>
            </div>

            {/* セルフメディケーション */}
            <div
              className={`rounded-xl border-2 p-4 transition-all ${
                result.recommended === "selfmed"
                  ? "border-green-400 bg-green-50"
                  : "border-slate-200 bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-slate-600">
                  セルフメディケーション
                </p>
                {result.recommended === "selfmed" && (
                  <span className="text-xs bg-green-500 text-white rounded-full px-2 py-0.5 font-semibold">
                    有利
                  </span>
                )}
              </div>
              <p
                className={`text-xl font-extrabold tabular-nums ${
                  result.recommended === "selfmed"
                    ? "text-green-700"
                    : "text-slate-700"
                }`}
              >
                {fmt(Math.round(result.selfMedRefundTotal))}円
              </p>
              <p className="text-xs text-slate-400 mt-1">
                控除額: {fmt(result.selfMedDeduction)}円
              </p>
            </div>
          </div>
          {result.recommended !== "none" && (
            <p className="mt-3 text-xs text-center text-slate-500">
              入力値では
              <span className="font-semibold text-green-600">
                {result.recommended === "normal"
                  ? "通常の医療費控除"
                  : "セルフメディケーション税制"}
              </span>
              の方が
              <span className="font-semibold text-green-600">
                {fmt(
                  Math.round(
                    Math.abs(
                      result.normalRefundTotal - result.selfMedRefundTotal
                    )
                  )
                )}
                円
              </span>
              有利です
            </p>
          )}
        </section>

        {/* ── 年収別還付額テーブル ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-x-auto">
          <h2 className="text-sm font-semibold text-slate-700 mb-1">
            年収別 還付額比較
          </h2>
          <p className="text-xs text-slate-400 mb-4">
            医療費{medicalMan}万円・保険補填{insuranceMan}万円で固定
          </p>
          <table className="w-full text-xs text-slate-700 min-w-[400px]">
            <thead>
              <tr className="text-slate-500 border-b border-slate-100">
                <th className="text-left pb-2 font-medium">年収</th>
                <th className="text-right pb-2 pr-3 font-medium">
                  通常の医療費控除
                </th>
                <th className="text-right pb-2 font-medium">
                  セルフメディケーション
                </th>
              </tr>
            </thead>
            <tbody>
              {incomeTableRows.map((row, i) => {
                const isCurrentIncome =
                  Math.abs(row.man - incomeMan) < 1;
                const betterNormal = row.normal >= row.selfmed;
                return (
                  <tr
                    key={row.man}
                    className={
                      isCurrentIncome
                        ? "bg-rose-50"
                        : i % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50/60"
                    }
                  >
                    <td className="py-1.5 font-medium text-slate-700">
                      {row.man.toLocaleString()}万円
                      {isCurrentIncome && (
                        <span className="ml-1 text-xs text-rose-500">
                          ◀ 現在
                        </span>
                      )}
                    </td>
                    <td
                      className={`py-1.5 pr-3 text-right tabular-nums font-semibold ${
                        betterNormal ? "text-green-700" : "text-slate-600"
                      }`}
                    >
                      {fmt(Math.round(row.normal))}円
                      {betterNormal && row.normal > 0 && (
                        <span className="ml-1 text-green-500 text-xs">▲</span>
                      )}
                    </td>
                    <td
                      className={`py-1.5 text-right tabular-nums font-semibold ${
                        !betterNormal && row.selfmed > 0
                          ? "text-green-700"
                          : "text-slate-600"
                      }`}
                    >
                      {fmt(Math.round(row.selfmed))}円
                      {!betterNormal && row.selfmed > 0 && (
                        <span className="ml-1 text-green-500 text-xs">▲</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        {/* ── 注意書き ── */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 space-y-1">
          <p className="font-semibold">ご注意</p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>
              実際の金額は確定申告時に異なる場合があります。本シミュレーターは概算です。
            </li>
            <li>
              社会保険料控除は年収の15%として概算しています。実際の控除額により税額が変わります。
            </li>
            <li>
              セルフメディケーション税制の適用には、健康診断受診などの健康の維持増進の取り組みが必要です。
            </li>
            <li>
              正確な控除額・申告方法は税理士または最寄りの税務署にご確認ください。
            </li>
          </ul>
        </div>

        {/* ── FAQ ── */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-4">
            よくある質問
          </h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
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
                    className={`text-rose-400 shrink-0 transition-transform duration-200 ${
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
