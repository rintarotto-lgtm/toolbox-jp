"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── FAQ
const FAQS = [
  {
    question: "緊急予備資金はいくら必要ですか？",
    answer:
      "一般的に生活費の3〜6ヶ月分が推奨されています。会社員は3ヶ月、自営業・フリーランスは6〜12ヶ月を目安にしましょう。",
  },
  {
    question: "緊急予備資金はどこに置くべきですか？",
    answer:
      "普通預金や高金利の定期預金など、すぐに引き出せる流動性の高い場所が最適です。投資に回してはいけません。確実に使えることが最優先です。",
  },
  {
    question: "緊急予備資金と投資はどちらを優先すべきですか？",
    answer:
      "緊急予備資金を先に確保してから投資を始めることが原則です。緊急資金なしで投資すると、急な出費で投資を損切りせざるを得なくなるリスクがあります。",
  },
  {
    question: "緊急予備資金を使ってしまったらどうすればいいですか？",
    answer:
      "使った分を速やかに補充することが重要です。緊急出費後は投資・贅沢を一時停止し、まず緊急資金の回復を優先しましょう。",
  },
];

type EmploymentType = "正社員" | "契約・派遣" | "個人事業主・フリーランス" | "経営者";
type FamilyType = "独身" | "夫婦のみ" | "子あり";
type HousingType = "賃貸" | "持ち家（ローンあり）" | "持ち家（ローンなし）";
type IncomeStability = "安定" | "やや不安定" | "不安定";

function calcRecommendedMonths(
  employment: EmploymentType,
  family: FamilyType,
  housing: HousingType,
  stability: IncomeStability
): { months: number; reasons: string[] } {
  // ベースの月数
  const baseMap: Record<EmploymentType, number> = {
    "正社員": 3,
    "契約・派遣": 4,
    "個人事業主・フリーランス": 6,
    "経営者": 9,
  };
  let months = baseMap[employment];
  const reasons: string[] = [`${employment}のため基本${baseMap[employment]}ヶ月`];

  if (family === "子あり") {
    months += 1;
    reasons.push("子ありのため+1ヶ月");
  }
  if (housing === "持ち家（ローンあり）") {
    months += 1;
    reasons.push("住宅ローンあり（修繕費リスク）のため+1ヶ月");
  }
  if (stability === "やや不安定") {
    months += 1;
    reasons.push("収入がやや不安定なため+1ヶ月");
  } else if (stability === "不安定") {
    months += 2;
    reasons.push("収入が不安定なため+2ヶ月");
  }

  return { months, reasons };
}

export default function EmergencyFund() {
  const [monthlyCost, setMonthlyCost] = useState(20);
  const [employment, setEmployment] = useState<EmploymentType>("正社員");
  const [family, setFamily] = useState<FamilyType>("独身");
  const [housing, setHousing] = useState<HousingType>("賃貸");
  const [stability, setStability] = useState<IncomeStability>("安定");
  const [currentSavings, setCurrentSavings] = useState(30);
  const [monthlyContrib, setMonthlyContrib] = useState(3);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { months: recommendedMonths, reasons } = useMemo(
    () => calcRecommendedMonths(employment, family, housing, stability),
    [employment, family, housing, stability]
  );

  const target = useMemo(() => monthlyCost * recommendedMonths, [monthlyCost, recommendedMonths]);
  const remaining = Math.max(0, target - currentSavings);
  const fulfillmentRate = Math.min(100, Math.round((currentSavings / Math.max(target, 1)) * 100));
  const monthsToGoal = remaining > 0 && monthlyContrib > 0
    ? Math.ceil(remaining / monthlyContrib)
    : 0;

  const employmentOptions: EmploymentType[] = ["正社員", "契約・派遣", "個人事業主・フリーランス", "経営者"];
  const familyOptions: FamilyType[] = ["独身", "夫婦のみ", "子あり"];
  const housingOptions: HousingType[] = ["賃貸", "持ち家（ローンあり）", "持ち家（ローンなし）"];
  const stabilityOptions: IncomeStability[] = ["安定", "やや不安定", "不安定"];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヒーローヘッダー ─── */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🏦</span>
          <h1 className="text-2xl font-bold">緊急予備資金計算</h1>
        </div>
        <p className="text-sm opacity-90">
          雇用形態・家族構成・生活費から生活防衛資金の目標額と積立プランを計算します。
        </p>
      </div>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-800">条件を入力</h2>

        {/* 月の生活費 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">月の生活費</label>
          <input
            type="range"
            min={5}
            max={60}
            step={1}
            value={monthlyCost}
            onChange={(e) => setMonthlyCost(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-green-600
              bg-gradient-to-r from-green-200 to-green-500"
          />
          <p className="text-center text-xl font-bold text-green-700 mt-1">{monthlyCost}万円/月</p>
        </div>

        {/* 雇用形態 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">雇用形態</label>
          <div className="grid grid-cols-2 gap-2">
            {employmentOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setEmployment(opt)}
                className={`py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                  employment === opt
                    ? "bg-green-600 text-white border-green-600 shadow"
                    : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 家族構成 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">家族構成</label>
          <div className="flex gap-2">
            {familyOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFamily(opt)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  family === opt
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-emerald-400"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 住宅 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">住宅</label>
          <div className="grid grid-cols-3 gap-2">
            {housingOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setHousing(opt)}
                className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                  housing === opt
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 収入の安定度 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">収入の安定度</label>
          <div className="flex gap-2">
            {stabilityOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setStability(opt)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  stability === opt
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-teal-400"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* 現在の緊急用貯蓄 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">現在の緊急用貯蓄</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={10000}
              step={10}
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Math.max(0, Number(e.target.value)))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">万円</span>
          </div>
        </div>

        {/* 毎月積立可能額 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">毎月積立可能額</label>
          <input
            type="range"
            min={0}
            max={30}
            step={0.5}
            value={monthlyContrib}
            onChange={(e) => setMonthlyContrib(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-green-500
              bg-gradient-to-r from-green-100 to-green-400"
          />
          <p className="text-center text-xl font-bold text-green-600 mt-1">{monthlyContrib}万円/月</p>
        </div>
      </div>

      {/* ─── 結果カード ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* 推奨緊急資金目標額 大カード */}
        <div className="sm:col-span-2 bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-80 mb-1">推奨緊急資金目標額</p>
          <p className="text-4xl font-extrabold tracking-tight">
            {target.toLocaleString("ja-JP")}万円
          </p>
          <p className="text-xs opacity-70 mt-1">
            月{monthlyCost}万円 × {recommendedMonths}ヶ月分
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {reasons.map((r, i) => (
              <span key={i} className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                {r}
              </span>
            ))}
          </div>
        </div>

        {/* 現在の充足率 */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-xs text-green-600 mb-2">現在の充足率</p>
          <p className="text-3xl font-bold text-green-700 mb-2">{fulfillmentRate}%</p>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                fulfillmentRate >= 100 ? "bg-green-500" : fulfillmentRate >= 50 ? "bg-yellow-400" : "bg-red-400"
              }`}
              style={{ width: `${Math.min(100, fulfillmentRate)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {fulfillmentRate >= 100
              ? "目標達成済み！"
              : `あと${remaining.toLocaleString("ja-JP")}万円`}
          </p>
        </div>

        {/* 積立達成期間 */}
        <div className={`rounded-xl p-4 border ${
          fulfillmentRate >= 100
            ? "bg-emerald-50 border-emerald-200"
            : "bg-teal-50 border-teal-200"
        }`}>
          <p className={`text-xs mb-1 ${fulfillmentRate >= 100 ? "text-emerald-600" : "text-teal-600"}`}>
            {fulfillmentRate >= 100 ? "達成ステータス" : "積立達成まで"}
          </p>
          {fulfillmentRate >= 100 ? (
            <p className="text-2xl font-bold text-emerald-600">達成済み！</p>
          ) : monthlyContrib > 0 ? (
            <>
              <p className="text-3xl font-bold text-teal-700">
                {monthsToGoal >= 12
                  ? `約${Math.floor(monthsToGoal / 12)}年${monthsToGoal % 12}ヶ月`
                  : `${monthsToGoal}ヶ月`}
              </p>
              <p className="text-xs text-gray-500 mt-1">月{monthlyContrib}万円積立の場合</p>
            </>
          ) : (
            <p className="text-sm text-teal-600">積立額を設定してください</p>
          )}
        </div>
      </div>

      <AdBanner />

      {/* ─── 資金の置き場所アドバイス ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">緊急資金の置き場所</h2>
        <div className="space-y-3">
          {[
            {
              label: "普通預金（メガバンク・ネット銀行）",
              desc: "即時引き出し可能。ネット銀行は金利が高い傾向あり（例: 住信SBIネット銀行、楽天銀行）。",
              badge: "流動性 最高",
              badgeColor: "bg-green-100 text-green-700",
            },
            {
              label: "高金利定期預金",
              desc: "普通預金より金利が高く、解約すればすぐ使える。緊急資金の一部に最適。",
              badge: "バランス型",
              badgeColor: "bg-blue-100 text-blue-700",
            },
            {
              label: "MRF（マネー・リザーブ・ファンド）",
              desc: "証券口座の待機資金。元本割れリスクが極めて低く、随時換金可能。",
              badge: "利便性 高",
              badgeColor: "bg-indigo-100 text-indigo-700",
            },
            {
              label: "投資（株・投信）",
              badge: "緊急資金には不適",
              badgeColor: "bg-red-100 text-red-700",
              desc: "価格変動リスクがあるため、緊急時に必要な額を下回る可能性があります。緊急資金には使わないこと。",
            },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-800">{item.label}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 達成後の次のステップ ─── */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-bold text-green-800 mb-3">
          {fulfillmentRate >= 100 ? "🎉 達成後の次のステップ" : "💡 目標達成後の次のステップ"}
        </h2>
        <p className="text-sm text-green-700 mb-3">
          緊急資金が確保できたら、税制優遇を活用した資産形成を始めましょう。
        </p>
        <ul className="space-y-2 text-sm text-green-700">
          <li className="flex gap-2">
            <span className="shrink-0 font-bold">1.</span>
            <span><strong>iDeCo（個人型確定拠出年金）</strong>：掛金が全額所得控除。老後資金として最優先で検討。月5,000円から始められます。</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-bold">2.</span>
            <span><strong>NISA（積立投資枠）</strong>：年間120万円まで運用益が非課税。インデックスファンドでの長期積立が基本戦略です。</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0 font-bold">3.</span>
            <span><strong>NISA（成長投資枠）</strong>：年間240万円まで。緊急資金・iDeCo・積立NISAを活用後の余剰資金で検討しましょう。</span>
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
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-green-600"
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

      <RelatedTools currentToolId="emergency-fund" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。推奨月数はあくまで目安であり、個人の状況によって最適な金額は異なります。
        資産形成については、ファイナンシャルプランナー等の専門家にご相談ください。
        入力情報はブラウザ上でのみ処理され、サーバーへ送信されることは一切ありません。
      </p>
    </div>
  );
}
