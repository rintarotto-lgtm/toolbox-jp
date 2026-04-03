"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Gender = "male" | "female";
type ActivityLevel = 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
type Goal = "lose" | "maintain" | "gain";

interface ActivityOption {
  label: string;
  value: ActivityLevel;
}

const activityOptions: ActivityOption[] = [
  { label: "ほぼ座り仕事（運動なし）", value: 1.2 },
  { label: "軽い運動 1〜3日/週", value: 1.375 },
  { label: "中程度の運動 3〜5日/週", value: 1.55 },
  { label: "激しい運動 6〜7日/週", value: 1.725 },
  { label: "非常に激しい運動（アスリート）", value: 1.9 },
];

function calcBMR(gender: Gender, weight: number, height: number, age: number): number {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

function calcPFC(
  targetCalories: number,
  goal: Goal
): { protein: number; fat: number; carb: number } {
  // Protein ratio varies by goal
  let proteinRatio: number;
  let fatRatio: number;
  if (goal === "lose") {
    proteinRatio = 0.3;
    fatRatio = 0.25;
  } else if (goal === "gain") {
    proteinRatio = 0.3;
    fatRatio = 0.2;
  } else {
    proteinRatio = 0.25;
    fatRatio = 0.25;
  }
  const carbRatio = 1 - proteinRatio - fatRatio;
  return {
    protein: Math.round((targetCalories * proteinRatio) / 4),
    fat: Math.round((targetCalories * fatRatio) / 9),
    carb: Math.round((targetCalories * carbRatio) / 4),
  };
}

export default function CalorieCalc() {
  const [gender, setGender] = useState<Gender>("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>(1.55);
  const [goal, setGoal] = useState<Goal>("lose");
  const [targetWeight, setTargetWeight] = useState("");

  const result = useMemo(() => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!a || !h || !w || a <= 0 || h <= 0 || w <= 0) return null;

    const bmr = calcBMR(gender, w, h, a);
    const tdee = bmr * activity;
    let targetCalories: number;
    if (goal === "lose") targetCalories = tdee - 500;
    else if (goal === "gain") targetCalories = tdee + 300;
    else targetCalories = tdee;

    const pfc = calcPFC(targetCalories, goal);

    let weeksToGoal: number | null = null;
    const tw = parseFloat(targetWeight);
    if (tw && tw > 0) {
      const diff = w - tw;
      if (goal === "lose" && diff > 0) {
        // 500kcal deficit = ~500g/week
        weeksToGoal = Math.round((diff * 7000) / 500);
      } else if (goal === "gain" && diff < 0) {
        // 300kcal surplus = ~300g/week
        weeksToGoal = Math.round((Math.abs(diff) * 7000) / 300);
      }
    }

    return { bmr, tdee, targetCalories, pfc, weeksToGoal };
  }, [gender, age, height, weight, activity, goal, targetWeight]);

  const mealDistribution = useMemo(() => {
    if (!result) return null;
    const t = result.targetCalories;
    return {
      breakfast: Math.round(t * 0.25),
      lunch: Math.round(t * 0.35),
      dinner: Math.round(t * 0.3),
      snack: Math.round(t * 0.1),
    };
  }, [result]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 p-6 mb-6 text-white">
        <div className="text-4xl mb-2">🔥</div>
        <h1 className="text-2xl font-bold mb-1">カロリー計算</h1>
        <p className="text-orange-100 text-sm">
          基礎代謝・消費カロリー・目標摂取カロリーを無料計算
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 mt-6">
        {/* Gender */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">性別</label>
          <div className="flex gap-3">
            {(["male", "female"] as Gender[]).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                  gender === g
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-orange-400"
                }`}
              >
                {g === "male" ? "男性" : "女性"}
              </button>
            ))}
          </div>
        </div>

        {/* Age / Height / Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">年齢（歳）</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="30"
              min="1"
              max="120"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">身長（cm）</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              min="0"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">体重（kg）</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="65"
              min="0"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>
        </div>

        {/* Activity Level */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">活動レベル</label>
          <select
            value={activity}
            onChange={(e) => setActivity(parseFloat(e.target.value) as ActivityLevel)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          >
            {activityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}（×{opt.value}）
              </option>
            ))}
          </select>
        </div>

        {/* Goal */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">目標</label>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                { value: "lose", label: "減量", desc: "TDEE −500kcal" },
                { value: "maintain", label: "維持", desc: "TDEE そのまま" },
                { value: "gain", label: "増量", desc: "TDEE +300kcal" },
              ] as { value: Goal; label: string; desc: string }[]
            ).map((g) => (
              <button
                key={g.value}
                onClick={() => setGoal(g.value)}
                className={`py-3 rounded-lg border text-sm font-medium transition-colors flex flex-col items-center gap-0.5 ${
                  goal === g.value
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-orange-400"
                }`}
              >
                <span>{g.label}</span>
                <span
                  className={`text-xs font-normal ${
                    goal === g.value ? "text-orange-100" : "text-gray-400"
                  }`}
                >
                  {g.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Target weight (optional) */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            目標体重（kg）<span className="text-gray-400 font-normal ml-1">任意</span>
          </label>
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            placeholder="60"
            min="0"
            step="0.1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>

        {/* Results */}
        {result && (
          <>
            <div className="border-t border-gray-100 pt-6">
              <h2 className="font-bold text-gray-800 mb-4">計算結果</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(result.bmr).toLocaleString()}
                    <span className="text-sm font-normal ml-1">kcal</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">基礎代謝量（BMR）</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {Math.round(result.tdee).toLocaleString()}
                    <span className="text-sm font-normal ml-1">kcal</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">総消費カロリー（TDEE）</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(result.targetCalories).toLocaleString()}
                    <span className="text-sm font-normal ml-1">kcal</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    目標摂取カロリー
                    <span className="block text-gray-400">
                      {goal === "lose" ? "（減量）" : goal === "gain" ? "（増量）" : "（維持）"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PFC balance */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                PFCバランス（推奨）
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    label: "たんぱく質",
                    value: result.pfc.protein,
                    unit: "g",
                    color: "text-blue-600",
                    bg: "bg-blue-50 border-blue-200",
                    kcal: result.pfc.protein * 4,
                  },
                  {
                    label: "脂質",
                    value: result.pfc.fat,
                    unit: "g",
                    color: "text-yellow-600",
                    bg: "bg-yellow-50 border-yellow-200",
                    kcal: result.pfc.fat * 9,
                  },
                  {
                    label: "炭水化物",
                    value: result.pfc.carb,
                    unit: "g",
                    color: "text-purple-600",
                    bg: "bg-purple-50 border-purple-200",
                    kcal: result.pfc.carb * 4,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`border rounded-lg p-3 text-center ${item.bg}`}
                  >
                    <div className={`text-xl font-bold ${item.color}`}>
                      {item.value}
                      <span className="text-xs font-normal ml-0.5">{item.unit}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
                    <div className="text-xs text-gray-400">{item.kcal}kcal</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goal period */}
            {result.weeksToGoal !== null && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">目標達成までの期間</h3>
                <p className="text-green-700 font-bold text-lg">
                  約{result.weeksToGoal}週間
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    （約{Math.round(result.weeksToGoal / 4.3)}ヶ月）
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {goal === "lose"
                    ? "1日500kcal不足で週約500gの減量ペース"
                    : "1日300kcal余剰で週約300gの増量ペース"}
                </p>
              </div>
            )}

            {/* Meal distribution */}
            {mealDistribution && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">食事カロリー配分の目安</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: "🌅 朝食", kcal: mealDistribution.breakfast, percent: 25 },
                    { label: "☀️ 昼食", kcal: mealDistribution.lunch, percent: 35 },
                    { label: "🌙 夕食", kcal: mealDistribution.dinner, percent: 30 },
                    { label: "🍎 間食", kcal: mealDistribution.snack, percent: 10 },
                  ].map((meal) => (
                    <div
                      key={meal.label}
                      className="bg-white border border-gray-200 rounded-lg p-3 text-center"
                    >
                      <div className="text-base">{meal.label}</div>
                      <div className="text-lg font-bold text-gray-800 mt-1">
                        {meal.kcal}
                        <span className="text-xs font-normal text-gray-500 ml-0.5">kcal</span>
                      </div>
                      <div className="text-xs text-gray-400">{meal.percent}%</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">カロリー計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          性別・年齢・身長・体重・活動レベルを入力すると、Mifflin-St Jeor
          式に基づいて基礎代謝量（BMR）と総消費カロリー（TDEE）をリアルタイムで計算します。
          目標（減量・維持・増量）に応じた推奨摂取カロリーとPFCバランス、食事配分の目安も表示。
          目標体重を入力すると、目標達成までの期間もわかります。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "基礎代謝（BMR）とは何ですか？",
            answer:
              "基礎代謝（BMR）とは、安静にしている状態でも生命維持のために消費されるエネルギー量です。1日の総消費カロリーの約60〜70%を占め、年齢・性別・体重・身長によって異なります。",
          },
          {
            question: "TDEEとは何ですか？",
            answer:
              "TDEE（Total Daily Energy Expenditure）は1日の総消費エネルギー量です。基礎代謝量に活動レベルを掛けて算出し、摂取カロリーの基準値として使います。",
          },
          {
            question: "ダイエットに必要なカロリー制限はどのくらいですか？",
            answer:
              "1週間で体重500gを減らすにはTDEEから1日500kcalのカロリー不足が目安です。極端な制限は筋肉量低下を招くため、BMRを下回らないよう注意してください。",
          },
          {
            question: "筋肉をつけながら痩せるカロリーはどうすればよいですか？",
            answer:
              "TDEEに近い維持カロリーで、体重1kgあたり1.6〜2.2gのたんぱく質を摂取しながら筋力トレーニングを行うのが有効です。カロリー超過は250〜500kcal程度に抑えるのが理想的です。",
          },
        ]}
      />

      <RelatedTools currentToolId="calorie-calc" />

      <p className="text-xs text-gray-400 mt-6 text-center">
        ※ 本ツールの計算結果は目安です。医療・栄養指導の代替ではありません。健康上の問題がある場合は医師・管理栄養士にご相談ください。
      </p>
    </div>
  );
}
