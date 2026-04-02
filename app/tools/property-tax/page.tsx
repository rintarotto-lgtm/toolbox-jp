"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 定数
const TAX_RATE = 0.014; // 固定資産税1.4%

// ─── FAQ
const FAQS = [
  {
    question: "固定資産税の計算方法を教えてください",
    answer:
      "固定資産税は「固定資産税評価額 × 税率1.4%」で計算します。住宅用地には軽減措置があり、小規模住宅用地（200㎡以下）は評価額の1/6、一般住宅用地（200㎡超）は1/3が課税標準となります。土地と建物それぞれの税額を合計したものが年間の固定資産税額です。",
  },
  {
    question: "固定資産税の税率はいくらですか？",
    answer:
      "固定資産税の標準税率は1.4%です。ほとんどの自治体で1.4%が適用されています。なお都市計画税（最大0.3%）が別途かかる場合があります。このシミュレーターでは固定資産税（1.4%）のみを計算しています。",
  },
  {
    question: "固定資産税の軽減措置にはどのようなものがありますか？",
    answer:
      "住宅用地の特例として、小規模住宅用地（200㎡以下）は課税標準が1/6、一般住宅用地（200㎡超）は1/3に軽減されます。また新築住宅の建物部分は新築後3年間（マンション等は5年間）、床面積120㎡以下部分の税額が1/2になる新築特例があります。",
  },
  {
    question: "固定資産税の支払い時期はいつですか？",
    answer:
      "固定資産税は年4回に分けて納付します。第1期：5月、第2期：7月、第3期：12月、第4期：翌年2月が一般的です（自治体により異なります）。各期の納付額は年税額の1/4ずつです。",
  },
];

// ─── 評価額テーブル用データ
const LAND_TABLE_VALUES = [500, 1000, 1500, 2000, 3000, 4000, 5000];

// ─── ヘルパー
function toMan(yen: number): string {
  const man = Math.round(yen / 10_000);
  return `${man.toLocaleString("ja-JP")}万円`;
}
function toYen(yen: number): string {
  return `¥${Math.round(yen).toLocaleString("ja-JP")}`;
}

// ─── 土地税額計算
function calcLandTax(landAssessment: number, landArea: number): number {
  if (landAssessment <= 0) return 0;
  const smallLandArea = Math.min(landArea, 200);
  const largeLandArea = Math.max(0, landArea - 200);
  const smallRatio = smallLandArea / landArea;
  const largeRatio = largeLandArea / landArea;
  const landTaxBase =
    landAssessment * smallRatio / 6 + landAssessment * largeRatio / 3;
  return landTaxBase * TAX_RATE;
}

// ─── 建物税額計算
function calcBuildingTax(
  buildingAssessment: number,
  isNewBuild: boolean
): number {
  if (buildingAssessment <= 0) return 0;
  const baseTax = buildingAssessment * TAX_RATE;
  return isNewBuild ? baseTax * 0.5 : baseTax;
}

type PropertyType = "一戸建て" | "マンション" | "土地のみ";

export default function PropertyTax() {
  const [propertyType, setPropertyType] = useState<PropertyType>("一戸建て");
  const [landAssessment, setLandAssessment] = useState(15_000_000);
  const [buildingAssessment, setBuildingAssessment] = useState(8_000_000);
  const [isNewBuild, setIsNewBuild] = useState(false);
  const [landArea, setLandArea] = useState(100);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const showBuilding = propertyType !== "土地のみ";

  const landTax = useMemo(
    () => calcLandTax(landAssessment, landArea),
    [landAssessment, landArea]
  );
  const buildingTax = useMemo(
    () => (showBuilding ? calcBuildingTax(buildingAssessment, isNewBuild) : 0),
    [buildingAssessment, isNewBuild, showBuilding]
  );
  const totalTax = landTax + buildingTax;
  const monthlyTax = totalTax / 12;

  // 支払いスケジュール（4期）
  const quarterTax = Math.floor(totalTax / 4);
  const schedule = [
    { period: "第1期", month: "5月", amount: quarterTax },
    { period: "第2期", month: "7月", amount: quarterTax },
    { period: "第3期", month: "12月", amount: quarterTax },
    {
      period: "第4期",
      month: "翌2月",
      amount: Math.round(totalTax) - quarterTax * 3,
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        固定資産税計算シミュレーター
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        土地・建物の固定資産税評価額を入力するだけで年間の固定資産税額を計算します。住宅用地の軽減措置・新築特例にも対応。
      </p>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-7">

        {/* 物件種別 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            物件種別
          </label>
          <div className="flex gap-2">
            {(["一戸建て", "マンション", "土地のみ"] as PropertyType[]).map(
              (type) => (
                <button
                  key={type}
                  onClick={() => setPropertyType(type)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                    propertyType === type
                      ? "bg-amber-500 text-white border-amber-500 shadow"
                      : "bg-white text-gray-600 border-gray-300 hover:bg-amber-50"
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>

        {/* 土地の固定資産税評価額 */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <label className="text-sm font-medium text-gray-700">
              土地の固定資産税評価額
            </label>
            <span className="text-xl font-extrabold text-amber-600">
              {toMan(landAssessment)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100_000_000}
            step={500_000}
            value={landAssessment}
            onChange={(e) => setLandAssessment(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-amber-500
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-amber-200 to-amber-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0円</span>
            <span>2,500万</span>
            <span>5,000万</span>
            <span>7,500万</span>
            <span>1億</span>
          </div>
        </div>

        {/* 建物の固定資産税評価額 */}
        {showBuilding && (
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-sm font-medium text-gray-700">
                建物の固定資産税評価額
              </label>
              <span className="text-xl font-extrabold text-amber-600">
                {toMan(buildingAssessment)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={50_000_000}
              step={100_000}
              value={buildingAssessment}
              onChange={(e) => setBuildingAssessment(Number(e.target.value))}
              className="w-full h-3 rounded-full appearance-none cursor-pointer accent-amber-500
                [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
                bg-gradient-to-r from-amber-200 to-amber-400"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0円</span>
              <span>1,250万</span>
              <span>2,500万</span>
              <span>3,750万</span>
              <span>5,000万</span>
            </div>
          </div>
        )}

        {/* 土地面積 */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <label className="text-sm font-medium text-gray-700">土地面積</label>
            <span className="text-xl font-extrabold text-amber-600">
              {landArea}㎡
              <span className="text-sm font-normal text-gray-500 ml-2">
                {landArea <= 200 ? "（小規模住宅用地）" : "（一般住宅用地あり）"}
              </span>
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={500}
            step={5}
            value={landArea}
            onChange={(e) => setLandArea(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-amber-500
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-amber-200 to-amber-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>50㎡</span>
            <span>200㎡</span>
            <span>350㎡</span>
            <span>500㎡</span>
          </div>
          <p className="text-xs text-amber-600 mt-2">
            200㎡以下の部分：課税標準1/6（小規模住宅用地の特例）
            {landArea > 200 && "　200㎡超の部分：課税標準1/3（一般住宅用地の特例）"}
          </p>
        </div>

        {/* 新築かどうか */}
        {showBuilding && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              新築特例（建物税額1/2・3年間）
            </label>
            <button
              onClick={() => setIsNewBuild(!isNewBuild)}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                isNewBuild ? "bg-amber-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                  isNewBuild ? "translate-x-8" : "translate-x-1"
                }`}
              />
            </button>
            <span className="ml-3 text-sm text-gray-600">
              {isNewBuild ? "新築（税額1/2を適用）" : "中古（通常税率）"}
            </span>
          </div>
        )}
      </div>

      {/* ─── ヒーローカード ─── */}
      <div className="rounded-2xl p-6 mb-6 text-white shadow-lg bg-gradient-to-br from-amber-400 to-yellow-500">
        <p className="text-sm font-medium opacity-90 mb-1">年間固定資産税（目安）</p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">
          {toYen(Math.round(totalTax))}
        </p>
        <p className="text-base opacity-80 mb-4">
          月換算：約 {toYen(Math.round(monthlyTax))} / 月
        </p>
        <div className="pt-4 border-t border-white/30 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs opacity-75">土地分</p>
            <p className="text-2xl font-bold">{toYen(Math.round(landTax))}</p>
          </div>
          {showBuilding && (
            <div>
              <p className="text-xs opacity-75">
                建物分{isNewBuild && "（新築1/2）"}
              </p>
              <p className="text-2xl font-bold">
                {toYen(Math.round(buildingTax))}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ─── 内訳バー ─── */}
      {showBuilding && totalTax > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">税額の内訳</h2>
          <div className="space-y-3">
            {[
              {
                label: "土地分",
                value: landTax,
                color: "bg-amber-400",
              },
              {
                label: `建物分${isNewBuild ? "（新築特例1/2）" : ""}`,
                value: buildingTax,
                color: "bg-yellow-400",
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold text-gray-800">
                    {toYen(Math.round(item.value))}（
                    {totalTax > 0
                      ? Math.round((item.value / totalTax) * 100)
                      : 0}
                    %）
                  </span>
                </div>
                <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{
                      width: `${totalTax > 0 ? (item.value / totalTax) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 支払いスケジュール ─── */}
      {totalTax > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            支払いスケジュール（年4回）
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {schedule.map((s) => (
              <div
                key={s.period}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center"
              >
                <p className="text-xs text-amber-600 font-medium mb-1">
                  {s.period}
                </p>
                <p className="text-lg font-bold text-amber-700">
                  {toYen(s.amount)}
                </p>
                <p className="text-xs text-gray-500 mt-1">（{s.month}頃）</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            ※ 納期は自治体によって異なります。上記は一般的な目安です。
          </p>
        </div>
      )}

      <AdBanner />

      {/* ─── 評価額別テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          土地評価額別の固定資産税額（参考）
        </h2>
        <p className="text-xs text-gray-500 mb-4">
          土地面積100㎡（小規模住宅用地）・建物評価額800万円の場合
        </p>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">土地評価額</th>
                <th className="text-right py-2 px-2 font-medium">土地分</th>
                <th className="text-right py-2 px-2 font-medium">建物分</th>
                <th className="text-right py-2 px-2 font-medium">年間合計</th>
              </tr>
            </thead>
            <tbody>
              {LAND_TABLE_VALUES.map((man) => {
                const assessment = man * 10_000;
                const lt = calcLandTax(assessment, 100);
                const bt = calcBuildingTax(8_000_000, false);
                return (
                  <tr
                    key={man}
                    className={`border-b border-gray-100 last:border-0 transition-colors hover:bg-amber-50 ${
                      landAssessment === assessment
                        ? "bg-amber-50 font-semibold"
                        : ""
                    }`}
                  >
                    <td className="py-2.5 px-2 text-gray-700">{man.toLocaleString()}万円</td>
                    <td className="py-2.5 px-2 text-right text-gray-600">
                      {toYen(Math.round(lt))}
                    </td>
                    <td className="py-2.5 px-2 text-right text-gray-600">
                      {toYen(Math.round(bt))}
                    </td>
                    <td className="py-2.5 px-2 text-right font-semibold text-amber-700">
                      {toYen(Math.round(lt + bt))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-amber-600"
              >
                <span>{faq.question}</span>
                <span className="text-gray-400 ml-2 shrink-0 text-base">
                  {openFaq === i ? "−" : "＋"}
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="property-tax" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは目安計算です。実際の税額は自治体の税率・評価額・各種特例の適用状況により異なります。
        正確な税額は納税通知書または各市区町村にご確認ください。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
