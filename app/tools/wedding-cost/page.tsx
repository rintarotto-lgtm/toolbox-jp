"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";

const fmt = (n: number) => n.toLocaleString("ja-JP");

export default function WeddingCostCalc() {
  // 結婚式・披露宴
  const [guests, setGuests] = useState(60);
  const [venuePerPerson, setVenuePerPerson] = useState(20000);
  const [dress, setDress] = useState(400000);
  const [photo, setPhoto] = useState(200000);
  const [flowers, setFlowers] = useState(150000);
  const [invitation, setInvitation] = useState(30000);
  const [entertainment, setEntertainment] = useState(100000);

  // ご祝儀
  const [goshugiPerPerson, setGoshugiPerPerson] = useState(30000);

  // 婚約
  const [engagementRing, setEngagementRing] = useState(350000);
  const [weddingRings, setWeddingRings] = useState(250000);

  // 新婚旅行
  const [honeymoon, setHoneymoon] = useState(500000);

  // 新生活
  const [newHomeInit, setNewHomeInit] = useState(400000);
  const [furniture, setFurniture] = useState(300000);

  // 計算
  const venueCost = guests * venuePerPerson;
  const ceremonyCost = venueCost + dress + photo + flowers + invitation + entertainment;
  const ringsCost = engagementRing + weddingRings;
  const newLifeCost = newHomeInit + furniture;
  const totalCost = ceremonyCost + ringsCost + honeymoon + newLifeCost;
  const totalGoshugi = guests * goshugiPerPerson;
  const selfPay = totalCost - totalGoshugi;

  const sections = [
    { label: "💒 結婚式・披露宴", value: ceremonyCost, color: "bg-pink-400" },
    { label: "💍 婚約・結婚指輪", value: ringsCost, color: "bg-purple-400" },
    { label: "✈️ 新婚旅行", value: honeymoon, color: "bg-blue-400" },
    { label: "🏠 新生活準備", value: newLifeCost, color: "bg-green-400" },
  ];

  const Slider = ({ label, value, set, min, max, step, unit = "円" }: { label: string; value: number; set: (v: number) => void; min: number; max: number; step: number; unit?: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-900">{unit === "人" ? `${value}${unit}` : `¥${fmt(value)}`}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-pink-500" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">💒 結婚費用シミュレーター</h1>
        <p className="text-gray-500 mt-1">結婚って全部でいくらかかる？式・指輪・旅行・新生活まで一括計算。</p>
      </div>

      <AdBanner />

      {/* ヒーロー */}
      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 text-center border border-pink-100">
        <p className="text-sm text-pink-600 font-medium">結婚にかかる総費用</p>
        <p className="text-4xl sm:text-5xl font-bold text-pink-600 mt-2">¥{fmt(totalCost)}</p>
        <p className="text-gray-500 mt-1 text-sm">約{Math.round(totalCost / 10000)}万円</p>
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-pink-200">
          <div>
            <p className="text-xs text-gray-500">ご祝儀見込み</p>
            <p className="font-bold text-green-600">¥{fmt(totalGoshugi)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">自己負担額</p>
            <p className="font-bold text-red-600">¥{fmt(Math.max(0, selfPay))}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">ご祝儀カバー率</p>
            <p className="font-bold text-gray-900">{totalCost > 0 ? Math.round(totalGoshugi / totalCost * 100) : 0}%</p>
          </div>
        </div>
      </div>

      {/* 内訳バー */}
      <div className="space-y-2">
        <h2 className="font-bold text-gray-900 text-sm">費用の内訳</h2>
        <div className="flex rounded-full overflow-hidden h-6">
          {sections.map(s => {
            const pct = totalCost > 0 ? (s.value / totalCost) * 100 : 0;
            return pct > 0 ? (
              <div key={s.label} className={`${s.color} flex items-center justify-center text-white text-xs font-medium`} style={{ width: `${pct}%` }}>
                {pct > 10 ? `${Math.round(pct)}%` : ""}
              </div>
            ) : null;
          })}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {sections.map(s => (
            <span key={s.label} className="flex items-center gap-1">
              <span className={`inline-block w-3 h-3 rounded-sm ${s.color}`} />
              {s.label} ¥{fmt(s.value)}
            </span>
          ))}
        </div>
      </div>

      {/* 結婚式・披露宴 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-bold text-gray-900">💒 結婚式・披露宴</h2>
        <Slider label="招待人数" value={guests} set={setGuests} min={10} max={150} step={5} unit="人" />
        <Slider label="料理・飲物（1人あたり）" value={venuePerPerson} set={setVenuePerPerson} min={10000} max={30000} step={1000} />
        <Slider label="衣装（ドレス・タキシード）" value={dress} set={setDress} min={100000} max={1000000} step={50000} />
        <Slider label="撮影・映像" value={photo} set={setPhoto} min={50000} max={500000} step={50000} />
        <Slider label="装花・会場装飾" value={flowers} set={setFlowers} min={50000} max={500000} step={10000} />
        <Slider label="招待状・席次表" value={invitation} set={setInvitation} min={10000} max={100000} step={5000} />
        <Slider label="演出・BGM" value={entertainment} set={setEntertainment} min={0} max={300000} step={10000} />
        <div className="text-right font-bold text-lg text-pink-600">小計: ¥{fmt(ceremonyCost)}</div>
      </div>

      {/* ご祝儀 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-bold text-gray-900">🧧 ご祝儀</h2>
        <Slider label="ご祝儀平均額（1人あたり）" value={goshugiPerPerson} set={setGoshugiPerPerson} min={20000} max={50000} step={1000} />
        <div className="bg-green-50 rounded-lg p-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">ご祝儀見込み合計（{guests}人 × ¥{fmt(goshugiPerPerson)}）</span>
            <span className="font-bold text-green-600">¥{fmt(totalGoshugi)}</span>
          </div>
        </div>
      </div>

      {/* 指輪 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-bold text-gray-900">💍 婚約・結婚指輪</h2>
        <Slider label="婚約指輪" value={engagementRing} set={setEngagementRing} min={0} max={1000000} step={50000} />
        <Slider label="結婚指輪（ペア）" value={weddingRings} set={setWeddingRings} min={50000} max={500000} step={10000} />
        <div className="text-right font-bold text-lg text-purple-600">小計: ¥{fmt(ringsCost)}</div>
      </div>

      {/* 新婚旅行 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-bold text-gray-900">✈️ 新婚旅行</h2>
        <Slider label="新婚旅行費用（2人分）" value={honeymoon} set={setHoneymoon} min={0} max={2000000} step={50000} />
        <div className="flex flex-wrap gap-2 text-xs">
          {[{ l: "国内温泉", v: 200000 }, { l: "ハワイ", v: 600000 }, { l: "ヨーロッパ", v: 1000000 }, { l: "モルディブ", v: 800000 }, { l: "なし", v: 0 }].map(p => (
            <button key={p.l} onClick={() => setHoneymoon(p.v)}
              className={`px-3 py-1.5 rounded-full border ${honeymoon === p.v ? "bg-blue-100 border-blue-400 text-blue-700" : "border-gray-200 text-gray-600 hover:border-blue-300"}`}>
              {p.l}
            </button>
          ))}
        </div>
      </div>

      {/* 新生活 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-bold text-gray-900">🏠 新生活準備</h2>
        <Slider label="新居の初期費用（敷金・礼金等）" value={newHomeInit} set={setNewHomeInit} min={0} max={1000000} step={50000} />
        <Slider label="家具・家電" value={furniture} set={setFurniture} min={0} max={1000000} step={50000} />
        <div className="text-right font-bold text-lg text-green-600">小計: ¥{fmt(newLifeCost)}</div>
      </div>

      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 text-sm text-pink-700">
        <p className="font-bold mb-1">💡 節約ポイント</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>オフシーズン（1-2月, 7-8月）は会場費用が10-30%割引になることも</li>
          <li>少人数婚（30人以下）なら料理のグレードを上げつつ総額を抑えられます</li>
          <li>フォトウェディングなら式費用を大幅に節約できます</li>
          <li>ご祝儀で式費用の50-70%をカバーできるのが一般的です</li>
        </ul>
      </div>

      <p className="text-xs text-gray-400 text-center">※ 費用は一般的な目安です。地域や会場により大きく異なります。</p>

      <AdBanner />
    </div>
  );
}
