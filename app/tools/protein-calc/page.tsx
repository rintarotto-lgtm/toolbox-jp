"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const PROTEIN_FOODS = [
  { name: "鶏胸肉（皮なし）", amount: "100g", protein: 23.3 },
  { name: "鶏もも肉（皮なし）", amount: "100g", protein: 19.0 },
  { name: "豚ロース", amount: "100g", protein: 19.3 },
  { name: "牛もも肉", amount: "100g", protein: 21.3 },
  { name: "サーモン", amount: "100g", protein: 20.1 },
  { name: "マグロ（赤身）", amount: "100g", protein: 26.4 },
  { name: "卵", amount: "1個(50g)", protein: 6.2 },
  { name: "牛乳", amount: "200ml", protein: 6.6 },
  { name: "ギリシャヨーグルト", amount: "100g", protein: 10.0 },
  { name: "木綿豆腐", amount: "100g", protein: 6.6 },
  { name: "納豆", amount: "1パック(45g)", protein: 7.4 },
  { name: "プロテイン（WPC）", amount: "1杯(30g)", protein: 22.0 },
];

export default function ProteinCalcPage() {
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState("moderate");
  const [goal, setGoal] = useState("maintain");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;

    let multiplier = 1.0;
    if (goal === "muscle") multiplier = 1.8;
    else if (goal === "diet") multiplier = 1.4;
    else if (goal === "maintain") multiplier = 1.0;
    else if (goal === "sport") multiplier = 2.0;

    if (activity === "low") multiplier += 0;
    else if (activity === "moderate") multiplier += 0.2;
    else if (activity === "high") multiplier += 0.4;

    const baseProtein = w * multiplier;
    const minProtein = w * 0.8;
    const maxProtein = w * 2.2;
    const calories = baseProtein * 4;

    return {
      recommended: Math.round(baseProtein),
      min: Math.round(minProtein),
      max: Math.round(maxProtein),
      calories: Math.round(calories),
      perMeal: Math.round(baseProtein / 3),
    };
  }, [weight, goal, activity]);

  const activityLabels: Record<string, string> = {
    low: "低活動（デスクワーク中心）",
    moderate: "普通（週2〜3回運動）",
    high: "高活動（週5回以上運動）",
  };
  const goalLabels: Record<string, string> = {
    maintain: "現状維持",
    diet: "ダイエット",
    muscle: "筋肉量アップ",
    sport: "アスリート・競技",
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">タンパク質必要量計算</h1>
      <p className="text-gray-600 mb-6">体重・運動量・目的から1日に必要なタンパク質量を計算します。</p>

      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">体重（kg）</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="例: 65"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as "male" | "female")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="male">男性</option>
              <option value="female">女性</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">活動レベル</label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(activityLabels).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">目的</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(goalLabels).map(([v, l]) => (
              <button
                key={v}
                onClick={() => setGoal(v)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  goal === v
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">計算結果</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">推奨タンパク質</p>
              <p className="text-3xl font-bold text-blue-600">{result.recommended}<span className="text-sm">g/日</span></p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">1食あたりの目安</p>
              <p className="text-3xl font-bold text-green-600">{result.perMeal}<span className="text-sm">g</span></p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">最低ライン</p>
              <p className="text-xl font-bold text-gray-700">{result.min}g</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">推奨</p>
              <p className="text-xl font-bold text-blue-600">{result.recommended}g</p>
            </div>
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">上限目安</p>
              <p className="text-xl font-bold text-gray-700">{result.max}g</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">タンパク質のカロリー換算: 約{result.calories}kcal</p>
        </div>
      )}

      <AdBanner />

      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">主な食品のタンパク質量</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-700">食品</th>
                <th className="text-center px-4 py-2 font-medium text-gray-700">量</th>
                <th className="text-right px-4 py-2 font-medium text-gray-700">タンパク質</th>
              </tr>
            </thead>
            <tbody>
              {PROTEIN_FOODS.map((f, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-800">{f.name}</td>
                  <td className="px-4 py-2 text-center text-gray-600">{f.amount}</td>
                  <td className="px-4 py-2 text-right font-medium text-blue-600">{f.protein}g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">タンパク質の1日の必要量はどれくらい？</h3>
            <p className="text-sm text-gray-600 mt-1">一般的な成人では体重1kgあたり0.8〜1.0gが目安。筋トレをしている方は1.6〜2.2g、ダイエット中は1.2〜1.6gが推奨されます。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">プロテインはいつ飲むのが効果的ですか？</h3>
            <p className="text-sm text-gray-600 mt-1">筋トレ後30分以内（ゴールデンタイム）が最も効果的とされています。朝食時や就寝前の摂取も筋肉合成を促進します。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">食事だけでタンパク質を摂るのは難しいですか？</h3>
            <p className="text-sm text-gray-600 mt-1">筋トレをしている方の場合、体重70kgで126〜154gが必要です。食事だけでは難しいため、プロテインサプリの活用も検討してみましょう。</p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="protein-calc" />
    </main>
  );
}
