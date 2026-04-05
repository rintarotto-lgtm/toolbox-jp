"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

export default function CalorieDeficitPage() {
  const [weight, setWeight] = useState("");
  const [targetWeight, setTargetWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [activity, setActivity] = useState("moderate");
  const [deficitLevel, setDeficitLevel] = useState("moderate");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    const tw = parseFloat(targetWeight);
    const h = parseFloat(height);
    const a = parseInt(age);
    if (!w || !tw || !h || !a) return null;
    if (tw >= w) return null;

    // BMR (Mifflin-St Jeor)
    const bmr = gender === "male"
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;

    const activityMult: Record<string, number> = {
      sedentary: 1.2, low: 1.375, moderate: 1.55, high: 1.725, very_high: 1.9,
    };
    const tdee = bmr * (activityMult[activity] ?? 1.55);

    const deficitMap: Record<string, { kcal: number; label: string; monthlyKg: number }> = {
      slow: { kcal: 300, label: "緩やか（-300kcal/日）", monthlyKg: 1.25 },
      moderate: { kcal: 500, label: "標準（-500kcal/日）", monthlyKg: 2.1 },
      fast: { kcal: 750, label: "やや速め（-750kcal/日）", monthlyKg: 3.1 },
    };
    const deficit = deficitMap[deficitLevel] ?? deficitMap.moderate;

    const totalFatKg = w - tw;
    const totalCalories = totalFatKg * 7200;
    const daysNeeded = Math.ceil(totalCalories / deficit.kcal);
    const dailyIntake = Math.max(bmr, tdee - deficit.kcal);
    const weeksNeeded = Math.ceil(daysNeeded / 7);
    const monthsNeeded = (daysNeeded / 30.44).toFixed(1);

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      deficit: deficit.kcal,
      deficitLabel: deficit.label,
      dailyIntake: Math.round(dailyIntake),
      totalFatKg,
      daysNeeded,
      weeksNeeded,
      monthsNeeded,
      bmi: (w / ((h / 100) ** 2)).toFixed(1),
      targetBmi: (tw / ((h / 100) ** 2)).toFixed(1),
    };
  }, [weight, targetWeight, height, age, gender, activity, deficitLevel]);

  const activityLabels: Record<string, string> = {
    sedentary: "ほぼ座り仕事（運動なし）",
    low: "軽い運動（週1〜3回）",
    moderate: "中程度の運動（週3〜5回）",
    high: "ハードな運動（週6〜7回）",
    very_high: "アスリートレベル",
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">カロリー赤字・ダイエット計画計算</h1>
      <p className="text-gray-600 mb-6">目標体重達成までの期間と必要なカロリー制限を計算します。</p>
      <AdBanner />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">現在体重（kg）</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="例: 70" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">目標体重（kg）</label>
            <input type="number" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} placeholder="例: 63" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">身長（cm）</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="例: 165" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">年齢</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="例: 30" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
          <div className="flex gap-2">
            <button onClick={() => setGender("male")} className={`flex-1 py-2 rounded-lg font-medium text-sm ${gender === "male" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>男性</button>
            <button onClick={() => setGender("female")} className={`flex-1 py-2 rounded-lg font-medium text-sm ${gender === "female" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-700"}`}>女性</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">活動レベル</label>
          <select value={activity} onChange={(e) => setActivity(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {Object.entries(activityLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ダイエット速度</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: "slow", l: "ゆっくり\n（リバウンド少）" },
              { v: "moderate", l: "標準\n（おすすめ）" },
              { v: "fast", l: "速め\n（継続に注意）" },
            ].map(({ v, l }) => (
              <button key={v} onClick={() => setDeficitLevel(v)}
                className={`py-3 rounded-lg border text-xs font-medium whitespace-pre-line transition-colors ${deficitLevel === v ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">ダイエット計画</h2>
          <div className="bg-white rounded-xl p-5 text-center mb-4">
            <p className="text-sm text-gray-600">目標達成まで</p>
            <p className="text-5xl font-bold text-blue-600">{result.daysNeeded}<span className="text-xl">日</span></p>
            <p className="text-gray-500">（約{result.monthsNeeded}ヶ月 / {result.weeksNeeded}週間）</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">基礎代謝（BMR）</p>
              <p className="text-xl font-bold text-gray-700">{result.bmr}<span className="text-sm">kcal</span></p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">消費カロリー（TDEE）</p>
              <p className="text-xl font-bold text-gray-700">{result.tdee}<span className="text-sm">kcal</span></p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">目標1日摂取カロリー</p>
              <p className="text-xl font-bold text-green-600">{result.dailyIntake}<span className="text-sm">kcal</span></p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">1日のカロリー赤字</p>
              <p className="text-xl font-bold text-red-500">-{result.deficit}<span className="text-sm">kcal</span></p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">現在BMI: {result.bmi} → 目標BMI: {result.targetBmi}</p>
        </div>
      )}
      <AdBanner />
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">1kgやせるには何kcal必要？</h3><p className="text-sm text-gray-600 mt-1">体脂肪1kgは約7,200kcalです。1日500kcalの赤字で約2週間、1日300kcalなら約24日かかります。</p></div>
          <div><h3 className="font-medium text-gray-900">リバウンドしない食事制限のコツは？</h3><p className="text-sm text-gray-600 mt-1">基礎代謝以下に制限しない、タンパク質を十分に摂る（体重×1.5g以上）、急激な制限をしないことが重要です。</p></div>
          <div><h3 className="font-medium text-gray-900">有酸素運動と筋トレどちらが痩せやすい？</h3><p className="text-sm text-gray-600 mt-1">有酸素運動は即効性があり、筋トレは基礎代謝を上げて長期的に痩せやすい体を作ります。両方を組み合わせるのが最も効果的です。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="calorie-deficit" />
    </main>
  );
}
