"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface Beverage {
  id: string;
  emoji: string;
  name: string;
  mg: number;
  unit: string;
}

const BEVERAGES: Beverage[] = [
  { id: "drip-coffee", emoji: "☕", name: "コーヒー（ドリップ）", mg: 90, unit: "杯" },
  { id: "espresso", emoji: "☕", name: "エスプレッソ", mg: 60, unit: "ショット" },
  { id: "green-tea", emoji: "🍵", name: "緑茶", mg: 30, unit: "杯" },
  { id: "black-tea", emoji: "🍵", name: "紅茶", mg: 40, unit: "杯" },
  { id: "matcha-latte", emoji: "🧋", name: "抹茶ラテ", mg: 70, unit: "杯" },
  { id: "cola", emoji: "🥤", name: "コーラ", mg: 35, unit: "350ml" },
  { id: "energy-drink", emoji: "⚡", name: "エナジードリンク（Red Bull等）", mg: 80, unit: "250ml" },
  { id: "monster", emoji: "⚡", name: "モンスターエナジー", mg: 142, unit: "355ml" },
  { id: "5hour", emoji: "💊", name: "眠気覚ましドリンク（5-hour等）", mg: 200, unit: "本" },
  { id: "chocolate", emoji: "🍫", name: "板チョコ", mg: 20, unit: "50g" },
];

type Counts = Record<string, number>;

interface CustomItem {
  name: string;
  mg: string;
}

function getBarColor(total: number): string {
  if (total < 200) return "bg-green-500";
  if (total < 350) return "bg-yellow-500";
  if (total < 400) return "bg-orange-500";
  return "bg-red-500";
}

function getStatusLabel(total: number, limit: number): { text: string; color: string } {
  const pct = (total / limit) * 100;
  if (pct < 50) return { text: "安全範囲", color: "text-green-600" };
  if (pct < 87.5) return { text: "注意", color: "text-yellow-600" };
  if (pct < 100) return { text: "もうすぐ上限", color: "text-orange-600" };
  return { text: "上限超過", color: "text-red-600" };
}

export default function CaffeineCalc() {
  const [bodyWeight, setBodyWeight] = useState("");
  const [isPregnant, setIsPregnant] = useState(false);
  const [counts, setCounts] = useState<Counts>({});
  const [customItem, setCustomItem] = useState<CustomItem>({ name: "", mg: "" });
  const [customCount, setCustomCount] = useState(0);

  const updateCount = (id: string, delta: number) => {
    setCounts((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const result = useMemo(() => {
    let total = 0;
    for (const bev of BEVERAGES) {
      total += (counts[bev.id] || 0) * bev.mg;
    }
    // custom item
    const customMg = parseFloat(customItem.mg) || 0;
    total += customCount * customMg;

    const limit = isPregnant ? 200 : 400;
    const remaining = Math.max(0, limit - total);
    const barPercent = Math.min(100, (total / limit) * 100);

    // Weight-based limits
    const weight = parseFloat(bodyWeight);
    const weightSingleLimit = weight > 0 ? Math.round(weight * 5.7) : null;
    const weightDailyLimit = weight > 0 ? Math.round(weight * 3 * weight / weight) : null; // 3mg/kg
    const weightDailyLimitActual = weight > 0 ? Math.round(weight * 3) : null;

    // Half-life calculation
    const now = new Date();
    const halfLifeHours = 5;
    // Time until caffeine drops below 50mg (roughly "cleared")
    // total * (0.5)^(t/5) = 50  =>  t = 5 * log2(total/50)
    let clearTimeStr: string | null = null;
    if (total > 50) {
      const hoursUntilClear = halfLifeHours * Math.log2(total / 50);
      const clearDate = new Date(now.getTime() + hoursUntilClear * 3600 * 1000);
      clearTimeStr = `${String(clearDate.getHours()).padStart(2, "0")}:${String(
        clearDate.getMinutes()
      ).padStart(2, "0")}`;
    }

    return {
      total,
      limit,
      remaining,
      barPercent,
      clearTimeStr,
      weightSingleLimit,
      weightDailyLimit: weightDailyLimitActual,
    };
  }, [counts, customItem, customCount, isPregnant, bodyWeight]);

  // Breakdown for chart
  const breakdown = useMemo(() => {
    const items: { name: string; mg: number; emoji: string }[] = [];
    for (const bev of BEVERAGES) {
      const count = counts[bev.id] || 0;
      if (count > 0) {
        items.push({ name: bev.name, mg: count * bev.mg, emoji: bev.emoji });
      }
    }
    const customMg = parseFloat(customItem.mg) || 0;
    if (customCount > 0 && customMg > 0) {
      items.push({
        name: customItem.name || "カスタム",
        mg: customCount * customMg,
        emoji: "🧪",
      });
    }
    return items;
  }, [counts, customItem, customCount]);

  const status = getStatusLabel(result.total, result.limit);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-700 to-stone-900 p-6 mb-6 text-white">
        <div className="text-4xl mb-2">☕</div>
        <h1 className="text-2xl font-bold mb-1">カフェイン摂取量計算</h1>
        <p className="text-amber-200 text-sm">
          今日飲んだものを選ぶだけ。カフェインの上限・睡眠への影響を確認
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 mt-6">
        {/* Settings row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              体重（kg）<span className="text-gray-400 font-normal ml-1">任意・体重別上限計算に使用</span>
            </label>
            <input
              type="number"
              value={bodyWeight}
              onChange={(e) => setBodyWeight(e.target.value)}
              placeholder="65"
              min="0"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
          <div className="flex items-end pb-0.5">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsPregnant((v) => !v)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isPregnant ? "bg-amber-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    isPregnant ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </div>
              <span className="text-sm text-gray-700">
                妊娠中・授乳中（上限200mg）
              </span>
            </label>
          </div>
        </div>

        {/* Beverage list */}
        <div>
          <h2 className="font-bold text-gray-800 mb-3">今日飲んだもの</h2>
          <div className="space-y-2">
            {BEVERAGES.map((bev) => {
              const count = counts[bev.id] || 0;
              return (
                <div
                  key={bev.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-amber-50 hover:border-amber-200 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xl">{bev.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-800 truncate">
                        {bev.name}
                      </div>
                      <div className="text-xs text-gray-400">{bev.mg}mg / {bev.unit}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateCount(bev.id, -1)}
                      disabled={count === 0}
                      className="w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600 font-bold text-base flex items-center justify-center disabled:opacity-30 hover:bg-gray-100 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-6 text-center font-semibold text-gray-800 text-sm">
                      {count}
                    </span>
                    <button
                      onClick={() => updateCount(bev.id, 1)}
                      className="w-8 h-8 rounded-full border border-amber-500 bg-amber-500 text-white font-bold text-base flex items-center justify-center hover:bg-amber-600 transition-colors"
                    >
                      ＋
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Custom item */}
            <div className="p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50 space-y-2">
              <div className="text-sm font-medium text-gray-600">🧪 カスタムアイテム</div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={customItem.name}
                  onChange={(e) => setCustomItem((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="飲み物名"
                  className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <input
                  type="number"
                  value={customItem.mg}
                  onChange={(e) => setCustomItem((prev) => ({ ...prev, mg: e.target.value }))}
                  placeholder="カフェイン量 (mg)"
                  min="0"
                  className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCustomCount((c) => Math.max(0, c - 1))}
                  disabled={customCount === 0}
                  className="w-8 h-8 rounded-full border border-gray-300 bg-white text-gray-600 font-bold flex items-center justify-center disabled:opacity-30 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-6 text-center font-semibold text-gray-800 text-sm">
                  {customCount}
                </span>
                <button
                  onClick={() => setCustomCount((c) => c + 1)}
                  className="w-8 h-8 rounded-full border border-amber-500 bg-amber-500 text-white font-bold flex items-center justify-center hover:bg-amber-600"
                >
                  ＋
                </button>
                <span className="text-sm text-gray-500 ml-1">
                  {customItem.mg ? `${(parseFloat(customItem.mg) || 0) * customCount}mg` : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6 space-y-6">
        <h2 className="font-bold text-gray-800">計算結果</h2>

        {/* Total */}
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900">
            {result.total}
            <span className="text-xl font-normal text-gray-500 ml-1">mg</span>
          </div>
          <div className={`text-sm font-semibold mt-1 ${status.color}`}>{status.text}</div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>0mg</span>
            <span>上限 {result.limit}mg</span>
          </div>
          <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarColor(result.total)}`}
              style={{ width: `${result.barPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className={`font-medium ${status.color}`}>
              現在 {result.total}mg（{Math.round(result.barPercent)}%）
            </span>
            <span className="text-gray-500">あと {result.remaining}mg</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="text-xs text-gray-500 mb-1">安全上限まで</div>
            <div className="text-2xl font-bold text-amber-700">
              あと {result.remaining}
              <span className="text-sm font-normal ml-1">mg</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {isPregnant ? "妊婦・授乳中基準（200mg）" : "一般成人基準（400mg/日）"}
            </div>
          </div>

          {result.clearTimeStr && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">カフェインが減少する目安</div>
              <div className="text-2xl font-bold text-indigo-700">{result.clearTimeStr} 頃</div>
              <div className="text-xs text-gray-400 mt-0.5">
                半減期5時間で50mg以下になる時刻（目安）
              </div>
            </div>
          )}

          {result.weightSingleLimit && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">体重別・1回の上限目安</div>
              <div className="text-2xl font-bold text-green-700">
                {result.weightSingleLimit}
                <span className="text-sm font-normal ml-1">mg</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">体重 × 5.7mg/kg</div>
            </div>
          )}

          {result.weightDailyLimit && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="text-xs text-gray-500 mb-1">体重別・1日の上限目安</div>
              <div className="text-2xl font-bold text-blue-700">
                {result.weightDailyLimit}
                <span className="text-sm font-normal ml-1">mg</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">体重 × 3mg/kg</div>
            </div>
          )}
        </div>

        {/* Breakdown bar chart */}
        {breakdown.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">飲み物別内訳</h3>
            <div className="space-y-2">
              {breakdown.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>
                      {item.emoji} {item.name}
                    </span>
                    <span className="font-medium">{item.mg}mg</span>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{
                        width: result.total > 0 ? `${(item.mg / result.total) * 100}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {result.total === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">☕</div>
            <p className="text-sm">今日飲んだものを上から選んでください</p>
          </div>
        )}
      </div>

      <AdBanner />

      <section className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">カフェイン計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          今日飲んだコーヒー・お茶・エナジードリンクなどを選んで杯数を入力すると、
          カフェインの合計摂取量をリアルタイムで計算します。体重を入力すると個人に合わせた安全上限も表示。
          カフェインの半減期（約5時間）から、睡眠への影響が収まる時刻の目安もわかります。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "カフェインの1日の上限量はどのくらいですか？",
            answer:
              "健康な成人の場合、1日400mg以下が推奨されています。コーヒー換算でおよそ4〜5杯相当。妊婦・授乳中の方は200mg以下が推奨されます。",
          },
          {
            question: "コーヒー1杯のカフェイン量はどのくらいですか？",
            answer:
              "ドリップコーヒー1杯（240ml）は約70〜140mg（平均90mg）です。エスプレッソ1ショット（30ml）は約60mgです。",
          },
          {
            question: "カフェインの半減期はどのくらいですか？",
            answer:
              "カフェインの半減期は約5〜6時間です。午後3時に飲むと、午後8〜9時には半分が残ります。就寝6時間前以降の摂取は睡眠の質を低下させる可能性があります。",
          },
          {
            question: "妊娠中のカフェイン摂取量はどのくらいですか？",
            answer:
              "妊娠中・授乳中の方は1日200mg以下が推奨されています（コーヒー約2杯）。胎児はカフェインを代謝する能力が低いため、過剰摂取は避けてください。",
          },
        ]}
      />

      <RelatedTools currentToolId="caffeine-calc" />

      <p className="text-xs text-gray-400 mt-6 text-center">
        ※ カフェイン量は飲み物の種類・メーカー・抽出方法によって異なります。本ツールの数値は一般的な目安です。健康上の問題がある場合は医師にご相談ください。
      </p>
    </div>
  );
}
