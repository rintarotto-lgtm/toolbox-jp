"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 所得税（累進）
function calcIncomeTax(income: number): number {
  if (income <= 0) return 0;
  if (income <= 1_950_000) return income * 0.05;
  if (income <= 3_300_000) return income * 0.10 - 97_500;
  if (income <= 6_950_000) return income * 0.20 - 427_500;
  if (income <= 9_000_000) return income * 0.23 - 636_000;
  if (income <= 18_000_000) return income * 0.33 - 1_536_000;
  if (income <= 40_000_000) return income * 0.40 - 2_796_000;
  return income * 0.45 - 4_796_000;
}

function taxBracketLabel(income: number): string {
  if (income <= 1_950_000) return "5%";
  if (income <= 3_300_000) return "10%";
  if (income <= 6_950_000) return "20%";
  if (income <= 9_000_000) return "23%";
  if (income <= 18_000_000) return "33%";
  if (income <= 40_000_000) return "40%";
  return "45%";
}

function fmt(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}
function fmtNum(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

type Transaction = {
  id: number;
  currency: string;
  buyDate: string;
  buyPrice: number;
  buyQty: number;
  sellDate: string;
  sellPrice: number;
  sellQty: number;
};

const CURRENCY_PRESETS = ["BTC", "ETH", "XRP", "SOL", "DOGE"];
let nextId = 1;

function defaultTx(): Transaction {
  return {
    id: nextId++,
    currency: "BTC",
    buyDate: "",
    buyPrice: 10_000_000,
    buyQty: 0.1,
    sellDate: "",
    sellPrice: 15_000_000,
    sellQty: 0.1,
  };
}

const FAQS = [
  {
    question: "仮想通貨の税金はいくらかかりますか？",
    answer:
      "仮想通貨の利益は「雑所得」として他の所得と合算した総合課税（5〜45%）が適用されます。住民税10%を合わせると最大55%です。年間20万円以下は申告不要（給与所得者）です。",
  },
  {
    question: "仮想通貨の損益計算方法は？",
    answer:
      "売却益 = 売却価格 - 取得原価（移動平均法または総平均法）で計算します。複数回購入した場合は取得単価の計算が必要です。",
  },
  {
    question: "仮想通貨の損失は翌年に繰り越せますか？",
    answer:
      "現状、仮想通貨（雑所得）の損失は翌年への繰越控除が認められていません。ただし同年内の他の雑所得との損益通算は可能です。",
  },
  {
    question: "NFTやDeFiの税金はどうなりますか？",
    answer:
      "NFTの売買益も原則として雑所得として課税されます。DeFiのステーキング報酬や流動性提供の報酬も受け取り時に雑所得となります。",
  },
];

export default function CryptoCalc() {
  const [transactions, setTransactions] = useState<Transaction[]>([defaultTx()]);
  const [method, setMethod] = useState<"moving" | "total">("moving");
  const [otherIncomeMan, setOtherIncomeMan] = useState(400);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function addTx() {
    setTransactions((prev) => [...prev, defaultTx()]);
  }

  function removeTx(id: number) {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  function updateTx(id: number, field: keyof Transaction, value: string | number) {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  }

  const result = useMemo(() => {
    // 取引別損益
    const txResults = transactions.map((tx) => {
      // 移動平均法 / 総平均法（この簡易計算ではどちらも同じ: 単一レコードなら同一）
      const costPerUnit = tx.buyQty > 0 ? (tx.buyPrice * tx.buyQty) / tx.buyQty : tx.buyPrice;
      const proceeds = tx.sellPrice * tx.sellQty;
      const cost = costPerUnit * tx.sellQty;
      const profit = proceeds - cost;
      return { ...tx, proceeds, cost, profit };
    });

    const totalProfit = txResults.reduce((sum, t) => sum + t.profit, 0);
    const otherIncome = otherIncomeMan * 10_000;
    const totalIncome = otherIncome + Math.max(0, totalProfit);

    // 雑所得の損失は他の所得と損益通算不可（給与所得との合算は不可）
    // ただし同年内の雑所得同士は通算可
    const cryptoTaxableIncome = Math.max(0, totalProfit);

    const basicDeduction = 480_000;
    // 給与所得控除の簡易計算
    function salaryDeduction(s: number): number {
      if (s <= 1_625_000) return 550_000;
      if (s <= 1_800_000) return s * 0.4 - 100_000;
      if (s <= 3_600_000) return s * 0.3 + 80_000;
      if (s <= 6_600_000) return s * 0.2 + 440_000;
      if (s <= 8_500_000) return s * 0.1 + 1_100_000;
      return 1_950_000;
    }
    const salaryIncomeTaxable = Math.max(0, otherIncome - salaryDeduction(otherIncome) - basicDeduction);
    const totalTaxableIncome = salaryIncomeTaxable + cryptoTaxableIncome;

    const incomeTax = Math.max(0, calcIncomeTax(totalTaxableIncome)) * 1.021;
    // 給与だけの場合の税
    const taxWithoutCrypto = Math.max(0, calcIncomeTax(salaryIncomeTaxable)) * 1.021;
    const cryptoIncomeTax = incomeTax - taxWithoutCrypto;

    const residentTax = totalTaxableIncome * 0.10;
    const residentTaxWithoutCrypto = salaryIncomeTaxable * 0.10;
    const cryptoResidentTax = residentTax - residentTaxWithoutCrypto;

    const totalTaxOnCrypto = Math.max(0, cryptoIncomeTax + cryptoResidentTax);
    const effectiveRate = cryptoTaxableIncome > 0 ? (totalTaxOnCrypto / cryptoTaxableIncome) * 100 : 0;
    const bracketLabel = taxBracketLabel(totalTaxableIncome);

    return {
      txResults,
      totalProfit,
      totalIncome,
      totalTaxableIncome,
      incomeTax,
      cryptoIncomeTax,
      cryptoResidentTax,
      totalTaxOnCrypto,
      effectiveRate,
      bracketLabel,
    };
  }, [transactions, otherIncomeMan, method]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヒーローヘッダー ─── */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl font-bold">₿</span>
          <h1 className="text-2xl font-bold">仮想通貨・暗号資産 損益計算</h1>
        </div>
        <p className="text-sm text-orange-100">
          仮想通貨の取引情報を入力して売却損益・税額をシミュレーション。確定申告の参考にご利用ください。
        </p>
      </div>

      <AdBanner />

      {/* ─── 基本情報 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-gray-900">基本情報</h2>

        {/* 給与・その他所得 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            給与・その他所得（万円/年）
          </label>
          <p className="text-xs text-gray-500 mb-2">税率の計算に使います。仮想通貨利益は「雑所得」として合算されます。</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              step={10}
              value={otherIncomeMan}
              onChange={(e) => setOtherIncomeMan(Number(e.target.value))}
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <span className="text-sm text-gray-600">万円</span>
          </div>
        </div>

        {/* 取得単価計算方式 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">取得単価計算方式</label>
          <div className="flex gap-3">
            <button
              onClick={() => setMethod("moving")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                method === "moving"
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-orange-300"
              }`}
            >
              移動平均法
            </button>
            <button
              onClick={() => setMethod("total")}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                method === "total"
                  ? "bg-amber-500 text-white border-amber-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-amber-300"
              }`}
            >
              総平均法
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            ※ 本計算では取引ごとに指定した取得価格・数量を使います。複数回購入がある場合は各取引の平均単価を入力してください。
          </p>
        </div>
      </div>

      {/* ─── 取引一覧 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">取引一覧</h2>

        <div className="space-y-5">
          {transactions.map((tx, idx) => (
            <div key={tx.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">取引 #{idx + 1}</span>
                {transactions.length > 1 && (
                  <button
                    onClick={() => removeTx(tx.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-medium"
                  >
                    削除
                  </button>
                )}
              </div>

              {/* 通貨名 */}
              <div className="mb-3">
                <label className="block text-xs text-gray-500 mb-1">通貨名</label>
                <div className="flex gap-2 flex-wrap mb-2">
                  {CURRENCY_PRESETS.map((p) => (
                    <button
                      key={p}
                      onClick={() => updateTx(tx.id, "currency", p)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        tx.currency === p
                          ? "bg-orange-500 text-white border-orange-500"
                          : "bg-white text-gray-600 border-gray-300 hover:border-orange-300"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={tx.currency}
                  onChange={(e) => updateTx(tx.id, "currency", e.target.value)}
                  placeholder="通貨名を入力"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 取得側 */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-blue-600 uppercase">取得</p>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">取得日</label>
                    <input
                      type="date"
                      value={tx.buyDate}
                      onChange={(e) => updateTx(tx.id, "buyDate", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">取得価格（円/1単位）</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={tx.buyPrice}
                      onChange={(e) => updateTx(tx.id, "buyPrice", Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">取得数量</label>
                    <input
                      type="number"
                      min={0}
                      step={0.0001}
                      value={tx.buyQty}
                      onChange={(e) => updateTx(tx.id, "buyQty", Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                {/* 売却側 */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-orange-600 uppercase">売却</p>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">売却日</label>
                    <input
                      type="date"
                      value={tx.sellDate}
                      onChange={(e) => updateTx(tx.id, "sellDate", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">売却価格（円/1単位）</label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={tx.sellPrice}
                      onChange={(e) => updateTx(tx.id, "sellPrice", Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">売却数量</label>
                    <input
                      type="number"
                      min={0}
                      step={0.0001}
                      value={tx.sellQty}
                      onChange={(e) => updateTx(tx.id, "sellQty", Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>
              </div>

              {/* 取引損益プレビュー */}
              {(() => {
                const r = result.txResults[idx];
                if (!r) return null;
                return (
                  <div className={`mt-3 rounded-lg px-3 py-2 text-sm font-semibold ${r.profit >= 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                    この取引の損益: {r.profit >= 0 ? "+" : ""}{fmt(r.profit)}
                  </div>
                );
              })()}
            </div>
          ))}
        </div>

        <button
          onClick={addTx}
          className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-orange-300 text-orange-600 text-sm font-semibold hover:bg-orange-50 transition-colors"
        >
          ＋ 取引を追加
        </button>
      </div>

      {/* ─── 結果ヒーローカード ─── */}
      <div className={`rounded-2xl p-6 mb-6 shadow-lg text-white ${result.totalProfit >= 0 ? "bg-gradient-to-br from-orange-500 to-amber-600" : "bg-gradient-to-br from-gray-600 to-gray-700"}`}>
        <p className="text-sm font-medium opacity-90 mb-1">合計売却{result.totalProfit >= 0 ? "益" : "損"}</p>
        <p className="text-5xl font-extrabold tracking-tight mb-2">
          {result.totalProfit >= 0 ? "+" : ""}{fmt(result.totalProfit)}
        </p>
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/30 text-center">
          <div>
            <p className="text-xs opacity-75">課税所得合計（概算）</p>
            <p className="text-xl font-bold">{fmt(result.totalTaxableIncome)}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">適用税率（最高）</p>
            <p className="text-xl font-bold">{result.bracketLabel}</p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── 税額詳細 ─── */}
      {result.totalProfit > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">仮想通貨利益にかかる税額</h2>
          <div className="space-y-3">
            {[
              { label: "所得税（復興税含む）", value: result.cryptoIncomeTax, color: "bg-orange-400" },
              { label: "住民税（10%）", value: result.cryptoResidentTax, color: "bg-amber-400" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-800">{fmt(item.value)}</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${result.totalProfit > 0 ? Math.min(100, (item.value / result.totalProfit) * 100) : 0}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100 flex justify-between text-sm font-bold">
              <span className="text-gray-700">合計税額（概算）</span>
              <span className="text-orange-600">{fmt(result.totalTaxOnCrypto)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold">
              <span className="text-gray-700">実効税率</span>
              <span className="text-orange-600">{result.effectiveRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {/* ─── 取引別損益テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">取引別損益</h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">通貨</th>
                <th className="text-right py-2 px-2 font-medium">売却額</th>
                <th className="text-right py-2 px-2 font-medium">取得費</th>
                <th className="text-right py-2 px-2 font-medium">損益</th>
              </tr>
            </thead>
            <tbody>
              {result.txResults.map((tx, i) => (
                <tr key={tx.id} className="border-b border-gray-100">
                  <td className="py-2.5 px-2 font-semibold text-gray-800">{tx.currency}</td>
                  <td className="py-2.5 px-2 text-right text-gray-600">{fmt(tx.proceeds)}</td>
                  <td className="py-2.5 px-2 text-right text-gray-600">{fmt(tx.cost)}</td>
                  <td className={`py-2.5 px-2 text-right font-semibold ${tx.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {tx.profit >= 0 ? "+" : ""}{fmt(tx.profit)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td className="py-2.5 px-2 font-bold text-gray-800" colSpan={3}>合計</td>
                <td className={`py-2.5 px-2 text-right font-bold ${result.totalProfit >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {result.totalProfit >= 0 ? "+" : ""}{fmt(result.totalProfit)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ─── 節税ポイント ─── */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-amber-900 mb-3">節税ポイント</h2>
        <ul className="space-y-3 text-sm text-amber-800">
          <li className="flex gap-2">
            <span className="font-bold">①</span>
            <span><strong>損益通算:</strong> 同年内に複数の仮想通貨で取引した場合、利益と損失を通算できます。含み損のある通貨を同年内に売却して損失を確定させると節税になります。</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">②</span>
            <span><strong>含み損の実現化:</strong> 年末に向けて含み損のある通貨を売却し損失を確定させると、同年の他の仮想通貨利益と相殺できます（翌年繰越不可）。</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">③</span>
            <span><strong>20万円以下は申告不要:</strong> 給与所得者で年間の仮想通貨利益が20万円以下の場合、所得税の確定申告は不要です（住民税申告は必要な場合あり）。</span>
          </li>
        </ul>
      </div>

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-orange-600"
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

      <AdBanner />

      <RelatedTools currentToolId="crypto-calc" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。取得費の計算は簡略化しており、手数料・スワップ・ステーキング報酬等は考慮していません。
        住民税・復興特別所得税の計算は概算です。実際の税額は税理士または税務署にご確認ください。入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
