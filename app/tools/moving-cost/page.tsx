"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";

const HOUSING_TYPES = [
  "ワンルーム/1K",
  "1LDK/2DK",
  "2LDK/3DK",
  "3LDK/4DK",
  "4LDK以上",
] as const;

const DISTANCE_OPTIONS = [
  "同一市内(~15km)",
  "同一都道府県(~50km)",
  "隣県(~200km)",
  "遠距離(~500km)",
  "長距離(500km+)",
] as const;

const SEASON_OPTIONS = ["通常期(5-2月)", "繁忙期(3-4月)"] as const;

const FAMILY_OPTIONS = ["1人(単身)", "2人", "3人", "4人以上"] as const;

// 通常期の基本料金テーブル [住居タイプ][距離]
const BASE_PRICES: number[][] = [
  [30000, 40000, 55000, 70000, 90000],
  [50000, 65000, 85000, 110000, 140000],
  [70000, 90000, 120000, 150000, 200000],
  [90000, 120000, 160000, 200000, 270000],
  [120000, 160000, 200000, 260000, 350000],
];

const DEPOSIT_OPTIONS = ["0ヶ月", "1ヶ月", "2ヶ月"] as const;
const BROKER_FEE_OPTIONS = ["0.5ヶ月", "1ヶ月"] as const;
const GUARANTOR_OPTIONS = ["なし", "0.5ヶ月", "1ヶ月"] as const;

const FURNITURE_PRESETS = [0, 50000, 100000, 200000];

function fmt(n: number): string {
  return "¥" + n.toLocaleString();
}

export default function MovingCostCalc() {
  // 基本情報
  const [housingIdx, setHousingIdx] = useState(0);
  const [distanceIdx, setDistanceIdx] = useState(0);
  const [seasonIdx, setSeasonIdx] = useState(0);
  const [familyIdx, setFamilyIdx] = useState(0);

  // 業者費用オーバーライド
  const [moverOverride, setMoverOverride] = useState("");

  // 新居の初期費用
  const [rent, setRent] = useState(70000);
  const [depositIdx, setDepositIdx] = useState(1);
  const [keyMoneyIdx, setKeyMoneyIdx] = useState(1);
  const [brokerIdx, setBrokerIdx] = useState(1);
  const [insurance, setInsurance] = useState(15000);
  const [keyChange, setKeyChange] = useState(15000);
  const [guarantorIdx, setGuarantorIdx] = useState(1);

  // その他
  const [furniture, setFurniture] = useState(0);
  const [cleaning, setCleaning] = useState(30000);
  const [disposal, setDisposal] = useState(0);
  const [greeting, setGreeting] = useState(0);

  const calc = useMemo(() => {
    // 業者費用
    const basePrice = BASE_PRICES[housingIdx][distanceIdx];
    const seasonMultiplier = seasonIdx === 1 ? 1.5 : 1;
    const autoMoverCost = Math.round(basePrice * seasonMultiplier);
    const moverCost =
      moverOverride !== "" ? parseInt(moverOverride, 10) || 0 : autoMoverCost;

    // 敷金・礼金の月数
    const depositMonths = depositIdx; // 0, 1, 2
    const keyMoneyMonths = keyMoneyIdx;
    const brokerMonths = brokerIdx === 0 ? 0.5 : 1;
    const guarantorMonths =
      guarantorIdx === 0 ? 0 : guarantorIdx === 1 ? 0.5 : 1;

    const depositCost = rent * depositMonths;
    const keyMoneyCost = rent * keyMoneyMonths;
    const brokerCost = Math.round(rent * brokerMonths);
    const advanceRent = rent;
    const guarantorCost = Math.round(rent * guarantorMonths);

    const initialCost =
      depositCost +
      keyMoneyCost +
      brokerCost +
      advanceRent +
      insurance +
      keyChange +
      guarantorCost;

    const otherCost = furniture + cleaning + disposal + greeting;

    const totalCost = moverCost + initialCost + otherCost;
    const rentMonths = rent > 0 ? totalCost / rent : 0;

    // 節約Tips計算
    const tips: string[] = [];

    if (depositMonths > 0) {
      tips.push(`敷金0の物件なら${fmt(depositCost)}節約`);
    }
    if (keyMoneyMonths > 0) {
      tips.push(`礼金0の物件なら${fmt(keyMoneyCost)}節約`);
    }
    if (seasonIdx === 1) {
      const normalPrice = BASE_PRICES[housingIdx][distanceIdx];
      const saving = autoMoverCost - normalPrice;
      tips.push(`通常期(5-2月)なら業者費用${fmt(saving)}節約`);
    }
    if (brokerMonths === 1) {
      const saving = Math.round(rent * 0.5);
      tips.push(`仲介手数料0.5ヶ月の業者なら${fmt(saving)}節約`);
    }

    return {
      autoMoverCost,
      moverCost,
      initialCost,
      depositCost,
      keyMoneyCost,
      brokerCost,
      advanceRent,
      guarantorCost,
      otherCost,
      totalCost,
      rentMonths,
      tips,
    };
  }, [
    housingIdx,
    distanceIdx,
    seasonIdx,
    familyIdx,
    moverOverride,
    rent,
    depositIdx,
    keyMoneyIdx,
    brokerIdx,
    insurance,
    keyChange,
    guarantorIdx,
    furniture,
    cleaning,
    disposal,
    greeting,
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">引っ越し費用計算ツール</h1>
      <p className="text-gray-500 text-sm mb-6">
        引っ越し、全部でいくらかかる？業者代・初期費用・その他費用をまとめて計算。繁忙期・通常期の料金差も自動反映します。
      </p>

      <AdBanner />

      {/* ===== 総費用ヒーローカード ===== */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl p-6 mb-8 text-white text-center shadow-lg">
        <div className="text-sm opacity-90 mb-1">引っ越し総費用</div>
        <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          {fmt(calc.totalCost)}
        </div>
        {rent > 0 && (
          <div className="mt-2 text-sm opacity-90">
            家賃{calc.rentMonths.toFixed(1)}ヶ月分に相当します
          </div>
        )}
      </div>

      {/* ===== 内訳サマリー ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <div className="text-lg font-bold text-blue-700">
            {fmt(calc.moverCost)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            <span className="mr-1">🚛</span>引っ越し業者
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <div className="text-lg font-bold text-emerald-700">
            {fmt(calc.initialCost)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            <span className="mr-1">🏠</span>新居の初期費用
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <div className="text-lg font-bold text-amber-700">
            {fmt(calc.otherCost)}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            <span className="mr-1">📦</span>その他
          </div>
        </div>
      </div>

      {/* ===== 詳細内訳 ===== */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h3 className="text-sm font-bold text-gray-800 mb-3">費用の内訳</h3>

        <div className="space-y-2 text-sm">
          <div className="font-medium text-blue-700 flex items-center gap-1">
            <span>🚛</span>引っ越し業者
          </div>
          <div className="flex justify-between pl-6 text-gray-600">
            <span>
              業者費用
              {seasonIdx === 1 && (
                <span className="ml-1 text-xs text-red-500 font-medium">
                  繁忙期
                </span>
              )}
            </span>
            <span className="font-medium text-gray-800">
              {fmt(calc.moverCost)}
            </span>
          </div>

          <hr className="my-2 border-gray-100" />

          <div className="font-medium text-emerald-700 flex items-center gap-1">
            <span>🏠</span>新居の初期費用
          </div>
          {[
            { label: `敷金（${DEPOSIT_OPTIONS[depositIdx]}）`, value: calc.depositCost },
            { label: `礼金（${DEPOSIT_OPTIONS[keyMoneyIdx]}）`, value: calc.keyMoneyCost },
            { label: `仲介手数料（${BROKER_FEE_OPTIONS[brokerIdx]}）`, value: calc.brokerCost },
            { label: "前家賃（1ヶ月分）", value: calc.advanceRent },
            { label: "火災保険", value: insurance },
            { label: "鍵交換", value: keyChange },
            { label: `保証会社（${GUARANTOR_OPTIONS[guarantorIdx]}）`, value: calc.guarantorCost },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between pl-6 text-gray-600"
            >
              <span>{item.label}</span>
              <span className="font-medium text-gray-800">
                {fmt(item.value)}
              </span>
            </div>
          ))}

          <hr className="my-2 border-gray-100" />

          <div className="font-medium text-amber-700 flex items-center gap-1">
            <span>📦</span>その他
          </div>
          {[
            { label: "家具・家電購入", value: furniture },
            { label: "退去クリーニング", value: cleaning },
            { label: "不用品処分", value: disposal },
            { label: "引っ越し挨拶品", value: greeting },
          ].map((item) => (
            <div
              key={item.label}
              className="flex justify-between pl-6 text-gray-600"
            >
              <span>{item.label}</span>
              <span className="font-medium text-gray-800">
                {fmt(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== 節約Tips ===== */}
      {calc.tips.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8">
          <h3 className="text-sm font-bold text-yellow-800 mb-3">
            💡 節約Tips
          </h3>
          <ul className="space-y-1.5">
            {calc.tips.map((tip) => (
              <li key={tip} className="text-sm text-yellow-900 flex gap-2">
                <span className="text-yellow-500 shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ===== 入力フォーム ===== */}
      <div className="space-y-6">
        {/* セクション1: 基本情報 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            引っ越し基本情報
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="現在の住居タイプ"
              value={housingIdx}
              onChange={setHousingIdx}
              options={HOUSING_TYPES}
            />
            <SelectField
              label="移動距離"
              value={distanceIdx}
              onChange={setDistanceIdx}
              options={DISTANCE_OPTIONS}
            />
            <SelectField
              label="引っ越し時期"
              value={seasonIdx}
              onChange={setSeasonIdx}
              options={SEASON_OPTIONS}
            />
            <SelectField
              label="家族人数"
              value={familyIdx}
              onChange={setFamilyIdx}
              options={FAMILY_OPTIONS}
            />
          </div>
        </div>

        {/* セクション2: 業者費用 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-bold text-gray-800 mb-1">
            引っ越し業者費用
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            上記の基本情報から自動見積もり（{fmt(calc.autoMoverCost)}
            ）。見積もりが手元にある場合は手動で入力できます。
          </p>
          <div className="max-w-xs">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              業者費用（手動入力）
            </label>
            <input
              type="number"
              value={moverOverride}
              onChange={(e) => setMoverOverride(e.target.value)}
              placeholder={calc.autoMoverCost.toLocaleString()}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {moverOverride !== "" && (
              <button
                onClick={() => setMoverOverride("")}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                自動見積もりに戻す
              </button>
            )}
          </div>
        </div>

        {/* セクション3: 新居の初期費用 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            新居の初期費用
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                家賃（月額）
              </label>
              <input
                type="number"
                value={rent}
                onChange={(e) => setRent(parseInt(e.target.value, 10) || 0)}
                min="0"
                step="1000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <SelectField
              label="敷金"
              value={depositIdx}
              onChange={setDepositIdx}
              options={DEPOSIT_OPTIONS}
            />
            <SelectField
              label="礼金"
              value={keyMoneyIdx}
              onChange={setKeyMoneyIdx}
              options={DEPOSIT_OPTIONS}
            />
            <SelectField
              label="仲介手数料"
              value={brokerIdx}
              onChange={setBrokerIdx}
              options={BROKER_FEE_OPTIONS}
            />
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                火災保険
              </label>
              <input
                type="number"
                value={insurance}
                onChange={(e) =>
                  setInsurance(parseInt(e.target.value, 10) || 0)
                }
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                鍵交換
              </label>
              <input
                type="number"
                value={keyChange}
                onChange={(e) =>
                  setKeyChange(parseInt(e.target.value, 10) || 0)
                }
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <SelectField
              label="保証会社"
              value={guarantorIdx}
              onChange={setGuarantorIdx}
              options={GUARANTOR_OPTIONS}
            />
          </div>
        </div>

        {/* セクション4: その他の費用 */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            その他の費用
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                家具・家電購入予算
              </label>
              <input
                type="number"
                value={furniture}
                onChange={(e) =>
                  setFurniture(parseInt(e.target.value, 10) || 0)
                }
                min="0"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {FURNITURE_PRESETS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setFurniture(v)}
                    className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                      furniture === v
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-600 hover:border-blue-400"
                    }`}
                  >
                    {v === 0 ? "¥0" : fmt(v)}
                  </button>
                ))}
              </div>
            </div>
            <NumberField
              label="退去クリーニング費用"
              value={cleaning}
              onChange={setCleaning}
            />
            <NumberField
              label="不用品処分"
              value={disposal}
              onChange={setDisposal}
            />
            <NumberField
              label="引っ越し挨拶品"
              value={greeting}
              onChange={setGreeting}
            />
          </div>
        </div>
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">
          引っ越し費用計算ツールの使い方
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          住居タイプ・移動距離・時期を選ぶだけで、引っ越し業者の概算費用を自動計算します。さらに、敷金・礼金・仲介手数料などの新居の初期費用、家具購入やクリーニング費用もまとめて入力でき、引っ越しの総費用が一目でわかります。3〜4月の繁忙期は業者費用が約1.5倍になるため、時期をずらすだけで大きく節約できます。すべての計算はブラウザ上で完結し、データが外部に送信されることはありません。
        </p>
      </section>
    </div>
  );
}

/* ===== 共通コンポーネント ===== */

function SelectField<T extends readonly string[]>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  options: T;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
      >
        {options.map((opt, i) => (
          <option key={opt} value={i}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
        min="0"
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
    </div>
  );
}
