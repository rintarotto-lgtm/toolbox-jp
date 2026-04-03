"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

type BusinessType =
  | "type1" // 卸売業 90%
  | "type2" // 小売業 80%
  | "type3" // 製造業 70%
  | "type4" // その他 60%
  | "type5" // サービス業 50%
  | "type6"; // 不動産業 40%

const BUSINESS_TYPES: { value: BusinessType; label: string; rate: number }[] = [
  { value: "type1", label: "第1種（卸売業）", rate: 0.9 },
  { value: "type2", label: "第2種（小売業）", rate: 0.8 },
  { value: "type3", label: "第3種（製造業等）", rate: 0.7 },
  { value: "type4", label: "第4種（その他）", rate: 0.6 },
  { value: "type5", label: "第5種（サービス業等）", rate: 0.5 },
  { value: "type6", label: "第6種（不動産業）", rate: 0.4 },
];

function fmt(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}
function fmtMan(n: number): string {
  return `${(n / 10_000).toFixed(1)}万円`;
}

const FAQS = [
  {
    question: "インボイス制度とは何ですか？",
    answer:
      "2023年10月から始まった制度で、適格請求書（インボイス）を発行・保存することで消費税の仕入税額控除が可能になります。免税事業者はインボイスを発行できないため、取引先が仕入税額控除できなくなります。",
  },
  {
    question: "免税事業者がインボイス登録すると税負担はどう変わりますか？",
    answer:
      "課税事業者になると売上に対する消費税を納付する義務が生じます。ただし仕入れにかかった消費税は控除できます。2026年9月まで経過措置として納税額の20%軽減があります。",
  },
  {
    question: "簡易課税と本則課税どちらが有利ですか？",
    answer:
      "簡易課税は売上から「みなし仕入率」で消費税を計算する方法で、実際の仕入れが少ない業種（サービス業など）に有利です。売上5,000万円以下の事業者が選択できます。",
  },
  {
    question: "フリーランスはインボイス登録すべきですか？",
    answer:
      "取引先が消費税課税事業者の場合、インボイス未登録だと取引先が仕入税額控除できず、値引き要求や取引停止のリスクがあります。売上規模や取引先の状況を考慮して判断が必要です。",
  },
];

export default function InvoiceCalc() {
  const [salesMan, setSalesMan] = useState(600);
  const [businessType, setBusinessType] = useState<BusinessType>("type5");
  const [expenseMan, setExpenseMan] = useState(200);
  const [taxRate10Pct, setTaxRate10Pct] = useState(80);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(() => {
    const sales = salesMan * 10_000;
    const expense = expenseMan * 10_000;

    // 売上消費税（税抜売上に対して10%）
    const salesTax = sales * 0.10;

    // 仕入消費税（税込経費から逆算）
    // 経費のうち税率10%と8%の比率で計算
    const ratio10 = taxRate10Pct / 100;
    const ratio8 = 1 - ratio10;
    const expenseTax10 = (expense * ratio10) / 1.10 * 0.10;
    const expenseTax8 = (expense * ratio8) / 1.08 * 0.08;
    const totalInputTax = expenseTax10 + expenseTax8;

    // ① 免税事業者
    const taxExempt = 0;
    // 受け取り消費税（益税）
    const benefitTax = salesTax;

    // ② 本則課税
    const honsoku = Math.max(0, salesTax - totalInputTax);

    // ③ 簡易課税
    const selectedType = BUSINESS_TYPES.find((b) => b.value === businessType)!;
    const kanyi = salesTax * (1 - selectedType.rate);

    // ④ 2割特例（経過措置: 2026年9月申告分まで）
    const tokureiNisho = salesTax * 0.20;

    // 最小値を求める
    const options = [
      { label: "本則課税", value: honsoku },
      { label: "簡易課税", value: kanyi },
      { label: "2割特例（経過措置）", value: tokureiNisho },
    ];
    const minOption = options.reduce((a, b) => (a.value < b.value ? a : b));

    // 手取り変化: 免税 vs 各課税方式
    // 免税の場合: 売上（税抜）+ 益税 = 売上 * 1.10 が収入
    // 課税の場合: 売上（税抜）+ 受取消費税 - 納税額 = 売上 + (salesTax - 納税額)
    const netExempt = sales + benefitTax - expense;
    const netHonsoku = sales + salesTax - honsoku - expense;
    const netKanyi = sales + salesTax - kanyi - expense;
    const netTokureiNisho = sales + salesTax - tokureiNisho - expense;

    return {
      salesTax,
      totalInputTax,
      taxExempt,
      benefitTax,
      honsoku,
      kanyi,
      tokureiNisho,
      selectedTypeName: selectedType.label,
      selectedRate: selectedType.rate,
      minOption,
      netExempt,
      netHonsoku,
      netKanyi,
      netTokureiNisho,
    };
  }, [salesMan, businessType, expenseMan, taxRate10Pct]);

  const comparisonRows = [
    {
      label: "免税事業者（インボイス未登録）",
      tax: result.taxExempt,
      note: `益税 ${fmt(result.benefitTax)}を含む`,
      highlight: false,
      badge: null as string | null,
    },
    {
      label: "課税事業者（本則課税）",
      tax: result.honsoku,
      note: `仕入税額控除 ${fmt(result.totalInputTax)}`,
      highlight: result.minOption.label === "本則課税",
      badge: result.minOption.label === "本則課税" ? "最も有利" : null,
    },
    {
      label: `課税事業者（簡易課税・${result.selectedTypeName}）`,
      tax: result.kanyi,
      note: `みなし仕入率 ${Math.round(result.selectedRate * 100)}%`,
      highlight: result.minOption.label === "簡易課税",
      badge: result.minOption.label === "簡易課税" ? "最も有利" : null,
    },
    {
      label: "2割特例（経過措置・2026年9月まで）",
      tax: result.tokureiNisho,
      note: "売上消費税の20%のみ納付",
      highlight: result.minOption.label === "2割特例（経過措置）",
      badge: result.minOption.label === "2割特例（経過措置）" ? "最も有利" : null,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヒーローヘッダー ─── */}
      <div className="bg-gradient-to-r from-teal-600 to-green-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🧾</span>
          <h1 className="text-2xl font-bold">インボイス・消費税計算</h1>
        </div>
        <p className="text-sm text-teal-100">
          免税事業者・本則課税・簡易課税・2割特例の消費税納税額を比較。インボイス登録の検討にご活用ください。
        </p>
      </div>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-900">事業情報</h2>

        {/* 年間売上 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            年間売上（万円・税抜）
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={50000}
              step={10}
              value={salesMan}
              onChange={(e) => setSalesMan(Number(e.target.value))}
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <span className="text-sm text-gray-600">万円</span>
            <span className="ml-auto text-sm text-gray-500">
              売上消費税: {fmt(result.salesTax)}
            </span>
          </div>
          {salesMan > 5000 && (
            <p className="text-xs text-amber-600 mt-1 bg-amber-50 rounded-lg px-3 py-2">
              ※ 課税売上高5,000万円超の場合、簡易課税は選択できません。
            </p>
          )}
        </div>

        {/* 業種（簡易課税みなし仕入率） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            業種（簡易課税のみなし仕入率）
          </label>
          <div className="grid grid-cols-2 gap-2">
            {BUSINESS_TYPES.map((bt) => (
              <button
                key={bt.value}
                onClick={() => setBusinessType(bt.value)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border-2 text-left transition-colors ${
                  businessType === bt.value
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white text-gray-700 border-gray-300 hover:border-teal-300"
                }`}
              >
                <span>{bt.label}</span>
                <span className="block font-normal opacity-75">みなし仕入率 {Math.round(bt.rate * 100)}%</span>
              </button>
            ))}
          </div>
        </div>

        {/* 年間仕入・経費 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            年間仕入・経費（万円・税込）
          </label>
          <p className="text-xs text-gray-500 mb-2">本則課税の仕入税額控除の計算に使います。</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              step={10}
              value={expenseMan}
              onChange={(e) => setExpenseMan(Number(e.target.value))}
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            <span className="text-sm text-gray-600">万円</span>
            <span className="ml-auto text-sm text-gray-500">
              仕入控除税額: {fmt(result.totalInputTax)}
            </span>
          </div>
        </div>

        {/* 消費税10%/8%の比率 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            経費のうち消費税10%分の割合: <span className="text-teal-600 font-bold">{taxRate10Pct}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={taxRate10Pct}
            onChange={(e) => setTaxRate10Pct(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-teal-500
              [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-600
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-teal-100 to-teal-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>全て8%</span>
            <span>50/50</span>
            <span>全て10%</span>
          </div>
        </div>
      </div>

      {/* ─── 各方式の納税額比較 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">各方式の年間消費税納税額比較</h2>

        <div className="space-y-3">
          {comparisonRows.map((row) => (
            <div
              key={row.label}
              className={`rounded-xl border-2 p-4 transition-all ${
                row.highlight
                  ? "border-teal-400 bg-teal-50"
                  : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${row.highlight ? "text-teal-900" : "text-gray-800"}`}>
                      {row.label}
                    </span>
                    {row.badge && (
                      <span className="bg-teal-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {row.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{row.note}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-xl font-extrabold ${row.highlight ? "text-teal-700" : "text-gray-700"}`}>
                    {fmt(row.tax)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {salesMan > 0 ? `売上比 ${((row.tax / (salesMan * 10_000)) * 100).toFixed(1)}%` : ""}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 手取り変化 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">インボイス登録有無による手取り比較</h2>
        <p className="text-xs text-gray-500 mb-4">売上（税抜）＋受取消費税 − 仕入経費（税込） − 消費税納付額</p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">方式</th>
                <th className="text-right py-2 px-2 font-medium">年間手取り（概算）</th>
                <th className="text-right py-2 px-2 font-medium">差額</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "免税事業者", net: result.netExempt },
                { label: "本則課税", net: result.netHonsoku },
                { label: "簡易課税", net: result.netKanyi },
                { label: "2割特例", net: result.netTokureiNisho },
              ].map((row) => {
                const diff = row.net - result.netExempt;
                return (
                  <tr key={row.label} className="border-b border-gray-100">
                    <td className="py-2.5 px-2 text-gray-800">{row.label}</td>
                    <td className="py-2.5 px-2 text-right font-semibold text-gray-800">{fmt(row.net)}</td>
                    <td className={`py-2.5 px-2 text-right font-semibold ${diff > 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-gray-400"}`}>
                      {diff === 0 ? "基準" : `${diff > 0 ? "+" : ""}${fmt(diff)}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── 経過措置バナー ─── */}
      <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 mb-6">
        <h2 className="text-base font-bold text-amber-900 mb-2">経過措置（2割特例）について</h2>
        <div className="text-sm text-amber-800 space-y-1">
          <p>インボイス制度の導入に際して、免税事業者から課税事業者に転換した事業者向けに<strong>2割特例（納税額 = 売上消費税 × 20%）</strong>が設けられています。</p>
          <p>適用期間: <strong>2023年10月1日〜2026年9月30日の課税期間</strong></p>
          <p>この特例を使うと、実際の仕入を問わず売上消費税の20%のみ納付すればよいため、多くの場合に有利となります。</p>
        </div>
      </div>

      <AdBanner />

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-teal-600"
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

      <RelatedTools currentToolId="invoice-calc" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。消費税の計算は8%・10%の混在取引を簡略化しています。2割特例の適用要件・終了時期は変更される場合があります。
        軽減税率対象品目の比率や個別の取引状況によって実際の納税額は異なります。正確な申告は税理士または税務署にご確認ください。入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
