"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

function calcAmortization(
  principal: number,
  annualRate: number,
  years: number
): { monthly: number; total: number; totalInterest: number; schedule: AmortizationRow[] } {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;

  let monthly: number;
  if (monthlyRate === 0) {
    monthly = principal / totalMonths;
  } else {
    monthly =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const schedule: AmortizationRow[] = [];
  let balance = principal;

  for (let i = 1; i <= totalMonths; i++) {
    const interest = balance * monthlyRate;
    const principalPart = monthly - interest;
    balance = Math.max(0, balance - principalPart);

    schedule.push({
      month: i,
      payment: Math.round(monthly),
      principal: Math.round(principalPart),
      interest: Math.round(interest),
      balance: Math.round(balance),
    });
  }

  const total = Math.round(monthly * totalMonths);
  const totalInterest = total - principal;

  return { monthly: Math.round(monthly), total, totalInterest, schedule };
}

export default function LoanCalc() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");

  const result = useMemo(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseFloat(years);
    if (!p || !y || p <= 0 || y <= 0 || r < 0 || isNaN(r)) return null;

    return calcAmortization(p, r, y);
  }, [principal, rate, years]);

  const displaySchedule = useMemo(() => {
    if (!result) return [];
    const s = result.schedule;
    if (s.length <= 12) return s;

    // Show first 6, ellipsis indicator, last 6
    return [...s.slice(0, 6), ...s.slice(-6)];
  }, [result]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">ローン計算</h1>
      <p className="text-gray-500 text-sm mb-6">
        借入金額・金利・返済期間を入力して、月々の返済額と返済スケジュールを計算します。元利均等返済方式。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              借入金額（円）
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="30000000"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              金利（年 %）
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="1.5"
              min="0"
              step="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              返済期間（年）
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="35"
              min="1"
              max="50"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ¥{result.monthly.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">毎月の返済額</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-gray-800">
                  ¥{result.total.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">総返済額</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-orange-600">
                  ¥{result.totalInterest.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">総利息額</div>
              </div>
            </div>

            {/* Amortization Table */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">返済スケジュール</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 border-b border-gray-200">
                      <th className="pb-2 pr-4">回目</th>
                      <th className="pb-2 pr-4 text-right">返済額</th>
                      <th className="pb-2 pr-4 text-right">元金</th>
                      <th className="pb-2 pr-4 text-right">利息</th>
                      <th className="pb-2 text-right">残高</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displaySchedule.map((row, i) => (
                      <>
                        {i === 6 && result.schedule.length > 12 && (
                          <tr key="ellipsis">
                            <td colSpan={5} className="py-2 text-center text-gray-400">
                              ・・・
                            </td>
                          </tr>
                        )}
                        <tr key={row.month} className="border-b border-gray-100">
                          <td className="py-2 pr-4">{row.month}</td>
                          <td className="py-2 pr-4 text-right">¥{row.payment.toLocaleString()}</td>
                          <td className="py-2 pr-4 text-right">¥{row.principal.toLocaleString()}</td>
                          <td className="py-2 pr-4 text-right">¥{row.interest.toLocaleString()}</td>
                          <td className="py-2 text-right">¥{row.balance.toLocaleString()}</td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">ローン計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          借入金額・年利・返済期間を入力すると、元利均等返済方式での月々の返済額、総返済額、総利息額を計算します。
          返済スケジュール（最初の6回と最後の6回）も表示。住宅ローン、自動車ローン、教育ローンなどの返済シミュレーションにご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "元利均等返済とは何ですか？",
            answer:
              "毎月の返済額（元金＋利息）が一定になる返済方式です。返済初期は利息の割合が大きく、返済が進むにつれて元金の割合が増えます。住宅ローンで最も一般的な方式です。",
          },
          {
            question: "実際のローンとの差異はありますか？",
            answer:
              "このツールは簡易シミュレーションです。実際のローンではボーナス返済、手数料、保証料、団体信用生命保険料などが加わる場合があります。正確な返済額は金融機関にご確認ください。",
          },
          {
            question: "金利0%でも計算できますか？",
            answer:
              "はい。金利0%の場合は単純に借入金額を返済回数で割った金額が月々の返済額になります。",
          },
          {
            question: "入力したデータはサーバーに送信されますか？",
            answer:
              "いいえ。このツールは全てブラウザ上で動作するため、入力したデータがサーバーに送信されることは一切ありません。安心してご利用ください。",
          },
        ]}
      />

      <RelatedTools currentToolId="loan-calc" />
    </div>
  );
}
