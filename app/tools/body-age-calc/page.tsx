"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const QUESTIONS = [
  { id: "exercise", label: "週の運動頻度", options: [
    { label: "ほぼ毎日（5〜7回）", score: -4 },
    { label: "週3〜4回", score: -2 },
    { label: "週1〜2回", score: 0 },
    { label: "ほとんどしない", score: 4 },
  ]},
  { id: "sleep", label: "1日の平均睡眠時間", options: [
    { label: "7〜8時間", score: -3 },
    { label: "6〜7時間", score: 0 },
    { label: "5〜6時間", score: 2 },
    { label: "5時間未満", score: 5 },
  ]},
  { id: "diet", label: "食事バランス", options: [
    { label: "野菜・タンパク質・炭水化物をバランスよく", score: -3 },
    { label: "まあまあバランスが取れている", score: 0 },
    { label: "偏りがある（脂質・糖質多め）", score: 3 },
    { label: "かなり乱れている（外食・コンビニ中心）", score: 5 },
  ]},
  { id: "smoking", label: "喫煙習慣", options: [
    { label: "非喫煙者（吸わない）", score: -2 },
    { label: "禁煙した（過去に吸っていた）", score: 0 },
    { label: "軽い喫煙（1〜10本/日）", score: 3 },
    { label: "ヘビースモーカー（11本以上/日）", score: 6 },
  ]},
  { id: "drinking", label: "飲酒習慣", options: [
    { label: "飲まない・ほとんど飲まない", score: -1 },
    { label: "週1〜2回程度", score: 0 },
    { label: "ほぼ毎日（適量）", score: 2 },
    { label: "毎日多量に飲む", score: 5 },
  ]},
  { id: "stress", label: "日常のストレスレベル", options: [
    { label: "低い（よく眠れる・リラックスできる）", score: -2 },
    { label: "普通", score: 0 },
    { label: "高め（疲れが取れない）", score: 3 },
    { label: "非常に高い（慢性的なストレス）", score: 5 },
  ]},
];

export default function BodyAgeCalcPage() {
  const [age, setAge] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const result = useMemo(() => {
    const realAge = parseInt(age);
    if (!realAge || Object.keys(answers).length < QUESTIONS.length) return null;
    const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const bodyAge = realAge + totalScore;
    const diff = bodyAge - realAge;
    let comment = "";
    let color = "";
    if (diff <= -5) { comment = "素晴らしい！実年齢より大幅に若い体内年齢です。今の生活習慣を続けましょう。"; color = "green"; }
    else if (diff <= -1) { comment = "良好！実年齢より若い体内年齢です。今の習慣を維持しましょう。"; color = "blue"; }
    else if (diff <= 3) { comment = "普通。生活習慣を少し改善するとさらに若い体内年齢になれます。"; color = "yellow"; }
    else { comment = "要改善。運動・食事・睡眠の見直しで体内年齢を若くできます。"; color = "red"; }
    return { bodyAge: Math.max(10, bodyAge), realAge, diff, comment, color };
  }, [age, answers]);

  const colorClasses: Record<string, string> = {
    green: "bg-green-50 border-green-200 text-green-800",
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800",
    red: "bg-red-50 border-red-200 text-red-800",
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">体内年齢・体力年齢計算</h1>
      <p className="text-gray-600 mb-6">生活習慣のアンケートから体内年齢を診断します。全質問に答えてください。</p>
      <AdBanner />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">実年齢</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="例: 35" className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <span className="ml-2 text-gray-600">歳</span>
        </div>
        {QUESTIONS.map((q) => (
          <div key={q.id}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{q.label}</label>
            <div className="grid grid-cols-1 gap-2">
              {q.options.map((opt) => (
                <button key={opt.label} onClick={() => setAnswers((p) => ({ ...p, [q.id]: opt.score }))}
                  className={`text-left px-4 py-2 rounded-lg border text-sm transition-colors ${answers[q.id] === opt.score ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">あなたの体内年齢</p>
            <p className="text-6xl font-bold text-blue-600">{result.bodyAge}<span className="text-2xl">歳</span></p>
            <p className="text-gray-500 mt-2">実年齢 {result.realAge}歳 との差: {result.diff > 0 ? "+" : ""}{result.diff}歳</p>
          </div>
          <div className={`rounded-xl border p-4 ${colorClasses[result.color]}`}>
            <p className="text-sm">{result.comment}</p>
          </div>
        </div>
      )}
      <AdBanner />
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">体力年齢を若くする最も効果的な方法は？</h3><p className="text-sm text-gray-600 mt-1">有酸素運動（ウォーキング・ジョギング）を週3回以上続けることが最も効果的です。筋トレと組み合わせると代謝も上がります。</p></div>
          <div><h3 className="font-medium text-gray-900">体内年齢は改善できますか？</h3><p className="text-sm text-gray-600 mt-1">はい、生活習慣の改善で体内年齢は若くなります。特に禁煙・適度な運動・十分な睡眠の効果は大きく、3ヶ月程度で変化が実感できます。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="body-age-calc" />
    </main>
  );
}
