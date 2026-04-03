"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

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
  if (taxableIncome <= 3_300_000) return taxableIncome * 0.1 - 97_500;
  if (taxableIncome <= 6_950_000) return taxableIncome * 0.2 - 427_500;
  if (taxableIncome <= 9_000_000) return taxableIncome * 0.23 - 636_000;
  if (taxableIncome <= 18_000_000) return taxableIncome * 0.33 - 1_536_000;
  if (taxableIncome <= 40_000_000) return taxableIncome * 0.4 - 2_796_000;
  return taxableIncome * 0.45 - 4_796_000;
}

/** 所得税率テキスト */
function taxRateLabel(taxableIncome: number): string {
  if (taxableIncome <= 0) return "0%";
  if (taxableIncome <= 1_950_000) return "5%";
  if (taxableIncome <= 3_300_000) return "10%";
  if (taxableIncome <= 6_950_000) return "20%";
  if (taxableIncome <= 9_000_000) return "23%";
  if (taxableIncome <= 18_000_000) return "33%";
  if (taxableIncome <= 40_000_000) return "40%";
  return "45%";
}

/** 生命保険料控除額 (新契約ベース, 各区分) */
function lifeInsuranceDeduction(premium: number): number {
  if (premium <= 0) return 0;
  if (premium <= 20_000) return premium;
  if (premium <= 40_000) return premium * 0.5 + 10_000;
  if (premium <= 80_000) return premium * 0.25 + 20_000;
  return 40_000;
}

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

function numInput(
  label: string,
  value: number,
  onChange: (v: number) => void,
  unit: string = "万円",
  min = 0,
  max = 9999
) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="text-sm text-gray-700 flex-1">{label}</label>
      <div className="flex items-center gap-1 shrink-0">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || 0)))}
          className="w-24 text-right border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <span className="text-xs text-gray-500 w-8">{unit}</span>
      </div>
    </div>
  );
}

/* ─── Component ─── */
export default function NenmatsuChosei() {
  // 収入・源泉徴収
  const [income, setIncome] = useState(500); // 万円
  const [monthlyWithholding, setMonthlyWithholding] = useState(15000); // 円/月

  // 扶養
  const [dependentsGeneral, setDependentsGeneral] = useState(0); // 一般扶養
  const [dependentsSpecific, setDependentsSpecific] = useState(0); // 特定扶養19-22歳
  const [dependentsElderly, setDependentsElderly] = useState(0); // 老人扶養70歳以上
  const [dependentsDisabled, setDependentsDisabled] = useState(0); // 障害者扶養

  // 配偶者
  const [spouseType, setSpouseType] = useState<"none" | "deduction" | "special">("none");
  const [spouseIncome, setSpouseIncome] = useState(0); // 万円

  // 各種保険・掛金
  const [lifeGeneral, setLifeGeneral] = useState(0); // 一般生命保険料 万円
  const [lifeCare, setLifeCare] = useState(0); // 介護医療保険料 万円
  const [lifePension, setLifePension] = useState(0); // 個人年金保険料 万円
  const [earthquake, setEarthquake] = useState(0); // 地震保険料 万円
  const [ideco, setIdeco] = useState(0); // iDeCo掛金 万円/年
  const [smallBiz, setSmallBiz] = useState(0); // 小規模企業共済 万円/年

  // 住宅ローン控除
  const [hasHousingLoan, setHasHousingLoan] = useState(false);
  const [housingLoanBalance, setHousingLoanBalance] = useState(0); // 万円

  // 社会保険料
  const [socialInsuranceAuto, setSocialInsuranceAuto] = useState(true);
  const [socialInsuranceManual, setSocialInsuranceManual] = useState(70); // 万円

  const result = useMemo(() => {
    const incomeYen = income * 10_000;

    // 社会保険料
    const socialInsurance = socialInsuranceAuto
      ? Math.floor(incomeYen * 0.14)
      : socialInsuranceManual * 10_000;

    // 給与所得
    const employmentIncome = Math.max(0, incomeYen - employmentDeduction(incomeYen));

    // 各種控除
    const basicDeduction = 480_000;

    // 扶養控除
    const depGenDeduction = dependentsGeneral * 380_000;
    const depSpecDeduction = dependentsSpecific * 630_000;
    const depElderlyDeduction = dependentsElderly * 580_000; // 同居老親等
    const depDisabledDeduction = dependentsDisabled * 270_000;
    const totalDependentDeduction =
      depGenDeduction + depSpecDeduction + depElderlyDeduction + depDisabledDeduction;

    // 配偶者控除
    let spouseDeduction = 0;
    if (spouseType === "deduction") {
      spouseDeduction = 380_000;
    } else if (spouseType === "special") {
      const si = spouseIncome * 10_000;
      if (si <= 1_050_000) spouseDeduction = 380_000;
      else if (si <= 1_100_000) spouseDeduction = 360_000;
      else if (si <= 1_150_000) spouseDeduction = 310_000;
      else if (si <= 1_200_000) spouseDeduction = 260_000;
      else if (si <= 1_250_000) spouseDeduction = 210_000;
      else if (si <= 1_300_000) spouseDeduction = 160_000;
      else if (si <= 1_330_000) spouseDeduction = 80_000;
      else if (si <= 1_410_000) spouseDeduction = 30_000;
      else spouseDeduction = 0;
    }

    // 生命保険料控除
    const lifeGeneralDed = lifeInsuranceDeduction(lifeGeneral * 10_000);
    const lifeCareDed = lifeInsuranceDeduction(lifeCare * 10_000);
    const lifePensionDed = lifeInsuranceDeduction(lifePension * 10_000);
    const totalLifeDed = Math.min(120_000, lifeGeneralDed + lifeCareDed + lifePensionDed);

    // 地震保険料控除
    const earthquakeDed = Math.min(50_000, earthquake * 10_000);

    // iDeCo・小規模企業共済等掛金控除
    const idecoYen = ideco * 10_000;
    const smallBizYen = smallBiz * 10_000;

    // 課税所得
    const taxableIncome = Math.max(
      0,
      employmentIncome
        - basicDeduction
        - socialInsurance
        - totalDependentDeduction
        - spouseDeduction
        - totalLifeDed
        - earthquakeDed
        - idecoYen
        - smallBizYen
    );

    // 所得税計算
    const rawTax = Math.floor(incomeTax(taxableIncome));
    const reconstructionTax = Math.floor(rawTax * 0.021);
    let confirmedTax = rawTax + reconstructionTax;

    // 住宅ローン控除
    const housingLoanDeduction = hasHousingLoan
      ? Math.floor(housingLoanBalance * 10_000 * 0.007)
      : 0;
    confirmedTax = Math.max(0, confirmedTax - housingLoanDeduction);

    // 源泉徴収税合計 (12ヶ月)
    const totalWithholding = monthlyWithholding * 12;

    // 還付/追徴
    const diff = totalWithholding - confirmedTax;

    return {
      incomeYen,
      socialInsurance,
      employmentIncome,
      taxableIncome,
      taxRateText: taxRateLabel(taxableIncome),
      rawTax,
      reconstructionTax,
      housingLoanDeduction,
      confirmedTax,
      totalWithholding,
      diff,
      isRefund: diff >= 0,
      // 控除サマリー
      deductions: {
        basic: basicDeduction,
        socialInsurance,
        dependent: totalDependentDeduction,
        spouse: spouseDeduction,
        lifeInsurance: totalLifeDed,
        earthquake: earthquakeDed,
        ideco: idecoYen,
        smallBiz: smallBizYen,
        housingLoan: housingLoanDeduction,
      },
    };
  }, [
    income, monthlyWithholding,
    dependentsGeneral, dependentsSpecific, dependentsElderly, dependentsDisabled,
    spouseType, spouseIncome,
    lifeGeneral, lifeCare, lifePension, earthquake, ideco, smallBiz,
    hasHousingLoan, housingLoanBalance,
    socialInsuranceAuto, socialInsuranceManual,
  ]);

  const selectClass = "border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── Hero ─── */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📝</span>
          <h1 className="text-2xl font-bold">年末調整シミュレーター</h1>
        </div>
        <p className="text-emerald-100 text-sm">
          還付金・追徴額を事前にシミュレーション。各種控除を入力して確認しましょう。
        </p>
      </div>

      {/* ─── Input Section ─── */}
      <div className="space-y-4 mb-6">

        {/* 基本情報 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">基本情報</h2>
          <div className="space-y-3">
            {numInput("年間給与収入", income, setIncome, "万円", 0, 5000)}
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm text-gray-700 flex-1">毎月の源泉徴収税額</label>
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  min={0}
                  value={monthlyWithholding}
                  onChange={(e) => setMonthlyWithholding(Math.max(0, Number(e.target.value) || 0))}
                  className="w-28 text-right border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-xs text-gray-500 w-5">円</span>
              </div>
            </div>
            <div className="pt-1 border-t border-gray-100">
              <div className="flex items-center justify-between gap-3 mb-2">
                <label className="text-sm text-gray-700">社会保険料</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSocialInsuranceAuto(true)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${socialInsuranceAuto ? "bg-emerald-600 text-white border-emerald-600" : "border-gray-300 text-gray-600 hover:border-emerald-400"}`}
                  >
                    自動計算（年収の14%）
                  </button>
                  <button
                    onClick={() => setSocialInsuranceAuto(false)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${!socialInsuranceAuto ? "bg-emerald-600 text-white border-emerald-600" : "border-gray-300 text-gray-600 hover:border-emerald-400"}`}
                  >
                    手入力
                  </button>
                </div>
              </div>
              {!socialInsuranceAuto && (
                <div className="mt-1">
                  {numInput("社会保険料（年額）", socialInsuranceManual, setSocialInsuranceManual, "万円", 0, 500)}
                </div>
              )}
              {socialInsuranceAuto && (
                <p className="text-xs text-gray-400 text-right">
                  推定: {formatYen(income * 10_000 * 0.14)}/年
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 扶養控除 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">扶養控除</h2>
          <div className="space-y-3">
            {numInput("一般扶養（16〜18歳・23歳以上）", dependentsGeneral, setDependentsGeneral, "人", 0, 10)}
            {numInput("特定扶養（19〜22歳）", dependentsSpecific, setDependentsSpecific, "人", 0, 10)}
            {numInput("老人扶養（70歳以上）", dependentsElderly, setDependentsElderly, "人", 0, 10)}
            {numInput("障害者扶養", dependentsDisabled, setDependentsDisabled, "人", 0, 10)}

            <div className="flex items-center justify-between gap-3 pt-1 border-t border-gray-100">
              <label className="text-sm text-gray-700">配偶者控除</label>
              <select
                value={spouseType}
                onChange={(e) => setSpouseType(e.target.value as "none" | "deduction" | "special")}
                className={selectClass}
              >
                <option value="none">なし</option>
                <option value="deduction">配偶者控除（配偶者の年収103万以下）</option>
                <option value="special">配偶者特別控除（配偶者の年収103〜201万）</option>
              </select>
            </div>
            {spouseType === "special" && (
              <div className="mt-1">
                {numInput("配偶者の年収", spouseIncome, setSpouseIncome, "万円", 103, 201)}
              </div>
            )}
          </div>
        </div>

        {/* 保険料控除 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1">保険料控除</h2>
          <p className="text-xs text-gray-400 mb-4">新契約（2012年以降）の保険料を入力してください</p>
          <div className="space-y-3">
            {numInput("一般生命保険料（年額）", lifeGeneral, setLifeGeneral, "万円", 0, 100)}
            {numInput("介護医療保険料（年額）", lifeCare, setLifeCare, "万円", 0, 100)}
            {numInput("個人年金保険料（年額）", lifePension, setLifePension, "万円", 0, 100)}
            {numInput("地震保険料（年額）", earthquake, setEarthquake, "万円", 0, 5)}
          </div>
        </div>

        {/* 掛金控除 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">掛金控除</h2>
          <div className="space-y-3">
            {numInput("iDeCo掛金（年額）", ideco, setIdeco, "万円", 0, 100)}
            {numInput("小規模企業共済等掛金（年額）", smallBiz, setSmallBiz, "万円", 0, 100)}
          </div>
        </div>

        {/* 住宅ローン控除 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">住宅ローン控除</h2>
          <div className="flex items-center gap-4 mb-3">
            <button
              onClick={() => setHasHousingLoan(false)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${!hasHousingLoan ? "bg-emerald-600 text-white border-emerald-600" : "border-gray-300 text-gray-600 hover:border-emerald-400"}`}
            >
              なし
            </button>
            <button
              onClick={() => setHasHousingLoan(true)}
              className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${hasHousingLoan ? "bg-emerald-600 text-white border-emerald-600" : "border-gray-300 text-gray-600 hover:border-emerald-400"}`}
            >
              あり
            </button>
          </div>
          {hasHousingLoan && (
            <div>
              {numInput("年末ローン残高", housingLoanBalance, setHousingLoanBalance, "万円", 0, 10000)}
              <p className="text-xs text-gray-400 mt-1 text-right">
                控除額: 残高 × 0.7% = {formatYen(housingLoanBalance * 10_000 * 0.007)}/年
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── Result ─── */}
      <div
        className={`rounded-2xl p-6 mb-6 text-center border-2 ${
          result.isRefund
            ? "bg-emerald-50 border-emerald-400"
            : "bg-red-50 border-red-400"
        }`}
      >
        <p className={`text-sm font-semibold mb-1 ${result.isRefund ? "text-emerald-700" : "text-red-700"}`}>
          {result.isRefund ? "還付予定額" : "追徴予定額"}
        </p>
        <p className={`text-5xl font-extrabold mb-2 ${result.isRefund ? "text-emerald-700" : "text-red-700"}`}>
          {formatYen(Math.abs(result.diff))}
        </p>
        <p className="text-xs text-gray-500">
          {result.isRefund
            ? "源泉徴収税を多く払いすぎています。年末調整後に還付される見込みです。"
            : "源泉徴収税が不足しています。年末調整後に追加納税の見込みです。"}
        </p>
      </div>

      <AdBanner />

      {/* ─── 計算内訳 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">計算内訳</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">年間給与収入</span>
            <span className="font-medium">{formatYen(result.incomeYen)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">給与所得</span>
            <span className="font-medium">{formatYen(result.employmentIncome)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">課税所得</span>
            <span className="font-medium">{formatYen(result.taxableIncome)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">適用税率</span>
            <span className="font-medium">{result.taxRateText}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">所得税（復興特別税込）</span>
            <span className="font-medium">
              {formatYen(result.rawTax)} + {formatYen(result.reconstructionTax)}
            </span>
          </div>
          {result.housingLoanDeduction > 0 && (
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600">住宅ローン控除（税額控除）</span>
              <span className="font-medium text-emerald-700">−{formatYen(result.housingLoanDeduction)}</span>
            </div>
          )}
          <div className="flex justify-between py-1.5 border-b border-gray-100 font-semibold">
            <span className="text-gray-800">確定税額</span>
            <span>{formatYen(result.confirmedTax)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100 font-semibold">
            <span className="text-gray-800">源泉徴収税合計（12ヶ月）</span>
            <span>{formatYen(result.totalWithholding)}</span>
          </div>
          <div className={`flex justify-between py-2 rounded-lg px-2 font-bold text-base ${result.isRefund ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            <span>{result.isRefund ? "還付金" : "追徴額"}</span>
            <span>{formatYen(Math.abs(result.diff))}</span>
          </div>
        </div>
      </div>

      {/* ─── 控除サマリー ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">控除一覧</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: "基礎控除", amount: result.deductions.basic },
            { label: "社会保険料控除", amount: result.deductions.socialInsurance },
            { label: "扶養控除", amount: result.deductions.dependent },
            { label: "配偶者控除／配偶者特別控除", amount: result.deductions.spouse },
            { label: "生命保険料控除", amount: result.deductions.lifeInsurance },
            { label: "地震保険料控除", amount: result.deductions.earthquake },
            { label: "iDeCo・小規模企業共済等掛金控除", amount: result.deductions.ideco + result.deductions.smallBiz },
          ]
            .filter((d) => d.amount > 0)
            .map(({ label, amount }) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium text-emerald-700">−{formatYen(amount)}</span>
              </div>
            ))}
          {result.housingLoanDeduction > 0 && (
            <div className="flex justify-between py-1.5 border-b border-gray-100">
              <span className="text-gray-600">住宅ローン控除（税額控除）</span>
              <span className="font-medium text-emerald-700">−{formatYen(result.housingLoanDeduction)}</span>
            </div>
          )}
        </div>
      </div>

      <AdBanner />
      <RelatedTools currentToolId="nenmatsu-chosei" />

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          {[
            { q: "年末調整とは何ですか？", a: "給与所得者の1年間の所得税を正確に精算する手続きです。毎月の給与から天引きされた源泉徴収税の合計と実際の税額との差額を調整します。" },
            { q: "年末調整の還付金の平均はいくらですか？", a: "会社員の平均還付額は年間約7〜8万円程度とされています。ただし扶養家族の変動や各種控除の申告内容によって大きく異なります。" },
            { q: "生命保険料控除の上限はいくらですか？", a: "新契約（2012年以降）は一般・介護・個人年金それぞれ最大4万円、合計最大12万円です。旧契約は各最大5万円、合計最大10万円です。" },
            { q: "住宅ローン控除はいつまで受けられますか？", a: "2022年以降の入居は原則13年間（認定住宅等）または10年間受けられます。控除額は年末ローン残高の0.7%です。" },
          ].map(({ q, a }) => (
            <details key={q} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <summary className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-emerald-600 list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 ml-2 shrink-0">＋</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* ─── Disclaimer ─── */}
      <p className="text-xs text-gray-400 leading-relaxed">
        ※ 実際の年末調整は勤務先が行います。本ツールの計算結果は概算です。正確な金額は専門家にご相談ください。
      </p>
    </div>
  );
}
