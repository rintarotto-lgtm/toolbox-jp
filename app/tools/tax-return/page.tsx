"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 所得税（累進）
function calcIncomeTax(income: number): number {
  if (income <= 0) return 0;
  if (income <= 1_950_000) return income * 0.05;
  if (income <= 3_300_000) return income * 0.10 - 97_500;
  if (income <= 6_950_000) return income * 0.20 - 427_500;
  if (income <= 9_000_000) return income * 0.23 - 636_000;
  if (income <= 18_000_000) return income * 0.33 - 1_536_000;
  if (income <= 40_000_000) return income * 0.40 - 2_796_000;
  return income * 0.45 - 4_796_000;
}

// ─── 給与所得控除
function calcSalaryDeduction(salary: number): number {
  if (salary <= 1_625_000) return 550_000;
  if (salary <= 1_800_000) return salary * 0.4 - 100_000;
  if (salary <= 3_600_000) return salary * 0.3 + 80_000;
  if (salary <= 6_600_000) return salary * 0.2 + 440_000;
  if (salary <= 8_500_000) return salary * 0.1 + 1_100_000;
  return 1_950_000;
}

// ─── 源泉徴収税額の概算（入力がない場合）
function estimateWithholding(salary: number): number {
  const salaryDeduction = calcSalaryDeduction(salary);
  const basicDeduction = 480_000;
  const taxableIncome = Math.max(0, salary - salaryDeduction - basicDeduction);
  return Math.max(0, calcIncomeTax(taxableIncome)) * 1.021;
}

function fmt(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}
function fmtMan(n: number, digits = 1): string {
  return `${(n / 10_000).toFixed(digits)}万円`;
}

const FAQS = [
  {
    question: "確定申告の還付金はいつ振り込まれますか？",
    answer:
      "e-Taxで申告した場合は3週間〜2ヶ月程度、書面申告は1〜3ヶ月程度で指定口座に振り込まれます。",
  },
  {
    question: "医療費控除はいくらから申告できますか？",
    answer:
      "年間の医療費が10万円（または所得の5%のいずれか低い方）を超えた場合に申告できます。最高控除額は200万円です。",
  },
  {
    question: "確定申告が必要な人はどんな人ですか？",
    answer:
      "給与収入が2,000万円超、副業収入が20万円超、2か所以上から給与、医療費控除・住宅ローン控除初年度申請など、還付を受けたい場合は申告が必要です。",
  },
  {
    question: "ふるさと納税の確定申告は必要ですか？",
    answer:
      "ワンストップ特例制度を利用した場合は確定申告不要ですが、寄付先が6自治体以上の場合や確定申告が必要な人は確定申告で申告します。",
  },
];

export default function TaxReturn() {
  const [salaryMan, setSalaryMan] = useState(500);
  const [withholdingMan, setWithholdingMan] = useState<string>("");
  const [autoWithholding, setAutoWithholding] = useState(true);

  // 控除チェックボックス
  const [useMedical, setUseMedical] = useState(false);
  const [medicalTotalMan, setMedicalTotalMan] = useState(15);
  const [medicalInsuranceMan, setMedicalInsuranceMan] = useState(0);

  const [useFurusato, setUseFurusato] = useState(false);
  const [furusatoMan, setFurusatoMan] = useState(5);

  const [useHousing, setUseHousing] = useState(false);
  const [housingLoanMan, setHousingLoanMan] = useState(3000);

  const [useZatsuzon, setUseZatsuzon] = useState(false);
  const [zatsuzonMan, setZatsuzonMan] = useState(50);

  const [useKifu, setUseKifu] = useState(false);
  const [kifuMan, setKifuMan] = useState(5);

  const [useIdeco, setUseIdeco] = useState(false);
  const [idecoMan, setIdecoMan] = useState(27.6);

  const [dependents, setDependents] = useState(0);
  const [socialInsuranceMan, setSocialInsuranceMan] = useState(60);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(() => {
    const salary = salaryMan * 10_000;
    const salaryDeduction = calcSalaryDeduction(salary);
    const basicDeduction = 480_000;
    const dependentDeduction = dependents * 380_000;
    const socialInsurance = socialInsuranceMan * 10_000;

    // 医療費控除
    let medicalDeduction = 0;
    if (useMedical) {
      const threshold = Math.min(salary * 0.05, 100_000);
      const net = medicalTotalMan * 10_000 - medicalInsuranceMan * 10_000;
      medicalDeduction = Math.min(Math.max(0, net - threshold), 2_000_000);
    }

    // ふるさと納税（寄付金控除）
    const furusatoDeduction = useFurusato ? Math.max(0, furusatoMan * 10_000 - 2_000) : 0;

    // iDeCo（掛金全額所得控除）
    const idecoDeduction = useIdeco ? idecoMan * 10_000 : 0;

    // 雑損控除（簡略: 損失額の一部）
    const zatsuzonDeduction = useZatsuzon ? zatsuzonMan * 10_000 * 0.5 : 0;

    // 寄付金控除（ふるさと納税以外）
    const kifuDeduction = useKifu ? Math.max(0, kifuMan * 10_000 - 2_000) : 0;

    // 課税所得（申告前: 源泉徴収時）
    const taxableBeforeApply = Math.max(
      0,
      salary - salaryDeduction - basicDeduction - dependentDeduction - socialInsurance
    );

    // 課税所得（申告後: 全控除適用）
    const taxableAfter = Math.max(
      0,
      taxableBeforeApply - medicalDeduction - furusatoDeduction - idecoDeduction - zatsuzonDeduction - kifuDeduction
    );

    // 申告後確定税額
    const finalTax = Math.max(0, calcIncomeTax(taxableAfter)) * 1.021;

    // 住宅ローン控除（税額控除: 最後に差し引く）
    const housingCredit = useHousing ? Math.min(housingLoanMan * 10_000 * 0.007, finalTax) : 0;
    const finalTaxAfterHousing = Math.max(0, finalTax - housingCredit);

    // 源泉徴収税額
    const withholding = autoWithholding
      ? estimateWithholding(salary)
      : (parseFloat(withholdingMan) || 0) * 10_000;

    const refund = withholding - finalTaxAfterHousing;

    // 控除別節税効果
    const baseTax = Math.max(0, calcIncomeTax(taxableBeforeApply)) * 1.021;
    const savings = [
      { label: "医療費控除", deduction: medicalDeduction, saving: useMedical ? baseTax - Math.max(0, calcIncomeTax(Math.max(0, taxableBeforeApply - medicalDeduction))) * 1.021 : 0, enabled: useMedical },
      { label: "ふるさと納税（寄付金控除）", deduction: furusatoDeduction, saving: useFurusato ? baseTax - Math.max(0, calcIncomeTax(Math.max(0, taxableBeforeApply - furusatoDeduction))) * 1.021 : 0, enabled: useFurusato },
      { label: "住宅ローン控除", deduction: 0, saving: housingCredit, enabled: useHousing },
      { label: "雑損控除", deduction: zatsuzonDeduction, saving: useZatsuzon ? baseTax - Math.max(0, calcIncomeTax(Math.max(0, taxableBeforeApply - zatsuzonDeduction))) * 1.021 : 0, enabled: useZatsuzon },
      { label: "寄付金控除", deduction: kifuDeduction, saving: useKifu ? baseTax - Math.max(0, calcIncomeTax(Math.max(0, taxableBeforeApply - kifuDeduction))) * 1.021 : 0, enabled: useKifu },
      { label: "iDeCo（小規模企業共済等掛金控除）", deduction: idecoDeduction, saving: useIdeco ? baseTax - Math.max(0, calcIncomeTax(Math.max(0, taxableBeforeApply - idecoDeduction))) * 1.021 : 0, enabled: useIdeco },
    ];

    return {
      refund,
      withholding,
      finalTaxAfterHousing,
      taxableBeforeApply,
      taxableAfter,
      savings,
      medicalDeduction,
      furusatoDeduction,
      idecoDeduction,
    };
  }, [
    salaryMan, withholdingMan, autoWithholding,
    useMedical, medicalTotalMan, medicalInsuranceMan,
    useFurusato, furusatoMan,
    useHousing, housingLoanMan,
    useZatsuzon, zatsuzonMan,
    useKifu, kifuMan,
    useIdeco, idecoMan,
    dependents, socialInsuranceMan,
  ]);

  const enabledSavings = result.savings.filter((s) => s.enabled);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヒーローヘッダー ─── */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📊</span>
          <h1 className="text-2xl font-bold">確定申告・還付金計算</h1>
        </div>
        <p className="text-sm text-blue-100">
          医療費控除・ふるさと納税・住宅ローン控除などの申告控除を入力して、所得税の還付見込み額をシミュレーションします。
        </p>
      </div>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-900">基本情報</h2>

        {/* 給与年収 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            給与年収
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={10000}
              step={10}
              value={salaryMan}
              onChange={(e) => setSalaryMan(Number(e.target.value))}
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-sm text-gray-600">万円</span>
            <span className="ml-auto text-sm text-gray-500">
              ＝ {(salaryMan * 10000).toLocaleString("ja-JP")}円
            </span>
          </div>
        </div>

        {/* 源泉徴収済み所得税 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            源泉徴収済み所得税
          </label>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => setAutoWithholding(true)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                autoWithholding
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
              }`}
            >
              自動推計
            </button>
            <button
              onClick={() => setAutoWithholding(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors ${
                !autoWithholding
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
              }`}
            >
              手動入力
            </button>
          </div>
          {autoWithholding ? (
            <p className="text-sm text-gray-500 bg-blue-50 rounded-lg px-3 py-2">
              推計値: <span className="font-semibold text-blue-700">{fmt(result.withholding)}</span>
              （源泉徴収票の「源泉徴収税額」欄の値を手動入力するとより正確になります）
            </p>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                step={0.1}
                value={withholdingMan}
                onChange={(e) => setWithholdingMan(e.target.value)}
                placeholder="例: 15.3"
                className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span className="text-sm text-gray-600">万円</span>
            </div>
          )}
        </div>

        {/* 扶養家族数 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            扶養家族数
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={10}
              step={1}
              value={dependents}
              onChange={(e) => setDependents(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-sm text-gray-600">人（1人につき38万円控除）</span>
          </div>
        </div>

        {/* 社会保険料 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            社会保険料（年額）
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              step={1}
              value={socialInsuranceMan}
              onChange={(e) => setSocialInsuranceMan(Number(e.target.value))}
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="text-sm text-gray-600">万円</span>
          </div>
        </div>
      </div>

      {/* ─── 控除入力 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-gray-900">申告する控除</h2>

        {/* 医療費控除 */}
        <DeductionBlock
          label="医療費控除"
          checked={useMedical}
          onToggle={() => setUseMedical(!useMedical)}
          color="blue"
        >
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">年間医療費（万円）</label>
              <input
                type="number"
                min={0}
                step={1}
                value={medicalTotalMan}
                onChange={(e) => setMedicalTotalMan(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">うち保険補填額（万円）</label>
              <input
                type="number"
                min={0}
                step={1}
                value={medicalInsuranceMan}
                onChange={(e) => setMedicalInsuranceMan(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          {useMedical && (
            <p className="text-xs text-blue-600 mt-2">
              医療費控除額: {fmt(result.medicalDeduction)}
            </p>
          )}
        </DeductionBlock>

        {/* ふるさと納税 */}
        <DeductionBlock
          label="ふるさと納税（寄付金控除）"
          checked={useFurusato}
          onToggle={() => setUseFurusato(!useFurusato)}
          color="orange"
        >
          <div className="mt-3">
            <label className="block text-xs text-gray-500 mb-1">寄付金額（万円）</label>
            <input
              type="number"
              min={0}
              step={0.1}
              value={furusatoMan}
              onChange={(e) => setFurusatoMan(Number(e.target.value))}
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          {useFurusato && (
            <p className="text-xs text-orange-600 mt-2">
              寄付金控除額: {fmt(result.furusatoDeduction)}（2,000円を差し引いた額）
            </p>
          )}
        </DeductionBlock>

        {/* 住宅ローン控除 */}
        <DeductionBlock
          label="住宅ローン控除（初年度・税額控除）"
          checked={useHousing}
          onToggle={() => setUseHousing(!useHousing)}
          color="green"
        >
          <div className="mt-3">
            <label className="block text-xs text-gray-500 mb-1">年末ローン残高（万円）</label>
            <input
              type="number"
              min={0}
              step={10}
              value={housingLoanMan}
              onChange={(e) => setHousingLoanMan(Number(e.target.value))}
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            控除額 = 年末残高 × 0.7%（上限あり）
          </p>
        </DeductionBlock>

        {/* 雑損控除 */}
        <DeductionBlock
          label="雑損控除"
          checked={useZatsuzon}
          onToggle={() => setUseZatsuzon(!useZatsuzon)}
          color="purple"
        >
          <div className="mt-3">
            <label className="block text-xs text-gray-500 mb-1">損失額（万円）</label>
            <input
              type="number"
              min={0}
              step={1}
              value={zatsuzonMan}
              onChange={(e) => setZatsuzonMan(Number(e.target.value))}
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </DeductionBlock>

        {/* 寄付金控除 */}
        <DeductionBlock
          label="寄付金控除（ふるさと納税以外）"
          checked={useKifu}
          onToggle={() => setUseKifu(!useKifu)}
          color="pink"
        >
          <div className="mt-3">
            <label className="block text-xs text-gray-500 mb-1">寄付額（万円）</label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={kifuMan}
              onChange={(e) => setKifuMan(Number(e.target.value))}
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
        </DeductionBlock>

        {/* iDeCo */}
        <DeductionBlock
          label="iDeCo（小規模企業共済等掛金控除）"
          checked={useIdeco}
          onToggle={() => setUseIdeco(!useIdeco)}
          color="indigo"
        >
          <div className="mt-3">
            <label className="block text-xs text-gray-500 mb-1">年間掛金（万円）</label>
            <input
              type="number"
              min={0}
              max={81.6}
              step={0.1}
              value={idecoMan}
              onChange={(e) => setIdecoMan(Number(e.target.value))}
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <p className="text-xs text-amber-600 mt-2 bg-amber-50 rounded-lg px-3 py-2">
            ※ 会社員の方はiDeCoの掛金がすでに給与天引き（年末調整）されている場合があります。その場合は入力不要です。
          </p>
          {useIdeco && (
            <p className="text-xs text-indigo-600 mt-1">
              iDeCo控除額: {fmt(result.idecoDeduction)}
            </p>
          )}
        </DeductionBlock>
      </div>

      {/* ─── 結果ヒーローカード ─── */}
      <div className={`rounded-2xl p-6 mb-6 shadow-lg ${result.refund >= 0 ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-red-500 to-rose-600"} text-white`}>
        <p className="text-sm font-medium opacity-90 mb-1">
          {result.refund >= 0 ? "還付予定額（概算）" : "追徴税額（概算）"}
        </p>
        <p className="text-5xl font-extrabold tracking-tight mb-2">
          {result.refund >= 0 ? "+" : ""}{fmt(result.refund)}
        </p>
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/30 text-center">
          <div>
            <p className="text-xs opacity-75">源泉徴収済み税額</p>
            <p className="text-xl font-bold">{fmt(result.withholding)}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">申告後確定税額</p>
            <p className="text-xl font-bold">{fmt(result.finalTaxAfterHousing)}</p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── 控除別節税効果テーブル ─── */}
      {enabledSavings.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">控除別の節税効果</h2>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="text-left py-2 px-2 font-medium">控除の種類</th>
                  <th className="text-right py-2 px-2 font-medium">所得税の節税額</th>
                </tr>
              </thead>
              <tbody>
                {enabledSavings.map((s) => (
                  <tr key={s.label} className="border-b border-gray-100">
                    <td className="py-2.5 px-2 text-gray-800">{s.label}</td>
                    <td className="py-2.5 px-2 text-right font-semibold text-green-600">
                      {s.saving > 0 ? `+${fmt(s.saving)}` : fmt(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── 申告手順ガイド ─── */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-blue-900 mb-4">確定申告 5ステップガイド</h2>
        <ol className="space-y-3">
          {[
            { step: 1, title: "書類を集める", desc: "源泉徴収票・医療費の領収書・ふるさと納税の寄付金受領証明書などを準備" },
            { step: 2, title: "申告方法を選ぶ", desc: "e-Tax（オンライン）または税務署への書面提出。e-Taxは還付が早く便利" },
            { step: 3, title: "申告書を作成", desc: "国税庁「確定申告書等作成コーナー」で画面の案内に従い入力" },
            { step: 4, title: "申告書を提出", desc: "提出期限は翌年3月15日まで（還付申告は5年間遡って申告可）" },
            { step: 5, title: "還付金を受け取る", desc: "指定の銀行口座に還付金が振り込まれる（e-Tax: 3週間〜2か月程度）" },
          ].map((item) => (
            <li key={item.step} className="flex gap-3">
              <span className="flex-shrink-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {item.step}
              </span>
              <div>
                <p className="font-semibold text-blue-900 text-sm">{item.title}</p>
                <p className="text-xs text-blue-700 mt-0.5">{item.desc}</p>
              </div>
            </li>
          ))}
        </ol>
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

      <AdBanner />

      <RelatedTools currentToolId="tax-return" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。給与所得控除・各種控除の計算は簡略化しています。住宅ローン控除の上限・適用条件や雑損控除の詳細計算は反映していません。
        実際の還付額は税理士または税務署にご確認ください。入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}

// ─── 控除ブロックコンポーネント ───
function DeductionBlock({
  label,
  checked,
  onToggle,
  color,
  children,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  color: string;
  children?: React.ReactNode;
}) {
  const colorMap: Record<string, string> = {
    blue: "border-blue-300 bg-blue-50",
    orange: "border-orange-300 bg-orange-50",
    green: "border-green-300 bg-green-50",
    purple: "border-purple-300 bg-purple-50",
    pink: "border-pink-300 bg-pink-50",
    indigo: "border-indigo-300 bg-indigo-50",
  };
  return (
    <div className={`border rounded-xl p-4 transition-colors ${checked ? colorMap[color] : "border-gray-200 bg-white"}`}>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="w-4 h-4 rounded"
        />
        <span className="text-sm font-semibold text-gray-800">{label}</span>
      </label>
      {checked && children}
    </div>
  );
}
