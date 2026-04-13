"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type ScaleType = "4.0" | "5.0" | "percent";
type GradeKey = "S" | "A" | "B" | "C" | "D" | "F";

interface Course {
  id: number;
  name: string;
  grade: GradeKey | string;
  credits: number;
}

interface GradeOption {
  label: string;
  value: GradeKey;
}

const GRADE_POINTS_4: Record<GradeKey, number> = {
  S: 4.0,
  A: 3.0,
  B: 2.0,
  C: 1.0,
  D: 0,
  F: 0,
};

const GRADE_POINTS_5: Record<GradeKey, number> = {
  S: 5.0,
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0,
};

const GRADE_OPTIONS_4: GradeOption[] = [
  { label: "S (4.0)", value: "S" },
  { label: "A (3.0)", value: "A" },
  { label: "B (2.0)", value: "B" },
  { label: "C (1.0)", value: "C" },
  { label: "D (0)", value: "D" },
];

const GRADE_OPTIONS_5: GradeOption[] = [
  { label: "S (5.0)", value: "S" },
  { label: "A (4.0)", value: "A" },
  { label: "B (3.0)", value: "B" },
  { label: "C (2.0)", value: "C" },
  { label: "D (1.0)", value: "D" },
  { label: "F (0)", value: "F" },
];

function getGradePoint(grade: GradeKey | string, scale: ScaleType): number {
  if (scale === "percent") {
    const pct = parseFloat(grade);
    if (isNaN(pct)) return 0;
    if (pct >= 90) return 4.0;
    if (pct >= 80) return 3.0;
    if (pct >= 70) return 2.0;
    if (pct >= 60) return 1.0;
    return 0;
  }
  const map = scale === "4.0" ? GRADE_POINTS_4 : GRADE_POINTS_5;
  return map[grade as GradeKey] ?? 0;
}

function getGradeLabel(grade: GradeKey | string): string {
  const labels: Record<string, string> = {
    S: "優（S）",
    A: "優（A）",
    B: "良（B）",
    C: "可（C）",
    D: "不可（D）",
    F: "不可（F）",
  };
  return labels[grade] ?? grade;
}

let nextId = 1;

export default function GradePointCalc() {
  const [scale, setScale] = useState<ScaleType>("4.0");
  const [courses, setCourses] = useState<Course[]>([]);
  const [newName, setNewName] = useState<string>("");
  const [newGrade, setNewGrade] = useState<GradeKey | string>("A");
  const [newCredits, setNewCredits] = useState<string>("2");
  const [targetGpa, setTargetGpa] = useState<string>("");
  const [remainingCredits, setRemainingCredits] = useState<string>("");

  const gradeOptions: GradeOption[] = useMemo(
    () => (scale === "5.0" ? GRADE_OPTIONS_5 : GRADE_OPTIONS_4),
    [scale]
  );

  const maxGpa = scale === "5.0" ? 5.0 : 4.0;

  const stats = useMemo(() => {
    if (courses.length === 0) return null;
    let totalPoints = 0;
    let totalCredits = 0;
    const gradeCounts: Record<string, number> = {};

    for (const course of courses) {
      const pt = getGradePoint(course.grade, scale);
      totalPoints += pt * course.credits;
      totalCredits += course.credits;
      gradeCounts[course.grade] = (gradeCounts[course.grade] ?? 0) + 1;
    }

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;

    const excellentCount = courses.filter((c) =>
      ["S", "A"].includes(c.grade)
    ).length;
    const goodCount = courses.filter((c) => c.grade === "B").length;
    const passCount = courses.filter((c) => c.grade === "C").length;
    const failCount = courses.filter((c) => ["D", "F"].includes(c.grade)).length;

    return { gpa, totalCredits, excellentCount, goodCount, passCount, failCount };
  }, [courses, scale]);

  const simulation = useMemo(() => {
    const target = parseFloat(targetGpa);
    const remCr = parseFloat(remainingCredits);
    if (!stats || isNaN(target) || isNaN(remCr) || remCr <= 0) return null;

    const currentPoints = stats.gpa * stats.totalCredits;
    const totalFutureCredits = stats.totalCredits + remCr;
    const neededPoints = target * totalFutureCredits - currentPoints;
    const neededGpa = neededPoints / remCr;

    if (neededGpa <= 0) return { achievable: true, neededGpa: 0, message: "現在の成績で目標達成済みです！" };
    if (neededGpa > maxGpa) return { achievable: false, neededGpa, message: `残り単位で最高評価を取り続けても目標に届きません（必要GPA: ${neededGpa.toFixed(2)}）。` };
    return { achievable: true, neededGpa, message: `残り${remCr}単位でGPA ${neededGpa.toFixed(2)}以上を取れば目標達成できます。` };
  }, [stats, targetGpa, remainingCredits, maxGpa]);

  function addCourse() {
    const cr = parseFloat(newCredits);
    if (!newGrade || isNaN(cr) || cr <= 0) return;
    setCourses((prev) => [
      ...prev,
      { id: nextId++, name: newName || `科目${nextId}`, grade: newGrade, credits: cr },
    ]);
    setNewName("");
    setNewCredits("2");
  }

  function removeCourse(id: number) {
    setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  function handleScaleChange(newScale: ScaleType) {
    setScale(newScale);
    setNewGrade("A");
    setCourses([]);
  }

  const gpaColor = (gpa: number): string => {
    if (gpa >= maxGpa * 0.8) return "text-green-600";
    if (gpa >= maxGpa * 0.6) return "text-blue-600";
    if (gpa >= maxGpa * 0.4) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">GPA・成績点数計算</h1>
      <p className="text-gray-500 text-sm mb-6">
        大学のGPAを計算します。単位数加重平均・4段階・5段階スケール対応。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 mt-6">
        {/* スケール選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            スケール選択
          </label>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
            {(["4.0", "5.0", "percent"] as ScaleType[]).map((s) => (
              <button
                key={s}
                onClick={() => handleScaleChange(s)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  scale === s
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {s === "4.0" ? "4.0スケール" : s === "5.0" ? "5.0スケール" : "パーセント"}
              </button>
            ))}
          </div>
        </div>

        {/* 科目追加フォーム */}
        <div className="border border-gray-100 rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-medium text-gray-700">科目を追加</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="科目名（任意）"
              className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {scale === "percent" ? (
              <input
                type="number"
                min="0"
                max="100"
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                placeholder="点数（0〜100）"
                className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <select
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value as GradeKey)}
                className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {gradeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="10"
                value={newCredits}
                onChange={(e) => setNewCredits(e.target.value)}
                placeholder="単位数"
                className="w-24 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={addCourse}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                追加
              </button>
            </div>
          </div>
        </div>

        {/* 科目リスト */}
        {courses.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">登録科目一覧</h3>
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">科目名</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">評価</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">単位</th>
                    <th className="px-3 py-2 text-center font-medium text-gray-600">ポイント</th>
                    <th className="px-3 py-2 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-t hover:bg-gray-50">
                      <td className="px-3 py-2 text-gray-800">{course.name}</td>
                      <td className="px-3 py-2 text-center">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {scale === "percent" ? `${course.grade}点` : getGradeLabel(course.grade)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center text-gray-700">
                        {course.credits}
                      </td>
                      <td className="px-3 py-2 text-center font-medium text-gray-800">
                        {getGradePoint(course.grade, scale).toFixed(1)}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => removeCourse(course.id)}
                          className="text-red-400 hover:text-red-600 text-xs"
                        >
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* GPA結果 */}
        {stats && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center col-span-2 sm:col-span-1">
                <div className={`text-4xl font-bold ${gpaColor(stats.gpa)}`}>
                  {stats.gpa.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">GPA</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  （{scale}スケール）
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {stats.totalCredits}
                </div>
                <div className="text-xs text-gray-500 mt-1">取得単位数</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <div className="text-sm font-bold text-gray-800 space-y-0.5">
                  <div>優: {stats.excellentCount}科目</div>
                  <div>良: {stats.goodCount}科目</div>
                  <div>可: {stats.passCount}科目</div>
                  {stats.failCount > 0 && (
                    <div className="text-red-500">不可: {stats.failCount}科目</div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1">内訳</div>
              </div>
            </div>

            {/* GPA バー */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>現在のGPA達成度</span>
                <span className="font-medium">{((stats.gpa / maxGpa) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${(stats.gpa / maxGpa) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>{maxGpa}</span>
              </div>
            </div>
          </div>
        )}

        {/* 目標GPAシミュレーション */}
        {stats && (
          <div className="border border-gray-100 rounded-lg p-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-700">目標GPA達成シミュレーション</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">目標GPA</label>
                <input
                  type="number"
                  min="0"
                  max={maxGpa}
                  step="0.1"
                  value={targetGpa}
                  onChange={(e) => setTargetGpa(e.target.value)}
                  placeholder={`例：${(maxGpa * 0.75).toFixed(1)}`}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">今後履修予定の単位数</label>
                <input
                  type="number"
                  min="1"
                  value={remainingCredits}
                  onChange={(e) => setRemainingCredits(e.target.value)}
                  placeholder="例：30"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {simulation && (
              <div
                className={`rounded-lg p-3 text-sm font-medium ${
                  simulation.achievable
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {simulation.message}
              </div>
            )}
          </div>
        )}
      </div>

      <AdBanner />

      <ToolFAQ
        faqs={[
          {
            question: "GPAの計算方法は？",
            answer:
              "（成績ポイント×単位数）の合計を総単位数で割って算出します。",
          },
          {
            question: "大学院出願に必要なGPAは？",
            answer:
              "国内大学院は3.0以上、海外は3.5以上が一般的な目安です。",
          },
          {
            question: "GPAを上げるには？",
            answer:
              "単位数の多い必修科目の成績向上が最も効果的です。",
          },
        ]}
      />

      <RelatedTools currentToolId="grade-point-calc" />
    </div>
  );
}
