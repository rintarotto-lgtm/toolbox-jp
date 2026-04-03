"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const CIGARETTE_PRICES = [
  { brand: "メビウス", price: 580 },
  { brand: "セブンスター", price: 600 },
  { brand: "マールボロ", price: 620 },
  { brand: "アイコス（ヒーツ）", price: 560 },
  { brand: "グロー（ネオ）", price: 550 },
];

export default function SmokingCostCalcPage() {
  const [cigarettesPerDay, setCigarettesPerDay] = useState("20");
  const [pricePerPack, setPricePerPack] = useState("600");
  const [cigarettesPerPack, setCigarettesPerPack] = useState("20");
  const [quitDate, setQuitDate] = useState("");
  const [smokingYears, setSmokingYears] = useState("10");

  const result = useMemo(() => {
    const perDay = parseFloat(cigarettesPerDay);
    const packPrice = parseFloat(pricePerPack);
    const perPack = parseFloat(cigarettesPerPack);
    if (!perDay || !packPrice || !perPack) return null;

    const costPerCigarette = packPrice / perPack;
    const dailyCost = perDay * costPerCigarette;
    const monthlyCost = dailyCost * 30.44;
    const yearlyCost = dailyCost * 365;
    const fiveYearCost = yearlyCost * 5;
    const tenYearCost = yearlyCost * 10;
    const twentyYearCost = yearlyCost * 20;
    const totalSpent = yearlyCost * parseFloat(smokingYears || "0");

    let savedSinceQuit = 0;
    let daysSinceQuit = 0;
    if (quitDate) {
      const quit = new Date(quitDate);
      const today = new Date();
      daysSinceQuit = Math.max(0, Math.floor((today.getTime() - quit.getTime()) / (1000 * 60 * 60 * 24)));
      savedSinceQuit = daysSinceQuit * dailyCost;
    }

    return {
      dailyCost: Math.round(dailyCost),
      monthlyCost: Math.round(monthlyCost),
      yearlyCost: Math.round(yearlyCost),
      fiveYearCost: Math.round(fiveYearCost),
      tenYearCost: Math.round(tenYearCost),
      twentyYearCost: Math.round(twentyYearCost),
      totalSpent: Math.round(totalSpent),
      savedSinceQuit: Math.round(savedSinceQuit),
      daysSinceQuit,
    };
  }, [cigarettesPerDay, pricePerPack, cigarettesPerPack, quitDate, smokingYears]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">禁煙節約額計算</h1>
      <p className="text-gray-600 mb-6">タバコをやめると年間・生涯でいくら節約できるか計算します。</p>

      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1日の本数</label>
            <input type="number" value={cigarettesPerDay} onChange={(e) => setCigarettesPerDay(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1箱の値段（円）</label>
            <input type="number" value={pricePerPack} onChange={(e) => setPricePerPack(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1箱の本数</label>
            <input type="number" value={cigarettesPerPack} onChange={(e) => setCigarettesPerPack(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">喫煙歴（年）</label>
            <input type="number" value={smokingYears} onChange={(e) => setSmokingYears(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">禁煙開始日（任意）</label>
            <input type="date" value={quitDate} onChange={(e) => setQuitDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {quitDate && result.daysSinceQuit > 0 && (
            <div className="bg-green-50 rounded-xl p-5 border border-green-300 text-center">
              <p className="text-green-700 font-medium">🎉 禁煙 {result.daysSinceQuit} 日達成！</p>
              <p className="text-4xl font-bold text-green-600 mt-2">¥{formatNum(result.savedSinceQuit)}</p>
              <p className="text-sm text-green-600">節約済み！</p>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h2 className="text-lg font-bold text-blue-900 mb-4">タバコ代計算結果</h2>
            <div className="space-y-2">
              {[
                { label: "1日あたり", value: result.dailyCost },
                { label: "1ヶ月あたり", value: result.monthlyCost },
                { label: "1年あたり", value: result.yearlyCost },
                { label: "5年間合計", value: result.fiveYearCost },
                { label: "10年間合計", value: result.tenYearCost },
                { label: "20年間合計", value: result.twentyYearCost },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center bg-white rounded-lg px-4 py-3">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="font-bold text-blue-600">¥{formatNum(item.value)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center bg-red-50 rounded-lg px-4 py-3 border border-red-200">
                <span className="text-red-700 font-medium">これまでの喫煙総費用（{smokingYears}年間）</span>
                <span className="font-bold text-red-600">¥{formatNum(result.totalSpent)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdBanner />

      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">主なタバコの価格（参考）</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">ブランド</th>
                <th className="px-4 py-2 text-right font-medium text-gray-700">1箱の価格</th>
              </tr>
            </thead>
            <tbody>
              {CIGARETTE_PRICES.map((c) => (
                <tr key={c.brand} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-800">{c.brand}</td>
                  <td className="px-4 py-2 text-right font-medium text-gray-700">¥{c.price}</td>
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
            <h3 className="font-medium text-gray-900">1日1箱タバコをやめると年間いくら節約できる？</h3>
            <p className="text-sm text-gray-600 mt-1">1箱600円の場合、年間約21万9000円の節約になります。10年で約219万円、その分を投資に回せばさらに増やすことができます。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">禁煙外来の費用はいくらかかりますか？</h3>
            <p className="text-sm text-gray-600 mt-1">保険適用の禁煙外来は12週間のプログラムで自己負担約2万円前後（3割負担の場合）です。禁煙補助薬（バレニクリン等）が含まれます。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">禁煙アプリと禁煙外来どちらが効果的？</h3>
            <p className="text-sm text-gray-600 mt-1">禁煙外来の成功率は約80%と高く、禁煙補助薬の効果が大きいです。アプリは費用を抑えたい方や軽度の喫煙者に向いています。</p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="smoking-cost-calc" />
    </main>
  );
}
