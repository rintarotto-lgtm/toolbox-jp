"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── FAQ
const FAQS = [
  {
    question: "フリーランスの時給はどのくらいが適正ですか？",
    answer:
      "同じスキルの会社員の年収÷1,500〜1,800時間が粗利時給の目安です。そこに経費・社会保険・税金・有給相当を上乗せする必要があります。",
  },
  {
    question: "フリーランスは会社員の何倍の単価が必要ですか？",
    answer:
      "社会保険・有給・賞与・退職金などを自己負担するため、一般的に同等の手取りを得るには会社員の1.4〜1.7倍の収入が必要とされます。",
  },
  {
    question: "フリーランスの稼働率の目安は何%ですか？",
    answer:
      "営業・提案・事務・スキルアップの時間を除くと、実稼働率（請求可能時間÷総労働時間）は70〜80%程度が現実的です。100%稼働は持続困難です。",
  },
  {
    question: "フリーランスの値上げはどうすれば成功しますか？",
    answer:
      "実績・成果を数値で示す、市場単価データを提示する、スキルアップを証明するなどが効果的です。本ツールで算出した必要単価を根拠として交渉資料に使えます。",
  },
];

// ─── 計算ロジック
function calcHourlyRate(
  targetNetIncome: number, // 万円
  workingDays: number,
  hoursPerDay: number,
  utilizationRate: number, // %
  annualExpenses: number, // 万円
  socialInsurance: number, // 万円
  hasInvoice: boolean
) {
  // 円換算
  const netIncome = targetNetIncome * 10_000;
  const expenses = annualExpenses * 10_000;
  const insurance = socialInsurance * 10_000;

  // 概算所得税・住民税（簡易計算）
  // 収入 = 手取り + 税金 + 社保 + 経費
  // 所得 = 収入 - 経費 - 社保控除(半額程度)
  // 所得税率は累進だが概算で25%前後
  const estimatedTaxRate = 0.25;
  // 手取り から必要粗収入を逆算
  const grossIncome = netIncome / (1 - estimatedTaxRate) + expenses + insurance;

  // 消費税（インボイス登録あり = 売上の10%を納税）
  const consumptionTax = hasInvoice ? grossIncome * 0.1 : 0;
  const requiredRevenue = grossIncome + consumptionTax;

  // 実請求可能時間
  const billableHours = workingDays * hoursPerDay * (utilizationRate / 100);

  // 必要時給・単価
  const requiredHourlyRate = billableHours > 0 ? requiredRevenue / billableHours : 0;
  const requiredMonthlyRate = requiredRevenue / 12;
  const estimatedTax = grossIncome * estimatedTaxRate;

  // 日額・週額
  const dailyRate = requiredHourlyRate * hoursPerDay;
  const weeklyRate = dailyRate * 5;

  // 会社員換算（フリーランス収入 × 1/1.5 が会社員年収相当）
  const employeeEquivalent = requiredRevenue / 1.5;

  return {
    requiredRevenue: Math.round(requiredRevenue),
    requiredHourlyRate: Math.round(requiredHourlyRate),
    requiredMonthlyRate: Math.round(requiredMonthlyRate),
    billableHours: Math.round(billableHours),
    estimatedTax: Math.round(estimatedTax),
    dailyRate: Math.round(dailyRate),
    weeklyRate: Math.round(weeklyRate),
    employeeEquivalent: Math.round(employeeEquivalent),
    breakdown: {
      netIncome,
      estimatedTax: Math.round(estimatedTax),
      insurance,
      expenses,
      consumptionTax: Math.round(consumptionTax),
    },
  };
}

// ─── 単価シミュレーション表
const RATE_LEVELS = [3000, 4000, 5000, 6000, 7000, 8000, 10000];

function fmt(n: number) {
  return n.toLocaleString("ja-JP");
}
function fmtMan(n: number) {
  return `${Math.round(n / 10_000).toLocaleString("ja-JP")}万円`;
}

export default function HourlyRate() {
  const [targetNet, setTargetNet] = useState(400);
  const [workingDays, setWorkingDays] = useState(220);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [utilization, setUtilization] = useState(75);
  const [expenses, setExpenses] = useState(60);
  const [socialInsurance, setSocialInsurance] = useState(60);
  const [hasInvoice, setHasInvoice] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(
    () =>
      calcHourlyRate(
        targetNet,
        workingDays,
        hoursPerDay,
        utilization,
        expenses,
        socialInsurance,
        hasInvoice
      ),
    [targetNet, workingDays, hoursPerDay, utilization, expenses, socialInsurance, hasInvoice]
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヒーローヘッダー */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">💼</span>
          <h1 className="text-2xl font-bold">フリーランス時給・単価設定計算</h1>
        </div>
        <p className="text-sm opacity-85">
          目標手取り年収・稼働条件・経費から必要な請求単価を逆算します。
        </p>
      </div>

      <AdBanner />

      {/* ─── 入力パネル */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
        {/* 目標手取り年収 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            目標手取り年収
          </label>
          <input
            type="range"
            min={100}
            max={2000}
            step={10}
            value={targetNet}
            onChange={(e) => setTargetNet(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-purple-600
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-600
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-purple-200 to-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>100万</span>
            <span>500万</span>
            <span>1,000万</span>
            <span>2,000万</span>
          </div>
          <div className="text-center text-3xl font-extrabold text-purple-700 mt-2">
            {fmt(targetNet)}万円
          </div>
        </div>

        {/* 稼働日数・時間 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              年間稼働日数（日）
            </label>
            <input
              type="number"
              min={50}
              max={365}
              value={workingDays}
              onChange={(e) => setWorkingDays(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              1日の稼働時間（時間）
            </label>
            <input
              type="number"
              min={1}
              max={16}
              value={hoursPerDay}
              onChange={(e) => setHoursPerDay(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* 稼働率 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            稼働率（請求可能割合）― {utilization}%
          </label>
          <input
            type="range"
            min={30}
            max={100}
            step={5}
            value={utilization}
            onChange={(e) => setUtilization(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-violet-500
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-violet-100 to-violet-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>30%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <p className="text-center text-xs text-gray-500 mt-1">
            実請求可能時間: {fmt(result.billableHours)}時間/年
          </p>
        </div>

        {/* 経費・社会保険 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              年間経費（万円）
            </label>
            <input
              type="number"
              min={0}
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-xs text-gray-400 mt-1">通信・交通・機材・研修費など</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              社会保険料（万円/年）
            </label>
            <input
              type="number"
              min={0}
              value={socialInsurance}
              onChange={(e) => setSocialInsurance(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-xs text-gray-400 mt-1">国民健康保険＋国民年金の概算</p>
          </div>
        </div>

        {/* インボイス */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            消費税インボイス登録
          </label>
          <div className="flex gap-3">
            {[
              { val: true, label: "あり（消費税を納税）" },
              { val: false, label: "なし（免税事業者）" },
            ].map((opt) => (
              <button
                key={String(opt.val)}
                onClick={() => setHasInvoice(opt.val)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-colors ${
                  hasInvoice === opt.val
                    ? "bg-purple-600 text-white border-purple-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── メイン結果カード */}
      <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <p className="text-sm opacity-85 mb-1">必要時給</p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">
          {fmt(result.requiredHourlyRate)}円/時
        </p>
        <p className="text-sm opacity-75 mb-4">
          必要年商: {fmtMan(result.requiredRevenue)}
        </p>
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/30 text-center">
          <div>
            <p className="text-xs opacity-75">必要月額単価</p>
            <p className="text-lg font-bold">{fmtMan(result.requiredMonthlyRate)}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">日額換算</p>
            <p className="text-lg font-bold text-yellow-300">{fmt(result.dailyRate)}円</p>
          </div>
          <div>
            <p className="text-xs opacity-75">週額換算</p>
            <p className="text-lg font-bold text-green-300">{fmt(result.weeklyRate)}円</p>
          </div>
        </div>
      </div>

      {/* ─── 内訳・比較カード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* 収入内訳 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3">必要年商の内訳</h2>
          <div className="space-y-2 text-sm">
            {[
              { label: "手取り目標", value: result.breakdown.netIncome, color: "text-purple-600" },
              { label: "所得税・住民税（概算）", value: result.breakdown.estimatedTax, color: "text-orange-500" },
              { label: "社会保険料", value: result.breakdown.insurance, color: "text-blue-500" },
              { label: "年間経費", value: result.breakdown.expenses, color: "text-gray-600" },
              { label: "消費税（インボイス）", value: result.breakdown.consumptionTax, color: "text-red-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-600">{label}</span>
                <span className={`font-semibold ${color}`}>{fmtMan(value)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-gray-200 font-bold">
              <span className="text-gray-800">合計（必要年商）</span>
              <span className="text-purple-700">{fmtMan(result.requiredRevenue)}</span>
            </div>
          </div>
        </div>

        {/* 会社員換算 */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 mb-3">会社員換算給与</h2>
          <p className="text-xs text-gray-500 mb-3">
            同じ手取りを得るための会社員年収相当（×1.5倍換算）
          </p>
          <p className="text-3xl font-extrabold text-purple-800">
            {fmtMan(result.employeeEquivalent)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            フリーランスは社会保険・福利厚生を自己負担するため、
            同等の手取りには会社員の1.4〜1.7倍の収入が必要です。
          </p>
          <div className="mt-3 pt-3 border-t border-purple-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">あなたの必要年商</span>
              <span className="font-bold text-purple-700">{fmtMan(result.requiredRevenue)}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600">会社員換算年収</span>
              <span className="font-bold text-gray-700">{fmtMan(result.employeeEquivalent)}</span>
            </div>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── 単価別シミュレーション表 */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">時給別 年収シミュレーション</h2>
        <p className="text-xs text-gray-400 mb-4">
          稼働時間 {fmt(result.billableHours)}時間/年 での概算収入
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">時給</th>
                <th className="text-right py-2 px-2 font-medium">年商</th>
                <th className="text-right py-2 px-2 font-medium">月額単価</th>
                <th className="text-right py-2 px-2 font-medium">概算手取り</th>
              </tr>
            </thead>
            <tbody>
              {RATE_LEVELS.map((rate) => {
                const annualRev = rate * result.billableHours;
                const monthly = annualRev / 12;
                const approxNet = annualRev * 0.6; // 概算60%
                const isNeeded = rate >= result.requiredHourlyRate &&
                  (RATE_LEVELS.indexOf(rate) === 0 ||
                    RATE_LEVELS[RATE_LEVELS.indexOf(rate) - 1] < result.requiredHourlyRate);
                return (
                  <tr
                    key={rate}
                    className={`border-b border-gray-100 ${
                      isNeeded ? "bg-purple-50 font-bold" : ""
                    }`}
                  >
                    <td className={`py-2.5 px-2 ${isNeeded ? "text-purple-700" : "text-gray-800"}`}>
                      {fmt(rate)}円
                      {isNeeded && (
                        <span className="ml-1 text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full">
                          目標
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-2 text-right text-gray-700">
                      {fmtMan(annualRev)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-gray-700">
                      {fmtMan(monthly)}
                    </td>
                    <td className={`py-2.5 px-2 text-right ${approxNet >= targetNet * 10_000 ? "text-green-600 font-semibold" : "text-gray-500"}`}>
                      {fmtMan(approxNet)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          ※ 概算手取りは年商の約60%で試算。実際は経費・税率・控除により異なります。
        </p>
      </div>

      {/* ─── FAQ */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-purple-600 transition-colors"
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

      <RelatedTools currentToolId="hourly-rate" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このツールは概算です。税率・社会保険料は所得や状況によって異なります。
        正確な計算は税理士または社会保険労務士にご相談ください。
        入力情報はサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
