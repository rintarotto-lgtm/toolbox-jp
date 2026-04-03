"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

function diffDays(d1: Date, d2: Date): number {
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

const MILESTONES = [
  { days: 100, name: "お食い初め" },
  { days: 182, name: "ハーフバースデー（6ヶ月）" },
  { days: 365, name: "1歳の誕生日" },
  { days: 500, name: "500日記念" },
  { days: 730, name: "2歳の誕生日" },
  { days: 1000, name: "1000日記念" },
  { days: 1095, name: "3歳の誕生日" },
  { days: 3650, name: "10歳（小学4年）" },
  { days: 7300, name: "20歳（成人）" },
  { days: 10000, name: "1万日記念" },
  { days: 18250, name: "50歳" },
  { days: 29200, name: "80歳" },
];

export default function AgeInDaysPage() {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split("T")[0]);

  const result = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    if (isNaN(birth.getTime()) || isNaN(target.getTime())) return null;
    if (birth > target) return null;

    const totalDays = diffDays(birth, target);
    const weeks = Math.floor(totalDays / 7);
    const years = Math.floor(totalDays / 365.25);
    const months = Math.floor(totalDays / 30.44);

    const nextMilestones = MILESTONES
      .filter((m) => m.days > totalDays)
      .slice(0, 3)
      .map((m) => {
        const milestoneDate = new Date(birth.getTime() + m.days * 24 * 60 * 60 * 1000);
        const daysUntil = m.days - totalDays;
        return { ...m, date: milestoneDate.toLocaleDateString("ja-JP"), daysUntil };
      });

    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= target) nextBirthday.setFullYear(target.getFullYear() + 1);
    const daysUntilBirthday = diffDays(target, nextBirthday);

    return { totalDays, weeks, years, months, nextMilestones, daysUntilBirthday };
  }, [birthDate, targetDate]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">生後日数・年齢を日数で計算</h1>
      <p className="text-gray-600 mb-6">誕生日から今日まで何日生きているかを計算します。赤ちゃんの生後日数にも対応。</p>

      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">生年月日（誕生日）</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">計算する日付（デフォルト：今日）</label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 mb-4">計算結果</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-4 text-center col-span-2">
                <p className="text-sm text-gray-600">生後（誕生から）</p>
                <p className="text-4xl font-bold text-blue-600">{result.totalDays.toLocaleString()}<span className="text-lg">日</span></p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">週数</p>
                <p className="text-2xl font-bold text-gray-700">{result.weeks.toLocaleString()}<span className="text-sm">週</span></p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">ヶ月数</p>
                <p className="text-2xl font-bold text-gray-700">{result.months.toLocaleString()}<span className="text-sm">ヶ月</span></p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">年齢（概算）</p>
                <p className="text-2xl font-bold text-gray-700">{result.years}<span className="text-sm">歳</span></p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">次の誕生日まで</p>
                <p className="text-2xl font-bold text-orange-500">{result.daysUntilBirthday}<span className="text-sm">日</span></p>
              </div>
            </div>
          </div>

          {result.nextMilestones.length > 0 && (
            <div className="bg-yellow-50 rounded-xl p-5 border border-yellow-200">
              <h3 className="font-bold text-yellow-900 mb-3">🎉 次のマイルストーン</h3>
              <div className="space-y-2">
                {result.nextMilestones.map((m) => (
                  <div key={m.days} className="bg-white rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.date}（{m.days}日目）</p>
                    </div>
                    <p className="text-blue-600 font-bold">あと{m.daysUntil}日</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <AdBanner />

      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">主なマイルストーン一覧</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">記念日</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">日数</th>
              </tr>
            </thead>
            <tbody>
              {MILESTONES.map((m) => (
                <tr key={m.days} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-800">{m.name}</td>
                  <td className="px-4 py-2 text-right font-medium text-blue-600">{m.days.toLocaleString()}日</td>
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
            <h3 className="font-medium text-gray-900">お食い初めは生後何日ですか？</h3>
            <p className="text-sm text-gray-600 mt-1">生後100日が目安です。地域によっては110日や120日に行うこともあります。「一生食べることに困らないように」という願いを込めた日本の伝統行事です。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">人間の1万日記念はいつ？</h3>
            <p className="text-sm text-gray-600 mt-1">1万日は約27年4ヶ月です。誕生日から1万日目を「1万日記念」として祝う方も増えています。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">ハーフバースデーは何日目ですか？</h3>
            <p className="text-sm text-gray-600 mt-1">ハーフバースデーは生後182〜183日（約6ヶ月）です。首が据わり表情が豊かになる時期で、写真撮影などで祝う方が増えています。</p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="age-in-days" />
    </main>
  );
}
