"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── FAQ
const FAQS = [
  {
    question: "生命保険の必要保障額はいくらですか？",
    answer:
      "遺族に必要な生活費の総額から、公的遺族年金・現在の貯蓄・配偶者の収入見込みを差し引いた金額が必要保障額です。子どもの年齢や教育方針によって大きく異なります。",
  },
  {
    question: "独身者に生命保険は必要ですか？",
    answer:
      "扶養家族がいない独身者には死亡保険は基本不要とされています。ただし就業不能保険（収入保障）は、自分自身が病気・ケガで働けなくなった場合の備えとして重要です。",
  },
  {
    question: "子どもが生まれたら保険はどう変わりますか？",
    answer:
      "子どもが生まれると必要保障額が大幅に増えます。子どもが独立するまでの生活費・教育費を賄える保険金額が必要です。定期保険（掛け捨て）が費用対効果に優れています。",
  },
  {
    question: "住宅ローンがあると保険は不要ですか？",
    answer:
      "住宅ローンには団体信用生命保険（団信）が付いているため、住宅ローン相当の保障は既にあります。ただし生活費・教育費・その他債務の保障は別途必要です。",
  },
];

// 教育費の目安（万円）: 公立/私立, 幼稚園〜大学
const EDU_COST_PUBLIC = 1000;   // 幼稚園〜大学 公立
const EDU_COST_PRIVATE = 2200;  // 幼稚園〜大学 私立

// 遺族厚生年金の概算（配偶者あり、子なし）: 月約10万円
const SURVIVOR_PENSION_WITH_SPOUSE_MONTHLY = 10; // 万円
// 子あり: 子1人につき約1万円加算（概算）
const SURVIVOR_PENSION_PER_CHILD = 1; // 万円/月

type MaritalStatus = "独身" | "既婚";
type SpouseWork = "フルタイム" | "パートタイム" | "無職";
type EducationType = "公立" | "私立";

interface ChildInfo {
  age: number;
  eduType: EducationType;
}

function calcInsurance(
  age: number,
  annualIncome: number,         // 万円 手取り
  maritalStatus: MaritalStatus,
  spouseIncome: number,         // 万円 手取り
  spouseWork: SpouseWork,
  children: ChildInfo[],
  savings: number,              // 万円
  mortgageDanjin: boolean,      // 住宅ローン団信適用
  otherLoan: number,            // 万円
  monthlyLivingCost: number,    // 万円
  coveragePeriod: number        // 年
) {
  const numChildren = children.length;

  // 遺族が必要な生活費の総額
  const totalLivingCost = monthlyLivingCost * 12 * coveragePeriod;

  // 教育費合計
  let totalEducation = 0;
  children.forEach((child) => {
    const yearsLeft = Math.max(0, 22 - child.age); // 22歳独立想定
    const fullCost = child.eduType === "公立" ? EDU_COST_PUBLIC : EDU_COST_PRIVATE;
    const ratio = Math.min(1, yearsLeft / 22);
    totalEducation += Math.round(fullCost * ratio);
  });

  // その他ローン（団信以外）
  const otherDebt = otherLoan;

  // 遺族必要総額
  const totalNeeded = totalLivingCost + totalEducation + otherDebt;

  // 公的遺族年金概算（月額）
  let survivorPensionMonthly = 0;
  if (maritalStatus === "既婚") {
    survivorPensionMonthly = SURVIVOR_PENSION_WITH_SPOUSE_MONTHLY + numChildren * SURVIVOR_PENSION_PER_CHILD;
  } else if (numChildren > 0) {
    survivorPensionMonthly = numChildren * SURVIVOR_PENSION_PER_CHILD;
  }
  const totalSurvivorPension = survivorPensionMonthly * 12 * coveragePeriod;

  // 配偶者収入見込み（保障期間中の総額）
  let spouseIncomeTotal = 0;
  if (maritalStatus === "既婚") {
    const effectiveSpouseIncome =
      spouseWork === "フルタイム" ? spouseIncome :
      spouseWork === "パートタイム" ? Math.round(spouseIncome * 0.5) : 0;
    spouseIncomeTotal = effectiveSpouseIncome * coveragePeriod;
  }

  // 差し引き必要保障額
  const requiredCoverage = Math.max(
    0,
    totalNeeded - totalSurvivorPension - savings - spouseIncomeTotal
  );

  // 保険料目安（30年定期、30歳男性 1000万円 約1,500円/月 → 1.5円/万円/月）
  const premiumEstimate = Math.round((requiredCoverage / 1000) * 1500);

  return {
    totalLivingCost: Math.round(totalLivingCost),
    totalEducation: Math.round(totalEducation),
    otherDebt: Math.round(otherDebt),
    totalNeeded: Math.round(totalNeeded),
    totalSurvivorPension: Math.round(totalSurvivorPension),
    survivorPensionMonthly,
    savings: Math.round(savings),
    spouseIncomeTotal: Math.round(spouseIncomeTotal),
    requiredCoverage: Math.round(requiredCoverage),
    premiumEstimate,
  };
}

export default function InsuranceCalc() {
  const [age, setAge] = useState(35);
  const [annualIncome, setAnnualIncome] = useState(500);
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>("既婚");
  const [spouseIncome, setSpouseIncome] = useState(200);
  const [spouseWork, setSpouseWork] = useState<SpouseWork>("パートタイム");
  const [numChildren, setNumChildren] = useState(1);
  const [childAges, setChildAges] = useState<number[]>([3]);
  const [childEduTypes, setChildEduTypes] = useState<EducationType[]>(["公立"]);
  const [savings, setSavings] = useState(300);
  const [mortgageDanjin, setMortgageDanjin] = useState(true);
  const [otherLoan, setOtherLoan] = useState(0);
  const [monthlyLivingCost, setMonthlyLivingCost] = useState(25);
  const [coveragePeriod, setCoveragePeriod] = useState(20);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 子どもの数変化に応じて配列を調整
  const handleNumChildrenChange = (n: number) => {
    setNumChildren(n);
    setChildAges((prev) => {
      const next = [...prev];
      while (next.length < n) next.push(5);
      return next.slice(0, n);
    });
    setChildEduTypes((prev) => {
      const next = [...prev];
      while (next.length < n) next.push("公立");
      return next.slice(0, n);
    });
  };

  const children: ChildInfo[] = childAges.slice(0, numChildren).map((a, i) => ({
    age: a,
    eduType: childEduTypes[i] ?? "公立",
  }));

  const result = useMemo(
    () =>
      calcInsurance(
        age,
        annualIncome,
        maritalStatus,
        spouseIncome,
        spouseWork,
        children,
        savings,
        mortgageDanjin,
        otherLoan,
        monthlyLivingCost,
        coveragePeriod
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [age, annualIncome, maritalStatus, spouseIncome, spouseWork, JSON.stringify(children), savings, mortgageDanjin, otherLoan, monthlyLivingCost, coveragePeriod]
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヒーローヘッダー ─── */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🛡️</span>
          <h1 className="text-2xl font-bold">生命保険必要額計算</h1>
        </div>
        <p className="text-sm opacity-90">
          家族構成・収入・貯蓄から万が一の際に必要な保険金額をシミュレーションします。
        </p>
      </div>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-800">家族・収入情報</h2>

        {/* 本人の年齢 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">本人の年齢</label>
          <input
            type="range"
            min={20}
            max={70}
            step={1}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-blue-600
              bg-gradient-to-r from-blue-200 to-blue-500"
          />
          <p className="text-center text-xl font-bold text-blue-700 mt-1">{age}歳</p>
        </div>

        {/* 本人の年収（手取り） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">年収（手取り）</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={10000}
              step={50}
              value={annualIncome}
              onChange={(e) => setAnnualIncome(Math.max(0, Number(e.target.value)))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">万円</span>
          </div>
        </div>

        {/* 配偶者 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">配偶者</label>
          <div className="flex gap-3">
            {(["既婚", "独身"] as MaritalStatus[]).map((s) => (
              <button
                key={s}
                onClick={() => setMaritalStatus(s)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  maritalStatus === s
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {maritalStatus === "既婚" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">配偶者の就労状況</label>
              <div className="flex gap-2 flex-wrap">
                {(["フルタイム", "パートタイム", "無職"] as SpouseWork[]).map((w) => (
                  <button
                    key={w}
                    onClick={() => setSpouseWork(w)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                      spouseWork === w
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            {spouseWork !== "無職" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">配偶者の年収（手取り）</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={5000}
                    step={50}
                    value={spouseIncome}
                    onChange={(e) => setSpouseIncome(Math.max(0, Number(e.target.value)))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                  />
                  <span className="text-sm text-gray-600 whitespace-nowrap">万円</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* 子どもの数 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">子どもの数</label>
          <div className="flex gap-3">
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => handleNumChildrenChange(n)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                  numChildren === n
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                }`}
              >
                {n}人
              </button>
            ))}
          </div>
        </div>

        {/* 子どもの年齢・教育方針 */}
        {numChildren > 0 && (
          <div className="space-y-4">
            {Array.from({ length: numChildren }).map((_, i) => (
              <div key={i} className="bg-blue-50 rounded-xl p-4 space-y-3">
                <p className="text-sm font-semibold text-blue-800">第{i + 1}子</p>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">年齢</label>
                  <input
                    type="range"
                    min={0}
                    max={20}
                    step={1}
                    value={childAges[i] ?? 5}
                    onChange={(e) => {
                      const next = [...childAges];
                      next[i] = Number(e.target.value);
                      setChildAges(next);
                    }}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-blue-500"
                  />
                  <p className="text-center text-base font-bold text-blue-700 mt-1">{childAges[i] ?? 5}歳</p>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">教育方針</label>
                  <div className="flex gap-2">
                    {(["公立", "私立"] as EducationType[]).map((e) => (
                      <button
                        key={e}
                        onClick={() => {
                          const next = [...childEduTypes];
                          next[i] = e;
                          setChildEduTypes(next);
                        }}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          (childEduTypes[i] ?? "公立") === e
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-600 border-gray-300"
                        }`}
                      >
                        {e}（目安 {e === "公立" ? EDU_COST_PUBLIC : EDU_COST_PRIVATE}万円）
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── 資産・負債 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-800">現在の資産・負債</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">現在の貯蓄額</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={100000}
              step={50}
              value={savings}
              onChange={(e) => setSavings(Math.max(0, Number(e.target.value)))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">万円</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">住宅ローン（団信）</label>
          <div className="flex gap-3">
            <button
              onClick={() => setMortgageDanjin(true)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                mortgageDanjin
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
              }`}
            >
              団信あり（ゼロ扱い）
            </button>
            <button
              onClick={() => setMortgageDanjin(false)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all ${
                !mortgageDanjin
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
              }`}
            >
              団信なし
            </button>
          </div>
          {mortgageDanjin && (
            <p className="text-xs text-gray-500 mt-1">住宅ローンは団信により完済扱いのため計算に含めません。</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">その他ローン残高</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={5000}
              step={10}
              value={otherLoan}
              onChange={(e) => setOtherLoan(Math.max(0, Number(e.target.value)))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">万円</span>
          </div>
        </div>
      </div>

      {/* ─── 遺族の生活費 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-800">遺族の生活費</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">月間生活費目標</label>
          <input
            type="range"
            min={10}
            max={50}
            step={1}
            value={monthlyLivingCost}
            onChange={(e) => setMonthlyLivingCost(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-blue-600
              bg-gradient-to-r from-blue-200 to-blue-500"
          />
          <p className="text-center text-xl font-bold text-blue-700 mt-1">{monthlyLivingCost}万円/月</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">生活費保障期間</label>
          <input
            type="range"
            min={5}
            max={40}
            step={1}
            value={coveragePeriod}
            onChange={(e) => setCoveragePeriod(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-indigo-500
              bg-gradient-to-r from-indigo-200 to-indigo-400"
          />
          <p className="text-center text-xl font-bold text-indigo-700 mt-1">{coveragePeriod}年間</p>
        </div>
      </div>

      {/* ─── 結果カード ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* 必要保障額 大カード */}
        <div className="sm:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-80 mb-1">必要保障額（死亡保険）</p>
          <p className="text-4xl font-extrabold tracking-tight">
            {result.requiredCoverage.toLocaleString("ja-JP")}万円
          </p>
          <p className="text-xs opacity-70 mt-1">
            遺族必要総額 − 遺族年金 − 貯蓄 − 配偶者収入
          </p>
        </div>

        {/* 保険料目安 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-xs text-blue-600 mb-1">保険料の目安（定期保険30年）</p>
          <p className="text-2xl font-bold text-blue-700">
            {result.premiumEstimate > 0 ? `約${result.premiumEstimate.toLocaleString("ja-JP")}円/月` : "—"}
          </p>
          <p className="text-xs text-gray-400 mt-1">※30歳男性・健康体の概算</p>
        </div>

        {/* 遺族年金概算 */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
          <p className="text-xs text-indigo-600 mb-1">公的遺族年金概算（月額）</p>
          <p className="text-2xl font-bold text-indigo-700">{result.survivorPensionMonthly}万円/月</p>
          <p className="text-xs text-gray-400 mt-1">厚生年金加入者の概算値</p>
        </div>
      </div>

      <AdBanner />

      {/* ─── 内訳テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">必要保障額の内訳</h2>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-3 text-gray-600">遺族の生活費（{coveragePeriod}年間）</td>
              <td className="py-3 text-right font-semibold text-gray-800">
                +{result.totalLivingCost.toLocaleString("ja-JP")}万円
              </td>
            </tr>
            {result.totalEducation > 0 && (
              <tr>
                <td className="py-3 text-gray-600">子どもの教育費</td>
                <td className="py-3 text-right font-semibold text-gray-800">
                  +{result.totalEducation.toLocaleString("ja-JP")}万円
                </td>
              </tr>
            )}
            {result.otherDebt > 0 && (
              <tr>
                <td className="py-3 text-gray-600">その他ローン</td>
                <td className="py-3 text-right font-semibold text-gray-800">
                  +{result.otherDebt.toLocaleString("ja-JP")}万円
                </td>
              </tr>
            )}
            <tr className="bg-gray-50">
              <td className="py-3 text-gray-700 font-semibold">遺族必要総額</td>
              <td className="py-3 text-right font-bold text-gray-900">
                {result.totalNeeded.toLocaleString("ja-JP")}万円
              </td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600">− 公的遺族年金（{coveragePeriod}年間）</td>
              <td className="py-3 text-right font-semibold text-green-600">
                −{result.totalSurvivorPension.toLocaleString("ja-JP")}万円
              </td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600">− 現在の貯蓄</td>
              <td className="py-3 text-right font-semibold text-green-600">
                −{result.savings.toLocaleString("ja-JP")}万円
              </td>
            </tr>
            {result.spouseIncomeTotal > 0 && (
              <tr>
                <td className="py-3 text-gray-600">− 配偶者の収入見込み（{coveragePeriod}年間）</td>
                <td className="py-3 text-right font-semibold text-green-600">
                  −{result.spouseIncomeTotal.toLocaleString("ja-JP")}万円
                </td>
              </tr>
            )}
            <tr className="border-t-2 border-blue-300">
              <td className="py-3 text-blue-700 font-bold">保険で準備が必要な額</td>
              <td className="py-3 text-right font-extrabold text-blue-700 text-lg">
                {result.requiredCoverage.toLocaleString("ja-JP")}万円
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ─── 保険選びのポイント ─── */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-bold text-blue-800 mb-3">💡 生命保険を選ぶポイント</h2>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span><strong>定期保険（掛け捨て）</strong>：保険料が安く、子どもが成人するまでの期間に最適。終身保険より費用対効果が高いです。</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span><strong>収入保障保険</strong>：死亡時に毎月一定額が支払われる保険。子どもが小さいうちほど受取総額が大きくなります。</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span><strong>必要保障額は年々減る</strong>：子どもが成長するにつれ教育費負担が減るため、定期的に見直しましょう。</span>
          </li>
          <li className="flex gap-2">
            <span className="shrink-0">•</span>
            <span><strong>就業不能保険も検討</strong>：死亡より病気・ケガで働けなくなる確率の方が高いため、就業不能保険も重要です。</span>
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
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-blue-600"
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

      <RelatedTools currentToolId="insurance-calc" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。遺族年金・保険料は年齢・健康状態・加入状況によって異なります。
        保険の選択については、ファイナンシャルプランナーや保険代理店にご相談ください。
        入力情報はブラウザ上でのみ処理され、サーバーへ送信されることは一切ありません。
      </p>
    </div>
  );
}
