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

function calcAll(
  sales: number,
  expenses: number,
  isBlue: boolean,
  idecoAmount: number
) {
  const grossIncome = Math.max(0, sales - expenses);
  const blueDeduction = isBlue ? 650_000 : 100_000;
  const basicDeduction = 480_000;

  const businessIncome = Math.max(0, grossIncome - blueDeduction);
  const taxableIncome = Math.max(0, businessIncome - basicDeduction - idecoAmount);

  const incomeTax = Math.max(0, calcIncomeTax(taxableIncome)) * 1.021;
  const residentTax = taxableIncome * 0.10;
  const healthInsurance = Math.min(businessIncome * 0.10, 870_000);
  const nenkin = 203_760;

  const totalTax = incomeTax + residentTax + healthInsurance + nenkin;
  const takeHome = grossIncome - totalTax;
  const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome,
    businessIncome,
    taxableIncome,
    incomeTax,
    residentTax,
    healthInsurance,
    nenkin,
    totalTax,
    takeHome,
    effectiveRate,
  };
}

// ─── 売上別シミュレーションテーブル
const TABLE_SALES = [3_000_000, 4_000_000, 5_000_000, 7_000_000, 10_000_000];

// ─── FAQ
const FAQS = [
  {
    question: "フリーランスの税金はどうやって計算するのですか？",
    answer:
      "フリーランスの税金は「売上－経費＝事業所得」を求めてから、青色申告特別控除・基礎控除・iDeCo掛金などを差し引いた「課税所得」に累進税率を適用して所得税を計算します。住民税（課税所得×10%）・国民健康保険料・国民年金も加えた合計が年間の税負担額です。",
  },
  {
    question: "フリーランスは経費でどれくらい節税できますか？",
    answer:
      "経費が増えるほど事業所得が減り、所得税・住民税・国民健康保険料がすべて下がります。たとえば課税所得が500万円の方が100万円の経費を追加計上すると、所得税・住民税だけで約30万円以上の節税効果が見込めます。",
  },
  {
    question: "青色申告特別控除65万円を受ける条件は何ですか？",
    answer:
      "65万円の青色申告特別控除を受けるには、①事前に「青色申告承認申請書」を税務署に提出、②複式簿記による記帳、③確定申告書にB様式・青色申告決算書を添付、④e-Tax（電子申告）での提出が必要です。",
  },
  {
    question: "インボイス制度（消費税）はフリーランスに関係ありますか？",
    answer:
      "2023年10月から始まったインボイス制度により、適格請求書発行事業者（課税事業者）に登録しないと取引先が消費税仕入税額控除を受けられなくなり、値引き交渉をされる場合があります。取引先との関係を踏まえて登録を検討しましょう。",
  },
];

function fmt(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}
function fmtMan(n: number): string {
  return `${Math.round(n / 10_000).toLocaleString("ja-JP")}万円`;
}

export default function FreelanceTax() {
  const [sales, setSales] = useState(5_000_000);
  const [expenses, setExpenses] = useState(1_000_000);
  const [isBlue, setIsBlue] = useState(true);
  const [idecoAmount, setIdecoAmount] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(
    () => calcAll(sales, expenses, isBlue, idecoAmount),
    [sales, expenses, isBlue, idecoAmount]
  );

  // 白色との比較（節税効果）
  const whiteResult = useMemo(
    () => calcAll(sales, expenses, false, idecoAmount),
    [sales, expenses, idecoAmount]
  );
  const blueResult = useMemo(
    () => calcAll(sales, expenses, true, idecoAmount),
    [sales, expenses, idecoAmount]
  );
  const blueSaving = whiteResult.totalTax - blueResult.totalTax;

  // iDeCo節税効果
  const noIdecoResult = useMemo(
    () => calcAll(sales, expenses, isBlue, 0),
    [sales, expenses, isBlue]
  );
  const idecoSaving = idecoAmount > 0 ? noIdecoResult.totalTax - result.totalTax : 0;

  // 税金バーの幅計算
  const taxBarMax = result.grossIncome > 0 ? result.grossIncome : 1;
  const incomeTaxPct = (result.incomeTax / taxBarMax) * 100;
  const residentTaxPct = (result.residentTax / taxBarMax) * 100;
  const healthPct = (result.healthInsurance / taxBarMax) * 100;
  const nenkinPct = (result.nenkin / taxBarMax) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        フリーランス税金シミュレーター
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        売上・経費・青色申告・iDeCoを入力して、所得税・住民税・国保・年金の合計と手取りを計算します。
      </p>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        {/* 年間売上 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            年間売上
          </label>
          <input
            type="range"
            min={1_000_000}
            max={30_000_000}
            step={100_000}
            value={sales}
            onChange={(e) => setSales(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-orange-500
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-orange-200 to-orange-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>100万</span><span>500万</span><span>1,000万</span><span>2,000万</span><span>3,000万</span>
          </div>
          <p className="text-center text-3xl font-extrabold text-orange-600 mt-2">
            {fmtMan(sales)}
          </p>
        </div>

        {/* 経費合計 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            経費合計
          </label>
          <input
            type="range"
            min={0}
            max={10_000_000}
            step={50_000}
            value={expenses}
            onChange={(e) => setExpenses(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-amber-500
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-amber-100 to-amber-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0円</span><span>250万</span><span>500万</span><span>750万</span><span>1,000万</span>
          </div>
          <p className="text-center text-sm font-semibold text-gray-700 mt-1">
            {fmtMan(expenses)}
            <span className="ml-2 text-xs text-gray-500 font-normal">
              （粗利: {fmtMan(result.grossIncome)}）
            </span>
          </p>
        </div>

        {/* 青色申告 toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">青色申告</label>
          <div className="flex gap-3">
            <button
              onClick={() => setIsBlue(true)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                isBlue
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-orange-300"
              }`}
            >
              青色申告（65万控除）
            </button>
            <button
              onClick={() => setIsBlue(false)}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                !isBlue
                  ? "bg-gray-600 text-white border-gray-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              白色申告（10万控除）
            </button>
          </div>
        </div>

        {/* 基礎控除 固定表示 */}
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3 text-sm">
          <span className="text-gray-600">基礎控除</span>
          <span className="font-semibold text-gray-800">48万円（固定）</span>
        </div>

        {/* iDeCo掛金 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            iDeCo掛金（年額）
          </label>
          <input
            type="range"
            min={0}
            max={816_000}
            step={10_000}
            value={idecoAmount}
            onChange={(e) => setIdecoAmount(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-blue-500
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-blue-100 to-blue-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0円</span><span>月2.3万</span><span>月4万</span><span>月5.5万</span><span>月6.8万</span>
          </div>
          <p className="text-center text-sm font-semibold text-gray-700 mt-1">
            {idecoAmount > 0
              ? `年${fmtMan(idecoAmount)}（月${Math.round(idecoAmount / 12 / 1000).toLocaleString()}千円）`
              : "0円（設定なし）"}
          </p>
        </div>
      </div>

      {/* ─── ヒーローカード ─── */}
      <div className="bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90 mb-1">年間手取り（概算）</p>
        <p className="text-5xl font-extrabold tracking-tight mb-2">
          {fmtMan(result.takeHome)}
        </p>
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/30 text-center">
          <div>
            <p className="text-xs opacity-75">実効税率</p>
            <p className="text-2xl font-bold">{result.effectiveRate.toFixed(1)}%</p>
          </div>
          <div>
            <p className="text-xs opacity-75">年間税負担合計</p>
            <p className="text-2xl font-bold">{fmtMan(result.totalTax)}</p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── 税金内訳バー ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">税金内訳</h2>
        <div className="space-y-3">
          {[
            { label: "所得税（復興税含む）", value: result.incomeTax, pct: incomeTaxPct, color: "bg-red-400" },
            { label: "住民税", value: result.residentTax, pct: residentTaxPct, color: "bg-orange-400" },
            { label: "国民健康保険料", value: result.healthInsurance, pct: healthPct, color: "bg-amber-400" },
            { label: "国民年金保険料", value: result.nenkin, pct: nenkinPct, color: "bg-yellow-400" },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-semibold text-gray-800">{fmt(item.value)}</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.max(0, Math.min(100, item.pct))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm font-bold">
          <span className="text-gray-700">合計</span>
          <span className="text-red-600">{fmt(result.totalTax)}</span>
        </div>
      </div>

      {/* ─── 青色申告の節税効果 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">青色申告 vs 白色申告の節税効果</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <p className="text-xs text-orange-600 mb-1">青色申告の税負担</p>
            <p className="text-2xl font-bold text-orange-700">{fmtMan(blueResult.totalTax)}</p>
            <p className="text-xs text-gray-500 mt-1">手取り {fmtMan(blueResult.takeHome)}</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-600 mb-1">白色申告の税負担</p>
            <p className="text-2xl font-bold text-gray-700">{fmtMan(whiteResult.totalTax)}</p>
            <p className="text-xs text-gray-500 mt-1">手取り {fmtMan(whiteResult.takeHome)}</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-sm text-green-700 font-medium mb-1">青色申告による年間節税額</p>
          <p className="text-3xl font-extrabold text-green-600">
            {blueSaving > 0 ? `+${fmtMan(blueSaving)}` : fmt(0)}
          </p>
        </div>
      </div>

      {/* ─── 売上別シミュレーションテーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">売上別 手取りシミュレーション</h2>
        <p className="text-xs text-gray-500 mb-3">
          ※ 経費・青色申告・iDeCo設定は現在の入力値を使用
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">年間売上</th>
                <th className="text-right py-2 px-2 font-medium">税負担合計</th>
                <th className="text-right py-2 px-2 font-medium">手取り</th>
                <th className="text-right py-2 px-2 font-medium">実効税率</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_SALES.map((s) => {
                const r = calcAll(s, expenses, isBlue, idecoAmount);
                const isActive = s === sales;
                return (
                  <tr
                    key={s}
                    className={`border-b border-gray-100 ${isActive ? "bg-orange-50 font-bold" : ""}`}
                  >
                    <td className="py-2.5 px-2 text-gray-800">{fmtMan(s)}</td>
                    <td className="py-2.5 px-2 text-right text-red-600">{fmtMan(r.totalTax)}</td>
                    <td className="py-2.5 px-2 text-right text-orange-700">{fmtMan(r.takeHome)}</td>
                    <td className="py-2.5 px-2 text-right text-gray-600">
                      {r.effectiveRate.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── iDeCo節税効果 ─── */}
      {idecoAmount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-blue-900 mb-3">iDeCo節税効果</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">iDeCoなしの税負担</p>
              <p className="text-xl font-bold text-gray-700">{fmtMan(noIdecoResult.totalTax)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <p className="text-xs text-blue-600 mb-1">iDeCo込みの税負担</p>
              <p className="text-xl font-bold text-blue-700">{fmtMan(result.totalTax)}</p>
            </div>
          </div>
          <div className="mt-4 bg-white rounded-xl p-4 text-center">
            <p className="text-sm text-blue-700 font-medium mb-1">
              iDeCo年間節税額（年{fmtMan(idecoAmount)}掛金）
            </p>
            <p className="text-3xl font-extrabold text-blue-600">+{fmtMan(idecoSaving)}</p>
          </div>
        </div>
      )}

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

      <RelatedTools currentToolId="freelance-tax" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。国民健康保険料は自治体により異なります。所得税・住民税の計算は各種控除を簡略化しています。
        実際の税額は税理士または税務署にご確認ください。なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
