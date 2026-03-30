"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";

const fmt = (n: number) => Math.round(n).toLocaleString("ja-JP");
const BASE_FULL = 816000; // 2025年度 老齢基礎年金満額

type JobType = "会社員" | "自営業" | "公務員";

function calcPension(
  jobType: JobType,
  annualIncome: number,
  joinYears: number,
  startAge: number
): { kiso: number; kosei: number; baseTotal: number; annual: number; monthly: number } {
  // 老齢基礎年金
  const kiso = BASE_FULL * (Math.min(joinYears, 40) / 40);

  // 老齢厚生年金（会社員・公務員のみ）
  const avgMonthly = annualIncome / 12;
  const kosei =
    jobType !== "自営業"
      ? avgMonthly * (5.481 / 1000) * (joinYears * 12)
      : 0;

  const baseTotal = kiso + kosei;

  // 繰り上げ/繰り下げ補正
  const monthsDiff = (startAge - 65) * 12;
  let adjustRate = 1;
  if (monthsDiff < 0) adjustRate = 1 + monthsDiff * 0.004; // 繰り上げ: -0.4%/月
  else if (monthsDiff > 0) adjustRate = 1 + monthsDiff * 0.007; // 繰り下げ: +0.7%/月

  const annual = baseTotal * adjustRate;
  const monthly = annual / 12;

  return { kiso, kosei, baseTotal, annual, monthly };
}

const AGE_TABLE_ROWS = Array.from({ length: 16 }, (_, i) => 60 + i); // 60〜75

export default function PensionCalc() {
  const [jobType, setJobType] = useState<JobType>("会社員");
  const [annualIncome, setAnnualIncome] = useState(4500000); // 450万
  const [joinYears, setJoinYears] = useState(35);
  const [startAge, setStartAge] = useState(65);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(
    () => calcPension(jobType, annualIncome, joinYears, startAge),
    [jobType, annualIncome, joinYears, startAge]
  );

  // 受給開始年齢テーブル（65歳基準との比較）
  const ageRows = useMemo(() => {
    return AGE_TABLE_ROWS.map((age) => {
      const r = calcPension(jobType, annualIncome, joinYears, age);
      // 80歳時の累計受給額（受給開始年齢〜80歳までの月数）
      const months = Math.max(0, (80 - age) * 12);
      const cumulative = r.monthly * months;
      return { age, monthly: r.monthly, annual: r.annual, cumulative };
    });
  }, [jobType, annualIncome, joinYears]);

  // 損益分岐点（vs 65歳受給）
  const breakeven = useMemo(() => {
    if (startAge === 65) return null;
    const base65 = calcPension(jobType, annualIncome, joinYears, 65);
    const baseSel = result;
    // 65歳から受給し始めた場合の累計 vs 選択年齢から受給した場合の累計が等しくなる年齢
    // 65歳時点での差分: 選択年齢が65歳より早い場合は65歳時点で既に受給している
    // 数式: base65.monthly * (X - 65) * 12 = baseSel.monthly * (X - startAge) * 12
    // => X = (baseSel.monthly * startAge - base65.monthly * 65) / (baseSel.monthly - base65.monthly)
    const diff = baseSel.monthly - base65.monthly;
    if (Math.abs(diff) < 1) return null;
    const breakAge =
      (baseSel.monthly * startAge - base65.monthly * 65) / diff;
    return Math.round(breakAge * 10) / 10;
  }, [jobType, annualIncome, joinYears, startAge, result]);

  const kisoRate =
    result.baseTotal > 0 ? (result.kiso / result.baseTotal) * 100 : 100;
  const koseiRate = 100 - kisoRate;

  const faqs = [
    {
      q: "年金はいくらもらえますか？",
      a: "年金受給額は加入期間と平均年収によって異なります。会社員の場合、老齢基礎年金（国民年金）＋老齢厚生年金の合計が受け取れます。平均的なサラリーマンで月額約14〜16万円程度が目安です。",
    },
    {
      q: "年金の受給開始年齢はいつですか？",
      a: "原則65歳からですが、60〜75歳の間で選択できます。65歳より早く受け取ると減額（最大24%減）、遅くすると増額（最大84%増）されます。",
    },
    {
      q: "繰り下げ受給はお得ですか？",
      a: "1ヶ月遅らせるごとに0.7%増額されます。75歳まで遅らせると最大84%増。損益分岐点は約80歳前後です。健康状態や家族状況を考慮して判断してください。",
    },
    {
      q: "老齢基礎年金と老齢厚生年金の違いは？",
      a: "老齢基礎年金は国民全員が対象で、40年加入で満額約81万6,000円/年（2025年度）。老齢厚生年金は会社員・公務員が対象で、現役時代の年収と加入期間で決まります。",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          年金受給額シミュレーター
        </h1>
        <p className="text-gray-500 mt-1">
          加入年数・年収・受給開始年齢から老齢基礎年金＋厚生年金を無料シミュレーション。
        </p>
      </div>

      <AdBanner />

      {/* 入力パネル */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
        <h2 className="font-bold text-gray-900">入力情報</h2>

        {/* 職業区分 */}
        <div className="space-y-2">
          <span className="text-sm text-gray-600">職業区分</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(
              [
                { v: "会社員", l: "会社員（厚生年金）" },
                { v: "自営業", l: "自営業・フリーランス（国民年金のみ）" },
                { v: "公務員", l: "公務員（共済年金）" },
              ] as { v: JobType; l: string }[]
            ).map(({ v, l }) => (
              <button
                key={v}
                onClick={() => setJobType(v)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all text-left sm:text-center ${
                  jobType === v
                    ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                    : "border-gray-200 text-gray-600 hover:border-emerald-300"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* 平均年収 */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">平均年収</span>
            <span className="font-semibold text-gray-900">
              {fmt(annualIncome / 10000)}万円
            </span>
          </div>
          <input
            type="range"
            min={1000000}
            max={15000000}
            step={100000}
            value={annualIncome}
            onChange={(e) => setAnnualIncome(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>100万</span>
            <span>1,500万</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[200, 300, 450, 600, 800, 1000].map((v) => (
              <button
                key={v}
                onClick={() => setAnnualIncome(v * 10000)}
                className={`px-3 py-1 rounded-full text-xs border transition-all ${
                  annualIncome === v * 10000
                    ? "bg-emerald-100 border-emerald-400 text-emerald-700"
                    : "border-gray-200 text-gray-600 hover:border-emerald-300"
                }`}
              >
                {v}万
              </button>
            ))}
          </div>
        </div>

        {/* 加入年数 */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">加入年数</span>
            <span className="font-semibold text-gray-900">{joinYears}年</span>
          </div>
          <input
            type="range"
            min={1}
            max={45}
            step={1}
            value={joinYears}
            onChange={(e) => setJoinYears(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1年</span>
            <span>45年</span>
          </div>
        </div>

        {/* 受給開始年齢 */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">受給開始年齢</span>
            <span className="font-semibold text-gray-900">
              {startAge}歳
              {startAge < 65 && (
                <span className="ml-1 text-xs text-orange-500 font-normal">
                  （繰り上げ {Math.round((65 - startAge) * 12 * 0.4)}%減）
                </span>
              )}
              {startAge > 65 && (
                <span className="ml-1 text-xs text-emerald-500 font-normal">
                  （繰り下げ +{Math.round((startAge - 65) * 12 * 0.7)}%増）
                </span>
              )}
            </span>
          </div>
          <input
            type="range"
            min={60}
            max={75}
            step={1}
            value={startAge}
            onChange={(e) => setStartAge(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>60歳（繰り上げ）</span>
            <span>65歳</span>
            <span>75歳（繰り下げ）</span>
          </div>
        </div>
      </div>

      {/* ヒーロー結果カード */}
      <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 text-center border border-emerald-100">
        <p className="text-sm text-emerald-600 font-medium">月額受給額（{startAge}歳受給開始）</p>
        <p className="text-5xl sm:text-6xl font-bold text-emerald-600 mt-2">
          {fmt(result.monthly)}
          <span className="text-2xl ml-1">円</span>
        </p>
        <p className="text-gray-500 mt-1 text-sm">
          年額 {fmt(result.annual)}円
        </p>

        {/* 内訳バー */}
        <div className="mt-5">
          <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
            <div
              className="bg-emerald-400 transition-all duration-300"
              style={{ width: `${kisoRate}%` }}
            />
            <div
              className="bg-green-600 transition-all duration-300"
              style={{ width: `${koseiRate}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-600">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
              老齢基礎年金 {fmt(result.kiso / 12)}円/月
            </span>
            {result.kosei > 0 && (
              <span className="flex items-center gap-1 text-green-700">
                <span className="inline-block w-2 h-2 rounded-full bg-green-600" />
                老齢厚生年金 {fmt(result.kosei / 12)}円/月
              </span>
            )}
          </div>
        </div>

        {/* 内訳グリッド */}
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-emerald-200">
          <div>
            <p className="text-xs text-gray-500">老齢基礎年金（年額）</p>
            <p className="font-bold text-emerald-600">{fmt(result.kiso)}円</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">
              {jobType === "自営業" ? "老齢厚生年金" : "老齢厚生年金（年額）"}
            </p>
            <p className={`font-bold ${result.kosei > 0 ? "text-green-700" : "text-gray-400"}`}>
              {result.kosei > 0 ? `${fmt(result.kosei)}円` : "対象外"}
            </p>
          </div>
        </div>
      </div>

      {/* 損益分岐点 */}
      {breakeven !== null && (
        <div
          className={`rounded-xl border p-4 text-sm ${
            startAge > 65
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-orange-50 border-orange-200 text-orange-800"
          }`}
        >
          <p className="font-bold mb-1">
            {startAge > 65 ? "繰り下げの損益分岐点" : "繰り上げの損益分岐点"}
          </p>
          {breakeven > 0 && breakeven < 120 ? (
            <p>
              <span className="font-bold text-lg">{breakeven}歳</span>
              以上生きると{startAge > 65 ? "繰り下げ" : "65歳受給"}が有利になります。
              {startAge > 65 && " （65歳受給との比較）"}
            </p>
          ) : (
            <p>
              {startAge > 65
                ? "長寿であれば繰り下げが有利です。健康状態を考慮して判断してください。"
                : "65歳受給の方が累計で有利になるタイミングは計算範囲外です。"}
            </p>
          )}
        </div>
      )}

      {/* 受給開始年齢テーブル */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900 mb-3">受給開始年齢別 比較表</h2>
        <p className="text-xs text-gray-400 mb-3">※ 80歳時累計は受給開始〜80歳までの受取総額</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500 font-medium">受給開始</th>
                <th className="text-right py-2 px-2 text-gray-500 font-medium">月額</th>
                <th className="text-right py-2 px-2 text-gray-500 font-medium">年額</th>
                <th className="text-right py-2 px-2 text-gray-500 font-medium">80歳時累計</th>
              </tr>
            </thead>
            <tbody>
              {ageRows.map((row) => {
                const isSelected = row.age === startAge;
                const isDefault = row.age === 65;
                return (
                  <tr
                    key={row.age}
                    className={`border-b border-gray-100 transition-colors ${
                      isSelected
                        ? "bg-emerald-50 font-bold"
                        : isDefault
                        ? "bg-gray-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-2 px-2 text-gray-800">
                      {row.age}歳
                      {row.age < 65 && (
                        <span className="ml-1 text-xs text-orange-400">繰上</span>
                      )}
                      {row.age === 65 && (
                        <span className="ml-1 text-xs text-gray-400">標準</span>
                      )}
                      {row.age > 65 && (
                        <span className="ml-1 text-xs text-emerald-500">繰下</span>
                      )}
                    </td>
                    <td className="py-2 px-2 text-right text-gray-800">
                      {fmt(row.monthly)}円
                    </td>
                    <td className="py-2 px-2 text-right text-gray-700">
                      {fmt(row.annual / 10000)}万円
                    </td>
                    <td className={`py-2 px-2 text-right ${row.age > 80 ? "text-gray-300" : "text-emerald-600"}`}>
                      {row.age > 80 ? "—" : `${fmt(row.cumulative / 10000)}万円`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* アドバイスカード */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
        <p className="font-bold mb-1">年金を賢く受け取るポイント</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>健康で長生きできそうなら繰り下げ受給が有利（損益分岐は約80歳前後）</li>
          <li>早期退職や家族の事情がある場合は繰り上げも選択肢</li>
          <li>加入年数40年で老齢基礎年金が満額（{fmt(BASE_FULL)}円/年）</li>
          <li>iDeCo・企業型DCと組み合わせて老後資産を増やしましょう</li>
          <li>配偶者がいる場合は加給年金・振替加算も忘れずに確認を</li>
        </ul>
      </div>

      {/* FAQ */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div key={q} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center text-left text-sm font-semibold text-gray-800 hover:text-emerald-600 transition-colors"
              >
                <span>{q}</span>
                <span className="text-gray-400 ml-2 shrink-0 text-lg leading-none">
                  {openFaq === i ? "−" : "＋"}
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        ※ 計算は概算です。実際の受給額は日本年金機構の「ねんきん定期便」や「ねんきんネット」でご確認ください。
      </p>

      <AdBanner />
    </div>
  );
}
