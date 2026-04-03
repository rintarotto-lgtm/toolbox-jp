"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type MeasurementPlace = "clinic" | "home";

interface BPCategory {
  label: string;
  clinicSystolic: [number, number];
  clinicDiastolic: [number, number];
  homeSystolic: [number, number];
  homeDiastolic: [number, number];
  color: string;
  bgColor: string;
  borderColor: string;
  advice: string;
}

const BP_CATEGORIES: BPCategory[] = [
  {
    label: "低血圧",
    clinicSystolic: [0, 90],
    clinicDiastolic: [0, 60],
    homeSystolic: [0, 85],
    homeDiastolic: [0, 55],
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    advice:
      "低血圧は立ちくらみや倦怠感の原因になることがあります。水分・塩分の適切な摂取、急な体位変換を避けることが有効です。症状が続く場合は医師に相談してください。",
  },
  {
    label: "至適血圧",
    clinicSystolic: [0, 120],
    clinicDiastolic: [0, 80],
    homeSystolic: [0, 115],
    homeDiastolic: [0, 75],
    color: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-300",
    advice:
      "理想的な血圧値です。現在の生活習慣を維持しましょう。定期的な運動、バランスの良い食事、禁煙、適度な飲酒量を心がけてください。",
  },
  {
    label: "正常血圧",
    clinicSystolic: [0, 130],
    clinicDiastolic: [0, 85],
    homeSystolic: [0, 125],
    homeDiastolic: [0, 80],
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-300",
    advice:
      "正常範囲内の血圧値です。引き続き健康的な生活習慣を続けてください。定期的な血圧チェックをお勧めします。",
  },
  {
    label: "正常高値血圧",
    clinicSystolic: [130, 140],
    clinicDiastolic: [85, 90],
    homeSystolic: [125, 135],
    homeDiastolic: [80, 85],
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-300",
    advice:
      "高血圧予備軍の状態です。減塩（6g/日未満）、体重管理、定期的な有酸素運動（30分/日）を心がけましょう。生活習慣の改善で正常値に戻ることが期待できます。",
  },
  {
    label: "I度高血圧",
    clinicSystolic: [140, 160],
    clinicDiastolic: [90, 100],
    homeSystolic: [135, 150],
    homeDiastolic: [85, 95],
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    advice:
      "軽度の高血圧です。生活習慣の改善（減塩、運動、体重管理、禁煙、節酒）を積極的に行いましょう。改善が見られない場合や他のリスク因子がある場合は医師に相談してください。",
  },
  {
    label: "II度高血圧",
    clinicSystolic: [160, 180],
    clinicDiastolic: [100, 110],
    homeSystolic: [150, 170],
    homeDiastolic: [95, 105],
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    advice:
      "中等度の高血圧です。生活習慣の改善に加え、薬物療法が必要な場合があります。必ず医師の診察を受けてください。放置すると脳卒中・心疾患のリスクが高まります。",
  },
  {
    label: "III度高血圧",
    clinicSystolic: [180, 999],
    clinicDiastolic: [110, 999],
    homeSystolic: [170, 999],
    homeDiastolic: [105, 999],
    color: "text-red-900",
    bgColor: "bg-red-100",
    borderColor: "border-red-500",
    advice:
      "重症の高血圧です。早急に医師の診察が必要です。脳卒中・心筋梗塞・腎障害などの重篤な合併症リスクが非常に高い状態です。すぐに医療機関を受診してください。",
  },
  {
    label: "収縮期高血圧",
    clinicSystolic: [140, 999],
    clinicDiastolic: [0, 90],
    homeSystolic: [135, 999],
    homeDiastolic: [0, 85],
    color: "text-pink-700",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-300",
    advice:
      "上の血圧のみが高い状態（収縮期高血圧）です。高齢者に多く見られます。動脈硬化のサインである場合があります。医師に相談してください。",
  },
];

function classifyBP(
  systolic: number,
  diastolic: number,
  place: MeasurementPlace
): BPCategory {
  // Low blood pressure check first
  if (
    (place === "clinic" && (systolic < 90 || diastolic < 60)) ||
    (place === "home" && (systolic < 85 || diastolic < 55))
  ) {
    return BP_CATEGORIES[0];
  }

  const sys = place === "clinic" ? "clinicSystolic" : "homeSystolic";
  const dia = place === "clinic" ? "clinicDiastolic" : "homeDiastolic";

  // III度高血圧
  if (systolic >= BP_CATEGORIES[6][sys][0] || diastolic >= BP_CATEGORIES[6][dia][0]) {
    return BP_CATEGORIES[6];
  }
  // II度高血圧
  if (systolic >= BP_CATEGORIES[5][sys][0] || diastolic >= BP_CATEGORIES[5][dia][0]) {
    return BP_CATEGORIES[5];
  }
  // I度高血圧
  if (systolic >= BP_CATEGORIES[4][sys][0] || diastolic >= BP_CATEGORIES[4][dia][0]) {
    return BP_CATEGORIES[4];
  }
  // 収縮期高血圧
  const sysHigh = place === "clinic" ? systolic >= 140 : systolic >= 135;
  const diaOk = place === "clinic" ? diastolic < 90 : diastolic < 85;
  if (sysHigh && diaOk) {
    return BP_CATEGORIES[7];
  }
  // 正常高値
  if (systolic >= BP_CATEGORIES[3][sys][0] || diastolic >= BP_CATEGORIES[3][dia][0]) {
    return BP_CATEGORIES[3];
  }
  // 正常
  if (systolic >= BP_CATEGORIES[2][sys][0] || diastolic >= BP_CATEGORIES[2][dia][0]) {
    return BP_CATEGORIES[2];
  }
  // 至適
  return BP_CATEGORIES[1];
}

interface BPRecord {
  date: string;
  systolic: number;
  diastolic: number;
}

export default function BloodPressure() {
  const [systolic, setSystolic] = useState(120);
  const [diastolic, setDiastolic] = useState(80);
  const [place, setPlace] = useState<MeasurementPlace>("clinic");
  const [age, setAge] = useState("");

  // Record state
  const [records, setRecords] = useState<BPRecord[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("bp-records") || "[]");
    } catch {
      return [];
    }
  });
  const [recDate, setRecDate] = useState(new Date().toISOString().slice(0, 10));
  const [recSys, setRecSys] = useState("");
  const [recDia, setRecDia] = useState("");

  const result = useMemo(() => {
    const category = classifyBP(systolic, diastolic, place);
    const pulsePressure = systolic - diastolic;
    let pulsePressureLabel = "";
    if (pulsePressure < 30) pulsePressureLabel = "低め";
    else if (pulsePressure <= 60) pulsePressureLabel = "正常範囲";
    else pulsePressureLabel = "高め（動脈硬化に注意）";

    return { category, pulsePressure, pulsePressureLabel };
  }, [systolic, diastolic, place]);

  const avgRecord = useMemo(() => {
    if (records.length === 0) return null;
    const recent = records.slice(-10);
    const avgSys = Math.round(recent.reduce((s, r) => s + r.systolic, 0) / recent.length);
    const avgDia = Math.round(recent.reduce((s, r) => s + r.diastolic, 0) / recent.length);
    return { avgSys, avgDia, count: recent.length };
  }, [records]);

  function addRecord() {
    const s = parseInt(recSys);
    const d = parseInt(recDia);
    if (!recDate || isNaN(s) || isNaN(d) || s <= 0 || d <= 0) return;
    const newRecords = [...records, { date: recDate, systolic: s, diastolic: d }].slice(-50);
    setRecords(newRecords);
    if (typeof window !== "undefined") {
      localStorage.setItem("bp-records", JSON.stringify(newRecords));
    }
    setRecSys("");
    setRecDia("");
  }

  const classificationTable = [
    { label: "至適血圧", clinic: "< 120 / < 80", home: "< 115 / < 75", color: "bg-green-100" },
    { label: "正常血圧", clinic: "< 130 / < 85", home: "< 125 / < 80", color: "bg-emerald-50" },
    { label: "正常高値血圧", clinic: "130-139 / 85-89", home: "125-134 / 80-84", color: "bg-yellow-50" },
    { label: "I度高血圧", clinic: "140-159 / 90-99", home: "135-149 / 85-94", color: "bg-orange-50" },
    { label: "II度高血圧", clinic: "160-179 / 100-109", home: "150-169 / 95-104", color: "bg-red-50" },
    { label: "III度高血圧", clinic: "≥ 180 / ≥ 110", home: "≥ 170 / ≥ 105", color: "bg-red-100" },
    { label: "収縮期高血圧", clinic: "≥ 140 / < 90", home: "≥ 135 / < 85", color: "bg-pink-50" },
    { label: "低血圧", clinic: "< 90 / < 60", home: "< 85 / < 55", color: "bg-blue-50" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">❤️</span>
          <h1 className="text-2xl font-bold">血圧判定・記録</h1>
        </div>
        <p className="text-red-100 text-sm">
          収縮期・拡張期血圧から日本高血圧学会の基準で血圧レベルを判定します。
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {/* Measurement Place */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">測定場所</label>
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1 w-fit">
            <button
              onClick={() => setPlace("clinic")}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                place === "clinic"
                  ? "bg-white text-red-600 shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              診察室
            </button>
            <button
              onClick={() => setPlace("home")}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                place === "home"
                  ? "bg-white text-red-600 shadow"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              家庭
            </button>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                収縮期血圧（上）
              </label>
              <span className="text-xl font-bold text-red-600">{systolic} mmHg</span>
            </div>
            <input
              type="range"
              min={60}
              max={220}
              value={systolic}
              onChange={(e) => setSystolic(Number(e.target.value))}
              className="w-full accent-red-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>60</span>
              <span>220</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                拡張期血圧（下）
              </label>
              <span className="text-xl font-bold text-pink-600">{diastolic} mmHg</span>
            </div>
            <input
              type="range"
              min={40}
              max={140}
              value={diastolic}
              onChange={(e) => setDiastolic(Number(e.target.value))}
              className="w-full accent-pink-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>40</span>
              <span>140</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              年齢（任意・参考情報）
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="例: 45"
              min="1"
              max="120"
              className="w-32 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
            />
          </div>
        </div>

        {/* Result */}
        <div
          className={`border-2 rounded-xl p-5 ${result.category.bgColor} ${result.category.borderColor}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl font-bold text-gray-800">
              {systolic}/{diastolic}
            </div>
            <div className="text-sm text-gray-500">mmHg</div>
          </div>
          <div className={`text-2xl font-bold mb-2 ${result.category.color}`}>
            {result.category.label}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{result.category.advice}</p>
        </div>

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-red-600">{systolic}</div>
            <div className="text-xs text-gray-500">収縮期（mmHg）</div>
            <div className="text-xs mt-1 text-gray-600">
              {place === "clinic"
                ? systolic < 120 ? "至適" : systolic < 130 ? "正常" : systolic < 140 ? "正常高値" : "高値"
                : systolic < 115 ? "至適" : systolic < 125 ? "正常" : systolic < 135 ? "正常高値" : "高値"}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-pink-600">{diastolic}</div>
            <div className="text-xs text-gray-500">拡張期（mmHg）</div>
            <div className="text-xs mt-1 text-gray-600">
              {place === "clinic"
                ? diastolic < 80 ? "至適" : diastolic < 85 ? "正常" : diastolic < 90 ? "正常高値" : "高値"
                : diastolic < 75 ? "至適" : diastolic < 80 ? "正常" : diastolic < 85 ? "正常高値" : "高値"}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-700">{result.pulsePressure}</div>
            <div className="text-xs text-gray-500">脈圧（mmHg）</div>
            <div className="text-xs mt-1 text-gray-600">{result.pulsePressureLabel}</div>
          </div>
        </div>

        {/* Classification Table */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            血圧分類表（日本高血圧学会2019ガイドライン）
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-500 border-b border-gray-200">
                  <th className="text-left pb-2 font-medium">分類</th>
                  <th className="text-left pb-2 font-medium">診察室血圧</th>
                  <th className="text-left pb-2 font-medium">家庭血圧</th>
                </tr>
              </thead>
              <tbody>
                {classificationTable.map((row) => (
                  <tr
                    key={row.label}
                    className={`border-b border-gray-100 ${
                      row.label === result.category.label
                        ? "ring-2 ring-red-400 rounded font-bold"
                        : ""
                    }`}
                  >
                    <td className={`py-1.5 px-1 font-medium ${row.label === result.category.label ? "text-red-700" : "text-gray-700"}`}>
                      {row.label === result.category.label ? "▶ " : ""}{row.label}
                    </td>
                    <td className="py-1.5 px-1 text-gray-600">{row.clinic}</td>
                    <td className="py-1.5 px-1 text-gray-600">{row.home}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* Record Section */}
      <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-bold text-gray-900">血圧記録</h2>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">日付</label>
            <input
              type="date"
              value={recDate}
              onChange={(e) => setRecDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">上（収縮期）</label>
            <input
              type="number"
              value={recSys}
              onChange={(e) => setRecSys(e.target.value)}
              placeholder="120"
              min="60"
              max="220"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">下（拡張期）</label>
            <input
              type="number"
              value={recDia}
              onChange={(e) => setRecDia(e.target.value)}
              placeholder="80"
              min="40"
              max="140"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
        </div>
        <button
          onClick={addRecord}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          記録を追加
        </button>

        {records.length > 0 && (
          <>
            {avgRecord && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
                <span className="font-medium text-red-700">
                  最新{avgRecord.count}件の平均: {avgRecord.avgSys}/{avgRecord.avgDia} mmHg
                </span>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-200">
                    <th className="text-left pb-2 font-medium">日付</th>
                    <th className="text-left pb-2 font-medium">上（mmHg）</th>
                    <th className="text-left pb-2 font-medium">下（mmHg）</th>
                    <th className="text-left pb-2 font-medium">判定</th>
                  </tr>
                </thead>
                <tbody>
                  {[...records].reverse().slice(0, 10).map((r, i) => {
                    const cat = classifyBP(r.systolic, r.diastolic, "home");
                    return (
                      <tr key={i} className="border-b border-gray-100 text-gray-700">
                        <td className="py-1.5">{r.date}</td>
                        <td className="py-1.5 font-medium text-red-600">{r.systolic}</td>
                        <td className="py-1.5 font-medium text-pink-600">{r.diastolic}</td>
                        <td className={`py-1.5 text-xs font-medium ${cat.color}`}>{cat.label}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      <section className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">血圧判定ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          スライダーで収縮期（上）・拡張期（下）の血圧値を入力すると、日本高血圧学会2019年ガイドラインの基準に基づいて血圧レベルを自動判定します。
          診察室血圧と家庭血圧で基準値が異なるため、測定場所を選択してください。
          血圧記録機能でlocalStorageに記録を保存し、平均値の推移を管理できます。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "正常血圧の基準値は？",
            answer:
              "日本高血圧学会の基準では、診察室血圧で収縮期120mmHg未満かつ拡張期80mmHg未満が正常血圧です。家庭血圧では115/75mmHg未満が正常とされます。",
          },
          {
            question: "高血圧の基準値はいくつですか？",
            answer:
              "診察室血圧で収縮期140mmHg以上または拡張期90mmHg以上が高血圧と診断されます。家庭血圧では135/85mmHg以上が高血圧の基準です。",
          },
          {
            question: "上の血圧と下の血圧の違いは？",
            answer:
              "収縮期血圧（上）は心臓が血液を送り出す瞬間の最大圧力、拡張期血圧（下）は心臓が弛緩している時の最小圧力です。両方を確認することが重要です。",
          },
          {
            question: "血圧を下げるには何が効果的ですか？",
            answer:
              "減塩（6g/日未満）、体重管理、適度な運動（有酸素運動30分/日）、禁煙、アルコール制限が効果的です。薬物療法が必要な場合は医師に相談してください。",
          },
        ]}
      />

      <RelatedTools currentToolId="blood-pressure" />

      <p className="text-xs text-gray-400 text-center mt-8">
        本ツールの計算結果は参考情報です。健康に関する判断は必ず医師にご相談ください。
      </p>
    </div>
  );
}
