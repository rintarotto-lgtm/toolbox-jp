"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 定数
const TAX_RATE = 0.20315;

type AccountType = "nisa" | "tokutei-gen" | "tokutei-nogen" | "ippan";

const ACCOUNT_LABELS: Record<AccountType, string> = {
  nisa: "NISA（非課税）",
  "tokutei-gen": "特定口座（源泉徴収あり）",
  "tokutei-nogen": "特定口座（源泉徴収なし）",
  ippan: "一般口座",
};

interface Stock {
  id: number;
  name: string;
  acquisitionTotal: number;
  saleTotal: number;
  account: AccountType;
}

// ─── 計算ロジック（1銘柄）
function calcSingle(
  acquisitionPricePerShare: number,
  salePricePerShare: number,
  shares: number,
  buyFee: number,
  sellFee: number,
  account: AccountType
) {
  const acquisitionTotal = acquisitionPricePerShare * shares + buyFee;
  const saleTotal = salePricePerShare * shares - sellFee;
  const gain = saleTotal - acquisitionTotal;
  const isTaxable = account !== "nisa" && gain > 0;
  const tax = isTaxable ? Math.round(gain * TAX_RATE) : 0;
  const netProfit = gain - tax;
  const returnRate =
    acquisitionTotal > 0 ? ((saleTotal - acquisitionTotal) / acquisitionTotal) * 100 : 0;
  const netReturnRate =
    acquisitionTotal > 0 ? (netProfit / acquisitionTotal) * 100 : 0;

  return {
    acquisitionTotal: Math.round(acquisitionTotal),
    saleTotal: Math.round(saleTotal),
    gain: Math.round(gain),
    tax,
    netProfit: Math.round(netProfit),
    returnRate,
    netReturnRate,
    needsTaxReturn: account === "tokutei-nogen" || account === "ippan",
    isNisa: account === "nisa",
  };
}

// ─── 損益通算
function calcOffset(stocks: Stock[]) {
  let totalGain = 0;
  let totalLoss = 0;
  let nisaGain = 0;

  for (const s of stocks) {
    const gain = s.saleTotal - s.acquisitionTotal;
    if (s.account === "nisa") {
      nisaGain += gain;
    } else if (gain >= 0) {
      totalGain += gain;
    } else {
      totalLoss += gain; // negative
    }
  }

  const netTaxable = Math.max(0, totalGain + totalLoss);
  const tax = Math.round(netTaxable * TAX_RATE);
  const netIncome = totalGain + totalLoss - tax;

  return {
    totalGain: Math.round(totalGain),
    totalLoss: Math.round(totalLoss),
    nisaGain: Math.round(nisaGain),
    netTaxable: Math.round(netTaxable),
    tax,
    netIncome: Math.round(netIncome),
    hasLoss: totalLoss < 0,
  };
}

// ─── FAQ
const FAQS = [
  {
    question: "株式の売却益にかかる税率はいくらですか？",
    answer:
      "特定口座（源泉徴収あり）では所得税15%＋住民税5%＋復興特別所得税0.315%の合計20.315%が自動徴収されます。NISA口座内の利益は非課税です。",
  },
  {
    question: "株式の損益通算とは何ですか？",
    answer:
      "同年内の株式・投資信託の損失と利益を相殺することです。例えばA株で30万円の利益、B株で10万円の損失があれば、課税対象は差引20万円になります。",
  },
  {
    question: "株式の損失繰越とは何ですか？",
    answer:
      "年間の損益が損失になった場合、確定申告することで翌年以降3年間の利益と相殺できます。特定口座（源泉徴収なし）または一般口座は毎年確定申告が必要です。",
  },
  {
    question: "取得費が不明な場合はどうなりますか？",
    answer:
      "取得費が不明な場合は売却代金の5%を取得費とみなして計算します（概算取得費）。実際の取得費がこれより高ければ実際の額を使う方が有利です。",
  },
];

function fmt(n: number) {
  return n.toLocaleString("ja-JP");
}

let nextId = 4;

export default function StockTax() {
  const [mode, setMode] = useState<"single" | "multi">("single");

  // ─ 1銘柄モード状態
  const [acqPrice, setAcqPrice] = useState(1000);
  const [salePrice, setSalePrice] = useState(1500);
  const [shares, setShares] = useState(100);
  const [buyFee, setBuyFee] = useState(500);
  const [sellFee, setSellFee] = useState(500);
  const [account, setAccount] = useState<AccountType>("tokutei-gen");

  // ─ 複数銘柄モード状態
  const [stocks, setStocks] = useState<Stock[]>([
    { id: 1, name: "銘柄A", acquisitionTotal: 300000, saleTotal: 450000, account: "tokutei-gen" },
    { id: 2, name: "銘柄B", acquisitionTotal: 200000, saleTotal: 100000, account: "tokutei-gen" },
    { id: 3, name: "銘柄C（NISA）", acquisitionTotal: 500000, saleTotal: 650000, account: "nisa" },
  ]);

  // ─ FAQ
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ─ 計算
  const single = useMemo(
    () => calcSingle(acqPrice, salePrice, shares, buyFee, sellFee, account),
    [acqPrice, salePrice, shares, buyFee, sellFee, account]
  );

  const multi = useMemo(() => calcOffset(stocks), [stocks]);

  // ─ 複数銘柄操作
  function addStock() {
    setStocks((prev) => [
      ...prev,
      { id: nextId++, name: `銘柄${prev.length + 1}`, acquisitionTotal: 100000, saleTotal: 120000, account: "tokutei-gen" },
    ]);
  }

  function removeStock(id: number) {
    setStocks((prev) => prev.filter((s) => s.id !== id));
  }

  function updateStock<K extends keyof Stock>(id: number, key: K, value: Stock[K]) {
    setStocks((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヒーローヘッダー */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📈</span>
          <h1 className="text-2xl font-bold">株式譲渡益税計算</h1>
        </div>
        <p className="text-sm opacity-85">
          株式・投資信託の売却益にかかる税額を計算します。特定口座・NISA・損益通算に対応。
        </p>
      </div>

      <AdBanner />

      {/* ─── モード切替タブ */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {(["single", "multi"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
              mode === m
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "single" ? "1銘柄計算" : "複数銘柄・損益通算"}
          </button>
        ))}
      </div>

      {/* ─── 1銘柄モード */}
      {mode === "single" && (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
            {/* 口座種別 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">口座種別</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(ACCOUNT_LABELS) as AccountType[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAccount(a)}
                    className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                      account === a
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-green-300"
                    }`}
                  >
                    {ACCOUNT_LABELS[a]}
                  </button>
                ))}
              </div>
            </div>

            {/* 取得価格 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  取得価格（円/株）
                </label>
                <input
                  type="number"
                  min={0}
                  value={acqPrice}
                  onChange={(e) => setAcqPrice(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  売却価格（円/株）
                </label>
                <input
                  type="number"
                  min={0}
                  value={salePrice}
                  onChange={(e) => setSalePrice(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>

            {/* 株数 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                株数（口数）
              </label>
              <input
                type="number"
                min={1}
                value={shares}
                onChange={(e) => setShares(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* 手数料 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  購入時手数料（円）
                </label>
                <input
                  type="number"
                  min={0}
                  value={buyFee}
                  onChange={(e) => setBuyFee(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  売却時手数料（円）
                </label>
                <input
                  type="number"
                  min={0}
                  value={sellFee}
                  onChange={(e) => setSellFee(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            </div>
          </div>

          {/* ─── 結果カード */}
          <div
            className={`rounded-2xl p-6 mb-6 text-white shadow-lg ${
              single.isNisa
                ? "bg-gradient-to-br from-sky-500 to-blue-600"
                : single.gain >= 0
                ? "bg-gradient-to-br from-green-600 to-teal-700"
                : "bg-gradient-to-br from-red-500 to-rose-600"
            }`}
          >
            <p className="text-sm opacity-85 mb-1">
              {single.isNisa ? "NISA口座（非課税）" : ACCOUNT_LABELS[account]}の譲渡損益
            </p>
            <p className="text-5xl font-extrabold tracking-tight mb-1">
              {single.gain >= 0 ? "+" : ""}
              {fmt(single.gain)}円
            </p>
            <p className="text-sm opacity-75 mb-4">
              利回り {single.returnRate.toFixed(2)}%
            </p>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30 text-center">
              <div>
                <p className="text-xs opacity-75">税額</p>
                <p className="text-xl font-bold">
                  {single.isNisa ? "¥0（非課税）" : fmt(single.tax) + "円"}
                </p>
              </div>
              <div>
                <p className="text-xs opacity-75">税引後手取り</p>
                <p className="text-xl font-bold">
                  {fmt(single.netProfit)}円
                </p>
              </div>
              <div>
                <p className="text-xs opacity-75">税引後利回り</p>
                <p className="text-xl font-bold">
                  {single.netReturnRate.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* 内訳カード */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">計算内訳</h2>
            <div className="space-y-2 text-sm">
              {[
                ["取得総額（手数料込み）", `${fmt(single.acquisitionTotal)}円`],
                ["売却総額（手数料後）", `${fmt(single.saleTotal)}円`],
                ["譲渡益（税引前）", `${single.gain >= 0 ? "+" : ""}${fmt(single.gain)}円`],
                [
                  "税額（20.315%）",
                  single.isNisa
                    ? "¥0（NISA非課税）"
                    : `${fmt(single.tax)}円`,
                ],
                ["税引後手取り", `${fmt(single.netProfit)}円`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
            {single.needsTaxReturn && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                ⚠️ この口座種別は確定申告が必要です。翌年3月15日までに申告してください。
              </div>
            )}
          </div>
        </>
      )}

      {/* ─── 複数銘柄・損益通算モード */}
      {mode === "multi" && (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">銘柄一覧</h2>
            <div className="space-y-4">
              {stocks.map((s) => (
                <div key={s.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={s.name}
                      onChange={(e) => updateStock(s.id, "name", e.target.value)}
                      className="text-sm font-semibold text-gray-800 border-b border-gray-200 focus:outline-none focus:border-green-500 bg-transparent"
                    />
                    <button
                      onClick={() => removeStock(s.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      削除
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">取得総額（円）</label>
                      <input
                        type="number"
                        min={0}
                        value={s.acquisitionTotal}
                        onChange={(e) => updateStock(s.id, "acquisitionTotal", Number(e.target.value))}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">売却総額（円）</label>
                      <input
                        type="number"
                        min={0}
                        value={s.saleTotal}
                        onChange={(e) => updateStock(s.id, "saleTotal", Number(e.target.value))}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">口座種別</label>
                      <select
                        value={s.account}
                        onChange={(e) => updateStock(s.id, "account", e.target.value as AccountType)}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-green-400"
                      >
                        {(Object.keys(ACCOUNT_LABELS) as AccountType[]).map((a) => (
                          <option key={a} value={a}>
                            {ACCOUNT_LABELS[a]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="text-xs text-right">
                    <span
                      className={
                        s.saleTotal - s.acquisitionTotal >= 0
                          ? "text-green-600 font-semibold"
                          : "text-red-500 font-semibold"
                      }
                    >
                      {s.saleTotal - s.acquisitionTotal >= 0 ? "+" : ""}
                      {fmt(s.saleTotal - s.acquisitionTotal)}円
                      {s.account === "nisa" && (
                        <span className="ml-1 text-sky-500">（NISA非課税）</span>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addStock}
              className="mt-4 w-full py-2 border-2 border-dashed border-green-300 rounded-xl text-sm text-green-600 hover:bg-green-50 transition-colors"
            >
              ＋ 銘柄を追加
            </button>
          </div>

          {/* 損益通算結果 */}
          <div className="bg-gradient-to-br from-green-600 to-teal-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <p className="text-sm opacity-85 mb-1">損益通算後の課税所得</p>
            <p className="text-5xl font-extrabold tracking-tight mb-1">
              {fmt(multi.netTaxable)}円
            </p>
            <p className="text-sm opacity-75 mb-4">税額: {fmt(multi.tax)}円（20.315%）</p>
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30 text-center">
              <div>
                <p className="text-xs opacity-75">利益合計</p>
                <p className="text-lg font-bold text-yellow-300">+{fmt(multi.totalGain)}円</p>
              </div>
              <div>
                <p className="text-xs opacity-75">損失合計</p>
                <p className="text-lg font-bold text-red-300">{fmt(multi.totalLoss)}円</p>
              </div>
              <div>
                <p className="text-xs opacity-75">NISA利益</p>
                <p className="text-lg font-bold text-sky-200">+{fmt(multi.nisaGain)}円</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-4">通算内訳</h2>
            <div className="space-y-2 text-sm">
              {[
                ["課税口座の利益合計", `+${fmt(multi.totalGain)}円`],
                ["損失合計（相殺分）", `${fmt(multi.totalLoss)}円`],
                ["通算後課税所得", `${fmt(multi.netTaxable)}円`],
                ["税額（20.315%）", `${fmt(multi.tax)}円`],
                ["NISA非課税利益", `+${fmt(multi.nisaGain)}円（課税対象外）`],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
            {multi.hasLoss && multi.netTaxable === 0 && (
              <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-lg text-xs text-sky-700">
                ℹ️ 損失が利益を上回っています。確定申告で損失繰越（最長3年）が可能です。
              </div>
            )}
          </div>
        </>
      )}

      <AdBanner />

      {/* ─── FAQ */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-green-600 transition-colors"
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

      <RelatedTools currentToolId="stock-tax" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このツールは概算です。実際の税額は取引状況や他の所得により異なります。
        正確な申告は税理士または税務署にご相談ください。
        入力情報はサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
