"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";

/* ─── 配送方法データ ─── */
interface ShippingMethod {
  id: string;
  group: string;
  name: string;
  baseCost: number;
  materialCost: number;
  totalCost: number;
  size: string;
  weight: string;
}

const SHIPPING_METHODS: ShippingMethod[] = [
  // らくらくメルカリ便（ヤマト運輸）
  {
    id: "nekoposu",
    group: "らくらくメルカリ便",
    name: "ネコポス",
    baseCost: 210,
    materialCost: 0,
    totalCost: 210,
    size: "A4, 厚さ3cm",
    weight: "1kg",
  },
  {
    id: "compact",
    group: "らくらくメルカリ便",
    name: "宅急便コンパクト",
    baseCost: 450,
    materialCost: 70,
    totalCost: 520,
    size: "25×20×5cm",
    weight: "2kg",
  },
  {
    id: "takkyubin60",
    group: "らくらくメルカリ便",
    name: "宅急便 60サイズ",
    baseCost: 750,
    materialCost: 0,
    totalCost: 750,
    size: "3辺合計60cm",
    weight: "2kg",
  },
  {
    id: "takkyubin80",
    group: "らくらくメルカリ便",
    name: "宅急便 80サイズ",
    baseCost: 870,
    materialCost: 0,
    totalCost: 870,
    size: "3辺合計80cm",
    weight: "5kg",
  },
  {
    id: "takkyubin100",
    group: "らくらくメルカリ便",
    name: "宅急便 100サイズ",
    baseCost: 1050,
    materialCost: 0,
    totalCost: 1050,
    size: "3辺合計100cm",
    weight: "10kg",
  },
  {
    id: "takkyubin120",
    group: "らくらくメルカリ便",
    name: "宅急便 120サイズ",
    baseCost: 1200,
    materialCost: 0,
    totalCost: 1200,
    size: "3辺合計120cm",
    weight: "15kg",
  },
  {
    id: "takkyubin140",
    group: "らくらくメルカリ便",
    name: "宅急便 140サイズ",
    baseCost: 1450,
    materialCost: 0,
    totalCost: 1450,
    size: "3辺合計140cm",
    weight: "20kg",
  },
  {
    id: "takkyubin160",
    group: "らくらくメルカリ便",
    name: "宅急便 160サイズ",
    baseCost: 1700,
    materialCost: 0,
    totalCost: 1700,
    size: "3辺合計160cm",
    weight: "25kg",
  },
  // ゆうゆうメルカリ便（日本郵便）
  {
    id: "yu-packet-post-mini",
    group: "ゆうゆうメルカリ便",
    name: "ゆうパケットポストmini",
    baseCost: 160,
    materialCost: 20,
    totalCost: 180,
    size: "21.6×17.8cm, 厚さ3cm",
    weight: "2kg",
  },
  {
    id: "yu-packet-post",
    group: "ゆうゆうメルカリ便",
    name: "ゆうパケットポスト",
    baseCost: 215,
    materialCost: 0,
    totalCost: 215,
    size: "3辺合計60cm, 厚さ3cm",
    weight: "2kg",
  },
  {
    id: "yu-packet",
    group: "ゆうゆうメルカリ便",
    name: "ゆうパケット",
    baseCost: 230,
    materialCost: 0,
    totalCost: 230,
    size: "3辺合計60cm, 厚さ3cm",
    weight: "1kg",
  },
  {
    id: "yu-packet-plus",
    group: "ゆうゆうメルカリ便",
    name: "ゆうパケットプラス",
    baseCost: 455,
    materialCost: 65,
    totalCost: 520,
    size: "24×17×7cm",
    weight: "2kg",
  },
  {
    id: "yupack60",
    group: "ゆうゆうメルカリ便",
    name: "ゆうパック 60サイズ",
    baseCost: 750,
    materialCost: 0,
    totalCost: 750,
    size: "3辺合計60cm",
    weight: "25kg",
  },
  {
    id: "yupack80",
    group: "ゆうゆうメルカリ便",
    name: "ゆうパック 80サイズ",
    baseCost: 870,
    materialCost: 0,
    totalCost: 870,
    size: "3辺合計80cm",
    weight: "25kg",
  },
  {
    id: "yupack100",
    group: "ゆうゆうメルカリ便",
    name: "ゆうパック 100サイズ",
    baseCost: 1070,
    materialCost: 0,
    totalCost: 1070,
    size: "3辺合計100cm",
    weight: "25kg",
  },
  {
    id: "yupack120",
    group: "ゆうゆうメルカリ便",
    name: "ゆうパック 120サイズ",
    baseCost: 1200,
    materialCost: 0,
    totalCost: 1200,
    size: "3辺合計120cm",
    weight: "25kg",
  },
  {
    id: "yupack140",
    group: "ゆうゆうメルカリ便",
    name: "ゆうパック 140サイズ",
    baseCost: 1450,
    materialCost: 0,
    totalCost: 1450,
    size: "3辺合計140cm",
    weight: "25kg",
  },
  {
    id: "yupack160",
    group: "ゆうゆうメルカリ便",
    name: "ゆうパック 160サイズ",
    baseCost: 1700,
    materialCost: 0,
    totalCost: 1700,
    size: "3辺合計160cm",
    weight: "25kg",
  },
  {
    id: "yupack170",
    group: "ゆうゆうメルカリ便",
    name: "ゆうパック 170サイズ",
    baseCost: 1900,
    materialCost: 0,
    totalCost: 1900,
    size: "3辺合計170cm",
    weight: "25kg",
  },
];

const COMMISSION_RATE = 0.1;
const TRANSFER_FEE = 200;

function formatYen(n: number): string {
  return "¥" + n.toLocaleString("ja-JP");
}

export default function MercariCalcPage() {
  const [salePrice, setSalePrice] = useState<string>("");
  const [costPrice, setCostPrice] = useState<string>("");
  const [selectedShipping, setSelectedShipping] = useState<string>("nekoposu");
  const [targetProfit, setTargetProfit] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"calc" | "reverse" | "compare">(
    "calc"
  );

  const salePriceNum = parseInt(salePrice) || 0;
  const costPriceNum = parseInt(costPrice) || 0;
  const targetProfitNum = parseInt(targetProfit) || 0;

  const selectedMethod = SHIPPING_METHODS.find(
    (m) => m.id === selectedShipping
  )!;

  /* ─── 通常計算 ─── */
  const calc = useMemo(() => {
    const commission = Math.floor(salePriceNum * COMMISSION_RATE);
    const shipping = selectedMethod.totalCost;
    const profit =
      salePriceNum - commission - shipping - TRANSFER_FEE - costPriceNum;
    const profitRate =
      salePriceNum > 0 ? ((profit / salePriceNum) * 100).toFixed(1) : "0.0";
    return { commission, shipping, profit, profitRate: parseFloat(profitRate) };
  }, [salePriceNum, costPriceNum, selectedMethod]);

  /* ─── 逆算 ─── */
  const reverseCalc = useMemo(() => {
    if (targetProfitNum <= 0) return null;
    const shipping = selectedMethod.totalCost;
    // price - price*0.1 - shipping - 200 - cost = targetProfit
    // price * 0.9 = targetProfit + shipping + 200 + cost
    const minPrice = Math.ceil(
      (targetProfitNum + shipping + TRANSFER_FEE + costPriceNum) / 0.9
    );
    return minPrice;
  }, [targetProfitNum, costPriceNum, selectedMethod]);

  /* ─── 送料比較 ─── */
  const comparison = useMemo(() => {
    if (salePriceNum <= 0) return [];
    const commission = Math.floor(salePriceNum * COMMISSION_RATE);
    return SHIPPING_METHODS.map((m) => {
      const profit =
        salePriceNum - commission - m.totalCost - TRANSFER_FEE - costPriceNum;
      const profitRate = ((profit / salePriceNum) * 100).toFixed(1);
      return { ...m, profit, profitRate: parseFloat(profitRate) };
    }).sort((a, b) => b.profit - a.profit);
  }, [salePriceNum, costPriceNum]);

  const bestProfit =
    comparison.length > 0
      ? Math.max(...comparison.map((c) => c.profit))
      : 0;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      {/* ヘッダー */}
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600">
          <span className="text-lg">📦</span>
          メルカリ出品者向け
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
          メルカリ利益計算機
        </h1>
        <p className="text-sm text-gray-500">
          販売手数料・送料・振込手数料を自動計算して手取り利益を瞬時に表示
        </p>
      </div>

      {/* タブ */}
      <div className="mb-6 flex gap-1 rounded-xl bg-gray-100 p-1">
        {(
          [
            { key: "calc", label: "利益計算" },
            { key: "reverse", label: "逆算" },
            { key: "compare", label: "送料比較" },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-white text-red-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── 共通入力 ─── */}
      <div className="mb-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700">基本情報</h2>

        {/* 販売価格 */}
        {activeTab !== "reverse" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              販売価格（税込）
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                ¥
              </span>
              <input
                type="number"
                inputMode="numeric"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="例: 3000"
                className="w-full rounded-xl border border-gray-300 py-3 pl-8 pr-4 text-lg font-semibold text-gray-900 placeholder:text-gray-300 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
              />
            </div>
          </div>
        )}

        {/* 原価 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            原価・仕入れ値（任意）
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ¥
            </span>
            <input
              type="number"
              inputMode="numeric"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-gray-300 py-3 pl-8 pr-4 text-lg text-gray-900 placeholder:text-gray-300 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
            />
          </div>
        </div>

        {/* 配送方法 */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            配送方法
          </label>
          <select
            value={selectedShipping}
            onChange={(e) => setSelectedShipping(e.target.value)}
            className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-10 text-sm text-gray-900 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
          >
            {["らくらくメルカリ便", "ゆうゆうメルカリ便"].map((group) => (
              <optgroup key={group} label={group}>
                {SHIPPING_METHODS.filter((m) => m.group === group).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} - {formatYen(m.totalCost)}
                    {m.materialCost > 0
                      ? `（送料${formatYen(m.baseCost)}+資材${formatYen(m.materialCost)}）`
                      : ""}{" "}
                    [{m.size}]
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      {/* ─── TAB: 利益計算 ─── */}
      {activeTab === "calc" && (
        <div className="space-y-4">
          {/* 結果パネル */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">
              計算結果
            </h2>

            <div className="space-y-3">
              <Row label="販売価格" value={formatYen(salePriceNum)} />
              <Row
                label="販売手数料（10%）"
                value={`-${formatYen(calc.commission)}`}
                sub
              />
              <Row
                label={`送料（${selectedMethod.name}）`}
                value={`-${formatYen(selectedMethod.baseCost)}`}
                sub
              />
              {selectedMethod.materialCost > 0 && (
                <Row
                  label="梱包資材代"
                  value={`-${formatYen(selectedMethod.materialCost)}`}
                  sub
                />
              )}
              <Row label="振込手数料" value={`-${formatYen(TRANSFER_FEE)}`} sub />
              {costPriceNum > 0 && (
                <Row label="原価" value={`-${formatYen(costPriceNum)}`} sub />
              )}

              <div className="my-2 border-t border-dashed border-gray-200" />

              {/* 利益 */}
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-gray-800">
                  手取り利益
                </span>
                <span
                  className={`text-2xl font-extrabold ${
                    calc.profit >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {formatYen(calc.profit)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">利益率</span>
                <span
                  className={`text-lg font-bold ${
                    calc.profitRate >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  {calc.profitRate}%
                </span>
              </div>
            </div>
          </div>

          {/* 内訳バー */}
          {salePriceNum > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                内訳グラフ
              </h3>
              <div className="flex h-8 overflow-hidden rounded-full">
                {(() => {
                  const items = [
                    {
                      value: calc.commission,
                      color: "bg-red-400",
                      label: "手数料",
                    },
                    {
                      value: calc.shipping,
                      color: "bg-amber-400",
                      label: "送料",
                    },
                    { value: TRANSFER_FEE, color: "bg-blue-400", label: "振込" },
                    {
                      value: costPriceNum,
                      color: "bg-gray-400",
                      label: "原価",
                    },
                    {
                      value: Math.max(calc.profit, 0),
                      color: "bg-emerald-400",
                      label: "利益",
                    },
                  ];
                  const total = items.reduce((s, i) => s + i.value, 0);
                  return items
                    .filter((i) => i.value > 0)
                    .map((item, idx) => (
                      <div
                        key={idx}
                        className={`${item.color} transition-all duration-300`}
                        style={{
                          width: `${(item.value / total) * 100}%`,
                        }}
                        title={`${item.label}: ${formatYen(item.value)}`}
                      />
                    ));
                })()}
              </div>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-400" />
                  手数料
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400" />
                  送料
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-400" />
                  振込
                </span>
                {costPriceNum > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded-full bg-gray-400" />
                    原価
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  利益
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: 逆算 ─── */}
      {activeTab === "reverse" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-gray-700">
              目標利益から最低出品価格を逆算
            </h2>
            <p className="mb-4 text-xs text-gray-400">
              手取りで欲しい利益額を入力すると、必要な最低販売価格を算出します。
            </p>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                目標利益額
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ¥
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={targetProfit}
                  onChange={(e) => setTargetProfit(e.target.value)}
                  placeholder="例: 1000"
                  className="w-full rounded-xl border border-gray-300 py-3 pl-8 pr-4 text-lg font-semibold text-gray-900 placeholder:text-gray-300 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
                />
              </div>
            </div>
          </div>

          {reverseCalc !== null && (
            <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-5">
              <p className="mb-1 text-sm text-emerald-700">
                最低出品価格（{selectedMethod.name}利用時）
              </p>
              <p className="text-3xl font-extrabold text-emerald-700">
                {formatYen(reverseCalc)}
              </p>
              <div className="mt-3 space-y-1 text-xs text-emerald-600">
                <p>
                  販売手数料（10%）: -{formatYen(Math.floor(reverseCalc * 0.1))}
                </p>
                <p>
                  送料: -{formatYen(selectedMethod.totalCost)}
                  {selectedMethod.materialCost > 0
                    ? `（送料${formatYen(selectedMethod.baseCost)}+資材${formatYen(selectedMethod.materialCost)}）`
                    : ""}
                </p>
                <p>振込手数料: -{formatYen(TRANSFER_FEE)}</p>
                {costPriceNum > 0 && <p>原価: -{formatYen(costPriceNum)}</p>}
                <p className="pt-1 font-bold">
                  手取り利益: {formatYen(targetProfitNum)}以上
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: 送料比較 ─── */}
      {activeTab === "compare" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-1 text-sm font-semibold text-gray-700">
              全配送方法の利益比較
            </h2>
            <p className="mb-4 text-xs text-gray-400">
              販売価格を入力すると、全配送方法の利益を比較できます。最も利益が出る方法が緑色でハイライトされます。
            </p>

            {salePriceNum <= 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">
                販売価格を入力してください
              </p>
            ) : (
              <div className="space-y-6">
                {["らくらくメルカリ便", "ゆうゆうメルカリ便"].map((group) => (
                  <div key={group}>
                    <h3 className="mb-2 text-xs font-bold text-gray-500">
                      {group}
                      {group === "らくらくメルカリ便"
                        ? "（ヤマト運輸）"
                        : "（日本郵便）"}
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 text-left text-xs text-gray-400">
                            <th className="pb-2 pr-2 font-medium">配送方法</th>
                            <th className="pb-2 pr-2 font-medium text-right">
                              送料
                            </th>
                            <th className="pb-2 pr-2 font-medium text-right">
                              利益
                            </th>
                            <th className="pb-2 font-medium text-right">
                              利益率
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {comparison
                            .filter((c) => c.group === group)
                            .sort((a, b) => a.totalCost - b.totalCost)
                            .map((item) => {
                              const isBest =
                                item.profit === bestProfit && item.profit > 0;
                              return (
                                <tr
                                  key={item.id}
                                  className={`border-b border-gray-100 ${
                                    isBest
                                      ? "bg-emerald-50"
                                      : item.profit < 0
                                        ? "bg-red-50/50"
                                        : ""
                                  }`}
                                >
                                  <td className="py-2.5 pr-2">
                                    <div className="font-medium text-gray-800">
                                      {item.name}
                                      {isBest && (
                                        <span className="ml-1.5 inline-block rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                          最安
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-gray-400">
                                      {item.size} / {item.weight}
                                    </div>
                                  </td>
                                  <td className="py-2.5 pr-2 text-right text-gray-600">
                                    {formatYen(item.totalCost)}
                                    {item.materialCost > 0 && (
                                      <div className="text-[10px] text-gray-400">
                                        (資材{formatYen(item.materialCost)}込)
                                      </div>
                                    )}
                                  </td>
                                  <td
                                    className={`py-2.5 pr-2 text-right font-bold ${
                                      item.profit >= 0
                                        ? "text-emerald-600"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {formatYen(item.profit)}
                                  </td>
                                  <td
                                    className={`py-2.5 text-right ${
                                      item.profitRate >= 0
                                        ? "text-emerald-600"
                                        : "text-red-500"
                                    }`}
                                  >
                                    {item.profitRate}%
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── 配送方法早見表 ─── */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-bold text-gray-800">
          メルカリ配送方法 早見表（2026年版）
        </h2>

        {["らくらくメルカリ便", "ゆうゆうメルカリ便"].map((group) => (
          <div key={group} className="mb-5 last:mb-0">
            <h3 className="mb-2 text-sm font-bold text-gray-600">
              {group}
              {group === "らくらくメルカリ便"
                ? "（ヤマト運輸）"
                : "（日本郵便）"}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-gray-400">
                    <th className="pb-2 pr-2 font-medium">方法</th>
                    <th className="pb-2 pr-2 font-medium text-right">送料</th>
                    <th className="pb-2 pr-2 font-medium text-right">資材</th>
                    <th className="pb-2 pr-2 font-medium">サイズ</th>
                    <th className="pb-2 font-medium">重量</th>
                  </tr>
                </thead>
                <tbody>
                  {SHIPPING_METHODS.filter((m) => m.group === group).map(
                    (m) => (
                      <tr
                        key={m.id}
                        className="border-b border-gray-50 text-gray-700"
                      >
                        <td className="py-2 pr-2 font-medium">{m.name}</td>
                        <td className="py-2 pr-2 text-right">
                          {formatYen(m.baseCost)}
                        </td>
                        <td className="py-2 pr-2 text-right">
                          {m.materialCost > 0
                            ? formatYen(m.materialCost)
                            : "-"}
                        </td>
                        <td className="py-2 pr-2">{m.size}</td>
                        <td className="py-2">{m.weight}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* ─── 使い方ガイド ─── */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-base font-bold text-gray-800">
          メルカリ手数料の仕組み
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-gray-600">
          <div>
            <h3 className="mb-1 font-semibold text-gray-700">
              販売手数料（10%）
            </h3>
            <p>
              商品が売れた際に販売価格の10%がメルカリに差し引かれます。例えば¥3,000で販売した場合、手数料は¥300です。
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-gray-700">
              振込手数料（¥200）
            </h3>
            <p>
              売上金を銀行口座に振り込む際に¥200かかります。メルペイ残高として利用する場合は無料です。
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-gray-700">
              送料（出品者負担の場合）
            </h3>
            <p>
              「らくらくメルカリ便」と「ゆうゆうメルカリ便」は全国一律料金で匿名配送が可能です。サイズと重量に応じて料金が変わります。
            </p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold text-gray-700">
              利益を最大化するコツ
            </h3>
            <ul className="mt-1 list-inside list-disc space-y-1 text-gray-500">
              <li>商品サイズに合った最小の配送方法を選ぶ</li>
              <li>
                小型・軽量品はゆうパケットポストmini（¥180）が最安
              </li>
              <li>まとめて振込申請して振込手数料を節約</li>
              <li>梱包資材は100均やまとめ買いでコスト削減</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 広告 */}
      <div className="mt-8">
        <AdBanner />
      </div>
    </main>
  );
}

/* ─── 内訳行コンポーネント ─── */
function Row({
  label,
  value,
  sub = false,
}: {
  label: string;
  value: string;
  sub?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={sub ? "text-sm text-gray-500" : "text-sm text-gray-700"}>
        {label}
      </span>
      <span
        className={
          sub
            ? "text-sm text-gray-500"
            : "text-base font-semibold text-gray-800"
        }
      >
        {value}
      </span>
    </div>
  );
}
