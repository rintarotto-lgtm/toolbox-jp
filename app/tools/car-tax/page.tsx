"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 排気量別税額テーブル
const CC_TAX_TABLE = [
  { label: "〜1,000cc", cc: 1000, tax: 25_000 },
  { label: "〜1,500cc", cc: 1500, tax: 30_500 },
  { label: "〜2,000cc", cc: 2000, tax: 36_000 },
  { label: "〜2,500cc", cc: 2500, tax: 43_500 },
  { label: "〜3,000cc", cc: 3000, tax: 50_000 },
  { label: "〜3,500cc", cc: 3500, tax: 57_000 },
  { label: "〜4,000cc", cc: 4000, tax: 65_500 },
  { label: "〜4,500cc", cc: 4500, tax: 75_500 },
  { label: "〜6,000cc", cc: 6000, tax: 87_000 },
  { label: "6,000cc超", cc: 9999, tax: 110_000 },
];

// ─── 環境性能割税率
const KANKYO_RATES: { label: string; rate: number }[] = [
  { label: "非課税（EV・一定のHV）", rate: 0 },
  { label: "1%（燃費基準達成車）", rate: 0.01 },
  { label: "2%（一般車）", rate: 0.02 },
  { label: "3%（旧燃費基準車）", rate: 0.03 },
];

// ─── グリーン化特例
const ECO_DISCOUNTS = [
  { label: "なし", factor: 1.0 },
  { label: "25%減（燃費基準達成）", factor: 0.75 },
  { label: "50%減（+10%達成）", factor: 0.5 },
  { label: "75%減（+20%達成）", factor: 0.25 },
];

// ─── FAQ
const FAQS = [
  {
    question: "自動車税の計算方法を教えてください",
    answer:
      "自動車税（種別割）は排気量によって年税額が決まります。1,000cc以下は年25,000円、2,000cc以下は36,000円などと段階的に設定されています。軽自動車は一律10,800円です。年度途中の登録では月割り計算となります。",
  },
  {
    question: "排気量による自動車税の違いを教えてください",
    answer:
      "普通車の税額は1,000cc以下：25,000円、1,500cc以下：30,500円、2,000cc以下：36,000円、2,500cc以下：43,500円、3,000cc以下：50,000円、4,000cc以下：65,500円、6,000cc以下：87,000円、6,000cc超：110,000円です。軽自動車は一律10,800円です。",
  },
  {
    question: "環境性能割とは何ですか？",
    answer:
      "環境性能割は自動車の取得時にかかる税金で、取得価格に燃費性能に応じた税率（非課税〜3%）を掛けて計算します。電気自動車やハイブリッド車は非課税になる場合があります。",
  },
  {
    question: "自動車税の月割り計算はどうやって行いますか？",
    answer:
      "自動車税は4月1日を基準日として課税されます。年度途中に新規登録した場合は月割りで課税され、登録月の翌月から3月末までの月数分の税額が課税されます。例えば10月登録の場合、11月〜3月の5ヶ月分です。",
  },
];

type VehicleType = "普通車" | "軽自動車";

function toYen(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

export default function CarTax() {
  const [vehicleType, setVehicleType] = useState<VehicleType>("普通車");
  const [selectedCC, setSelectedCC] = useState(1);  // index in CC_TAX_TABLE
  const [registrationMonth, setRegistrationMonth] = useState(4);
  const [ecoDiscountIdx, setEcoDiscountIdx] = useState(0);
  const [kankyoRateIdx, setKankyoRateIdx] = useState(2);
  const [acquisitionPrice, setAcquisitionPrice] = useState(3_000_000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const annualTaxBase = useMemo(() => {
    return vehicleType === "軽自動車" ? 10_800 : CC_TAX_TABLE[selectedCC].tax;
  }, [vehicleType, selectedCC]);

  // グリーン化特例後
  const discountedTax = useMemo(
    () => Math.floor(annualTaxBase * ECO_DISCOUNTS[ecoDiscountIdx].factor),
    [annualTaxBase, ecoDiscountIdx]
  );

  // 月割り計算：登録月の翌月から3月末まで
  const proratedTax = useMemo(() => {
    // 4月登録なら12ヶ月分（全額）
    // 5月登録なら11ヶ月分、...、3月登録なら0ヶ月分
    const months =
      registrationMonth === 4
        ? 12
        : registrationMonth <= 3
        ? 3 - registrationMonth
        : 15 - registrationMonth;
    return Math.floor(discountedTax * months / 12);
  }, [discountedTax, registrationMonth]);

  const proratedMonths = useMemo(() => {
    return registrationMonth === 4
      ? 12
      : registrationMonth <= 3
      ? 3 - registrationMonth
      : 15 - registrationMonth;
  }, [registrationMonth]);

  // 環境性能割
  const kankyoTax = useMemo(
    () => Math.floor(acquisitionPrice * KANKYO_RATES[kankyoRateIdx].rate),
    [acquisitionPrice, kankyoRateIdx]
  );

  const totalFirstYear = proratedTax + kankyoTax;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        自動車税計算シミュレーター
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        排気量から自動車税を計算。月割り・環境性能割・グリーン化特例にも対応。
      </p>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-7">

        {/* 車種 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            車種
          </label>
          <div className="flex gap-2">
            {(["普通車", "軽自動車"] as VehicleType[]).map((type) => (
              <button
                key={type}
                onClick={() => setVehicleType(type)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  vehicleType === type
                    ? "bg-blue-500 text-white border-blue-500 shadow"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-blue-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 排気量（普通車のみ） */}
        {vehicleType === "普通車" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              排気量
            </label>
            <select
              value={selectedCC}
              onChange={(e) => setSelectedCC(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {CC_TAX_TABLE.map((row, i) => (
                <option key={i} value={i}>
                  {row.label}　→　年税額 {toYen(row.tax)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* 新規登録月 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            新規登録月（月割り計算）
          </label>
          <select
            value={registrationMonth}
            onChange={(e) => setRegistrationMonth(Number(e.target.value))}
            className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {m}月登録
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            4月登録は年額全額。5月以降は翌3月末までの月割りとなります。
          </p>
        </div>

        {/* グリーン化特例 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            グリーン化特例（減税）
          </label>
          <div className="grid grid-cols-2 gap-2">
            {ECO_DISCOUNTS.map((d, i) => (
              <button
                key={i}
                onClick={() => setEcoDiscountIdx(i)}
                className={`py-2 px-3 rounded-xl text-sm border transition-colors ${
                  ecoDiscountIdx === i
                    ? "bg-blue-500 text-white border-blue-500 shadow"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-blue-50"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 環境性能割 */}
        <div className="border-t border-gray-100 pt-6">
          <h3 className="text-sm font-bold text-gray-700 mb-4">
            環境性能割（取得時にかかる税金）
          </h3>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-sm font-medium text-gray-700">
                取得価格（課税標準額）
              </label>
              <span className="text-xl font-extrabold text-blue-600">
                {(acquisitionPrice / 10_000).toLocaleString()}万円
              </span>
            </div>
            <input
              type="range"
              min={500_000}
              max={5_000_000}
              step={100_000}
              value={acquisitionPrice}
              onChange={(e) => setAcquisitionPrice(Number(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer accent-blue-500
                [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
                bg-gradient-to-r from-blue-200 to-blue-400"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>50万</span>
              <span>150万</span>
              <span>300万</span>
              <span>500万</span>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              燃費区分（環境性能割税率）
            </label>
            <select
              value={kankyoRateIdx}
              onChange={(e) => setKankyoRateIdx(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {KANKYO_RATES.map((r, i) => (
                <option key={i} value={i}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── ヒーローカード ─── */}
      <div className="rounded-2xl p-6 mb-6 text-white shadow-lg bg-gradient-to-br from-blue-500 to-cyan-500">
        <p className="text-sm font-medium opacity-90 mb-1">初年度合計税額（目安）</p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">
          {toYen(totalFirstYear)}
        </p>
        <div className="pt-4 border-t border-white/30 mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs opacity-75">
              自動車税（{proratedMonths}ヶ月分）
            </p>
            <p className="text-2xl font-bold">{toYen(proratedTax)}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">環境性能割</p>
            <p className="text-2xl font-bold">{toYen(kankyoTax)}</p>
          </div>
        </div>
        {ecoDiscountIdx > 0 && (
          <p className="text-sm opacity-80 mt-3">
            グリーン化特例適用後 ／ 年税額（通常）：{toYen(annualTaxBase)}
          </p>
        )}
      </div>

      {/* ─── 月割り詳細 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">月割り計算の詳細</h2>
        <div className="space-y-2 text-sm">
          {[
            {
              label: "年税額（通常）",
              value: toYen(annualTaxBase),
              highlight: false,
            },
            ecoDiscountIdx > 0
              ? {
                  label: `グリーン化特例（${ECO_DISCOUNTS[ecoDiscountIdx].label}）後`,
                  value: toYen(discountedTax),
                  highlight: false,
                }
              : null,
            {
              label: `月割り係数（${proratedMonths}ヶ月 / 12ヶ月）`,
              value: `× ${proratedMonths}/12`,
              highlight: false,
            },
            {
              label: `初年度自動車税（${proratedMonths}ヶ月分）`,
              value: toYen(proratedTax),
              highlight: true,
            },
          ]
            .filter(Boolean)
            .map((row) => (
              <div
                key={row!.label}
                className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${
                  row!.highlight ? "font-bold text-blue-700" : "text-gray-700"
                }`}
              >
                <span>{row!.label}</span>
                <span className={row!.highlight ? "text-lg" : ""}>{row!.value}</span>
              </div>
            ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※ 4月登録の場合は年額全額。5月以降は翌3月末までの月数に応じた月割り課税となります。
        </p>
      </div>

      <AdBanner />

      {/* ─── 排気量別年税額テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          排気量別の自動車税（年額）
        </h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">排気量</th>
                <th className="text-right py-2 px-2 font-medium">年税額</th>
                <th className="text-right py-2 px-2 font-medium">月割換算</th>
              </tr>
            </thead>
            <tbody>
              {CC_TAX_TABLE.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 last:border-0 transition-colors hover:bg-blue-50 ${
                    vehicleType === "普通車" && selectedCC === i
                      ? "bg-blue-50 font-semibold"
                      : ""
                  }`}
                >
                  <td className="py-2.5 px-2 text-gray-700">{row.label}</td>
                  <td className="py-2.5 px-2 text-right font-semibold text-blue-700">
                    {toYen(row.tax)}
                  </td>
                  <td className="py-2.5 px-2 text-right text-gray-500">
                    {toYen(Math.floor(row.tax / 12))}/月
                  </td>
                </tr>
              ))}
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="py-2.5 px-2 text-gray-700 font-medium">
                  軽自動車
                </td>
                <td className="py-2.5 px-2 text-right font-semibold text-blue-700">
                  {toYen(10_800)}
                </td>
                <td className="py-2.5 px-2 text-right text-gray-500">
                  {toYen(Math.floor(10_800 / 12))}/月
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 年間維持費概算 ─── */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          年間維持費の概算（参考）
        </h2>
        <div className="space-y-2 text-sm">
          {[
            {
              label: "自動車税（年額）",
              value: toYen(discountedTax),
            },
            {
              label: "自動車重量税（2年車検の場合 / 概算）",
              value: vehicleType === "軽自動車" ? "¥6,600" : "¥16,400〜",
            },
            {
              label: "自動車保険（任意保険・概算）",
              value: "¥50,000〜¥100,000",
            },
            {
              label: "車検費用（2年に1回 / 概算）",
              value: vehicleType === "軽自動車" ? "¥30,000〜" : "¥50,000〜",
            },
          ].map((row) => (
            <div
              key={row.label}
              className="flex justify-between items-center py-2 border-b border-blue-100 last:border-0 text-gray-700"
            >
              <span>{row.label}</span>
              <span className="font-semibold text-blue-700">{row.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          ※ 重量税・車検費用は車種・年式・整備内容により大きく異なります。あくまで目安です。
        </p>
      </div>

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
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
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="car-tax" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは目安計算です。実際の税額は車種・登録内容・適用される特例によって異なります。
        正確な税額は各都道府県の税事務所にご確認ください。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
