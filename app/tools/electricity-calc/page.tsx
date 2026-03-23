"use client";

import { useState, useMemo, useCallback } from "react";
import AdBanner from "@/components/AdBanner";

/* ─── Types ─── */
interface Preset {
  name: string;
  emoji: string;
  watt: number;
  defaultHours: number;
}

interface ApplianceEntry {
  id: number;
  name: string;
  emoji: string;
  watt: number;
  hours: number;
}

/* ─── Presets ─── */
const PRESETS: Preset[] = [
  { name: "エアコン(暖房)", emoji: "🔥", watt: 500, defaultHours: 8 },
  { name: "エアコン(冷房)", emoji: "❄️", watt: 350, defaultHours: 8 },
  { name: "ドライヤー", emoji: "💇", watt: 1200, defaultHours: 0.25 },
  { name: "電子レンジ", emoji: "📡", watt: 1000, defaultHours: 0.5 },
  { name: "テレビ", emoji: "📺", watt: 150, defaultHours: 5 },
  { name: "冷蔵庫", emoji: "🧊", watt: 100, defaultHours: 24 },
  { name: "洗濯機", emoji: "🫧", watt: 400, defaultHours: 1 },
  { name: "PC", emoji: "💻", watt: 200, defaultHours: 8 },
  { name: "照明(LED)", emoji: "💡", watt: 10, defaultHours: 8 },
  { name: "炊飯器", emoji: "🍚", watt: 700, defaultHours: 1 },
];

const DEFAULT_RATE = 31;

/* ─── Helpers ─── */
function calcCost(watt: number, hours: number, rate: number) {
  return (watt / 1000) * hours * rate;
}

function formatYen(n: number): string {
  if (n < 1) return `¥${n.toFixed(2)}`;
  return `¥${Math.round(n).toLocaleString()}`;
}

/* ─── Tabs ─── */
type TabId = "single" | "monthly" | "saving";
const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: "single", label: "家電別", emoji: "⚡" },
  { id: "monthly", label: "月額シミュレーション", emoji: "📊" },
  { id: "saving", label: "節約シミュレーション", emoji: "💰" },
];

/* ─── Component ─── */
export default function ElectricityCalc() {
  const [tab, setTab] = useState<TabId>("single");
  const [rate, setRate] = useState(DEFAULT_RATE);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        ⚡ 電気代計算ツール
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        この家電、1ヶ月の電気代いくら？
      </p>

      {/* Rate input (shared) */}
      <div className="mb-5 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <label className="text-sm font-medium text-amber-800 whitespace-nowrap">
          電気料金単価
        </label>
        <input
          type="number"
          min={1}
          step={0.1}
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
          className="w-20 rounded-md border border-amber-300 px-2 py-1 text-center text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <span className="text-sm text-amber-700">¥/kWh</span>
        <span className="text-xs text-amber-500 ml-auto hidden sm:inline">
          2026年全国平均目安: ¥31
        </span>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "single" && <SingleMode rate={rate} />}
      {tab === "monthly" && <MonthlyMode rate={rate} />}
      {tab === "saving" && <SavingMode rate={rate} />}

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">
          電気代計算ツールの使い方
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          家電の消費電力(W)と1日の使用時間を入力すると、1時間・1日・1ヶ月・1年の電気代を瞬時に計算します。
          プリセットボタンで主要な家電をワンタップで選択可能。月額シミュレーションでは複数の家電を追加して合計電気代を把握でき、
          節約シミュレーションでは古い家電を買い替えた場合の年間節約額と回収期間を計算できます。
          電気料金単価は2026年全国平均目安の¥31/kWhをデフォルトとしていますが、ご契約の料金プランに合わせて変更できます。
        </p>
      </section>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Mode 1: 家電別の電気代計算
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SingleMode({ rate }: { rate: number }) {
  const [watt, setWatt] = useState(500);
  const [hours, setHours] = useState(8);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(
    "エアコン(暖房)"
  );

  const handlePreset = (p: Preset) => {
    setWatt(p.watt);
    setHours(p.defaultHours);
    setSelectedPreset(p.name);
  };

  const costPerHour = calcCost(watt, 1, rate);
  const costPerDay = calcCost(watt, hours, rate);
  const costPerMonth = costPerDay * 30;
  const costPerYear = costPerDay * 365;

  return (
    <div className="space-y-5">
      {/* Preset buttons */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          家電をタップで選択
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => handlePreset(p)}
              className={`px-3 py-2 rounded-lg text-sm transition-all border ${
                selectedPreset === p.name
                  ? "bg-amber-100 border-amber-400 text-amber-800 shadow-sm"
                  : "bg-white border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50"
              }`}
            >
              {p.emoji} {p.name}
              <span className="ml-1 text-xs text-gray-400">{p.watt}W</span>
            </button>
          ))}
        </div>
      </div>

      {/* Watt input */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            消費電力 (W)
          </label>
          <input
            type="number"
            min={0}
            value={watt}
            onChange={(e) => {
              setWatt(parseFloat(e.target.value) || 0);
              setSelectedPreset(null);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Hours input + slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            1日の使用時間:{" "}
            <span className="text-amber-600 font-bold">{hours}時間</span>
          </label>
          <input
            type="range"
            min={0}
            max={24}
            step={0.25}
            value={hours}
            onChange={(e) => setHours(parseFloat(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-3">
        <ResultCard label="1時間の電気代" value={formatYen(costPerHour)} sub />
        <ResultCard label="1日の電気代" value={formatYen(costPerDay)} sub />
        <ResultCard
          label="1ヶ月(30日)の電気代"
          value={formatYen(costPerMonth)}
          highlight
        />
        <ResultCard
          label="1年間の電気代"
          value={formatYen(costPerYear)}
          highlight
        />
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  highlight,
  sub,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  sub?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-4 text-center ${
        highlight
          ? "bg-amber-50 border-2 border-amber-300"
          : "bg-gray-50 border border-gray-200"
      }`}
    >
      <div
        className={`font-bold ${
          highlight ? "text-2xl text-amber-700" : "text-xl text-gray-800"
        } ${sub ? "text-lg" : ""}`}
      >
        {value}
      </div>
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Mode 2: 月々の電気代シミュレーション
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function MonthlyMode({ rate }: { rate: number }) {
  const [entries, setEntries] = useState<ApplianceEntry[]>([]);
  const [nextId, setNextId] = useState(1);
  const [customName, setCustomName] = useState("");
  const [customWatt, setCustomWatt] = useState("");

  const addPreset = useCallback(
    (p: Preset) => {
      setEntries((prev) => [
        ...prev,
        {
          id: nextId,
          name: `${p.emoji} ${p.name}`,
          emoji: p.emoji,
          watt: p.watt,
          hours: p.defaultHours,
        },
      ]);
      setNextId((n) => n + 1);
    },
    [nextId]
  );

  const addCustom = useCallback(() => {
    const w = parseFloat(customWatt);
    if (!customName.trim() || !w || w <= 0) return;
    setEntries((prev) => [
      ...prev,
      {
        id: nextId,
        name: `🔌 ${customName.trim()}`,
        emoji: "🔌",
        watt: w,
        hours: 1,
      },
    ]);
    setNextId((n) => n + 1);
    setCustomName("");
    setCustomWatt("");
  }, [nextId, customName, customWatt]);

  const updateHours = (id: number, hours: number) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, hours } : e))
    );
  };

  const removeEntry = (id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const sorted = useMemo(() => {
    return [...entries].sort(
      (a, b) =>
        calcCost(b.watt, b.hours, rate) * 30 -
        calcCost(a.watt, a.hours, rate) * 30
    );
  }, [entries, rate]);

  const totalMonthly = useMemo(
    () => sorted.reduce((sum, e) => sum + calcCost(e.watt, e.hours, rate) * 30, 0),
    [sorted, rate]
  );

  const maxCost = useMemo(
    () =>
      sorted.length > 0
        ? Math.max(...sorted.map((e) => calcCost(e.watt, e.hours, rate) * 30))
        : 1,
    [sorted, rate]
  );

  return (
    <div className="space-y-5">
      {/* Add from presets */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">
          家電を追加（タップで追加）
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => addPreset(p)}
              className="px-3 py-2 rounded-lg text-sm bg-white border border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50 transition-all"
            >
              {p.emoji} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Custom appliance */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">家電名</label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="例: 食洗機"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <div className="w-24">
          <label className="block text-xs text-gray-500 mb-1">W数</label>
          <input
            type="number"
            value={customWatt}
            onChange={(e) => setCustomWatt(e.target.value)}
            placeholder="W"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
        <button
          onClick={addCustom}
          className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
        >
          追加
        </button>
      </div>

      {/* Entries list */}
      {sorted.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {sorted.map((entry) => {
            const monthlyCost = calcCost(entry.watt, entry.hours, rate) * 30;
            const barWidth = maxCost > 0 ? (monthlyCost / maxCost) * 100 : 0;

            return (
              <div key={entry.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {entry.name}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {entry.watt}W
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm font-bold text-amber-700">
                      {formatYen(monthlyCost)}/月
                    </span>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={24}
                    step={0.25}
                    value={entry.hours}
                    onChange={(e) =>
                      updateHours(entry.id, parseFloat(e.target.value))
                    }
                    className="flex-1 accent-amber-500"
                  />
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {entry.hours}h/日
                  </span>
                </div>
                {/* Bar chart */}
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-300"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Total */}
      {sorted.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 text-center">
          <div className="text-xs text-amber-600 mb-1">
            月間合計電気代（{sorted.length}台）
          </div>
          <div className="text-3xl font-bold text-amber-700">
            {formatYen(totalMonthly)}
            <span className="text-base font-normal text-amber-500">/月</span>
          </div>
          <div className="text-sm text-amber-600 mt-1">
            年間: {formatYen(totalMonthly * 12)}
          </div>
        </div>
      )}

      {sorted.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          上のボタンから家電を追加してください
        </div>
      )}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Mode 3: 電気代の節約シミュレーション
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SavingMode({ rate }: { rate: number }) {
  const [oldWatt, setOldWatt] = useState(1000);
  const [newWatt, setNewWatt] = useState(600);
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [purchasePrice, setPurchasePrice] = useState(50000);

  const oldAnnual = calcCost(oldWatt, hoursPerDay, rate) * 365;
  const newAnnual = calcCost(newWatt, hoursPerDay, rate) * 365;
  const annualSaving = oldAnnual - newAnnual;
  const monthlySaving = annualSaving / 12;
  const paybackYears =
    annualSaving > 0 ? purchasePrice / annualSaving : Infinity;

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        古い家電を新しい省エネ家電に買い替えた場合の節約額と、購入費用の回収期間を計算します。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Old appliance */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h3 className="text-sm font-bold text-gray-700 flex items-center gap-1">
            🔴 古い家電
          </h3>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              消費電力 (W)
            </label>
            <input
              type="number"
              min={0}
              value={oldWatt}
              onChange={(e) => setOldWatt(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="text-sm text-gray-500">
            年間電気代:{" "}
            <span className="font-bold text-gray-800">
              {formatYen(oldAnnual)}
            </span>
          </div>
        </div>

        {/* New appliance */}
        <div className="bg-white rounded-xl border border-green-200 p-4 space-y-3">
          <h3 className="text-sm font-bold text-green-700 flex items-center gap-1">
            🟢 新しい家電
          </h3>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              消費電力 (W)
            </label>
            <input
              type="number"
              min={0}
              value={newWatt}
              onChange={(e) => setNewWatt(parseFloat(e.target.value) || 0)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>
          <div className="text-sm text-gray-500">
            年間電気代:{" "}
            <span className="font-bold text-green-700">
              {formatYen(newAnnual)}
            </span>
          </div>
        </div>
      </div>

      {/* Shared inputs */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            1日の使用時間:{" "}
            <span className="text-amber-600 font-bold">{hoursPerDay}時間</span>
          </label>
          <input
            type="range"
            min={0}
            max={24}
            step={0.5}
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(parseFloat(e.target.value))}
            className="w-full accent-amber-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0h</span>
            <span>6h</span>
            <span>12h</span>
            <span>18h</span>
            <span>24h</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            新しい家電の購入価格 (¥)
          </label>
          <input
            type="number"
            min={0}
            step={1000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Results */}
      {annualSaving > 0 ? (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-700">
                {formatYen(monthlySaving)}
              </div>
              <div className="text-xs text-green-600 mt-1">月間節約額</div>
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-700">
                {formatYen(annualSaving)}
              </div>
              <div className="text-xs text-green-600 mt-1">年間節約額</div>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 text-center">
            <div className="text-xs text-amber-600 mb-1">購入費用の回収期間</div>
            <div className="text-3xl font-bold text-amber-700">
              {paybackYears < 100
                ? paybackYears < 1
                  ? `約${Math.round(paybackYears * 12)}ヶ月`
                  : `約${paybackYears.toFixed(1)}年`
                : "−"}
            </div>
            {paybackYears < 100 && (
              <div className="text-sm text-amber-600 mt-2">
                購入価格 {formatYen(purchasePrice)} ÷ 年間節約額{" "}
                {formatYen(annualSaving)}
              </div>
            )}
          </div>

          {/* Visual comparison bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              年間電気代の比較
            </p>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>🔴 古い家電</span>
                  <span>{formatYen(oldAnnual)}</span>
                </div>
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-full transition-all duration-500"
                    style={{ width: "100%" }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>🟢 新しい家電</span>
                  <span>{formatYen(newAnnual)}</span>
                </div>
                <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${oldAnnual > 0 ? (newAnnual / oldAnnual) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 text-center text-sm text-green-600 font-medium">
              消費電力 {oldWatt - newWatt > 0 ? `${oldWatt - newWatt}W` : "0W"}{" "}
              削減（
              {oldWatt > 0
                ? Math.round(((oldWatt - newWatt) / oldWatt) * 100)
                : 0}
              %カット）
            </div>
          </div>
        </div>
      ) : annualSaving === 0 && oldWatt > 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          同じ消費電力のため節約効果はありません
        </div>
      ) : annualSaving < 0 ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
          <div className="text-red-600 text-sm">
            ⚠️
            新しい家電のほうが消費電力が高いため、電気代が年間
            <span className="font-bold">
              {formatYen(Math.abs(annualSaving))}
            </span>
            増加します
          </div>
        </div>
      ) : null}
    </div>
  );
}
