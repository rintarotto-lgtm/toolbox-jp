"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type ActivityLevel = "sedentary" | "light" | "moderate" | "intense";
type Season = "spring" | "summer" | "winter";

interface ActivityOption {
  value: ActivityLevel;
  label: string;
  addMl: number;
}

interface SeasonOption {
  value: Season;
  label: string;
  addMl: number;
}

interface TimeSlot {
  time: string;
  label: string;
  ratio: number;
}

const activityOptions: ActivityOption[] = [
  { value: "sedentary", label: "ほぼ座り仕事", addMl: 0 },
  { value: "light", label: "軽い運動（週1〜3）", addMl: 300 },
  { value: "moderate", label: "中程度（週3〜5）", addMl: 500 },
  { value: "intense", label: "激しい運動（週6〜7）", addMl: 700 },
];

const seasonOptions: SeasonOption[] = [
  { value: "spring", label: "春・秋", addMl: 0 },
  { value: "summer", label: "夏", addMl: 300 },
  { value: "winter", label: "冬", addMl: -100 },
];

const timeSlots: TimeSlot[] = [
  { time: "6:00〜8:00", label: "朝", ratio: 0.15 },
  { time: "8:00〜12:00", label: "午前", ratio: 0.25 },
  { time: "12:00〜14:00", label: "昼", ratio: 0.2 },
  { time: "14:00〜18:00", label: "午後", ratio: 0.25 },
  { time: "18:00〜22:00", label: "夜", ratio: 0.15 },
];

export default function WaterIntakeCalc() {
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState<ActivityLevel>("sedentary");
  const [season, setSeason] = useState<Season>("spring");

  const result = useMemo(() => {
    const w = parseFloat(weight);
    if (!w || w <= 0) return null;

    const activityAdd = activityOptions.find((o) => o.value === activity)?.addMl ?? 0;
    const seasonAdd = seasonOptions.find((o) => o.value === season)?.addMl ?? 0;
    const totalMl = Math.round(w * 30 + activityAdd + seasonAdd);
    const totalL = totalMl / 1000;
    const cups = Math.ceil(totalMl / 200);

    // 内訳: 飲料水60%、お茶20%、食事20%
    const waterMl = Math.round(totalMl * 0.6);
    const teaMl = Math.round(totalMl * 0.2);
    const foodMl = Math.round(totalMl * 0.2);

    const schedule = timeSlots.map((slot) => ({
      ...slot,
      ml: Math.round(totalMl * slot.ratio),
    }));

    return { totalMl, totalL, cups, waterMl, teaMl, foodMl, schedule };
  }, [weight, activity, season]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">水分摂取量計算</h1>
      <p className="text-gray-500 text-sm mb-6">
        体重・運動量・季節から1日の適切な水分摂取量を計算します。熱中症対策や健康管理にご活用ください。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {/* 体重入力 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            体重（kg）
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="60"
            min="1"
            max="300"
            step="0.1"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* 運動量 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            運動量
          </label>
          <select
            value={activity}
            onChange={(e) => setActivity(e.target.value as ActivityLevel)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
          >
            {activityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
                {opt.addMl > 0 ? `（+${opt.addMl}ml）` : ""}
              </option>
            ))}
          </select>
        </div>

        {/* 季節 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            季節
          </label>
          <div className="flex gap-3">
            {seasonOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSeason(opt.value)}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  season === opt.value
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
                }`}
              >
                {opt.label}
                {opt.addMl > 0 && (
                  <span className="block text-xs opacity-75">+{opt.addMl}ml</span>
                )}
                {opt.addMl < 0 && (
                  <span className="block text-xs opacity-75">{opt.addMl}ml</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 結果 */}
        {result && (
          <>
            {/* メイン結果 */}
            <div className="border-t border-gray-100 pt-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">1日の推奨水分量</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {result.totalMl.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">ml</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {result.totalL.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">L</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {result.cups}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">杯（200ml）</div>
                </div>
              </div>
            </div>

            {/* 内訳 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">水分摂取の内訳（目安）</h3>
              <div className="space-y-2">
                {(
                  [
                    { label: "💧 水・スポーツドリンク", ml: result.waterMl, color: "bg-blue-400" },
                    { label: "🍵 お茶・その他飲料", ml: result.teaMl, color: "bg-green-400" },
                    { label: "🍱 食事からの水分", ml: result.foodMl, color: "bg-yellow-400" },
                  ] as { label: string; ml: number; color: string }[]
                ).map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-36 text-xs text-gray-600 shrink-0">{item.label}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className={`${item.color} h-3 rounded-full`}
                        style={{ width: `${(item.ml / result.totalMl) * 100}%` }}
                      />
                    </div>
                    <div className="w-16 text-xs text-gray-700 text-right shrink-0 font-medium">
                      {item.ml}ml
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 時間別目安 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">時間別摂取目安</h3>
              <div className="grid grid-cols-5 gap-2">
                {result.schedule.map((slot) => (
                  <div
                    key={slot.label}
                    className="bg-white border border-gray-200 rounded-lg p-3 text-center"
                  >
                    <div className="text-xs font-bold text-blue-600 mb-1">{slot.label}</div>
                    <div className="text-base font-bold text-gray-800">{slot.ml}</div>
                    <div className="text-xs text-gray-400">ml</div>
                    <div className="text-xs text-gray-400 mt-1">{slot.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">水分摂取量計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          体重・運動量・季節を入力するだけで、1日の推奨水分摂取量を自動計算します。
          基本計算式「体重(kg)×30ml」に、運動量（+0〜700ml）と季節（夏+300ml、冬−100ml）を加味した値を算出。
          飲み水・お茶・食事からの内訳と、時間帯別の摂取目安も表示します。熱中症対策や健康管理にご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "1日に必要な水分量はどれくらい？",
            answer:
              "体重×30mlが基本目安です。成人で約1.5〜2Lが推奨されています。運動量が多い日や夏は増量が必要です。",
          },
          {
            question: "水分補給のタイミングは？",
            answer:
              "起床後・食事前・入浴前後・就寝前など、喉が渇く前にこまめに補給しましょう。運動中は15〜20分ごとに150〜250mlが目安です。",
          },
          {
            question: "お茶やコーヒーは水分補給になる？",
            answer:
              "カフェインは利尿作用がありますが、適量なら水分補給として計算できます。大量摂取は逆効果になる可能性があるため、水やノンカフェイン飲料をメインにすることをおすすめします。",
          },
          {
            question: "入力したデータはサーバーに送信されますか？",
            answer:
              "いいえ。このツールは全てブラウザ上で動作するため、入力した体重などのデータがサーバーに送信されることは一切ありません。",
          },
        ]}
      />

      <RelatedTools currentToolId="water-intake-calc" />
    </div>
  );
}
