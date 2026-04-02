"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 保育料階層区分（月額, 0〜2歳）
// 市町村民税所得割額に基づく全国標準的な階層
const TIERS = [
  { maxTax: 0, fee: 0, label: "非課税世帯" },
  { maxTax: 48_600, fee: 6_000, label: "D3階層" },
  { maxTax: 97_000, fee: 16_500, label: "D4階層" },
  { maxTax: 169_000, fee: 27_000, label: "D5階層" },
  { maxTax: 301_000, fee: 41_500, label: "D6階層" },
  { maxTax: 397_000, fee: 58_000, label: "D7階層" },
  { maxTax: Infinity, fee: 77_000, label: "D8階層（上限）" },
];

// 住民税所得割額の簡易推計: 年収から市町村民税所得割を概算
function estimateTax(income: number): number {
  // 給与所得控除後の所得 - 基礎控除43万 - 社会保険料控除(年収の約14%) = 課税所得
  const salaryDeduction =
    income <= 1_625_000 ? 550_000 :
    income <= 1_800_000 ? income * 0.4 - 100_000 :
    income <= 3_600_000 ? income * 0.3 + 80_000 :
    income <= 6_600_000 ? income * 0.2 + 440_000 :
    income <= 8_500_000 ? income * 0.1 + 1_100_000 : 1_950_000;

  const netIncome = income - salaryDeduction;
  const socialInsurance = income * 0.14;
  const basicDeduction = 430_000;
  const taxableIncome = Math.max(0, netIncome - socialInsurance - basicDeduction);

  // 市町村民税所得割: 税率6%（住民税10%のうち市町村分）
  return Math.max(0, taxableIncome * 0.06);
}

function calcChildcareFee(
  age: number,
  income: number,
): { baseFee: number; tierLabel: string } {
  if (age >= 3) return { baseFee: 0, tierLabel: "無償化適用" };
  const estimatedTax = estimateTax(income);
  const tier = TIERS.find((t) => estimatedTax <= t.maxTax) ?? TIERS[TIERS.length - 1];
  return { baseFee: tier.fee, tierLabel: tier.label };
}

// 年収別テーブル用
const TABLE_INCOMES = [3_000_000, 4_000_000, 5_000_000, 6_000_000, 7_000_000, 8_000_000, 10_000_000];

function toYen(yen: number): string {
  return `¥${Math.round(yen).toLocaleString("ja-JP")}`;
}
function toMan(yen: number): string {
  return `${Math.round(yen / 10_000).toLocaleString("ja-JP")}万円`;
}

const FAQS = [
  {
    question: "保育料はどのように計算されますか？",
    answer:
      "認可保育所の保育料は、世帯の市町村民税額（住民税所得割額）に基づいた階層区分によって決まります。市町村民税額が高いほど保育料も高くなる累進制で、各市区町村が国の基準を参考に上限内で独自に設定しています。",
  },
  {
    question: "幼児教育・保育の無償化の対象は誰ですか？",
    answer:
      "2019年10月から始まった幼児教育・保育の無償化により、3歳〜5歳児クラスの子どもは認可保育所・幼稚園・認定こども園などの利用料が無料になります。0〜2歳児クラスは住民税非課税世帯のみ対象です。ただし給食費（副食費）や延長保育料などは実費負担となります。",
  },
  {
    question: "副食費（給食費）はいくらかかりますか？",
    answer:
      "3歳以上児の副食費（おかず代）は月額4,500円が目安です。ただし年収360万円未満相当の世帯や第3子以降などは免除される場合があります。金額は施設によって異なりますので、入園予定の施設に確認してください。",
  },
  {
    question: "認可外保育施設の場合はどうなりますか？",
    answer:
      "認可外保育施設は施設ごとに料金を自由に設定できます。3〜5歳児クラスは無償化の対象ですが、上限額は月3.7万円です。0〜2歳児の住民税非課税世帯は月4.2万円が上限です。認可外は認可より料金が高い場合が多く、差額は自己負担となります。",
  },
];

export default function ChildcareCost() {
  const [childAge, setChildAge] = useState<number>(1);
  const [income, setIncome] = useState(6_000_000);
  const [facilityType, setFacilityType] = useState<"認可保育所" | "認定こども園" | "幼稚園">("認可保育所");
  const [hasExtended, setHasExtended] = useState(false);
  const [hasMeals, setHasMeals] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { baseFee, tierLabel } = useMemo(
    () => calcChildcareFee(childAge, income),
    [childAge, income]
  );

  const mealsFee = childAge >= 3 && hasMeals ? 4_500 : 0;
  const extendedFee = hasExtended ? 5_000 : 0;
  const totalMonthly = baseFee + mealsFee + extendedFee;
  const totalAnnual = totalMonthly * 12;

  const isExempt = childAge >= 3;
  const estimatedTax = estimateTax(income);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        保育料シミュレーター
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        年収と子どもの年齢を入力するだけで保育料の目安を計算します。無償化・副食費・延長保育料も含めた実質負担額がわかります。
      </p>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-7">

        {/* 子どもの年齢 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            子どもの年齢
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "0歳", value: 0 },
              { label: "1歳", value: 1 },
              { label: "2歳", value: 2 },
              { label: "3歳以上", value: 3 },
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setChildAge(value)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  childAge === value
                    ? "bg-rose-500 text-white border-rose-500 shadow"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-rose-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {isExempt && (
            <p className="text-xs text-emerald-600 font-medium mt-2">
              3歳以上は幼児教育・保育の無償化が適用されます（保育料0円）
            </p>
          )}
        </div>

        {/* 世帯年収 */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <label className="text-sm font-medium text-gray-700">世帯年収</label>
            <span className="text-xl font-extrabold text-rose-600">{toMan(income)}</span>
          </div>
          <input
            type="range"
            min={1_500_000}
            max={15_000_000}
            step={100_000}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-rose-500
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-rose-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-rose-200 to-rose-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>150万</span>
            <span>400万</span>
            <span>700万</span>
            <span>1,000万</span>
            <span>1,500万</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {[3_000_000, 4_000_000, 5_000_000, 6_000_000, 8_000_000, 10_000_000].map((v) => (
              <button
                key={v}
                onClick={() => setIncome(v)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  income === v
                    ? "bg-rose-500 text-white border-rose-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-rose-50"
                }`}
              >
                {toMan(v)}
              </button>
            ))}
          </div>
          {!isExempt && (
            <p className="text-xs text-gray-400 mt-2">
              市町村民税所得割（推計）：約{toMan(estimatedTax)} → {tierLabel}
            </p>
          )}
        </div>

        {/* 保育施設の種別 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            保育施設の種別
          </label>
          <div className="flex flex-wrap gap-2">
            {(["認可保育所", "認定こども園", "幼稚園"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFacilityType(type)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  facilityType === type
                    ? "bg-rose-500 text-white border-rose-500 shadow"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-rose-50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* オプション */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">オプション</label>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div>
              <p className="text-sm font-medium text-gray-700">延長保育</p>
              <p className="text-xs text-gray-400">月額 +5,000円</p>
            </div>
            <button
              onClick={() => setHasExtended(!hasExtended)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                hasExtended ? "bg-rose-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  hasExtended ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
            childAge >= 3 ? "bg-gray-50" : "bg-gray-100 opacity-50"
          }`}>
            <div>
              <p className="text-sm font-medium text-gray-700">給食（副食費）</p>
              <p className="text-xs text-gray-400">3歳以上のみ・月額 4,500円</p>
            </div>
            <button
              onClick={() => childAge >= 3 && setHasMeals(!hasMeals)}
              disabled={childAge < 3}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                hasMeals && childAge >= 3 ? "bg-rose-500" : "bg-gray-300"
              } disabled:cursor-not-allowed`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  hasMeals && childAge >= 3 ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ─── 無償化バナー ─── */}
      {isExempt && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white text-lg shrink-0">
            ✓
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-800">幼児教育・保育の無償化 適用</p>
            <p className="text-xs text-emerald-600">
              3歳以上のため保育料は無料です。副食費・延長保育料などの実費は別途負担となります。
            </p>
          </div>
        </div>
      )}

      {/* ─── ヒーローカード ─── */}
      <div className="rounded-2xl p-6 mb-6 text-white shadow-lg bg-gradient-to-br from-rose-500 to-pink-500">
        <p className="text-sm font-medium opacity-90 mb-1">月額負担額（目安）</p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">{toYen(totalMonthly)}</p>
        <p className="text-sm opacity-80 mb-1">年間：{toYen(totalAnnual)}</p>
        <div className="pt-4 border-t border-white/30 mt-3 grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs opacity-75">保育料</p>
            <p className="text-xl font-bold">{toYen(baseFee)}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">副食費</p>
            <p className="text-xl font-bold">{toYen(mealsFee)}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">延長保育</p>
            <p className="text-xl font-bold">{toYen(extendedFee)}</p>
          </div>
        </div>
      </div>

      {/* ─── 内訳カード ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">費用の内訳</h2>
        <div className="space-y-2 text-sm">
          {[
            {
              label: "保育料",
              value: toYen(baseFee),
              note: isExempt ? "無償化適用" : tierLabel,
              highlight: false,
            },
            {
              label: "副食費（給食費）",
              value: toYen(mealsFee),
              note: childAge < 3 ? "0〜2歳は対象外" : !hasMeals ? "なし" : "3歳以上・実費",
              highlight: false,
            },
            {
              label: "延長保育料",
              value: toYen(extendedFee),
              note: hasExtended ? "あり" : "なし",
              highlight: false,
            },
            {
              label: "月額合計",
              value: toYen(totalMonthly),
              note: "",
              highlight: true,
            },
            {
              label: "年間合計",
              value: toYen(totalAnnual),
              note: "",
              highlight: false,
            },
          ].map(({ label, value, note, highlight }) => (
            <div
              key={label}
              className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${
                highlight ? "font-bold text-rose-700" : "text-gray-700"
              }`}
            >
              <div>
                <span>{label}</span>
                {note && <span className="ml-2 text-xs text-gray-400">{note}</span>}
              </div>
              <span className={highlight ? "text-lg" : ""}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      <AdBanner />

      {/* ─── 年収別保育料テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">年収別 保育料（月額）一覧</h2>
        <p className="text-xs text-gray-500 mb-4">
          {childAge >= 3 ? "3歳以上は無償化のため保育料0円。副食費・延長保育料は別途実費。" : "0〜2歳・認可保育所の場合の目安"}
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 text-right">
                <th className="text-left py-2 px-2 font-medium">世帯年収</th>
                <th className="py-2 px-2 font-medium">保育料</th>
                <th className="py-2 px-2 font-medium">月額合計</th>
                <th className="py-2 px-2 font-medium">年間合計</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_INCOMES.map((inc) => {
                const { baseFee: bf, tierLabel: tl } = calcChildcareFee(childAge, inc);
                const meals = childAge >= 3 && hasMeals ? 4_500 : 0;
                const ext = hasExtended ? 5_000 : 0;
                const monthly = bf + meals + ext;
                const isCurrent = inc === income;
                return (
                  <tr
                    key={inc}
                    className={`border-b border-gray-100 last:border-0 transition-colors ${
                      isCurrent ? "bg-rose-50 font-bold" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-2.5 px-2 text-gray-800">{toMan(inc)}</td>
                    <td className="py-2.5 px-2 text-right text-gray-600">
                      {bf === 0 ? <span className="text-emerald-600">無償</span> : toYen(bf)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-rose-700 font-semibold">{toYen(monthly)}</td>
                    <td className="py-2.5 px-2 text-right text-gray-600">{toYen(monthly * 12)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── きょうだい割引 ─── */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-3">きょうだい割引について</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex gap-2">
            <span className="w-5 h-5 bg-rose-400 text-white rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">2</span>
            <div>
              <p className="font-semibold">第2子：半額</p>
              <p className="text-xs text-gray-500">同時に保育所等を利用している場合、第2子の保育料が半額になります。</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">3</span>
            <div>
              <p className="font-semibold">第3子以降：無料</p>
              <p className="text-xs text-gray-500">同時に保育所等を利用している場合、第3子以降の保育料が無料になります（一定の所得制限あり）。</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            ※ 2024年度より多子世帯への支援拡充が進んでいます。詳しくはお住まいの市区町村にご確認ください。
          </p>
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-rose-600"
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

      <RelatedTools currentToolId="childcare-cost" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは国の標準的な階層区分を参考にした目安計算です。実際の保育料は各市区町村の独自設定・所得状況・家族構成等により異なります。
        詳細はお住まいの市区町村の保育担当窓口にご確認ください。
        このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
