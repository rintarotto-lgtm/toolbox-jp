"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 自動車税（2019年10月以降の新車登録ベース）
const VEHICLE_TAX: Record<string, number> = {
  "~1000cc": 25_000,
  "~1500cc": 30_500,
  "~2000cc": 36_000,
  "~2500cc": 43_500,
  "~3000cc": 50_000,
  "3000cc超": 57_000,
};

// ─── 自動車重量税（2年分、エコカー非該当）
const WEIGHT_TAX: Record<string, number> = {
  "~0.5t": 8_200,
  "~1t": 16_400,
  "~1.5t": 24_600,
  "~2t": 32_800,
  "~2.5t": 41_000,
  "~3t": 49_200,
};

// ─── 自賠責保険料
const JIBAISEKI: Record<string, number> = {
  "24ヶ月": 17_650,
  "36ヶ月": 25_070,
};

// ─── FAQ
const FAQS = [
  {
    question: "車の諸費用はいくらくらいかかりますか？",
    answer:
      "新車の場合、車両本体価格の10〜15%程度が諸費用の目安です。200万円の車なら20〜30万円の諸費用がかかります。中古車は車両価格の15〜20%程度です。",
  },
  {
    question: "自動車税は毎年いくらかかりますか？",
    answer:
      "排気量によって異なります。1,000cc以下は25,000円、1,500cc以下は30,500円、2,000cc以下は36,000円、2,500cc以下は43,500円（2019年10月以降の新車登録）です。",
  },
  {
    question: "カーローンの金利はどのくらいですか？",
    answer:
      "ディーラーローンは3〜8%程度、銀行の自動車ローンは1〜3%程度が多いです。金利差によって総支払額が大きく変わるため、事前に比較することをおすすめします。",
  },
  {
    question: "車の維持費は年間いくらかかりますか？",
    answer:
      "普通乗用車の場合、自動車税・保険・車検・ガソリン・駐車場などを合わせると年間50〜80万円程度が平均的です。",
  },
];

function fmt(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}
function fmtMan(n: number): string {
  return `${(n / 10_000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}万円`;
}

export default function CarPurchase() {
  const [vehiclePrice, setVehiclePrice] = useState(200); // 万円
  const [isNew, setIsNew] = useState(true);
  const [displacement, setDisplacement] = useState("~2000cc");
  const [weight, setWeight] = useState("~1.5t");
  const [jibaisekiPeriod, setJibaisekiPeriod] = useState<"24ヶ月" | "36ヶ月">("36ヶ月");
  const [options, setOptions] = useState(20); // 万円
  const [hasTrade, setHasTrade] = useState(false);
  const [tradeValue, setTradeValue] = useState(30); // 万円
  const [useLoan, setUseLoan] = useState(false);
  const [downPayment, setDownPayment] = useState(50); // 万円
  const [loanYears, setLoanYears] = useState(5);
  const [loanRate, setLoanRate] = useState(3.0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(() => {
    const priceYen = vehiclePrice * 10_000;
    const optionsYen = options * 10_000;
    const tradeYen = hasTrade ? tradeValue * 10_000 : 0;

    // 消費税（車両＋オプション）
    const consumptionTax = (priceYen + optionsYen) * 0.10;

    // 自動車重量税
    const weightTax = WEIGHT_TAX[weight] ?? 32_800;

    // 自賠責保険
    const jibaiseki = JIBAISEKI[jibaisekiPeriod];

    // 登録費用概算（新車3〜4万、中古2〜3万）
    const registrationFee = isNew ? 35_000 : 25_000;

    // 自動車税（初年度按分 — 4月登録想定で12/12）
    const vehicleTax = VEHICLE_TAX[displacement] ?? 36_000;

    // 小計（下取り前）
    const subtotal =
      priceYen +
      optionsYen +
      consumptionTax +
      vehicleTax +
      weightTax +
      jibaiseki +
      registrationFee;

    // 購入時総支払額
    const totalPurchase = subtotal - tradeYen;

    // ローン計算
    let monthlyPayment = 0;
    let totalLoanPayment = 0;
    let totalInterest = 0;
    if (useLoan) {
      const loanAmount = Math.max(0, totalPurchase - downPayment * 10_000);
      const months = loanYears * 12;
      const monthlyRate = loanRate / 100 / 12;
      if (loanRate === 0) {
        monthlyPayment = loanAmount / months;
        totalLoanPayment = loanAmount + downPayment * 10_000;
        totalInterest = 0;
      } else {
        monthlyPayment =
          (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
        totalLoanPayment = monthlyPayment * months + downPayment * 10_000;
        totalInterest = monthlyPayment * months - loanAmount;
      }
    }

    // 5年間維持費概算
    const annualTax = vehicleTax;
    const annualInsurance = 80_000; // 任意保険概算
    const biennialShaken = (weightTax + jibaiseki + 50_000) / 2; // 車検費用÷2
    const annualGas = 120_000; // ガソリン概算
    const annualParking = 240_000; // 駐車場概算（月2万円）
    const annualMaintenance = annualTax + annualInsurance + biennialShaken + annualGas + annualParking;
    const fiveYearMaintenance = annualMaintenance * 5;

    return {
      priceYen,
      optionsYen,
      consumptionTax,
      vehicleTax,
      weightTax,
      jibaiseki,
      registrationFee,
      tradeYen,
      totalPurchase: Math.round(totalPurchase),
      monthlyPayment: Math.round(monthlyPayment),
      totalLoanPayment: Math.round(totalLoanPayment),
      totalInterest: Math.round(totalInterest),
      annualMaintenance: Math.round(annualMaintenance),
      fiveYearMaintenance: Math.round(fiveYearMaintenance),
    };
  }, [vehiclePrice, isNew, displacement, weight, jibaisekiPeriod, options, hasTrade, tradeValue, useLoan, downPayment, loanYears, loanRate]);

  const breakdown = [
    { label: "車両本体価格", value: result.priceYen, color: "text-gray-800" },
    { label: "オプション・アクセサリー", value: result.optionsYen, color: "text-gray-700" },
    { label: "消費税（10%）", value: result.consumptionTax, color: "text-gray-700" },
    { label: "自動車税（初年度）", value: result.vehicleTax, color: "text-gray-700" },
    { label: "自動車重量税（2年）", value: result.weightTax, color: "text-gray-700" },
    { label: `自賠責保険（${jibaisekiPeriod}）`, value: result.jibaiseki, color: "text-gray-700" },
    { label: "登録費用概算", value: result.registrationFee, color: "text-gray-700" },
    ...(hasTrade ? [{ label: "下取り額", value: -result.tradeYen, color: "text-green-600" }] : []),
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヒーローヘッダー ─── */}
      <div className="bg-gradient-to-br from-slate-600 to-zinc-700 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🚘</span>
          <h1 className="text-2xl font-bold">車購入費用計算</h1>
        </div>
        <p className="text-sm opacity-90">
          車両本体価格＋諸費用＋ローン利息まで含めた購入総額をシミュレーションします。
        </p>
      </div>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-800">車両情報を入力</h2>

        {/* 車両本体価格 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">車両本体価格</label>
          <input
            type="range"
            min={50}
            max={1000}
            step={10}
            value={vehiclePrice}
            onChange={(e) => setVehiclePrice(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-slate-600
              bg-gradient-to-r from-slate-200 to-slate-500"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>50万</span><span>250万</span><span>500万</span><span>750万</span><span>1,000万</span>
          </div>
          <p className="text-center text-2xl font-bold text-slate-700 mt-1">{vehiclePrice}万円</p>
        </div>

        {/* 新車/中古車 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">車の種別</label>
          <div className="flex gap-3">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                onClick={() => setIsNew(v)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  isNew === v
                    ? "bg-slate-700 text-white border-slate-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-slate-50"
                }`}
              >
                {v ? "新車" : "中古車"}
              </button>
            ))}
          </div>
        </div>

        {/* 排気量 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">排気量</label>
          <select
            value={displacement}
            onChange={(e) => setDisplacement(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm bg-white"
          >
            {Object.entries(VEHICLE_TAX).map(([key, tax]) => (
              <option key={key} value={key}>
                {key}（年税額: {tax.toLocaleString("ja-JP")}円）
              </option>
            ))}
          </select>
        </div>

        {/* 車両重量 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">車両重量</label>
          <select
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm bg-white"
          >
            {Object.entries(WEIGHT_TAX).map(([key, tax]) => (
              <option key={key} value={key}>
                {key}（重量税2年: {tax.toLocaleString("ja-JP")}円）
              </option>
            ))}
          </select>
        </div>

        {/* 自賠責 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">自賠責保険期間</label>
          <div className="flex gap-3">
            {(["24ヶ月", "36ヶ月"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setJibaisekiPeriod(v)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  jibaisekiPeriod === v
                    ? "bg-slate-700 text-white border-slate-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-slate-50"
                }`}
              >
                {v}（{JIBAISEKI[v].toLocaleString("ja-JP")}円）
              </button>
            ))}
          </div>
        </div>

        {/* オプション */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">オプション・アクセサリー</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={200}
              step={1}
              value={options}
              onChange={(e) => setOptions(Math.max(0, Number(e.target.value)))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
            />
            <span className="text-sm text-gray-600 whitespace-nowrap">万円</span>
          </div>
        </div>

        {/* 下取り */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">下取り車</label>
          <div className="flex gap-3 mb-3">
            {[false, true].map((v) => (
              <button
                key={String(v)}
                onClick={() => setHasTrade(v)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  hasTrade === v
                    ? "bg-slate-700 text-white border-slate-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-slate-50"
                }`}
              >
                {v ? "あり" : "なし"}
              </button>
            ))}
          </div>
          {hasTrade && (
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={0}
                max={500}
                step={1}
                value={tradeValue}
                onChange={(e) => setTradeValue(Math.max(0, Number(e.target.value)))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
              />
              <span className="text-sm text-gray-600 whitespace-nowrap">万円</span>
            </div>
          )}
        </div>

        {/* ローン */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ローン利用</label>
          <div className="flex gap-3 mb-3">
            {[false, true].map((v) => (
              <button
                key={String(v)}
                onClick={() => setUseLoan(v)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  useLoan === v
                    ? "bg-slate-700 text-white border-slate-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-slate-50"
                }`}
              >
                {v ? "あり" : "なし"}
              </button>
            ))}
          </div>
          {useLoan && (
            <div className="space-y-4 mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">頭金</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={vehiclePrice}
                    step={5}
                    value={downPayment}
                    onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                  />
                  <span className="text-sm text-gray-600 whitespace-nowrap">万円</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">ローン期間: {loanYears}年</label>
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={1}
                  value={loanYears}
                  onChange={(e) => setLoanYears(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-slate-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">年利: {loanRate}%</label>
                <input
                  type="range"
                  min={0}
                  max={10}
                  step={0.1}
                  value={loanRate}
                  onChange={(e) => setLoanRate(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-slate-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                  <span>0%（無利子）</span><span>銀行系: 1〜3%</span><span>ディーラー: 〜10%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── 結果: 総支払額ヒーローカード ─── */}
      <div className="bg-gradient-to-br from-slate-600 to-zinc-700 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <p className="text-sm opacity-80 mb-1">購入時の総支払額</p>
        <p className="text-4xl font-extrabold tracking-tight">
          {fmtMan(result.totalPurchase)}
        </p>
        {useLoan && (
          <p className="text-sm opacity-80 mt-2">
            ローン利用時の総返済額: {fmtMan(result.totalLoanPayment)}
          </p>
        )}
      </div>

      <AdBanner />

      {/* ─── 内訳テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">費用内訳</h2>
        <div className="space-y-2">
          {breakdown.map(({ label, value, color }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-600">{label}</span>
              <span className={`text-sm font-semibold ${color}`}>
                {value < 0 ? `−${fmt(-value)}` : fmt(value)}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center py-2 pt-3 border-t-2 border-gray-300">
            <span className="text-sm font-bold text-gray-900">購入時 総支払額</span>
            <span className="text-lg font-extrabold text-slate-700">{fmt(result.totalPurchase)}</span>
          </div>
        </div>
      </div>

      {/* ─── ローン詳細 ─── */}
      {useLoan && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">ローン詳細</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-600 mb-1">月々の返済額</p>
              <p className="text-xl font-bold text-slate-700">{fmt(result.monthlyPayment)}</p>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-center">
              <p className="text-xs text-zinc-600 mb-1">ローン総返済額</p>
              <p className="text-xl font-bold text-zinc-700">{fmtMan(result.totalLoanPayment)}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-xs text-red-600 mb-1">利息総額</p>
              <p className="text-xl font-bold text-red-600">{fmtMan(result.totalInterest)}</p>
            </div>
          </div>
        </div>
      )}

      {/* ─── 5年間維持費概算 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">5年間維持費概算</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: "自動車税（年）", value: VEHICLE_TAX[displacement] ?? 36_000 },
            { label: "任意保険（年・概算）", value: 80_000 },
            { label: "車検費用（年割）", value: Math.round((WEIGHT_TAX[weight] + JIBAISEKI[jibaisekiPeriod] + 50_000) / 2) },
            { label: "ガソリン代（年・概算）", value: 120_000 },
            { label: "駐車場代（年・概算）", value: 240_000 },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-gray-600">{label}</span>
              <span className="font-medium text-gray-800">{fmt(value)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-900">年間維持費 合計</span>
          <span className="text-lg font-extrabold text-slate-700">{fmt(result.annualMaintenance)}</span>
        </div>
        <div className="mt-2 flex justify-between items-center bg-slate-50 rounded-lg p-3">
          <span className="text-sm font-bold text-gray-900">5年間維持費 合計</span>
          <span className="text-xl font-extrabold text-slate-700">{fmtMan(result.fiveYearMaintenance)}</span>
        </div>
        <p className="text-xs text-gray-400 mt-2">※ 駐車場・ガソリン代は地域・使用頻度により大きく異なります。</p>
      </div>

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-slate-600"
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

      <RelatedTools currentToolId="car-purchase" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは概算です。自動車税・重量税・自賠責保険料は車種・登録時期・エコカー減税の適用によって異なります。
        登録費用・維持費も地域・使用状況によって変わります。実際の費用はディーラーや販売店にご確認ください。
        入力情報はブラウザ上でのみ処理され、サーバーへ送信されることは一切ありません。
      </p>
    </div>
  );
}
