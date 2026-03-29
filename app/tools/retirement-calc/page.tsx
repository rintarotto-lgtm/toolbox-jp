"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";

const fmt = (n: number) => n.toLocaleString("ja-JP");

/** 退職所得控除 */
function retirementDeduction(years: number): number {
  if (years <= 0) return 0;
  if (years <= 20) return Math.max(400000 * years, 800000);
  return 8000000 + 700000 * (years - 20);
}

/** 所得税（累進課税） */
function incomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  if (taxableIncome <= 1950000) return taxableIncome * 0.05;
  if (taxableIncome <= 3300000) return taxableIncome * 0.1 - 97500;
  if (taxableIncome <= 6950000) return taxableIncome * 0.2 - 427500;
  if (taxableIncome <= 9000000) return taxableIncome * 0.23 - 636000;
  if (taxableIncome <= 18000000) return taxableIncome * 0.33 - 1536000;
  if (taxableIncome <= 40000000) return taxableIncome * 0.4 - 2796000;
  return taxableIncome * 0.45 - 4796000;
}

export default function RetirementCalc() {
  const [retirement, setRetirement] = useState(20000000);
  const [years, setYears] = useState(30);
  const [reason, setReason] = useState<"voluntary" | "involuntary">("voluntary");

  const calc = useMemo(() => {
    const deduction = retirementDeduction(years);
    // 自己都合は控除額そのまま、会社都合は同じ（簡略化）
    const taxableBase = Math.max(0, retirement - deduction);
    const retirementIncome = taxableBase * 0.5; // 退職所得 = 課税対象の1/2
    const incTax = incomeTax(retirementIncome);
    const reconstructionTax = incTax * 0.021;
    const residenceTax = retirementIncome * 0.1; // 住民税10%
    const totalTax = incTax + reconstructionTax + residenceTax;
    const takeHome = retirement - totalTax;
    const takeHomeRate = retirement > 0 ? (takeHome / retirement) * 100 : 0;
    return { deduction, taxableBase, retirementIncome, incTax, reconstructionTax, residenceTax, totalTax, takeHome, takeHomeRate };
  }, [retirement, years, reason]);

  // 勤続年数別比較テーブル
  const comparisonRows = [10, 15, 20, 25, 30, 35, 40].map(y => {
    const ded = retirementDeduction(y);
    const base = Math.max(0, retirement - ded);
    const inc = base * 0.5;
    const tax = incomeTax(inc) * 1.021 + inc * 0.1;
    const take = retirement - tax;
    return { y, ded, take, rate: retirement > 0 ? (take / retirement) * 100 : 0 };
  });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">💼 退職金手取り計算ツール</h1>
        <p className="text-gray-500 mt-1">退職所得控除・所得税・住民税を引いた実際の手取りを計算します。</p>
      </div>

      <AdBanner />

      {/* 入力 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
        <h2 className="font-bold text-gray-900">入力情報</h2>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">退職金額</span>
            <span className="font-semibold text-gray-900">¥{fmt(retirement)}<span className="text-xs text-gray-400 ml-1">（{Math.round(retirement / 10000)}万円）</span></span>
          </div>
          <input type="range" min={500000} max={50000000} step={500000} value={retirement}
            onChange={e => setRetirement(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-teal-500" />
          <div className="flex justify-between text-xs text-gray-400"><span>50万</span><span>5,000万</span></div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[500, 1000, 1500, 2000, 3000, 5000].map(v => (
              <button key={v} onClick={() => setRetirement(v * 10000)}
                className={`px-3 py-1 rounded-full text-xs border transition-all ${retirement === v * 10000 ? "bg-teal-100 border-teal-400 text-teal-700" : "border-gray-200 text-gray-600 hover:border-teal-300"}`}>
                {v}万
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">勤続年数</span>
            <span className="font-semibold text-gray-900">{years}年</span>
          </div>
          <input type="range" min={1} max={45} step={1} value={years}
            onChange={e => setYears(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-teal-500" />
          <div className="flex justify-between text-xs text-gray-400"><span>1年</span><span>45年</span></div>
        </div>

        <div className="space-y-2">
          <span className="text-sm text-gray-600">退職理由</span>
          <div className="flex gap-3">
            {[{ v: "voluntary", l: "自己都合" }, { v: "involuntary", l: "会社都合・定年" }].map(({ v, l }) => (
              <button key={v} onClick={() => setReason(v as "voluntary" | "involuntary")}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${reason === v ? "bg-teal-50 border-teal-400 text-teal-700" : "border-gray-200 text-gray-600 hover:border-teal-300"}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ヒーロー結果 */}
      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 text-center border border-teal-100">
        <p className="text-sm text-teal-600 font-medium">退職金の手取り額</p>
        <p className="text-4xl sm:text-5xl font-bold text-teal-600 mt-2">¥{fmt(Math.round(calc.takeHome))}</p>
        <p className="text-gray-500 mt-1 text-sm">約{Math.round(calc.takeHome / 10000)}万円（手取り率 {calc.takeHomeRate.toFixed(1)}%）</p>
        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-teal-200">
          <div>
            <p className="text-xs text-gray-500">退職所得控除</p>
            <p className="font-bold text-green-600">¥{fmt(calc.deduction)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">税金合計</p>
            <p className="font-bold text-red-500">¥{fmt(Math.round(calc.totalTax))}</p>
          </div>
        </div>
      </div>

      {/* 税金内訳 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
        <h2 className="font-bold text-gray-900">税金の内訳</h2>
        {[
          { label: "退職所得控除", value: calc.deduction, note: `勤続${years}年`, color: "text-green-600", bg: "bg-green-50" },
          { label: "課税退職所得（控除後×1/2）", value: Math.round(calc.retirementIncome), note: "", color: "text-gray-700", bg: "bg-gray-50" },
          { label: "所得税", value: Math.round(calc.incTax), note: "", color: "text-orange-600", bg: "bg-orange-50" },
          { label: "復興特別所得税", value: Math.round(calc.reconstructionTax), note: "所得税×2.1%", color: "text-orange-400", bg: "bg-orange-50" },
          { label: "住民税", value: Math.round(calc.residenceTax), note: "課税所得×10%", color: "text-blue-600", bg: "bg-blue-50" },
        ].map(({ label, value, note, color, bg }) => (
          <div key={label} className={`flex justify-between items-center rounded-lg px-3 py-2 ${bg}`}>
            <div>
              <span className="text-sm text-gray-700">{label}</span>
              {note && <span className="text-xs text-gray-400 ml-2">{note}</span>}
            </div>
            <span className={`font-bold text-sm ${color}`}>{label.includes("控除") ? "-" : ""}¥{fmt(value)}</span>
          </div>
        ))}
        <div className="flex justify-between items-center rounded-lg px-3 py-2 bg-teal-50 border border-teal-200">
          <span className="text-sm font-bold text-gray-800">手取り額</span>
          <span className="font-bold text-teal-600">¥{fmt(Math.round(calc.takeHome))}</span>
        </div>
      </div>

      {/* 勤続年数比較 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900 mb-3">勤続年数別の手取り比較（退職金¥{fmt(Math.round(retirement / 10000))}万円）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500 font-medium">勤続年数</th>
                <th className="text-right py-2 px-2 text-gray-500 font-medium">控除額</th>
                <th className="text-right py-2 px-2 text-gray-500 font-medium">手取り</th>
                <th className="text-right py-2 px-2 text-gray-500 font-medium">手取り率</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map(row => (
                <tr key={row.y} className={`border-b border-gray-100 ${row.y === years ? "bg-teal-50 font-bold" : ""}`}>
                  <td className="py-2 px-2 text-gray-800">{row.y}年</td>
                  <td className="py-2 px-2 text-right text-green-600">{fmt(Math.round(row.ded / 10000))}万</td>
                  <td className="py-2 px-2 text-right text-teal-700">{fmt(Math.round(row.take / 10000))}万</td>
                  <td className="py-2 px-2 text-right text-gray-600">{row.rate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            { q: "退職金の税金はいくらかかる？", a: "退職所得控除（勤続20年以下：40万×年数、20年超：800万+70万×超過年数）を差し引いた額の1/2に所得税・住民税がかかります。控除が大きいため税負担は比較的軽いです。" },
            { q: "勤続年数が短いと税金が高い？", a: "はい。控除額は勤続年数が長いほど大きくなります。勤続5年なら控除200万円、30年なら1,500万円となるため、長く勤めるほど手取り率が高くなります。" },
            { q: "退職金に確定申告は必要？", a: "「退職所得の受給に関する申告書」を会社に提出していれば確定申告不要です。提出していない場合は20.42%源泉徴収後に確定申告が必要です。" },
          ].map(({ q, a }) => (
            <details key={q} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <summary className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-teal-600 list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 ml-2 shrink-0">＋</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>

      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-700">
        <p className="font-bold mb-1">💡 退職金を最大化するポイント</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>勤続20年を超えると控除額が大幅に増加（年70万円）</li>
          <li>同一年に他の退職金と合算される場合は注意が必要</li>
          <li>企業年金（DC/DB）と組み合わせると受取方法の選択肢が広がります</li>
          <li>退職所得の申告書を会社に必ず提出しましょう</li>
        </ul>
      </div>

      <p className="text-xs text-gray-400 text-center">※ 計算は概算です。実際の税額は状況により異なります。正確な金額は税理士にご相談ください。</p>

      <AdBanner />
    </div>
  );
}
