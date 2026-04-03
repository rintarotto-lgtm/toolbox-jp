"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/* ─── Helpers ─── */

/** 給与所得控除（住民税用・所得税と同じ） */
function employmentDeduction(income: number): number {
  if (income <= 1_625_000) return 550_000;
  if (income <= 1_800_000) return income * 0.4 - 100_000;
  if (income <= 3_600_000) return income * 0.3 + 80_000;
  if (income <= 6_600_000) return income * 0.2 + 440_000;
  if (income <= 8_500_000) return income * 0.1 + 1_100_000;
  return 1_950_000;
}

/** 所得税（参考用） */
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

/** 住民税用生命保険料控除（所得税より低い） */
function lifeInsuranceDed(premium: number): number {
  if (premium <= 0) return 0;
  if (premium <= 12_000) return premium;
  if (premium <= 32_000) return premium * 0.5 + 6_000;
  if (premium <= 56_000) return premium * 0.25 + 14_000;
  return 28_000;
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
          className="w-24 text-right border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-500 w-8">{unit}</span>
      </div>
    </div>
  );
}

/* ─── Component ─── */
export default function ResidentTax() {
  const [income, setIncome] = useState(500); // 万円
  const [dependents, setDependents] = useState(0); // 扶養家族数
  const [hasSpouse, setHasSpouse] = useState(false);
  const [socialInsuranceAuto, setSocialInsuranceAuto] = useState(true);
  const [socialInsuranceManual, setSocialInsuranceManual] = useState(70); // 万円
  const [lifeInsurance, setLifeInsurance] = useState(0); // 万円
  const [earthquake, setEarthquake] = useState(0); // 万円
  const [ideco, setIdeco] = useState(0); // 万円/年
  const [furusato, setFurusato] = useState(0); // ふるさと納税 万円（参考表示用）

  const result = useMemo(() => {
    const incomeYen = income * 10_000;

    // 社会保険料
    const socialInsurance = socialInsuranceAuto
      ? Math.floor(incomeYen * 0.14)
      : socialInsuranceManual * 10_000;

    // 給与所得
    const employmentIncome = Math.max(0, incomeYen - employmentDeduction(incomeYen));

    // 住民税用控除額（所得税より低い）
    const basicDeduction = 430_000; // 住民税基礎控除
    const dependentDeduction = dependents * 330_000; // 住民税一般扶養控除
    const spouseDeduction = hasSpouse ? 330_000 : 0; // 住民税配偶者控除

    // 生命保険料控除（住民税用）
    const lifeYen = lifeInsurance * 10_000;
    const lifeDed = Math.min(70_000, lifeInsuranceDed(lifeYen) * 3); // 最大70,000円

    // 地震保険料控除（住民税用）
    const earthquakeDed = Math.min(25_000, earthquake * 10_000 * 0.5);

    // iDeCo掛金控除
    const idecoYen = ideco * 10_000;

    // 住民税課税所得
    const taxableIncome = Math.max(
      0,
      employmentIncome
        - basicDeduction
        - socialInsurance
        - dependentDeduction
        - spouseDeduction
        - lifeDed
        - earthquakeDed
        - idecoYen
    );

    // 調整控除（所得税と住民税の控除差額調整）
    // 簡易計算: 人的控除差額の5%
    const personalDeductionDiff =
      50_000 // 基礎控除差額(48万→43万)
      + dependents * 50_000
      + (hasSpouse ? 50_000 : 0);
    const adjustmentCredit = Math.min(
      taxableIncome * 0.05,
      Math.min(25_000, personalDeductionDiff) * 0.05 + Math.max(0, personalDeductionDiff - 25_000) * 0.05
    );
    const adjustmentCreditFinal = Math.floor(Math.min(2_500, personalDeductionDiff * 0.05));

    // 所得割
    const incomeLevy = Math.max(0, Math.floor(taxableIncome * 0.1) - adjustmentCreditFinal);
    const incomeLevyCity = Math.floor(incomeLevy * 0.6); // 市区町村6%
    const incomeLevyPref = incomeLevy - incomeLevyCity; // 都道府県4%

    // 均等割（非課税判定: 課税所得>0の場合のみ）
    const isNonTaxable = taxableIncome <= 0;
    const flatLevy = isNonTaxable ? 0 : 5_000;
    const flatLevyCity = isNonTaxable ? 0 : 3_500;
    const flatLevyPref = isNonTaxable ? 0 : 1_500;

    // 住民税合計
    const totalResidentTax = incomeLevy + flatLevy;

    // 所得税（参考用）
    const taxableForIncome = Math.max(
      0,
      employmentIncome - 480_000 - socialInsurance - dependents * 380_000 - (hasSpouse ? 380_000 : 0)
    );
    const rawIncomeTax = Math.floor(incomeTax(taxableForIncome));
    const totalIncomeTax = Math.floor(rawIncomeTax * 1.021);

    // 合計税負担
    const totalTaxBurden = totalResidentTax + totalIncomeTax;
    const effectiveRate = incomeYen > 0 ? (totalTaxBurden / incomeYen) * 100 : 0;

    // ふるさと納税の目安上限（総務省の簡易計算）
    // おおよそ: 住民税所得割 × 20% + 2,000円
    const furusatoLimit = Math.floor(incomeLevy * 0.2 + 2_000);

    return {
      incomeYen,
      taxableIncome,
      incomeLevy,
      incomeLevyCity,
      incomeLevyPref,
      flatLevy,
      flatLevyCity,
      flatLevyPref,
      totalResidentTax,
      isNonTaxable,
      totalIncomeTax,
      totalTaxBurden,
      effectiveRate,
      furusatoLimit,
      furusatoRef: furusato * 10_000,
      socialInsurance,
    };
  }, [
    income, dependents, hasSpouse,
    socialInsuranceAuto, socialInsuranceManual,
    lifeInsurance, earthquake, ideco, furusato,
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── Hero ─── */}
      <div className="bg-gradient-to-br from-blue-600 to-sky-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🏛️</span>
          <h1 className="text-2xl font-bold">住民税計算シミュレーター</h1>
        </div>
        <p className="text-blue-100 text-sm">
          年収と控除を入力して、住民税（所得割＋均等割）を計算します。
        </p>
      </div>

      {/* ─── Inputs ─── */}
      <div className="space-y-4 mb-6">

        {/* 収入・基本情報 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">基本情報（前年の収入）</h2>
          <div className="space-y-3">
            {numInput("前年の給与収入", income, setIncome, "万円", 0, 5000)}

            <div className="flex items-center justify-between gap-3">
              <label className="text-sm text-gray-700">扶養家族数</label>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setDependents(n)}
                    className={`w-9 h-9 rounded-full text-sm font-medium border transition-colors ${
                      dependents === n
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-600 hover:border-blue-400"
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <span className="text-xs text-gray-500">人</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <label className="text-sm text-gray-700">配偶者控除</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setHasSpouse(false)}
                  className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${!hasSpouse ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:border-blue-400"}`}
                >
                  なし
                </button>
                <button
                  onClick={() => setHasSpouse(true)}
                  className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${hasSpouse ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:border-blue-400"}`}
                >
                  あり
                </button>
              </div>
            </div>

            <div className="pt-1 border-t border-gray-100">
              <div className="flex items-center justify-between gap-3 mb-2">
                <label className="text-sm text-gray-700">社会保険料</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSocialInsuranceAuto(true)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${socialInsuranceAuto ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:border-blue-400"}`}
                  >
                    自動（14%）
                  </button>
                  <button
                    onClick={() => setSocialInsuranceAuto(false)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${!socialInsuranceAuto ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 text-gray-600 hover:border-blue-400"}`}
                  >
                    手入力
                  </button>
                </div>
              </div>
              {!socialInsuranceAuto
                ? numInput("社会保険料（年額）", socialInsuranceManual, setSocialInsuranceManual, "万円", 0, 500)
                : <p className="text-xs text-gray-400 text-right">推定: {formatYen(income * 10_000 * 0.14)}/年</p>
              }
            </div>
          </div>
        </div>

        {/* 各種控除 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">各種控除</h2>
          <div className="space-y-3">
            {numInput("生命保険料（年額）", lifeInsurance, setLifeInsurance, "万円", 0, 100)}
            {numInput("地震保険料（年額）", earthquake, setEarthquake, "万円", 0, 5)}
            {numInput("iDeCo掛金（年額）", ideco, setIdeco, "万円", 0, 100)}
          </div>
        </div>

        {/* ふるさと納税（参考） */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1">ふるさと納税（参考）</h2>
          <p className="text-xs text-gray-400 mb-3">計算への影響はありませんが、目安の控除上限と比較できます</p>
          {numInput("ふるさと納税寄付額", furusato, setFurusato, "万円", 0, 100)}
        </div>
      </div>

      {/* ─── Result ─── */}
      <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <div className="text-center mb-6">
          <p className="text-sm text-blue-700 mb-1">年間住民税合計</p>
          {result.isNonTaxable ? (
            <p className="text-3xl font-extrabold text-blue-700">非課税</p>
          ) : (
            <>
              <p className="text-5xl font-extrabold text-blue-700">{formatYen(result.totalResidentTax)}</p>
              <p className="text-sm text-blue-500 mt-1">月額換算 {formatYen(Math.round(result.totalResidentTax / 12))}/月</p>
            </>
          )}
        </div>

        {!result.isNonTaxable && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">所得割（市区町村 6%）</p>
              <p className="text-base font-bold text-gray-800">{formatYen(result.incomeLevyCity)}</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">所得割（都道府県 4%）</p>
              <p className="text-base font-bold text-gray-800">{formatYen(result.incomeLevyPref)}</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">均等割（市区町村）</p>
              <p className="text-base font-bold text-gray-800">{formatYen(result.flatLevyCity)}</p>
            </div>
            <div className="bg-white rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">均等割（都道府県）</p>
              <p className="text-base font-bold text-gray-800">{formatYen(result.flatLevyPref)}</p>
            </div>
          </div>
        )}
      </div>

      <AdBanner />

      {/* ─── 所得税との比較 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">所得税との合計負担</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">住民税</span>
            <span className="font-medium text-blue-700">{formatYen(result.totalResidentTax)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-600">所得税（復興特別税込・概算）</span>
            <span className="font-medium">{formatYen(result.totalIncomeTax)}</span>
          </div>
          <div className="flex justify-between py-2 bg-gray-50 rounded-lg px-2 font-bold">
            <span className="text-gray-800">税金合計</span>
            <span>{formatYen(result.totalTaxBurden)}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-600">実効税率（税金合計÷年収）</span>
            <span className="font-semibold text-blue-700">{result.effectiveRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* ─── ふるさと納税の目安 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">ふるさと納税の目安上限額</h2>
        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-200">
          <span className="text-sm text-gray-700">ふるさと納税 目安上限</span>
          <span className="text-xl font-bold text-orange-700">{formatYen(result.furusatoLimit)}</span>
        </div>
        {result.furusatoRef > 0 && (
          <div className="mt-3 flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-sm text-gray-600">入力した寄付額</span>
            <span className={`text-sm font-semibold ${result.furusatoRef <= result.furusatoLimit ? "text-emerald-600" : "text-red-600"}`}>
              {formatYen(result.furusatoRef)}
              {result.furusatoRef <= result.furusatoLimit ? " ✓ 上限内" : " ✗ 上限超過"}
            </span>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-2">
          ※ワンストップ特例または確定申告が必要です。上限は簡易計算のため実際と異なる場合があります。
        </p>
      </div>

      <AdBanner />
      <RelatedTools currentToolId="resident-tax" />

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          {[
            { q: "住民税はいつから払い始めますか？", a: "前年の所得に対して翌年6月から翌翌年5月に支払います。就職1年目は住民税がかかりません。" },
            { q: "住民税の税率はいくらですか？", a: "所得割は一律10%（市区町村6%+都道府県4%）に均等割5,000円（市区町村3,500円+都道府県1,500円）が加わります。" },
            { q: "住民税が非課税になる条件は何ですか？", a: "前年の合計所得が45万円以下（単身）または35万円×家族人数+31万円以下の場合、住民税所得割が非課税になります。" },
            { q: "ふるさと納税は住民税にどう影響しますか？", a: "ふるさと納税の寄付金のうち2,000円を超える部分が住民税から控除されます（上限あり）。" },
          ].map(({ q, a }) => (
            <details key={q} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <summary className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-blue-600 list-none flex justify-between items-center">
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
        ※ 本ツールの計算結果は概算です。正確な金額は専門家にご相談ください。住民税の税率は自治体により一部異なる場合があります。
      </p>
    </div>
  );
}
