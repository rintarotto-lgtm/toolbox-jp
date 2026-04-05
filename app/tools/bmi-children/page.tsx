"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// 標準体重計算係数（文科省 学校保健統計より概算）
// 標準体重 = a × 身長(cm)^b の形式
// 簡易計算式: 標準体重(kg) = a × 身長(m)^2 (年齢・性別で係数が異なる)
const STD_WEIGHT_COEFF: Record<string, Record<number, number>> = {
  male: {
    6: 16.0, 7: 15.8, 8: 15.7, 9: 15.9, 10: 16.2,
    11: 16.8, 12: 17.4, 13: 18.2, 14: 19.0, 15: 19.5,
    16: 20.0, 17: 20.3, 18: 20.5,
  },
  female: {
    6: 15.5, 7: 15.3, 8: 15.4, 9: 15.8, 10: 16.2,
    11: 17.1, 12: 17.9, 13: 18.3, 14: 18.8, 15: 19.0,
    16: 19.2, 17: 19.4, 18: 19.5,
  },
};

function getObesityLabel(percent: number): { label: string; color: string } {
  if (percent < -20) return { label: "やせすぎ", color: "text-blue-600" };
  if (percent < -10) return { label: "やせ気味", color: "text-blue-500" };
  if (percent <= 10) return { label: "普通", color: "text-green-600" };
  if (percent <= 20) return { label: "軽度肥満", color: "text-yellow-600" };
  if (percent <= 30) return { label: "中等度肥満", color: "text-orange-500" };
  return { label: "高度肥満", color: "text-red-600" };
}

export default function BmiChildrenPage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const result = useMemo(() => {
    const a = parseInt(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!a || !h || !w || a < 6 || a > 18) return null;

    const coeff = STD_WEIGHT_COEFF[gender]?.[a] ?? 17.0;
    const heightM = h / 100;
    const standardWeight = coeff * heightM * heightM;
    const obesityPercent = ((w - standardWeight) / standardWeight) * 100;
    const bmi = w / (heightM * heightM);
    const { label, color } = getObesityLabel(obesityPercent);

    // ローレル指数（小学生向け）
    const rohrer = (w / (h ** 3)) * 10000000;

    return {
      standardWeight: standardWeight.toFixed(1),
      currentWeight: w,
      obesityPercent: obesityPercent.toFixed(1),
      bmi: bmi.toFixed(1),
      rohrer: rohrer.toFixed(0),
      label,
      color,
      weightDiff: (w - standardWeight).toFixed(1),
    };
  }, [age, gender, height, weight]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">子どもBMI・肥満度計算</h1>
      <p className="text-gray-600 mb-6">子どもの年齢・性別・身長・体重から肥満度と標準体重を計算します。</p>
      <AdBanner />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">年齢（6〜18歳）</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="例: 10" min="6" max="18" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
            <div className="flex gap-2">
              <button onClick={() => setGender("male")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${gender === "male" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>男の子</button>
              <button onClick={() => setGender("female")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${gender === "female" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-700"}`}>女の子</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">身長（cm）</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="例: 135" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">体重（kg）</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="例: 32" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">計算結果</h2>
          <div className="bg-white rounded-xl p-5 text-center mb-4">
            <p className="text-sm text-gray-600 mb-1">肥満度</p>
            <p className={`text-4xl font-bold ${result.color}`}>{parseFloat(result.obesityPercent) > 0 ? "+" : ""}{result.obesityPercent}%</p>
            <p className={`text-xl font-bold mt-1 ${result.color}`}>{result.label}</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">標準体重</p>
              <p className="text-xl font-bold text-gray-700">{result.standardWeight}<span className="text-sm">kg</span></p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">体重差</p>
              <p className={`text-xl font-bold ${parseFloat(result.weightDiff) > 0 ? "text-red-500" : "text-blue-500"}`}>
                {parseFloat(result.weightDiff) > 0 ? "+" : ""}{result.weightDiff}<span className="text-sm">kg</span>
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">BMI</p>
              <p className="text-xl font-bold text-gray-700">{result.bmi}</p>
            </div>
          </div>
        </div>
      )}
      <AdBanner />
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">子どもの肥満度判定基準</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">肥満度（%）</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">判定</th>
              </tr>
            </thead>
            <tbody>
              {[
                { range: "-20%未満", label: "やせすぎ", color: "text-blue-600" },
                { range: "-20〜-10%", label: "やせ気味", color: "text-blue-500" },
                { range: "-10〜+10%", label: "普通（標準）", color: "text-green-600" },
                { range: "+10〜+20%", label: "軽度肥満", color: "text-yellow-600" },
                { range: "+20〜+30%", label: "中等度肥満", color: "text-orange-500" },
                { range: "+30%以上", label: "高度肥満", color: "text-red-600" },
              ].map((row) => (
                <tr key={row.range} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-700">{row.range}</td>
                  <td className={`px-4 py-2 font-medium ${row.color}`}>{row.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">子どもの適正体重の計算方法は？</h3><p className="text-sm text-gray-600 mt-1">文科省の標準体重計算式を使います。身長(m)² × 年齢・性別対応係数が標準体重です。肥満度=(実測-標準)÷標準×100%で評価します。</p></div>
          <div><h3 className="font-medium text-gray-900">子どもがやせすぎの場合は？</h3><p className="text-sm text-gray-600 mt-1">成長期の過度なやせは骨密度の低下や貧血、免疫力低下につながります。食事量と栄養バランスを見直し、必要なら小児科への相談をお勧めします。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="bmi-children" />
    </main>
  );
}
