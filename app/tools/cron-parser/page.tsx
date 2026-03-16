"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

const FIELDS = ["分", "時", "日", "月", "曜日"] as const;
const PRESETS: { label: string; cron: string }[] = [
  { label: "毎分", cron: "* * * * *" },
  { label: "毎時0分", cron: "0 * * * *" },
  { label: "毎日0時", cron: "0 0 * * *" },
  { label: "毎日9時", cron: "0 9 * * *" },
  { label: "毎週月曜9時", cron: "0 9 * * 1" },
  { label: "平日9時", cron: "0 9 * * 1-5" },
  { label: "毎月1日0時", cron: "0 0 1 * *" },
  { label: "毎年1月1日0時", cron: "0 0 1 1 *" },
  { label: "5分ごと", cron: "*/5 * * * *" },
  { label: "30分ごと", cron: "*/30 * * * *" },
  { label: "2時間ごと", cron: "0 */2 * * *" },
  { label: "毎日12時と0時", cron: "0 0,12 * * *" },
];

const DOW = ["日", "月", "火", "水", "木", "金", "土"];
const MONTHS = ["", "1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

function parseField(field: string, min: number, max: number): number[] | null {
  try {
    const vals = new Set<number>();
    for (const part of field.split(",")) {
      const stepMatch = part.match(/^(.+)\/(\d+)$/);
      let range: string;
      let step = 1;
      if (stepMatch) { range = stepMatch[1]; step = parseInt(stepMatch[2]); }
      else { range = part; }

      if (range === "*") {
        for (let i = min; i <= max; i += step) vals.add(i);
      } else if (range.includes("-")) {
        const [a, b] = range.split("-").map(Number);
        if (isNaN(a) || isNaN(b)) return null;
        for (let i = a; i <= b; i += step) vals.add(i);
      } else {
        const n = parseInt(range);
        if (isNaN(n)) return null;
        vals.add(n);
      }
    }
    return [...vals].sort((a, b) => a - b);
  } catch { return null; }
}

function describeCron(expr: string): { description: string; error?: string } {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return { description: "", error: "Cron式は5つのフィールドが必要です（分 時 日 月 曜日）" };

  const [minF, hourF, dayF, monthF, dowF] = parts;
  const mins = parseField(minF, 0, 59);
  const hours = parseField(hourF, 0, 23);
  const days = parseField(dayF, 1, 31);
  const months = parseField(monthF, 1, 12);
  const dows = parseField(dowF, 0, 7);

  if (!mins || !hours || !days || !months || !dows) return { description: "", error: "Cron式のフォーマットが正しくありません" };

  const desc: string[] = [];

  // Frequency
  if (minF === "*" && hourF === "*") desc.push("毎分");
  else if (minF.startsWith("*/")) desc.push(`${minF.slice(2)}分ごと`);
  else if (hourF === "*") desc.push(`毎時${mins.join(",")}分`);
  else if (hourF.startsWith("*/")) desc.push(`${hourF.slice(2)}時間ごと（${mins[0]}分）`);
  else {
    const times = hours.map(h => `${h}時${mins.length === 1 ? mins[0] + "分" : ""}`).join("・");
    desc.push(times);
  }

  // Day of week
  if (dowF !== "*") {
    const dowNames = dows.map(d => DOW[d % 7]);
    desc.push(`（${dowNames.join("・")}曜日）`);
  }

  // Day of month
  if (dayF !== "*") desc.push(`毎月${days.join(",")}日`);

  // Month
  if (monthF !== "*") desc.push(`${months.map(m => MONTHS[m]).join("・")}のみ`);

  return { description: desc.join(" ") || expr };
}

function getNextRuns(expr: string, count: number = 5): Date[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];
  const [minF, hourF, dayF, monthF, dowF] = parts;
  const mins = parseField(minF, 0, 59);
  const hours = parseField(hourF, 0, 23);
  const days = parseField(dayF, 1, 31);
  const months = parseField(monthF, 1, 12);
  const dows = parseField(dowF, 0, 7);
  if (!mins || !hours || !days || !months || !dows) return [];

  const normalizedDows = dows.map(d => d % 7);
  const results: Date[] = [];
  const now = new Date();
  const d = new Date(now);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);

  let safety = 0;
  while (results.length < count && safety < 525960) {
    safety++;
    const mo = d.getMonth() + 1;
    const day = d.getDate();
    const dow = d.getDay();
    const hr = d.getHours();
    const mn = d.getMinutes();

    if (months.includes(mo) && days.includes(day) && normalizedDows.includes(dow) && hours.includes(hr) && mins.includes(mn)) {
      results.push(new Date(d));
    }
    d.setMinutes(d.getMinutes() + 1);
  }
  return results;
}

export default function CronParser() {
  const [expr, setExpr] = useState("0 9 * * 1-5");

  const { description, error } = describeCron(expr);
  const nextRuns = getNextRuns(expr);
  const parts = expr.trim().split(/\s+/);

  const fmt = (d: Date) =>
    `${d.getFullYear()}/${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")} (${DOW[d.getDay()]}曜日)`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Cron式解説</h1>
      <p className="text-gray-500 text-sm mb-6">
        Cron式を日本語で分かりやすく解説。次の実行予定時刻やプリセットも表示。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Cron式</label>
          <input
            value={expr}
            onChange={(e) => setExpr(e.target.value)}
            placeholder="* * * * *"
            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Field labels */}
        {parts.length === 5 && (
          <div className="grid grid-cols-5 gap-2 text-center">
            {parts.map((p, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-2">
                <div className="font-mono text-sm font-bold text-blue-600">{p}</div>
                <div className="text-xs text-gray-500 mt-1">{FIELDS[i]}</div>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        {error ? (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        ) : (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-700 font-medium">📝 日本語解説</div>
            <div className="text-blue-900 font-bold mt-1">{description}</div>
          </div>
        )}

        {/* Next runs */}
        {nextRuns.length > 0 && (
          <div>
            <div className="text-sm font-medium text-gray-700 mb-2">⏰ 次の実行予定（5件）</div>
            <div className="space-y-1">
              {nextRuns.map((d, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-mono text-gray-700 bg-gray-50 rounded px-3 py-1.5">
                  <span className="text-gray-400 w-4">{i + 1}.</span>
                  <span>{fmt(d)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Presets */}
        <div>
          <div className="text-sm font-medium text-gray-700 mb-2">📋 よく使うプリセット</div>
          <div className="grid sm:grid-cols-2 gap-2">
            {PRESETS.map(({ label, cron }) => (
              <button
                key={cron}
                onClick={() => setExpr(cron)}
                className="flex justify-between items-center px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm transition-colors"
              >
                <span className="text-gray-700">{label}</span>
                <code className="text-xs text-gray-500 font-mono">{cron}</code>
              </button>
            ))}
          </div>
        </div>
      </div>

      <ToolFAQ faqs={[
        { question: "Cron式とは何ですか？", answer: "Cron式は、Unix/Linuxシステムで定期的なタスク実行を指定するための書式です。5つのフィールド（分 時 日 月 曜日）で構成され、*は「すべて」、*/nは「nごと」、a-bは「aからb」を意味します。" },
        { question: "曜日の指定方法は？", answer: "曜日は0-7で指定します（0と7は日曜日、1=月曜、2=火曜...6=土曜）。範囲指定（1-5で平日）やカンマ区切り（1,3,5で月水金）も可能です。" },
        { question: "crontabの設定方法は？", answer: "Linuxでは「crontab -e」コマンドでcronジョブを編集できます。各行に「Cron式 コマンド」の形式で記述します。例: 0 9 * * 1-5 /usr/bin/python3 backup.py" },
        { question: "秒単位の指定はできますか？", answer: "標準のcronは分単位が最小です。秒単位の実行が必要な場合は、systemdタイマーやNode.jsのnode-cronライブラリなど、拡張されたスケジューラーを使用してください。" },
      ]} />
      <AdBanner />
      <RelatedTools currentToolId="cron-parser" />
    </div>
  );
}
