"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Speed = "slow" | "normal" | "fast" | "jog";

interface SpeedDef {
  label: string;
  kmh: number;
  mets: number;
}

const speeds: Record<Speed, SpeedDef> = {
  slow: { label: "ゆっくり (3km/h)", kmh: 3, mets: 2.8 },
  normal: { label: "普通 (4km/h)", kmh: 4, mets: 3.5 },
  fast: { label: "速歩き (5km/h)", kmh: 5, mets: 4.3 },
  jog: { label: "軽いジョギング (7km/h)", kmh: 7, mets: 7.0 },
};

const stepPresets = [3000, 5000, 8000, 10000, 15000, 20000];

const foodComparisons = [
  { name: "ご飯（茶碗1杯）", kcal: 234 },
  { name: "コーラ（350ml）", kcal: 147 },
  { name: "チョコレート（板1枚）", kcal: 280 },
  { name: "ビール（350ml缶）", kcal: 140 },
  { name: "おにぎり（1個）", kcal: 170 },
  { name: "ショートケーキ（1切れ）", kcal: 310 },
];

function fmt1(n: number): string {
  return n.toLocaleString("ja-JP", { maximumFractionDigits: 1, minimumFractionDigits: 0 });
}

function fmt0(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

export default function StepsCalc() {
  const [steps, setSteps] = useState(10000);
  const [weight, setWeight] = useState(60);
  const [height, setHeight] = useState(165);
  const [speed, setSpeed] = useState<Speed>("normal");

  // 目標体重
  const [targetWeight, setTargetWeight] = useState("");
  const [dailyStepsGoal, setDailyStepsGoal] = useState("10000");

  const calc = useMemo(() => {
    if (steps <= 0 || weight <= 0 || height <= 0) return null;

    const strideM = height * 0.45 / 100; // cm → m
    const distanceKm = (steps * strideM) / 1000;
    const speedDef = speeds[speed];

    // 消費カロリー (METs × 体重kg × 時間h × 1.05)
    const timeH = distanceKm / speedDef.kmh;
    const kcal = speedDef.mets * weight * timeH * 1.05;

    // 脂肪燃焼量 (g)
    const fatG = (kcal * 0.8) / 7.2;

    const timeMin = timeH * 60;

    return { distanceKm, kcal, fatG, timeMin, strideM };
  }, [steps, weight, height, speed]);

  // 目標体重達成プラン
  const goalPlan = useMemo(() => {
    if (!calc || !targetWeight) return null;
    const target = parseFloat(targetWeight);
    if (isNaN(target) || target >= weight || target <= 0) return null;
    const loseKg = weight - target;
    const kcalNeeded = loseKg * 7200; // 1kg ≈ 7200kcal
    if (calc.kcal <= 0) return null;
    const days = kcalNeeded / calc.kcal;
    const goalSteps = parseFloat(dailyStepsGoal) || steps;
    const strideM = height * 0.45 / 100;
    const distKm = (goalSteps * strideM) / 1000;
    const timeH = distKm / speeds[speed].kmh;
    const kcalPerDay = speeds[speed].mets * weight * timeH * 1.05;
    const daysNeeded = kcalPerDay > 0 ? kcalNeeded / kcalPerDay : 0;
    return { loseKg, daysNeeded, weeksNeeded: daysNeeded / 7, monthsNeeded: daysNeeded / 30 };
  }, [calc, targetWeight, weight, height, speed, dailyStepsGoal, steps]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-600 p-6 mb-6 text-white">
        <div className="text-4xl mb-2">👟</div>
        <h1 className="text-2xl font-bold mb-1">歩数・消費カロリー計算</h1>
        <p className="text-teal-100 text-sm">
          歩数から消費カロリー・歩行距離・脂肪燃焼量を計算。ダイエット目標達成プランも算出します。
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6 space-y-6">
        {/* 歩数 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">歩数</label>
            <span className="text-lg font-bold text-teal-600">{fmt0(steps)} 歩</span>
          </div>
          <input
            type="range"
            min={0}
            max={30000}
            step={100}
            value={steps}
            onChange={(e) => setSteps(parseInt(e.target.value))}
            className="w-full accent-teal-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>15,000</span>
            <span>30,000</span>
          </div>
          {/* クイックプリセット */}
          <div className="flex flex-wrap gap-2 mt-3">
            {stepPresets.map((p) => (
              <button
                key={p}
                onClick={() => setSteps(p)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  steps === p
                    ? "bg-teal-500 text-white border-teal-500"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-teal-400"
                }`}
              >
                {p.toLocaleString("ja-JP")}歩
              </button>
            ))}
          </div>
          <div className="mt-3">
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(Math.min(100000, Math.max(0, parseInt(e.target.value) || 0)))}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="歩数を直接入力"
            />
          </div>
        </div>

        {/* 身体情報 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">体重（kg）</label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
              min="20"
              max="200"
              step="0.1"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">身長（cm）</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
              min="100"
              max="250"
              step="1"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">歩行速度</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value as Speed)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            >
              {(Object.keys(speeds) as Speed[]).map((k) => (
                <option key={k} value={k}>{speeds[k].label}</option>
              ))}
            </select>
          </div>
        </div>

        {calc && (
          <>
            {/* 推定歩幅 */}
            <p className="text-xs text-gray-500">
              推定歩幅: {fmt1(calc.strideM * 100)} cm（身長 × 0.45）
            </p>

            {/* 結果メインカード */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
                <p className="text-xs text-teal-700 font-medium mb-1">消費カロリー</p>
                <p className="text-2xl font-bold text-teal-800">{fmt0(calc.kcal)}</p>
                <p className="text-xs text-teal-600">kcal</p>
              </div>
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 text-center">
                <p className="text-xs text-cyan-700 font-medium mb-1">歩行距離</p>
                <p className="text-2xl font-bold text-cyan-800">{fmt1(calc.distanceKm)}</p>
                <p className="text-xs text-cyan-600">km</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <p className="text-xs text-emerald-700 font-medium mb-1">脂肪燃焼量</p>
                <p className="text-2xl font-bold text-emerald-800">{fmt1(calc.fatG)}</p>
                <p className="text-xs text-emerald-600">g</p>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-center">
                <p className="text-xs text-sky-700 font-medium mb-1">所要時間</p>
                <p className="text-2xl font-bold text-sky-800">{fmt0(calc.timeMin)}</p>
                <p className="text-xs text-sky-600">分</p>
              </div>
            </div>

            {/* 食事との比較 */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="text-sm font-medium text-orange-800 mb-3">食事カロリーとの比較</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {foodComparisons.map((food) => {
                  const count = calc.kcal / food.kcal;
                  return (
                    <div key={food.name} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2">
                      <div className="flex-1 text-xs text-gray-600">{food.name}</div>
                      <div className="text-sm font-bold text-orange-700">{fmt1(count)}個分</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 目標達成プラン */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-gray-900">目標体重達成プラン</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">目標体重（kg）</label>
            <input
              type="number"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="例: 55"
              min="20"
              max={weight - 0.1}
              step="0.1"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1日の目標歩数</label>
            <input
              type="number"
              value={dailyStepsGoal}
              onChange={(e) => setDailyStepsGoal(e.target.value)}
              placeholder="例: 10000"
              min="1000"
              step="500"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {goalPlan ? (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
            <p className="text-sm text-teal-700 mb-3">
              <span className="font-bold">{fmt1(goalPlan.loseKg)} kg</span> の減量が目標
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white rounded-lg p-3">
                <p className="text-2xl font-bold text-teal-800">{fmt0(goalPlan.daysNeeded)}</p>
                <p className="text-xs text-teal-600">日</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-2xl font-bold text-teal-800">{fmt1(goalPlan.weeksNeeded)}</p>
                <p className="text-xs text-teal-600">週間</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-2xl font-bold text-teal-800">{fmt1(goalPlan.monthsNeeded)}</p>
                <p className="text-xs text-teal-600">ヶ月</p>
              </div>
            </div>
            <p className="text-xs text-teal-600 mt-2">
              ※歩数のみの効果です。食事制限と組み合わせるとより早く達成できます。
            </p>
          </div>
        ) : targetWeight ? (
          <p className="text-sm text-gray-400">
            現在の体重より低い目標体重を入力してください。
          </p>
        ) : (
          <p className="text-sm text-gray-400">目標体重を入力すると達成までの期間を計算します。</p>
        )}
      </div>

      <AdBanner />

      <section className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">計算式について</h2>
        <ul className="text-sm text-gray-600 leading-relaxed space-y-1">
          <li>・歩幅 = 身長(cm) × 0.45 ÷ 100（メートル）</li>
          <li>・歩行距離 = 歩数 × 歩幅</li>
          <li>・消費カロリー = METs × 体重(kg) × 時間(h) × 1.05</li>
          <li>・脂肪燃焼量 = 消費カロリー × 0.8 ÷ 7.2（g）</li>
          <li>・1kg減量 ≒ 7,200kcal の消費が目安</li>
        </ul>
        <p className="text-xs text-gray-400 mt-3 p-3 bg-gray-50 rounded-lg">
          ※本ツールの計算結果は推定値です。個人の体質・歩行姿勢・地形などにより実際の値は異なります。
          医療・健康管理上の重要な判断には医師・専門家にご相談ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "1万歩歩くと何カロリー消費しますか？",
            answer:
              "体重・歩幅によって異なりますが、体重60kgの人が1万歩歩くと約250〜300kcal消費するとされています。",
          },
          {
            question: "1万歩は何kmですか？",
            answer:
              "平均的な歩幅（約70cm）で1万歩歩くと約7kmになります。身長によって歩幅が変わるため、身長×0.45が歩幅の目安です。",
          },
          {
            question: "1日何歩歩けば健康に良いですか？",
            answer:
              "厚生労働省は成人で1日8,000〜10,000歩を推奨しています。高齢者は6,000〜8,000歩が目安とされています。",
          },
          {
            question: "ウォーキングで脂肪を燃焼するには？",
            answer:
              "有酸素運動を20分以上継続すると脂肪燃焼が促進されます。速歩き（早歩き）でやや息が上がる程度の強度が効果的です。",
          },
        ]}
      />

      <RelatedTools currentToolId="steps-calc" />
    </div>
  );
}
