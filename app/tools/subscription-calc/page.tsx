"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/* ─── Types ─── */
type UsageFreq = "daily" | "weekly" | "monthly" | "rarely";
type PayCycle = "monthly" | "yearly";

interface SubItem {
  id: string;
  name: string;
  price: number;
  category: string;
  payCycle: PayCycle;
  freq: UsageFreq;
}

/* ─── Preset services ─── */
const PRESET_SERVICES: { id: string; name: string; price: number; category: string }[] = [
  // 動画
  { id: "netflix", name: "Netflix", price: 1490, category: "動画" },
  { id: "amazon_prime", name: "Amazon Prime", price: 600, category: "動画" },
  { id: "disney_plus", name: "Disney+", price: 990, category: "動画" },
  { id: "hulu", name: "Hulu", price: 1026, category: "動画" },
  { id: "unext", name: "U-NEXT", price: 2189, category: "動画" },
  { id: "youtube_premium", name: "YouTube Premium", price: 1180, category: "動画" },
  // 音楽
  { id: "spotify", name: "Spotify", price: 980, category: "音楽" },
  { id: "apple_music", name: "Apple Music", price: 1080, category: "音楽" },
  { id: "amazon_music", name: "Amazon Music Unlimited", price: 980, category: "音楽" },
  // クラウド
  { id: "icloud", name: "iCloud+", price: 130, category: "クラウド" },
  { id: "google_one", name: "Google One", price: 250, category: "クラウド" },
  { id: "dropbox", name: "Dropbox", price: 1200, category: "クラウド" },
  // ゲーム
  { id: "nso", name: "Nintendo Switch Online", price: 306, category: "ゲーム" },
  { id: "ps_plus", name: "PS Plus", price: 850, category: "ゲーム" },
  { id: "xbox_gp", name: "Xbox Game Pass", price: 850, category: "ゲーム" },
  // その他
  { id: "chatgpt", name: "ChatGPT Plus", price: 3000, category: "その他" },
  { id: "adobe_cc", name: "Adobe CC", price: 6480, category: "その他" },
  { id: "ms365", name: "Microsoft 365", price: 1082, category: "その他" },
];

const CATEGORIES = ["動画", "音楽", "クラウド", "ゲーム", "その他"];

const FREQ_LABEL: Record<UsageFreq, string> = {
  daily: "毎日",
  weekly: "週数回",
  monthly: "月数回",
  rarely: "ほぼ使っていない",
};

let nextId = 1;
function makeId() {
  return `custom_${nextId++}`;
}

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

/* ─── Main Component ─── */
export default function SubscriptionCalcPage() {
  const [activeItems, setActiveItems] = useState<SubItem[]>([]);
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [customCategory, setCustomCategory] = useState("その他");

  /* ─ Add preset ─ */
  function addPreset(preset: (typeof PRESET_SERVICES)[number]) {
    if (activeItems.some((i) => i.id === preset.id)) return;
    setActiveItems((prev) => [
      ...prev,
      {
        id: preset.id,
        name: preset.name,
        price: preset.price,
        category: preset.category,
        payCycle: "monthly",
        freq: "weekly",
      },
    ]);
  }

  function removeItem(id: string) {
    setActiveItems((prev) => prev.filter((i) => i.id !== id));
  }

  function updateItem(id: string, field: keyof SubItem, value: string | number) {
    setActiveItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  }

  function addCustom() {
    const price = Number(customPrice);
    if (!customName.trim() || isNaN(price) || price <= 0) return;
    setActiveItems((prev) => [
      ...prev,
      {
        id: makeId(),
        name: customName.trim(),
        price,
        category: customCategory,
        payCycle: "monthly",
        freq: "weekly",
      },
    ]);
    setCustomName("");
    setCustomPrice("");
  }

  /* ─ Calculations ─ */
  const calc = useMemo(() => {
    if (activeItems.length === 0) {
      return {
        monthly: 0,
        annual: 0,
        daily: 0,
        byCategory: {} as Record<string, number>,
        lowFreqTotal: 0,
        lowFreqItems: [] as SubItem[],
        yearlyBenefit: 0,
        yearlyBenefitItems: [] as SubItem[],
      };
    }

    // Monthly equivalent for each item
    const monthlyMap = activeItems.map((item) => {
      const m = item.payCycle === "yearly" ? item.price : item.price;
      return { ...item, monthly: m };
    });

    const monthly = monthlyMap.reduce((sum, i) => sum + i.monthly, 0);
    const annual = monthly * 12;
    const daily = annual / 365;

    // Category breakdown
    const byCategory: Record<string, number> = {};
    for (const item of monthlyMap) {
      byCategory[item.category] = (byCategory[item.category] || 0) + item.monthly;
    }

    // Low frequency items
    const lowFreqItems = activeItems.filter(
      (i) => i.freq === "rarely" || i.freq === "monthly"
    );
    const lowFreqTotal = lowFreqItems.reduce((sum, i) => sum + i.price, 0);

    // Yearly payment benefit (2 months free = ~16.7% discount)
    const yearlyBenefitItems = activeItems.filter((i) => i.payCycle === "monthly");
    const yearlyBenefit = Math.round(
      yearlyBenefitItems.reduce((sum, i) => sum + i.price * 12 * 0.167, 0)
    );

    return {
      monthly,
      annual,
      daily,
      byCategory,
      lowFreqTotal,
      lowFreqItems,
      yearlyBenefit,
      yearlyBenefitItems,
    };
  }, [activeItems]);

  const categoryColors: Record<string, string> = {
    動画: "#6366f1",
    音楽: "#ec4899",
    クラウド: "#0ea5e9",
    ゲーム: "#f59e0b",
    その他: "#10b981",
  };

  const maxCategoryVal = Math.max(...Object.values(calc.byCategory), 1);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ── Header ── */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📱</span>
          <h1 className="text-2xl font-bold">サブスク費用計算・最適化</h1>
        </div>
        <p className="text-purple-100 text-sm">
          登録中のサブスクを選んで年間コストを可視化。見直しポイントも提案します。
        </p>
      </div>

      <AdBanner />

      {/* ── Preset Selector ── */}
      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-4">
          よく使われるサービスから追加
        </h2>

        {CATEGORIES.map((cat) => (
          <div key={cat} className="mb-4">
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
              {cat}
            </p>
            <div className="flex flex-wrap gap-2">
              {PRESET_SERVICES.filter((s) => s.category === cat).map((service) => {
                const isActive = activeItems.some((i) => i.id === service.id);
                return (
                  <button
                    key={service.id}
                    onClick={() => (isActive ? removeItem(service.id) : addPreset(service))}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      isActive
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:text-purple-700"
                    }`}
                  >
                    {isActive && <span>✓</span>}
                    {service.name}
                    <span className={isActive ? "text-purple-200" : "text-gray-400"}>
                      {formatYen(service.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Custom item */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-500 mb-2">カスタム追加</p>
          <div className="flex flex-wrap gap-2 items-end">
            <input
              type="text"
              placeholder="サービス名"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 min-w-32 rounded-xl border border-gray-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="number"
              placeholder="月額（円）"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              className="w-32 rounded-xl border border-gray-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <select
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="rounded-xl border border-gray-300 px-3 py-2 text-sm
                focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              onClick={addCustom}
              className="rounded-xl bg-purple-600 text-white px-4 py-2 text-sm font-medium
                hover:bg-purple-700 transition-colors cursor-pointer"
            >
              追加
            </button>
          </div>
        </div>
      </section>

      {/* ── Active list ── */}
      {activeItems.length > 0 && (
        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            登録中のサブスク（{activeItems.length}件）
          </h2>
          <div className="space-y-3">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border p-3 ${
                  item.freq === "rarely"
                    ? "border-red-200 bg-red-50"
                    : item.freq === "monthly"
                    ? "border-amber-200 bg-amber-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full text-white shrink-0"
                      style={{ backgroundColor: categoryColors[item.category] || "#6b7280" }}
                    >
                      {item.category}
                    </span>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      className="text-sm font-medium bg-transparent border-0 border-b border-dashed border-gray-400 focus:outline-none focus:border-purple-500 w-full"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors shrink-0 cursor-pointer text-lg leading-none"
                    aria-label="削除"
                  >
                    ×
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">月額</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                      className="w-24 text-sm font-bold text-gray-800 border border-gray-300 rounded-lg px-2 py-1
                        focus:outline-none focus:ring-1 focus:ring-purple-400 tabular-nums"
                    />
                    <span className="text-xs text-gray-500">円</span>
                  </div>
                  <select
                    value={item.payCycle}
                    onChange={(e) => updateItem(item.id, "payCycle", e.target.value)}
                    className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none cursor-pointer"
                  >
                    <option value="monthly">月払い</option>
                    <option value="yearly">年払い（月換算）</option>
                  </select>
                  <select
                    value={item.freq}
                    onChange={(e) => updateItem(item.id, "freq", e.target.value)}
                    className={`text-xs border rounded-lg px-2 py-1 focus:outline-none cursor-pointer ${
                      item.freq === "rarely"
                        ? "border-red-300 text-red-700 bg-red-50"
                        : item.freq === "monthly"
                        ? "border-amber-300 text-amber-700 bg-amber-50"
                        : "border-gray-300"
                    }`}
                  >
                    {(Object.entries(FREQ_LABEL) as [UsageFreq, string][]).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                  {(item.freq === "rarely" || item.freq === "monthly") && (
                    <span className="text-xs text-red-600 font-medium">⚠ 解約候補</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Results ── */}
      {activeItems.length > 0 && (
        <>
          <section className="mb-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">集計結果</h2>

            {/* Main cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="col-span-2 bg-white rounded-2xl border border-purple-200 p-4 text-center">
                <p className="text-sm text-purple-700 font-medium mb-1">月間合計</p>
                <p className="text-4xl font-extrabold text-purple-900 tabular-nums">
                  {formatYen(calc.monthly)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-purple-100 p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">年間合計</p>
                <p className="text-lg font-bold text-gray-800 tabular-nums">
                  {formatYen(calc.annual)}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-purple-100 p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">1日あたり</p>
                <p className="text-lg font-bold text-gray-800 tabular-nums">
                  {formatYen(calc.daily)}
                </p>
              </div>
            </div>

            {/* Category bar chart */}
            {Object.keys(calc.byCategory).length > 0 && (
              <div className="mb-5">
                <h3 className="text-sm font-bold text-gray-700 mb-3">カテゴリ別内訳</h3>
                <div className="space-y-2">
                  {Object.entries(calc.byCategory)
                    .sort(([, a], [, b]) => b - a)
                    .map(([cat, amount]) => {
                      const pct = (amount / maxCategoryVal) * 100;
                      return (
                        <div key={cat} className="flex items-center gap-3">
                          <span className="w-16 text-xs text-gray-600 shrink-0">{cat}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                            <div
                              className="h-full rounded-full flex items-center px-2 transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor: categoryColors[cat] || "#6b7280",
                                minWidth: "2rem",
                              }}
                            >
                              <span className="text-white text-xs font-medium tabular-nums truncate">
                                {formatYen(amount)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Optimization section */}
            <div className="space-y-3">
              {calc.lowFreqItems.length > 0 && (
                <div className="bg-white rounded-xl border border-red-200 p-4">
                  <p className="text-sm font-bold text-red-700 mb-2">
                    ⚠ 見直しで節約できる金額
                  </p>
                  <p className="text-2xl font-extrabold text-red-800 tabular-nums mb-1">
                    月 {formatYen(calc.lowFreqTotal)} 節約可能
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    年間では <span className="font-bold">{formatYen(calc.lowFreqTotal * 12)}</span> の削減になります
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {calc.lowFreqItems.map((i) => (
                      <span
                        key={i.id}
                        className="text-xs bg-red-100 text-red-700 rounded-full px-2 py-0.5"
                      >
                        {i.name}（{formatYen(i.price)}）
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {calc.yearlyBenefit > 0 && (
                <div className="bg-white rounded-xl border border-green-200 p-4">
                  <p className="text-sm font-bold text-green-700 mb-1">
                    💡 年払いに変更するとお得になる金額
                  </p>
                  <p className="text-xl font-bold text-green-800 tabular-nums">
                    年間 {formatYen(calc.yearlyBenefit)} お得
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    月払いのサービスを年払いに変更した場合の目安（約2ヶ月分お得）
                  </p>
                </div>
              )}
            </div>
          </section>

          <AdBanner />
        </>
      )}

      {activeItems.length === 0 && (
        <div className="mb-8 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50 p-10 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-gray-600 font-medium">上のボタンからサービスを追加してください</p>
          <p className="text-sm text-gray-400 mt-1">
            チェックを入れると月間・年間コストが自動で計算されます
          </p>
        </div>
      )}

      {/* ── Tips ── */}
      <section className="mb-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <h2 className="text-sm font-bold text-blue-800 mb-3">📊 サブスク見直しの目安</h2>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            使用頻度が<strong>月3回未満</strong>のサービスは解約を検討
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <strong>半年に1度</strong>は登録サービスの棚卸しを
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            <strong>年払いプラン</strong>は通常2ヶ月分（約17%）お得
          </li>
          <li className="flex items-start gap-2">
            <span className="shrink-0">•</span>
            家族で使うなら<strong>ファミリープラン</strong>で1人あたりのコストを下げる
          </li>
        </ul>
      </section>

      {/* ── FAQ ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: "サブスクの解約を忘れないようにするには？",
              a: "申し込みと同時にスマートフォンのカレンダーに解約リマインダーを設定するのが最も確実です。また、クレジットカード明細を月1回確認し、使っていないサービスがないか定期的にチェックしましょう。",
            },
            {
              q: "複数の動画サービスに加入するのは無駄ですか？",
              a: "見たい作品がどのサービスにあるかで判断しましょう。同時に全部使うのは非効率です。見たいシリーズがある時だけ加入し、見終わったら解約するローテーション利用が節約になります。",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              <summary className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                Q. {item.q}
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-600 border-t border-gray-100">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-500 mb-8">
        ※ 本ツールに記載されている各サービスの料金は2024年時点の参考価格です。実際の料金はプランや時期によって異なります。最新の料金は各サービスの公式サイトでご確認ください。
      </div>

      <RelatedTools currentToolId="subscription-calc" />
    </div>
  );
}
