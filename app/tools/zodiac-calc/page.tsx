"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const ETOS = ["子（ね）", "丑（うし）", "寅（とら）", "卯（う）", "辰（たつ）", "巳（み）", "午（うま）", "未（ひつじ）", "申（さる）", "酉（とり）", "戌（いぬ）", "亥（い）"];
const ETO_ICONS = ["🐭", "🐮", "🐯", "🐰", "🐉", "🐍", "🐴", "🐑", "🐵", "🐔", "🐶", "🐗"];

const ZODIACS = [
  { name: "牡羊座", en: "Aries", icon: "♈", start: [3, 21], end: [4, 19], element: "火", trait: "情熱的でリーダーシップがある" },
  { name: "牡牛座", en: "Taurus", icon: "♉", start: [4, 20], end: [5, 20], element: "土", trait: "粘り強く現実的" },
  { name: "双子座", en: "Gemini", icon: "♊", start: [5, 21], end: [6, 21], element: "風", trait: "好奇心旺盛で社交的" },
  { name: "蟹座", en: "Cancer", icon: "♋", start: [6, 22], end: [7, 22], element: "水", trait: "感受性豊かで家族思い" },
  { name: "獅子座", en: "Leo", icon: "♌", start: [7, 23], end: [8, 22], element: "火", trait: "自信にあふれ存在感抜群" },
  { name: "乙女座", en: "Virgo", icon: "♍", start: [8, 23], end: [9, 22], element: "土", trait: "几帳面で分析力が高い" },
  { name: "天秤座", en: "Libra", icon: "♎", start: [9, 23], end: [10, 23], element: "風", trait: "バランス感覚に優れた外交家" },
  { name: "蠍座", en: "Scorpio", icon: "♏", start: [10, 24], end: [11, 22], element: "水", trait: "深く情熱的で直感力が強い" },
  { name: "射手座", en: "Sagittarius", icon: "♐", start: [11, 23], end: [12, 21], element: "火", trait: "自由を愛し冒険好き" },
  { name: "山羊座", en: "Capricorn", icon: "♑", start: [12, 22], end: [1, 19], element: "土", trait: "野心的で責任感が強い" },
  { name: "水瓶座", en: "Aquarius", icon: "♒", start: [1, 20], end: [2, 18], element: "風", trait: "独創的で人道主義者" },
  { name: "魚座", en: "Pisces", icon: "♓", start: [2, 19], end: [3, 20], element: "水", trait: "感受性豊かで直感が鋭い" },
];

function getZodiac(month: number, day: number) {
  return ZODIACS.find((z) => {
    if (z.start[0] <= z.end[0]) {
      return (month === z.start[0] && day >= z.start[1]) || (month === z.end[0] && day <= z.end[1]) || (month > z.start[0] && month < z.end[0]);
    } else {
      return (month === z.start[0] && day >= z.start[1]) || (month === z.end[0] && day <= z.end[1]) || month > z.start[0] || month < z.end[0];
    }
  });
}

function getEto(year: number) {
  const idx = (year - 4) % 12;
  return { name: ETOS[idx >= 0 ? idx : idx + 12], icon: ETO_ICONS[idx >= 0 ? idx : idx + 12] };
}

export default function ZodiacCalcPage() {
  const [birthDate, setBirthDate] = useState("");

  const result = useMemo(() => {
    if (!birthDate) return null;
    const d = new Date(birthDate);
    if (isNaN(d.getTime())) return null;
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const eto = getEto(year);
    const zodiac = getZodiac(month, day);
    const age = new Date().getFullYear() - year;
    const nextEtoYear = year + 12 * Math.ceil((new Date().getFullYear() - year) / 12);
    return { eto, zodiac, year, month, day, age, nextEtoYear };
  }, [birthDate]);

  const currentYear = new Date().getFullYear();
  const thisYearEto = getEto(currentYear);
  const nextYearEto = getEto(currentYear + 1);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">干支・星座計算</h1>
      <p className="text-gray-600 mb-6">生年月日から干支と十二星座を自動判定します。</p>

      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">生年月日</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 rounded-xl p-5 border border-orange-200 text-center">
              <p className="text-sm text-orange-700 mb-1">あなたの干支</p>
              <p className="text-5xl mb-2">{result.eto.icon}</p>
              <p className="text-xl font-bold text-orange-800">{result.eto.name}</p>
              <p className="text-xs text-orange-600 mt-1">{result.year}年生まれ</p>
            </div>
            {result.zodiac && (
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-200 text-center">
                <p className="text-sm text-purple-700 mb-1">あなたの星座</p>
                <p className="text-5xl mb-2">{result.zodiac.icon}</p>
                <p className="text-xl font-bold text-purple-800">{result.zodiac.name}</p>
                <p className="text-xs text-purple-600 mt-1">{result.zodiac.en}・{result.zodiac.element}のエレメント</p>
              </div>
            )}
          </div>
          {result.zodiac && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-1">{result.zodiac.name}の特徴</h3>
              <p className="text-sm text-gray-700">{result.zodiac.trait}</p>
            </div>
          )}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-700">次に{result.eto.name}が巡ってくる年: <strong>{result.nextEtoYear}年</strong></p>
          </div>
        </div>
      )}

      <AdBanner />

      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">今年・来年の干支</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 text-center">
            <p className="text-sm text-yellow-700">{currentYear}年（今年）</p>
            <p className="text-4xl mt-1">{thisYearEto.icon}</p>
            <p className="text-lg font-bold text-yellow-800">{thisYearEto.name}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-200 text-center">
            <p className="text-sm text-green-700">{currentYear + 1}年（来年）</p>
            <p className="text-4xl mt-1">{nextYearEto.icon}</p>
            <p className="text-lg font-bold text-green-800">{nextYearEto.name}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">十二星座一覧</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-700">星座</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">期間</th>
                <th className="px-3 py-2 text-left font-medium text-gray-700">特徴</th>
              </tr>
            </thead>
            <tbody>
              {ZODIACS.map((z) => (
                <tr key={z.name} className="border-t border-gray-100">
                  <td className="px-3 py-2">{z.icon} {z.name}</td>
                  <td className="px-3 py-2 text-gray-600 text-xs">{z.start[0]}/{z.start[1]}〜{z.end[0]}/{z.end[1]}</td>
                  <td className="px-3 py-2 text-gray-600 text-xs">{z.trait}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">2025年の干支は何ですか？</h3>
            <p className="text-sm text-gray-600 mt-1">2025年の干支は「巳（み・ヘビ）」です。巳年は十二支の6番目で、知恵と財運を象徴すると言われています。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">干支と星座の違いは何ですか？</h3>
            <p className="text-sm text-gray-600 mt-1">干支は生まれた年で決まる12年周期の東洋占術です。星座は生まれた月日で決まる12ヶ月周期の西洋占術です。</p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="zodiac-calc" />
    </main>
  );
}
