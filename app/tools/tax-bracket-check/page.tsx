"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const BRACKETS = [
  { min: 0, max: 1950000, rate: 0.05, deduction: 0, label: "195万円以下" },
  { min: 1950000, max: 3300000, rate: 0.10, deduction: 97500, label: "195〜330万円" },
  { min: 3300000, max: 6950000, rate: 0.20, deduction: 427500, label: "330〜695万円" },
  { min: 6950000, max: 9000000, rate: 0.23, deduction: 636000, label: "695〜900万円" },
  { min: 9000000, max: 18000000, rate: 0.33, deduction: 1536000, label: "900〜1800万円" },
  { min: 18000000, max: 40000000, rate: 0.40, deduction: 2796000, label: "1800〜4000万円" },
  { min: 40000000, max: Infinity, rate: 0.45, deduction: 4796000, label: "4000万円超" },
];

export default function TaxBracketCheckPage() {
  const [annualIncome, setAnnualIncome] = useState("");
  const [ideco, setIdeco] = useState("0");
  const [furusato, setFurusato] = useState("0");
  const [medical, setMedical] = useState("0");

  const result = useMemo(() => {
    const income = parseFloat(annualIncome) * 10000;
    if (!income || income <= 0) return null;

    // 給与所得控除
    let kyuyo = 0;
    if (income <= 1625000) kyuyo = 550000;
    else if (income <= 1800000) kyuyo = income * 0.4 - 100000;
    else if (income <= 3600000) kyuyo = income * 0.3 + 80000;
    else if (income <= 6600000) kyuyo = income * 0.2 + 440000;
    else if (income <= 8500000) kyuyo = income * 0.1 + 1100000;
    else kyuyo = 1950000;

    const kyuyoShotoku = income - kyuyo;
    const shakai = income * 0.142; // 社会保険料概算
    const kiso = 480000;
    const idecoAmt = parseFloat(ideco) * 10000;
    const furusatoAmt = Math.max(0, parseFloat(furusato) * 10000 - 2000);
    const medicalAmt = Math.max(0, parseFloat(medical) * 10000 - 100000);

    const totalDeductions = shakai + kiso + idecoAmt + furusatoAmt + medicalAmt;
    const taxableIncome = Math.max(0, kyuyoShotoku - totalDeductions);

    const bracket = BRACKETS.find((b) => taxableIncome >= b.min && taxableIncome < b.max) ?? BRACKETS[0];
    const incomeTax = Math.max(0, taxableIncome * bracket.rate - bracket.deduction) * 1.021;
    const residentTax = taxableIncome * 0.10 + 5000;

    // 節税効果
    const taxableWithout = Math.max(0, kyuyoShotoku - shakai - kiso);
    const bracketWithout = BRACKETS.find((b) => taxableWithout >= b.min && taxableWithout < b.max) ?? BRACKETS[0];
    const taxWithout = Math.max(0, taxableWithout * bracketWithout.rate - bracketWithout.deduction) * 1.021 + taxableWithout * 0.10 + 5000;
    const taxWith = incomeTax + residentTax;
    const saving = Math.max(0, taxWithout - taxWith);

    return {
      kyuyoShotoku: Math.round(kyuyoShotoku),
      taxableIncome: Math.round(taxableIncome),
      bracket,
      incomeTax: Math.round(incomeTax),
      residentTax: Math.round(residentTax),
      totalTax: Math.round(incomeTax + residentTax),
      effectiveRate: ((incomeTax + residentTax) / income * 100).toFixed(1),
      saving: Math.round(saving),
    };
  }, [annualIncome, ideco, furusato, medical]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">所得税率チェック・課税所得計算</h1>
      <p className="text-gray-600 mb-6">年収と各種控除から課税所得・所得税率・節税効果を計算します。</p>
      <AdBanner />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年収（万円）</label>
          <div className="flex gap-2 flex-wrap mb-2">
            {[300,400,500,600,700,800,1000,1200].map((v) => (
              <button key={v} onClick={() => setAnnualIncome(String(v))}
                className={`px-3 py-1 rounded text-sm border ${annualIncome === String(v) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300"}`}>
                {v}万
              </button>
            ))}
          </div>
          <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} placeholder="例: 500" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">節税シミュレーション（任意）</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "iDeCo掛金（万円/年）", state: ideco, set: setIdeco, placeholder: "例: 24" },
              { label: "ふるさと納税（万円）", state: furusato, set: setFurusato, placeholder: "例: 5" },
              { label: "医療費（万円/年）", state: medical, set: setMedical, placeholder: "例: 15" },
            ].map(({ label, state, set, placeholder }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input type="number" value={state} onChange={(e) => set(e.target.value)} placeholder={placeholder} className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 mb-4">計算結果</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-white rounded-lg p-4 text-center col-span-2">
                <p className="text-sm text-gray-600">適用税率（限界税率）</p>
                <p className="text-5xl font-bold text-blue-600">{(result.bracket.rate * 100).toFixed(0)}<span className="text-2xl">%</span></p>
                <p className="text-sm text-gray-500">課税所得 {result.bracket.label}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">課税所得</p>
                <p className="text-xl font-bold text-gray-700">¥{formatNum(result.taxableIncome)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">実効税率（所得税+住民税）</p>
                <p className="text-xl font-bold text-gray-700">{result.effectiveRate}%</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">所得税（復興税込）</p>
                <p className="text-xl font-bold text-red-500">¥{formatNum(result.incomeTax)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">住民税</p>
                <p className="text-xl font-bold text-orange-500">¥{formatNum(result.residentTax)}</p>
              </div>
            </div>
            {result.saving > 0 && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                <p className="text-sm text-green-700">控除による節税効果</p>
                <p className="text-3xl font-bold text-green-600">¥{formatNum(result.saving)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <AdBanner />

      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">所得税の税率表（2024年度）</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">課税所得</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">税率</th>
              </tr>
            </thead>
            <tbody>
              {BRACKETS.filter(b => b.max !== Infinity).map((b) => (
                <tr key={b.label} className={`border-t border-gray-100 ${result?.bracket.label === b.label ? "bg-blue-50 font-bold" : ""}`}>
                  <td className="px-4 py-2 text-gray-800">{b.label}</td>
                  <td className="px-4 py-2 text-right text-blue-600">{(b.rate * 100).toFixed(0)}%</td>
                </tr>
              ))}
              <tr className="border-t border-gray-100">
                <td className="px-4 py-2 text-gray-800">4000万円超</td>
                <td className="px-4 py-2 text-right text-blue-600">45%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">所得税率が20%の人がiDeCoで24万円節税するといくら得？</h3><p className="text-sm text-gray-600 mt-1">所得税で約4.8万円、住民税で約2.4万円、合計約7.2万円の節税効果があります。さらに運用益も非課税です。</p></div>
          <div><h3 className="font-medium text-gray-900">住民税と所得税の違いは？</h3><p className="text-sm text-gray-600 mt-1">所得税は国税で累進課税（5〜45%）、住民税は地方税で一律10%です。所得税は当年課税、住民税は前年所得を基に翌年6月から課税されます。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="tax-bracket-check" />
    </main>
  );
}
