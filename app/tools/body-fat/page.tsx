"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Gender = "male" | "female";

interface Rating {
  label: string;
  color: string;
  bg: string;
  border: string;
}

function getRating(pct: number, gender: Gender): Rating {
  if (gender === "male") {
    if (pct < 8) return { label: "低い", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
    if (pct < 15) return { label: "標準（アスリート）", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (pct < 21) return { label: "標準", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (pct < 26) return { label: "やや高い", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
    if (pct < 31) return { label: "高い", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
    return { label: "肥満", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  } else {
    if (pct < 14) return { label: "低い", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
    if (pct < 20) return { label: "標準（アスリート）", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (pct < 26) return { label: "標準", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
    if (pct < 31) return { label: "やや高い", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" };
    if (pct < 36) return { label: "高い", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
    return { label: "肥満", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
  }
}

function calcNavy(
  gender: Gender,
  height: number,
  waist: number,
  neck: number,
  hip: number
): number | null {
  if (height <= 0 || waist <= 0 || neck <= 0) return null;
  if (gender === "male") {
    if (waist <= neck) return null;
    return (
      86.010 * Math.log10(waist - neck) -
      70.041 * Math.log10(height) +
      36.76
    );
  } else {
    if (hip <= 0) return null;
    if (waist + hip <= neck) return null;
    return (
      163.205 * Math.log10(waist + hip - neck) -
      97.684 * Math.log10(height) -
      78.387
    );
  }
}

function calcBMI(
  gender: Gender,
  height: number,
  weight: number,
  age: number
): number | null {
  if (height <= 0 || weight <= 0 || age <= 0) return null;
  const bmi = weight / ((height / 100) ** 2);
  if (gender === "male") {
    return 1.20 * bmi + 0.23 * age - 16.2;
  } else {
    return 1.20 * bmi + 0.23 * age - 5.4;
  }
}

const STANDARDS: { label: string; male: string; female: string }[] = [
  { label: "低い（アスリート以下）", male: "〜7%", female: "〜13%" },
  { label: "アスリート", male: "8〜12%", female: "14〜18%" },
  { label: "フィットネス", male: "13〜17%", female: "19〜22%" },
  { label: "標準", male: "18〜24%", female: "23〜29%" },
  { label: "やや高い", male: "25〜29%", female: "30〜35%" },
  { label: "肥満", male: "30%〜", female: "36%〜" },
];

export default function BodyFat() {
  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [neck, setNeck] = useState("");
  const [hip, setHip] = useState("");
  const [age, setAge] = useState("");
  const [targetFat, setTargetFat] = useState("");

  const result = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const wa = parseFloat(waist);
    const ne = parseFloat(neck);
    const hi = parseFloat(hip);
    const ag = parseFloat(age);

    const navy = calcNavy(gender, h, wa, ne, hi);
    const bmi = calcBMI(gender, h, w, ag);

    if (navy === null && bmi === null) return null;

    const primaryPct = navy ?? bmi ?? 0;
    const rating = getRating(primaryPct, gender);

    const fatMass = w > 0 ? w * (primaryPct / 100) : null;
    const lbm = w > 0 && fatMass !== null ? w - fatMass : null;

    const tf = parseFloat(targetFat);
    const targetDiff =
      w > 0 && !isNaN(tf) && tf > 0 && tf < primaryPct
        ? w * ((primaryPct - tf) / 100)
        : null;

    return { navy, bmi, primaryPct, rating, fatMass, lbm, targetDiff };
  }, [gender, height, weight, waist, neck, hip, age, targetFat]);

  const inputClass =
    "w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400";

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 text-white p-6 mb-6 flex items-center gap-4">
        <span className="text-4xl">💪</span>
        <div>
          <h1 className="text-2xl font-bold">体脂肪率計算ツール</h1>
          <p className="text-orange-100 text-sm mt-1">
            海軍式・BMI法で体脂肪率を推定
          </p>
        </div>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6 space-y-6">
        {/* Gender */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">性別</label>
          <div className="flex gap-3">
            {(["male", "female"] as Gender[]).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  gender === g
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-600 border-gray-300 hover:border-orange-400"
                }`}
              >
                {g === "male" ? "男性" : "女性"}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">身長 (cm)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="170" className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">体重 (kg)</label>
            <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="65" className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">年齢 (BMI法用)</label>
            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="30" className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              ウエスト周囲 (cm)
              <span className="text-xs text-gray-400 ml-1">おへその高さ</span>
            </label>
            <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder="80" className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              首周囲 (cm)
              <span className="text-xs text-gray-400 ml-1">のど仏の下</span>
            </label>
            <input type="number" value={neck} onChange={(e) => setNeck(e.target.value)} placeholder="38" className={inputClass} />
          </div>
          {gender === "female" && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                腰周囲 (cm)
                <span className="text-xs text-gray-400 ml-1">最も広い部分</span>
              </label>
              <input type="number" value={hip} onChange={(e) => setHip(e.target.value)} placeholder="95" className={inputClass} />
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.navy !== null && (
                <div className={`rounded-lg p-4 border ${result.rating.bg} ${result.rating.border}`}>
                  <div className="text-xs text-gray-500 mb-1">海軍式（ネイビーメソッド）</div>
                  <div className={`text-3xl font-bold ${result.rating.color}`}>
                    {result.navy.toFixed(1)}%
                  </div>
                  <div className={`text-sm font-medium mt-1 ${result.rating.color}`}>
                    {result.rating.label}
                  </div>
                </div>
              )}
              {result.bmi !== null && (
                <div className={`rounded-lg p-4 border ${getRating(result.bmi, gender).bg} ${getRating(result.bmi, gender).border}`}>
                  <div className="text-xs text-gray-500 mb-1">BMI推定式</div>
                  <div className={`text-3xl font-bold ${getRating(result.bmi, gender).color}`}>
                    {result.bmi.toFixed(1)}%
                  </div>
                  <div className={`text-sm font-medium mt-1 ${getRating(result.bmi, gender).color}`}>
                    {getRating(result.bmi, gender).label}
                  </div>
                </div>
              )}
            </div>

            {(result.fatMass !== null || result.lbm !== null) && (
              <div className="grid grid-cols-2 gap-3">
                {result.fatMass !== null && (
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-800">
                      {result.fatMass.toFixed(1)} kg
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">体脂肪量</div>
                  </div>
                )}
                {result.lbm !== null && (
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-gray-800">
                      {result.lbm.toFixed(1)} kg
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">除脂肪体重 (LBM)</div>
                  </div>
                )}
              </div>
            )}

            {/* Target fat */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                目標体脂肪率 (%) を入力すると減らすべき脂肪量を計算
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={targetFat}
                  onChange={(e) => setTargetFat(e.target.value)}
                  placeholder={gender === "male" ? "15" : "22"}
                  className="w-28 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
              {result.targetDiff !== null && (
                <p className="mt-2 text-sm text-orange-700 font-medium">
                  目標達成に必要な脂肪燃焼量: 約 {result.targetDiff.toFixed(1)} kg
                </p>
              )}
              {targetFat && parseFloat(targetFat) >= result.primaryPct && (
                <p className="mt-2 text-xs text-gray-400">
                  ※ 目標体脂肪率は現在値より低い値を入力してください。
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <AdBanner />

      {/* Standard table */}
      <section className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-4">男女別・体脂肪率の基準</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left text-gray-700">判定</th>
                <th className="border border-gray-200 px-3 py-2 text-center text-gray-700">男性</th>
                <th className="border border-gray-200 px-3 py-2 text-center text-gray-700">女性</th>
              </tr>
            </thead>
            <tbody>
              {STANDARDS.map((s) => (
                <tr key={s.label} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">{s.label}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center text-gray-800 font-medium">{s.male}</td>
                  <td className="border border-gray-200 px-3 py-2 text-center text-gray-800 font-medium">{s.female}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "体脂肪率の理想的な数値は？",
            answer:
              "成人男性は15〜20%、成人女性は20〜25%が標準的です。アスリートは男性8〜12%、女性14〜18%程度です。30%以上は肥満とされます。",
          },
          {
            question: "体脂肪率の計算方法は？",
            answer:
              "家庭用体脂肪計は生体インピーダンス法を使用します。本ツールは身体測定から推定する海軍式（ネイビーメソッド）とBMIを使った推定式を使用しています。",
          },
          {
            question: "内臓脂肪と皮下脂肪の違いは？",
            answer:
              "内臓脂肪はお腹の臓器周りにつく脂肪で生活習慣病リスクが高く、皮下脂肪は皮膚の下につく脂肪です。内臓脂肪はウエストサイズで推測できます。",
          },
          {
            question: "体脂肪率を下げるには？",
            answer:
              "有酸素運動（ジョギング・水泳など）で体脂肪を燃焼し、筋トレで基礎代謝を上げることが効果的です。食事は高タンパク・低脂質を意識し、カロリー収支を管理しましょう。",
          },
        ]}
      />

      <RelatedTools currentToolId="body-fat" />

      <p className="text-xs text-gray-400 text-center mt-8">
        ※ 本ツールの計算結果は推定値です。正確な体脂肪率の測定には医療機関または専門機器をご利用ください。健康に関する判断は医師にご相談ください。
      </p>
    </div>
  );
}
