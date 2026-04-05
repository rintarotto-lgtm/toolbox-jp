"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const RECOMMENDED_SLEEP: Record<string, { min: number; max: number; label: string }> = {
  "teen": { min: 8, max: 10, label: "10〜17歳" },
  "young": { min: 7, max: 9, label: "18〜25歳" },
  "adult": { min: 7, max: 9, label: "26〜64歳" },
  "senior": { min: 7, max: 8, label: "65歳以上" },
};

export default function SleepDebtCalcPage() {
  const [ageGroup, setAgeGroup] = useState("adult");
  const [actualSleep, setActualSleep] = useState("");
  const [weekdaySleep, setWeekdaySleep] = useState("");
  const [weekendSleep, setWeekendSleep] = useState("");
  const [mode, setMode] = useState<"daily" | "weekly">("daily");

  const result = useMemo(() => {
    const rec = RECOMMENDED_SLEEP[ageGroup];
    const optimal = (rec.min + rec.max) / 2;

    if (mode === "daily") {
      const actual = parseFloat(actualSleep);
      if (!actual) return null;
      const dailyDebt = Math.max(0, optimal - actual);
      const weeklyDebt = dailyDebt * 7;
      const monthlyDebt = dailyDebt * 30;
      const recoveryDays = dailyDebt > 0 ? Math.ceil(weeklyDebt / 1.5) : 0;
      return { dailyDebt, weeklyDebt, monthlyDebt, recoveryDays, optimal, actual, deficit: optimal - actual };
    } else {
      const wd = parseFloat(weekdaySleep);
      const we = parseFloat(weekendSleep);
      if (!wd || !we) return null;
      const weekdayDebt = Math.max(0, optimal - wd) * 5;
      const weekendDebt = Math.max(0, optimal - we) * 2;
      const weeklyDebt = weekdayDebt + weekendDebt;
      const dailyDebt = weeklyDebt / 7;
      const monthlyDebt = dailyDebt * 30;
      const recoveryDays = weeklyDebt > 0 ? Math.ceil(weeklyDebt / 1.5) : 0;
      return { dailyDebt, weeklyDebt, monthlyDebt, recoveryDays, optimal, weekdayAvg: wd, weekendAvg: we, deficit: dailyDebt };
    }
  }, [ageGroup, actualSleep, weekdaySleep, weekendSleep, mode]);

  const formatH = (h: number) => {
    const hours = Math.floor(Math.abs(h));
    const mins = Math.round((Math.abs(h) - hours) * 60);
    return `${hours}時間${mins > 0 ? mins + "分" : ""}`;
  };

  const rec = RECOMMENDED_SLEEP[ageGroup];

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">睡眠負債計算</h1>
      <p className="text-gray-600 mb-6">実際の睡眠時間と推奨時間の差から睡眠負債を計算します。</p>
      <AdBanner />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">年齢グループ</label>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(RECOMMENDED_SLEEP).map(([k, v]) => (
              <button key={k} onClick={() => setAgeGroup(k)}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${ageGroup === k ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"}`}>
                {v.label}（推奨{v.min}〜{v.max}h）
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">入力方式</label>
          <div className="flex gap-2">
            <button onClick={() => setMode("daily")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "daily" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>1日の平均</button>
            <button onClick={() => setMode("weekly")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${mode === "weekly" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>平日・休日別</button>
          </div>
        </div>
        {mode === "daily" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">実際の平均睡眠時間（時間）</label>
            <input type="number" step="0.5" value={actualSleep} onChange={(e) => setActualSleep(e.target.value)} placeholder="例: 6" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">平日の睡眠時間</label>
              <input type="number" step="0.5" value={weekdaySleep} onChange={(e) => setWeekdaySleep(e.target.value)} placeholder="例: 5.5" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">休日の睡眠時間</label>
              <input type="number" step="0.5" value={weekendSleep} onChange={(e) => setWeekendSleep(e.target.value)} placeholder="例: 9" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        )}
      </div>
      {result && (
        <div className="mt-6 space-y-4">
          <div className={`rounded-xl p-6 border text-center ${result.deficit <= 0 ? "bg-green-50 border-green-200" : result.deficit <= 1 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"}`}>
            <p className="text-sm font-medium mb-2">{result.deficit <= 0 ? "✅ 十分な睡眠が取れています！" : "⚠️ 睡眠が不足しています"}</p>
            <p className="text-4xl font-bold">{result.deficit > 0 ? `-${formatH(result.deficit)}` : "0"}</p>
            <p className="text-sm mt-1">1日の睡眠負債（推奨{formatH(result.optimal)}に対して）</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500">1週間の負債</p>
              <p className="text-xl font-bold text-red-500">{formatH(result.weeklyDebt)}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500">1ヶ月の負債</p>
              <p className="text-xl font-bold text-red-600">{formatH(result.monthlyDebt)}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
              <p className="text-xs text-gray-500">回復日数目安</p>
              <p className="text-xl font-bold text-blue-600">{result.recoveryDays}日</p>
            </div>
          </div>
        </div>
      )}
      <AdBanner />
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">年齢別 推奨睡眠時間（米国睡眠財団）</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">年齢</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">推奨睡眠時間</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(RECOMMENDED_SLEEP).map(([k, v]) => (
                <tr key={k} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-800">{v.label}</td>
                  <td className="px-4 py-2 text-right font-medium text-blue-600">{v.min}〜{v.max}時間</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">睡眠負債を解消する方法は？</h3><p className="text-sm text-gray-600 mt-1">毎日15〜30分早く寝ることを習慣化するのが効果的です。週末に一気に寝溜めするより、毎日少しずつ補う方が体への負担が少ないです。</p></div>
          <div><h3 className="font-medium text-gray-900">睡眠不足が続くとどうなりますか？</h3><p className="text-sm text-gray-600 mt-1">集中力・判断力・記憶力の低下、免疫機能の低下、肥満・糖尿病・高血圧のリスク増加、うつ病のリスク増加などが報告されています。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="sleep-debt-calc" />
    </main>
  );
}
