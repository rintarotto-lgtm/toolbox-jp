"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── FAQ
const FAQS = [
  {
    question: "老後に2000万円が必要と言われる理由は？",
    answer:
      "金融庁の報告書（2019年）で、夫婦2人の場合に公的年金だけでは月5.5万円の赤字が生じ、30年間で約2,000万円の資産取崩しが必要と試算されたためです。現在は年金額や物価も変動しているため、個人の状況に合わせた計算が重要です。",
  },
  {
    question: "老後の生活費は月いくら必要ですか？",
    answer:
      "総務省の家計調査では、65歳以上の無職夫婦世帯の平均支出は約25〜27万円/月です。単身の場合は約15〜16万円程度です。",
  },
  {
    question: "老後資金の積立はいつから始めるべきですか？",
    answer:
      "早ければ早いほど効果的です。30代から始めると複利効果で60代には大きな資産になります。iDeCo・NISAを活用した税制優遇のある積立が効率的です。",
  },
  {
    question: "公的年金は月いくらもらえますか？",
    answer:
      "2024年度の平均受給額は、厚生年金（夫婦）で約22〜23万円/月、国民年金（単身）で約6.7万円/月です。加入期間や収入によって大きく異なります。",
  },
];

function formatMan(n: number): string {
  const man = Math.round(n / 10_000);
  return `${man.toLocaleString("ja-JP")}万円`;
}

function calcRetirement(
  currentAge: number,
  retirementAge: number,
  monthlyCost: number,       // 万円
  monthlyPension: number,    // 万円
  retirementYears: number,
  currentSavings: number,    // 万円
  monthlyContrib: number,    // 万円
  returnRate: number         // %
) {
  const savingsYen = currentSavings * 10_000;
  const monthlyContribYen = monthlyContrib * 10_000;

  const yearsToRetire = Math.max(0, retirementAge - currentAge);
  const n = yearsToRetire;
  const r = returnRate / 100;

  // 退職時資産
  let retirementAsset: number;
  if (r === 0) {
    retirementAsset = savingsYen + monthlyContribYen * 12 * n;
  } else {
    const futureCurrentSavings = savingsYen * Math.pow(1 + r, n);
    const futureContribs =
      monthlyContribYen * ((Math.pow(1 + r / 12, n * 12) - 1) / (r / 12));
    retirementAsset = futureCurrentSavings + futureContribs;
  }

  // 老後必要資金（毎月の不足分 × 12 × 老後期間）
  const monthlyShortfall = Math.max(0, (monthlyCost - monthlyPension) * 10_000);
  const totalNeeded = monthlyShortfall * 12 * retirementYears;

  // 不足 / 余剰
  const gap = totalNeeded - retirementAsset; // 正=不足, 負=余剰

  // 不足を補うための追加積立額（月額）
  let additionalMonthly = 0;
  if (gap > 0 && yearsToRetire > 0) {
    if (r === 0) {
      additionalMonthly = gap / (12 * n);
    } else {
      additionalMonthly = gap / ((Math.pow(1 + r / 12, n * 12) - 1) / (r / 12));
    }
  }

  // 年齢別資産推移（積立期間）
  const assetByAge: { age: number; asset: number }[] = [];
  for (let age = currentAge; age <= retirementAge + retirementYears; age++) {
    const yr = age - currentAge;
    if (age <= retirementAge) {
      // 積立期間
      let asset: number;
      if (r === 0) {
        asset = savingsYen + monthlyContribYen * 12 * yr;
      } else {
        const fcs = savingsYen * Math.pow(1 + r, yr);
        const fc = monthlyContribYen * ((Math.pow(1 + r / 12, yr * 12) - 1) / (r / 12));
        asset = fcs + fc;
      }
      assetByAge.push({ age, asset: Math.round(asset) });
    } else {
      // 取崩し期間
      const yearsIntoRetirement = age - retirementAge;
      const drawdown = monthlyShortfall * 12 * yearsIntoRetirement;
      const asset = Math.max(0, retirementAsset - drawdown);
      assetByAge.push({ age, asset: Math.round(asset) });
    }
  }

  return {
    yearsToRetire,
    retirementAsset: Math.round(retirementAsset),
    totalNeeded: Math.round(totalNeeded),
    gap: Math.round(gap),
    additionalMonthly: Math.round(additionalMonthly),
    assetByAge,
  };
}

export default function RetirementSavings() {
  const [currentAge, setCurrentAge] = useState(35);
  const [retirementAge, setRetirementAge] = useState(65);
  const [monthlyCost, setMonthlyCost] = useState(25);
  const [monthlyPension, setMonthlyPension] = useState(15);
  const [retirementYears, setRetirementYears] = useState(30);
  const [currentSavings, setCurrentSavings] = useState(200);
  const [monthlyContrib, setMonthlyContrib] = useState(5);
  const [returnRate, setReturnRate] = useState(3);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(
    () =>
      calcRetirement(
        currentAge,
        retirementAge,
        monthlyCost,
        monthlyPension,
        retirementYears,
        currentSavings,
        monthlyContrib,
        returnRate
      ),
    [currentAge, retirementAge, monthlyCost, monthlyPension, retirementYears, currentSavings, monthlyContrib, returnRate]
  );

  // グラフ用スケール
  const maxAsset = Math.max(...result.assetByAge.map((d) => d.asset), 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヒーローヘッダー ─── */}
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🏖️</span>
          <h1 className="text-2xl font-bold">老後資金シミュレーター</h1>
        </div>
        <p className="text-sm opacity-90">
          現在の年齢・貯蓄額・積立額から退職時の資産と老後の不足額を計算します。
        </p>
      </div>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-800">条件を入力</h2>

        {/* 現在の年齢 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            現在の年齢
          </label>
          <input
            type="range"
            min={20}
            max={65}
            step={1}
            value={currentAge}
            onChange={(e) => {
              const v = Number(e.target.value);
              setCurrentAge(v);
              if (retirementAge <= v) setRetirementAge(Math.min(v + 1, 70));
            }}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-violet-600
              bg-gradient-to-r from-violet-200 to-violet-500"
          />
          <p className="text-center text-xl font-bold text-violet-700 mt-1">{currentAge}歳</p>
        </div>

        {/* 退職予定年齢 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            退職予定年齢
          </label>
          <input
            type="range"
            min={50}
            max={70}
            step={1}
            value={retirementAge}
            onChange={(e) => setRetirementAge(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-purple-500
              bg-gradient-to-r from-purple-200 to-purple-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>50歳</span><span>55歳</span><span>60歳</span><span>65歳</span><span>70歳</span>
          </div>
          <p className="text-center text-xl font-bold text-purple-700 mt-1">{retirementAge}歳
            <span className="text-sm font-normal text-gray-500 ml-2">（積立期間: {result.yearsToRetire}年）</span>
          </p>
        </div>

        {/* 老後の生活費目標 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            老後の生活費目標（月額）
          </label>
          <input
            type="range"
            min={10}
            max={50}
            step={1}
            value={monthlyCost}
            onChange={(e) => setMonthlyCost(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-fuchsia-500
              bg-gradient-to-r from-fuchsia-200 to-fuchsia-400"
          />
          <p className="text-center text-xl font-bold text-fuchsia-700 mt-1">{monthlyCost}万円/月</p>
        </div>

        {/* 想定年金受給額 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            想定年金受給額（月額）
          </label>
          <input
            type="range"
            min={0}
            max={30}
            step={0.5}
            value={monthlyPension}
            onChange={(e) => setMonthlyPension(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-indigo-500
              bg-gradient-to-r from-indigo-200 to-indigo-400"
          />
          <p className="text-center text-xl font-bold text-indigo-700 mt-1">{monthlyPension}万円/月</p>
        </div>

        {/* 老後期間 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            老後の想定期間
          </label>
          <input
            type="range"
            min={10}
            max={40}
            step={1}
            value={retirementYears}
            onChange={(e) => setRetirementYears(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-violet-400
              bg-gradient-to-r from-violet-100 to-violet-300"
          />
          <p className="text-center text-xl font-bold text-violet-600 mt-1">{retirementYears}年間</p>
        </div>

        {/* 現在の貯蓄額 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            現在の貯蓄額
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={100000}
              step={10}
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Math.max(0, Number(e.target.value)))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400 text-sm"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">万円</span>
          </div>
        </div>

        {/* 毎月の積立額 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            毎月の積立額
          </label>
          <input
            type="range"
            min={0}
            max={50}
            step={0.5}
            value={monthlyContrib}
            onChange={(e) => setMonthlyContrib(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-purple-600
              bg-gradient-to-r from-purple-200 to-purple-500"
          />
          <p className="text-center text-xl font-bold text-purple-700 mt-1">{monthlyContrib}万円/月</p>
        </div>

        {/* 想定運用利率 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            想定運用利率（年）
          </label>
          <input
            type="range"
            min={0}
            max={7}
            step={0.5}
            value={returnRate}
            onChange={(e) => setReturnRate(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-violet-500
              bg-gradient-to-r from-violet-100 to-violet-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span><span>1%</span><span>3%</span><span>5%</span><span>7%</span>
          </div>
          <p className="text-center text-xl font-bold text-violet-700 mt-1">年 {returnRate}%</p>
        </div>
      </div>

      {/* ─── 結果カード ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {/* 老後必要資金 */}
        <div className="sm:col-span-3 bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-80 mb-1">老後必要資金（{retirementYears}年間）</p>
          <p className="text-4xl font-extrabold tracking-tight">
            {formatMan(result.totalNeeded)}
          </p>
          <p className="text-xs opacity-70 mt-1">
            月不足額 {Math.max(0, monthlyCost - monthlyPension).toLocaleString("ja-JP")}万円 × 12ヶ月 × {retirementYears}年
          </p>
        </div>

        {/* 退職時の予想資産 */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
          <p className="text-xs text-purple-600 mb-1">退職時の予想資産</p>
          <p className="text-2xl font-bold text-purple-700">{formatMan(result.retirementAsset)}</p>
        </div>

        {/* 不足 / 余剰 */}
        <div className={`rounded-xl p-4 text-center border ${
          result.gap > 0
            ? "bg-red-50 border-red-200"
            : "bg-green-50 border-green-200"
        }`}>
          <p className={`text-xs mb-1 ${result.gap > 0 ? "text-red-600" : "text-green-600"}`}>
            {result.gap > 0 ? "不足額" : "余剰額"}
          </p>
          <p className={`text-2xl font-bold ${result.gap > 0 ? "text-red-600" : "text-green-600"}`}>
            {result.gap > 0 ? "−" : "+"}{formatMan(Math.abs(result.gap))}
          </p>
        </div>

        {/* 追加積立が必要な場合 */}
        <div className={`rounded-xl p-4 text-center border ${
          result.gap > 0
            ? "bg-orange-50 border-orange-200"
            : "bg-emerald-50 border-emerald-200"
        }`}>
          {result.gap > 0 ? (
            <>
              <p className="text-xs text-orange-600 mb-1">不足を補う追加積立（月額）</p>
              <p className="text-2xl font-bold text-orange-600">
                +{(result.additionalMonthly / 10_000).toFixed(1)}万円/月
              </p>
            </>
          ) : (
            <>
              <p className="text-xs text-emerald-600 mb-1">目標達成</p>
              <p className="text-2xl font-bold text-emerald-600">余裕あり ✓</p>
            </>
          )}
        </div>
      </div>

      <AdBanner />

      {/* ─── 年齢別資産推移グラフ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">年齢別 資産推移</h2>
        <div className="overflow-x-auto">
          <div className="flex items-end gap-1 min-w-max" style={{ height: 160 }}>
            {result.assetByAge
              .filter((_, i) => i % Math.max(1, Math.floor(result.assetByAge.length / 30)) === 0)
              .map(({ age, asset }) => {
                const heightPct = (asset / maxAsset) * 100;
                const isRetired = age > retirementAge;
                return (
                  <div key={age} className="flex flex-col items-center" style={{ width: 18 }}>
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        isRetired ? "bg-orange-300" : "bg-violet-400"
                      }`}
                      style={{ height: `${Math.max(2, heightPct)}%` }}
                      title={`${age}歳: ${formatMan(asset)}`}
                    />
                    {age % 10 === 0 && (
                      <span className="text-xs text-gray-400 mt-0.5">{age}</span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        <div className="flex gap-4 text-xs text-gray-600 mt-3">
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-violet-400" />積立期間
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded bg-orange-300" />取崩し期間
          </span>
        </div>
      </div>

      {/* ─── iDeCo・NISA活用ヒント ─── */}
      <div className="bg-violet-50 border border-violet-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-bold text-violet-800 mb-3">💡 iDeCo・NISA活用ヒント</h2>
        <ul className="space-y-2 text-sm text-violet-700">
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span><strong>iDeCo</strong>：掛金が全額所得控除になり節税しながら積立可能。60歳まで引き出せない点に注意。</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span><strong>NISA（成長投資枠）</strong>：年間240万円まで非課税で投資可能。いつでも引き出せる柔軟性が特徴。</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span><strong>積立NISA枠</strong>：年間120万円まで積立可能。長期・分散・積立に最適な制度です。</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span>老後資金は <strong>iDeCo → NISA</strong> の順に税制優遇を活用するのが基本戦略です。</span>
          </li>
        </ul>
      </div>

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-violet-600"
              >
                <span>{faq.question}</span>
                <span className="text-gray-400 ml-2 shrink-0 text-base">
                  {openFaq === i ? "−" : "＋"}
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="retirement-savings" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。実際の年金受給額・運用実績・税制は個人の状況によって大きく異なります。
        老後の資産計画については、ファイナンシャルプランナーや金融機関にご相談ください。
        入力情報はブラウザ上でのみ処理され、サーバーへ送信されることは一切ありません。
      </p>
    </div>
  );
}
