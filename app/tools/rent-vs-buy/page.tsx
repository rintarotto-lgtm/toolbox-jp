"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface YearlyRow {
  year: number;
  rentTotal: number;
  buyTotal: number;
  rentCumulative: number;
  buyCumulative: number;
  assetValue: number;
  buyNetCost: number;
}

function calcLoanMonthly(principal: number, annualRate: number, years: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;
  if (monthlyRate === 0) return principal / totalMonths;
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
}

export default function RentVsBuy() {
  // 賃貸
  const [rent, setRent] = useState("8");
  const [renewal, setRenewal] = useState("8");
  const [rentRise, setRentRise] = useState("1");
  const [moveFreq, setMoveFreq] = useState("10");
  // 購入
  const [propertyPrice, setPropertyPrice] = useState("4000");
  const [downPayment, setDownPayment] = useState("400");
  const [loanRate, setLoanRate] = useState("1.5");
  const [loanYears, setLoanYears] = useState("35");
  const [manageFee, setManageFee] = useState("2");
  const [propertyTax, setPropertyTax] = useState("10");
  const [mortgageDeduction, setMortgageDeduction] = useState(true);
  // 比較期間
  const [period, setPeriod] = useState("30");
  // テーブル展開
  const [expanded, setExpanded] = useState(false);

  const result = useMemo(() => {
    const rentMon = parseFloat(rent) || 0;
    const renewalFee = parseFloat(renewal) || 0;
    const riseRate = parseFloat(rentRise) / 100 || 0;
    const movingCost = 30; // 引越し費用 万円
    const moveFreqYr = parseInt(moveFreq) || 10;

    const price = parseFloat(propertyPrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(loanRate) || 0;
    const years = parseInt(loanYears) || 35;
    const mngFee = parseFloat(manageFee) || 0;
    const pTax = parseFloat(propertyTax) || 0;
    const periodYr = parseInt(period) || 30;

    const loanPrincipal = (price - down) * 10000;
    const monthlyLoan = loanPrincipal > 0 ? calcLoanMonthly(loanPrincipal, rate, years) : 0;

    const rows: YearlyRow[] = [];
    let rentCumulative = 0;
    let buyCumulative = 0;
    let currentRentMon = rentMon;

    // 購入初期費用（諸費用 = 物件価格の5%と仮定）
    const initialCost = price * 0.05;
    buyCumulative += initialCost + down;

    for (let yr = 1; yr <= periodYr; yr++) {
      // 賃貸コスト（年）
      // 家賃上昇は5年ごとに適用
      if (yr > 1 && (yr - 1) % 5 === 0) {
        currentRentMon = currentRentMon * Math.pow(1 + riseRate, 5);
      }
      const yearlyRent = currentRentMon * 12;
      // 更新料（2年ごと）
      const yearlyRenewal = yr % 2 === 0 ? renewalFee : 0;
      // 引越し費用（moveFreqYr年ごと）
      const yearlyMove = yr % moveFreqYr === 0 ? movingCost : 0;
      const rentYear = yearlyRent + yearlyRenewal + yearlyMove;
      rentCumulative += rentYear;

      // 購入コスト（年）
      const loanYear = yr <= years ? (monthlyLoan * 12) / 10000 : 0;
      const deduction =
        mortgageDeduction && yr <= 13
          ? (Math.max(0, loanPrincipal - (monthlyLoan * 12 * (yr - 1))) * 0.007) / 10000
          : 0;
      const buyYear = loanYear + mngFee * 12 + pTax - deduction;
      buyCumulative += buyYear;

      // 資産価値（年0.5%下落）
      const assetValue = price * Math.pow(1 - 0.005, yr);

      // 購入の実質コスト = 累積支出 - 資産価値
      const buyNetCost = buyCumulative - assetValue;

      rows.push({
        year: yr,
        rentTotal: Math.round(rentYear * 10) / 10,
        buyTotal: Math.round(buyYear * 10) / 10,
        rentCumulative: Math.round(rentCumulative * 10) / 10,
        buyCumulative: Math.round(buyCumulative * 10) / 10,
        assetValue: Math.round(assetValue * 10) / 10,
        buyNetCost: Math.round(buyNetCost * 10) / 10,
      });
    }

    // 損益分岐点
    let breakeven: number | null = null;
    for (const row of rows) {
      if (row.buyNetCost <= row.rentCumulative) {
        breakeven = row.year;
        break;
      }
    }

    const finalRow = rows[rows.length - 1];

    return { rows, breakeven, finalRow };
  }, [rent, renewal, rentRise, moveFreq, propertyPrice, downPayment, loanRate, loanYears, manageFee, propertyTax, mortgageDeduction, period]);

  const displayRows = useMemo(() => {
    if (!result) return [];
    if (expanded) return result.rows;
    return result.rows.slice(0, 10);
  }, [result, expanded]);

  const rentWins = result.finalRow && result.finalRow.rentCumulative < result.finalRow.buyNetCost;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🏠</span>
          <h1 className="text-2xl font-bold">賃貸 vs 購入シミュレーター</h1>
        </div>
        <p className="text-purple-100 text-sm">
          賃貸と住宅購入の総コストを比較し、損益分岐点を計算します。
        </p>
      </div>

      <AdBanner />

      {/* 入力フォーム */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* 賃貸 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm">賃貸</span>
            賃貸シミュレーション
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">現在の家賃（万円/月）</label>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
                placeholder="8"
                min="0"
                step="0.5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">更新料（万円/2年）</label>
              <input
                type="number"
                value={renewal}
                onChange={(e) => setRenewal(e.target.value)}
                placeholder="8"
                min="0"
                step="0.5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">家賃上昇率（%/年）</label>
              <input
                type="number"
                value={rentRise}
                onChange={(e) => setRentRise(e.target.value)}
                placeholder="1"
                min="0"
                step="0.1"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">引越し頻度（年ごと）</label>
              <input
                type="number"
                value={moveFreq}
                onChange={(e) => setMoveFreq(e.target.value)}
                placeholder="10"
                min="1"
                max="50"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 購入 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded text-sm">購入</span>
            購入シミュレーション
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">物件価格（万円）</label>
              <input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(e.target.value)}
                placeholder="4000"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">頭金（万円）</label>
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
                placeholder="400"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">ローン金利（%/年）</label>
              <input
                type="number"
                value={loanRate}
                onChange={(e) => setLoanRate(e.target.value)}
                placeholder="1.5"
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">ローン期間（年）</label>
              <input
                type="number"
                value={loanYears}
                onChange={(e) => setLoanYears(e.target.value)}
                placeholder="35"
                min="1"
                max="50"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">管理費・修繕積立金（万円/月）</label>
              <input
                type="number"
                value={manageFee}
                onChange={(e) => setManageFee(e.target.value)}
                placeholder="2"
                min="0"
                step="0.5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">固定資産税（万円/年）</label>
              <input
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(e.target.value)}
                placeholder="10"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMortgageDeduction(!mortgageDeduction)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  mortgageDeduction ? "bg-violet-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    mortgageDeduction ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <label className="text-sm font-medium text-gray-700">
                住宅ローン控除（13年間 0.7%）
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 比較期間 */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <label className="text-sm font-medium text-gray-700 mb-2 block">比較期間</label>
        <div className="flex gap-3 flex-wrap">
          {["10", "20", "30", "40"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                period === p
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {p}年
            </button>
          ))}
        </div>
      </div>

      {/* 結果 */}
      {result.finalRow && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
              <div className="text-xs text-blue-600 font-medium mb-1">賃貸 {period}年間の総コスト</div>
              <div className="text-3xl font-bold text-blue-700">
                {result.finalRow.rentCumulative.toLocaleString()}万円
              </div>
            </div>
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 text-center">
              <div className="text-xs text-violet-600 font-medium mb-1">購入 {period}年間の総支出</div>
              <div className="text-3xl font-bold text-violet-700">
                {result.finalRow.buyCumulative.toLocaleString()}万円
              </div>
              <div className="text-xs text-gray-400 mt-1">
                資産価値 {result.finalRow.assetValue.toLocaleString()}万円を控除後
              </div>
            </div>
            <div
              className={`border rounded-xl p-5 text-center ${
                rentWins
                  ? "bg-blue-50 border-blue-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${rentWins ? "text-blue-600" : "text-green-600"}`}>
                {period}年後に有利なのは
              </div>
              <div className={`text-2xl font-bold ${rentWins ? "text-blue-700" : "text-green-700"}`}>
                {rentWins ? "賃貸" : "購入"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                差額：
                {Math.abs(
                  result.finalRow.rentCumulative - result.finalRow.buyNetCost
                ).toLocaleString()}万円
              </div>
            </div>
          </div>

          {/* 損益分岐点 */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-amber-800 mb-1">損益分岐点</h3>
            {result.breakeven ? (
              <p className="text-amber-700 text-sm">
                <span className="text-2xl font-bold">{result.breakeven}年目</span>
                から購入が賃貸より実質コストで有利になります（資産価値考慮後）。
              </p>
            ) : (
              <p className="text-amber-700 text-sm">
                {period}年間の比較期間内では、購入の実質コストが賃貸を下回る時点はありませんでした。比較期間を延ばすか、条件を変更してお試しください。
              </p>
            )}
          </div>

          {/* 年別テーブル */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-800 mb-4">年別累積コスト比較（万円）</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="pb-2 pr-4">年</th>
                    <th className="pb-2 pr-4 text-right">賃貸累計</th>
                    <th className="pb-2 pr-4 text-right">購入累計支出</th>
                    <th className="pb-2 pr-4 text-right">資産価値</th>
                    <th className="pb-2 text-right">購入実質コスト</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((row) => (
                    <tr
                      key={row.year}
                      className={`border-b border-gray-100 ${
                        result.breakeven === row.year ? "bg-green-50" : ""
                      }`}
                    >
                      <td className="py-2 pr-4 font-medium">{row.year}年</td>
                      <td className="py-2 pr-4 text-right text-blue-600">
                        {row.rentCumulative.toLocaleString()}
                      </td>
                      <td className="py-2 pr-4 text-right text-violet-600">
                        {row.buyCumulative.toLocaleString()}
                      </td>
                      <td className="py-2 pr-4 text-right text-gray-500">
                        {row.assetValue.toLocaleString()}
                      </td>
                      <td
                        className={`py-2 text-right font-medium ${
                          row.buyNetCost <= row.rentCumulative ? "text-green-600" : "text-gray-700"
                        }`}
                      >
                        {row.buyNetCost.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.rows.length > 10 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {expanded ? "折りたたむ ▲" : `すべて表示（${result.rows.length}行） ▼`}
              </button>
            )}
          </div>
        </>
      )}

      <AdBanner />

      <section className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">このツールについて</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          賃貸と住宅購入の総コストを長期スパンで比較するシミュレーターです。購入の場合は物件の資産価値（年0.5%下落と仮定）も考慮し、実質的なコストを計算します。住宅ローン控除・管理費・固定資産税・更新料・引越し費用なども含めた総合的な比較が可能です。実際の判断は不動産の専門家にご相談ください。
        </p>
        <p className="text-xs text-gray-400 mt-2">
          ※ 本ツールはあくまで目安の計算です。実際のコストは物件・ローン条件・税制等により異なります。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "賃貸と購入どちらが得ですか？",
            answer:
              "居住期間・物件価格・金利・家賃水準によって異なります。一般的に長期居住するほど購入が有利になりますが、損益分岐点はシミュレーションで確認することが重要です。",
          },
          {
            question: "住宅購入に必要な頭金はいくらですか？",
            answer:
              "一般的には物件価格の10〜20%が目安です。諸費用（物件価格の3〜8%程度）も別途必要です。頭金なしのフルローンも可能ですが総利息が増えます。",
          },
          {
            question: "マンションの維持費はいくらですか？",
            answer:
              "管理費と修繕積立金の合計は月1〜3万円程度が一般的です。築年数とともに修繕積立金が増額される場合があります。",
          },
          {
            question: "住宅ローン控除とはどのような制度ですか？",
            answer:
              "住宅ローンの年末残高の0.7%を13年間、所得税から控除できる制度です（2022年以降入居）。例えばローン残高3,000万円なら年間最大21万円が控除されます。",
          },
        ]}
      />

      <RelatedTools currentToolId="rent-vs-buy" />
    </div>
  );
}
