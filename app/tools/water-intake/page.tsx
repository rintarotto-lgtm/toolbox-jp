"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 気温区分
type TempLevel = "cool" | "normal" | "warm" | "hot" | "heatwave";
const TEMP_OPTIONS: { value: TempLevel; label: string; adjustment: number }[] = [
  { value: "cool", label: "涼しい（20℃未満）", adjustment: -200 },
  { value: "normal", label: "普通（20〜25℃）", adjustment: 0 },
  { value: "warm", label: "暖かい（25〜30℃）", adjustment: 200 },
  { value: "hot", label: "暑い（30〜35℃）", adjustment: 400 },
  { value: "heatwave", label: "猛暑（35℃以上）", adjustment: 600 },
];

// ─── 運動レベル
type ExerciseLevel = "none" | "light" | "moderate" | "intense";
const EXERCISE_OPTIONS: { value: ExerciseLevel; label: string; adjustment: number }[] = [
  { value: "none", label: "ほぼしない", adjustment: 0 },
  { value: "light", label: "軽い運動（約30分）", adjustment: 300 },
  { value: "moderate", label: "中程度（約60分）", adjustment: 500 },
  { value: "intense", label: "激しい運動（90分以上）", adjustment: 800 },
];

// ─── 水分補給スケジュール
const SCHEDULE = [
  { time: "起床時", icon: "🌅", tip: "就寝中の水分損失を補給" },
  { time: "朝食時", icon: "🍳", tip: "食事と一緒に水分補給" },
  { time: "昼食前後", icon: "☀️", tip: "活動のピーク前に補給" },
  { time: "午後（15時頃）", icon: "🍵", tip: "午後の集中力維持に" },
  { time: "夕食時", icon: "🌙", tip: "食事と一緒にゆっくり" },
  { time: "就寝前", icon: "🛌", tip: "就寝中の脱水を予防" },
];

// ─── 尿の色チャート
const URINE_CHART = [
  { level: 1, color: "bg-yellow-50", label: "ほぼ透明", status: "水分過多", statusColor: "text-blue-500" },
  { level: 2, color: "bg-yellow-100", label: "薄い黄色", status: "最適", statusColor: "text-green-600" },
  { level: 3, color: "bg-yellow-200", label: "淡い黄色", status: "良好", statusColor: "text-green-500" },
  { level: 4, color: "bg-yellow-300", label: "黄色", status: "やや不足", statusColor: "text-yellow-600" },
  { level: 5, color: "bg-yellow-500", label: "濃い黄色", status: "不足", statusColor: "text-orange-500" },
  { level: 6, color: "bg-amber-600", label: "褐色", status: "要補給！", statusColor: "text-red-600" },
];

// ─── FAQ
const FAQS = [
  {
    question: "1日に必要な水分量はどのくらいですか？",
    answer:
      "一般的に体重1kgあたり約30〜40mlが目安です。体重60kgなら1,800〜2,400mlです。ただし気温や運動量によって大きく変わります。",
  },
  {
    question: "水以外の飲み物でも水分補給できますか？",
    answer:
      "お茶・コーヒー・ジュースなども水分補給になりますが、カフェインには利尿作用があります。アルコールは脱水を促進するため、水分補給としてはカウントできません。",
  },
  {
    question: "脱水症状のサインは何ですか？",
    answer:
      "口の渇き・尿の色が濃い黄色・頭痛・めまい・集中力低下などが脱水のサインです。喉が渇く前に定期的に水分を補給することが重要です。",
  },
  {
    question: "運動中はどのくらい水分を補給すべきですか？",
    answer:
      "運動前に300〜500ml、運動中は15〜20分ごとに150〜250ml、運動後は体重減少分の1.5倍を目安に補給してください。",
  },
];

export default function WaterIntake() {
  const [weight, setWeight] = useState(60);
  const [temp, setTemp] = useState<TempLevel>("normal");
  const [exercise, setExercise] = useState<ExerciseLevel>("none");
  const [breastfeeding, setBreastfeeding] = useState(false);
  const [pregnant, setPregnant] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(() => {
    const base = weight * 35; // ml
    const tempAdj = TEMP_OPTIONS.find((t) => t.value === temp)?.adjustment ?? 0;
    const exAdj = EXERCISE_OPTIONS.find((e) => e.value === exercise)?.adjustment ?? 0;
    const bfAdj = breastfeeding ? 500 : 0;
    const pregAdj = pregnant ? 300 : 0;

    const total = Math.round(base + tempAdj + exAdj + bfAdj + pregAdj);
    const fromFood = 600; // 食事由来
    const fromDrink = Math.max(0, total - fromFood);

    // ペットボトル換算（500ml）
    const bottles = fromDrink / 500;

    // スケジュール（6回に分割）
    const perSession = Math.round(fromDrink / 6 / 50) * 50; // 50ml単位で丸める

    return {
      total,
      fromFood,
      fromDrink,
      bottles,
      perSession,
    };
  }, [weight, temp, exercise, breastfeeding, pregnant]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヒーローヘッダー ─── */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">💧</span>
          <h1 className="text-2xl font-bold">水分摂取量計算</h1>
        </div>
        <p className="text-sm opacity-90">
          体重・気温・運動強度から1日の推奨水分摂取量を算出します。
        </p>
      </div>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-800">条件を入力</h2>

        {/* 体重 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">体重</label>
          <input
            type="range"
            min={30}
            max={150}
            step={1}
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-cyan-500
              bg-gradient-to-r from-cyan-200 to-cyan-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>30kg</span><span>60kg</span><span>90kg</span><span>120kg</span><span>150kg</span>
          </div>
          <p className="text-center text-2xl font-bold text-cyan-600 mt-1">{weight} kg</p>
        </div>

        {/* 気温 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">今日の気温</label>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {TEMP_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTemp(opt.value)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors text-center ${
                  temp === opt.value
                    ? "bg-cyan-600 text-white border-cyan-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-cyan-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 運動レベル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">運動レベル</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {EXERCISE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setExercise(opt.value)}
                className={`py-2.5 px-2 rounded-lg text-xs font-medium border transition-colors text-center ${
                  exercise === opt.value
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 特別な条件 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">特別な状況</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setPregnant((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                pregnant
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-pink-50"
              }`}
            >
              <span>🤰</span>
              <span>妊娠中 (+300ml)</span>
              {pregnant && <span className="ml-auto text-xs bg-white/30 rounded px-1.5 py-0.5">ON</span>}
            </button>
            <button
              onClick={() => setBreastfeeding((v) => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                breastfeeding
                  ? "bg-sky-500 text-white border-sky-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-sky-50"
              }`}
            >
              <span>🍼</span>
              <span>授乳中 (+500ml)</span>
              {breastfeeding && <span className="ml-auto text-xs bg-white/30 rounded px-1.5 py-0.5">ON</span>}
            </button>
          </div>
        </div>
      </div>

      {/* ─── 結果: メインカード ─── */}
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <p className="text-sm opacity-80 mb-1">1日の推奨水分摂取量</p>
        <p className="text-5xl font-extrabold tracking-tight">
          {result.total.toLocaleString("ja-JP")} ml
        </p>
        <p className="text-xl font-bold opacity-90 mt-1">
          = {(result.total / 1000).toFixed(2)} L
        </p>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30 text-center mt-3">
          <div>
            <p className="text-xs opacity-75">食事からの水分</p>
            <p className="text-lg font-bold">約600 ml</p>
          </div>
          <div>
            <p className="text-xs opacity-75">飲み物として摂る量</p>
            <p className="text-lg font-bold">{result.fromDrink.toLocaleString()} ml</p>
          </div>
          <div>
            <p className="text-xs opacity-75">500mlボトル換算</p>
            <p className="text-lg font-bold">{result.bottles.toFixed(1)} 本</p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── 飲み物として摂るべき量の強調表示 ─── */}
      <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-5 mb-6">
        <p className="text-sm font-medium text-cyan-700 mb-1">飲み物として1日に摂るべき量</p>
        <div className="flex items-end gap-3">
          <p className="text-4xl font-extrabold text-cyan-700">
            {result.fromDrink.toLocaleString()} ml
          </p>
          <p className="text-lg text-cyan-600 mb-1">
            = 500mlペットボトル {result.bottles.toFixed(1)} 本分
          </p>
        </div>
        <p className="text-xs text-cyan-600 mt-1">※ 食事（ご飯・おかず・汁物）から摂れる約600mlを除いた量です。</p>
      </div>

      {/* ─── 時間別摂取スケジュール ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">時間別 水分補給スケジュール</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SCHEDULE.map(({ time, icon, tip }) => (
            <div key={time} className="bg-cyan-50 border border-cyan-100 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-semibold text-cyan-800">{time}</span>
              </div>
              <p className="text-lg font-bold text-cyan-700">約 {result.perSession.toLocaleString()} ml</p>
              <p className="text-xs text-cyan-600 mt-0.5">{tip}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※ 1回あたりの目安量は「飲み物として摂るべき量」を6回に均等割りしたものです。
        </p>
      </div>

      {/* ─── 尿の色チャート ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">水分チェックリスト：尿の色チャート</h2>
        <p className="text-xs text-gray-500 mb-4">尿の色で水分補給が足りているか確認できます。</p>
        <div className="space-y-2">
          {URINE_CHART.map(({ level, color, label, status, statusColor }) => (
            <div key={level} className="flex items-center gap-3">
              <div className={`w-10 h-6 rounded-md ${color} border border-gray-200 shrink-0`} />
              <span className="text-sm text-gray-700 w-24 shrink-0">{label}</span>
              <span className={`text-sm font-semibold ${statusColor}`}>{status}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700">
          <span className="font-semibold">理想の尿の色：</span> 薄い黄色（レモン色）が水分補給が十分なサインです。
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-cyan-600"
              >
                <span>{faq.question}</span>
                <span className="text-gray-400 ml-2 shrink-0 text-base">
                  {openFaq === i ? "−" : "＋"}
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="water-intake" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このツールは一般的な目安を計算するものです。実際の水分必要量は体調・疾患・薬の服用状況などによって異なります。
        腎臓疾患・心疾患など水分制限が必要な方は必ず医師にご相談ください。
        入力情報はブラウザ上でのみ処理され、サーバーへ送信されることは一切ありません。
      </p>
    </div>
  );
}
