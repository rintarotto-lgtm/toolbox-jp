"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

export default function CarLeaseCalcPage() {
  // Lease inputs
  const [leaseMonthly, setLeaseMonthly] = useState("");
  const [leaseYears, setLeaseYears] = useState("5");
  const [leaseInitial, setLeaseInitial] = useState("0");
  const [leaseIncludes, setLeaseIncludes] = useState({
    insurance: false,
    maintenance: false,
    tax: false,
  });

  // Purchase inputs
  const [carPrice, setCarPrice] = useState("");
  const [downPayment, setDownPayment] = useState("0");
  const [loanRate, setLoanRate] = useState("2.5");
  const [loanYears, setLoanYears] = useState("5");
  const [annualMaintenance, setAnnualMaintenance] = useState("10");
  const [annualInsurance, setAnnualInsurance] = useState("8");

  const result = useMemo(() => {
    const lm = parseFloat(leaseMonthly);
    const ly = parseInt(leaseYears);
    const li = parseFloat(leaseInitial) || 0;
    const cp = parseFloat(carPrice) * 10000;
    const dp = parseFloat(downPayment) * 10000 || 0;
    const lr = parseFloat(loanRate) / 100 / 12;
    const loanY = parseInt(loanYears);
    const am = parseFloat(annualMaintenance) * 10000;
    const ai = parseFloat(annualInsurance) * 10000;

    if (!lm || !cp) return null;

    // Lease total
    const leaseTotalMonthly = lm * ly * 12;
    let leaseTotal = leaseTotalMonthly + li * 10000;

    // Add extras if not included in lease
    if (!leaseIncludes.insurance) leaseTotal += ai * ly;
    if (!leaseIncludes.maintenance) leaseTotal += am * ly;
    if (!leaseIncludes.tax) leaseTotal += 40000 * ly; // 自動車税等概算

    // Purchase total
    const loanAmount = cp - dp;
    const loanMonths = loanY * 12;
    const monthlyLoanPayment = loanAmount * lr * Math.pow(1 + lr, loanMonths) / (Math.pow(1 + lr, loanMonths) - 1);
    const totalLoanPayment = monthlyLoanPayment * loanMonths;
    const loanInterest = totalLoanPayment - loanAmount;
    const purchaseMaintenance = am * ly;
    const purchaseInsurance = ai * ly;
    const purchaseTax = 40000 * ly;
    const purchaseTotal = dp + totalLoanPayment + purchaseMaintenance + purchaseInsurance + purchaseTax;

    // Residual value (depreciation)
    const depreciationRate = 0.15; // 年15%の減価
    const residualValue = cp * Math.pow(1 - depreciationRate, ly);
    const netPurchaseCost = purchaseTotal - residualValue;

    return {
      leaseTotal: Math.round(leaseTotal),
      leaseMonthlyActual: Math.round(leaseTotal / (ly * 12)),
      purchaseTotal: Math.round(purchaseTotal),
      netPurchaseCost: Math.round(netPurchaseCost),
      residualValue: Math.round(residualValue),
      loanInterest: Math.round(loanInterest),
      monthlyLoanPayment: Math.round(monthlyLoanPayment),
      cheaper: leaseTotal < netPurchaseCost ? "lease" : "purchase",
      diff: Math.abs(Math.round(leaseTotal - netPurchaseCost)),
      years: ly,
    };
  }, [leaseMonthly, leaseYears, leaseInitial, leaseIncludes, carPrice, downPayment, loanRate, loanYears, annualMaintenance, annualInsurance]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">カーリース vs 購入 比較計算</h1>
      <p className="text-gray-600 mb-6">カーリースと車の購入、どちらが本当にお得かを総費用で比較します。</p>

      <AdBanner />

      <div className="mt-6 grid grid-cols-1 gap-4">
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
          <h2 className="text-base font-bold text-blue-900 mb-3">🚗 カーリース</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">月額リース料（円）</label>
                <input type="number" value={leaseMonthly} onChange={(e) => setLeaseMonthly(e.target.value)} placeholder="例: 30000" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">契約年数</label>
                <select value={leaseYears} onChange={(e) => setLeaseYears(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {[3,4,5,7,9,11].map((y) => <option key={y} value={y}>{y}年</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">初期費用（万円）</label>
              <input type="number" value={leaseInitial} onChange={(e) => setLeaseInitial(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">月額に含まれるもの</label>
              <div className="flex gap-3">
                {[
                  { key: "insurance" as const, label: "保険" },
                  { key: "maintenance" as const, label: "メンテナンス" },
                  { key: "tax" as const, label: "税金" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-1 text-sm">
                    <input type="checkbox" checked={leaseIncludes[key]} onChange={(e) => setLeaseIncludes((p) => ({ ...p, [key]: e.target.checked }))} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl border border-green-200 p-5">
          <h2 className="text-base font-bold text-green-900 mb-3">🏷️ 車の購入</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">車両価格（万円）</label>
                <input type="number" value={carPrice} onChange={(e) => setCarPrice(e.target.value)} placeholder="例: 300" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">頭金（万円）</label>
                <input type="number" value={downPayment} onChange={(e) => setDownPayment(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ローン金利（年%）</label>
                <input type="number" step="0.1" value={loanRate} onChange={(e) => setLoanRate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ローン期間</label>
                <select value={loanYears} onChange={(e) => setLoanYears(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {[3,4,5,6,7].map((y) => <option key={y} value={y}>{y}年</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">年間維持費（万円）</label>
                <input type="number" value={annualMaintenance} onChange={(e) => setAnnualMaintenance(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">年間保険料（万円）</label>
                <input type="number" value={annualInsurance} onChange={(e) => setAnnualInsurance(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{result.years}年間の総費用比較</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className={`rounded-xl p-5 text-center border-2 ${result.cheaper === "lease" ? "bg-blue-50 border-blue-400" : "bg-white border-gray-200"}`}>
              <p className="text-sm text-blue-700 font-medium">カーリース総費用</p>
              {result.cheaper === "lease" && <p className="text-xs text-blue-600 font-bold">💰 こちらがお得</p>}
              <p className="text-2xl font-bold text-blue-600 mt-1">¥{formatNum(result.leaseTotal)}</p>
              <p className="text-xs text-gray-500">月平均 ¥{formatNum(result.leaseMonthlyActual)}</p>
            </div>
            <div className={`rounded-xl p-5 text-center border-2 ${result.cheaper === "purchase" ? "bg-green-50 border-green-400" : "bg-white border-gray-200"}`}>
              <p className="text-sm text-green-700 font-medium">購入実質費用</p>
              {result.cheaper === "purchase" && <p className="text-xs text-green-600 font-bold">💰 こちらがお得</p>}
              <p className="text-2xl font-bold text-green-600 mt-1">¥{formatNum(result.netPurchaseCost)}</p>
              <p className="text-xs text-gray-500">残価¥{formatNum(result.residualValue)}を差引</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-sm text-gray-600">
              {result.cheaper === "lease" ? "カーリース" : "購入"}の方が
              <strong className="text-blue-600"> ¥{formatNum(result.diff)} </strong>お得
            </p>
          </div>
        </div>
      )}

      <AdBanner />

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">カーリースと購入どちらが安い？</h3>
            <p className="text-sm text-gray-600 mt-1">長期（7年以上）で乗る場合は購入の方が総費用が安い傾向があります。短期で乗り換えたい場合やメンテナンス費込みのリースなら、カーリースが便利なことも多いです。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">カーリースのデメリットは？</h3>
            <p className="text-sm text-gray-600 mt-1">走行距離制限（年間1〜1.5万km）、改造・カスタム不可、中途解約の違約金、契約終了時に車が手元に残らない（残価精算型）などがあります。</p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="car-lease-calc" />
    </main>
  );
}
