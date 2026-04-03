"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

export default function PensionForecastPage() {
  const [currentAge, setCurrentAge] = useState("35");
  const [retirementAge, setRetirementAge] = useState("65");
  const [receiveAge, setReceiveAge] = useState("65");
  const [averageSalary, setAverageSalary] = useState("");
  const [enrolledYears, setEnrolledYears] = useState("");
  const [pensionType, setPensionType] = useState<"both" | "kokuho">("both");

  const result = useMemo(() => {
    const ca = parseInt(currentAge);
    const ra = parseInt(retirementAge);
    const recv = parseInt(receiveAge);
    const salary = parseFloat(averageSalary) * 10000; // 万円 → 円
    const enrolled = parseInt(enrolledYears) || 0;
    const futureYears = Math.max(0, ra - ca);
    const totalYears = enrolled + futureYears;

    if (!salary || !ra || !recv) return null;

    // 老齢基礎年金（満額 795,000円/年 = 66,250円/月 ※2024年度）
    const maxBasicPension = 795000; // 年額
    const basicPensionYearly = (totalYears >= 40 ? 1 : totalYears / 40) * maxBasicPension;
    const basicPensionMonthly = basicPensionYearly / 12;

    // 老齢厚生年金の概算（平均標準報酬月額 × 5.481/1000 × 加入月数）
    const avgMonthlyIncome = salary / 12;
    const kousei = pensionType === "both"
      ? avgMonthlyIncome * (5.481 / 1000) * totalYears * 12
      : 0;
    const kouseiMonthly = kousei / 12;

    // 繰上げ・繰下げ調整
    const monthsDiff = (recv - 65) * 12;
    let adjustRate = 1;
    if (monthsDiff < 0) {
      adjustRate = 1 + monthsDiff * 0.004; // 繰上げ: -0.4%/月
    } else if (monthsDiff > 0) {
      adjustRate = 1 + monthsDiff * 0.007; // 繰下げ: +0.7%/月
    }

    const totalMonthlyAtReceive = (basicPensionMonthly + kouseiMonthly) * adjustRate;
    const totalYearlyAtReceive = totalMonthlyAtReceive * 12;

    // 受給期間と総額（平均寿命84歳まで）
    const receiveYears = Math.max(0, 84 - recv);
    const lifetimeTotal = totalYearlyAtReceive * receiveYears;

    return {
      basicPensionMonthly: Math.round(basicPensionMonthly),
      kouseiMonthly: Math.round(kouseiMonthly),
      totalMonthlyBase: Math.round(basicPensionMonthly + kouseiMonthly),
      totalMonthlyAdjusted: Math.round(totalMonthlyAtReceive),
      adjustRate: (adjustRate * 100 - 100).toFixed(1),
      totalYearly: Math.round(totalYearlyAtReceive),
      totalYears: totalYears,
      lifetimeTotal: Math.round(lifetimeTotal),
      receiveYears,
    };
  }, [currentAge, retirementAge, receiveAge, averageSalary, enrolledYears, pensionType]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">将来の年金受給額シミュレーター</h1>
      <p className="text-gray-600 mb-6">老齢厚生年金・老齢基礎年金の受給額を概算します。老後資金計画にご活用ください。</p>

      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">年金種別</label>
          <div className="flex gap-2">
            <button onClick={() => setPensionType("both")} className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${pensionType === "both" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
              厚生年金＋基礎年金（会社員）
            </button>
            <button onClick={() => setPensionType("kokuho")} className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${pensionType === "kokuho" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>
              国民年金のみ（自営業）
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">現在の年齢</label>
            <input type="number" value={currentAge} onChange={(e) => setCurrentAge(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">退職予定年齢</label>
            <input type="number" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">平均年収（万円）</label>
            <input type="number" value={averageSalary} onChange={(e) => setAverageSalary(e.target.value)} placeholder="例: 500" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">現在までの加入年数</label>
            <input type="number" value={enrolledYears} onChange={(e) => setEnrolledYears(e.target.value)} placeholder="例: 10" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">受給開始年齢</label>
          <div className="flex gap-2 flex-wrap">
            {[60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 75].map((age) => (
              <button key={age} onClick={() => setReceiveAge(String(age))}
                className={`px-3 py-1 rounded text-sm border ${receiveAge === String(age) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}>
                {age}歳
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">年金受給額シミュレーション結果</h2>

          <div className="bg-white rounded-xl p-5 text-center mb-4">
            <p className="text-sm text-gray-600">月額受給額（{receiveAge}歳受給開始）</p>
            <p className="text-4xl font-bold text-blue-600">¥{formatNum(result.totalMonthlyAdjusted)}<span className="text-lg">/月</span></p>
            {parseFloat(result.adjustRate) !== 0 && (
              <p className="text-sm text-gray-500 mt-1">
                65歳比 {parseFloat(result.adjustRate) > 0 ? "+" : ""}{result.adjustRate}%（{parseFloat(result.adjustRate) > 0 ? "繰下げ" : "繰上げ"}受給）
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">老齢基礎年金</p>
              <p className="text-xl font-bold text-gray-700">¥{formatNum(result.basicPensionMonthly)}</p>
              <p className="text-xs text-gray-500">/月</p>
            </div>
            {pensionType === "both" && (
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">老齢厚生年金</p>
                <p className="text-xl font-bold text-gray-700">¥{formatNum(result.kouseiMonthly)}</p>
                <p className="text-xs text-gray-500">/月</p>
              </div>
            )}
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">年間受給額</p>
              <p className="text-xl font-bold text-green-600">¥{formatNum(result.totalYearly)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">生涯受給総額（84歳まで）</p>
              <p className="text-xl font-bold text-orange-500">¥{formatNum(result.lifetimeTotal)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">※概算値です。実際の受給額はねんきん定期便・ねんきんネットで確認してください。</p>
        </div>
      )}

      <AdBanner />

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">年金はいくらもらえる？平均は？</h3>
            <p className="text-sm text-gray-600 mt-1">老齢基礎年金の満額は約66,250円/月。厚生年金を合わせた平均は約145,000円/月（2024年度）です。夫婦2人だと約22万円が目安です。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">年金の繰下げ受給はいつまでできる？</h3>
            <p className="text-sm text-gray-600 mt-1">75歳まで繰下げ可能。75歳まで繰下げると65歳受給の1.84倍（84%増）になります。ただし受給開始が遅くなるため、長生きするほど有利です。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">ねんきん定期便はどこで確認できますか？</h3>
            <p className="text-sm text-gray-600 mt-1">毎年誕生月に郵送されます。またはマイナポータルや「ねんきんネット」（日本年金機構のウェブサービス）でいつでも確認できます。</p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="pension-forecast" />
    </main>
  );
}
