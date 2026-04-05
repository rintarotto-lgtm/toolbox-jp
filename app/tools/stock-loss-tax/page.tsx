"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const TAX_RATE = 0.20315; // 所得税15% + 住民税5% + 復興税0.315%

export default function StockLossTaxPage() {
  const [profits, setProfits] = useState([{ id: 1, amount: "", label: "利益①" }]);
  const [losses, setLosses] = useState([{ id: 1, amount: "", label: "損失①" }]);
  const [withheldTax, setWithheldTax] = useState("");
  const [carryover, setCarryover] = useState("");

  const result = useMemo(() => {
    const totalProfit = profits.reduce((sum, p) => sum + (parseFloat(p.amount) || 0) * 10000, 0);
    const totalLoss = losses.reduce((sum, l) => sum + (parseFloat(l.amount) || 0) * 10000, 0);
    const carry = (parseFloat(carryover) || 0) * 10000;
    const withheld = (parseFloat(withheldTax) || 0) * 10000;

    const netGain = totalProfit - totalLoss - carry;
    const taxableGain = Math.max(0, netGain);
    const taxDue = taxableGain * TAX_RATE;
    const refund = Math.max(0, withheld - taxDue);
    const newLossCarryover = netGain < 0 ? Math.abs(netGain) : 0;

    return {
      totalProfit: Math.round(totalProfit),
      totalLoss: Math.round(totalLoss),
      carry: Math.round(carry),
      netGain: Math.round(netGain),
      taxableGain: Math.round(taxableGain),
      taxDue: Math.round(taxDue),
      refund: Math.round(refund),
      newLossCarryover: Math.round(newLossCarryover),
      withheld: Math.round(withheld),
    };
  }, [profits, losses, withheldTax, carryover]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  const addProfit = () => setProfits((p) => [...p, { id: Date.now(), amount: "", label: `利益${"①②③④⑤"[p.length] ?? ""}` }]);
  const addLoss = () => setLosses((l) => [...l, { id: Date.now(), amount: "", label: `損失${"①②③④⑤"[l.length] ?? ""}` }]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">株式・投資損益通算計算</h1>
      <p className="text-gray-600 mb-6">株式・投資信託・FXの利益と損失を通算して、確定申告で取り戻せる税金を計算します。</p>
      <AdBanner />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">利益（万円）</label>
          <div className="space-y-2">
            {profits.map((p, i) => (
              <div key={p.id} className="flex gap-2 items-center">
                <input type="text" value={p.label} onChange={(e) => setProfits((prev) => prev.map((x) => x.id === p.id ? { ...x, label: e.target.value } : x))}
                  className="w-24 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none" placeholder={`利益${i + 1}`} />
                <input type="number" value={p.amount} onChange={(e) => setProfits((prev) => prev.map((x) => x.id === p.id ? { ...x, amount: e.target.value } : x))}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="万円" />
              </div>
            ))}
            <button onClick={addProfit} className="text-sm text-blue-600 hover:underline">+ 利益を追加</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">損失（万円）</label>
          <div className="space-y-2">
            {losses.map((l, i) => (
              <div key={l.id} className="flex gap-2 items-center">
                <input type="text" value={l.label} onChange={(e) => setLosses((prev) => prev.map((x) => x.id === l.id ? { ...x, label: e.target.value } : x))}
                  className="w-24 border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none" placeholder={`損失${i + 1}`} />
                <input type="number" value={l.amount} onChange={(e) => setLosses((prev) => prev.map((x) => x.id === l.id ? { ...x, amount: e.target.value } : x))}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400" placeholder="万円" />
              </div>
            ))}
            <button onClick={addLoss} className="text-sm text-blue-600 hover:underline">+ 損失を追加</button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">前年からの繰越損失（万円）</label>
            <input type="number" value={carryover} onChange={(e) => setCarryover(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">源泉徴収済み税額（万円）</label>
            <input type="number" value={withheldTax} onChange={(e) => setWithheldTax(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
      <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-lg font-bold text-blue-900 mb-4">損益通算結果</h2>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between bg-white rounded-lg px-4 py-3">
            <span className="text-gray-700">利益合計</span>
            <span className="font-bold text-green-600">+¥{formatNum(result.totalProfit)}</span>
          </div>
          <div className="flex justify-between bg-white rounded-lg px-4 py-3">
            <span className="text-gray-700">損失合計</span>
            <span className="font-bold text-red-500">-¥{formatNum(result.totalLoss)}</span>
          </div>
          {result.carry > 0 && (
            <div className="flex justify-between bg-white rounded-lg px-4 py-3">
              <span className="text-gray-700">繰越損失</span>
              <span className="font-bold text-orange-500">-¥{formatNum(result.carry)}</span>
            </div>
          )}
          <div className="flex justify-between bg-white rounded-lg px-4 py-3 border-t-2 border-gray-200">
            <span className="font-medium text-gray-800">通算後 損益</span>
            <span className={`font-bold text-xl ${result.netGain >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {result.netGain >= 0 ? "+" : ""}¥{formatNum(result.netGain)}
            </span>
          </div>
        </div>
        {result.netGain >= 0 ? (
          <div className="space-y-2">
            <div className="flex justify-between bg-white rounded-lg px-4 py-3">
              <span className="text-gray-700">課税額（20.315%）</span>
              <span className="font-bold text-red-500">¥{formatNum(result.taxDue)}</span>
            </div>
            {result.withheld > 0 && (
              <div className={`flex justify-between rounded-lg px-4 py-3 ${result.refund > 0 ? "bg-green-50 border border-green-200" : "bg-white"}`}>
                <span className={result.refund > 0 ? "text-green-700 font-medium" : "text-gray-700"}>
                  {result.refund > 0 ? "還付額" : "追加納税"}
                </span>
                <span className={`font-bold text-xl ${result.refund > 0 ? "text-green-600" : "text-red-600"}`}>
                  {result.refund > 0 ? "+" : ""}¥{formatNum(result.refund > 0 ? result.refund : result.taxDue - result.withheld)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-800 font-medium">損失 ¥{formatNum(result.newLossCarryover)} を翌年に繰り越せます（最大3年間）</p>
            <p className="text-xs text-yellow-700 mt-1">確定申告で「損失の繰越控除」を申請してください。</p>
          </div>
        )}
      </div>
      <AdBanner />
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">損益通算はどこで申告する？</h3><p className="text-sm text-gray-600 mt-1">確定申告書（第三表）で申告します。源泉徴収あり特定口座の場合でも、複数口座間の通算や繰越控除には確定申告が必要です。</p></div>
          <div><h3 className="font-medium text-gray-900">FXと株式の損益通算はできますか？</h3><p className="text-sm text-gray-600 mt-1">FX（申告分離課税）と株式（上場株式等）は通算できません。FXはFX同士、株式は株式・投資信託同士でのみ通算可能です。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="stock-loss-tax" />
    </main>
  );
}
