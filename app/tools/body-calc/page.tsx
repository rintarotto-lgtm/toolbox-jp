"use client";

import { useState, useMemo } from "react";

const ACTIVITY_LEVELS = [
  { label: "ほぼ運動しない", multiplier: 1.2 },
  { label: "軽い運動 週1-3日", multiplier: 1.375 },
  { label: "中程度の運動 週3-5日", multiplier: 1.55 },
  { label: "激しい運動 週6-7日", multiplier: 1.725 },
  { label: "非常に激しい運動+肉体労働", multiplier: 1.9 },
];

function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-orange-600">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
      />
      <div className="flex justify-between text-xs text-gray-400">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  unit,
  sub,
  color = "orange",
}: {
  label: string;
  value: string;
  unit: string;
  sub?: string;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    orange: "from-orange-50 to-amber-50 border-orange-200",
    blue: "from-blue-50 to-sky-50 border-blue-200",
    green: "from-green-50 to-emerald-50 border-green-200",
    red: "from-red-50 to-rose-50 border-red-200",
  };
  const textMap: Record<string, string> = {
    orange: "text-orange-600",
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
  };
  return (
    <div
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-4 text-center`}
    >
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textMap[color]}`}>
        {value}
        <span className="text-sm font-normal ml-0.5">{unit}</span>
      </p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function BodyFatGauge({
  value,
  gender,
}: {
  value: number;
  gender: "male" | "female";
}) {
  const maxVal = 45;
  const pct = Math.min(Math.max(value, 0), maxVal) / maxVal;

  const getRanges = () =>
    gender === "male"
      ? [
          { label: "低", max: 10, color: "#3b82f6" },
          { label: "標準", max: 20, color: "#22c55e" },
          { label: "やや高い", max: 25, color: "#f59e0b" },
          { label: "高い", max: 45, color: "#ef4444" },
        ]
      : [
          { label: "低", max: 18, color: "#3b82f6" },
          { label: "標準", max: 28, color: "#22c55e" },
          { label: "やや高い", max: 35, color: "#f59e0b" },
          { label: "高い", max: 45, color: "#ef4444" },
        ];

  const ranges = getRanges();

  const getLabel = () => {
    for (const r of ranges) {
      if (value <= r.max) return { label: r.label, color: r.color };
    }
    return { label: "高い", color: "#ef4444" };
  };

  const { label: judgeLabel, color: judgeColor } = getLabel();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-gray-700">体脂肪率ゲージ</p>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: judgeColor }}
        >
          {judgeLabel}
        </span>
      </div>
      <div className="relative h-5 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-500">
        <div
          className="absolute top-0 right-0 h-full bg-gray-200 opacity-60"
          style={{ width: `${(1 - pct) * 100}%` }}
        />
        <div
          className="absolute top-0 h-full w-1 bg-white shadow"
          style={{ left: `calc(${pct * 100}% - 2px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>0%</span>
        {ranges.map((r) => (
          <span key={r.label}>
            {r.max}%
          </span>
        ))}
      </div>
      <div className="flex gap-2 flex-wrap">
        {ranges.map((r) => (
          <div key={r.label} className="flex items-center gap-1">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: r.color }}
            />
            <span className="text-xs text-gray-500">
              {r.label} (~{r.max}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "体脂肪率の正常値はどのくらいですか？",
      a: "成人男性の標準は10〜20%、成人女性の標準は18〜28%が目安です。男性25%以上・女性35%以上は肥満、男性10%未満・女性18%未満は低体脂肪とされています。",
    },
    {
      q: "基礎代謝とは何ですか？",
      a: "基礎代謝（BMR）とは、安静状態で生命を維持するために消費される最低限のエネルギーです。呼吸・体温調節・内臓の働きなどに使われ、成人男性で約1,500〜1,800kcal/日、女性で約1,100〜1,400kcal/日が平均的な値です。",
    },
    {
      q: "1日の消費カロリーはどうやって計算しますか？",
      a: "総消費カロリー（TDEE）は「基礎代謝 × 活動レベル係数」で算出します。このツールではMifflin-St Jeor式でBMRを計算し、活動レベル（1.2〜1.9）を掛け合わせています。",
    },
    {
      q: "ダイエットに必要なカロリー赤字はどのくらいですか？",
      a: "脂肪1kgの減量には約7,200kcalの消費が必要です。健康的なペースとして1日500kcalの赤字が推奨されており、週約0.5kgの減量が期待できます。極端な食事制限は筋肉量低下や栄養不足につながるため避けましょう。",
    },
  ];

  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-orange-100 rounded-xl overflow-hidden">
          <button
            className="w-full flex justify-between items-center px-4 py-3 bg-orange-50 hover:bg-orange-100 transition-colors text-left"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="text-sm font-medium text-gray-800">{faq.q}</span>
            <span className="text-orange-500 text-lg font-bold ml-2 shrink-0">
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && (
            <div className="px-4 py-3 bg-white text-sm text-gray-600 leading-relaxed">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function BodyCalcPage() {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [age, setAge] = useState(30);
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(65);
  const [activityIndex, setActivityIndex] = useState(0);
  const [goalWeight, setGoalWeight] = useState(60);

  const calc = useMemo(() => {
    const activityMultiplier = ACTIVITY_LEVELS[activityIndex].multiplier;

    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = bmr * activityMultiplier;

    const bmi = weight / (height / 100) ** 2;
    const bodyFatRate =
      gender === "male"
        ? 1.2 * bmi + 0.23 * age - 16.2
        : 1.2 * bmi + 0.23 * age - 5.4;

    const fatMass = weight * bodyFatRate / 100;
    const leanMass = weight - fatMass;

    const weightDiff = weight - goalWeight;
    const totalCaloriesToBurn = weightDiff * 7200;
    const dailyDeficit = 500;
    const daysToGoal = Math.ceil(Math.abs(totalCaloriesToBurn) / dailyDeficit);
    const weeksToGoal = Math.ceil(daysToGoal / 7);
    const dietCalories =
      tdee - (weightDiff > 0 ? dailyDeficit : -dailyDeficit);

    const activityCalories = tdee - bmr;

    const getBodyFatJudge = () => {
      if (gender === "male") {
        if (bodyFatRate < 10) return "低";
        if (bodyFatRate < 20) return "標準";
        if (bodyFatRate < 25) return "やや高い";
        return "高い";
      } else {
        if (bodyFatRate < 18) return "低";
        if (bodyFatRate < 28) return "標準";
        if (bodyFatRate < 35) return "やや高い";
        return "高い";
      }
    };

    const getBmiLabel = () => {
      if (bmi < 18.5) return "低体重";
      if (bmi < 25) return "標準";
      if (bmi < 30) return "肥満(1度)";
      if (bmi < 35) return "肥満(2度)";
      return "肥満(3度以上)";
    };

    return {
      bmr,
      tdee,
      bmi,
      bodyFatRate,
      fatMass,
      leanMass,
      weightDiff,
      daysToGoal,
      weeksToGoal,
      dietCalories,
      activityCalories,
      activityMultiplier,
      bodyFatJudge: getBodyFatJudge(),
      bmiLabel: getBmiLabel(),
    };
  }, [gender, age, height, weight, activityIndex, goalWeight]);

  const fmt = (n: number, d = 1) => n.toFixed(d);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">
            体脂肪率・基礎代謝計算ツール
          </h1>
          <p className="text-sm text-gray-500">
            身長・体重・年齢・性別から体脂肪率・BMR・TDEEを無料計算
          </p>
        </div>

        {/* Input Panel */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 space-y-5">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
            あなたの情報を入力
          </h2>

          {/* Gender */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-700">性別</p>
            <div className="flex gap-2">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                    gender === g
                      ? "bg-gradient-to-r from-orange-400 to-amber-400 text-white shadow"
                      : "bg-orange-50 text-gray-600 hover:bg-orange-100"
                  }`}
                >
                  {g === "male" ? "男性" : "女性"}
                </button>
              ))}
            </div>
          </div>

          <SliderInput
            label="年齢"
            value={age}
            min={10}
            max={80}
            unit="歳"
            onChange={setAge}
          />
          <SliderInput
            label="身長"
            value={height}
            min={140}
            max={210}
            step={0.5}
            unit="cm"
            onChange={setHeight}
          />
          <SliderInput
            label="体重"
            value={weight}
            min={30}
            max={150}
            step={0.5}
            unit="kg"
            onChange={setWeight}
          />

          {/* Activity Level */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              活動レベル
            </label>
            <select
              value={activityIndex}
              onChange={(e) => setActivityIndex(Number(e.target.value))}
              className="w-full border border-orange-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {ACTIVITY_LEVELS.map((a, i) => (
                <option key={i} value={i}>
                  {a.label} (×{a.multiplier})
                </option>
              ))}
            </select>
          </div>

          <SliderInput
            label="目標体重"
            value={goalWeight}
            min={30}
            max={150}
            step={0.5}
            unit="kg"
            onChange={setGoalWeight}
          />
        </div>

        {/* Hero Result Card */}
        <div className="bg-gradient-to-r from-orange-400 to-amber-400 rounded-2xl p-6 text-white shadow-md">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-orange-100 text-xs mb-1">体脂肪率</p>
              <p className="text-4xl font-bold">{fmt(calc.bodyFatRate)}%</p>
              <span className="inline-block mt-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                {calc.bodyFatJudge}
              </span>
            </div>
            <div className="text-center">
              <p className="text-orange-100 text-xs mb-1">基礎代謝 (BMR)</p>
              <p className="text-4xl font-bold">{Math.round(calc.bmr)}</p>
              <span className="text-orange-100 text-xs">kcal/日</span>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="BMI"
            value={fmt(calc.bmi)}
            unit=""
            sub={calc.bmiLabel}
            color="orange"
          />
          <MetricCard
            label="体脂肪率"
            value={fmt(calc.bodyFatRate)}
            unit="%"
            sub={calc.bodyFatJudge}
            color="red"
          />
          <MetricCard
            label="除脂肪体重 (LBM)"
            value={fmt(calc.leanMass)}
            unit="kg"
            color="blue"
          />
          <MetricCard
            label="脂肪量"
            value={fmt(calc.fatMass)}
            unit="kg"
            color="green"
          />
        </div>

        {/* Body Fat Gauge */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5">
          <BodyFatGauge value={calc.bodyFatRate} gender={gender} />
        </div>

        {/* Calorie Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">カロリー内訳</h2>
          <div className="space-y-3">
            {[
              {
                label: "基礎代謝 (BMR)",
                value: Math.round(calc.bmr),
                pct: calc.bmr / calc.tdee,
                color: "bg-orange-400",
              },
              {
                label: "活動代謝",
                value: Math.round(calc.activityCalories),
                pct: calc.activityCalories / calc.tdee,
                color: "bg-amber-400",
              },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-800">
                    {item.value} kcal
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.pct * 100}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-orange-100">
              <span className="text-sm font-bold text-gray-700">
                総消費カロリー (TDEE)
              </span>
              <span className="text-xl font-bold text-orange-600">
                {Math.round(calc.tdee)} kcal
              </span>
            </div>
          </div>
        </div>

        {/* Diet Calculation Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 space-y-4">
          <h2 className="font-semibold text-gray-700">ダイエット計算</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">目標体重との差</p>
              <p
                className={`text-2xl font-bold ${
                  calc.weightDiff > 0 ? "text-red-500" : calc.weightDiff < 0 ? "text-blue-500" : "text-green-500"
                }`}
              >
                {calc.weightDiff > 0 ? "-" : calc.weightDiff < 0 ? "+" : ""}
                {fmt(Math.abs(calc.weightDiff))}
                <span className="text-sm font-normal">kg</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {calc.weightDiff > 0 ? "減量が必要" : calc.weightDiff < 0 ? "増量が必要" : "目標達成済み"}
              </p>
            </div>
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">推奨摂取カロリー</p>
              <p className="text-2xl font-bold text-orange-600">
                {Math.round(calc.dietCalories)}
                <span className="text-sm font-normal">kcal</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5">1日の目安</p>
            </div>
          </div>
          {calc.weightDiff !== 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-4 text-center space-y-1">
              <p className="text-sm text-gray-600">目標達成まで (500kcal/日赤字で)</p>
              <p className="text-3xl font-bold text-orange-500">
                約 {calc.daysToGoal} 日
              </p>
              <p className="text-sm text-gray-500">
                （約 {calc.weeksToGoal} 週間）
              </p>
            </div>
          )}
        </div>

        {/* Activity Level TDEE Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 space-y-3">
          <h2 className="font-semibold text-gray-700">活動レベル別 TDEE 比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-orange-100">
                  <th className="text-left py-2 text-gray-500 font-medium">活動レベル</th>
                  <th className="text-right py-2 text-gray-500 font-medium">係数</th>
                  <th className="text-right py-2 text-gray-500 font-medium">TDEE</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVITY_LEVELS.map((a, i) => {
                  const rowTdee = Math.round(calc.bmr * a.multiplier);
                  const isActive = i === activityIndex;
                  return (
                    <tr
                      key={i}
                      className={`border-b border-orange-50 ${
                        isActive ? "bg-orange-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <td className={`py-2 ${isActive ? "font-semibold text-orange-700" : "text-gray-600"}`}>
                        {isActive && (
                          <span className="inline-block w-1.5 h-1.5 bg-orange-400 rounded-full mr-1.5 mb-0.5" />
                        )}
                        {a.label}
                      </td>
                      <td className="text-right text-gray-500">×{a.multiplier}</td>
                      <td className={`text-right font-semibold ${isActive ? "text-orange-600" : "text-gray-700"}`}>
                        {rowTdee} kcal
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-5 space-y-3">
          <h2 className="font-semibold text-gray-700">よくある質問</h2>
          <FaqAccordion />
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          ※ 計算値はMifflin-St Jeor式・BMI法による推定値です。医療診断ではありません。
        </p>
      </div>
    </main>
  );
}
