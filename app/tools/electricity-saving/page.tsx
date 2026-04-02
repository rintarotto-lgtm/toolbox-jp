"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 節電アクション定義
interface SavingAction {
  id: string;
  label: string;
  description: string;
  monthlySaving: number; // 固定削減額(円)
  isRatio: boolean;       // true = 割合で計算
  ratio?: number;         // 割合（0〜1）
}

const SAVING_ACTIONS: SavingAction[] = [
  {
    id: "aircon_temp",
    label: "エアコン設定温度を1℃調整",
    description: "冷房を1℃上げる／暖房を1℃下げることで約10%の節約",
    monthlySaving: 0,
    isRatio: true,
    ratio: 0.1,
  },
  {
    id: "led",
    label: "LED電球に交換（白熱球10個）",
    description: "白熱球10個をLEDに交換した場合の節約目安",
    monthlySaving: 800,
    isRatio: false,
  },
  {
    id: "fridge",
    label: "冷蔵庫の設定を「中」に",
    description: "冷蔵庫の強から中への設定変更で節約",
    monthlySaving: 300,
    isRatio: false,
  },
  {
    id: "standby",
    label: "待機電力を削減（主要家電）",
    description: "テレビ・エアコン等の主要家電のコンセントを抜く",
    monthlySaving: 500,
    isRatio: false,
  },
  {
    id: "washer",
    label: "エコモード洗濯機",
    description: "洗濯機をエココースに切り替え",
    monthlySaving: 200,
    isRatio: false,
  },
  {
    id: "shower",
    label: "節水シャワーヘッドに交換",
    description: "給湯のガス代・電気代の削減（ガス代含む）",
    monthlySaving: 600,
    isRatio: false,
  },
  {
    id: "tv_brightness",
    label: "テレビの輝度を下げる",
    description: "テレビの画面輝度を標準から低に変更",
    monthlySaving: 150,
    isRatio: false,
  },
];

// ─── 全国平均電気代
const AVERAGE_COSTS: { label: string; people: number; monthly: number }[] = [
  { label: "一人暮らし", people: 1, monthly: 7_000 },
  { label: "二人世帯", people: 2, monthly: 12_000 },
  { label: "三人以上", people: 3, monthly: 17_000 },
];

// ─── CO2換算係数
const CO2_PER_KWH = 0.433; // kg-CO2/kWh
const YEN_PER_KWH = 31; // 円/kWh（全国平均目安）

// ─── FAQ
const FAQS = [
  {
    question: "電気代の全国平均はいくらですか？",
    answer:
      "総務省の家計調査によると、電気代の全国平均は一人暮らしで月約7,000円、二人世帯で月約12,000円、三人以上の世帯で月約17,000円が目安です。季節によって冷暖房の使用量が変わるため、夏と冬は電気代が高くなりやすい傾向があります。",
  },
  {
    question: "節電効果の計算方法を教えてください",
    answer:
      "節電効果は「現在の電気代 × 削減率」で計算できます。例えばエアコンの設定温度を1℃変えると消費電力が約10%削減され、月1万円の電気代なら約1,000円の節約になります。複数の節電アクションを組み合わせると効果が積み上がります。",
  },
  {
    question: "エアコンと電気ストーブではどちらが電気代が安いですか？",
    answer:
      "一般的にエアコン（ヒートポンプ式）の方が電気ストーブより大幅に電気代が安くなります。エアコンは消費電力の3〜6倍の熱エネルギーを生み出せるのに対し、電気ストーブは効率が低いため、同じ暖房効果を得るためのコストはエアコンの方が3〜6分の1程度です。",
  },
  {
    question: "太陽光発電の節電効果はどのくらいですか？",
    answer:
      "一般的な家庭用（4kW）では年間約4,000kWh程度の発電が期待できます。電気料金を1kWhあたり31円とすると、年間約12万円の電気代削減になります。余剰電力は売電することも可能です。設置費用は100〜150万円が目安で、回収期間は10年前後が一般的です。",
  },
];

function toYen(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

export default function ElectricitySaving() {
  const [monthlyBill, setMonthlyBill] = useState(10_000);
  const [householdSize, setHouseholdSize] = useState(1);
  const [checkedActions, setCheckedActions] = useState<Set<string>>(new Set());
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleAction = (id: string) => {
    setCheckedActions((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 各アクションの削減額
  const actionSavings = useMemo(() => {
    return SAVING_ACTIONS.map((action) => {
      const saving = action.isRatio
        ? monthlyBill * (action.ratio ?? 0)
        : action.monthlySaving;
      return { ...action, calculatedSaving: Math.round(saving) };
    });
  }, [monthlyBill]);

  // 合計削減額
  const totalMonthlySaving = useMemo(() => {
    return actionSavings
      .filter((a) => checkedActions.has(a.id))
      .reduce((sum, a) => sum + a.calculatedSaving, 0);
  }, [actionSavings, checkedActions]);

  const totalAnnualSaving = totalMonthlySaving * 12;
  const saving10Years = totalAnnualSaving * 10;

  // CO2削減量（節約額 → kWh換算 → CO2）
  const annualCO2Reduction = useMemo(() => {
    const kwhSaved = (totalAnnualSaving / YEN_PER_KWH);
    return kwhSaved * CO2_PER_KWH;
  }, [totalAnnualSaving]);

  // 全国平均との比較
  const avgForHousehold =
    AVERAGE_COSTS.find(
      (a) => a.people === Math.min(householdSize, 3)
    )?.monthly ?? 17_000;
  const diffFromAvg = monthlyBill - avgForHousehold;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        電気代節約シミュレーター
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        節電アクションを選ぶだけで年間削減額を計算。CO2削減量も確認できます。
      </p>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-7">

        {/* 月額電気代 */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <label className="text-sm font-medium text-gray-700">
              現在の月額電気代
            </label>
            <span className="text-xl font-extrabold text-emerald-600">
              {toYen(monthlyBill)}
            </span>
          </div>
          <input
            type="range"
            min={2_000}
            max={50_000}
            step={500}
            value={monthlyBill}
            onChange={(e) => setMonthlyBill(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-emerald-500
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-emerald-200 to-emerald-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>2,000円</span>
            <span>15,000円</span>
            <span>30,000円</span>
            <span>50,000円</span>
          </div>
        </div>

        {/* 世帯人数 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            世帯人数
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setHouseholdSize(n)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                  householdSize === n
                    ? "bg-emerald-500 text-white border-emerald-500 shadow"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-emerald-50"
                }`}
              >
                {n}人{n === 5 ? "以上" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* 節電アクション */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            節電アクション（複数選択可）
          </label>
          <div className="space-y-3">
            {actionSavings.map((action) => (
              <label
                key={action.id}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  checkedActions.has(action.id)
                    ? "bg-emerald-50 border-emerald-300"
                    : "bg-white border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checkedActions.has(action.id)}
                  onChange={() => toggleAction(action.id)}
                  className="mt-0.5 w-5 h-5 rounded accent-emerald-500 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {action.label}
                    </span>
                    <span className="text-sm font-bold text-emerald-600 flex-shrink-0">
                      月▲{toYen(action.calculatedSaving)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {action.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ─── ヒーローカード ─── */}
      <div className="rounded-2xl p-6 mb-6 text-white shadow-lg bg-gradient-to-br from-emerald-500 to-green-500">
        <p className="text-sm font-medium opacity-90 mb-1">年間節約額（目安）</p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">
          {toYen(totalAnnualSaving)}
        </p>
        <p className="text-base opacity-80 mb-4">
          月額削減：{toYen(totalMonthlySaving)} / 月
        </p>
        {checkedActions.size === 0 && (
          <p className="text-sm opacity-70">
            上の節電アクションにチェックを入れると節約額が計算されます
          </p>
        )}
        {totalAnnualSaving > 0 && (
          <div className="pt-4 border-t border-white/30 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs opacity-75">10年間の累計節約額</p>
              <p className="text-2xl font-bold">{toYen(saving10Years)}</p>
            </div>
            <div>
              <p className="text-xs opacity-75">年間CO2削減量</p>
              <p className="text-2xl font-bold">
                {annualCO2Reduction.toFixed(1)} kg
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ─── 項目別節約効果 ─── */}
      {checkedActions.size > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            節電アクション別の効果
          </h2>
          <div className="space-y-4">
            {actionSavings
              .filter((a) => checkedActions.has(a.id))
              .sort((a, b) => b.calculatedSaving - a.calculatedSaving)
              .map((action) => {
                const pct =
                  totalMonthlySaving > 0
                    ? (action.calculatedSaving / totalMonthlySaving) * 100
                    : 0;
                const reduction =
                  monthlyBill > 0
                    ? ((action.calculatedSaving / monthlyBill) * 100).toFixed(1)
                    : "0";
                return (
                  <div key={action.id}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-700 font-medium">
                        {action.label}
                      </span>
                      <span className="text-emerald-600 font-semibold">
                        月▲{toYen(action.calculatedSaving)}（{reduction}%削減）
                      </span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm font-bold text-gray-800">合計（月額）</span>
            <span className="text-lg font-extrabold text-emerald-600">
              ▲{toYen(totalMonthlySaving)}
            </span>
          </div>
        </div>
      )}

      <AdBanner />

      {/* ─── 全国平均との比較 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          全国平均との比較
        </h2>
        <div className="space-y-3">
          {AVERAGE_COSTS.map((avg) => {
            const barMax = 20_000;
            return (
              <div key={avg.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">{avg.label}の平均</span>
                  <span className="font-semibold text-gray-700">
                    {toYen(avg.monthly)}/月
                  </span>
                </div>
                <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-300 rounded-full"
                    style={{
                      width: `${Math.min((avg.monthly / barMax) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
          {/* 現在の電気代 */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 font-semibold">
                あなたの電気代
              </span>
              <span
                className={`font-bold ${
                  diffFromAvg > 0 ? "text-red-500" : "text-emerald-600"
                }`}
              >
                {toYen(monthlyBill)}/月（平均比{" "}
                {diffFromAvg > 0 ? "+" : ""}
                {toYen(diffFromAvg)}）
              </span>
            </div>
            <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  diffFromAvg > 0
                    ? "bg-gradient-to-r from-amber-400 to-red-400"
                    : "bg-gradient-to-r from-emerald-400 to-green-500"
                }`}
                style={{
                  width: `${Math.min((monthlyBill / 20_000) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※ 全国平均は目安です。地域・住居形態・使用する家電によって大きく異なります。
        </p>
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
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-emerald-600"
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

      <RelatedTools currentToolId="electricity-saving" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは目安計算です。実際の節約額は生活環境・家電の種類・使用状況によって異なります。
        CO2削減量は電力の排出係数0.433kg-CO2/kWh（目安）で換算しています。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
