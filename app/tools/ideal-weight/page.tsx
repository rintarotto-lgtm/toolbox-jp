"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface WeightStandard {
  label: string;
  bmi: number;
  color: string;
  bg: string;
  text: string;
  note: string;
}

const STANDARDS: WeightStandard[] = [
  { label: "モデル体重", bmi: 17, color: "bg-blue-400", bg: "bg-blue-50 border-blue-200", text: "text-blue-700", note: "BMI 17（健康リスクあり）" },
  { label: "シンデレラ体重", bmi: 18, color: "bg-sky-400", bg: "bg-sky-50 border-sky-200", text: "text-sky-700", note: "BMI 18（低体重）" },
  { label: "美容体重", bmi: 20, color: "bg-teal-500", bg: "bg-teal-50 border-teal-200", text: "text-teal-700", note: "BMI 20（スリム）" },
  { label: "標準体重", bmi: 22, color: "bg-green-500", bg: "bg-green-50 border-green-200", text: "text-green-700", note: "BMI 22（最も健康的）" },
  { label: "肥満の目安", bmi: 25, color: "bg-orange-400", bg: "bg-orange-50 border-orange-200", text: "text-orange-700", note: "BMI 25（肥満基準）" },
];

function getBmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "やせ（低体重）", color: "text-blue-600" };
  if (bmi < 25) return { label: "標準（普通体重）", color: "text-green-600" };
  if (bmi < 30) return { label: "肥満1度", color: "text-yellow-600" };
  if (bmi < 35) return { label: "肥満2度", color: "text-orange-600" };
  if (bmi < 40) return { label: "肥満3度", color: "text-red-600" };
  return { label: "肥満4度", color: "text-red-800" };
}

const HEIGHT_TABLE_ROWS = Array.from({ length: 11 }, (_, i) => 140 + i * 5);

export default function IdealWeight() {
  const [heightStr, setHeightStr] = useState("165");
  const [currentWeightStr, setCurrentWeightStr] = useState("");
  const [isFemale, setIsFemale] = useState(false);

  const height = parseFloat(heightStr) || 0;
  const currentWeight = parseFloat(currentWeightStr) || 0;

  const result = useMemo(() => {
    if (height <= 0) return null;
    const hm = height / 100;
    const h2 = hm * hm;

    const standards = STANDARDS.map((s) => ({
      ...s,
      weight: h2 * s.bmi,
    }));

    let currentBmi: number | null = null;
    let currentCategory: { label: string; color: string } | null = null;
    let diffToStandard: number | null = null;
    let diffToBeauty: number | null = null;
    let monthsToStandard: number | null = null;

    if (currentWeight > 0) {
      currentBmi = currentWeight / h2;
      currentCategory = getBmiCategory(currentBmi);
      const standardWeight = h2 * 22;
      const beautyWeight = h2 * 20;
      diffToStandard = currentWeight - standardWeight;
      diffToBeauty = currentWeight - beautyWeight;
      monthsToStandard = Math.abs(diffToStandard) / 1;
    }

    // Gauge: map weight between BMI17 and BMI30 to 0-100%
    let gaugePercent: number | null = null;
    if (currentWeight > 0) {
      const minW = h2 * 17;
      const maxW = h2 * 30;
      gaugePercent = Math.min(100, Math.max(0, ((currentWeight - minW) / (maxW - minW)) * 100));
    }

    return { standards, currentBmi, currentCategory, diffToStandard, diffToBeauty, monthsToStandard, gaugePercent, hm, h2 };
  }, [height, currentWeight]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">⚖️</span>
          <h1 className="text-2xl font-bold">理想体重・標準体重計算</h1>
        </div>
        <p className="text-teal-100 text-sm">
          身長から標準体重・美容体重・シンデレラ体重などを一括計算します。
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              身長（cm）
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="140"
                max="200"
                step="0.5"
                value={height || 165}
                onChange={(e) => setHeightStr(e.target.value)}
                className="flex-1 accent-teal-500"
              />
              <input
                type="number"
                value={heightStr}
                onChange={(e) => setHeightStr(e.target.value)}
                min="100"
                max="250"
                step="0.1"
                className="w-20 p-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              性別
            </label>
            <div className="flex rounded-lg overflow-hidden border border-gray-300 h-10">
              <button
                onClick={() => setIsFemale(false)}
                className={`flex-1 text-sm font-medium transition-colors ${!isFemale ? "bg-teal-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                男性
              </button>
              <button
                onClick={() => setIsFemale(true)}
                className={`flex-1 text-sm font-medium transition-colors ${isFemale ? "bg-teal-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >
                女性
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            現在の体重（kg）<span className="text-gray-400 font-normal ml-1">任意</span>
          </label>
          <input
            type="number"
            value={currentWeightStr}
            onChange={(e) => setCurrentWeightStr(e.target.value)}
            placeholder="例：58"
            min="20"
            max="300"
            step="0.1"
            className="w-full sm:w-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          />
        </div>

        {/* Weight standards grid */}
        {result && (
          <>
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">各種体重の目安（身長 {height}cm）</h2>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {result.standards.map((s) => (
                  <div key={s.label} className={`border rounded-lg p-3 text-center ${s.bg}`}>
                    <div className={`text-xs font-medium mb-1 ${s.text}`}>{s.label}</div>
                    <div className={`text-xl font-bold ${s.text}`}>{s.weight.toFixed(1)}<span className="text-xs ml-0.5">kg</span></div>
                    <div className="text-xs text-gray-400 mt-1">{s.note}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current weight analysis */}
            {currentWeight > 0 && result.currentBmi !== null && result.currentCategory && (
              <>
                {/* Gauge */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">現在の体重の位置</h3>
                  <div className="relative">
                    <div className="flex h-4 rounded-full overflow-hidden">
                      <div className="bg-blue-300" style={{ width: "20%" }} title="モデル〜シンデレラ" />
                      <div className="bg-teal-300" style={{ width: "20%" }} title="シンデレラ〜美容" />
                      <div className="bg-green-400" style={{ width: "20%" }} title="美容〜標準" />
                      <div className="bg-yellow-400" style={{ width: "20%" }} title="標準〜肥満目安" />
                      <div className="bg-orange-400" style={{ width: "20%" }} title="肥満" />
                    </div>
                    {result.gaugePercent !== null && (
                      <>
                        <div
                          className="absolute top-0 w-1 h-6 bg-gray-900 -translate-x-1/2 -mt-1"
                          style={{ left: `${result.gaugePercent}%` }}
                        />
                        <div
                          className="absolute top-7 text-xs font-bold text-gray-800 -translate-x-1/2 whitespace-nowrap"
                          style={{ left: `${result.gaugePercent}%` }}
                        >
                          {currentWeight}kg
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-8">
                    <span>BMI17</span>
                    <span>BMI20</span>
                    <span>BMI22</span>
                    <span>BMI25</span>
                    <span>BMI30</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-teal-600">{result.currentBmi.toFixed(1)}</div>
                    <div className="text-xs text-gray-500 mt-1">現在のBMI</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className={`text-base font-bold ${result.currentCategory.color}`}>{result.currentCategory.label}</div>
                    <div className="text-xs text-gray-500 mt-1">判定</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-base font-bold text-gray-800">
                      {result.diffToStandard !== null && (
                        <>
                          {result.diffToStandard > 0 ? "+" : ""}
                          {result.diffToStandard.toFixed(1)}kg
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">標準体重との差</div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-base font-bold text-gray-800">
                      {result.diffToBeauty !== null && (
                        <>
                          {result.diffToBeauty > 0 ? "+" : ""}
                          {result.diffToBeauty.toFixed(1)}kg
                        </>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">美容体重との差</div>
                  </div>
                </div>

                {result.diffToStandard !== null && Math.abs(result.diffToStandard) >= 0.5 && (
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-sm text-teal-800">
                    <span className="font-bold">目安期間：</span>
                    標準体重まで {Math.abs(result.diffToStandard).toFixed(1)}kg
                    {result.diffToStandard > 0 ? "の減量" : "の増量"}が必要です。
                    健康的なペース（月1kg）で約
                    <span className="font-bold"> {result.monthsToStandard?.toFixed(1)} ヶ月</span>が目安です。
                  </div>
                )}
              </>
            )}

            {/* Height table */}
            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-3">身長別 標準体重一覧</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-600">身長</th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-medium text-blue-600">シンデレラ<br /><span className="text-xs font-normal">BMI18</span></th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-medium text-teal-600">美容<br /><span className="text-xs font-normal">BMI20</span></th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-medium text-green-600">標準<br /><span className="text-xs font-normal">BMI22</span></th>
                      <th className="border border-gray-200 px-3 py-2 text-center font-medium text-orange-500">肥満基準<br /><span className="text-xs font-normal">BMI25</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {HEIGHT_TABLE_ROWS.map((h) => {
                      const hm = h / 100;
                      const h2 = hm * hm;
                      const isCurrentHeight = Math.round(height / 5) * 5 === h;
                      return (
                        <tr key={h} className={isCurrentHeight ? "bg-teal-50 font-semibold" : "hover:bg-gray-50"}>
                          <td className="border border-gray-200 px-3 py-2 text-gray-700">{h}cm</td>
                          <td className="border border-gray-200 px-3 py-2 text-center text-blue-700">{(h2 * 18).toFixed(1)}kg</td>
                          <td className="border border-gray-200 px-3 py-2 text-center text-teal-700">{(h2 * 20).toFixed(1)}kg</td>
                          <td className="border border-gray-200 px-3 py-2 text-center text-green-700">{(h2 * 22).toFixed(1)}kg</td>
                          <td className="border border-gray-200 px-3 py-2 text-center text-orange-600">{(h2 * 25).toFixed(1)}kg</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">理想体重・標準体重計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          身長を入力するだけで標準体重（BMI22）・美容体重（BMI20）・シンデレラ体重（BMI18）・モデル体重（BMI17）・肥満基準（BMI25）を一覧表示します。
          現在の体重を入力すると、現在のBMI判定・各基準体重との差・目標達成までの目安期間も表示されます。
          ダイエットや健康管理の目標設定にご活用ください。
        </p>
        <p className="text-xs text-gray-400 mt-3">
          ※シンデレラ体重・モデル体重は医学的に推奨される体重ではありません。健康維持を優先した体重管理をお勧めします。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "標準体重の計算方法は？",
            answer:
              "標準体重 = 身長(m)² × 22で計算します。身長170cmなら1.7² × 22 = 63.6kgが標準体重です。BMI22が統計的に最も病気になりにくいとされています。",
          },
          {
            question: "美容体重とシンデレラ体重の違いは？",
            answer:
              "美容体重はBMI20を基準とした体重で外見的にスリムに見えるとされる体重です。シンデレラ体重はBMI18を基準とした体重で、医学的には「低体重」に相当し健康リスクがある場合もあります。",
          },
          {
            question: "理想体重を達成するための期間は？",
            answer:
              "健康的なペースは月1〜2kgの減量（1日約500〜1,000kcalの赤字）です。急激な減量は筋肉量の低下や栄養不足のリスクがあります。",
          },
          {
            question: "筋肉質な人は体重が重くても問題ないですか？",
            answer:
              "BMIは体重と身長のみから計算するため、筋肉量を反映しません。筋肉質な人はBMIが高くても体脂肪率が低く健康な場合があります。体組成（体脂肪率・筋肉量）も合わせて確認することが重要です。",
          },
        ]}
      />

      <RelatedTools currentToolId="ideal-weight" />
    </div>
  );
}
