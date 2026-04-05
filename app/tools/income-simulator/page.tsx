"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const INCOME_TABLE = [
  { income: 3000000, takeTake: 2380000 },
  { income: 3500000, takeTake: 2770000 },
  { income: 4000000, takeTake: 3150000 },
  { income: 4500000, takeTake: 3510000 },
  { income: 5000000, takeTake: 3870000 },
  { income: 5500000, takeTake: 4200000 },
  { income: 6000000, takeTake: 4510000 },
  { income: 7000000, takeTake: 5140000 },
  { income: 8000000, takeTake: 5730000 },
  { income: 10000000, takeTake: 6850000 },
];

export default function IncomeSimulatorPage() {
  const [annualIncome, setAnnualIncome] = useState("");
  const [dependents, setDependents] = useState("0");
  const [employmentType, setEmploymentType] = useState<"company" | "self">("company");

  const result = useMemo(() => {
    const income = parseFloat(annualIncome.replace(/,/g, "")) * 10000;
    const dep = parseInt(dependents);
    if (!income || income <= 0) return null;

    // 給与所得控除
    let kyuyoKojo = 0;
    if (income <= 1625000) kyuyoKojo = 550000;
    else if (income <= 1800000) kyuyoKojo = income * 0.4 - 100000;
    else if (income <= 3600000) kyuyoKojo = income * 0.3 + 80000;
    else if (income <= 6600000) kyuyoKojo = income * 0.2 + 440000;
    else if (income <= 8500000) kyuyoKojo = income * 0.1 + 1100000;
    else kyuyoKojo = 1950000;

    const kyuyoShotoku = income - kyuyoKojo;

    // 社会保険料（概算）
    const kenpo = income * 0.0499; // 健康保険 約5%
    const kosei = Math.min(income * 0.0915, 660000); // 厚生年金 9.15%（上限あり）
    const koyo = income * 0.006; // 雇用保険
    const socialInsurance = kenpo + kosei + koyo;

    // 基礎控除
    const kiso = income <= 24000000 ? 480000 : 0;
    // 扶養控除
    const fuyo = dep * 380000;
    // 社会保険料控除
    const socialDeduction = socialInsurance;

    const taxableIncome = Math.max(0, kyuyoShotoku - kiso - fuyo - socialDeduction);

    // 所得税
    let incomeTax = 0;
    if (taxableIncome <= 1950000) incomeTax = taxableIncome * 0.05;
    else if (taxableIncome <= 3300000) incomeTax = taxableIncome * 0.10 - 97500;
    else if (taxableIncome <= 6950000) incomeTax = taxableIncome * 0.20 - 427500;
    else if (taxableIncome <= 9000000) incomeTax = taxableIncome * 0.23 - 636000;
    else if (taxableIncome <= 18000000) incomeTax = taxableIncome * 0.33 - 1536000;
    else incomeTax = taxableIncome * 0.40 - 2796000;
    incomeTax *= 1.021; // 復興特別所得税

    // 住民税（約10%）
    const residentTax = taxableIncome * 0.10 + 5000;

    const totalDeduction = socialInsurance + incomeTax + residentTax;
    const takehome = income - totalDeduction;
    const effectiveRate = (totalDeduction / income * 100).toFixed(1);

    return {
      income: Math.round(income),
      takehome: Math.round(takehome),
      socialInsurance: Math.round(socialInsurance),
      kenpo: Math.round(kenpo),
      kosei: Math.round(kosei),
      koyo: Math.round(koyo),
      incomeTax: Math.round(incomeTax),
      residentTax: Math.round(residentTax),
      totalDeduction: Math.round(totalDeduction),
      effectiveRate,
      monthlyTakehome: Math.round(takehome / 12),
    };
  }, [annualIncome, dependents, employmentType]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">年収シミュレーター・手取り計算</h1>
      <p className="text-gray-600 mb-6">年収から手取り・税金・社会保険料の内訳を計算します。</p>
      <AdBanner />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年収（万円）</label>
          <div className="flex items-center gap-2">
            <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} placeholder="例: 500" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <span className="text-gray-600">万円</span>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {[300, 400, 500, 600, 700, 800, 1000].map((v) => (
              <button key={v} onClick={() => setAnnualIncome(String(v))}
                className={`px-3 py-1 rounded text-sm border ${annualIncome === String(v) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300"}`}>
                {v}万
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">扶養親族の人数</label>
          <select value={dependents} onChange={(e) => setDependents(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {[0,1,2,3,4].map((n) => <option key={n} value={n}>{n}人</option>)}
          </select>
        </div>
      </div>
      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">計算結果</h2>
          <div className="bg-white rounded-xl p-5 text-center mb-4">
            <p className="text-sm text-gray-600">年間手取り</p>
            <p className="text-4xl font-bold text-blue-600">¥{formatNum(result.takehome)}</p>
            <p className="text-gray-500 text-sm mt-1">月額換算 ¥{formatNum(result.monthlyTakehome)}</p>
          </div>
          <div className="space-y-2">
            {[
              { label: "年収（額面）", value: result.income, color: "text-gray-800" },
              { label: "┗ 社会保険料合計", value: -result.socialInsurance, color: "text-red-500" },
              { label: "　┗ 健康保険", value: -result.kenpo, color: "text-red-400", small: true },
              { label: "　┗ 厚生年金", value: -result.kosei, color: "text-red-400", small: true },
              { label: "　┗ 雇用保険", value: -result.koyo, color: "text-red-400", small: true },
              { label: "┗ 所得税", value: -result.incomeTax, color: "text-orange-500" },
              { label: "┗ 住民税", value: -result.residentTax, color: "text-orange-500" },
            ].map(({ label, value, color, small }) => (
              <div key={label} className={`flex justify-between items-center bg-white rounded-lg ${small ? "px-3 py-1" : "px-4 py-3"}`}>
                <span className={`${small ? "text-xs" : "text-sm"} text-gray-700`}>{label}</span>
                <span className={`font-bold ${color} ${small ? "text-sm" : ""}`}>{value < 0 ? "-" : ""}¥{formatNum(Math.abs(value))}</span>
              </div>
            ))}
            <div className="flex justify-between items-center bg-blue-600 rounded-lg px-4 py-3">
              <span className="text-white font-bold">手取り</span>
              <span className="text-xl font-bold text-white">¥{formatNum(result.takehome)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">実効税率（税+社保）: {result.effectiveRate}%</p>
        </div>
      )}
      <AdBanner />
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">年収別・手取り早見表</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">年収（万円）</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">手取り（概算）</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">手取り率</th>
              </tr>
            </thead>
            <tbody>
              {INCOME_TABLE.map((row) => (
                <tr key={row.income} className="border-t border-gray-100 hover:bg-blue-50">
                  <td className="px-4 py-2 font-medium text-gray-800">{(row.income / 10000).toFixed(0)}万円</td>
                  <td className="px-4 py-2 text-right text-blue-600 font-medium">{(row.takeTake / 10000).toFixed(0)}万円</td>
                  <td className="px-4 py-2 text-right text-gray-600">{(row.takeTake / row.income * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">年収500万円の手取りはいくら？</h3><p className="text-sm text-gray-600 mt-1">扶養なしで約387万円、月額換算で約32万円が目安です（社会保険料・所得税・住民税を合計した額面の約22%が差し引かれます）。</p></div>
          <div><h3 className="font-medium text-gray-900">手取りを増やす方法はありますか？</h3><p className="text-sm text-gray-600 mt-1">iDeCo・NISA の活用（課税所得を減らす）、ふるさと納税（実質的な節税）、医療費控除・住宅ローン控除の申告などが効果的な手取りアップの方法です。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="income-simulator" />
    </main>
  );
}
