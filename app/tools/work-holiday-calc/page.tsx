"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const PAID_LEAVE_TABLE = [
  { years: 0.5, days: 10 },
  { years: 1.5, days: 11 },
  { years: 2.5, days: 12 },
  { years: 3.5, days: 14 },
  { years: 4.5, days: 16 },
  { years: 5.5, days: 18 },
  { years: 6.5, days: 20 },
];

export default function WorkHolidayCalcPage() {
  const [hireDate, setHireDate] = useState("");
  const [usedDays, setUsedDays] = useState("0");
  const [dailySalary, setDailySalary] = useState("");
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState("5");

  const result = useMemo(() => {
    if (!hireDate) return null;
    const hire = new Date(hireDate);
    const today = new Date();
    const diffMs = today.getTime() - hire.getTime();
    const yearsWorked = diffMs / (1000 * 60 * 60 * 24 * 365.25);

    if (yearsWorked < 0.5) {
      const daysUntilFirst = Math.ceil(0.5 * 365.25 - (yearsWorked * 365.25));
      return { notEligible: true, daysUntilFirst };
    }

    // Find applicable row
    const row = PAID_LEAVE_TABLE.slice().reverse().find((r) => yearsWorked >= r.years);
    const grantedDays = row ? row.days : 10;

    // Part-time adjustment if less than 5 days/week
    const wdpw = parseFloat(workDaysPerWeek);
    let adjustedDays = grantedDays;
    if (wdpw < 5) {
      const ptTable: Record<number, number[]> = {
        4: [7, 8, 9, 10, 12, 13, 15],
        3: [5, 6, 6, 8, 9, 10, 11],
        2: [3, 4, 4, 5, 6, 6, 7],
        1: [1, 2, 2, 2, 3, 3, 3],
      };
      const ptIdx = PAID_LEAVE_TABLE.findIndex((r) => yearsWorked < r.years + 1);
      const idx = ptIdx === -1 ? 6 : Math.max(0, ptIdx - 1);
      adjustedDays = (ptTable[Math.floor(wdpw)] || [])[idx] ?? grantedDays;
    }

    const used = parseFloat(usedDays) || 0;
    const remaining = adjustedDays - used;
    const progressPct = Math.min(100, (used / adjustedDays) * 100);
    const needsMoreDays = used < 5 && adjustedDays >= 10;
    const moreNeeded = Math.max(0, 5 - used);

    const dailySal = parseFloat(dailySalary) * 10000;
    const remainingValue = dailySal ? remaining * dailySal : null;

    return {
      yearsWorked: yearsWorked.toFixed(1),
      grantedDays: adjustedDays,
      used,
      remaining: Math.max(0, remaining),
      progressPct: Math.round(progressPct),
      needsMoreDays,
      moreNeeded,
      remainingValue: remainingValue ? Math.round(remainingValue) : null,
      notEligible: false,
    };
  }, [hireDate, usedDays, dailySalary, workDaysPerWeek]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">有給休暇 付与日数・残日数計算</h1>
      <p className="text-gray-600 mb-6">入社日から有給付与日数と残日数を計算します。年5日取得義務の確認にも。</p>

      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">入社日</label>
          <input type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">今年度の取得済み日数</label>
            <input type="number" value={usedDays} onChange={(e) => setUsedDays(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">週の所定労働日数</label>
            <select value={workDaysPerWeek} onChange={(e) => setWorkDaysPerWeek(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="5">5日（フルタイム）</option>
              <option value="4">4日</option>
              <option value="3">3日</option>
              <option value="2">2日</option>
              <option value="1">1日</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">日給（万円、有給の金銭価値計算用・任意）</label>
          <input type="number" step="0.1" value={dailySalary} onChange={(e) => setDailySalary(e.target.value)} placeholder="例: 1.5" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {result && !result.notEligible && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">計算結果（勤続{result.yearsWorked}年）</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">付与日数</p>
              <p className="text-2xl font-bold text-blue-600">{result.grantedDays}<span className="text-sm">日</span></p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">取得済み</p>
              <p className="text-2xl font-bold text-gray-700">{result.used}<span className="text-sm">日</span></p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">残日数</p>
              <p className="text-2xl font-bold text-green-600">{result.remaining}<span className="text-sm">日</span></p>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">今年度の取得率</span>
              <span className="font-medium">{result.progressPct}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-blue-500 h-3 rounded-full" style={{ width: `${result.progressPct}%` }}></div>
            </div>
          </div>
          {result.needsMoreDays && (
            <div className="bg-orange-50 rounded-lg p-3 border border-orange-200 mb-3">
              <p className="text-sm text-orange-800">⚠️ 年5日取得義務: あと<strong>{result.moreNeeded}日</strong>の取得が必要です</p>
            </div>
          )}
          {result.remainingValue && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <p className="text-sm text-green-800">残有給の金銭価値: <strong>¥{formatNum(result.remainingValue)}</strong></p>
            </div>
          )}
        </div>
      )}

      {result && result.notEligible && (
        <div className="mt-6 bg-yellow-50 rounded-xl p-6 border border-yellow-200">
          <p className="text-yellow-800">まだ有給休暇の付与対象外です。</p>
          <p className="text-sm text-yellow-700 mt-1">初回付与まで約{result.daysUntilFirst}日</p>
        </div>
      )}

      <AdBanner />

      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">有給休暇 付与日数表（週5日勤務）</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">継続勤務期間</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">付与日数</th>
              </tr>
            </thead>
            <tbody>
              {PAID_LEAVE_TABLE.map((row) => (
                <tr key={row.years} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-800">{row.years}年</td>
                  <td className="px-4 py-2 text-right font-medium text-blue-600">{row.days}日</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">有給休暇はいつからもらえる？</h3>
            <p className="text-sm text-gray-600 mt-1">入社後6ヶ月が経過し、全労働日の8割以上出勤した場合に10日間が付与されます。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">有給休暇は使わないと消える？</h3>
            <p className="text-sm text-gray-600 mt-1">有給休暇の時効は2年間です。付与から2年以内に使わないと消滅します。最大繰越は前年度分（最大20日）のみです。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">有給休暇を拒否された場合はどうする？</h3>
            <p className="text-sm text-gray-600 mt-1">正当な理由のない有給取得の拒否は違法です。会社が代替日を指定する「時季変更権」は認められていますが、完全拒否はできません。労働基準監督署に相談できます。</p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="work-holiday-calc" />
    </main>
  );
}
