"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── Types ───
type CalcMode = "simple" | "cagr";

// ─── Helpers ───
function calcReturn(
  buyPrice: number,
  sellPrice: number,
  holdYears: number,
  holdMonths: number,
  dividends: number,
  applyTax: boolean
) {
  const totalHoldYears = holdYears + holdMonths / 12;
  const capitalGain = sellPrice - buyPrice;
  const totalGain = capitalGain + dividends;

  // Tax (20.315%)
  const taxRate = 0.20315;
  const taxOnCapitalGain = Math.max(0, capitalGain) * taxRate;
  const taxOnDividends = Math.max(0, dividends) * taxRate;
  const totalTax = applyTax ? taxOnCapitalGain + taxOnDividends : 0;

  const totalGainAfterTax = totalGain - totalTax;
  const capitalGainAfterTax = capitalGain - (applyTax ? taxOnCapitalGain : 0);

  const totalReturnRate = buyPrice > 0 ? (totalGain / buyPrice) * 100 : 0;
  const totalReturnRateAfterTax = buyPrice > 0 ? (totalGainAfterTax / buyPrice) * 100 : 0;

  // CAGR: (売却価額 / 購入価額) ^ (1 / 年数) - 1
  let cagr = 0;
  if (buyPrice > 0 && sellPrice > 0 && totalHoldYears > 0) {
    cagr = (Math.pow(sellPrice / buyPrice, 1 / totalHoldYears) - 1) * 100;
  }

  // CAGR with dividends reinvested (total return CAGR)
  let cagrWithDiv = 0;
  if (buyPrice > 0 && totalHoldYears > 0 && sellPrice + dividends > 0) {
    cagrWithDiv = (Math.pow((sellPrice + dividends) / buyPrice, 1 / totalHoldYears) - 1) * 100;
  }

  // After-tax CAGR
  let cagrAfterTax = 0;
  const netProceeds = sellPrice - (applyTax ? taxOnCapitalGain : 0);
  if (buyPrice > 0 && netProceeds > 0 && totalHoldYears > 0) {
    cagrAfterTax = (Math.pow(netProceeds / buyPrice, 1 / totalHoldYears) - 1) * 100;
  }

  return {
    totalHoldYears,
    capitalGain,
    dividends,
    totalGain,
    totalGainAfterTax,
    totalReturnRate,
    totalReturnRateAfterTax,
    cagr,
    cagrWithDiv,
    cagrAfterTax,
    totalTax,
  };
}

function fmt(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

function pct(n: number): string {
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

// ─── Reference benchmarks ───
const BENCHMARKS = [
  { label: "S&P500（米国株）", rate: 10, color: "bg-blue-500" },
  { label: "日経平均（日本株）", rate: 6, color: "bg-red-500" },
  { label: "オルカン（全世界株）", rate: 8, color: "bg-green-500" },
];

// ─── FAQ data ───
const FAQS = [
  {
    q: "CAGRとは何ですか？",
    a: "CAGR（年平均成長率）は複数年の投資リターンを1年あたりの平均成長率に換算した指標です。例えば100万円が3年で150万円になった場合、CAGRは約14.5%です。単純な年次リターンの平均より正確に長期パフォーマンスを評価できます。",
  },
  {
    q: "良い投資利回りの目安はどのくらいですか？",
    a: "インフレ率（日本では約2%）を上回ることが最低ラインとされます。インデックス投資では年利5〜10%が長期的な目安です。ただし過去の実績が将来を保証するものではありません。",
  },
  {
    q: "インデックス投資の平均リターンはどのくらいですか？",
    a: "長期の歴史的データでは、S&P500が年率約10%、全世界株（オルカン）が年率約8%、日経平均が年率約6%とされています。ただし為替変動・税金・信託報酬などを差し引いた実質リターンはさらに低くなる点に注意が必要です。",
  },
  {
    q: "税引後リターンはどうやって計算しますか？",
    a: "日本では株式・投資信託の売却益・配当金に対して約20.315%（所得税15.315%＋住民税5%）の税金がかかります。税引後リターン = 税引前利益 × (1 - 0.20315) で計算できます。NISAを活用すると非課税で運用でき、実質リターンを高められます。",
  },
];

// ─── Component ───
export default function InvestmentReturn() {
  const [calcMode, setCalcMode] = useState<CalcMode>("simple");
  const [buyPrice, setBuyPrice] = useState(1000000);
  const [sellPrice, setSellPrice] = useState(1500000);
  const [holdYears, setHoldYears] = useState(5);
  const [holdMonths, setHoldMonths] = useState(0);
  const [dividends, setDividends] = useState(0);
  const [applyTax, setApplyTax] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(
    () => calcReturn(buyPrice, sellPrice, holdYears, holdMonths, dividends, applyTax),
    [buyPrice, sellPrice, holdYears, holdMonths, dividends, applyTax]
  );

  const isProfit = result.totalGain >= 0;
  const resultColor = isProfit ? "text-green-700" : "text-red-600";
  const resultBg = isProfit ? "from-green-50 to-teal-50 border-green-200" : "from-red-50 to-orange-50 border-red-200";

  const handleBuyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value.replace(/[^0-9]/g, ""));
    if (!isNaN(v)) setBuyPrice(v);
  };
  const handleSellInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value.replace(/[^0-9]/g, ""));
    if (!isNaN(v)) setSellPrice(v);
  };

  // Benchmark bar max
  const maxBenchRate = Math.max(...BENCHMARKS.map((b) => b.rate), Math.abs(result.cagr), 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">💹</span>
          <h1 className="text-2xl font-bold">投資リターン計算</h1>
        </div>
        <p className="text-green-100 text-sm">
          購入・売却価格と保有期間からCAGR（年率リターン）を計算。税引後リターン・配当込みトータルリターンも算出。
        </p>
      </div>

      {/* Mode tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {(["simple", "cagr"] as CalcMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setCalcMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
              calcMode === m
                ? "bg-white text-green-700 shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "simple" ? "シンプル計算" : "CAGR（年率）"}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
        {/* 購入価格 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">購入価格（円）</label>
          <input
            type="text"
            inputMode="numeric"
            value={buyPrice.toLocaleString("ja-JP")}
            onChange={handleBuyInput}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* 売却価格 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">売却価格（円）</label>
          <input
            type="text"
            inputMode="numeric"
            value={sellPrice.toLocaleString("ja-JP")}
            onChange={handleSellInput}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* 保有期間 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">保有期間</label>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 flex-1">
              <input
                type="number"
                min={0}
                max={100}
                value={holdYears}
                onChange={(e) => setHoldYears(Math.max(0, Number(e.target.value)))}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <span className="text-gray-500 text-sm shrink-0">年</span>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <input
                type="number"
                min={0}
                max={11}
                value={holdMonths}
                onChange={(e) => setHoldMonths(Math.min(11, Math.max(0, Number(e.target.value))))}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <span className="text-gray-500 text-sm shrink-0">ヶ月</span>
            </div>
          </div>
        </div>

        {/* 受取配当金 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            受取配当金合計（円）<span className="text-gray-400 font-normal ml-1">任意</span>
          </label>
          <input
            type="number"
            min={0}
            value={dividends}
            onChange={(e) => setDividends(Math.max(0, Number(e.target.value)))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right font-bold focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* 税金控除 toggle */}
        <div className="flex items-center justify-between py-2 border-t border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-700">税金控除（20.315%）を適用</p>
            <p className="text-xs text-gray-400">所得税15.315% ＋ 住民税5%</p>
          </div>
          <button
            onClick={() => setApplyTax(!applyTax)}
            className={`w-12 h-6 rounded-full transition-colors relative ${
              applyTax ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                applyTax ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Results */}
      <div className={`bg-gradient-to-br ${resultBg} border rounded-2xl p-6 mb-6`}>
        <h2 className="text-base font-bold text-gray-700 mb-4">計算結果</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* 総リターン */}
          <div className="bg-white bg-opacity-70 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">総リターン（円）</p>
            <p className={`text-xl font-extrabold ${resultColor}`}>
              {result.totalGain >= 0 ? "+" : ""}
              {fmt(result.totalGain)}
            </p>
          </div>
          {/* 総リターン率 */}
          <div className="bg-white bg-opacity-70 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500 mb-1">総リターン率</p>
            <p className={`text-xl font-extrabold ${resultColor}`}>
              {pct(result.totalReturnRate)}
            </p>
          </div>

          {/* CAGR（calcModeがcagrの場合のみ強調） */}
          <div className={`bg-white bg-opacity-70 rounded-xl p-3 text-center ${calcMode === "cagr" ? "col-span-2" : ""}`}>
            <p className="text-xs text-gray-500 mb-1">年率リターン（CAGR）</p>
            <p className={`${calcMode === "cagr" ? "text-3xl" : "text-xl"} font-extrabold ${resultColor}`}>
              {pct(result.cagr)}
            </p>
            {calcMode === "cagr" && (
              <p className="text-xs text-gray-400 mt-1">
                保有期間: {result.totalHoldYears.toFixed(1)}年
              </p>
            )}
          </div>

          {calcMode !== "cagr" && (
            <div className="bg-white bg-opacity-70 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">配当込みCAGR</p>
              <p className={`text-xl font-extrabold ${resultColor}`}>
                {pct(result.cagrWithDiv)}
              </p>
            </div>
          )}

          {/* 税引後 */}
          {applyTax && (
            <>
              <div className="bg-white bg-opacity-70 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">税引後リターン（円）</p>
                <p className={`text-xl font-extrabold ${result.totalGainAfterTax >= 0 ? "text-green-700" : "text-red-600"}`}>
                  {result.totalGainAfterTax >= 0 ? "+" : ""}
                  {fmt(result.totalGainAfterTax)}
                </p>
              </div>
              <div className="bg-white bg-opacity-70 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">税引後リターン率</p>
                <p className={`text-xl font-extrabold ${result.totalReturnRateAfterTax >= 0 ? "text-green-700" : "text-red-600"}`}>
                  {pct(result.totalReturnRateAfterTax)}
                </p>
              </div>
              <div className="bg-white bg-opacity-70 rounded-xl p-3 text-center col-span-2">
                <p className="text-xs text-gray-500 mb-1">税引後CAGR</p>
                <p className={`text-xl font-extrabold ${result.cagrAfterTax >= 0 ? "text-green-700" : "text-red-600"}`}>
                  {pct(result.cagrAfterTax)}
                </p>
                <p className="text-xs text-gray-400 mt-1">税額合計: {fmt(result.totalTax)}</p>
              </div>
            </>
          )}
        </div>
      </div>

      <AdBanner />

      {/* Benchmark comparison */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          主要インデックスとの比較
          <span className="text-xs font-normal text-gray-400 ml-2">（過去平均リターン）</span>
        </h2>
        <div className="space-y-4">
          {/* Your CAGR */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">あなたの投資（CAGR）</span>
              <span className={`font-bold ${isProfit ? "text-green-600" : "text-red-600"}`}>
                {pct(result.cagr)}/年
              </span>
            </div>
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${isProfit ? "bg-green-500" : "bg-red-400"}`}
                style={{ width: `${Math.min(100, Math.max(0, (Math.abs(result.cagr) / maxBenchRate) * 100))}%` }}
              />
            </div>
          </div>
          {BENCHMARKS.map((b) => {
            const barWidth = (b.rate / maxBenchRate) * 100;
            return (
              <div key={b.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{b.label}</span>
                  <span className="font-semibold text-gray-700">約{b.rate}%/年</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${b.color} opacity-70`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※ インデックスの数値は長期的な過去平均であり、将来のリターンを保証するものではありません。
        </p>
      </div>

      {/* FAQ */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-green-600"
              >
                <span>{faq.q}</span>
                <span className="text-gray-400 ml-2 shrink-0 text-base">
                  {openFaq === i ? "−" : "＋"}
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="investment-return" />

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ 本ツールの計算結果は概算です。正確な金額は税理士・ファイナンシャルプランナーにご相談ください。
        投資は元本割れのリスクがあります。過去の実績は将来の運用成果を保証するものではありません。
      </p>
    </div>
  );
}
