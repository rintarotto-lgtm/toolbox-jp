"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

export default function MealCostCalcPage() {
  const [people, setPeople] = useState("1");
  const [cookingDays, setCookingDays] = useState("20");
  const [eatOutDays, setEatOutDays] = useState("5");
  const [conveniDays, setConveniDays] = useState("5");
  const [cookingCostPerMeal, setCookingCostPerMeal] = useState("300");
  const [eatOutCostPerMeal, setEatOutCostPerMeal] = useState("900");
  const [conveniCostPerMeal, setConveniCostPerMeal] = useState("550");
  const [mealsPerDay, setMealsPerDay] = useState("3");

  const result = useMemo(() => {
    const p = parseInt(people);
    const cd = parseInt(cookingDays);
    const ed = parseInt(eatOutDays);
    const cvd = parseInt(conveniDays);
    const mpd = parseInt(mealsPerDay);
    const cc = parseFloat(cookingCostPerMeal);
    const ec = parseFloat(eatOutCostPerMeal);
    const cvc = parseFloat(conveniCostPerMeal);

    if (!p || !mpd) return null;

    const totalDays = cd + ed + cvd;
    const cookingTotal = cd * mpd * cc * p;
    const eatOutTotal = ed * mpd * ec * p;
    const conveniTotal = cvd * mpd * cvc * p;
    const monthlyTotal = cookingTotal + eatOutTotal + conveniTotal;
    const perDayAvg = monthlyTotal / totalDays;
    const perMealAvg = perDayAvg / mpd;

    const allCookingSaving = monthlyTotal - (30 * mpd * cc * p);
    const annualTotal = monthlyTotal * 12;

    // 平均との比較（1人暮らし基準）
    const nationalAvg = p === 1 ? 40000 : p === 2 ? 65000 : 80000 + (p - 3) * 15000;
    const diffFromAvg = monthlyTotal - nationalAvg;

    return {
      cookingTotal: Math.round(cookingTotal),
      eatOutTotal: Math.round(eatOutTotal),
      conveniTotal: Math.round(conveniTotal),
      monthlyTotal: Math.round(monthlyTotal),
      perDayAvg: Math.round(perDayAvg),
      perMealAvg: Math.round(perMealAvg),
      allCookingSaving: Math.round(allCookingSaving),
      annualTotal: Math.round(annualTotal),
      nationalAvg,
      diffFromAvg: Math.round(diffFromAvg),
      totalDays,
    };
  }, [people, cookingDays, eatOutDays, conveniDays, cookingCostPerMeal, eatOutCostPerMeal, conveniCostPerMeal, mealsPerDay]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">食費計算・1食あたりコスト</h1>
      <p className="text-gray-600 mb-6">自炊・外食・コンビニの割合から月の食費を計算します。</p>
      <AdBanner />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">世帯人数</label>
            <select value={people} onChange={(e) => setPeople(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}人</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">1日の食事回数</label>
            <select value={mealsPerDay} onChange={(e) => setMealsPerDay(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="2">2食</option>
              <option value="3">3食</option>
            </select>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "🍳 自炊の日数（月間）", days: cookingDays, setDays: setCookingDays, cost: cookingCostPerMeal, setCost: setCookingCostPerMeal, placeholder: "300" },
            { label: "🍽️ 外食の日数（月間）", days: eatOutDays, setDays: setEatOutDays, cost: eatOutCostPerMeal, setCost: setEatOutCostPerMeal, placeholder: "900" },
            { label: "🏪 コンビニ・デリバリーの日数（月間）", days: conveniDays, setDays: setConveniDays, cost: conveniCostPerMeal, setCost: setConveniCostPerMeal, placeholder: "550" },
          ].map(({ label, days, setDays, cost, setCost, placeholder }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">日数（日/月）</p>
                  <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">1食あたり（円）</p>
                  <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder={placeholder} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">月間食費</h2>
          <div className="bg-white rounded-xl p-5 text-center mb-4">
            <p className="text-sm text-gray-600">月間食費合計</p>
            <p className="text-4xl font-bold text-blue-600">¥{formatNum(result.monthlyTotal)}</p>
            <p className="text-sm text-gray-500 mt-1">1日平均 ¥{formatNum(result.perDayAvg)} / 1食平均 ¥{formatNum(result.perMealAvg)}</p>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between bg-white rounded-lg px-4 py-3">
              <span className="text-gray-700">🍳 自炊</span>
              <span className="font-bold text-green-600">¥{formatNum(result.cookingTotal)}</span>
            </div>
            <div className="flex justify-between bg-white rounded-lg px-4 py-3">
              <span className="text-gray-700">🍽️ 外食</span>
              <span className="font-bold text-orange-500">¥{formatNum(result.eatOutTotal)}</span>
            </div>
            <div className="flex justify-between bg-white rounded-lg px-4 py-3">
              <span className="text-gray-700">🏪 コンビニ・デリバリー</span>
              <span className="font-bold text-purple-500">¥{formatNum(result.conveniTotal)}</span>
            </div>
          </div>
          <div className={`rounded-lg p-3 text-sm ${result.diffFromAvg > 0 ? "bg-red-50 border border-red-200 text-red-700" : "bg-green-50 border border-green-200 text-green-700"}`}>
            全国平均（¥{formatNum(result.nationalAvg)}/月）より
            <strong> {result.diffFromAvg > 0 ? "+" : ""}¥{formatNum(Math.abs(result.diffFromAvg))} {result.diffFromAvg > 0 ? "多い" : "少ない"}</strong>
          </div>
          <div className="mt-3 bg-white rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">全て自炊に変えた場合の節約額</p>
            <p className="text-xl font-bold text-blue-600">¥{formatNum(result.allCookingSaving)}/月</p>
          </div>
        </div>
      )}
      <AdBanner />
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">一人暮らしの食費を3万円に抑えるには？</h3><p className="text-sm text-gray-600 mt-1">週2〜3回のまとめ買い（予算3,000〜4,000円/回）、作り置きで食材を使い切る、外食は月4〜6回以内に抑えることで3万円以内が実現できます。</p></div>
          <div><h3 className="font-medium text-gray-900">食費を節約するコツは？</h3><p className="text-sm text-gray-600 mt-1">特売日・見切り品を活用、冷凍保存を上手く使う、タンパク質源は卵・豆腐・鶏むね肉などコスパの良いものを選ぶことが効果的です。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="meal-cost-calc" />
    </main>
  );
}
