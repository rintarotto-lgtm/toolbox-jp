"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── FAQ
const FAQS = [
  {
    question: "FIREに必要な資産額の計算方法は？",
    answer:
      "「年間生活費 × 25」がFIRE資産の目安です（4%ルール）。年間300万円で生活するなら7,500万円が必要です。資産の4%を毎年取り崩しても30年以上資産が持続するという研究（トリニティスタディ）に基づきます。",
  },
  {
    question: "4%ルールとは何ですか？",
    answer:
      "資産の4%以下を毎年取り崩せば理論上資産は枯渇しないという投資の法則です。年率7%の運用リターンからインフレ率3%を引いた実質4%の成長が続くという前提に基づきます。",
  },
  {
    question: "サイドFIREとは何ですか？",
    answer:
      "完全にFIREせず、生活費の一部をアルバイトや副業で賄いながら、残りを投資収益でカバーするFIREの亜種です。必要資産額を大幅に減らせます。",
  },
  {
    question: "FIREを目指すうえで最も効果的な戦略は？",
    answer:
      "収入を増やしながら支出を減らし、差額をインデックス投資（全世界株・S&P500等）に積立てることです。支出の削減はそのまま必要資産の削減にもつながります。",
  },
];

type FireType = "完全FIRE" | "サイドFIRE" | "バリスタFIRE";

function calcFire(
  currentAge: number,
  annualCost: number,       // 万円
  sideIncome: number,       // 万円（サイドFIRE・バリスタFIRE）
  withdrawalRate: number,   // %
  currentAssets: number,    // 万円
  monthlyContrib: number,   // 万円
  returnRate: number,       // %
  fireType: FireType
) {
  const effectiveSideIncome = fireType === "完全FIRE" ? 0 : sideIncome;
  const netAnnualCost = Math.max(0, annualCost - effectiveSideIncome);
  const fireTarget = netAnnualCost / (withdrawalRate / 100); // 万円

  const r = returnRate / 100;
  const monthlyR = r / 12;

  // 毎月積立で何年後にFIRE達成か
  let yearsToFire = 0;
  if (currentAssets >= fireTarget) {
    yearsToFire = 0;
  } else {
    // 月次複利で計算
    let asset = currentAssets;
    const contrib = monthlyContrib;
    let found = false;
    for (let m = 1; m <= 600; m++) {
      if (monthlyR > 0) {
        asset = asset * (1 + monthlyR) + contrib;
      } else {
        asset = asset + contrib;
      }
      if (asset >= fireTarget) {
        yearsToFire = m / 12;
        found = true;
        break;
      }
    }
    if (!found) yearsToFire = 999;
  }

  const fireAge = currentAge + yearsToFire;

  // 積立+1万円増やした場合の達成年数
  let yearsToFirePlus1 = 0;
  if (currentAssets >= fireTarget) {
    yearsToFirePlus1 = 0;
  } else {
    let asset = currentAssets;
    const contrib = monthlyContrib + 1;
    let found = false;
    for (let m = 1; m <= 600; m++) {
      if (monthlyR > 0) {
        asset = asset * (1 + monthlyR) + contrib;
      } else {
        asset = asset + contrib;
      }
      if (asset >= fireTarget) {
        yearsToFirePlus1 = m / 12;
        found = true;
        break;
      }
    }
    if (!found) yearsToFirePlus1 = 999;
  }

  const yearsSaved = yearsToFire - yearsToFirePlus1;

  // 資産推移グラフ用（達成後5年まで表示）
  const displayYears = Math.min(yearsToFire === 999 ? 40 : Math.ceil(yearsToFire) + 5, 50);
  const assetByYear: { year: number; age: number; asset: number }[] = [];
  let asset = currentAssets;
  for (let yr = 0; yr <= displayYears; yr++) {
    assetByYear.push({ year: yr, age: currentAge + yr, asset: Math.round(asset) });
    if (monthlyR > 0) {
      asset = asset * Math.pow(1 + monthlyR, 12) + monthlyContrib * ((Math.pow(1 + monthlyR, 12) - 1) / monthlyR);
    } else {
      asset = asset + monthlyContrib * 12;
    }
  }

  return {
    fireTarget: Math.round(fireTarget),
    yearsToFire,
    fireAge: Math.round(fireAge * 10) / 10,
    yearsSaved: Math.max(0, yearsSaved),
    assetByYear,
    netAnnualCost: Math.round(netAnnualCost),
  };
}

export default function FireCalc() {
  const [fireType, setFireType] = useState<FireType>("完全FIRE");
  const [currentAge, setCurrentAge] = useState(30);
  const [annualCost, setAnnualCost] = useState(300);
  const [sideIncome, setSideIncome] = useState(100);
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [currentAssets, setCurrentAssets] = useState(500);
  const [monthlyContrib, setMonthlyContrib] = useState(10);
  const [returnRate, setReturnRate] = useState(5);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(
    () =>
      calcFire(
        currentAge,
        annualCost,
        sideIncome,
        withdrawalRate,
        currentAssets,
        monthlyContrib,
        returnRate,
        fireType
      ),
    [currentAge, annualCost, sideIncome, withdrawalRate, currentAssets, monthlyContrib, returnRate, fireType]
  );

  const maxAsset = Math.max(...result.assetByYear.map((d) => d.asset), result.fireTarget, 1);

  const fireTypeLabels: FireType[] = ["完全FIRE", "サイドFIRE", "バリスタFIRE"];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヒーローヘッダー ─── */}
      <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🔥</span>
          <h1 className="text-2xl font-bold">FIRE計算シミュレーター</h1>
        </div>
        <p className="text-sm opacity-90">
          経済的自立・早期退職（FIRE）に必要な資産額と達成年齢を計算します。
        </p>
      </div>

      <AdBanner />

      {/* ─── FIRE種類タブ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-4">FIREの種類を選択</h2>
        <div className="flex gap-2 flex-wrap">
          {fireTypeLabels.map((label) => (
            <button
              key={label}
              onClick={() => setFireType(label)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                fireType === label
                  ? "bg-orange-500 text-white border-orange-500 shadow"
                  : "bg-white text-gray-600 border-gray-300 hover:border-orange-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          {fireType === "完全FIRE" && "投資収益のみで生活費を全額賄う完全な経済的自立です。"}
          {fireType === "サイドFIRE" && "副業・アルバイトで生活費の一部を賄い、残りを投資収益でカバーします。"}
          {fireType === "バリスタFIRE" && "カフェ等のパートタイムワークで収入を補いながら早期セミリタイアします。"}
        </p>
      </div>

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-800">条件を入力</h2>

        {/* 現在の年齢 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">現在の年齢</label>
          <input
            type="range"
            min={20}
            max={60}
            step={1}
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-orange-500
              bg-gradient-to-r from-yellow-200 to-orange-400"
          />
          <p className="text-center text-xl font-bold text-orange-600 mt-1">{currentAge}歳</p>
        </div>

        {/* 年間生活費目標 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年間生活費目標</label>
          <input
            type="range"
            min={100}
            max={1000}
            step={10}
            value={annualCost}
            onChange={(e) => setAnnualCost(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-orange-500
              bg-gradient-to-r from-yellow-200 to-orange-400"
          />
          <p className="text-center text-xl font-bold text-orange-600 mt-1">{annualCost}万円/年</p>
          <p className="text-center text-xs text-gray-400">月換算 {Math.round(annualCost / 12)}万円</p>
        </div>

        {/* サイドFIRE・バリスタFIRE: 副業年収 */}
        {fireType !== "完全FIRE" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              副業・バイト年収見込み
            </label>
            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={sideIncome}
              onChange={(e) => setSideIncome(Number(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer accent-yellow-500
                bg-gradient-to-r from-yellow-100 to-yellow-400"
            />
            <p className="text-center text-xl font-bold text-yellow-600 mt-1">{sideIncome}万円/年</p>
            <p className="text-center text-xs text-gray-400">
              純粋な投資収益でカバーが必要: {Math.max(0, annualCost - sideIncome)}万円/年
            </p>
          </div>
        )}

        {/* 取崩し率 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            取崩し率（4%ルール基準）
          </label>
          <input
            type="range"
            min={3}
            max={5}
            step={0.1}
            value={withdrawalRate}
            onChange={(e) => setWithdrawalRate(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-orange-400
              bg-gradient-to-r from-orange-100 to-orange-300"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>3%（保守的）</span><span>4%（標準）</span><span>5%（積極的）</span>
          </div>
          <p className="text-center text-xl font-bold text-orange-500 mt-1">{withdrawalRate.toFixed(1)}%</p>
        </div>

        {/* 現在の総資産 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">現在の総資産</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={100000}
              step={50}
              value={currentAssets}
              onChange={(e) => setCurrentAssets(Math.max(0, Number(e.target.value)))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">万円</span>
          </div>
        </div>

        {/* 毎月の積立額 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">毎月の積立額</label>
          <input
            type="range"
            min={1}
            max={100}
            step={1}
            value={monthlyContrib}
            onChange={(e) => setMonthlyContrib(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-orange-500
              bg-gradient-to-r from-yellow-200 to-orange-400"
          />
          <p className="text-center text-xl font-bold text-orange-600 mt-1">{monthlyContrib}万円/月</p>
        </div>

        {/* 想定年利 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">想定年利</label>
          <input
            type="range"
            min={1}
            max={10}
            step={0.5}
            value={returnRate}
            onChange={(e) => setReturnRate(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-orange-400
              bg-gradient-to-r from-orange-100 to-orange-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1%</span><span>3%</span><span>5%</span><span>7%</span><span>10%</span>
          </div>
          <p className="text-center text-xl font-bold text-orange-600 mt-1">年 {returnRate}%</p>
        </div>
      </div>

      {/* ─── 結果カード ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* FIRE必要資産 大カード */}
        <div className="sm:col-span-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-80 mb-1">FIRE必要資産額（{fireType}）</p>
          <p className="text-4xl font-extrabold tracking-tight">
            {result.fireTarget.toLocaleString("ja-JP")}万円
          </p>
          <p className="text-xs opacity-70 mt-1">
            年間支出 {result.netAnnualCost}万円 ÷ 取崩し率 {withdrawalRate}%
          </p>
        </div>

        {/* 目標達成年齢 */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-xs text-orange-600 mb-1">目標達成年齢</p>
          {result.yearsToFire === 999 ? (
            <p className="text-2xl font-bold text-orange-700">達成困難</p>
          ) : (
            <>
              <p className="text-3xl font-bold text-orange-700">{Math.floor(result.fireAge)}歳</p>
              <p className="text-sm text-orange-500 mt-1">あと {result.yearsToFire.toFixed(1)}年</p>
            </>
          )}
        </div>

        {/* 積立を増やした場合の比較 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-xs text-yellow-700 mb-1">月1万円増やすと</p>
          {result.yearsSaved > 0 ? (
            <>
              <p className="text-3xl font-bold text-yellow-700">{result.yearsSaved.toFixed(1)}年</p>
              <p className="text-sm text-yellow-600 mt-1">早くFIREできます</p>
            </>
          ) : (
            <p className="text-2xl font-bold text-yellow-600">すでに達成済み</p>
          )}
        </div>
      </div>

      <AdBanner />

      {/* ─── 資産推移グラフ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">資産推移グラフ（現在〜FIRE達成）</h2>
        <div className="overflow-x-auto">
          <div className="flex items-end gap-1 min-w-max" style={{ height: 160 }}>
            {result.assetByYear
              .filter((_, i) => i % Math.max(1, Math.floor(result.assetByYear.length / 30)) === 0)
              .map(({ year, age, asset }) => {
                const heightPct = (asset / maxAsset) * 100;
                const isFired = result.yearsToFire !== 999 && year >= Math.ceil(result.yearsToFire);
                const isTarget = Math.abs(asset - result.fireTarget) / Math.max(result.fireTarget, 1) < 0.05;
                return (
                  <div key={year} className="flex flex-col items-center" style={{ width: 18 }}>
                    <div
                      className={`w-full rounded-t transition-all duration-300 ${
                        isFired ? "bg-orange-400" : isTarget ? "bg-yellow-400" : "bg-yellow-300"
                      }`}
                      style={{ height: `${Math.max(2, heightPct)}%` }}
                      title={`${age}歳: ${asset.toLocaleString("ja-JP")}万円`}
                    />
                    {age % 5 === 0 && (
                      <span className="text-xs text-gray-400 mt-0.5">{age}</span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
        {/* FIRE目標ライン */}
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <span className="inline-block w-3 h-3 rounded bg-yellow-300" />積立中
          <span className="inline-block w-3 h-3 rounded bg-orange-400 ml-3" />FIRE達成後
          <span className="ml-3 text-orange-500 font-semibold">目標: {result.fireTarget.toLocaleString("ja-JP")}万円</span>
        </div>
      </div>

      {/* ─── FIREの種類について ─── */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-bold text-orange-800 mb-3">💡 FIRE達成を早める戦略</h2>
        <ul className="space-y-2 text-sm text-orange-700">
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span><strong>支出削減が最強</strong>：年間生活費を10万円削減するだけで、必要資産が250万円（4%ルール）減ります。</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span><strong>NISA・iDeCoを活用</strong>：運用益が非課税になるため、同じリターンでも手取りが約20%増えます。</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span><strong>インデックス投資</strong>：全世界株式・S&P500などの長期積立が、コスト最小でリターンを最大化します。</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span><strong>サイドFIREも検討</strong>：月5万円の副業収入があれば、必要資産が1,500万円（4%ルール）減ります。</span>
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
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-orange-600"
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

      <RelatedTools currentToolId="fire-calc" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。実際の運用実績・税制・インフレ率は変動します。
        FIRE計画については、ファイナンシャルプランナー等の専門家にご相談ください。
        入力情報はブラウザ上でのみ処理され、サーバーへ送信されることは一切ありません。
      </p>
    </div>
  );
}
