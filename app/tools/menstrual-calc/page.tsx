"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" });
}

function formatShort(date: Date): string {
  return date.toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });
}

export default function MenstrualCalcPage() {
  const [lastPeriod, setLastPeriod] = useState("");
  const [cycleLength, setCycleLength] = useState("28");
  const [periodLength, setPeriodLength] = useState("5");

  const result = useMemo(() => {
    if (!lastPeriod) return null;
    const last = new Date(lastPeriod);
    const cycle = parseInt(cycleLength) || 28;
    const pLen = parseInt(periodLength) || 5;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 排卵日は次の生理の14日前
    const ovulationOffset = cycle - 14;

    const cycles: { startDate: Date; endDate: Date; ovulationDate: Date; fertileStart: Date; fertileEnd: Date; pmsStart: Date }[] = [];
    for (let i = 0; i < 4; i++) {
      const startDate = addDays(last, cycle * i);
      const endDate = addDays(startDate, pLen - 1);
      const ovulationDate = addDays(startDate, ovulationOffset);
      const fertileStart = addDays(ovulationDate, -3);
      const fertileEnd = addDays(ovulationDate, 1);
      const pmsStart = addDays(startDate, cycle - 7);
      cycles.push({ startDate, endDate, ovulationDate, fertileStart, fertileEnd, pmsStart });
    }

    // Current or next cycle
    const currentCycle = cycles.find((c, i) => {
      const nextStart = i + 1 < cycles.length ? cycles[i + 1].startDate : addDays(c.startDate, cycle);
      return today >= c.startDate && today < nextStart;
    }) || cycles[0];

    const daysUntilNext = Math.ceil((cycles[1].startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const isInPeriod = today >= currentCycle.startDate && today <= currentCycle.endDate;
    const isInFertile = today >= currentCycle.fertileStart && today <= currentCycle.fertileEnd;
    const isOvulation = today.toDateString() === currentCycle.ovulationDate.toDateString();

    return { cycles: cycles.slice(1), currentCycle, daysUntilNext, isInPeriod, isInFertile, isOvulation };
  }, [lastPeriod, cycleLength, periodLength]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">生理周期・排卵日計算</h1>
      <p className="text-gray-600 mb-6">最終生理日と周期から次の生理日・排卵日・妊娠しやすい時期を計算します。</p>

      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">最終生理開始日</label>
          <input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">生理周期（日）</label>
            <div className="flex gap-1 flex-wrap mb-2">
              {[25, 26, 27, 28, 29, 30, 35].map((d) => (
                <button key={d} onClick={() => setCycleLength(String(d))}
                  className={`px-2 py-1 rounded text-xs border ${cycleLength === String(d) ? "bg-pink-500 text-white border-pink-500" : "bg-white text-gray-700 border-gray-300"}`}>
                  {d}日
                </button>
              ))}
            </div>
            <input type="number" value={cycleLength} onChange={(e) => setCycleLength(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">生理日数（日）</label>
            <div className="flex gap-1 flex-wrap mb-2">
              {[3, 4, 5, 6, 7].map((d) => (
                <button key={d} onClick={() => setPeriodLength(String(d))}
                  className={`px-2 py-1 rounded text-xs border ${periodLength === String(d) ? "bg-pink-500 text-white border-pink-500" : "bg-white text-gray-700 border-gray-300"}`}>
                  {d}日
                </button>
              ))}
            </div>
            <input type="number" value={periodLength} onChange={(e) => setPeriodLength(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-pink-50 rounded-xl p-5 border border-pink-200">
            <h2 className="text-lg font-bold text-pink-900 mb-3">次の生理予定日</h2>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-pink-600">{formatDate(result.cycles[0].startDate)}</p>
              <p className="text-sm text-pink-500 mt-1">あと{result.daysUntilNext}日</p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
            <h2 className="text-base font-bold text-purple-900 mb-3">今周期の予測</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3">
                <span className="text-gray-700">🩸 排卵日（推定）</span>
                <span className="font-bold text-purple-600">{formatDate(result.currentCycle.ovulationDate)}</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3">
                <span className="text-gray-700">💕 妊娠しやすい期間</span>
                <span className="font-bold text-red-500">{formatShort(result.currentCycle.fertileStart)} 〜 {formatShort(result.currentCycle.fertileEnd)}</span>
              </div>
              <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3">
                <span className="text-gray-700">😔 PMS注意期間</span>
                <span className="font-medium text-orange-500">{formatShort(result.currentCycle.pmsStart)}頃〜</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h2 className="text-base font-bold text-gray-800 mb-3">今後3ヶ月の予測</h2>
            <div className="space-y-2">
              {result.cycles.map((c, i) => (
                <div key={i} className="bg-white rounded-lg px-4 py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{i + 1}回目: {formatDate(c.startDate)}</p>
                    <p className="text-xs text-purple-600">排卵日: {formatShort(c.ovulationDate)}</p>
                  </div>
                  <div className="text-xs text-pink-500 text-right">
                    <p>🩸 {formatShort(c.startDate)}〜{formatShort(c.endDate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <AdBanner />

      <div className="mt-8 bg-yellow-50 rounded-xl p-5 border border-yellow-200">
        <p className="text-sm text-yellow-800">⚠️ このツールは目安です。実際の排卵日・生理日は個人差があります。妊活・避妊の目的には産婦人科の受診をお勧めします。</p>
      </div>

      <div className="mt-6 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">排卵日の計算方法は？</h3>
            <p className="text-sm text-gray-600 mt-1">排卵日は次の生理予定日の14日前が目安です。28日周期なら生理開始から14日目です。個人差があるため、排卵検査薬や基礎体温との併用がより確実です。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">生理不順の場合はどうする？</h3>
            <p className="text-sm text-gray-600 mt-1">周期が25〜38日の範囲で多少ばらつく場合は正常です。それ以上のばらつきや3ヶ月以上の停止がある場合は婦人科に相談しましょう。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">妊活に排卵日計算は有効ですか？</h3>
            <p className="text-sm text-gray-600 mt-1">目安としては有効ですが、精度には限界があります。排卵検査薬（LHサージ検査）との組み合わせや、婦人科での超音波検査が最も確実です。</p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="menstrual-calc" />
    </main>
  );
}
