"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

export default function SplitBill() {
  const [total, setTotal] = useState("");
  const [people, setPeople] = useState("2");
  const [extraPayers, setExtraPayers] = useState("0");
  const [extraAmount, setExtraAmount] = useState("");

  const result = useMemo(() => {
    const t = parseFloat(total);
    const p = parseInt(people);
    const ep = parseInt(extraPayers) || 0;
    const ea = parseFloat(extraAmount) || 0;

    if (!t || !p || t <= 0 || p <= 0) return null;
    if (ep >= p) return null;

    // People who pay extra
    const extraTotal = ep * ea;
    const remaining = t - extraTotal;
    const normalPeople = p - ep;

    if (remaining < 0) return null;

    // Per person (rounded up to nearest yen)
    const perPerson = Math.ceil(remaining / normalPeople);
    const actualTotal = perPerson * normalPeople + extraTotal;
    const remainder = actualTotal - t;

    // Even split (no extra payers)
    const evenPerPerson = Math.ceil(t / p);
    const evenTotal = evenPerPerson * p;
    const evenRemainder = evenTotal - t;

    return {
      perPerson,
      extraPerPerson: ep > 0 ? ea : null,
      evenPerPerson,
      evenRemainder,
      remainder: ep > 0 ? remainder : evenRemainder,
      total: t,
      normalPeople,
      extraPayers: ep,
    };
  }, [total, people, extraPayers, extraAmount]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">割り勘計算</h1>
      <p className="text-gray-500 text-sm mb-6">
        合計金額と人数を入力して割り勘を計算します。端数は切り上げ処理。多く払う人の設定も可能です。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              合計金額（円）
            </label>
            <input
              type="number"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
              placeholder="15000"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              人数
            </label>
            <input
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              placeholder="4"
              min="1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Uneven split options */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            傾斜配分（任意）
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                多く払う人数
              </label>
              <input
                type="number"
                value={extraPayers}
                onChange={(e) => setExtraPayers(e.target.value)}
                placeholder="0"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                1人あたりの支払額（円）
              </label>
              <input
                type="number"
                value={extraAmount}
                onChange={(e) => setExtraAmount(e.target.value)}
                placeholder="5000"
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center col-span-2 sm:col-span-1">
                <div className="text-2xl font-bold text-blue-600">
                  ¥{result.evenPerPerson.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">1人あたり（均等割り）</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-gray-800">
                  ¥{result.total.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">合計金額</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-orange-600">
                  ¥{result.evenRemainder.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">お釣り（余り）</div>
              </div>
            </div>

            {result.extraPerPerson !== null && result.extraPayers > 0 && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">傾斜配分の内訳</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>多く払う人（{result.extraPayers}名）</span>
                    <span className="font-medium">¥{result.extraPerPerson.toLocaleString()} / 人</span>
                  </div>
                  <div className="flex justify-between">
                    <span>その他（{result.normalPeople}名）</span>
                    <span className="font-medium">¥{result.perPerson.toLocaleString()} / 人</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2">
                    <span>端数（お釣り）</span>
                    <span className="font-medium text-orange-600">¥{result.remainder.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">割り勘計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          合計金額と人数を入力すると、1人あたりの支払額を計算します。端数は1円単位で切り上げ、お釣り（余り）も表示します。
          幹事や年長者が多く払う傾斜配分にも対応。飲み会、食事会、旅行の費用分担にご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "端数はどのように処理されますか？",
            answer:
              "1人あたりの金額は1円単位で切り上げされます。そのため合計が元の金額より多くなる場合があり、差額は「お釣り（余り）」として表示されます。",
          },
          {
            question: "傾斜配分とは何ですか？",
            answer:
              "幹事や年長者など、特定の人が多めに支払う方式です。「多く払う人数」と「1人あたりの支払額」を設定すると、残りの人の支払額を自動計算します。",
          },
          {
            question: "入力したデータはサーバーに送信されますか？",
            answer:
              "いいえ。このツールは全てブラウザ上で動作するため、入力したデータがサーバーに送信されることは一切ありません。安心してご利用ください。",
          },
          {
            question: "少数人数やマイナス金額は使えますか？",
            answer:
              "人数は1以上の整数、金額は0以上の数値のみ対応しています。小数の人数やマイナス金額には対応していません。",
          },
        ]}
      />

      <RelatedTools currentToolId="split-bill" />
    </div>
  );
}
