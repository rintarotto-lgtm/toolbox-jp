"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const ELECTRICITY_BASE: Record<string, Record<string, number>> = {
  "1": { apartment: 5500, house: 6500 },
  "2": { apartment: 9000, house: 11000 },
  "3": { apartment: 11000, house: 14000 },
  "4": { apartment: 13000, house: 17000 },
  "5+": { apartment: 16000, house: 21000 },
};
const GAS_BASE: Record<string, Record<string, number>> = {
  "1": { apartment: 2500, house: 3000 },
  "2": { apartment: 4000, house: 5000 },
  "3": { apartment: 5000, house: 6500 },
  "4": { apartment: 6000, house: 8000 },
  "5+": { apartment: 7500, house: 10000 },
};
const WATER_BASE: Record<string, number> = {
  "1": 2000, "2": 3500, "3": 4500, "4": 5500, "5+": 7000,
};
const SEASON_MULT: Record<string, number> = {
  spring: 0.9, summer: 1.3, fall: 0.85, winter: 1.25,
};
const REGION_MULT: Record<string, number> = {
  hokkaido: 1.4, tohoku: 1.25, kanto: 1.0, chubu: 1.05,
  kansai: 0.95, chugoku: 1.0, shikoku: 1.05, kyushu: 1.0, okinawa: 1.1,
};

export default function UtilityCostCalcPage() {
  const [people, setPeople] = useState("2");
  const [housing, setHousing] = useState<"apartment" | "house">("apartment");
  const [season, setSeason] = useState("all");
  const [region, setRegion] = useState("kanto");
  const [hasGas, setHasGas] = useState(true);

  const result = useMemo(() => {
    const elec = (ELECTRICITY_BASE[people]?.[housing] ?? 10000) * (REGION_MULT[region] ?? 1.0);
    const gasBase = hasGas ? (GAS_BASE[people]?.[housing] ?? 5000) : 0;
    const water = WATER_BASE[people] ?? 4000;
    const seasonMult = season !== "all" ? (SEASON_MULT[season] ?? 1.0) : 1.0;
    const elecFinal = Math.round(elec * (season !== "all" ? seasonMult : 1.0));
    const gasFinal = Math.round(gasBase * (season === "winter" ? 1.4 : season === "summer" ? 0.7 : 1.0));
    const total = elecFinal + gasFinal + water;
    const annualTotal = total * 12;
    return { electricity: elecFinal, gas: gasFinal, water, total, annualTotal };
  }, [people, housing, season, region, hasGas]);

  const formatNum = (n: number) => n.toLocaleString("ja-JP");

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">光熱費シミュレーター</h1>
      <p className="text-gray-600 mb-6">家族構成・住居タイプ・地域から光熱費の目安を計算します。</p>
      <AdBanner />
      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">世帯人数</label>
            <select value={people} onChange={(e) => setPeople(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {["1", "2", "3", "4", "5+"].map((n) => <option key={n} value={n}>{n === "5+" ? "5人以上" : `${n}人`}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">住居タイプ</label>
            <div className="flex gap-2">
              <button onClick={() => setHousing("apartment")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${housing === "apartment" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>集合住宅</button>
              <button onClick={() => setHousing("house")} className={`flex-1 py-2 rounded-lg text-sm font-medium ${housing === "house" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>一戸建て</button>
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">地域</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="hokkaido">北海道</option>
            <option value="tohoku">東北</option>
            <option value="kanto">関東</option>
            <option value="chubu">中部</option>
            <option value="kansai">関西</option>
            <option value="chugoku">中国</option>
            <option value="shikoku">四国</option>
            <option value="kyushu">九州</option>
            <option value="okinawa">沖縄</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">季節</label>
          <div className="grid grid-cols-5 gap-2">
            {[{v:"all",l:"年間平均"},{v:"spring",l:"春"},{v:"summer",l:"夏"},{v:"fall",l:"秋"},{v:"winter",l:"冬"}].map(({v,l}) => (
              <button key={v} onClick={() => setSeason(v)} className={`py-2 rounded-lg text-sm font-medium ${season === v ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>{l}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
            <input type="checkbox" checked={hasGas} onChange={(e) => setHasGas(e.target.checked)} className="rounded" />
            都市ガス使用
          </label>
        </div>
      </div>
      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">月額光熱費の目安</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3">
              <span className="flex items-center gap-2 text-gray-700">⚡ 電気代</span>
              <span className="text-xl font-bold text-yellow-600">¥{formatNum(result.electricity)}</span>
            </div>
            {hasGas && (
              <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3">
                <span className="flex items-center gap-2 text-gray-700">🔥 ガス代</span>
                <span className="text-xl font-bold text-orange-600">¥{formatNum(result.gas)}</span>
              </div>
            )}
            <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3">
              <span className="flex items-center gap-2 text-gray-700">💧 水道代</span>
              <span className="text-xl font-bold text-blue-600">¥{formatNum(result.water)}</span>
            </div>
            <div className="flex justify-between items-center bg-blue-600 rounded-lg px-4 py-4">
              <span className="text-white font-bold">月額合計</span>
              <span className="text-2xl font-bold text-white">¥{formatNum(result.total)}</span>
            </div>
            <div className="flex justify-between items-center bg-white rounded-lg px-4 py-3">
              <span className="text-gray-600">年間合計（概算）</span>
              <span className="text-xl font-bold text-gray-800">¥{formatNum(result.annualTotal)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">※地域の電力単価・ガス料金・使用量の統計データを基にした概算値です。</p>
        </div>
      )}
      <AdBanner />
      <div className="mt-8 bg-green-50 rounded-xl p-5 border border-green-200">
        <h2 className="font-bold text-green-900 mb-3">💡 光熱費節約のポイント</h2>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• 電力会社を乗り換える（年間1〜3万円節約の可能性）</li>
          <li>• エアコンフィルターを月1回掃除（電気代3〜5%削減）</li>
          <li>• 給湯器の設定温度を1〜2℃下げる（ガス代2〜5%削減）</li>
          <li>• LED照明に交換（照明コスト最大80%削減）</li>
        </ul>
      </div>
      <div className="mt-6 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div><h3 className="font-medium text-gray-900">電気代の月平均はいくら？</h3><p className="text-sm text-gray-600 mt-1">2人以上の世帯の電気代の月平均は約12,000〜15,000円、1人暮らしは5,000〜8,000円が目安です（2023年度）。</p></div>
          <div><h3 className="font-medium text-gray-900">光熱費が高い月はいつ？</h3><p className="text-sm text-gray-600 mt-1">電気代は夏（7〜9月）と冬（12〜2月）が高く、ガス代は冬が高くなります。特に1月・2月は1年で最も光熱費が高い傾向があります。</p></div>
        </div>
      </div>
      <RelatedTools currentToolId="utility-cost-calc" />
    </main>
  );
}
