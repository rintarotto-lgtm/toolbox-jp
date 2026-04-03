"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface Preset {
  label: string;
  hours: number;
}

const PRESETS: Preset[] = [
  { label: "FP3級", hours: 75 },
  { label: "FP2級", hours: 200 },
  { label: "宅建", hours: 300 },
  { label: "簿記3級", hours: 75 },
  { label: "簿記2級", hours: 250 },
  { label: "英検2級", hours: 150 },
  { label: "TOEIC+100点", hours: 100 },
  { label: "基本情報技術者", hours: 150 },
  { label: "応用情報技術者", hours: 500 },
  { label: "社労士", hours: 800 },
  { label: "行政書士", hours: 600 },
  { label: "カスタム", hours: 0 },
];

const DAYS_JP = ["月", "火", "水", "木", "金", "土", "日"];

export default function StudyPlanner() {
  const [examName, setExamName] = useState("宅建");
  const [totalHours, setTotalHours] = useState(300);
  const [examDate, setExamDate] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return d.toISOString().split("T")[0];
  });
  const [weekdayHours, setWeekdayHours] = useState(1.5);
  const [holidayHours, setHolidayHours] = useState(4);
  const [selectedPreset, setSelectedPreset] = useState("宅建");

  const handlePreset = (preset: Preset) => {
    setSelectedPreset(preset.label);
    setExamName(preset.label === "カスタム" ? "" : preset.label);
    if (preset.hours > 0) setTotalHours(preset.hours);
  };

  const result = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(examDate);
    target.setHours(0, 0, 0, 0);

    const diffMs = target.getTime() - today.getTime();
    if (diffMs <= 0) return null;

    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    // Count weekdays and weekend days
    let weekdays = 0;
    let weekends = 0;
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const dow = d.getDay();
      if (dow === 0 || dow === 6) weekends++;
      else weekdays++;
    }

    const achievableHours = weekdays * weekdayHours + weekends * holidayHours;
    const sufficient = achievableHours >= totalHours;

    // Required daily average
    const requiredDailyAvg = totalHours / totalDays;

    // How much more per day if insufficient
    let extraMinutesPerDay = 0;
    if (!sufficient) {
      const shortfall = totalHours - achievableHours;
      extraMinutesPerDay = Math.ceil((shortfall / totalDays) * 60);
    }

    // Milestones
    const milestones = [25, 50, 75, 100].map((pct) => {
      const targetH = (totalHours * pct) / 100;
      let accumulated = 0;
      let daysNeeded = 0;
      for (let i = 0; i < totalDays; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dow = d.getDay();
        const h = dow === 0 || dow === 6 ? holidayHours : weekdayHours;
        accumulated += h;
        daysNeeded = i + 1;
        if (accumulated >= targetH) break;
      }
      const milestoneDate = new Date(today);
      milestoneDate.setDate(milestoneDate.getDate() + daysNeeded);
      return {
        pct,
        date: milestoneDate.toLocaleDateString("ja-JP", {
          month: "long",
          day: "numeric",
        }),
        reachable: daysNeeded <= totalDays,
      };
    });

    // Weekly schedule (Mon-Sun hours)
    const weekSchedule = DAYS_JP.map((day, i) => {
      const isWeekend = i >= 5;
      return {
        day,
        hours: isWeekend ? holidayHours : weekdayHours,
        isWeekend,
      };
    });
    const weeklyHours = weekdays > 0
      ? Math.min(5, weekdayHours) * 5 + holidayHours * 2
      : holidayHours * 2;

    return {
      totalDays,
      totalWeeks,
      remainingDays,
      achievableHours: Math.round(achievableHours * 10) / 10,
      sufficient,
      requiredDailyAvg: Math.round(requiredDailyAvg * 10) / 10,
      extraMinutesPerDay,
      milestones,
      weekSchedule,
      weeklyHours: Math.round(weeklyHours * 10) / 10,
    };
  }, [examDate, totalHours, weekdayHours, holidayHours]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 p-6 mb-6 text-white">
        <div className="text-4xl mb-2">📚</div>
        <h1 className="text-2xl font-bold mb-1">勉強計画シミュレーター</h1>
        <p className="text-indigo-100 text-sm">
          試験日から逆算して1日の学習時間と週間スケジュールを自動計算
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 mt-6">

        {/* Presets */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-3 block">
            試験・目標プリセット（クリックで自動入力）
          </label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePreset(preset)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  selectedPreset === preset.label
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                }`}
              >
                {preset.label}
                {preset.hours > 0 && (
                  <span
                    className={`ml-1 text-xs ${
                      selectedPreset === preset.label ? "text-indigo-200" : "text-gray-400"
                    }`}
                  >
                    ({preset.hours}h)
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">試験名</label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="例：宅建"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              必要総学習時間（時間）
            </label>
            <input
              type="number"
              value={totalHours}
              onChange={(e) => setTotalHours(Number(e.target.value))}
              min={1}
              step={10}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">試験日</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              平日の勉強可能時間（時間/日）
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.5}
                max={8}
                step={0.5}
                value={weekdayHours}
                onChange={(e) => setWeekdayHours(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="text-sm font-medium text-gray-800 w-12 text-right">
                {weekdayHours}h
              </span>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              休日の勉強可能時間（時間/日）
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={0.5}
                max={12}
                step={0.5}
                value={holidayHours}
                onChange={(e) => setHolidayHours(Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <span className="text-sm font-medium text-gray-800 w-12 text-right">
                {holidayHours}h
              </span>
            </div>
          </div>
        </div>

        {/* Results */}
        {result ? (
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h2 className="font-bold text-gray-800">計算結果</h2>

            {/* Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-indigo-700">{result.totalDays}</div>
                <div className="text-xs text-gray-500 mt-1">残り日数</div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">{result.totalWeeks}</div>
                <div className="text-xs text-gray-500 mt-1">残り週数</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{result.requiredDailyAvg}</div>
                <div className="text-xs text-gray-500 mt-1">必要な1日平均（h）</div>
              </div>
              <div
                className={`border rounded-xl p-4 text-center ${
                  result.sufficient
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div
                  className={`text-2xl font-bold ${
                    result.sufficient ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {result.achievableHours}h
                </div>
                <div className="text-xs text-gray-500 mt-1">達成可能時間</div>
              </div>
            </div>

            {/* Judgment */}
            {result.sufficient ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-green-700 font-semibold">
                  ✓ 現在のペースで試験日までに{" "}
                  <span className="text-lg">{result.achievableHours}</span>h 学習できます
                  （目標 {totalHours}h を充足）
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 font-semibold">
                  ⚠ 現在のペースでは {result.achievableHours}h しか確保できません（目標まで{" "}
                  {Math.round((totalHours - result.achievableHours) * 10) / 10}h 不足）
                </p>
                <p className="text-red-600 text-sm mt-1">
                  → 1日あと <span className="font-bold">{result.extraMinutesPerDay}分</span>{" "}
                  増やせば間に合います
                </p>
              </div>
            )}

            {/* Weekly schedule */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">週間スケジュール目安</h3>
              <div className="grid grid-cols-7 gap-1">
                {result.weekSchedule.map((day) => (
                  <div key={day.day} className="text-center">
                    <div
                      className={`text-xs font-medium mb-1 ${
                        day.isWeekend ? "text-indigo-600" : "text-gray-600"
                      }`}
                    >
                      {day.day}
                    </div>
                    <div
                      className={`rounded-lg py-2 text-xs font-bold ${
                        day.isWeekend
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {day.hours}h
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right">
                週計: {result.weeklyHours}h / 週
              </p>
            </div>

            {/* Milestones */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">マイルストーン</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {result.milestones.map((m) => (
                  <div
                    key={m.pct}
                    className={`border rounded-xl p-3 text-center ${
                      m.reachable
                        ? "bg-white border-gray-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="text-lg font-bold text-indigo-600">{m.pct}%</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((totalHours * m.pct) / 100)}h
                    </div>
                    <div
                      className={`text-xs font-medium mt-1 ${
                        m.reachable ? "text-gray-700" : "text-red-600"
                      }`}
                    >
                      {m.reachable ? m.date : "未達成"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-100 pt-6 text-center text-gray-400 text-sm py-8">
            試験日は今日以降の日付を入力してください
          </div>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">勉強計画シミュレーターの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          試験名・必要学習時間・試験日・平日と休日の勉強可能時間を入力することで、
          試験日までに達成できる学習時間、1日の必要学習時間、週間スケジュール、
          マイルストーン（25%/50%/75%/100%の達成予定日）を自動計算します。
          プリセットから試験を選択すると目安の必要学習時間が自動入力されます。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "資格試験の勉強時間の目安はいくらですか？",
            answer:
              "主な目安：FP3級50〜100時間、FP2級150〜300時間、宅建200〜400時間、簿記3級50〜100時間、簿記2級200〜350時間、TOEICスコアアップ100点=約100時間、英検2級100〜200時間です。",
          },
          {
            question: "効率的な勉強計画の立て方は？",
            answer:
              "試験日から逆算して総学習時間を均等に割り振り、週ごとの目標を決めます。最初の2週間は基礎固め、中盤は問題演習、最後の2週間は模試・復習というサイクルが効果的です。",
          },
          {
            question: "社会人が毎日の勉強時間を確保するコツは？",
            answer:
              "通勤時間・昼休み・就寝前の30分など「隙間時間」を活用することが鍵です。朝型勉強は集中力が高く継続しやすいとされています。まず1日30分から始めましょう。",
          },
          {
            question: "勉強のモチベーションを維持するには？",
            answer:
              "具体的な目標（試験日・合格後の変化）を紙に書く、進捗を可視化する（本ツールの達成率表示など）、勉強仲間を作るなどが効果的です。",
          },
        ]}
      />

      <RelatedTools currentToolId="study-planner" />

      <p className="text-xs text-gray-400 mt-6 text-center">
        ※ 本ツールの学習時間目安は一般的な参考値です。個人差があります。必要に応じて専門の講師や教材でご確認ください。
      </p>
    </div>
  );
}
