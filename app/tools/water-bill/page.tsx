"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 都市別料金体系 (上水道のみ, 月額)
// 料金体系: { base: 基本料金, tiers: [{max: 使用量上限(㎥), rate: 円/㎥}] }
// ※ 下水道は上水道の約50〜60%として推計
type WaterTier = { max: number; rate: number };
type CityConfig = {
  name: string;
  base: number; // 基本料金（円）
  tiers: WaterTier[];
  sewerBase: number; // 下水道基本料金
  sewerRate: number; // 下水道従量料金（円/㎥）
};

const CITIES: Record<string, CityConfig> = {
  tokyo: {
    name: "東京都",
    base: 860,
    tiers: [
      { max: 5, rate: 0 },
      { max: 10, rate: 22 },
      { max: 20, rate: 128 },
      { max: 30, rate: 163 },
      { max: 50, rate: 202 },
      { max: 100, rate: 240 },
      { max: Infinity, rate: 278 },
    ],
    sewerBase: 560,
    sewerRate: 141,
  },
  osaka: {
    name: "大阪府（大阪市）",
    base: 761,
    tiers: [
      { max: 10, rate: 0 },
      { max: 20, rate: 125 },
      { max: 30, rate: 166 },
      { max: 50, rate: 204 },
      { max: 100, rate: 243 },
      { max: Infinity, rate: 282 },
    ],
    sewerBase: 680,
    sewerRate: 130,
  },
  nagoya: {
    name: "名古屋市",
    base: 680,
    tiers: [
      { max: 6, rate: 0 },
      { max: 10, rate: 88 },
      { max: 20, rate: 132 },
      { max: 30, rate: 165 },
      { max: 50, rate: 198 },
      { max: 100, rate: 220 },
      { max: Infinity, rate: 264 },
    ],
    sewerBase: 528,
    sewerRate: 115,
  },
  yokohama: {
    name: "横浜市",
    base: 930,
    tiers: [
      { max: 8, rate: 0 },
      { max: 20, rate: 121 },
      { max: 30, rate: 158 },
      { max: 50, rate: 196 },
      { max: 100, rate: 236 },
      { max: Infinity, rate: 270 },
    ],
    sewerBase: 640,
    sewerRate: 138,
  },
  fukuoka: {
    name: "福岡市",
    base: 730,
    tiers: [
      { max: 10, rate: 0 },
      { max: 20, rate: 114 },
      { max: 30, rate: 151 },
      { max: 50, rate: 195 },
      { max: 100, rate: 235 },
      { max: Infinity, rate: 275 },
    ],
    sewerBase: 580,
    sewerRate: 120,
  },
  national: {
    name: "全国平均",
    base: 850,
    tiers: [
      { max: 10, rate: 0 },
      { max: Infinity, rate: 185 },
    ],
    sewerBase: 600,
    sewerRate: 125,
  },
};

function calcWaterBill(usage: number, city: CityConfig): { water: number; sewer: number; total: number } {
  let water = city.base;
  let remaining = usage;
  let prev = 0;
  for (const tier of city.tiers) {
    if (remaining <= 0) break;
    const inTier = Math.min(remaining, tier.max - prev);
    water += inTier * tier.rate;
    remaining -= inTier;
    prev = tier.max;
    if (tier.max === Infinity) break;
  }
  const sewer = city.sewerBase + Math.max(0, usage - 8) * city.sewerRate;
  return { water: Math.round(water), sewer: Math.round(sewer), total: Math.round(water + sewer) };
}

// 全国平均比較用
const NATIONAL_AVG_15 = calcWaterBill(15, CITIES.national).total;

const FAQS = [
  {
    question: "水道代はどのように計算されますか？",
    answer:
      "水道料金は「基本料金＋従量料金（使用量に応じた料金）」で計算されます。従量料金は使用量が増えるほど単価が高くなる累進制を採用している自治体が多く、また上水道と下水道の両方の料金が請求されます。",
  },
  {
    question: "平均的な水道代はいくらですか？",
    answer:
      "全国平均の水道代（上下水道合計）は1人世帯で月約2,000〜3,000円、2人世帯で月約4,000〜5,000円、4人世帯で月約6,000〜8,000円程度です。地域によって料金体系が大きく異なります。",
  },
  {
    question: "節水するとどのくらい水道代が安くなりますか？",
    answer:
      "シャワーを1分短縮すると1回約12L（月約360L）の節水になり、月約70〜100円の節約になります。小まめな節水習慣が積み重なると年間数千円〜1万円以上の節約も可能です。",
  },
  {
    question: "1日の水道使用量の目安はどのくらいですか？",
    answer:
      "日本人1人1日あたりの家庭用水使用量は平均約214L（約0.21㎥）とされています。内訳は風呂・シャワー約40%、トイレ約21%、炊事約18%、洗濯約15%程度です。4人家族では月25〜27㎥程度になります。",
  },
];

function toYen(yen: number): string {
  return `¥${Math.round(yen).toLocaleString("ja-JP")}`;
}

export default function WaterBill() {
  const [mode, setMode] = useState<"amount" | "lifestyle">("amount");
  const [usage, setUsage] = useState(15);
  const [cityKey, setCityKey] = useState("tokyo");

  // 生活習慣モード
  const [showerMin, setShowerMin] = useState(10);
  const [laundryPerWeek, setLaundryPerWeek] = useState(5);
  const [toiletPerDay, setToiletPerDay] = useState(8);
  const [cookingMin, setCookingMin] = useState(30);
  const [otherLiters, setOtherLiters] = useState(20);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 生活習慣から使用量推定
  const lifestyleUsage = useMemo(() => {
    const showerL = showerMin * 12 * 30; // 1分12L×30日
    const laundryL = laundryPerWeek * (52 / 12) * 100; // 1回100L
    const toiletL = toiletPerDay * 6 * 30; // 1回6L
    const cookingL = cookingMin * 10 * 30; // 1分10L
    const otherL = otherLiters * 30;
    const totalL = showerL + laundryL + toiletL + cookingL + otherL;
    return Math.round(totalL / 1000); // ㎥に変換
  }, [showerMin, laundryPerWeek, toiletPerDay, cookingMin, otherLiters]);

  const effectiveUsage = mode === "lifestyle" ? lifestyleUsage : usage;
  const city = CITIES[cityKey];
  const result = useMemo(() => calcWaterBill(effectiveUsage, city), [effectiveUsage, city]);
  const nationalResult = useMemo(() => calcWaterBill(effectiveUsage, CITIES.national), [effectiveUsage]);

  // 節水アドバイス: シャワー1分短縮の節約
  const showerSaving = useMemo(() => {
    const savedL = 12 * 30; // 月360L = 0.36㎥
    const savedUsage = Math.max(0, effectiveUsage - Math.round(savedL / 1000));
    const savedResult = calcWaterBill(savedUsage, city);
    return result.total - savedResult.total;
  }, [effectiveUsage, city, result]);

  // 生活習慣別内訳（リットル）
  const lifestyleBreakdown = useMemo(() => [
    { label: "シャワー", liters: showerMin * 12 * 30, color: "bg-blue-400" },
    { label: "洗濯", liters: laundryPerWeek * (52 / 12) * 100, color: "bg-cyan-400" },
    { label: "トイレ", liters: toiletPerDay * 6 * 30, color: "bg-teal-400" },
    { label: "料理・洗い物", liters: cookingMin * 10 * 30, color: "bg-sky-400" },
    { label: "その他", liters: otherLiters * 30, color: "bg-indigo-300" },
  ], [showerMin, laundryPerWeek, toiletPerDay, cookingMin, otherLiters]);

  const totalLifestyleL = lifestyleBreakdown.reduce((s, b) => s + b.liters, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        水道料金計算ツール
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        水道使用量と地域を入力するだけで月額水道料金を計算します。生活習慣から使用量を推定する機能も。
      </p>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">

        {/* 計算方法タブ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">計算方法</label>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setMode("amount")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                mode === "amount" ? "bg-white text-blue-600 shadow" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              使用量から計算
            </button>
            <button
              onClick={() => setMode("lifestyle")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
                mode === "lifestyle" ? "bg-white text-blue-600 shadow" : "text-gray-600 hover:text-gray-800"
              }`}
            >
              生活習慣から推定
            </button>
          </div>
        </div>

        {/* 地域選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">地域</label>
          <select
            value={cityKey}
            onChange={(e) => setCityKey(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {Object.entries(CITIES).map(([key, c]) => (
              <option key={key} value={key}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* 使用量モード */}
        {mode === "amount" && (
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-sm font-medium text-gray-700">使用量（㎥/月）</label>
              <span className="text-xl font-extrabold text-blue-600">{usage} ㎥</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={usage}
              onChange={(e) => setUsage(Number(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer accent-blue-500
                [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
                bg-gradient-to-r from-blue-200 to-blue-400"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0㎥</span>
              <span>20㎥</span>
              <span>50㎥</span>
              <span>80㎥</span>
              <span>100㎥</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {[5, 10, 15, 20, 30, 50].map((v) => (
                <button
                  key={v}
                  onClick={() => setUsage(v)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    usage === v
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                  }`}
                >
                  {v}㎥
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 生活習慣モード */}
        {mode === "lifestyle" && (
          <div className="space-y-5">
            <p className="text-xs text-blue-600 font-medium">
              推定使用量：約 <span className="text-lg font-extrabold">{lifestyleUsage} ㎥</span>/月
              （{(lifestyleUsage * 1000).toLocaleString()}L）
            </p>

            {[
              {
                label: "シャワー（1人1日あたり）",
                value: showerMin,
                setValue: setShowerMin,
                min: 1, max: 30, step: 1,
                unit: "分",
                hint: "1分あたり約12L",
              },
              {
                label: "洗濯（週あたり）",
                value: laundryPerWeek,
                setValue: setLaundryPerWeek,
                min: 1, max: 14, step: 1,
                unit: "回",
                hint: "1回あたり約100L",
              },
              {
                label: "トイレ（1人1日あたり）",
                value: toiletPerDay,
                setValue: setToiletPerDay,
                min: 1, max: 20, step: 1,
                unit: "回",
                hint: "1回あたり約6L",
              },
              {
                label: "料理・洗い物（1日あたり）",
                value: cookingMin,
                setValue: setCookingMin,
                min: 5, max: 90, step: 5,
                unit: "分",
                hint: "1分あたり約10L",
              },
            ].map(({ label, value, setValue, min, max, step, unit, hint }) => (
              <div key={label}>
                <div className="flex justify-between items-baseline mb-1">
                  <label className="text-sm font-medium text-gray-700">{label}</label>
                  <span className="text-base font-bold text-blue-600">{value}{unit}</span>
                </div>
                <input
                  type="range"
                  min={min} max={max} step={step}
                  value={value}
                  onChange={(e) => setValue(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-400"
                />
                <p className="text-xs text-gray-400 mt-0.5">{hint}</p>
              </div>
            ))}

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label className="text-sm font-medium text-gray-700">その他（1日あたり）</label>
                <span className="text-base font-bold text-blue-600">{otherLiters}L</span>
              </div>
              <input
                type="range"
                min={0} max={100} step={5}
                value={otherLiters}
                onChange={(e) => setOtherLiters(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-400"
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── ヒーローカード ─── */}
      <div className="rounded-2xl p-6 mb-6 text-white shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500">
        <p className="text-sm font-medium opacity-90 mb-1">月額水道料金（{city.name}）</p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">{toYen(result.total)}</p>
        <p className="text-sm opacity-80 mb-1">年間：{toYen(result.total * 12)}</p>
        <div className="pt-4 border-t border-white/30 mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs opacity-75">上水道</p>
            <p className="text-2xl font-bold">{toYen(result.water)}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">下水道</p>
            <p className="text-2xl font-bold">{toYen(result.sewer)}</p>
          </div>
        </div>
      </div>

      {/* ─── 内訳 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">料金内訳</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: "使用量", value: `${effectiveUsage} ㎥/月` },
            { label: "上水道 基本料金", value: toYen(city.base) },
            { label: "上水道 従量料金", value: toYen(result.water - city.base) },
            { label: "上水道 合計", value: toYen(result.water), highlight: false },
            { label: "下水道料金", value: toYen(result.sewer) },
            { label: "月額合計", value: toYen(result.total), highlight: true },
            { label: "年間合計", value: toYen(result.total * 12), highlight: false },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${
                highlight ? "font-bold text-blue-700" : "text-gray-700"
              }`}
            >
              <span>{label}</span>
              <span className={highlight ? "text-lg" : ""}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 生活習慣別内訳（推定モード時） ─── */}
      {mode === "lifestyle" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">生活習慣別 使用量内訳</h2>
          <div className="space-y-3">
            {lifestyleBreakdown.map((b) => {
              const pct = totalLifestyleL > 0 ? (b.liters / totalLifestyleL) * 100 : 0;
              return (
                <div key={b.label}>
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                    <span>{b.label}</span>
                    <span className="font-medium">{Math.round(b.liters).toLocaleString()}L ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${b.color}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-3">合計：{Math.round(totalLifestyleL).toLocaleString()}L/月（約{lifestyleUsage}㎥）</p>
        </div>
      )}

      <AdBanner />

      {/* ─── 全国平均との比較 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">全国平均との比較</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl p-4 bg-blue-50 border border-blue-200">
            <p className="text-xs font-semibold text-gray-500 mb-1">{city.name}</p>
            <p className="text-2xl font-extrabold text-blue-700">{toYen(result.total)}</p>
            <p className="text-xs text-gray-500 mt-1">年間 {toYen(result.total * 12)}</p>
          </div>
          <div className="rounded-xl p-4 bg-gray-50 border border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-1">全国平均</p>
            <p className="text-2xl font-extrabold text-gray-700">{toYen(nationalResult.total)}</p>
            <p className="text-xs text-gray-500 mt-1">年間 {toYen(nationalResult.total * 12)}</p>
          </div>
        </div>
        {result.total !== nationalResult.total && (
          <p className={`text-sm text-center mt-3 font-medium ${result.total > nationalResult.total ? "text-red-600" : "text-emerald-600"}`}>
            全国平均より月{toYen(Math.abs(result.total - nationalResult.total))}
            {result.total > nationalResult.total ? "高め" : "安め"}
          </p>
        )}
      </div>

      {/* ─── 節水アドバイス ─── */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3">節水アドバイス</h2>
        <div className="space-y-3">
          {[
            {
              tip: "シャワーを1分短縮する",
              saving: showerSaving,
              desc: "1日1分短縮すると月約360L（約0.36㎥）節水",
            },
            {
              tip: "洗濯機の水量設定を適切にする",
              saving: Math.round(result.total * 0.03),
              desc: "適切な水量設定で洗濯1回あたり最大20〜30L節水",
            },
            {
              tip: "食器洗いを食洗機に切り替える",
              saving: Math.round(result.total * 0.05),
              desc: "手洗いより食洗機の方が約1/4の水量で済む場合も",
            },
          ].map(({ tip, saving, desc }) => (
            <div key={tip} className="flex gap-3 items-start">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs shrink-0">✓</div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{tip}</p>
                <p className="text-xs text-gray-500">{desc}</p>
                <p className="text-xs text-blue-700 font-medium mt-0.5">
                  月約{toYen(saving)}・年間約{toYen(saving * 12)}の節約
                </p>
              </div>
            </div>
          ))}
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
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-blue-600"
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

      <RelatedTools currentToolId="water-bill" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このツールは目安計算です。実際の水道料金は検針月・口径・各自治体の料金改定等によって異なります。
        正確な料金はご利用の水道局にご確認ください。
        このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
