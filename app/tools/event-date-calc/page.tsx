"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const PRESET_EVENTS = [
  { name: "お正月", month: 1, day: 1, icon: "🎍" },
  { name: "バレンタインデー", month: 2, day: 14, icon: "💝" },
  { name: "ホワイトデー", month: 3, day: 14, icon: "🍬" },
  { name: "ゴールデンウィーク", month: 5, day: 3, icon: "🌟" },
  { name: "お盆", month: 8, day: 13, icon: "🏮" },
  { name: "ハロウィン", month: 10, day: 31, icon: "🎃" },
  { name: "クリスマスイブ", month: 12, day: 24, icon: "🎄" },
  { name: "クリスマス", month: 12, day: 25, icon: "🎅" },
  { name: "大晦日", month: 12, day: 31, icon: "🎆" },
];

function getNextDate(month: number, day: number): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const thisYear = new Date(today.getFullYear(), month - 1, day);
  if (thisYear <= today) {
    return new Date(today.getFullYear() + 1, month - 1, day);
  }
  return thisYear;
}

function daysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function EventDateCalcPage() {
  const [customEvents, setCustomEvents] = useState<{ id: number; name: string; date: string; recurring: boolean }[]>([]);
  const [newName, setNewName] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newRecurring, setNewRecurring] = useState(false);

  const presetResults = useMemo(() => {
    return PRESET_EVENTS.map((e) => {
      const nextDate = getNextDate(e.month, e.day);
      const days = daysUntil(nextDate);
      return {
        ...e,
        nextDate: nextDate.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }),
        days,
        isToday: days === 0,
      };
    }).sort((a, b) => a.days - b.days);
  }, []);

  const customResults = useMemo(() => {
    return customEvents.map((e) => {
      let targetDate = new Date(e.date);
      if (e.recurring) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thisYear = new Date(today.getFullYear(), targetDate.getMonth(), targetDate.getDate());
        if (thisYear <= today) {
          targetDate = new Date(today.getFullYear() + 1, targetDate.getMonth(), targetDate.getDate());
        } else {
          targetDate = thisYear;
        }
      }
      const days = daysUntil(targetDate);
      return {
        ...e,
        days,
        formattedDate: targetDate.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" }),
        isPast: days < 0,
      };
    }).sort((a, b) => a.days - b.days);
  }, [customEvents]);

  const addEvent = () => {
    if (!newName || !newDate) return;
    setCustomEvents((prev) => [...prev, { id: Date.now(), name: newName, date: newDate, recurring: newRecurring }]);
    setNewName("");
    setNewDate("");
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">行事・記念日カウントダウン</h1>
      <p className="text-gray-600 mb-6">次のイベントまで何日かを計算。毎年繰り返す行事も自動更新。</p>
      <AdBanner />

      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">主な年間行事</h2>
        <div className="grid grid-cols-1 gap-2">
          {presetResults.map((e) => (
            <div key={e.name} className={`bg-white rounded-lg border px-4 py-3 flex justify-between items-center ${e.isToday ? "border-yellow-400 bg-yellow-50" : "border-gray-200"}`}>
              <div>
                <p className="font-medium text-gray-800">{e.icon} {e.name}</p>
                <p className="text-xs text-gray-500">{e.nextDate}</p>
              </div>
              <div className="text-right">
                {e.isToday ? (
                  <p className="text-2xl font-bold text-yellow-600">今日！</p>
                ) : (
                  <>
                    <p className="text-2xl font-bold text-blue-600">{e.days}</p>
                    <p className="text-xs text-gray-500">日後</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">記念日・イベントを追加</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">イベント名</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="例: 結婚記念日" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">日付</label>
            <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={newRecurring} onChange={(e) => setNewRecurring(e.target.checked)} />
            毎年繰り返す（誕生日・記念日など）
          </label>
          <button onClick={addEvent} className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            追加する
          </button>
        </div>
      </div>

      {customResults.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">マイイベント</h2>
          <div className="grid grid-cols-1 gap-2">
            {customResults.map((e) => (
              <div key={e.id} className={`bg-white rounded-lg border px-4 py-3 flex justify-between items-center ${e.days === 0 ? "border-yellow-400 bg-yellow-50" : e.isPast ? "border-gray-200 bg-gray-50" : "border-blue-200"}`}>
                <div>
                  <p className="font-medium text-gray-800">{e.name}{e.recurring && " (毎年)"}</p>
                  <p className="text-xs text-gray-500">{e.formattedDate}</p>
                </div>
                <div className="text-right">
                  {e.days === 0 ? <p className="text-2xl font-bold text-yellow-600">今日！</p> : e.isPast ? <p className="text-sm text-gray-400">終了</p> : (
                    <>
                      <p className="text-2xl font-bold text-blue-600">{e.days}</p>
                      <p className="text-xs text-gray-500">日後</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AdBanner />
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">毎年の記念日を自動更新できますか？</h3><p className="text-sm text-gray-600 mt-1">「毎年繰り返す」にチェックを入れると、今年の日付が過ぎると自動的に来年の日付でカウントダウンを更新します。</p></div>
          <div><h3 className="font-medium text-gray-900">追加したイベントは保存されますか？</h3><p className="text-sm text-gray-600 mt-1">現在のバージョンではページを閉じるとリセットされます。ブラウザのお気に入りに追加して、必要なときに入力し直してください。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="event-date-calc" />
    </main>
  );
}
