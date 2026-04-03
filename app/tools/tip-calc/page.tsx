"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Mode = "tip" | "split";
type TaxMode = "included" | "excluded";
type RoundMode = "ceil" | "floor" | "round";

const TIP_PRESETS = [10, 15, 18, 20];

function applyRound(value: number, mode: RoundMode): number {
  if (mode === "ceil") return Math.ceil(value);
  if (mode === "floor") return Math.floor(value);
  return Math.round(value);
}

export default function TipCalc() {
  const [mode, setMode] = useState<Mode>("tip");

  // チップ計算
  const [billAmount, setBillAmount] = useState("");
  const [taxMode, setTaxMode] = useState<TaxMode>("excluded");
  const [taxRate, setTaxRate] = useState("10");
  const [tipRate, setTipRate] = useState<number | null>(15);
  const [customTipRate, setCustomTipRate] = useState("");
  const [tipPeople, setTipPeople] = useState("2");

  // 割り勘
  const [splitTotal, setSplitTotal] = useState("");
  const [splitPeople, setSplitPeople] = useState("3");
  const [splitMode, setSplitMode] = useState<"equal" | "custom">("equal");
  const [roundMode, setRoundMode] = useState<RoundMode>("ceil");
  const [customRatios, setCustomRatios] = useState<string[]>(["34", "33", "33"]);

  // --- Tip results ---
  const tipResult = useMemo(() => {
    const bill = parseFloat(billAmount);
    if (!bill || bill <= 0) return null;

    const effectiveTipRate = tipRate !== null ? tipRate : parseFloat(customTipRate) || 0;
    const tax = parseFloat(taxRate) || 0;
    const people = parseInt(tipPeople) || 1;

    // Base for tip calculation is always pre-tax
    let preTaxAmount: number;
    let totalWithTax: number;
    if (taxMode === "included") {
      preTaxAmount = bill / (1 + tax / 100);
      totalWithTax = bill;
    } else {
      preTaxAmount = bill;
      totalWithTax = bill * (1 + tax / 100);
    }

    const tipAmount = preTaxAmount * (effectiveTipRate / 100);
    const grandTotal = totalWithTax + tipAmount;
    const perPerson = grandTotal / people;

    return {
      tipAmount: Math.round(tipAmount),
      totalWithTax: Math.round(totalWithTax),
      grandTotal: Math.round(grandTotal),
      perPerson: Math.round(perPerson),
    };
  }, [billAmount, taxMode, taxRate, tipRate, customTipRate, tipPeople]);

  // --- Split results ---
  const splitResult = useMemo(() => {
    const total = parseFloat(splitTotal);
    const people = parseInt(splitPeople) || 2;
    if (!total || total <= 0 || people < 1) return null;

    if (splitMode === "equal") {
      const perPerson = applyRound(total / people, roundMode);
      const calculated = perPerson * people;
      const diff = calculated - total;
      return {
        type: "equal" as const,
        perPerson,
        diff: Math.round(diff),
        people,
        total: Math.round(total),
      };
    } else {
      // custom ratios
      const ratios = customRatios.slice(0, people).map((r) => parseFloat(r) || 0);
      const ratioSum = ratios.reduce((a, b) => a + b, 0);
      const amounts = ratios.map((r) => {
        const raw = (r / ratioSum) * total;
        return applyRound(raw, roundMode);
      });
      const amountSum = amounts.reduce((a, b) => a + b, 0);
      const diff = amountSum - total;
      return {
        type: "custom" as const,
        amounts,
        ratios,
        diff: Math.round(diff),
        total: Math.round(total),
        people,
      };
    }
  }, [splitTotal, splitPeople, splitMode, roundMode, customRatios]);

  const updateSplitPeople = (n: number) => {
    setSplitPeople(String(n));
    setCustomRatios((prev) => {
      const next = [...prev];
      while (next.length < n) next.push("0");
      return next.slice(0, n);
    });
  };

  const updateRatio = (i: number, val: string) => {
    setCustomRatios((prev) => prev.map((r, idx) => (idx === i ? val : r)));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">💵</span>
          <h1 className="text-2xl font-bold">チップ・割り勘計算</h1>
        </div>
        <p className="text-green-100 text-sm">
          海外旅行のチップ計算と、均等・不均等割り勘に対応。1人分の支払額をすぐに計算します。
        </p>
      </div>

      <AdBanner />

      {/* Mode tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {(["tip", "split"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              mode === m ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {m === "tip" ? "💵 チップ計算" : "🍽️ 割り勘"}
          </button>
        ))}
      </div>

      {/* チップ計算 */}
      {mode === "tip" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">請求額</label>
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              placeholder="5000"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">消費税・サービス税</label>
            <div className="flex gap-2 mb-3">
              {(["excluded", "included"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTaxMode(t)}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    taxMode === t
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
                >
                  {t === "excluded" ? "税抜き（別途加算）" : "税込み（すでに含む）"}
                </button>
              ))}
            </div>
            {taxMode === "excluded" && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">税率</span>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  min="0"
                  max="100"
                  step="0.1"
                  className="w-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">チップ率</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {TIP_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => { setTipRate(p); setCustomTipRate(""); }}
                  className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                    tipRate === p
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
                >
                  {p}%
                </button>
              ))}
              <button
                onClick={() => setTipRate(null)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  tipRate === null
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                }`}
              >
                カスタム
              </button>
            </div>
            {tipRate === null && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={customTipRate}
                  onChange={(e) => setCustomTipRate(e.target.value)}
                  placeholder="12"
                  min="0"
                  max="100"
                  step="0.5"
                  className="w-24 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
                <span className="text-sm text-gray-500">%</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">支払い人数</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTipPeople(String(Math.max(1, parseInt(tipPeople) - 1)))}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-lg leading-none"
              >
                −
              </button>
              <span className="text-lg font-bold text-gray-800 w-8 text-center">{tipPeople}</span>
              <button
                onClick={() => setTipPeople(String(parseInt(tipPeople) + 1))}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-lg leading-none"
              >
                ＋
              </button>
              <span className="text-sm text-gray-500">人</span>
            </div>
          </div>

          {tipResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-3">
              <div className="text-center mb-2">
                <div className="text-4xl font-bold text-green-600">
                  ¥{tipResult.perPerson.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mt-1">1人分</div>
              </div>
              <div className="divide-y divide-green-100">
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">チップ額</span>
                  <span className="font-medium text-gray-800">¥{tipResult.tipAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">税込み請求額</span>
                  <span className="font-medium text-gray-800">¥{tipResult.totalWithTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 text-sm font-bold">
                  <span className="text-gray-800">合計（税+チップ込み）</span>
                  <span className="text-green-700">¥{tipResult.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 割り勘 */}
      {mode === "split" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">合計金額</label>
            <input
              type="number"
              value={splitTotal}
              onChange={(e) => setSplitTotal(e.target.value)}
              placeholder="12000"
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">人数</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateSplitPeople(Math.max(2, parseInt(splitPeople) - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-lg leading-none"
              >
                −
              </button>
              <span className="text-lg font-bold text-gray-800 w-8 text-center">{splitPeople}</span>
              <button
                onClick={() => updateSplitPeople(Math.min(10, parseInt(splitPeople) + 1))}
                className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 text-lg leading-none"
              >
                ＋
              </button>
              <span className="text-sm text-gray-500">人</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">割り勘タイプ</label>
            <div className="flex gap-2">
              {(["equal", "custom"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setSplitMode(t)}
                  className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    splitMode === t
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                  }`}
                >
                  {t === "equal" ? "均等割り" : "不均等割り"}
                </button>
              ))}
            </div>
          </div>

          {splitMode === "custom" && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                各人の負担割合（%）
              </label>
              <div className="space-y-2">
                {Array.from({ length: parseInt(splitPeople) || 2 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-12">
                      {i + 1}人目
                    </span>
                    <input
                      type="number"
                      value={customRatios[i] ?? "0"}
                      onChange={(e) => updateRatio(i, e.target.value)}
                      min="0"
                      max="100"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">端数処理</label>
            <div className="flex gap-2">
              {([["ceil", "切り上げ"], ["floor", "切り捨て"], ["round", "四捨五入"]] as const).map(
                ([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setRoundMode(val)}
                    className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                      roundMode === val
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white text-gray-700 border-gray-300 hover:border-green-400"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {splitResult && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5">
              {splitResult.type === "equal" ? (
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-1">
                    ¥{splitResult.perPerson.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 mb-3">
                    {splitResult.people}人で均等割り（1人分）
                  </div>
                  <div className="text-xs text-gray-400">
                    合計: ¥{(splitResult.perPerson * splitResult.people).toLocaleString()}
                    {splitResult.diff !== 0 && (
                      <span className="ml-1 text-orange-500">
                        （端数 {splitResult.diff > 0 ? "+" : ""}{splitResult.diff.toLocaleString()}円）
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-3">各人の支払額</div>
                  <div className="space-y-2">
                    {splitResult.amounts.map((amount, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {i + 1}人目（{splitResult.ratios[i]?.toFixed(0)}%）
                        </span>
                        <span className="font-bold text-green-700">¥{amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  {splitResult.diff !== 0 && (
                    <div className="mt-3 text-xs text-orange-500 text-center">
                      端数 {splitResult.diff > 0 ? "+" : ""}{splitResult.diff.toLocaleString()}円の差異あり
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <AdBanner />

      <section className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">チップ・割り勘計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          チップ計算モードでは、請求額・税金設定・チップ率・人数を入力するとチップ額・合計額・1人分を自動計算します。割り勘モードでは均等割りのほか、各人の負担割合を設定できる不均等割りにも対応。端数処理（切り上げ/切り捨て/四捨五入）も選択できます。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "アメリカでのチップの相場はいくらですか？",
            answer:
              "レストランでは税引前の15〜20%が一般的です。カフェ・ファストフードは10%程度、タクシーは10〜15%、ホテルのポーターは1〜2ドル/個が目安です。",
          },
          {
            question: "チップはいつ払わなければなりませんか？",
            answer:
              "アメリカ・カナダではレストランでのチップは事実上必須です。ヨーロッパは端数をまとめる程度、アジア（日本・中国・韓国など）はチップ不要な国が多いです。",
          },
          {
            question: "グループで割り勘する際のチップの計算方法は？",
            answer:
              "合計額（税抜き）× チップ率 = チップ額を計算し、合計（税込み+チップ）を人数で割ります。本ツールで自動計算できます。",
          },
          {
            question: "クレジットカードでチップは払えますか？",
            answer:
              "ほとんどのレストランでカード払い時にチップ欄があり、金額を記入できます。カードの明細には合計額が反映されます。",
          },
        ]}
      />

      <RelatedTools currentToolId="tip-calc" />

      <p className="text-xs text-gray-400 mt-6 text-center">
        ※本ツールはあくまで目安計算です。チップの慣習は国・地域・場所によって異なります。
      </p>
    </div>
  );
}
