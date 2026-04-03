"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 宝くじの種別
type LotteryType = "jumbo" | "loto6" | "loto7" | "miniloto" | "numbers4";

// ─── 年末ジャンボ（2023年ベース）等の当選データ
const JUMBO_PRIZES = [
  { rank: "1等", amount: 700_000_000, probability: 1 / 20_000_000 },
  { rank: "1等前後賞", amount: 150_000_000, probability: 2 / 20_000_000 },
  { rank: "1等組違い賞", amount: 100_000, probability: 199 / 20_000_000 },
  { rank: "2等", amount: 10_000_000, probability: 4 / 20_000_000 },
  { rank: "3等", amount: 1_000_000, probability: 20 / 20_000_000 },
  { rank: "4等", amount: 50_000, probability: 200 / 20_000_000 },
  { rank: "5等", amount: 10_000, probability: 4_000 / 20_000_000 },
  { rank: "6等", amount: 3_000, probability: 20_000 / 20_000_000 },
  { rank: "7等", amount: 300, probability: 200_000 / 20_000_000 },
];

// ─── ロト6当選データ（1口200円）
const LOTO6_PRIZES = [
  { rank: "1等（6個一致）", amount: 200_000_000, probability: 1 / 6_096_454 },
  { rank: "2等（5個+ボーナス）", amount: 10_000_000, probability: 6 / 6_096_454 },
  { rank: "3等（5個一致）", amount: 300_000, probability: 216 / 6_096_454 },
  { rank: "4等（4個一致）", amount: 6_800, probability: 9_990 / 6_096_454 },
  { rank: "5等（3個一致）", amount: 1_000, probability: 155_400 / 6_096_454 },
];

// ─── ロト7当選データ（1口200円）
const LOTO7_PRIZES = [
  { rank: "1等（7個一致）", amount: 600_000_000, probability: 1 / 10_295_472 },
  { rank: "2等（6個+ボーナス2個）", amount: 30_000_000, probability: 14 / 10_295_472 },
  { rank: "3等（6個一致）", amount: 1_000_000, probability: 196 / 10_295_472 },
  { rank: "4等（5個一致）", amount: 9_600, probability: 14_700 / 10_295_472 },
  { rank: "5等（4個一致）", amount: 1_700, probability: 420_000 / 10_295_472 },
  { rank: "6等（3個+ボーナス）", amount: 1_000, probability: 490_000 / 10_295_472 },
];

// ─── ミニロト当選データ（1口200円）
const MINILOTO_PRIZES = [
  { rank: "1等（5個一致）", amount: 10_000_000, probability: 1 / 169_911 },
  { rank: "2等（4個+ボーナス）", amount: 150_000, probability: 5 / 169_911 },
  { rank: "3等（4個一致）", amount: 10_000, probability: 140 / 169_911 },
  { rank: "4等（3個一致）", amount: 1_000, probability: 2_800 / 169_911 },
];

// ─── ナンバーズ4当選データ（1口200円、ストレート平均）
const NUMBERS4_PRIZES = [
  { rank: "ストレート", amount: 900_000, probability: 1 / 10_000 },
  { rank: "ボックス（4桁異なる）", amount: 37_500, probability: 24 / 10_000 },
  { rank: "セット（ストレート）", amount: 450_000, probability: 1 / 10_000 },
  { rank: "セット（ボックス）", amount: 18_750, probability: 24 / 10_000 },
  { rank: "ミニ（下3桁）", amount: 9_000, probability: 1 / 1_000 },
];

const LOTTERY_CONFIG: Record<LotteryType, {
  name: string;
  unitPrice: number;
  prizes: { rank: string; amount: number; probability: number }[];
}> = {
  jumbo: { name: "ジャンボ宝くじ（年末）", unitPrice: 300, prizes: JUMBO_PRIZES },
  loto6: { name: "ロト6", unitPrice: 200, prizes: LOTO6_PRIZES },
  loto7: { name: "ロト7", unitPrice: 200, prizes: LOTO7_PRIZES },
  miniloto: { name: "ミニロト", unitPrice: 200, prizes: MINILOTO_PRIZES },
  numbers4: { name: "ナンバーズ4", unitPrice: 200, prizes: NUMBERS4_PRIZES },
};

// ─── 期待値計算
function calcExpectedValue(prizes: { amount: number; probability: number }[]): number {
  return prizes.reduce((sum, p) => sum + p.amount * p.probability, 0);
}

// ─── n回購入で少なくとも1回当たる確率
function atLeastOnce(probability: number, n: number): number {
  return 1 - Math.pow(1 - probability, n);
}

// ─── 確率を日本語で表示
function formatProb(p: number): string {
  if (p < 0.0001) return `${(1 / p).toLocaleString("ja-JP", { maximumFractionDigits: 0 })}分の1`;
  if (p < 0.01) return `${(p * 100).toFixed(4)}%`;
  return `${(p * 100).toFixed(2)}%`;
}

// ─── 面白い比較
const COMPARISONS = [
  { label: "同じ日に2回落雷に遭う", probability: 1 / 9_000_000_000_000 },
  { label: "落雷に遭う（年間）", probability: 1 / 1_000_000 },
  { label: "交通事故で死亡（年間）", probability: 1 / 15_000 },
  { label: "飛行機事故（1フライト）", probability: 1 / 11_000_000 },
];

const FAQS = [
  {
    question: "宝くじの還元率はいくらですか？",
    answer:
      "日本の宝くじの還元率（期待値）は約45〜47%です。1,000円買えば平均450〜470円しか戻ってきません。パチンコの85〜95%と比べても低い還元率です。",
  },
  {
    question: "ジャンボ宝くじの1等当選確率は？",
    answer:
      "年末ジャンボ宝くじの1等（7億円）の当選確率は2,000万分の1（0.000005%）です。1等前後賞合わせても1,000万分の1です。",
  },
  {
    question: "ロト6とジャンボ宝くじどちらが当たりやすいですか？",
    answer:
      "ロト6の1等当選確率は約609万分の1でジャンボより高いですが、それでも非常に低い確率です。ロト6は理論上の期待値がジャンボより高い場合があります。",
  },
  {
    question: "宝くじで当選した場合、税金はかかりますか？",
    answer:
      "宝くじの当選金には所得税・住民税がかかりません（当選金は非課税）。ただし当選金で購入した資産（不動産・株式等）の売却益には課税されます。",
  },
];

export default function LotteryCalc() {
  const [lotteryType, setLotteryType] = useState<LotteryType>("jumbo");
  const [quantity, setQuantity] = useState(10);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const config = LOTTERY_CONFIG[lotteryType];
  const totalCost = config.unitPrice * quantity;
  const evPerUnit = useMemo(() => calcExpectedValue(config.prizes), [config]);
  const evTotal = evPerUnit * quantity;
  const returnRate = (evPerUnit / config.unitPrice) * 100;
  const expectedLoss = totalCost - evTotal;

  const LOTTERY_TABS: { type: LotteryType; label: string }[] = [
    { type: "jumbo", label: "ジャンボ" },
    { type: "loto6", label: "ロト6" },
    { type: "loto7", label: "ロト7" },
    { type: "miniloto", label: "ミニロト" },
    { type: "numbers4", label: "ナンバーズ4" },
  ];

  const jackpotProb = config.prizes[0].probability;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── Hero ─── */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🎰</span>
          <h1 className="text-2xl font-bold">宝くじ期待値計算</h1>
        </div>
        <p className="text-sm opacity-90">
          宝くじの期待値・還元率・当選確率を計算。ジャンボ宝くじ・ロト・ナンバーズの損得を理論的に分析します。
        </p>
      </div>

      <AdBanner />

      {/* ─── 種類タブ ─── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {LOTTERY_TABS.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setLotteryType(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              lotteryType === type
                ? "bg-amber-400 text-white border-amber-400"
                : "bg-white text-gray-700 border-gray-300 hover:bg-amber-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-gray-800">{config.name}</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            購入{lotteryType === "jumbo" ? "枚" : "口"}数
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={lotteryType === "jumbo" ? 100 : 50}
              step={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-amber-400 bg-amber-100"
            />
            <div className="flex items-center gap-1">
              <input
                type="number"
                min={1}
                max={lotteryType === "jumbo" ? 1000 : 500}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-20 p-2 border border-gray-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <span className="text-sm text-gray-600">{lotteryType === "jumbo" ? "枚" : "口"}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-amber-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">購入金額</p>
            <p className="text-xl font-bold text-gray-800">¥{totalCost.toLocaleString("ja-JP")}</p>
            <p className="text-xs text-gray-400">1{lotteryType === "jumbo" ? "枚" : "口"}{config.unitPrice.toLocaleString("ja-JP")}円</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <p className="text-xs text-gray-500">期待値合計</p>
            <p className="text-xl font-bold text-amber-600">¥{Math.round(evTotal).toLocaleString("ja-JP")}</p>
            <p className="text-xs text-gray-400">1{lotteryType === "jumbo" ? "枚" : "口"}あたり{evPerUnit.toFixed(1)}円</p>
          </div>
        </div>
      </div>

      {/* ─── 結果カード ─── */}
      <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90 mb-1">還元率（理論値）</p>
        <p className="text-6xl font-extrabold tracking-tight mb-2">{returnRate.toFixed(1)}%</p>
        <p className="text-xs opacity-80 mb-4">
          {config.name} — 購入{quantity}{lotteryType === "jumbo" ? "枚" : "口"}
        </p>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30">
          <div>
            <p className="text-xs opacity-75">購入金額</p>
            <p className="text-lg font-bold">¥{totalCost.toLocaleString("ja-JP")}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">期待値</p>
            <p className="text-lg font-bold">¥{Math.round(evTotal).toLocaleString("ja-JP")}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">損失期待額</p>
            <p className="text-lg font-bold">¥{Math.round(expectedLoss).toLocaleString("ja-JP")}</p>
          </div>
        </div>
      </div>

      {/* ─── 当選確率テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">各等の当選金・確率</h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">等</th>
                <th className="text-right py-2 px-2 font-medium">当選金</th>
                <th className="text-right py-2 px-2 font-medium">確率</th>
                <th className="text-right py-2 px-2 font-medium">期待値/枚</th>
              </tr>
            </thead>
            <tbody>
              {config.prizes.map((prize, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2.5 px-2 text-gray-800 font-medium">{prize.rank}</td>
                  <td className="py-2.5 px-2 text-right text-amber-600 font-semibold">
                    ¥{prize.amount.toLocaleString("ja-JP")}
                  </td>
                  <td className="py-2.5 px-2 text-right text-gray-500">
                    {formatProb(prize.probability)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-gray-600">
                    {(prize.amount * prize.probability).toFixed(2)}円
                  </td>
                </tr>
              ))}
              <tr className="bg-amber-50 font-semibold">
                <td className="py-2.5 px-2 text-gray-800">合計期待値</td>
                <td className="py-2.5 px-2 text-right text-amber-700">—</td>
                <td className="py-2.5 px-2 text-right text-amber-700">—</td>
                <td className="py-2.5 px-2 text-right text-amber-700">{evPerUnit.toFixed(2)}円</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <AdBanner />

      {/* ─── 買い続けシミュレーション ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-1">1等当選シミュレーション</h2>
        <p className="text-xs text-gray-400 mb-4">買い続けた場合、1等に少なくとも1回当たる確率</p>
        <div className="space-y-3">
          {[
            { label: "1回購入", n: 1 },
            { label: "10回購入", n: 10 },
            { label: "100回購入", n: 100 },
            { label: "1,000回購入", n: 1_000 },
            { label: "10,000回購入", n: 10_000 },
          ].map(({ label, n }) => {
            const prob = atLeastOnce(jackpotProb, n);
            const pct = prob * 100;
            return (
              <div key={n}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{label}</span>
                  <span className="font-semibold text-amber-600">
                    {pct < 0.01 ? pct.toExponential(2) : pct.toFixed(4)}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all"
                    style={{ width: `${Math.min(100, pct * 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-700 mb-3">他の出来事との確率比較</p>
          <div className="space-y-2">
            {COMPARISONS.map((c, i) => {
              const ratio = jackpotProb > 0 ? c.probability / jackpotProb : 0;
              return (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                  <span className="text-amber-500 font-bold mt-0.5">•</span>
                  <span>
                    「{c.label}」の確率（{formatProb(c.probability)}）は
                    1等当選より
                    {ratio >= 1
                      ? `約${ratio.toLocaleString("ja-JP", { maximumFractionDigits: 0 })}倍起きやすい`
                      : `約${(1 / ratio).toLocaleString("ja-JP", { maximumFractionDigits: 0 })}倍起きにくい`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-amber-600"
              >
                <span>{faq.question}</span>
                <span className="text-gray-400 ml-2 shrink-0">{openFaq === i ? "−" : "＋"}</span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="lottery-calc" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ 当選確率・当選金額は一般的な発売データに基づく参考値です。実際の当選金はキャリーオーバーや販売実績によって変動します。
        このツールは娯楽・教育目的の情報提供であり、宝くじの購入を推奨するものではありません。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
