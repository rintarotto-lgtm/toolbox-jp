"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

type PaymentType = "freelance" | "salary";

export default function TaxWithholdingPage() {
  const [paymentType, setPaymentType] = useState<PaymentType>("freelance");
  const [amount, setAmount] = useState("");
  const [dependents, setDependents] = useState("0");

  const result = useMemo(() => {
    const amt = parseFloat(amount.replace(/,/g, ""));
    if (!amt || amt <= 0) return null;

    if (paymentType === "freelance") {
      let tax = 0;
      if (amt <= 1000000) {
        tax = amt * 0.1021;
      } else {
        tax = 1000000 * 0.1021 + (amt - 1000000) * 0.2042;
      }
      const roundedTax = Math.floor(tax);
      return {
        grossAmount: amt,
        taxAmount: roundedTax,
        netAmount: amt - roundedTax,
        taxRate: ((roundedTax / amt) * 100).toFixed(2),
        note: amt > 1000000 ? "100万円超の部分は20.42%" : "10.21%（所得税10%＋復興特別所得税0.21%）",
      };
    } else {
      // Simplified salary withholding (monthly)
      const dep = parseInt(dependents);
      // Rough calculation for monthly salary
      let taxBase = amt - 78000; // 基礎控除相当の簡略計算
      if (dep > 0) taxBase -= dep * 38000;
      if (taxBase <= 0) {
        return { grossAmount: amt, taxAmount: 0, netAmount: amt, taxRate: "0.00", note: "扶養控除等により源泉徴収なし" };
      }
      let tax = 0;
      const annual = taxBase * 12;
      if (annual <= 1950000) tax = annual * 0.05;
      else if (annual <= 3300000) tax = annual * 0.10 - 97500;
      else if (annual <= 6950000) tax = annual * 0.20 - 427500;
      else if (annual <= 9000000) tax = annual * 0.23 - 636000;
      else tax = annual * 0.33 - 1536000;
      const monthlyTax = Math.floor((tax / 12) * 1.021);
      return {
        grossAmount: amt,
        taxAmount: monthlyTax,
        netAmount: amt - monthlyTax,
        taxRate: ((monthlyTax / amt) * 100).toFixed(2),
        note: "概算値（詳細は国税庁の源泉徴収税額表を参照）",
      };
    }
  }, [amount, paymentType, dependents]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">源泉徴収税額計算</h1>
      <p className="text-gray-600 mb-6">給与・フリーランス報酬から源泉徴収される所得税額を計算します。</p>

      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">支払い種別</label>
          <div className="flex gap-2">
            <button
              onClick={() => setPaymentType("freelance")}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${paymentType === "freelance" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              フリーランス報酬
            </button>
            <button
              onClick={() => setPaymentType("salary")}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${paymentType === "salary" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              給与（月額）
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {paymentType === "freelance" ? "報酬金額（円）" : "月給・手当合計（円）"}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={paymentType === "freelance" ? "例: 300000" : "例: 250000"}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {paymentType === "salary" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">扶養親族等の人数</label>
            <select
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[0,1,2,3,4,5].map((n) => (
                <option key={n} value={n}>{n}人</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">計算結果</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white rounded-lg p-4">
              <span className="text-gray-700">支払い金額</span>
              <span className="text-xl font-bold text-gray-900">¥{formatNum(result.grossAmount)}</span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg p-4">
              <span className="text-gray-700">源泉徴収税額</span>
              <span className="text-xl font-bold text-red-600">- ¥{formatNum(result.taxAmount)}</span>
            </div>
            <div className="flex justify-between items-center bg-blue-600 rounded-lg p-4">
              <span className="text-white font-medium">手取り金額</span>
              <span className="text-2xl font-bold text-white">¥{formatNum(result.netAmount)}</span>
            </div>
          </div>
          <div className="mt-4 bg-white rounded-lg p-3">
            <p className="text-sm text-gray-600">実効税率: <strong>{result.taxRate}%</strong></p>
            <p className="text-xs text-gray-500 mt-1">{result.note}</p>
          </div>
        </div>
      )}

      <AdBanner />

      <div className="mt-8 bg-yellow-50 rounded-xl p-5 border border-yellow-200">
        <h2 className="font-bold text-yellow-900 mb-2">📋 フリーランス源泉徴収の基本</h2>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• 報酬100万円以下：<strong>10.21%</strong>（所得税10%＋復興税0.21%）</li>
          <li>• 報酬100万円超の部分：<strong>20.42%</strong></li>
          <li>• 源泉徴収は支払者（クライアント）が天引きして納付</li>
          <li>• 確定申告で精算 → 過払い分は還付される</li>
        </ul>
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">源泉徴収はいつ納付するの？</h3>
            <p className="text-sm text-gray-600 mt-1">支払者が翌月10日までに税務署に納付します。従業員10人未満の小規模事業者は半期ごとの特例があります。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">源泉徴収不要の場合は？</h3>
            <p className="text-sm text-gray-600 mt-1">個人への支払いでも、物品販売や不動産賃料（一部除く）など、対象外の取引もあります。税理士に確認することをお勧めします。</p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="tax-withholding" />
    </main>
  );
}
