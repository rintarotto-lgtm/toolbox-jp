"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const PRESETS = [
  { label: "日経平均（過去30年平均）", rate: 7, icon: "🇯🇵" },
  { label: "S&P500（過去30年平均）", rate: 10, icon: "🇺🇸" },
  { label: "全世界株式（オルカン）", rate: 7, icon: "🌍" },
  { label: "定期預金（高金利）", rate: 0.5, icon: "🏦" },
];

export default function NikkeiReturnCalcPage() {
  const [monthly, setMonthly] = useState("");
  const [initialAmount, setInitialAmount] = useState("0");
  const [annualRate, setAnnualRate] = useState("7");
  const [years, setYears] = useState("20");
  const [useNisa, setUseNisa] = useState(true);

  const result = useMemo(() => {
    const m = parseFloat(monthly) * 10000;
    const init = parseFloat(initialAmount) * 10000 || 0;
    const rate = parseFloat(annualRate) / 100 / 12;
    const n = parseInt(years) * 12;
    if (!m || !n) return null;

    // 将来価値
    let fv = init * Math.pow(1 + rate, n);
    if (rate > 0) {
      fv += m * (Math.pow(1 + rate, n) - 1) / rate;
    } else {
      fv += m * n;
    }
    const totalPaid = m * n + init;
    const profit = fv - totalPaid;
    const taxRate = useNisa ? 0 : 0.20315;
    const afterTaxProfit = profit * (1 - taxRate);
    const afterTaxTotal = totalPaid + afterTaxProfit;
    const nisaSaving = profit * 0.20315;

    // 年別推移データ（10年ごと）
    const milestones = [5, 10, 15, 20, 25, 30].filter((y) => y <= parseInt(years));
    const milestoneData = milestones.map((y) => {
      const nY = y * 12;
      let fvY = init * Math.pow(1 + rate, nY);
      if (rate > 0) fvY += m * (Math.pow(1 + rate, nY) - 1) / rate;
      else fvY += m * nY;
      return { year: y, amount: Math.round(fvY) };
    });

    return {
      futureValue: Math.round(fv),
      totalPaid: Math.round(totalPaid),
      profit: Math.round(profit),
      afterTaxTotal: Math.round(afterTaxTotal),
      nisaSaving: Math.round(nisaSaving),
      milestoneData,
      doubleYears: Math.ceil(Math.log(2) / Math.log(1 + parseFloat(annualRate) / 100)),
    };
  }, [monthly, initialAmount, annualRate, years, useNisa]);

  const formatMan = (n: number) => `${(n / 10000).toFixed(0)}万円`;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">インデックス投資シミュレーター</h1>
      <p className="text-gray-600 mb-6">毎月の積立額・年利・期間から将来の資産をシミュレーション。複利の力を確認しましょう。</p>
      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">参考リターン（プリセット）</label>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((p) => (
              <button key={p.label} onClick={() => setAnnualRate(String(p.rate))}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${annualRate === String(p.rate) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"}`}>
                {p.icon} {p.label}（{p.rate}%）
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">毎月の積立額（万円）</label>
            <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} placeholder="例: 5" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">初期投資額（万円）</label>
            <input type="number" value={initialAmount} onChange={(e) => setInitialAmount(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">年間リターン（%）</label>
            <input type="number" step="0.1" value={annualRate} onChange={(e) => setAnnualRate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">投資期間（年）</label>
            <div className="flex gap-1 flex-wrap mb-1">
              {[10,20,30,40].map((y) => (
                <button key={y} onClick={() => setYears(String(y))}
                  className={`px-2 py-1 rounded text-xs border ${years === String(y) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-300"}`}>
                  {y}年
                </button>
              ))}
            </div>
            <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={useNisa} onChange={(e) => setUseNisa(e.target.checked)} />
          NISA（非課税）で運用する
        </label>
      </div>

      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">{years}年後の試算結果</h2>
          <div className="bg-white rounded-xl p-5 text-center mb-4">
            <p className="text-sm text-gray-600">最終資産額{useNisa ? "（非課税）" : "（税引き後）"}</p>
            <p className="text-5xl font-bold text-blue-600">{formatMan(useNisa ? result.futureValue : result.afterTaxTotal)}</p>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">元本</p>
              <p className="text-lg font-bold text-gray-700">{formatMan(result.totalPaid)}</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">運用益</p>
              <p className="text-lg font-bold text-green-600">+{formatMan(result.profit)}</p>
            </div>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">倍率</p>
              <p className="text-lg font-bold text-blue-600">{(result.futureValue / result.totalPaid).toFixed(1)}倍</p>
            </div>
          </div>
          {useNisa && result.nisaSaving > 0 && (
            <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center mb-4">
              <p className="text-sm text-green-700">NISA非課税メリット: <strong>+{formatMan(result.nisaSaving)}</strong></p>
            </div>
          )}
          {result.milestoneData.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">年別資産推移</p>
              <div className="space-y-2">
                {result.milestoneData.map((m) => (
                  <div key={m.year} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-10">{m.year}年後</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative overflow-hidden">
                      <div className="absolute left-0 top-0 h-4 rounded-full bg-blue-500" style={{ width: `${Math.min(100, m.amount / result.futureValue * 100)}%` }} />
                    </div>
                    <span className="text-xs font-bold text-blue-600 w-20 text-right">{formatMan(m.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-3">※シミュレーションは一定利回りの仮定です。実際の投資結果を保証するものではありません。</p>
        </div>
      )}

      <AdBanner />

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">月3万円を30年積み立てると？</h3><p className="text-sm text-gray-600 mt-1">年利7%の場合、元本1,080万円が約3,653万円に増えます。元本の約3.4倍です。複利の力で後半の増加が加速します。</p></div>
          <div><h3 className="font-medium text-gray-900">新NISAの年間投資上限はいくらですか？</h3><p className="text-sm text-gray-600 mt-1">新NISA（2024年〜）は成長投資枠240万円＋積立投資枠120万円＝年間360万円、生涯投資上限1,800万円です。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="nikkei-return-calc" />
    </main>
  );
}
