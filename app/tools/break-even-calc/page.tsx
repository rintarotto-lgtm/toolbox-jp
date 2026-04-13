"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

export default function BreakEvenCalcPage() {
  const [calcMode, setCalcMode] = useState<"ratio" | "unit">("ratio");
  const [fixedCost, setFixedCost] = useState("");
  const [variableRatio, setVariableRatio] = useState("");
  const [currentSales, setCurrentSales] = useState("");
  // Unit mode
  const [unitPrice, setUnitPrice] = useState("");
  const [unitVariableCost, setUnitVariableCost] = useState("");

  const result = useMemo(() => {
    const fc = parseFloat(fixedCost) * 10000;
    if (!fc) return null;

    if (calcMode === "ratio") {
      const vr = parseFloat(variableRatio) / 100;
      if (!vr || vr >= 1) return null;
      const marginRatio = 1 - vr;
      const bep = fc / marginRatio;
      const sales = parseFloat(currentSales) * 10000 || 0;
      const safetyMargin = sales > 0 ? ((sales - bep) / sales * 100) : null;
      const profit = sales > 0 ? (sales - bep) * marginRatio : null;
      return {
        bep: Math.round(bep), marginRatio: (marginRatio * 100).toFixed(1),
        safetyMargin: safetyMargin ? safetyMargin.toFixed(1) : null,
        profit: profit ? Math.round(profit) : null, sales, unitMode: false,
      };
    } else {
      const up = parseFloat(unitPrice);
      const uvc = parseFloat(unitVariableCost);
      if (!up || !uvc || up <= uvc) return null;
      const contributionMargin = up - uvc;
      const bepUnits = Math.ceil(fc / contributionMargin);
      const bepSales = bepUnits * up;
      const sales = parseFloat(currentSales) * 10000 || 0;
      const safetyMargin = sales > 0 ? ((sales - bepSales) / sales * 100) : null;
      return {
        bep: Math.round(bepSales), bepUnits,
        contributionMargin: Math.round(contributionMargin),
        marginRatio: ((contributionMargin / up) * 100).toFixed(1),
        safetyMargin: safetyMargin ? safetyMargin.toFixed(1) : null,
        sales, unitMode: true,
      };
    }
  }, [calcMode, fixedCost, variableRatio, currentSales, unitPrice, unitVariableCost]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">損益分岐点計算</h1>
      <p className="text-gray-600 mb-6">固定費・変動費から黒字化に必要な売上高を計算します。</p>
      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">計算方式</label>
          <div className="flex gap-2">
            <button onClick={() => setCalcMode("ratio")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${calcMode === "ratio" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>変動費率で計算</button>
            <button onClick={() => setCalcMode("unit")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${calcMode === "unit" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>単価・個数で計算</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">月間固定費（万円）</label>
          <p className="text-xs text-gray-500 mb-1">家賃・人件費・リース料・光熱費など</p>
          <input type="number" value={fixedCost} onChange={(e) => setFixedCost(e.target.value)} placeholder="例: 50" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {calcMode === "ratio" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">変動費率（%）</label>
            <p className="text-xs text-gray-500 mb-1">売上に対する変動費の割合（例：仕入原価率30%なら30）</p>
            <input type="number" value={variableRatio} onChange={(e) => setVariableRatio(e.target.value)} placeholder="例: 40" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">販売単価（円）</label>
              <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} placeholder="例: 5000" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">1個あたりの変動費（円）</label>
              <input type="number" value={unitVariableCost} onChange={(e) => setUnitVariableCost(e.target.value)} placeholder="例: 2000" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">現在の月間売上（万円・任意）</label>
          <input type="number" value={currentSales} onChange={(e) => setCurrentSales(e.target.value)} placeholder="例: 100" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">損益分岐点</h2>
          <div className="bg-white rounded-xl p-5 text-center mb-4">
            <p className="text-sm text-gray-600">損益分岐点（月間売上）</p>
            <p className="text-4xl font-bold text-blue-600">¥{formatNum(result.bep)}</p>
            {result.unitMode && "bepUnits" in result && typeof result.bepUnits === "number" && (
              <p className="text-gray-500 text-sm mt-1">= {formatNum(result.bepUnits)}個/月</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-xs text-gray-500">限界利益率</p>
              <p className="text-xl font-bold text-green-600">{result.marginRatio}%</p>
            </div>
            {result.safetyMargin !== null && (
              <div className={`rounded-lg p-4 text-center ${parseFloat(result.safetyMargin) >= 20 ? "bg-green-50" : parseFloat(result.safetyMargin) >= 10 ? "bg-yellow-50" : "bg-red-50"}`}>
                <p className="text-xs text-gray-500">安全余裕率</p>
                <p className={`text-xl font-bold ${parseFloat(result.safetyMargin) >= 20 ? "text-green-600" : parseFloat(result.safetyMargin) >= 10 ? "text-yellow-600" : "text-red-600"}`}>
                  {result.safetyMargin}%
                </p>
              </div>
            )}
          </div>
          {result.safetyMargin !== null && (
            <div className={`mt-3 rounded-lg p-3 text-sm ${parseFloat(result.safetyMargin) >= 20 ? "bg-green-50 border border-green-200 text-green-700" : parseFloat(result.safetyMargin) >= 0 ? "bg-yellow-50 border border-yellow-200 text-yellow-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
              {parseFloat(result.safetyMargin) >= 20 ? "✅ 安全余裕率20%以上。経営は安定しています。" :
               parseFloat(result.safetyMargin) >= 10 ? "⚠️ 安全余裕率10〜20%。コスト削減で改善を検討しましょう。" :
               parseFloat(result.safetyMargin) >= 0 ? "🚨 安全余裕率10%未満。赤字リスクが高い状態です。" :
               "❌ 赤字です。売上増加またはコスト削減が急務です。"}
            </div>
          )}
        </div>
      )}

      <AdBanner />

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">損益分岐点を下げる方法は？</h3><p className="text-sm text-gray-600 mt-1">固定費を削減する（家賃交渉・人員調整）か、変動費率を下げる（仕入先交渉・製造効率化）か、単価を上げる（付加価値向上）の3つのアプローチがあります。</p></div>
          <div><h3 className="font-medium text-gray-900">飲食店の一般的な変動費率は？</h3><p className="text-sm text-gray-600 mt-1">飲食店のFL比率（Food+Labor）は60〜65%以下が健全とされます。食材費（F）が30〜35%、人件費（L）が25〜35%が目安です。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="break-even-calc" />
    </main>
  );
}
