"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

export default function HourlyWageCalcPage() {
  const [calcMode, setCalcMode] = useState<"annual" | "monthly">("annual");
  const [annualIncome, setAnnualIncome] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState("20");
  const [workHoursPerDay, setWorkHoursPerDay] = useState("8");
  const [overtimeHours, setOvertimeHours] = useState("0");
  const [commuteMinutes, setCommuteMinutes] = useState("0");
  const [includeCommute, setIncludeCommute] = useState(false);

  const result = useMemo(() => {
    const days = parseFloat(workDaysPerMonth);
    const hours = parseFloat(workHoursPerDay);
    const overtime = parseFloat(overtimeHours) || 0;
    const commute = parseFloat(commuteMinutes) || 0;

    let monthlyPay = 0;
    if (calcMode === "annual") {
      const annual = parseFloat(annualIncome) * 10000;
      if (!annual) return null;
      monthlyPay = annual / 12;
    } else {
      monthlyPay = parseFloat(monthlyIncome) * 10000;
      if (!monthlyPay) return null;
    }

    const regularHours = days * hours;
    const totalWorkHours = regularHours + overtime;
    const commuteHoursPerMonth = (commute * 2 / 60) * days;
    const effectiveHours = includeCommute ? totalWorkHours + commuteHoursPerMonth : totalWorkHours;

    const hourlyWage = monthlyPay / totalWorkHours;
    const effectiveHourlyWage = monthlyPay / effectiveHours;
    const dailyWage = monthlyPay / days;
    const minuteWage = hourlyWage / 60;

    // 手取りベース（約78%）
    const netHourlyWage = hourlyWage * 0.78;

    return {
      hourlyWage: Math.round(hourlyWage),
      effectiveHourlyWage: Math.round(effectiveHourlyWage),
      netHourlyWage: Math.round(netHourlyWage),
      dailyWage: Math.round(dailyWage),
      minuteWage: minuteWage.toFixed(1),
      totalWorkHours: Math.round(totalWorkHours),
      monthlyPay: Math.round(monthlyPay),
    };
  }, [calcMode, annualIncome, monthlyIncome, workDaysPerMonth, workHoursPerDay, overtimeHours, commuteMinutes, includeCommute]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">時給換算計算</h1>
      <p className="text-gray-600 mb-6">年収・月収から実質時給を計算します。通勤時間込みの実質時給も計算可能。</p>
      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">入力方式</label>
          <div className="flex gap-2">
            <button onClick={() => setCalcMode("annual")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${calcMode === "annual" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>年収から計算</button>
            <button onClick={() => setCalcMode("monthly")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${calcMode === "monthly" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>月収から計算</button>
          </div>
        </div>

        {calcMode === "annual" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">年収（万円）</label>
            <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} placeholder="例: 500" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">月収（万円、手当込み）</label>
            <input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} placeholder="例: 30" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">月の出勤日数</label>
            <input type="number" value={workDaysPerMonth} onChange={(e) => setWorkDaysPerMonth(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1日の所定労働時間</label>
            <input type="number" value={workHoursPerDay} onChange={(e) => setWorkHoursPerDay(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">月の残業時間</label>
            <input type="number" value={overtimeHours} onChange={(e) => setOvertimeHours(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">片道通勤時間（分）</label>
            <input type="number" value={commuteMinutes} onChange={(e) => setCommuteMinutes(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={includeCommute} onChange={(e) => setIncludeCommute(e.target.checked)} />
          通勤時間を労働時間に含めて計算する
        </label>
      </div>

      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">時給換算結果</h2>
          <div className="bg-white rounded-xl p-5 text-center mb-4">
            <p className="text-sm text-gray-600">実質時給（額面）</p>
            <p className="text-5xl font-bold text-blue-600">¥{formatNum(result.hourlyWage)}<span className="text-xl">/h</span></p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">手取りベース時給</p>
              <p className="text-xl font-bold text-green-600">¥{formatNum(result.netHourlyWage)}</p>
            </div>
            {includeCommute && (
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500">通勤込み実質時給</p>
                <p className="text-xl font-bold text-orange-500">¥{formatNum(result.effectiveHourlyWage)}</p>
              </div>
            )}
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">1日あたり</p>
              <p className="text-xl font-bold text-gray-700">¥{formatNum(result.dailyWage)}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">1分あたり</p>
              <p className="text-xl font-bold text-gray-700">¥{result.minuteWage}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">月の総労働時間: {result.totalWorkHours}時間</p>
        </div>
      )}

      <AdBanner />

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">年収400万円の時給はいくら？</h3><p className="text-sm text-gray-600 mt-1">月20日・8時間勤務の場合、時給約2,083円です。残業20時間あれば約1,923円に下がります。手取りベースでは1,500〜1,700円程度です。</p></div>
          <div><h3 className="font-medium text-gray-900">副業の時給はどう比較すればよい？</h3><p className="text-sm text-gray-600 mt-1">本業の時給と副業の時給を比べて、副業の方が高ければ副業に注力する価値があります。ただし本業のスキルアップにつながる副業は将来的な価値も考慮してください。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="hourly-wage-calc" />
    </main>
  );
}
