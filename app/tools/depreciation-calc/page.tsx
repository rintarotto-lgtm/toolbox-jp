"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/* ─── Types ─── */
type DepreciationMethod = "straight" | "declining";

interface AssetPreset {
  label: string;
  years: number;
}

interface YearRow {
  year: number;
  openingBook: number;
  depreciation: number;
  closingBook: number;
  accumulated: number;
}

/* ─── Constants ─── */
const ASSET_PRESETS: AssetPreset[] = [
  { label: "パソコン", years: 4 },
  { label: "スマホ", years: 2 },
  { label: "乗用車", years: 6 },
  { label: "軽自動車", years: 4 },
  { label: "建物", years: 30 },
];

const USEFUL_LIFE_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 10, 15, 20, 30, 40, 50];

const FAQ_ITEMS = [
  {
    q: "定額法と定率法の違いは何ですか？",
    a: "定額法は毎年同じ金額を償却する方法です。定率法は未償却残高に一定率をかけるため、初年度の償却額が大きく、年々減少します。個人事業主は原則定額法、法人は定率法も選択できます。",
  },
  {
    q: "パソコンの耐用年数は何年ですか？",
    a: "パソコン（サーバー以外）の法定耐用年数は4年です。ただし、10万円未満なら全額損金算入、30万円未満なら少額減価償却資産の特例（青色申告の中小企業）が使えます。",
  },
  {
    q: "車の減価償却はどう計算しますか？",
    a: "新車の法定耐用年数は普通乗用車6年、軽自動車4年です。中古車の場合は（法定耐用年数－経過年数）＋経過年数×0.2で計算します。事業使用割合に応じて按分が必要です。",
  },
  {
    q: "減価償却の計算で1円残す理由は何ですか？",
    a: "税法上、減価償却は帳簿価額が備忘価額（1円）になるまでしか行えません。完全に0円にすることはできないため、最終年度は1円を残した金額までしか償却できません。",
  },
];

/* ─── Calculation ─── */
function calcDepreciation(
  acquisitionCost: number,
  usefulLife: number,
  method: DepreciationMethod,
  businessRate: number
): YearRow[] {
  if (acquisitionCost <= 0 || usefulLife <= 0) return [];

  const rows: YearRow[] = [];
  let bookValue = acquisitionCost;
  const rate = businessRate / 100;

  if (method === "straight") {
    // 定額法: 取得価額 × (1/耐用年数)
    const annualDepr = Math.floor(acquisitionCost * (1 / usefulLife) * rate);

    for (let year = 1; year <= Math.min(usefulLife + 2, 50); year++) {
      if (bookValue <= 1) break;
      const opening = bookValue;
      let depr = annualDepr;
      // Last year: depreciate down to 1 yen
      if (opening - depr < 1) {
        depr = opening - 1;
      }
      depr = Math.max(0, depr);
      bookValue = opening - depr;
      const accumulated = acquisitionCost - bookValue;
      rows.push({
        year,
        openingBook: opening,
        depreciation: depr,
        closingBook: bookValue,
        accumulated,
      });
      if (bookValue <= 1) break;
    }
  } else {
    // 定率法 (200%定率法): 期首残高 × (1/耐用年数 × 2)
    const decliningRate = (1 / usefulLife) * 2;
    // 定額法切替点: 期首残高 × (1/残存年数) > 定率法償却額 のとき切替
    for (let year = 1; year <= 50; year++) {
      if (bookValue <= 1) break;
      const opening = bookValue;
      const remainingYears = usefulLife - year + 1;
      const straightLineDepr = remainingYears > 0
        ? Math.floor(opening * (1 / remainingYears) * rate)
        : 0;
      const decliningDepr = Math.floor(opening * decliningRate * rate);

      let depr: number;
      // Switch to straight-line when it gives larger deduction
      if (remainingYears > 0 && straightLineDepr >= decliningDepr) {
        depr = straightLineDepr;
      } else {
        depr = decliningDepr;
      }

      // Last: down to 1 yen
      if (opening - depr < 1) {
        depr = opening - 1;
      }
      depr = Math.max(0, depr);
      bookValue = opening - depr;
      const accumulated = acquisitionCost - bookValue;
      rows.push({
        year,
        openingBook: opening,
        depreciation: depr,
        closingBook: bookValue,
        accumulated,
      });
      if (bookValue <= 1) break;
    }
  }

  return rows;
}

/* ─── Formatters ─── */
function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

/* ─── Component ─── */
export default function DepreciationCalc() {
  const [acquisitionMan, setAcquisitionMan] = useState<string>("100");
  const [usefulLife, setUsefulLife] = useState<number>(4);
  const [method, setMethod] = useState<DepreciationMethod>("straight");
  const [businessRate, setBusinessRate] = useState<number>(100);

  const acquisitionCost = useMemo(
    () => (parseFloat(acquisitionMan) || 0) * 10_000,
    [acquisitionMan]
  );

  const rows = useMemo(
    () => calcDepreciation(acquisitionCost, usefulLife, method, businessRate),
    [acquisitionCost, usefulLife, method, businessRate]
  );

  const firstYearDepr = rows[0]?.depreciation ?? 0;
  const totalDepr = rows.reduce((s, r) => s + r.depreciation, 0);
  const yearsToFullDepr = rows.length;

  const handlePreset = (preset: AssetPreset) => {
    setUsefulLife(preset.years);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── Hero ─── */}
      <div className="bg-gradient-to-br from-slate-600 to-gray-700 rounded-2xl p-6 mb-8 text-white">
        <div className="text-4xl mb-2">📉</div>
        <h1 className="text-2xl font-bold mb-1">減価償却計算シミュレーター</h1>
        <p className="text-slate-300 text-sm">
          定額法・定率法に対応。取得価額と耐用年数を入力するだけで年度別償却スケジュールを自動計算
        </p>
      </div>

      {/* ─── Input Card ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
        {/* Asset Presets */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">資産プリセット</p>
          <div className="flex flex-wrap gap-2">
            {ASSET_PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => handlePreset(p)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  usefulLife === p.years
                    ? "bg-slate-600 text-white border-slate-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-slate-500 hover:text-slate-600"
                }`}
              >
                {p.label}（{p.years}年）
              </button>
            ))}
          </div>
        </div>

        {/* 取得価額 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            取得価額
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              step={1}
              value={acquisitionMan}
              onChange={(e) => setAcquisitionMan(e.target.value)}
              className="w-40 border border-gray-300 rounded-xl px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
            <span className="text-gray-600 text-sm">万円</span>
            {acquisitionCost > 0 && (
              <span className="text-gray-400 text-xs">
                = {formatYen(acquisitionCost)}
              </span>
            )}
          </div>
        </div>

        {/* 耐用年数 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            耐用年数
          </label>
          <select
            value={usefulLife}
            onChange={(e) => setUsefulLife(Number(e.target.value))}
            className="border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white"
          >
            {USEFUL_LIFE_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>
        </div>

        {/* 償却方法 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            償却方法
          </label>
          <div className="flex gap-3">
            {(["straight", "declining"] as DepreciationMethod[]).map((m) => (
              <label
                key={m}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-colors ${
                  method === m
                    ? "border-slate-600 bg-slate-50 text-slate-700"
                    : "border-gray-200 text-gray-600 hover:border-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="method"
                  value={m}
                  checked={method === m}
                  onChange={() => setMethod(m)}
                  className="accent-slate-600"
                />
                <span className="text-sm font-medium">
                  {m === "straight" ? "定額法" : "定率法（200%定率法）"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 事業使用割合 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            事業使用割合：
            <span className="text-slate-600 font-bold ml-1">{businessRate}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={businessRate}
            onChange={(e) => setBusinessRate(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-slate-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* ─── Key Metrics ─── */}
      {rows.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">初年度償却費</p>
              <p className="text-lg font-bold text-slate-700">
                {formatYen(firstYearDepr)}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">総償却費</p>
              <p className="text-lg font-bold text-slate-700">
                {formatYen(totalDepr)}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">完全償却まで</p>
              <p className="text-lg font-bold text-slate-700">
                {yearsToFullDepr}年
              </p>
            </div>
          </div>

          <AdBanner />

          {/* ─── Depreciation Table ─── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              年度別償却スケジュール
            </h2>
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 text-xs">
                    <th className="text-right py-2 px-2 font-medium">年度</th>
                    <th className="text-right py-2 px-2 font-medium">期首帳簿価額</th>
                    <th className="text-right py-2 px-2 font-medium">当年償却費</th>
                    <th className="text-right py-2 px-2 font-medium">期末帳簿価額</th>
                    <th className="text-right py-2 px-2 font-medium">累計償却費</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.year}
                      className="border-b border-gray-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-2 px-2 text-right text-gray-600">
                        {row.year}年目
                      </td>
                      <td className="py-2 px-2 text-right text-gray-700">
                        {formatYen(row.openingBook)}
                      </td>
                      <td className="py-2 px-2 text-right font-semibold text-slate-700">
                        {formatYen(row.depreciation)}
                      </td>
                      <td className="py-2 px-2 text-right text-gray-700">
                        {formatYen(row.closingBook)}
                      </td>
                      <td className="py-2 px-2 text-right text-gray-500">
                        {formatYen(row.accumulated)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <AdBanner />
        </>
      )}

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map(({ q, a }) => (
            <details
              key={q}
              className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
              <summary className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-slate-600 list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 ml-2 shrink-0">＋</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="depreciation-calc" />

      {/* ─── Disclaimer ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-6">
        ※ 本ツールの計算結果は概算です。正確な金額は専門家にご相談ください。
      </p>
    </div>
  );
}
