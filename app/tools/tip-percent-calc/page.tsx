"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

type Scene = "restaurant" | "hotel" | "taxi" | "hair" | "delivery";

const TIP_RATES: Record<string, Record<Scene, { rate: number; note: string }>> = {
  usa: {
    restaurant: { rate: 18, note: "15〜20%が標準。良いサービスは20〜25%" },
    hotel: { rate: 5, note: "ポーター$1〜2/荷物、ハウスキーピング$2〜5/日" },
    taxi: { rate: 15, note: "10〜15%。Uberは画面で選択" },
    hair: { rate: 20, note: "15〜20%が標準" },
    delivery: { rate: 15, note: "注文額の10〜20%。最低$2〜5" },
  },
  europe: {
    restaurant: { rate: 10, note: "サービス料込みの場合は不要。5〜10%が一般的" },
    hotel: { rate: 2, note: "ポーター€1〜2/荷物" },
    taxi: { rate: 10, note: "端数を切り上げる程度" },
    hair: { rate: 10, note: "10%程度が一般的" },
    delivery: { rate: 5, note: "任意で少額のチップ" },
  },
  uk: {
    restaurant: { rate: 10, note: "12.5%のサービス料が請求されることも多い" },
    hotel: { rate: 2, note: "任意だが£1〜2が一般的" },
    taxi: { rate: 10, note: "端数を切り上げる程度" },
    hair: { rate: 10, note: "10%程度" },
    delivery: { rate: 5, note: "任意で少額" },
  },
  canada: {
    restaurant: { rate: 18, note: "15〜20%が標準。税金の2倍とも言われる" },
    hotel: { rate: 5, note: "ポーターC$1〜2/荷物" },
    taxi: { rate: 15, note: "10〜15%" },
    hair: { rate: 15, note: "15〜20%" },
    delivery: { rate: 15, note: "10〜20%" },
  },
  australia: {
    restaurant: { rate: 0, note: "基本不要。良いサービスなら5〜10%程度" },
    hotel: { rate: 0, note: "基本不要" },
    taxi: { rate: 0, note: "基本不要。端数を切り上げる程度" },
    hair: { rate: 0, note: "基本不要" },
    delivery: { rate: 0, note: "基本不要" },
  },
  thailand: {
    restaurant: { rate: 10, note: "高級店は10%、屋台・庶民的な店は不要" },
    hotel: { rate: 5, note: "50〜100バーツ/泊" },
    taxi: { rate: 10, note: "端数を切り上げる程度" },
    hair: { rate: 10, note: "任意で50〜100バーツ" },
    delivery: { rate: 0, note: "基本不要" },
  },
};

const COUNTRIES = [
  { id: "usa", label: "🇺🇸 アメリカ" },
  { id: "europe", label: "🇪🇺 ヨーロッパ" },
  { id: "uk", label: "🇬🇧 イギリス" },
  { id: "canada", label: "🇨🇦 カナダ" },
  { id: "australia", label: "🇦🇺 オーストラリア" },
  { id: "thailand", label: "🇹🇭 タイ" },
];

const SCENES: { id: Scene; label: string; icon: string }[] = [
  { id: "restaurant", label: "レストラン", icon: "🍽️" },
  { id: "hotel", label: "ホテル", icon: "🏨" },
  { id: "taxi", label: "タクシー", icon: "🚕" },
  { id: "hair", label: "美容院", icon: "💇" },
  { id: "delivery", label: "デリバリー", icon: "📦" },
];

export default function TipPercentCalcPage() {
  const [country, setCountry] = useState("usa");
  const [scene, setScene] = useState<Scene>("restaurant");
  const [amount, setAmount] = useState("");
  const [customRate, setCustomRate] = useState("");

  const tipInfo = TIP_RATES[country]?.[scene];

  const result = useMemo(() => {
    const amt = parseFloat(amount);
    if (!amt || !tipInfo) return null;
    const rate = customRate ? parseFloat(customRate) : tipInfo.rate;
    const tipAmount = amt * (rate / 100);
    return {
      tipAmount: Math.round(tipAmount * 100) / 100,
      total: Math.round((amt + tipAmount) * 100) / 100,
      rate,
      rates: [10, 15, 18, 20, 25].map((r) => ({ rate: r, tip: Math.round(amt * r / 100 * 100) / 100, total: Math.round((amt + amt * r / 100) * 100) / 100 })),
    };
  }, [amount, tipInfo, customRate]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">チップ・サービス料計算</h1>
      <p className="text-gray-600 mb-6">海外旅行のチップ金額と各国の相場を確認できます。</p>
      <AdBanner />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">国・地域</label>
          <div className="grid grid-cols-3 gap-2">
            {COUNTRIES.map((c) => (
              <button key={c.id} onClick={() => setCountry(c.id)}
                className={`py-2 px-2 rounded-lg border text-xs font-medium ${country === c.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">シーン</label>
          <div className="grid grid-cols-5 gap-2">
            {SCENES.map((s) => (
              <button key={s.id} onClick={() => setScene(s.id)}
                className={`py-2 rounded-lg border text-xs font-medium ${scene === s.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"}`}>
                {s.icon}<br />{s.label}
              </button>
            ))}
          </div>
        </div>
        {tipInfo && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-sm font-medium text-blue-800">相場: {tipInfo.rate}%</p>
            <p className="text-xs text-blue-600 mt-1">{tipInfo.note}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">金額（現地通貨）</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="例: 50.00" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">チップ率（%、任意）</label>
            <input type="number" value={customRate} onChange={(e) => setCustomRate(e.target.value)} placeholder={tipInfo ? String(tipInfo.rate) : "18"} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>
      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">計算結果（{result.rate}%）</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">チップ金額</p>
              <p className="text-3xl font-bold text-blue-600">{result.tipAmount}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">支払い総額</p>
              <p className="text-3xl font-bold text-green-600">{result.total}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">パーセント別早見表</p>
            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-gray-700">チップ率</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-700">チップ額</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-700">合計</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rates.map((r) => (
                    <tr key={r.rate} className={`border-t border-gray-100 ${r.rate === result.rate ? "bg-blue-50" : ""}`}>
                      <td className="px-3 py-2 font-medium">{r.rate}%</td>
                      <td className="px-3 py-2 text-right">{r.tip}</td>
                      <td className="px-3 py-2 text-right font-bold text-blue-600">{r.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <AdBanner />
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">チップを払わないと失礼ですか？</h3><p className="text-sm text-gray-600 mt-1">チップ文化がある国（アメリカ・カナダなど）では、サービスを受けた場合にチップを渡さないのは失礼とみなされます。チップが給与の一部を担う国では特に重要です。</p></div>
          <div><h3 className="font-medium text-gray-900">クレジットカードでチップを払えますか？</h3><p className="text-sm text-gray-600 mt-1">多くのレストランやホテルではカード払い時にチップを追加できます。ただし従業員が手取りで受け取りやすい現金チップを好む場合もあります。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="tip-percent-calc" />
    </main>
  );
}
