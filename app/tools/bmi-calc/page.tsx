"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface BMICategory {
  label: string;
  color: string;
  bgColor: string;
  min: number;
  max: number;
}

const categories: BMICategory[] = [
  { label: "やせ（低体重）", color: "text-blue-600", bgColor: "bg-blue-500", min: 0, max: 18.5 },
  { label: "標準（普通体重）", color: "text-green-600", bgColor: "bg-green-500", min: 18.5, max: 25 },
  { label: "肥満1度", color: "text-yellow-600", bgColor: "bg-yellow-500", min: 25, max: 30 },
  { label: "肥満2度", color: "text-orange-600", bgColor: "bg-orange-500", min: 30, max: 35 },
  { label: "肥満3度", color: "text-red-600", bgColor: "bg-red-500", min: 35, max: 40 },
  { label: "肥満4度", color: "text-red-800", bgColor: "bg-red-800", min: 40, max: 100 },
];

function getCategory(bmi: number): BMICategory {
  return categories.find((c) => bmi < c.max) || categories[categories.length - 1];
}

export default function BmiCalc() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const result = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;

    const hm = h / 100;
    const bmi = w / (hm * hm);
    const idealWeight = 22 * hm * hm;
    const category = getCategory(bmi);

    return { bmi, idealWeight, category, heightM: hm };
  }, [height, weight]);

  const gaugePercent = useMemo(() => {
    if (!result) return 0;
    // Map BMI 10-45 to 0-100%
    return Math.min(100, Math.max(0, ((result.bmi - 10) / 35) * 100));
  }, [result]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">BMI計算</h1>
      <p className="text-gray-500 text-sm mb-6">
        身長と体重を入力して、BMI（体格指数）を計算します。日本肥満学会の基準で判定します。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              身長（cm）
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              min="0"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              体重（kg）
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="65"
              min="0"
              step="0.1"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {result && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.bmi.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 mt-1">BMI</div>
              </div>
              <div className={`bg-white border border-gray-200 rounded-lg p-4 text-center`}>
                <div className={`text-xl font-bold ${result.category.color}`}>
                  {result.category.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">判定</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-gray-800">
                  {result.idealWeight.toFixed(1)} kg
                </div>
                <div className="text-xs text-gray-500 mt-1">理想体重（BMI 22）</div>
              </div>
            </div>

            {/* BMI Gauge */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">BMIゲージ</h3>
              <div className="relative">
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div className="bg-blue-400 flex-1" title="やせ" />
                  <div className="bg-green-400 flex-1" title="標準" />
                  <div className="bg-yellow-400 flex-1" title="肥満1度" />
                  <div className="bg-orange-400 flex-1" title="肥満2度" />
                  <div className="bg-red-400 flex-1" title="肥満3度" />
                  <div className="bg-red-700 flex-1" title="肥満4度" />
                </div>
                <div
                  className="absolute top-0 w-0.5 h-6 bg-gray-900 -translate-x-1/2 -mt-1"
                  style={{ left: `${gaugePercent}%` }}
                />
                <div
                  className="absolute top-7 text-xs font-bold text-gray-800 -translate-x-1/2"
                  style={{ left: `${gaugePercent}%` }}
                >
                  {result.bmi.toFixed(1)}
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-6">
                <span>10</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>35</span>
                <span>40</span>
                <span>45</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">詳細情報</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  理想体重との差:{" "}
                  <span className="font-medium">
                    {(parseFloat(weight) - result.idealWeight) > 0 ? "+" : ""}
                    {(parseFloat(weight) - result.idealWeight).toFixed(1)} kg
                  </span>
                </div>
                <div>
                  標準BMI範囲の体重:{" "}
                  <span className="font-medium">
                    {(18.5 * result.heightM * result.heightM).toFixed(1)} 〜{" "}
                    {(25 * result.heightM * result.heightM).toFixed(1)} kg
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">BMI計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          身長（cm）と体重（kg）を入力すると、BMI（Body Mass Index：体格指数）をリアルタイムで計算します。
          日本肥満学会の基準に基づき、やせ（低体重）・標準（普通体重）・肥満1度〜4度の6段階で判定。
          BMI 22を基準とした理想体重も表示します。健康管理やダイエットの目安にご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "BMIとは何ですか？",
            answer:
              "BMI（Body Mass Index）は体重と身長から算出される体格指数で、肥満度の判定に国際的に用いられています。計算式は「体重(kg) ÷ 身長(m)²」です。",
          },
          {
            question: "日本の基準は世界と違いますか？",
            answer:
              "はい。WHO基準ではBMI 30以上が肥満ですが、日本肥満学会ではBMI 25以上を肥満としています。これはアジア人の体質を考慮したものです。",
          },
          {
            question: "BMI 22が理想とされる理由は？",
            answer:
              "統計的にBMI 22の人が最も病気になりにくいとされているため、日本肥満学会では標準体重の基準をBMI 22としています。",
          },
          {
            question: "入力したデータはサーバーに送信されますか？",
            answer:
              "いいえ。このツールは全てブラウザ上で動作するため、入力した身長・体重がサーバーに送信されることは一切ありません。安心してご利用ください。",
          },
        ]}
      />

      <RelatedTools currentToolId="bmi-calc" />
    </div>
  );
}
