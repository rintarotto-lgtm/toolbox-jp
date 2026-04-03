"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

// Approximate Japanese CPI index (base = 2024 = 100)
// Source: approximate relative CPI values for historical comparison
const JAPAN_CPI: Record<number, number> = {
  1990: 55.0,
  1991: 57.0,
  1992: 58.2,
  1993: 59.0,
  1994: 59.4,
  1995: 59.5,
  1996: 59.8,
  1997: 61.2,
  1998: 61.5,
  1999: 61.1,
  2000: 60.8,
  2001: 60.4,
  2002: 59.8,
  2003: 59.5,
  2004: 59.5,
  2005: 59.3,
  2006: 59.6,
  2007: 59.9,
  2008: 61.0,
  2009: 60.2,
  2010: 59.8,
  2011: 59.8,
  2012: 59.8,
  2013: 60.2,
  2014: 62.0,
  2015: 62.8,
  2016: 62.7,
  2017: 63.2,
  2018: 63.9,
  2019: 64.4,
  2020: 64.2,
  2021: 64.4,
  2022: 67.0,
  2023: 70.5,
  2024: 100.0,
};

type Mode = "future" | "past";

const PAST_YEARS = Array.from({ length: 35 }, (_, i) => 1990 + i);

export default function InflationCalc() {
  const [mode, setMode] = useState<Mode>("future");

  // Future mode
  const [amount, setAmount] = useState("100");
  const [inflationRate, setInflationRate] = useState(2);
  const [years, setYears] = useState(20);

  // Past mode
  const [pastAmount, setPastAmount] = useState("100");
  const [pastYear, setPastYear] = useState(2000);

  // Comparison
  const [showComparison, setShowComparison] = useState(false);

  const futureResult = useMemo(() => {
    const a = parseFloat(amount);
    if (isNaN(a) || a <= 0 || years <= 0) return null;

    const r = inflationRate / 100;
    // Future nominal needed to maintain same purchasing power
    const futureNominal = a * Math.pow(1 + r, years);
    // Real value of current savings (purchasing power in today's yen)
    const realValue = a / Math.pow(1 + r, years);
    const realLoss = ((a - realValue) / a) * 100;

    // Year-by-year table (every 5 years)
    const table: { year: number; nominal: number; real: number }[] = [];
    for (let y = 0; y <= years; y += 5) {
      if (y === 0) {
        table.push({ year: y, nominal: a, real: a });
        continue;
      }
      table.push({
        year: y,
        nominal: a * Math.pow(1 + r, y),
        real: a / Math.pow(1 + r, y),
      });
    }
    if (years % 5 !== 0) {
      table.push({
        year: years,
        nominal: futureNominal,
        real: realValue,
      });
    }

    // Savings vs investment comparison
    const savingsRate = 0.0001; // 0.01%
    const investRate = 0.03; // 3%
    const savingsNominal = a * Math.pow(1 + savingsRate, years);
    const savingsReal = savingsNominal / Math.pow(1 + r, years);
    const investNominal = a * Math.pow(1 + investRate, years);
    const investReal = investNominal / Math.pow(1 + r, years);

    return {
      futureNominal,
      realValue,
      realLoss,
      table,
      savingsNominal,
      savingsReal,
      investNominal,
      investReal,
    };
  }, [amount, inflationRate, years]);

  const pastResult = useMemo(() => {
    const a = parseFloat(pastAmount);
    if (isNaN(a) || a <= 0) return null;
    const cpiPast = JAPAN_CPI[pastYear];
    const cpiNow = JAPAN_CPI[2024];
    if (!cpiPast) return null;
    const presentValue = a * (cpiNow / cpiPast);
    const changeRate = ((cpiNow - cpiPast) / cpiPast) * 100;
    return { presentValue, changeRate, cpiPast, cpiNow };
  }, [pastAmount, pastYear]);

  const tabs: { id: Mode; label: string }[] = [
    { id: "future", label: "将来価値計算" },
    { id: "past", label: "過去価値計算" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-red-500 to-orange-600 text-white p-6 mb-6 flex items-center gap-4">
        <span className="text-4xl">📊</span>
        <div>
          <h1 className="text-2xl font-bold">インフレ計算ツール</h1>
          <p className="text-red-100 text-sm mt-1">
            物価上昇シミュレーター・購買力・資産価値計算
          </p>
        </div>
      </div>

      <AdBanner />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 mt-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              mode === t.id
                ? "border-red-500 text-red-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Future mode */}
      {mode === "future" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                現在の金額（万円）
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="100"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                計算期間（年）: {years}年後
              </label>
              <input
                type="range"
                min={1}
                max={50}
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="w-full accent-red-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                <span>1年</span>
                <span>50年</span>
              </div>
            </div>
          </div>

          {/* Inflation rate */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              インフレ率（%/年）: {inflationRate}%
            </label>
            <input
              type="range"
              min={0}
              max={10}
              step={0.1}
              value={inflationRate}
              onChange={(e) => setInflationRate(parseFloat(e.target.value))}
              className="w-full accent-red-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>0%</span>
              <span>10%</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: "日銀目標 2%", value: 2 },
                { label: "現在水準 3%", value: 3 },
                { label: "高インフレ 5%", value: 5 },
              ].map((p) => (
                <button
                  key={p.value}
                  onClick={() => setInflationRate(p.value)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    inflationRate === p.value
                      ? "bg-red-500 text-white border-red-500"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-red-300 hover:text-red-600"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {futureResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">
                    {years}年後に同じ購買力を保つために必要な金額
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {futureResult.futureNominal.toFixed(1)}万円
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">
                    現在の{amount}万円の{years}年後の実質価値
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    {futureResult.realValue.toFixed(1)}万円
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">実質価値の目減り</div>
                  <div className="text-2xl font-bold text-yellow-700">
                    -{futureResult.realLoss.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Table */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">年別シミュレーション</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-3 py-2 text-left text-gray-600">経過年数</th>
                        <th className="border border-gray-200 px-3 py-2 text-right text-gray-600">
                          同じ生活に必要な名目金額
                        </th>
                        <th className="border border-gray-200 px-3 py-2 text-right text-gray-600">
                          現在の購買力（実質価値）
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {futureResult.table.map((row) => (
                        <tr key={row.year} className={row.year === 0 ? "bg-gray-50" : "hover:bg-gray-50"}>
                          <td className="border border-gray-200 px-3 py-2 text-gray-600">
                            {row.year === 0 ? "現在" : `${row.year}年後`}
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-right font-medium text-gray-800">
                            {row.nominal.toFixed(1)}万円
                          </td>
                          <td className="border border-gray-200 px-3 py-2 text-right font-medium text-red-600">
                            {row.real.toFixed(1)}万円
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Savings vs Investment */}
              <div>
                <button
                  onClick={() => setShowComparison(!showComparison)}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  {showComparison ? "▲" : "▼"} 貯金 vs 投資の比較を{showComparison ? "閉じる" : "表示"}
                </button>
                {showComparison && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="text-xs text-gray-500 mb-1">普通預金（年0.01%）{years}年後</div>
                      <div className="text-lg font-bold text-gray-700">
                        名目: {futureResult.savingsNominal.toFixed(1)}万円
                      </div>
                      <div className="text-sm text-red-600 font-medium">
                        実質: {futureResult.savingsReal.toFixed(1)}万円
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-xs text-gray-500 mb-1">投資（年3%想定）{years}年後</div>
                      <div className="text-lg font-bold text-green-700">
                        名目: {futureResult.investNominal.toFixed(1)}万円
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        実質: {futureResult.investReal.toFixed(1)}万円
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Past mode */}
      {mode === "past" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                過去の金額（万円）
              </label>
              <input
                type="number"
                value={pastAmount}
                onChange={(e) => setPastAmount(e.target.value)}
                placeholder="100"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                過去の年
              </label>
              <select
                value={pastYear}
                onChange={(e) => setPastYear(parseInt(e.target.value))}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                {PAST_YEARS.map((y) => (
                  <option key={y} value={y}>{y}年</option>
                ))}
              </select>
            </div>
          </div>

          {pastResult && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-xs text-gray-500 mb-1">
                  {pastYear}年の {pastAmount}万円 → 2024年現在の価値
                </div>
                <div className="text-3xl font-bold text-red-600">
                  {pastResult.presentValue.toFixed(1)}万円
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  約{pastResult.changeRate.toFixed(1)}%の物価上昇
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">計算根拠（参考CPI）</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>{pastYear}年 CPI: {pastResult.cpiPast.toFixed(1)}</div>
                  <div>2024年 CPI: {pastResult.cpiNow.toFixed(1)}</div>
                  <div>物価上昇率: 約{pastResult.changeRate.toFixed(1)}%</div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  ※ CPIデータは概算値です。日本銀行・総務省統計局の公式データとは異なる場合があります。
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">インフレ計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          「将来価値計算」では、現在の金額がインフレによって将来どれだけの購買力になるかをシミュレーションします。
          貯金の実質価値がどれだけ目減りするかも一目でわかります。
          「過去価値計算」では、過去の金額を現在の物価水準に換算できます。日本のCPI（消費者物価指数）の概算データを使用しています。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "インフレとは何ですか？",
            answer:
              "物価が全体的に上昇し、お金の価値（購買力）が下がる経済現象です。年率2%のインフレが続くと、36年後には現在の100万円の購買力は約50万円相当になります。",
          },
          {
            question: "日本のインフレ率は現在どのくらいですか？",
            answer:
              "2024年の日本の消費者物価指数（CPI）上昇率は2〜3%程度で推移しています。日銀の目標インフレ率は2%です。",
          },
          {
            question: "インフレで貯金はどうなりますか？",
            answer:
              "インフレが続くと預金の実質価値が下がります。年2%のインフレで金利0.1%の場合、実質的に毎年約1.9%ずつ貯金の価値が減ることになります。",
          },
          {
            question: "インフレ対策としての資産運用は？",
            answer:
              "株式・不動産・物価連動国債（JGB）・金（ゴールド）などはインフレに強いとされています。現金だけで持ち続けると実質価値が下がるリスクがあります。",
          },
        ]}
      />

      <RelatedTools currentToolId="inflation-calc" />

      <p className="text-xs text-gray-400 text-center mt-8">
        ※ 本ツールの計算結果は参考値です。実際のインフレ率は変動します。投資・資産運用の判断は専門家にご相談ください。
      </p>
    </div>
  );
}
