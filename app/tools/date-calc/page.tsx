"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

// Japan national holidays (2024-2026)
const JP_HOLIDAYS: Record<string, string> = {
  // 2024
  "2024-01-01": "元日",
  "2024-01-08": "成人の日",
  "2024-02-11": "建国記念の日",
  "2024-02-12": "建国記念の日 振替休日",
  "2024-02-23": "天皇誕生日",
  "2024-03-20": "春分の日",
  "2024-04-29": "昭和の日",
  "2024-05-03": "憲法記念日",
  "2024-05-04": "みどりの日",
  "2024-05-05": "こどもの日",
  "2024-05-06": "こどもの日 振替休日",
  "2024-07-15": "海の日",
  "2024-08-11": "山の日",
  "2024-08-12": "山の日 振替休日",
  "2024-09-16": "敬老の日",
  "2024-09-22": "秋分の日",
  "2024-09-23": "秋分の日 振替休日",
  "2024-10-14": "スポーツの日",
  "2024-11-03": "文化の日",
  "2024-11-04": "文化の日 振替休日",
  "2024-11-23": "勤労感謝の日",
  "2024-12-23": "天皇誕生日（旧）",
  // 2025
  "2025-01-01": "元日",
  "2025-01-13": "成人の日",
  "2025-02-11": "建国記念の日",
  "2025-02-23": "天皇誕生日",
  "2025-02-24": "天皇誕生日 振替休日",
  "2025-03-20": "春分の日",
  "2025-04-29": "昭和の日",
  "2025-05-03": "憲法記念日",
  "2025-05-04": "みどりの日",
  "2025-05-05": "こどもの日",
  "2025-05-06": "こどもの日 振替休日",
  "2025-07-21": "海の日",
  "2025-08-11": "山の日",
  "2025-09-15": "敬老の日",
  "2025-09-23": "秋分の日",
  "2025-10-13": "スポーツの日",
  "2025-11-03": "文化の日",
  "2025-11-23": "勤労感謝の日",
  "2025-11-24": "勤労感謝の日 振替休日",
  // 2026
  "2026-01-01": "元日",
  "2026-01-12": "成人の日",
  "2026-02-11": "建国記念の日",
  "2026-02-23": "天皇誕生日",
  "2026-03-20": "春分の日",
  "2026-04-29": "昭和の日",
  "2026-05-03": "憲法記念日",
  "2026-05-04": "みどりの日",
  "2026-05-05": "こどもの日",
  "2026-05-06": "こどもの日 振替休日",
  "2026-07-20": "海の日",
  "2026-08-11": "山の日",
  "2026-09-21": "敬老の日",
  "2026-09-23": "秋分の日",
  "2026-10-12": "スポーツの日",
  "2026-11-03": "文化の日",
  "2026-11-23": "勤労感謝の日",
};

const YOUBI = ["日", "月", "火", "水", "木", "金", "土"];

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function diffDates(start: Date, end: Date) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.round((end.getTime() - start.getTime()) / msPerDay);

  const weeks = Math.floor(Math.abs(totalDays) / 7);
  const remDays = Math.abs(totalDays) % 7;

  // months
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());
  let remDaysMonth = end.getDate() - start.getDate();
  if (remDaysMonth < 0) {
    months--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    remDaysMonth += prevMonth.getDate();
  }

  // years
  let years = end.getFullYear() - start.getFullYear();
  let remMonths = end.getMonth() - start.getMonth();
  let remDaysYear = end.getDate() - start.getDate();
  if (remDaysYear < 0) {
    remMonths--;
    const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
    remDaysYear += prevMonth.getDate();
  }
  if (remMonths < 0) {
    years--;
    remMonths += 12;
  }

  return {
    totalDays,
    weeks,
    remDays,
    months,
    remDaysMonth,
    years,
    remMonths,
    remDaysYear,
  };
}

function calcBusinessDays(start: Date, end: Date): { count: number; holidays: { date: string; name: string }[] } {
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.round((end.getTime() - start.getTime()) / msPerDay);
  if (totalDays <= 0) return { count: 0, holidays: [] };

  let count = 0;
  const holidays: { date: string; name: string }[] = [];
  for (let i = 0; i <= totalDays; i++) {
    const d = addDays(start, i);
    const dow = d.getDay();
    const ds = toDateStr(d);
    if (dow === 0 || dow === 6) continue;
    if (JP_HOLIDAYS[ds]) {
      holidays.push({ date: ds, name: JP_HOLIDAYS[ds] });
      continue;
    }
    count++;
  }
  return { count, holidays };
}

function youbiColor(dow: number): string {
  if (dow === 6) return "text-blue-600 font-bold";
  if (dow === 0) return "text-red-600 font-bold";
  return "text-gray-800";
}

function formatDateJP(d: Date): string {
  const dow = d.getDay();
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${YOUBI[dow]}）`;
}

type Tab = "period" | "add" | "countdown";

export default function DateCalc() {
  const today = toDateStr(new Date());

  const [tab, setTab] = useState<Tab>("period");

  // Period mode
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState("");

  // Add/sub mode
  const [baseDate, setBaseDate] = useState(today);
  const [offsetDays, setOffsetDays] = useState<number>(30);
  const [direction, setDirection] = useState<1 | -1>(1);

  // Countdown mode
  const [targetDate, setTargetDate] = useState("");
  const [eventName, setEventName] = useState("");

  // Period result
  const periodResult = useMemo(() => {
    const s = parseDate(startDate);
    const e = parseDate(endDate);
    if (!s || !e) return null;
    const diff = diffDates(s, e);
    const biz = calcBusinessDays(s, e);
    return { diff, biz };
  }, [startDate, endDate]);

  // Add result
  const addResult = useMemo(() => {
    const b = parseDate(baseDate);
    if (!b) return null;
    const result = addDays(b, offsetDays * direction);
    return result;
  }, [baseDate, offsetDays, direction]);

  // Countdown result
  const countdownResult = useMemo(() => {
    const t = parseDate(targetDate);
    if (!t) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = diffDates(now, t);
    const totalDays = diff.totalDays;

    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31);
    const totalYearDays = Math.round(
      (yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const dayOfYear = Math.round(
      (now.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    const yearProgress = Math.round((dayOfYear / totalYearDays) * 100);

    return { totalDays, diff, yearProgress };
  }, [targetDate]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "period", label: "期間計算" },
    { id: "add", label: "〇日後を計算" },
    { id: "countdown", label: "カウントダウン" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-6 mb-6 flex items-center gap-4">
        <span className="text-4xl">📅</span>
        <div>
          <h1 className="text-2xl font-bold">日付計算ツール</h1>
          <p className="text-indigo-100 text-sm mt-1">
            日数・営業日・期間計算・カウントダウン
          </p>
        </div>
      </div>

      <AdBanner />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 mt-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Period mode */}
      {tab === "period" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                開始日
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={() => setStartDate(today)}
                  className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-200 hover:bg-indigo-100"
                >
                  今日
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                終了日
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  onClick={() => setEndDate(today)}
                  className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-200 hover:bg-indigo-100"
                >
                  今日
                </button>
              </div>
            </div>
          </div>

          {periodResult && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {Math.abs(periodResult.diff.totalDays).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">日間</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-gray-800">
                    {periodResult.diff.weeks}週{periodResult.diff.remDays}日
                  </div>
                  <div className="text-xs text-gray-500 mt-1">週数</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-gray-800">
                    {Math.abs(periodResult.diff.months)}ヶ月{periodResult.diff.remDaysMonth}日
                  </div>
                  <div className="text-xs text-gray-500 mt-1">月数</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-lg font-bold text-gray-800">
                    {periodResult.diff.years}年{periodResult.diff.remMonths}ヶ月{periodResult.diff.remDaysYear}日
                  </div>
                  <div className="text-xs text-gray-500 mt-1">年数</div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">営業日数（土日祝除く）</span>
                  <span className="text-xl font-bold text-green-600">
                    {periodResult.biz.count.toLocaleString()}日
                  </span>
                </div>
                {periodResult.biz.holidays.length > 0 && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
                      含まれる祝日 {periodResult.biz.holidays.length}件
                    </summary>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {periodResult.biz.holidays.map((h) => {
                        const d = parseDate(h.date);
                        const dow = d ? d.getDay() : 0;
                        return (
                          <div key={h.date} className="text-xs text-gray-600 flex gap-2">
                            <span className={youbiColor(dow)}>
                              {h.date} ({YOUBI[dow]})
                            </span>
                            <span>{h.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </details>
                )}
              </div>

              {periodResult.diff.totalDays < 0 && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  ※ 終了日が開始日より前です。絶対値で表示しています。
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Add/Sub mode */}
      {tab === "add" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              基準日
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="flex-1 sm:w-48 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={() => setBaseDate(today)}
                className="text-xs px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md border border-indigo-200 hover:bg-indigo-100"
              >
                今日
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              日数と方向
            </label>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setDirection(1)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  direction === 1
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                }`}
              >
                〇日後
              </button>
              <button
                onClick={() => setDirection(-1)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  direction === -1
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                }`}
              >
                〇日前
              </button>
              <input
                type="number"
                min={0}
                value={offsetDays}
                onChange={(e) => setOffsetDays(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-24 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <span className="text-sm text-gray-600">日</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {[7, 14, 30, 60, 90, 180, 365].map((n) => (
              <button
                key={n}
                onClick={() => { setOffsetDays(n); setDirection(1); }}
                className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 rounded-full border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                +{n}日
              </button>
            ))}
          </div>

          {addResult && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 text-center">
              <div className="text-xs text-gray-500 mb-1">計算結果</div>
              <div className="text-2xl font-bold text-indigo-700">
                {formatDateJP(addResult)}
              </div>
              <div className="text-sm text-gray-500 mt-2">
                {baseDate} から {direction === 1 ? `${offsetDays}日後` : `${offsetDays}日前`}
              </div>
              {JP_HOLIDAYS[toDateStr(addResult)] && (
                <div className="mt-2 text-sm text-red-600 font-medium">
                  🎌 {JP_HOLIDAYS[toDateStr(addResult)]}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Countdown mode */}
      {tab === "countdown" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              目標日
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              イベント名（任意）
            </label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="例：試験、誕生日、旅行..."
              className="w-full sm:w-64 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {countdownResult && (
            <div className="space-y-4">
              {eventName && (
                <p className="text-sm text-gray-600 font-medium">
                  🎯 {eventName} まで
                </p>
              )}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 text-center">
                {countdownResult.totalDays > 0 ? (
                  <>
                    <div className="text-6xl font-bold text-indigo-600 mb-1">
                      {countdownResult.totalDays.toLocaleString()}
                    </div>
                    <div className="text-lg text-indigo-500">日</div>
                  </>
                ) : countdownResult.totalDays === 0 ? (
                  <div className="text-3xl font-bold text-green-600">今日です！🎉</div>
                ) : (
                  <div className="text-3xl font-bold text-gray-500">
                    {Math.abs(countdownResult.totalDays)}日前に過ぎました
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-800">
                    {countdownResult.diff.weeks}週{countdownResult.diff.remDays}日
                  </div>
                  <div className="text-xs text-gray-500">週・日</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-gray-800">
                    {Math.abs(countdownResult.diff.months)}ヶ月{countdownResult.diff.remDaysMonth}日
                  </div>
                  <div className="text-xs text-gray-500">月・日</div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>今年の進行状況</span>
                  <span>{countdownResult.yearProgress}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full transition-all"
                    style={{ width: `${countdownResult.yearProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>1月1日</span>
                  <span>12月31日</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">日付計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          「期間計算」では2つの日付の差を日数・週数・月数・年数で表示し、土日祝を除いた営業日数も算出します。
          「〇日後を計算」では基準日から指定した日数後（前）の日付を調べられます。契約期間・納期・締め切り日の確認に便利です。
          「カウントダウン」では試験や旅行など目標日までの残り日数を大きく表示します。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "2つの日付の間の日数を計算するには？",
            answer:
              "終了日から開始日を引くと日数が求められます。例えば4月1日から9月30日は183日間です。本ツールでは日数・週数・月数・年数を一括計算できます。",
          },
          {
            question: "営業日数の計算方法は？",
            answer:
              "土日と祝日を除いた日数が営業日数です。本ツールでは日本の祝日を考慮した営業日数を計算できます。",
          },
          {
            question: "〇日後の日付を調べるには？",
            answer:
              "基準日に日数を足すと将来の日付がわかります。例えば今日から100日後の日付や、契約期間の満了日などを計算できます。",
          },
          {
            question: "うるう年の判定方法は？",
            answer:
              "4で割り切れる年がうるう年ですが、100で割り切れる年は平年、400で割り切れる年はうるう年です。2024年はうるう年です。",
          },
        ]}
      />

      <RelatedTools currentToolId="date-calc" />

      <p className="text-xs text-gray-400 text-center mt-8">
        ※ 本ツールの計算結果は参考値です。重要な日付の確認は公式情報をご利用ください。
      </p>
    </div>
  );
}
