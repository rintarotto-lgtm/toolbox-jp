"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface Task {
  id: number;
  name: string;
  pomodoros: number;
}

interface TimelineBlock {
  type: "work" | "short_break" | "long_break";
  label: string;
  startMin: number;
  durationMin: number;
  taskName?: string;
  taskEnd?: boolean;
}

function formatTime(totalMinutes: number, baseHour: number, baseMin: number): string {
  const total = baseHour * 60 + baseMin + totalMinutes;
  const h = Math.floor(total / 60) % 24;
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}分`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}時間` : `${h}時間${m}分`;
}

let nextId = 1;

export default function PomodoroCalc() {
  const [workMin, setWorkMin] = useState(25);
  const [shortBreakMin, setShortBreakMin] = useState(5);
  const [longBreakMin, setLongBreakMin] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  });
  const [endTime, setEndTime] = useState("");
  const [tasks, setTasks] = useState<Task[]>([
    { id: nextId++, name: "タスク1", pomodoros: 2 },
    { id: nextId++, name: "タスク2", pomodoros: 3 },
  ]);

  const addTask = () => {
    setTasks((prev) => [...prev, { id: nextId++, name: `タスク${prev.length + 1}`, pomodoros: 1 }]);
  };

  const removeTask = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTask = (id: number, field: "name" | "pomodoros", value: string | number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const [startH, startM] = useMemo(() => {
    const parts = startTime.split(":");
    return [parseInt(parts[0] || "9"), parseInt(parts[1] || "0")];
  }, [startTime]);

  const [endH, endM] = useMemo(() => {
    if (!endTime) return [null, null];
    const parts = endTime.split(":");
    return [parseInt(parts[0]), parseInt(parts[1])];
  }, [endTime]);

  const result = useMemo(() => {
    const totalPomodoros = tasks.reduce((s, t) => s + t.pomodoros, 0);
    if (totalPomodoros === 0) return null;

    // Build timeline
    const timeline: TimelineBlock[] = [];
    let elapsedMin = 0;
    let pomodoroCount = 0;

    // Track per-task completion
    const taskCompletions: { taskName: string; endMin: number }[] = [];
    let currentTaskIdx = 0;
    let remainingInTask = tasks[0]?.pomodoros ?? 0;

    for (let i = 0; i < totalPomodoros; i++) {
      const currentTask = tasks[currentTaskIdx];
      timeline.push({
        type: "work",
        label: `#${i + 1}`,
        startMin: elapsedMin,
        durationMin: workMin,
        taskName: currentTask?.name,
      });
      elapsedMin += workMin;
      pomodoroCount++;
      remainingInTask--;

      if (remainingInTask === 0) {
        taskCompletions.push({
          taskName: currentTask?.name ?? "",
          endMin: elapsedMin,
        });
        currentTaskIdx++;
        remainingInTask = tasks[currentTaskIdx]?.pomodoros ?? 0;
      }

      // Add break (except after last pomodoro)
      if (i < totalPomodoros - 1) {
        const isLong = pomodoroCount % longBreakInterval === 0;
        if (isLong) {
          timeline.push({
            type: "long_break",
            label: "長休憩",
            startMin: elapsedMin,
            durationMin: longBreakMin,
          });
          elapsedMin += longBreakMin;
        } else {
          timeline.push({
            type: "short_break",
            label: "休憩",
            startMin: elapsedMin,
            durationMin: shortBreakMin,
          });
          elapsedMin += shortBreakMin;
        }
      }
    }

    const totalWorkMin = totalPomodoros * workMin;
    const longBreaks = Math.floor((totalPomodoros - 1) / longBreakInterval);
    const shortBreaks = totalPomodoros - 1 - longBreaks;
    const totalBreakMin = longBreaks * longBreakMin + shortBreaks * shortBreakMin;
    const totalMin = totalWorkMin + totalBreakMin;

    const endTimeStr = formatTime(totalMin, startH, startM);

    // Score: based on pomodoro count
    let score: string;
    let scoreColor: string;
    if (totalPomodoros >= 10) {
      score = "超集中モード 🔥";
      scoreColor = "text-red-600";
    } else if (totalPomodoros >= 7) {
      score = "高集中 ✨";
      scoreColor = "text-orange-600";
    } else if (totalPomodoros >= 4) {
      score = "標準的な1日 👍";
      scoreColor = "text-green-600";
    } else {
      score = "軽め・入門 🌱";
      scoreColor = "text-blue-600";
    }

    // Check against end time limit
    let fitsInWindow = true;
    if (endH !== null && endM !== null) {
      const maxMin = (endH - startH) * 60 + (endM - startM);
      fitsInWindow = totalMin <= maxMin;
    }

    return {
      totalPomodoros,
      totalWorkMin,
      totalBreakMin,
      totalMin,
      endTimeStr,
      timeline,
      taskCompletions: taskCompletions.map((tc) => ({
        ...tc,
        timeStr: formatTime(tc.endMin, startH, startM),
      })),
      score,
      scoreColor,
      fitsInWindow,
    };
  }, [tasks, workMin, shortBreakMin, longBreakMin, longBreakInterval, startH, startM, endH, endM]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-600 p-6 mb-6 text-white">
        <div className="text-4xl mb-2">🍅</div>
        <h1 className="text-2xl font-bold mb-1">ポモドーロ計算ツール</h1>
        <p className="text-red-100 text-sm">
          作業時間・休憩・タスクから1日のスケジュールと終了時刻を計算
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 mt-6">

        {/* Settings */}
        <section>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>⚙️</span> ポモドーロ設定
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                作業時間: {workMin}分
              </label>
              <input
                type="range"
                min={15}
                max={60}
                step={5}
                value={workMin}
                onChange={(e) => setWorkMin(Number(e.target.value))}
                className="w-full accent-red-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>15分</span><span>60分</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                短休憩: {shortBreakMin}分
              </label>
              <input
                type="range"
                min={3}
                max={15}
                step={1}
                value={shortBreakMin}
                onChange={(e) => setShortBreakMin(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>3分</span><span>15分</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                長休憩: {longBreakMin}分
              </label>
              <input
                type="range"
                min={10}
                max={30}
                step={5}
                value={longBreakMin}
                onChange={(e) => setLongBreakMin(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>10分</span><span>30分</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                長休憩までのセット数: {longBreakInterval}
              </label>
              <input
                type="range"
                min={2}
                max={6}
                step={1}
                value={longBreakInterval}
                onChange={(e) => setLongBreakInterval(Number(e.target.value))}
                className="w-full accent-red-400"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>2セット</span><span>6セット</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">開始時刻</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                終了希望時刻{" "}
                <span className="text-gray-400 font-normal">（任意）</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
              />
            </div>
          </div>
        </section>

        {/* Task list */}
        <section>
          <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📋</span> タスクリスト
          </h2>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={task.name}
                  onChange={(e) => updateTask(task.id, "name", e.target.value)}
                  placeholder="タスク名"
                  className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 whitespace-nowrap">🍅×</span>
                  <input
                    type="number"
                    value={task.pomodoros}
                    onChange={(e) =>
                      updateTask(task.id, "pomodoros", Math.max(1, Number(e.target.value)))
                    }
                    min={1}
                    max={20}
                    className="w-14 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm text-center"
                  />
                </div>
                <button
                  onClick={() => removeTask(task.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none"
                  aria-label="削除"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addTask}
            className="mt-3 w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-500 rounded-lg text-sm hover:border-red-400 hover:text-red-500 transition-colors"
          >
            + タスクを追加
          </button>
        </section>

        {/* Results */}
        {result && (
          <div className="border-t border-gray-100 pt-6 space-y-4">
            <h2 className="font-bold text-gray-800">計算結果</h2>

            {/* Overview stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{result.totalPomodoros}</div>
                <div className="text-xs text-gray-500 mt-1">総ポモドーロ数</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {formatDuration(result.totalWorkMin)}
                </div>
                <div className="text-xs text-gray-500 mt-1">総作業時間</div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {formatDuration(result.totalBreakMin)}
                </div>
                <div className="text-xs text-gray-500 mt-1">総休憩時間</div>
              </div>
              <div
                className={`border rounded-xl p-4 text-center ${
                  !endTime || result.fitsInWindow
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div
                  className={`text-2xl font-bold ${
                    !endTime || result.fitsInWindow ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {result.endTimeStr}
                </div>
                <div className="text-xs text-gray-500 mt-1">終了予定時刻</div>
              </div>
            </div>

            {endTime && !result.fitsInWindow && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                ⚠ 終了希望時刻 {endTime} を超えます。タスクを減らすか開始時刻を早めてください。
              </div>
            )}

            {/* Focus score */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 mb-0.5">今日の集中スコア</div>
                <div className={`text-lg font-bold ${result.scoreColor}`}>{result.score}</div>
              </div>
              <div className="text-4xl">🍅</div>
            </div>

            {/* Task completion times */}
            {result.taskCompletions.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">タスク別完了予定時刻</h3>
                <div className="space-y-2">
                  {result.taskCompletions.map((tc, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 flex items-center gap-2">
                        <span className="w-5 h-5 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {i + 1}
                        </span>
                        {tc.taskName || `タスク${i + 1}`}
                      </span>
                      <span className="font-medium text-gray-800">{tc.timeStr}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">タイムライン</h3>
              <div className="overflow-x-auto">
                <div className="flex gap-0.5 min-w-max pb-2">
                  {result.timeline.map((block, i) => {
                    const widthPx = Math.max(block.durationMin * 2, 20);
                    const bgColor =
                      block.type === "work"
                        ? "bg-red-400"
                        : block.type === "long_break"
                        ? "bg-amber-400"
                        : "bg-green-300";
                    const textColor =
                      block.type === "work" ? "text-white" : "text-white";
                    return (
                      <div
                        key={i}
                        className={`${bgColor} ${textColor} rounded text-xs flex flex-col items-center justify-center shrink-0 relative`}
                        style={{ width: `${widthPx}px`, height: "48px" }}
                        title={
                          block.taskName
                            ? `${block.taskName} (${block.durationMin}分)`
                            : `${block.label} (${block.durationMin}分)`
                        }
                      >
                        <span className="font-bold leading-tight">{block.label}</span>
                        <span className="opacity-80 leading-tight">{block.durationMin}m</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-red-400 rounded inline-block" /> 作業
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-300 rounded inline-block" /> 短休憩
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-amber-400 rounded inline-block" /> 長休憩
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">ポモドーロ計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          作業時間・短休憩・長休憩・セット数を設定し、タスクとポモドーロ数（25分単位）を入力すると、
          1日の総作業時間・休憩時間・終了予定時刻を自動計算します。
          タイムラインでポモドーロと休憩の流れを視覚的に確認でき、
          タスクごとの完了予定時刻も表示します。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "ポモドーロテクニックとは何ですか？",
            answer:
              "25分作業→5分休憩を1セット（1ポモドーロ）として繰り返す時間管理術です。4セット後に15〜30分の長休憩を取ります。イタリア語でトマトを意味するポモドーロという形のキッチンタイマーを使って考案されました。",
          },
          {
            question: "ポモドーロの時間は変えてもいいですか？",
            answer:
              "はい。集中力の高い人は50分作業+10分休憩、短時間集中したい場合は15分+5分など、自分に合った時間で行うことが重要です。",
          },
          {
            question: "1日に何ポモドーロできますか？",
            answer:
              "集中力を維持できる理想的な数は1日8〜12ポモドーロ（標準25分）とされています。それ以上は集中力が低下します。",
          },
          {
            question: "ポモドーロでタスクの時間を見積もるには？",
            answer:
              "1ポモドーロ（25分）を1単位として、各タスクが何ポモドーロかかるか見積もります。見積もりと実績の差から自分の作業速度を把握できます。",
          },
        ]}
      />

      <RelatedTools currentToolId="pomodoro-calc" />

      <p className="text-xs text-gray-400 mt-6 text-center">
        ※ 本ツールはポモドーロテクニックに基づくスケジュール計算です。実際の作業効率は個人差があります。
      </p>
    </div>
  );
}
