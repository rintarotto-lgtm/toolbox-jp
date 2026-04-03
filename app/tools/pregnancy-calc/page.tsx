"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type InputMode = "lmp" | "conception";

interface Milestone {
  label: string;
  weeks: number;
  days?: number;
  note?: string;
}

const MILESTONES: Milestone[] = [
  { label: "心拍確認可能", weeks: 6, note: "経膣超音波で確認" },
  { label: "母子手帳交付目安", weeks: 10, note: "10〜11週ごろ" },
  { label: "安定期（胎盤完成）", weeks: 16, note: "第2三半期開始" },
  { label: "胎動感じ始め", weeks: 18, note: "18〜20週ごろ" },
  { label: "性別確認可能目安", weeks: 20, note: "超音波検査" },
  { label: "出産準備開始推奨", weeks: 28, note: "第3三半期開始" },
  { label: "正期産開始", weeks: 37, note: "37〜41週が正期産" },
  { label: "出産予定日", weeks: 40, note: "最終月経から280日" },
];

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

function getStage(weeks: number): { label: string; color: string; bgColor: string } {
  if (weeks < 16) return { label: "妊娠初期（第1三半期）", color: "text-pink-600", bgColor: "bg-pink-50 border-pink-200" };
  if (weeks < 28) return { label: "妊娠中期（第2三半期）", color: "text-rose-600", bgColor: "bg-rose-50 border-rose-200" };
  return { label: "妊娠後期（第3三半期）", color: "text-red-700", bgColor: "bg-red-50 border-red-200" };
}

export default function PregnancyCalc() {
  const [mode, setMode] = useState<InputMode>("lmp");
  const [lmpDate, setLmpDate] = useState("");
  const [cycle, setCycle] = useState("28");
  const [conceptionDate, setConceptionDate] = useState("");

  const result = useMemo(() => {
    let lmp: Date | null = null;

    if (mode === "lmp") {
      if (!lmpDate) return null;
      lmp = new Date(lmpDate);
    } else {
      if (!conceptionDate) return null;
      // 受精日は排卵日 = LMPから約(cycle/2)日後
      const cDate = new Date(conceptionDate);
      const cycleDays = parseInt(cycle) || 28;
      lmp = addDays(cDate, -(cycleDays / 2));
    }

    if (!lmp || isNaN(lmp.getTime())) return null;

    const dueDate = addDays(lmp, 280);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDaysPregnant = Math.floor(
      (today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24)
    );

    // 将来の場合は今日を0日として計算
    const daysPregnant = Math.max(0, totalDaysPregnant);
    const weeksPregnant = Math.floor(daysPregnant / 7);
    const remainingDays = daysPregnant % 7;
    const daysUntilDue = Math.ceil(
      (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const milestones = MILESTONES.map((m) => ({
      ...m,
      date: addDays(lmp!, m.weeks * 7 + (m.days || 0)),
      passed: weeksPregnant >= m.weeks,
    }));

    const stage = getStage(weeksPregnant);
    const progressPercent = Math.min(100, Math.max(0, (weeksPregnant / 40) * 100));

    let remainingWeeksLabel = "";
    if (weeksPregnant < 40) {
      const weeksLeft = 40 - weeksPregnant;
      remainingWeeksLabel = `残り約${weeksLeft}週`;
    }

    return {
      lmp,
      dueDate,
      weeksPregnant,
      remainingDays,
      daysUntilDue,
      milestones,
      stage,
      progressPercent,
      remainingWeeksLabel,
      isPregnant: totalDaysPregnant >= 0,
    };
  }, [mode, lmpDate, cycle, conceptionDate]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-pink-400 to-rose-500 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🤱</span>
          <h1 className="text-2xl font-bold">妊娠週数・出産予定日計算</h1>
        </div>
        <p className="text-pink-100 text-sm">
          最終月経開始日または受精日から妊娠週数・出産予定日を自動計算します。
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Mode Tabs */}
        <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode("lmp")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              mode === "lmp"
                ? "bg-white text-pink-600 shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            最終月経から計算
          </button>
          <button
            onClick={() => setMode("conception")}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              mode === "conception"
                ? "bg-white text-pink-600 shadow"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            受精日・排卵日から計算
          </button>
        </div>

        {/* Inputs */}
        {mode === "lmp" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                最終月経開始日
              </label>
              <input
                type="date"
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                月経周期（日）
              </label>
              <input
                type="number"
                value={cycle}
                onChange={(e) => setCycle(e.target.value)}
                min="21"
                max="35"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">排卵日の目安に使用（出産予定日には影響しません）</p>
            </div>
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              受精日（排卵日）
            </label>
            <input
              type="date"
              value={conceptionDate}
              onChange={(e) => setConceptionDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              排卵日から逆算して最終月経開始日を推定し、出産予定日を計算します。
            </p>
          </div>
        )}

        {/* Results */}
        {result && (
          <>
            {/* Due Date Big Card */}
            <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-5 text-center">
              <div className="text-xs text-gray-500 mb-1">出産予定日</div>
              <div className="text-3xl font-bold text-pink-600 mb-1">
                {formatDate(result.dueDate)}
              </div>
              {result.daysUntilDue > 0 && (
                <div className="text-sm text-gray-500">
                  あと <span className="font-bold text-rose-500">{result.daysUntilDue}日</span>
                </div>
              )}
              {result.daysUntilDue <= 0 && result.daysUntilDue > -14 && (
                <div className="text-sm text-orange-600 font-medium">まもなく出産予定日です</div>
              )}
            </div>

            {/* Current Weeks */}
            {result.isPregnant && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">
                    {result.weeksPregnant}週{result.remainingDays}日
                  </div>
                  <div className="text-xs text-gray-500 mt-1">現在の妊娠週数</div>
                </div>
                <div className={`border rounded-lg p-4 text-center ${result.stage.bgColor}`}>
                  <div className={`text-sm font-bold ${result.stage.color}`}>
                    {result.stage.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{result.remainingWeeksLabel}</div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">{result.daysUntilDue > 0 ? result.daysUntilDue : 0}</div>
                  <div className="text-xs text-gray-500 mt-1">出産まであと（日）</div>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {result.isPregnant && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>妊娠0週</span>
                  <span className="font-medium text-pink-600">現在: {result.weeksPregnant}週</span>
                  <span>40週（出産予定日）</span>
                </div>
                <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${result.progressPercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>初期（〜15週）</span>
                  <span>中期（16〜27週）</span>
                  <span>後期（28週〜）</span>
                </div>
              </div>
            )}

            {/* Milestones Table */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">マイルストーン一覧</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b border-gray-200">
                      <th className="text-left pb-2 font-medium">時期</th>
                      <th className="text-left pb-2 font-medium">イベント</th>
                      <th className="text-left pb-2 font-medium">予定日</th>
                      <th className="text-left pb-2 font-medium">備考</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.milestones.map((m, i) => (
                      <tr
                        key={i}
                        className={`border-b border-gray-100 ${
                          m.passed ? "text-gray-400" : "text-gray-700"
                        }`}
                      >
                        <td className="py-2 font-medium">
                          {m.passed ? (
                            <span className="text-green-500">✓ {m.weeks}週</span>
                          ) : (
                            <span>{m.weeks}週</span>
                          )}
                        </td>
                        <td className="py-2">{m.label}</td>
                        <td className="py-2 text-xs">{formatDate(m.date)}</td>
                        <td className="py-2 text-xs text-gray-400">{m.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center">
              最終月経開始日: {formatDate(result.lmp)}
            </p>
          </>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">妊娠週数・出産予定日計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          最終月経開始日を入力するだけで、出産予定日と現在の妊娠週数を自動計算します。
          受精日・排卵日がわかる場合はそちらから計算することも可能です。
          心拍確認・安定期・性別確認など主要なマイルストーンの予定日も一覧表示。
          妊娠週数の進捗をプログレスバーで視覚的に確認できます。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "出産予定日の計算方法は？",
            answer:
              "最終月経開始日から280日後（40週後）が出産予定日です。ナーゲル法では最終月経開始月に9を足し（または3を引き）、日に7を足して計算します。",
          },
          {
            question: "妊娠週数の数え方は？",
            answer:
              "最終月経開始日を妊娠0週0日とします。7日で1週が終わり、次の週に進みます。妊娠10週0日は最終月経から70日目です。",
          },
          {
            question: "妊娠初期・中期・後期の区分は？",
            answer:
              "妊娠0〜15週が初期（第1三半期）、16〜27週が中期（第2三半期）、28週以降が後期（第3三半期）とされています。",
          },
          {
            question: "早産・正期産・過期産の定義は？",
            answer:
              "妊娠22〜36週の出産が早産、37〜41週が正期産（予定日±2週）、42週以降が過期産です。",
          },
        ]}
      />

      <RelatedTools currentToolId="pregnancy-calc" />

      <p className="text-xs text-gray-400 text-center mt-8">
        本ツールの計算結果は参考情報です。健康に関する判断は必ず医師にご相談ください。
      </p>
    </div>
  );
}
