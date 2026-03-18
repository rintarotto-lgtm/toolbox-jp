"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Direction = "exclusive_to_inclusive" | "inclusive_to_exclusive";

export default function TaxCalc() {
  const [amount, setAmount] = useState("");
  const [taxRate, setTaxRate] = useState(10);
  const [direction, setDirection] = useState<Direction>("exclusive_to_inclusive");

  const result = useMemo(() => {
    const val = parseFloat(amount);
    if (!val || val < 0) return null;

    const rate = taxRate / 100;

    if (direction === "exclusive_to_inclusive") {
      const tax = Math.floor(val * rate);
      const inclusive = val + tax;
      return { exclusive: val, inclusive, tax };
    } else {
      const exclusive = Math.floor(val / (1 + rate));
      const tax = val - exclusive;
      return { exclusive, inclusive: val, tax };
    }
  }, [amount, taxRate, direction]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">消費税計算</h1>
      <p className="text-gray-500 text-sm mb-6">
        金額を入力して消費税を計算します。10%・8%（軽減税率）に対応。税込み⇔税抜きの双方向計算ができます。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Direction toggle */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            計算方向
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setDirection("exclusive_to_inclusive")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors ${
                direction === "exclusive_to_inclusive"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              税抜き → 税込み
            </button>
            <button
              onClick={() => setDirection("inclusive_to_exclusive")}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors ${
                direction === "inclusive_to_exclusive"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              税込み → 税抜き
            </button>
          </div>
        </div>

        {/* Amount input */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {direction === "exclusive_to_inclusive" ? "税抜き金額（円）" : "税込み金額（円）"}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
            min="0"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Tax rate selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            税率
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setTaxRate(10)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors ${
                taxRate === 10
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              10%（標準税率）
            </button>
            <button
              onClick={() => setTaxRate(8)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border transition-colors ${
                taxRate === 8
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              8%（軽減税率）
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-gray-800">
                ¥{result.exclusive.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">税抜き金額</div>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
              <div className="text-xl font-bold text-orange-600">
                ¥{result.tax.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">消費税額（{taxRate}%）</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                ¥{result.inclusive.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">税込み金額</div>
            </div>
          </div>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">消費税計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          金額を入力するだけで消費税を自動計算します。標準税率10%と軽減税率8%に対応。
          「税抜き→税込み」と「税込み→税抜き」の双方向で計算可能です。
          買い物の税額確認、見積書・請求書作成時の計算にご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "軽減税率8%の対象商品は何ですか？",
            answer:
              "飲食料品（酒類・外食を除く）と定期購読の新聞が軽減税率8%の対象です。テイクアウトや宅配は8%、イートインは10%となります。",
          },
          {
            question: "消費税の端数処理はどうなっていますか？",
            answer:
              "このツールでは切り捨てで計算しています。実際の取引では事業者ごとに切り捨て・切り上げ・四捨五入が異なる場合があります。",
          },
          {
            question: "入力したデータはサーバーに送信されますか？",
            answer:
              "いいえ。このツールは全てブラウザ上で動作するため、入力した金額がサーバーに送信されることは一切ありません。安心してご利用ください。",
          },
        ]}
      />

      <RelatedTools currentToolId="tax-calc" />
    </div>
  );
}
