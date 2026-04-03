"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

interface CardPreset {
  id: string;
  name: string;
  rate: number; // %
  annualFee: number; // 円
  note?: string;
}

const presets: CardPreset[] = [
  { id: "rakuten", name: "楽天カード", rate: 1.0, annualFee: 0 },
  { id: "paypay", name: "PayPayカード", rate: 1.0, annualFee: 0 },
  { id: "recruit", name: "リクルートカード", rate: 1.2, annualFee: 0 },
  { id: "smbc_nl", name: "三井住友カードNL", rate: 0.5, annualFee: 0, note: "対象店最大5%" },
  { id: "jcb_w", name: "JCBカード W", rate: 2.0, annualFee: 0 },
  { id: "dcard_gold", name: "dカード GOLD", rate: 1.0, annualFee: 11000, note: "+特典" },
  { id: "rakuten_premium", name: "楽天プレミアム", rate: 1.0, annualFee: 11000, note: "+特典" },
  { id: "custom", name: "カスタム", rate: 1.0, annualFee: 0 },
];

interface CardSlot {
  presetId: string;
  customName: string;
  customRate: string;
  customFee: string;
}

const defaultSlot = (): CardSlot => ({
  presetId: "rakuten",
  customName: "",
  customRate: "1.0",
  customFee: "0",
});

function getCardParams(slot: CardSlot): { name: string; rate: number; annualFee: number } {
  if (slot.presetId === "custom") {
    return {
      name: slot.customName || "カスタムカード",
      rate: parseFloat(slot.customRate) || 0,
      annualFee: parseFloat(slot.customFee) || 0,
    };
  }
  const preset = presets.find((p) => p.id === slot.presetId)!;
  return { name: preset.name, rate: preset.rate, annualFee: preset.annualFee };
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("ja-JP");
}

export default function PointCalc() {
  const [monthlySpend, setMonthlySpend] = useState("100000");
  const [useDetailed, setUseDetailed] = useState(false);
  const [food, setFood] = useState("30000");
  const [transport, setTransport] = useState("10000");
  const [utilities, setUtilities] = useState("15000");
  const [shopping, setShopping] = useState("20000");
  const [travel, setTravel] = useState("10000");
  const [other, setOther] = useState("15000");

  const [slots, setSlots] = useState<CardSlot[]>([defaultSlot()]);

  const totalMonthly = useMemo(() => {
    if (useDetailed) {
      return (
        (parseFloat(food) || 0) +
        (parseFloat(transport) || 0) +
        (parseFloat(utilities) || 0) +
        (parseFloat(shopping) || 0) +
        (parseFloat(travel) || 0) +
        (parseFloat(other) || 0)
      );
    }
    return parseFloat(monthlySpend) || 0;
  }, [useDetailed, monthlySpend, food, transport, utilities, shopping, travel, other]);

  const cardResults = useMemo(() => {
    return slots.map((slot) => {
      const { name, rate, annualFee } = getCardParams(slot);
      const monthlyPoints = (totalMonthly * rate) / 100;
      const yearlyPoints = monthlyPoints * 12;
      const yearlyValue = yearlyPoints; // 1pt = 1円換算
      const netValue = yearlyValue - annualFee;
      const tenYearNet = netValue * 10;
      return { name, rate, annualFee, monthlyPoints, yearlyPoints, yearlyValue, netValue, tenYearNet };
    });
  }, [slots, totalMonthly]);

  const bestIndex = cardResults.reduce(
    (bestIdx, cur, idx) => (cur.netValue > cardResults[bestIdx].netValue ? idx : bestIdx),
    0
  );

  const addCard = () => {
    if (slots.length < 3) setSlots([...slots, defaultSlot()]);
  };

  const removeCard = (idx: number) => {
    setSlots(slots.filter((_, i) => i !== idx));
  };

  const updateSlot = (idx: number, patch: Partial<CardSlot>) => {
    setSlots(slots.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const COLORS = [
    { border: "border-yellow-400", bg: "bg-yellow-50", badge: "bg-yellow-400" },
    { border: "border-blue-400", bg: "bg-blue-50", badge: "bg-blue-400" },
    { border: "border-purple-400", bg: "bg-purple-50", badge: "bg-purple-400" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 p-6 mb-6 text-white">
        <div className="text-4xl mb-2">🎁</div>
        <h1 className="text-2xl font-bold mb-1">ポイント還元率計算</h1>
        <p className="text-yellow-100 text-sm">
          月の利用額とカードの還元率から年間お得額を計算。複数カードを比較して最適な1枚を見つけましょう。
        </p>
      </div>

      <AdBanner />

      {/* 月間利用額入力 */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">月間利用額</h2>
          <button
            onClick={() => setUseDetailed(!useDetailed)}
            className="text-xs text-blue-600 underline"
          >
            {useDetailed ? "シンプル入力に切替" : "カテゴリ別に入力"}
          </button>
        </div>

        {!useDetailed ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              月間クレカ利用額（円）
            </label>
            <input
              type="number"
              value={monthlySpend}
              onChange={(e) => setMonthlySpend(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="例: 100000"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "食費", value: food, set: setFood },
              { label: "交通費", value: transport, set: setTransport },
              { label: "光熱費", value: utilities, set: setUtilities },
              { label: "ショッピング", value: shopping, set: setShopping },
              { label: "旅行・外食", value: travel, set: setTravel },
              { label: "その他", value: other, set: setOther },
            ].map(({ label, value, set }) => (
              <div key={label}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>
            ))}
          </div>
        )}

        <div className="pt-1 flex items-center gap-2 text-sm">
          <span className="text-gray-500">月間合計:</span>
          <span className="font-bold text-gray-900">{fmt(totalMonthly)} 円</span>
          <span className="text-gray-400 text-xs">（年間: {fmt(totalMonthly * 12)} 円）</span>
        </div>
      </div>

      {/* カード設定 */}
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-gray-900">カードを比較</h2>
          {slots.length < 3 && (
            <button
              onClick={addCard}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              ＋ カードを追加
            </button>
          )}
        </div>

        {slots.map((slot, idx) => {
          const color = COLORS[idx % COLORS.length];
          const result = cardResults[idx];
          const isCustom = slot.presetId === "custom";
          return (
            <div key={idx} className={`bg-white border-2 ${color.border} rounded-xl p-5`}>
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${color.badge}`}>
                  カード {idx + 1}
                </span>
                {slots.length > 1 && (
                  <button onClick={() => removeCard(idx)} className="text-xs text-gray-400 hover:text-red-500">
                    削除
                  </button>
                )}
                {idx === bestIndex && slots.length > 1 && (
                  <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">
                    ★ おすすめ
                  </span>
                )}
              </div>

              {/* プリセット選択 */}
              <div className="flex flex-wrap gap-2 mb-4">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => updateSlot(idx, { presetId: p.id })}
                    className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
                      slot.presetId === p.id
                        ? "border-orange-400 bg-orange-50 text-orange-700 font-medium"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {p.name}
                    {p.note && <span className="ml-1 text-gray-400">{p.note}</span>}
                  </button>
                ))}
              </div>

              {isCustom && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">カード名</label>
                    <input
                      type="text"
                      value={slot.customName}
                      onChange={(e) => updateSlot(idx, { customName: e.target.value })}
                      placeholder="カード名"
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">還元率（%）</label>
                    <input
                      type="number"
                      value={slot.customRate}
                      onChange={(e) => updateSlot(idx, { customRate: e.target.value })}
                      step="0.1"
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">年会費（円）</label>
                    <input
                      type="number"
                      value={slot.customFee}
                      onChange={(e) => updateSlot(idx, { customFee: e.target.value })}
                      min="0"
                      className="w-full p-2 border border-gray-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {/* 結果 */}
              {totalMonthly > 0 && (
                <div className={`${color.bg} rounded-xl p-4`}>
                  <p className="text-sm font-bold text-gray-800 mb-3">
                    {result.name}（還元率 {result.rate}%、年会費 {fmt(result.annualFee)}円）
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">月間獲得ポイント</p>
                      <p className="text-base font-bold text-gray-800">{fmt(result.monthlyPoints)} pt</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">年間獲得ポイント</p>
                      <p className="text-base font-bold text-gray-800">{fmt(result.yearlyPoints)} pt</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">年間お得額</p>
                      <p className="text-base font-bold text-gray-800">{fmt(result.yearlyValue)} 円</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">年会費差引後</p>
                      <p className={`text-base font-bold ${result.netValue >= 0 ? "text-green-700" : "text-red-600"}`}>
                        {result.netValue >= 0 ? "+" : ""}{fmt(result.netValue)} 円
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 10年間比較 */}
      {totalMonthly > 0 && slots.length > 1 && (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">10年間の累計比較</h2>
          <div className="space-y-3">
            {cardResults.map((r, idx) => {
              const color = COLORS[idx % COLORS.length];
              const maxNet = Math.max(...cardResults.map((x) => x.tenYearNet));
              const barWidth = maxNet > 0 ? Math.max(4, (r.tenYearNet / maxNet) * 100) : 0;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{r.name}</span>
                    <span className={`font-bold ${r.tenYearNet >= 0 ? "text-green-700" : "text-red-600"}`}>
                      {r.tenYearNet >= 0 ? "+" : ""}{fmt(r.tenYearNet)} 円
                    </span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${color.badge}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AdBanner />

      <section className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          月間のクレジットカード利用額を入力し、比較したいカードを選択（最大3枚）してください。
          カードのプリセットを選ぶか、カスタムで任意の還元率と年会費を入力できます。
          年会費を差し引いた実質お得額と10年間の累計効果を比較できます。
        </p>
        <p className="text-xs text-gray-400 mt-3 p-3 bg-gray-50 rounded-lg">
          ※ポイント還元率・年会費は変更になる場合があります。各カード会社の公式情報を必ずご確認ください。
          特定のカードへの加入を推奨するものではありません。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "ポイント還元率1%とは何ですか？",
            answer:
              "100円の利用で1ポイント（1円相当）が貯まるという意味です。年間100万円使うと1万ポイント（1万円相当）になります。",
          },
          {
            question: "お得なクレジットカードの還元率の目安は？",
            answer:
              "一般的なカードは0.5〜1%、高還元率カードは1.5〜2%以上です。年会費無料で1%以上のカードを選ぶと効率的です。",
          },
          {
            question: "ポイントの有効期限はありますか？",
            answer:
              "カードによって異なりますが、多くは1〜3年の有効期限があります。失効する前に使い切るか、ポイントが無期限のカードを選ぶことが重要です。",
          },
          {
            question: "ポイントの2重取り・3重取りとは？",
            answer:
              "クレジットカードのポイントに加え、ショッピングサイトのポイントや電子マネーのポイントも同時に獲得することです。うまく組み合わせると還元率5〜10%になることもあります。",
          },
        ]}
      />

      <RelatedTools currentToolId="point-calc" />
    </div>
  );
}
