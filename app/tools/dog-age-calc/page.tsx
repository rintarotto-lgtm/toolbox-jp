"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type PetType = "dog" | "cat";
type DogSize = "small" | "medium" | "large";

interface AgeRow {
  petAge: number;
  humanAge: number;
}

function calcDogHumanAge(petAge: number, size: DogSize): number {
  if (petAge <= 0) return 0;
  if (petAge === 1) return 15;
  const base = 24;
  const perYear = size === "small" ? 4 : size === "medium" ? 4.5 : 7;
  return Math.round(base + (petAge - 2) * perYear);
}

function calcCatHumanAge(petAge: number): number {
  if (petAge <= 0) return 0;
  if (petAge === 1) return 17;
  if (petAge === 2) return 24;
  return Math.round(24 + (petAge - 2) * 4);
}

function getDogLifeStage(petAge: number, size: DogSize): string {
  if (petAge <= 1) return "子犬";
  if (size === "small") {
    if (petAge <= 7) return "成犬";
    if (petAge <= 12) return "シニア";
    return "老齢";
  } else if (size === "medium") {
    if (petAge <= 6) return "成犬";
    if (petAge <= 10) return "シニア";
    return "老齢";
  } else {
    if (petAge <= 5) return "成犬";
    if (petAge <= 8) return "シニア";
    return "老齢";
  }
}

function getCatLifeStage(petAge: number): string {
  if (petAge <= 1) return "子猫";
  if (petAge <= 7) return "成猫";
  if (petAge <= 12) return "シニア";
  return "老齢";
}

const DOG_SIZE_LABELS: Record<DogSize, string> = {
  small: "小型犬（〜10kg）",
  medium: "中型犬（10〜25kg）",
  large: "大型犬（25kg〜）",
};

const STAGE_COLORS: Record<string, string> = {
  子犬: "bg-yellow-100 text-yellow-700",
  子猫: "bg-yellow-100 text-yellow-700",
  成犬: "bg-green-100 text-green-700",
  成猫: "bg-green-100 text-green-700",
  シニア: "bg-orange-100 text-orange-700",
  老齢: "bg-red-100 text-red-700",
};

export default function DogAgeCalc() {
  const [petType, setPetType] = useState<PetType>("dog");
  const [petAge, setPetAge] = useState<string>("");
  const [dogSize, setDogSize] = useState<DogSize>("small");

  const result = useMemo(() => {
    const age = parseFloat(petAge);
    if (!petAge || isNaN(age) || age < 0 || age > 30) return null;
    const roundedAge = Math.floor(age);
    if (petType === "dog") {
      const humanAge = calcDogHumanAge(roundedAge, dogSize);
      const stage = getDogLifeStage(roundedAge, dogSize);
      return { humanAge, stage };
    } else {
      const humanAge = calcCatHumanAge(roundedAge);
      const stage = getCatLifeStage(roundedAge);
      return { humanAge, stage };
    }
  }, [petAge, petType, dogSize]);

  const ageTable: AgeRow[] = useMemo(() => {
    const rows: AgeRow[] = [];
    const maxAge = 20;
    for (let i = 1; i <= maxAge; i++) {
      const humanAge =
        petType === "dog"
          ? calcDogHumanAge(i, dogSize)
          : calcCatHumanAge(i);
      rows.push({ petAge: i, humanAge });
    }
    return rows;
  }, [petType, dogSize]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">犬・猫の年齢換算</h1>
      <p className="text-gray-500 text-sm mb-6">
        ペットの年齢を人間の年齢に換算します。犬種のサイズ別対応・猫の年齢早見表付き。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 mt-6">
        {/* タブ切り替え */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg w-fit">
          {(["dog", "cat"] as PetType[]).map((type) => (
            <button
              key={type}
              onClick={() => setPetType(type)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                petType === type
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {type === "dog" ? "🐕 犬" : "🐈 猫"}
            </button>
          ))}
        </div>

        {/* 入力フォーム */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {petType === "dog" ? "犬の年齢（歳）" : "猫の年齢（歳）"}
            </label>
            <input
              type="number"
              min="0"
              max="30"
              step="1"
              value={petAge}
              onChange={(e) => setPetAge(e.target.value)}
              placeholder="例：3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {petType === "dog" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                犬のサイズ
              </label>
              <select
                value={dogSize}
                onChange={(e) => setDogSize(e.target.value as DogSize)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {(Object.keys(DOG_SIZE_LABELS) as DogSize[]).map((size) => (
                  <option key={size} value={size}>
                    {DOG_SIZE_LABELS[size]}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 結果 */}
        {result && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
              <div className="text-4xl font-bold text-blue-600">
                {result.humanAge}
              </div>
              <div className="text-sm text-gray-500 mt-1">人間換算年齢（歳）</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center flex flex-col items-center justify-center">
              <div
                className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-1 ${
                  STAGE_COLORS[result.stage] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {result.stage}
              </div>
              <div className="text-xs text-gray-500">ライフステージ</div>
            </div>
          </div>
        )}
      </div>

      {/* 年齢早見表 */}
      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-bold text-gray-800 mb-4">
          {petType === "dog"
            ? `年齢早見表（${DOG_SIZE_LABELS[dogSize]}）`
            : "猫の年齢早見表"}
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">
                  {petType === "dog" ? "犬の年齢" : "猫の年齢"}
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">
                  人間換算
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700 border-b">
                  ライフステージ
                </th>
              </tr>
            </thead>
            <tbody>
              {ageTable.map((row) => {
                const stage =
                  petType === "dog"
                    ? getDogLifeStage(row.petAge, dogSize)
                    : getCatLifeStage(row.petAge);
                return (
                  <tr key={row.petAge} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{row.petAge}歳</td>
                    <td className="px-4 py-2 text-blue-600 font-bold">
                      {row.humanAge}歳
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          STAGE_COLORS[stage] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {stage}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AdBanner />

      <ToolFAQ
        faqs={[
          {
            question: "犬1歳は人間の何歳？",
            answer:
              "小型犬で約15〜17歳相当。大型犬は成長が早くより年齢が高くなります。",
          },
          {
            question: "犬のシニア期はいつから？",
            answer:
              "小型犬は10歳頃、大型犬は7〜8歳頃からシニア期とされます。",
          },
          {
            question: "猫と犬では年齢換算が違う？",
            answer:
              "猫は2歳以降の換算が犬と少し異なり、全体的に長生きの傾向があります。",
          },
        ]}
      />

      <RelatedTools currentToolId="dog-age-calc" />
    </div>
  );
}
