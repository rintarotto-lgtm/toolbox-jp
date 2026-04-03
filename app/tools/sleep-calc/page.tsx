"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Mode = "from-wake" | "from-sleep";

interface SleepOption {
  cycles: number;
  hours: number;
  minutes: number;
  label: string;
  stars: number;
}

const AGE_SLEEP_RECOMMENDATIONS = [
  { age: "新生児（0〜3ヶ月）", hours: "14〜17時間" },
  { age: "乳児（4〜11ヶ月）", hours: "12〜15時間" },
  { age: "幼児（1〜2歳）", hours: "11〜14時間" },
  { age: "未就学児（3〜5歳）", hours: "10〜13時間" },
  { age: "学童（6〜13歳）", hours: "9〜11時間" },
  { age: "ティーン（14〜17歳）", hours: "8〜10時間" },
  { age: "若年成人（18〜25歳）", hours: "7〜9時間" },
  { age: "成人（26〜64歳）", hours: "7〜9時間" },
  { age: "高齢者（65歳以上）", hours: "7〜8時間" },
];

function formatTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function getSleepOptions(baseMinutes: number, fallAsleepMin: number, reverse: boolean): SleepOption[] {
  // Cycles to show: 3, 4, 5, 6 (4.5h, 6h, 7.5h, 9h)
  const cycleCounts = [3, 4, 5, 6];
  return cycleCounts.map((cycles) => {
    const totalSleepMin = cycles * 90;
    const totalNeededMin = totalSleepMin + fallAsleepMin;
    let targetMinutes: number;
    if (reverse) {
      // from sleep time → calculate wake time
      targetMinutes = baseMinutes + totalNeededMin;
    } else {
      // from wake time → calculate bedtime
      targetMinutes = baseMinutes - totalNeededMin;
    }
    const h = Math.floor(totalSleepMin / 60);
    const m = totalSleepMin % 60;
    let stars = 1;
    if (cycles === 5) stars = 3;
    else if (cycles === 4) stars = 2;
    else if (cycles === 6) stars = 2;
    return {
      cycles,
      hours: h,
      minutes: m,
      label: formatTime(targetMinutes),
      stars,
    };
  });
}

function getCurrentTimeString(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

export default function SleepCalc() {
  const [mode, setMode] = useState<Mode>("from-wake");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepTime, setSleepTime] = useState("23:00");
  const [fallAsleepMin, setFallAsleepMin] = useState("15");

  // Debt calculator
  const [idealHours, setIdealHours] = useState("7.5");
  const [actualHours, setActualHours] = useState("6");
  const [debtDays, setDebtDays] = useState("7");

  const sleepOptions = useMemo((): SleepOption[] => {
    const fa = parseInt(fallAsleepMin) || 15;
    if (mode === "from-wake") {
      const base = parseTimeToMinutes(wakeTime);
      return getSleepOptions(base, fa, false);
    } else {
      const base = parseTimeToMinutes(sleepTime);
      return getSleepOptions(base, fa, true);
    }
  }, [mode, wakeTime, sleepTime, fallAsleepMin]);

  const debtResult = useMemo(() => {
    const ideal = parseFloat(idealHours);
    const actual = parseFloat(actualHours);
    const days = parseInt(debtDays);
    if (!ideal || !actual || !days || days <= 0) return null;
    const debtPerDay = ideal - actual;
    const totalDebt = debtPerDay * days;
    return { debtPerDay, totalDebt };
  }, [idealHours, actualHours, debtDays]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 p-6 mb-6 text-white">
        <div className="text-4xl mb-2">😴</div>
        <h1 className="text-2xl font-bold mb-1">睡眠時間計算</h1>
        <p className="text-indigo-200 text-sm">
          睡眠サイクル（90分）に基づいてすっきり目覚める時刻を計算
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 mt-6">
        {/* Mode tabs */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          {(
            [
              { value: "from-wake", label: "起床時間 → 就寝時刻を計算" },
              { value: "from-sleep", label: "就寝時刻 → 起床時間を計算" },
            ] as { value: Mode; label: string }[]
          ).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setMode(tab.value)}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${
                mode === tab.value
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Time input */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mode === "from-wake" ? (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                目標起床時間
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
                <button
                  onClick={() => setWakeTime(getCurrentTimeString())}
                  className="px-3 py-2 text-xs bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-gray-600 whitespace-nowrap"
                >
                  現在時刻
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                就寝時刻
              </label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={sleepTime}
                  onChange={(e) => setSleepTime(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
                <button
                  onClick={() => setSleepTime(getCurrentTimeString())}
                  className="px-3 py-2 text-xs bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 text-gray-600 whitespace-nowrap"
                >
                  今すぐ
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              入眠までの時間（分）
            </label>
            <input
              type="number"
              value={fallAsleepMin}
              onChange={(e) => setFallAsleepMin(e.target.value)}
              min="0"
              max="120"
              placeholder="15"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="font-bold text-gray-800 mb-3">
            {mode === "from-wake" ? "推奨就寝時刻" : "おすすめ起床時間"}
          </h2>
          <div className="space-y-3">
            {sleepOptions.map((opt) => (
              <div
                key={opt.cycles}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  opt.stars === 3
                    ? "bg-indigo-50 border-indigo-300"
                    : opt.stars === 2
                    ? "bg-purple-50 border-purple-200"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div>
                  <div className="text-2xl font-bold text-gray-900">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {opt.cycles}サイクル（{opt.hours}時間{opt.minutes > 0 ? `${opt.minutes}分` : ""}の睡眠）
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-yellow-400 text-lg">
                    {"★".repeat(opt.stars)}
                    <span className="text-gray-300">{"★".repeat(3 - opt.stars)}</span>
                  </div>
                  {opt.stars === 3 && (
                    <div className="text-xs text-indigo-600 font-medium mt-0.5">おすすめ</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            ※ 入眠までの時間（{fallAsleepMin || 15}分）を含んでいます。
          </p>
        </div>
      </div>

      {/* Age sleep recommendations */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">
        <h2 className="font-bold text-gray-800 mb-4">年齢別推奨睡眠時間</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left pb-2 text-gray-500 font-medium">年齢層</th>
                <th className="text-right pb-2 text-gray-500 font-medium">推奨睡眠時間</th>
              </tr>
            </thead>
            <tbody>
              {AGE_SLEEP_RECOMMENDATIONS.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="py-2.5 px-1 text-gray-700">{row.age}</td>
                  <td className="py-2.5 px-1 text-right font-semibold text-indigo-600">
                    {row.hours}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">出典：米国睡眠財団（National Sleep Foundation）推奨値</p>
      </div>

      {/* Debt calculator */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">
        <h2 className="font-bold text-gray-800 mb-4">睡眠負債チェック</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              理想の睡眠時間（時間）
            </label>
            <input
              type="number"
              value={idealHours}
              onChange={(e) => setIdealHours(e.target.value)}
              min="0"
              max="24"
              step="0.5"
              placeholder="7.5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              実際の睡眠時間（時間）
            </label>
            <input
              type="number"
              value={actualHours}
              onChange={(e) => setActualHours(e.target.value)}
              min="0"
              max="24"
              step="0.5"
              placeholder="6"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              日数
            </label>
            <input
              type="number"
              value={debtDays}
              onChange={(e) => setDebtDays(e.target.value)}
              min="1"
              placeholder="7"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
        </div>

        {debtResult && (
          <div
            className={`mt-4 p-4 rounded-xl border ${
              debtResult.totalDebt <= 0
                ? "bg-green-50 border-green-200"
                : debtResult.totalDebt < 7
                ? "bg-yellow-50 border-yellow-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            {debtResult.totalDebt <= 0 ? (
              <p className="text-green-700 font-semibold">
                睡眠は足りています！（余裕：{Math.abs(debtResult.totalDebt).toFixed(1)}時間）
              </p>
            ) : (
              <>
                <p className="font-semibold text-red-700">
                  睡眠負債：<span className="text-2xl">{debtResult.totalDebt.toFixed(1)}</span>時間
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  1日あたり{debtResult.debtPerDay.toFixed(1)}時間の不足 ×{" "}
                  {debtDays}日間
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <AdBanner />

      <section className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">睡眠計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          睡眠は約90分の「サイクル」を繰り返します。サイクルの終わり（レム睡眠の終了時）に起きると
          すっきり目覚められます。目標起床時間を入力すると、そこから逆算した就寝時刻を提案。
          就寝時刻から起床時間を調べることも可能です。睡眠負債計算で慢性的な不足もチェックできます。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "理想の睡眠時間はどのくらいですか？",
            answer:
              "成人（18〜64歳）の理想的な睡眠時間は7〜9時間とされています（米国睡眠財団推奨）。個人差があり、6時間で十分な人もいれば10時間必要な人もいます。",
          },
          {
            question: "睡眠サイクル（90分）とは何ですか？",
            answer:
              "睡眠は約90分を1サイクルとして、ノンレム睡眠とレム睡眠を繰り返します。サイクルの終わりに起きるとすっきり目覚められるとされています。",
          },
          {
            question: "睡眠負債とは何ですか？",
            answer:
              "必要な睡眠時間と実際の睡眠時間の差が積み重なったものです。毎日1時間の不足が7日続くと7時間の睡眠負債が生じ、認知機能や免疫力に悪影響を及ぼします。",
          },
          {
            question: "昼寝の最適な時間はどのくらいですか？",
            answer:
              "15〜20分（パワーナップ）が最も効果的です。20分以内なら深い睡眠に入らないためすっきり起きられます。午後3時以降の昼寝は夜の睡眠に影響することがあります。",
          },
        ]}
      />

      <RelatedTools currentToolId="sleep-calc" />

      <p className="text-xs text-gray-400 mt-6 text-center">
        ※ 本ツールの計算結果は睡眠サイクルの一般的な理論に基づく目安です。個人差があります。睡眠障害等の医療的問題は医師にご相談ください。
      </p>
    </div>
  );
}
