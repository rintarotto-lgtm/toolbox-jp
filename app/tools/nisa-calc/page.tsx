"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 計算ロジック
function calcNisa(monthlyAmount: number, years: number, rate: number) {
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;

  const futureValue =
    monthlyRate === 0
      ? monthlyAmount * months
      : monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);

  const totalInvestment = monthlyAmount * months;
  const profit = futureValue - totalInvestment;

  // 課税口座（運用益に約20.315%課税）
  const taxRate = 0.20315;
  const taxableProfit = profit * (1 - taxRate);
  const taxableTotal = totalInvestment + taxableProfit;

  // NISA節税効果
  const taxSavings = profit * taxRate;

  // 年別残高推移（グラフ用）
  const yearlyData = Array.from({ length: years + 1 }, (_, y) => {
    const m = y * 12;
    const fv =
      m === 0
        ? 0
        : monthlyRate === 0
        ? monthlyAmount * m
        : monthlyAmount * ((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate);
    return { year: y, nisa: fv, investment: monthlyAmount * m };
  });

  return {
    futureValue: Math.round(futureValue),
    totalInvestment,
    profit: Math.round(profit),
    taxableTotal: Math.round(taxableTotal),
    taxSavings: Math.round(taxSavings),
    yearlyData,
  };
}

// ─── 利回り別比較テーブル
const RATE_COLUMNS = [3, 4, 5, 6, 7, 8];
const YEAR_ROWS = [10, 20, 30];

// ─── FAQ
const FAQS = [
  {
    question: "新NISAの年間投資上限額はいくらですか？",
    answer:
      "新NISA（2024年〜）は年間最大360万円（つみたて投資枠120万円＋成長投資枠240万円）で、生涯投資上限は1,800万円です。",
  },
  {
    question: "NISAで運用益は非課税ですか？",
    answer:
      "はい、NISA口座内の運用益・配当金は全て非課税です。通常の特定口座では利益の約20.315%が課税されますが、NISAではゼロです。",
  },
  {
    question: "NISAの出口戦略はどうすればいいですか？",
    answer:
      "積立終了後も非課税のまま保有し続けることができます。必要なときに必要な額だけ売却するのが基本です。老後資金として活用する場合は、退職後に少しずつ取り崩すのが一般的です。",
  },
  {
    question: "何年間積み立てればいくらになりますか？",
    answer:
      "例えば月3万円を年利5%で30年積み立てると、元本1,080万円に対して約2,495万円になります（複利効果）。積立額と運用利回りが大きいほど、長期投資の複利効果が大きくなります。",
  },
];

function formatMan(n: number): string {
  const man = Math.round(n / 10_000);
  return `${man.toLocaleString("ja-JP")}万円`;
}

function formatYen(n: number): string {
  return `¥${n.toLocaleString("ja-JP")}`;
}

export default function NisaCalc() {
  const [monthlyAmount, setMonthlyAmount] = useState(30_000);
  const [years, setYears] = useState(20);
  const [rate, setRate] = useState(5);
  const [age, setAge] = useState(30);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(
    () => calcNisa(monthlyAmount, years, rate),
    [monthlyAmount, years, rate]
  );

  const completionAge = age + years;

  // 年間投資額チェック（上限360万円/年 = 月30万円）
  const annualAmount = monthlyAmount * 12;
  const exceedsNisaLimit = monthlyAmount > 300_000;
  const exceedsRecommended = monthlyAmount > 50_000 && monthlyAmount <= 300_000;

  // 棒グラフ用データ（5年ごと）
  const chartData = result.yearlyData.filter(
    (d) => d.year % 5 === 0 && d.year > 0
  );
  const maxFv = Math.max(...chartData.map((d) => d.nisa), 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        NISA積立シミュレーター
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        月額・積立期間・利回りを入力して、新NISAの将来資産額と非課税メリットを計算します。
      </p>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        {/* 月額積立額 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            月額積立額
          </label>
          <input
            type="range"
            min={1_000}
            max={300_000}
            step={1_000}
            value={monthlyAmount}
            onChange={(e) => setMonthlyAmount(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-violet-600
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-600
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-violet-200 to-violet-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1,000円</span>
            <span>5万円</span>
            <span>10万円</span>
            <span>20万円</span>
            <span>30万円</span>
          </div>
          <div className="text-center text-3xl font-extrabold text-violet-700 mt-2">
            月 {monthlyAmount.toLocaleString("ja-JP")} 円
          </div>
          <div className="text-center text-xs text-gray-500 mt-0.5">
            年間: {annualAmount.toLocaleString("ja-JP")}円
          </div>
          {exceedsNisaLimit && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              ⚠️ 月30万円（年360万円）は新NISAの年間上限（360万円）に達しています。上限を超えた分はNISA枠外での運用となります。
            </div>
          )}
          {exceedsRecommended && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
              ℹ️ 月5万円超の積立は新NISAの年間上限（360万円）に早期到達します。生涯上限1,800万円の枠管理にご注意ください。
            </div>
          )}
        </div>

        {/* 積立期間 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            積立期間 — 完了時の年齢: {completionAge}歳
          </label>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-purple-500
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-purple-100 to-purple-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1年</span>
            <span>10年</span>
            <span>20年</span>
            <span>30年</span>
            <span>40年</span>
          </div>
          <p className="text-center text-sm font-semibold text-gray-700 mt-1">
            {years}年間
          </p>
        </div>

        {/* 想定利回り */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            想定利回り（年率）
          </label>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-fuchsia-500
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-fuchsia-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-fuchsia-100 to-fuchsia-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1%</span>
            <span>3%</span>
            <span>5%</span>
            <span>7%</span>
            <span>10%</span>
          </div>
          <p className="text-center text-sm font-semibold text-gray-700 mt-1">
            年 {rate}%
          </p>
        </div>

        {/* 現在の年齢 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            現在の年齢
          </label>
          <input
            type="range"
            min={20}
            max={60}
            step={1}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-violet-400
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-400
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-violet-100 to-violet-300"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>20歳</span>
            <span>30歳</span>
            <span>40歳</span>
            <span>50歳</span>
            <span>60歳</span>
          </div>
          <p className="text-center text-sm font-semibold text-gray-700 mt-1">
            {age}歳 → 積立完了時 {completionAge}歳
          </p>
        </div>
      </div>

      {/* ─── ヒーローカード ─── */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90 mb-1">
          {years}年後の最終資産額（NISA非課税）
        </p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">
          {formatMan(result.futureValue)}
        </p>
        <p className="text-sm opacity-75 mb-4">
          {formatYen(result.futureValue)}
        </p>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30 text-center">
          <div>
            <p className="text-xs opacity-75">元本</p>
            <p className="text-xl font-bold">{formatMan(result.totalInvestment)}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">運用益</p>
            <p className="text-xl font-bold text-yellow-300">
              +{formatMan(result.profit)}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-75">非課税メリット</p>
            <p className="text-xl font-bold text-green-300">
              +{formatMan(result.taxSavings)}
            </p>
          </div>
        </div>
      </div>

      {/* ─── 3メトリクスカード ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5 text-center shadow-sm">
          <p className="text-xs text-violet-600 mb-1 font-medium">元本合計</p>
          <p className="text-2xl font-bold text-violet-800">
            {formatMan(result.totalInvestment)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            月{monthlyAmount.toLocaleString()}円 × {years * 12}ヶ月
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 text-center shadow-sm">
          <p className="text-xs text-purple-600 mb-1 font-medium">運用益</p>
          <p className="text-2xl font-bold text-purple-800">
            +{formatMan(result.profit)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            複利効果（年利{rate}%）
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center shadow-sm">
          <p className="text-xs text-green-600 mb-1 font-medium">NISA節税効果額</p>
          <p className="text-2xl font-bold text-green-700">
            +{formatMan(result.taxSavings)}
          </p>
          <p className="text-xs text-gray-400 mt-1">課税口座比（税率20.315%）</p>
        </div>
      </div>

      <AdBanner />

      {/* ─── 棒グラフ（5年ごと積み上げ） ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          年別 資産推移（利回り {rate}%）
        </h2>
        <div className="flex items-end gap-2" style={{ height: 180 }}>
          {chartData.map((d) => {
            const investPct = (d.investment / maxFv) * 100;
            const gainAmt = Math.max(0, d.nisa - d.investment);
            const gainPct = (gainAmt / maxFv) * 100;
            return (
              <div
                key={d.year}
                className="flex-1 flex flex-col items-center justify-end h-full gap-0"
              >
                <p className="text-xs text-purple-700 font-semibold mb-0.5">
                  {formatMan(d.nisa)}
                </p>
                <div className="w-full flex flex-col justify-end" style={{ height: "80%" }}>
                  {/* 運用益（上段・紫） */}
                  <div
                    className="w-full bg-violet-500 rounded-t transition-all duration-500"
                    style={{ height: `${gainPct}%` }}
                  />
                  {/* 元本（下段・グレー） */}
                  <div
                    className="w-full bg-gray-300"
                    style={{ height: `${investPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{d.year}年</p>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 text-xs text-gray-600 mt-3">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-gray-300" />
            積立元本
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-violet-500" />
            運用益
          </span>
        </div>
      </div>

      {/* ─── 利回り別比較テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">
          利回り別 資産額比較
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          月額 {monthlyAmount.toLocaleString("ja-JP")}円 積立 / 単位：万円
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">積立期間</th>
                {RATE_COLUMNS.map((r) => (
                  <th
                    key={r}
                    className={`text-right py-2 px-2 font-medium ${
                      r === rate ? "text-violet-700" : ""
                    }`}
                  >
                    {r}%
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {YEAR_ROWS.map((y) => (
                <tr
                  key={y}
                  className={`border-b border-gray-100 ${
                    y === years ? "bg-violet-50 font-bold" : ""
                  }`}
                >
                  <td className="py-2.5 px-2 text-gray-800">{y}年</td>
                  {RATE_COLUMNS.map((r) => {
                    const { futureValue } = calcNisa(monthlyAmount, y, r);
                    return (
                      <td
                        key={r}
                        className={`py-2.5 px-2 text-right ${
                          r === rate && y === years
                            ? "text-violet-700 font-extrabold"
                            : r === rate
                            ? "text-violet-600 font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {Math.round(futureValue / 10_000).toLocaleString()}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          ※ 現在選択中の条件を紫色で表示しています。
        </p>
      </div>

      {/* ─── NISAvs課税口座 比較カード ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          NISA vs 課税口座 比較
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {/* NISA */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                NISA
              </span>
              <span className="text-xs text-violet-600 font-medium">非課税</span>
            </div>
            <p className="text-2xl font-bold text-violet-700 mb-1">
              {formatMan(result.futureValue)}
            </p>
            <div className="text-xs text-gray-600 space-y-1 mt-2">
              <div className="flex justify-between">
                <span>元本</span>
                <span>{formatMan(result.totalInvestment)}</span>
              </div>
              <div className="flex justify-between">
                <span>運用益</span>
                <span className="text-violet-600 font-semibold">
                  +{formatMan(result.profit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>税金</span>
                <span className="text-green-600 font-semibold">¥0（非課税）</span>
              </div>
            </div>
          </div>
          {/* 課税口座 */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                課税口座
              </span>
              <span className="text-xs text-gray-500 font-medium">20.315%課税</span>
            </div>
            <p className="text-2xl font-bold text-gray-700 mb-1">
              {formatMan(result.taxableTotal)}
            </p>
            <div className="text-xs text-gray-600 space-y-1 mt-2">
              <div className="flex justify-between">
                <span>元本</span>
                <span>{formatMan(result.totalInvestment)}</span>
              </div>
              <div className="flex justify-between">
                <span>運用益（税引後）</span>
                <span className="text-gray-700">
                  +{formatMan(result.taxableTotal - result.totalInvestment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>税金</span>
                <span className="text-red-600 font-semibold">
                  -{formatMan(result.taxSavings)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* 差額ハイライト */}
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-center">
          <p className="text-xs text-green-600 mb-0.5">NISAによる節税メリット</p>
          <p className="text-2xl font-bold text-green-700">
            +{formatMan(result.taxSavings)}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            課税口座と比べて{formatMan(result.taxSavings)}多く手元に残ります
          </p>
        </div>
      </div>

      <AdBanner />

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-violet-600 transition-colors"
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

      <RelatedTools currentToolId="nisa-calc" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。実際の運用成果は市場環境によって異なり、元本割れのリスクがあります。
        NISA制度の詳細・最新情報は金融庁または金融機関にご確認ください。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
