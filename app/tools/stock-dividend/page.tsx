"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 定数
const TAX_RATE = 0.20315;

const FAQS = [
  {
    question: "配当金にはどのくらい税金がかかりますか？",
    answer:
      "特定口座（源泉徴収あり）では所得税15%＋住民税5%＋復興特別所得税0.315%の合計20.315%が源泉徴収されます。NISA口座内の配当金は非課税です。",
  },
  {
    question: "配当利回りとは何ですか？",
    answer:
      "1株当たり年間配当金÷株価×100で計算されます。例えば株価1,000円で年間配当30円なら利回り3%です。一般的に利回り3〜5%以上を高配当株と呼びます。",
  },
  {
    question: "配当金はいつもらえますか？",
    answer:
      "企業が定める配当基準日（多くは3月末や9月末）に株式を保有していると受け取れます。実際の入金は基準日から約2〜3ヶ月後が一般的です。",
  },
  {
    question: "配当金で生活するには何株必要ですか？",
    answer:
      "年間生活費を配当利回りで割ると必要な投資額が計算できます。月20万円（年240万円）の配当を得るために利回り3%なら8,000万円、5%なら4,800万円の投資が必要です。",
  },
];

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

function formatMan(n: number): string {
  const man = Math.round(n / 10_000);
  return `${man.toLocaleString("ja-JP")}万円`;
}

type AccountType = "nisa" | "tokutei" | "ippan";
type DividendFreq = 1 | 2 | 4;

export default function StockDividendCalc() {
  const [mode, setMode] = useState<"dividend" | "reverse">("dividend");

  // ── 配当金計算モード
  const [stockPrice, setStockPrice] = useState(2000);
  const [dividendPerShare, setDividendPerShare] = useState(60);
  const [yieldInput, setYieldInput] = useState(3);
  const [useYieldInput, setUseYieldInput] = useState(false);
  const [shares, setShares] = useState(100);
  const [accountType, setAccountType] = useState<AccountType>("tokutei");
  const [freq, setFreq] = useState<DividendFreq>(2);

  // ── 逆算モード
  const [targetMonthly, setTargetMonthly] = useState(100_000);
  const [reverseYield, setReverseYield] = useState(3);
  const [reverseAccount, setReverseAccount] = useState<AccountType>("tokutei");
  const [reverseStockPrice, setReverseStockPrice] = useState(2000);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ── 計算（配当金モード）
  const result = useMemo(() => {
    const effectiveDividend = useYieldInput
      ? (stockPrice * yieldInput) / 100
      : dividendPerShare;
    const effectiveYield =
      stockPrice > 0 ? (effectiveDividend / stockPrice) * 100 : 0;

    const annualGross = effectiveDividend * shares;
    const taxAmount =
      accountType === "nisa" ? 0 : annualGross * TAX_RATE;
    const annualNet = annualGross - taxAmount;
    const monthlyNet = annualNet / 12;
    const tenYearTotal = annualNet * 10;
    const perPayment = annualNet / freq;

    return {
      effectiveDividend,
      effectiveYield,
      annualGross,
      taxAmount,
      annualNet,
      monthlyNet,
      tenYearTotal,
      perPayment,
    };
  }, [
    stockPrice,
    dividendPerShare,
    yieldInput,
    useYieldInput,
    shares,
    accountType,
    freq,
  ]);

  // ── 計算（逆算モード）
  const reverseResult = useMemo(() => {
    const targetAnnual = targetMonthly * 12;
    const grossNeeded =
      reverseAccount === "nisa"
        ? targetAnnual
        : targetAnnual / (1 - TAX_RATE);
    const investmentNeeded =
      reverseYield > 0 ? (grossNeeded / reverseYield) * 100 : 0;
    const sharesNeeded =
      reverseStockPrice > 0
        ? Math.ceil(investmentNeeded / reverseStockPrice)
        : 0;

    // 利回り別テーブル
    const yieldTable = [1, 2, 3, 4, 5, 6, 7, 8].map((y) => {
      const gross =
        reverseAccount === "nisa"
          ? targetAnnual
          : targetAnnual / (1 - TAX_RATE);
      const inv = y > 0 ? (gross / y) * 100 : 0;
      return { yield: y, investment: inv };
    });

    return { grossNeeded, investmentNeeded, sharesNeeded, yieldTable };
  }, [targetMonthly, reverseYield, reverseAccount, reverseStockPrice]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヘッダー ─── */}
      <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">💴</span>
          <div>
            <h1 className="text-2xl font-extrabold">配当金・株式利回り計算</h1>
            <p className="text-sm opacity-90">
              税引後手取り額 / 必要投資額を逆算
            </p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── モード切替 ─── */}
      <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
        {(
          [
            { key: "dividend", label: "配当金計算" },
            { key: "reverse", label: "必要投資額逆算" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              mode === key
                ? "bg-amber-500 text-white"
                : "bg-white text-gray-600 hover:bg-amber-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ════════════════════════════════════
          配当金計算モード
      ════════════════════════════════════ */}
      {mode === "dividend" && (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
            {/* 株価 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                株価（円）
              </label>
              <input
                type="number"
                min={1}
                value={stockPrice}
                onChange={(e) => setStockPrice(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* 配当入力切替 */}
            <div>
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => setUseYieldInput(false)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    !useYieldInput
                      ? "bg-amber-500 text-white border-amber-500"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  1株配当で入力
                </button>
                <button
                  onClick={() => setUseYieldInput(true)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                    useYieldInput
                      ? "bg-amber-500 text-white border-amber-500"
                      : "border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  利回りで入力
                </button>
              </div>
              {!useYieldInput ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    1株当たり年間配当金（円）
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={dividendPerShare}
                    onChange={(e) =>
                      setDividendPerShare(Number(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    自動計算: 配当利回り{" "}
                    <strong className="text-amber-600">
                      {stockPrice > 0
                        ? ((dividendPerShare / stockPrice) * 100).toFixed(2)
                        : "0.00"}
                      %
                    </strong>
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    配当利回り（%）
                  </label>
                  <input
                    type="range"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={yieldInput}
                    onChange={(e) => setYieldInput(Number(e.target.value))}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer accent-amber-500 bg-gradient-to-r from-amber-100 to-amber-400"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0.1%</span>
                    <span>3%</span>
                    <span>5%</span>
                    <span>8%</span>
                    <span>10%</span>
                  </div>
                  <p className="text-center text-sm font-semibold text-amber-600 mt-1">
                    {yieldInput}% ={" "}
                    {Math.round((stockPrice * yieldInput) / 100).toLocaleString(
                      "ja-JP"
                    )}
                    円/株
                  </p>
                </div>
              )}
            </div>

            {/* 保有株数 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                保有株数
              </label>
              <input
                type="number"
                min={1}
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <p className="text-xs text-gray-400 mt-1">
                投資総額:{" "}
                {(stockPrice * shares).toLocaleString("ja-JP")}円
              </p>
            </div>

            {/* 口座種別 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                口座種別
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { key: "nisa", label: "NISA", sub: "非課税" },
                    {
                      key: "tokutei",
                      label: "特定口座",
                      sub: "20.315%課税",
                    },
                    {
                      key: "ippan",
                      label: "一般口座",
                      sub: "20.315%課税",
                    },
                  ] as const
                ).map(({ key, label, sub }) => (
                  <button
                    key={key}
                    onClick={() => setAccountType(key)}
                    className={`py-2 px-1 rounded-xl border text-center transition-colors ${
                      accountType === key
                        ? "bg-amber-500 text-white border-amber-500"
                        : "border-gray-200 text-gray-600 hover:bg-amber-50"
                    }`}
                  >
                    <div className="text-sm font-bold">{label}</div>
                    <div className="text-xs opacity-80">{sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 配当回数 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                配当回数
              </label>
              <div className="flex gap-2">
                {([1, 2, 4] as DividendFreq[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFreq(f)}
                    className={`flex-1 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                      freq === f
                        ? "bg-amber-500 text-white border-amber-500"
                        : "border-gray-200 text-gray-600 hover:bg-amber-50"
                    }`}
                  >
                    年{f}回
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── 結果ヒーロー ── */}
          <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <p className="text-sm font-medium opacity-90 mb-1">
              年間配当金（税引後手取り）
            </p>
            <p className="text-5xl font-extrabold tracking-tight mb-1">
              {formatYen(result.annualNet)}
            </p>
            <p className="text-sm opacity-75 mb-4">
              月換算: {formatYen(result.monthlyNet)} / 月
            </p>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30 text-center">
              <div>
                <p className="text-xs opacity-75">税引前</p>
                <p className="text-lg font-bold">
                  {formatYen(result.annualGross)}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-75">税金</p>
                <p className="text-lg font-bold text-red-200">
                  {accountType === "nisa"
                    ? "¥0（非課税）"
                    : `-${formatYen(result.taxAmount)}`}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-75">配当利回り</p>
                <p className="text-lg font-bold text-yellow-200">
                  {result.effectiveYield.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* ── サブカード ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-xs text-amber-600 mb-1 font-medium">
                1回当たり受取額
              </p>
              <p className="text-xl font-bold text-amber-800">
                {formatYen(result.perPayment)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">年{freq}回配当</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-xs text-yellow-700 mb-1 font-medium">
                月換算手取り
              </p>
              <p className="text-xl font-bold text-yellow-800">
                {formatYen(result.monthlyNet)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">/ 月</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-center shadow-sm col-span-2 sm:col-span-1">
              <p className="text-xs text-orange-600 mb-1 font-medium">
                10年間累計受取額
              </p>
              <p className="text-xl font-bold text-orange-800">
                {formatMan(result.tenYearTotal)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                税引後 × 10年
              </p>
            </div>
          </div>
        </>
      )}

      {/* ════════════════════════════════════
          逆算モード
      ════════════════════════════════════ */}
      {mode === "reverse" && (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
            {/* 目標月収 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目標月収（税引後）
              </label>
              <input
                type="range"
                min={10_000}
                max={500_000}
                step={10_000}
                value={targetMonthly}
                onChange={(e) => setTargetMonthly(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer accent-amber-500 bg-gradient-to-r from-amber-100 to-amber-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1万</span>
                <span>10万</span>
                <span>20万</span>
                <span>30万</span>
                <span>50万</span>
              </div>
              <p className="text-center text-3xl font-extrabold text-amber-700 mt-2">
                月 {targetMonthly.toLocaleString("ja-JP")} 円
              </p>
              <p className="text-center text-xs text-gray-500 mt-0.5">
                年間: {(targetMonthly * 12).toLocaleString("ja-JP")}円
              </p>
            </div>

            {/* 想定利回り */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                想定配当利回り（%）
              </label>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={reverseYield}
                onChange={(e) => setReverseYield(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer accent-amber-400 bg-gradient-to-r from-amber-100 to-amber-400"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1%</span>
                <span>3%</span>
                <span>5%</span>
                <span>8%</span>
                <span>10%</span>
              </div>
              <p className="text-center text-sm font-semibold text-amber-600 mt-1">
                年 {reverseYield}%
              </p>
            </div>

            {/* 口座種別 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                口座種別
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { key: "nisa", label: "NISA", sub: "非課税" },
                    {
                      key: "tokutei",
                      label: "特定口座",
                      sub: "20.315%",
                    },
                    { key: "ippan", label: "一般口座", sub: "20.315%" },
                  ] as const
                ).map(({ key, label, sub }) => (
                  <button
                    key={key}
                    onClick={() => setReverseAccount(key)}
                    className={`py-2 rounded-xl border text-center transition-colors ${
                      reverseAccount === key
                        ? "bg-amber-500 text-white border-amber-500"
                        : "border-gray-200 text-gray-600 hover:bg-amber-50"
                    }`}
                  >
                    <div className="text-sm font-bold">{label}</div>
                    <div className="text-xs opacity-80">{sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 株価（株数計算用） */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                株価（円）— 必要株数を計算
              </label>
              <input
                type="number"
                min={1}
                value={reverseStockPrice}
                onChange={(e) =>
                  setReverseStockPrice(Number(e.target.value))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* 結果カード */}
          <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <p className="text-sm font-medium opacity-90 mb-1">
              必要な投資元本
            </p>
            <p className="text-5xl font-extrabold tracking-tight mb-1">
              {formatMan(reverseResult.investmentNeeded)}
            </p>
            <p className="text-sm opacity-75 mb-4">
              {formatYen(reverseResult.investmentNeeded)}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/30 text-center">
              <div>
                <p className="text-xs opacity-75">必要株数</p>
                <p className="text-2xl font-bold">
                  {reverseResult.sharesNeeded.toLocaleString("ja-JP")}株
                </p>
              </div>
              <div>
                <p className="text-xs opacity-75">
                  税引前に必要な年間配当
                </p>
                <p className="text-2xl font-bold">
                  {formatYen(reverseResult.grossNeeded)}
                </p>
              </div>
            </div>
          </div>

          {/* 利回り別テーブル */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              利回り別 必要投資額
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              目標月収 {targetMonthly.toLocaleString("ja-JP")}円（税引後）達成に必要な元本
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="text-left py-2 px-2 font-medium">利回り</th>
                    <th className="text-right py-2 px-2 font-medium">
                      必要投資額
                    </th>
                    <th className="text-right py-2 px-2 font-medium hidden sm:table-cell">
                      必要株数
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reverseResult.yieldTable.map(({ yield: y, investment }) => {
                    const sh =
                      reverseStockPrice > 0
                        ? Math.ceil(investment / reverseStockPrice)
                        : 0;
                    return (
                      <tr
                        key={y}
                        className={`border-b border-gray-100 ${
                          y === reverseYield
                            ? "bg-amber-50 font-bold"
                            : ""
                        }`}
                      >
                        <td
                          className={`py-2.5 px-2 ${
                            y === reverseYield
                              ? "text-amber-700"
                              : "text-gray-700"
                          }`}
                        >
                          {y}%
                        </td>
                        <td
                          className={`py-2.5 px-2 text-right ${
                            y === reverseYield
                              ? "text-amber-700 font-extrabold"
                              : "text-gray-700"
                          }`}
                        >
                          {formatMan(investment)}
                        </td>
                        <td className="py-2.5 px-2 text-right text-gray-600 hidden sm:table-cell">
                          {sh.toLocaleString("ja-JP")}株
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <AdBanner />

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
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-amber-600 transition-colors"
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

      <RelatedTools currentToolId="stock-dividend" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このツールは概算です。実際の配当金・税額は株式の種類・証券会社・確定申告の有無などにより異なります。
        投資判断は自己責任でお願いします。配当金は企業の業績により減額・無配になる場合があります。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
