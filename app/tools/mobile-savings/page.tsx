"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";

const fmt = (n: number) => n.toLocaleString("ja-JP");

interface Plan {
  name: string;
  carrier: string;
  data: string;
  price: number;
  type: "major" | "sub" | "mvno";
  note?: string;
}

const plans: Plan[] = [
  // 大手キャリア
  { name: "ドコモ eximo", carrier: "ドコモ", data: "無制限", price: 7315, type: "major" },
  { name: "au 使い放題MAX", carrier: "au", data: "無制限", price: 7238, type: "major" },
  { name: "ソフトバンク メリハリ無制限+", carrier: "SB", data: "無制限", price: 7425, type: "major" },
  { name: "ドコモ eximo(~3GB)", carrier: "ドコモ", data: "3GB", price: 5665, type: "major" },
  // サブブランド
  { name: "ahamo", carrier: "ドコモ系", data: "20GB", price: 2970, type: "sub" },
  { name: "ahamo 大盛り", carrier: "ドコモ系", data: "100GB", price: 4950, type: "sub" },
  { name: "UQモバイル ミニミニ", carrier: "au系", data: "4GB", price: 2365, type: "sub" },
  { name: "UQモバイル トクトク", carrier: "au系", data: "15GB", price: 3465, type: "sub" },
  { name: "UQモバイル コミコミ", carrier: "au系", data: "20GB", price: 3278, type: "sub" },
  { name: "ワイモバイル S", carrier: "SB系", data: "4GB", price: 2365, type: "sub" },
  { name: "ワイモバイル M", carrier: "SB系", data: "20GB", price: 4015, type: "sub" },
  { name: "LINEMO ミニ", carrier: "SB系", data: "3GB", price: 990, type: "sub" },
  { name: "LINEMO スマホ", carrier: "SB系", data: "20GB", price: 2728, type: "sub" },
  // 格安SIM
  { name: "楽天モバイル(~3GB)", carrier: "楽天", data: "3GB", price: 1078, type: "mvno" },
  { name: "楽天モバイル(~20GB)", carrier: "楽天", data: "20GB", price: 2178, type: "mvno" },
  { name: "楽天モバイル(無制限)", carrier: "楽天", data: "無制限", price: 3278, type: "mvno" },
  { name: "mineo マイピタ 1GB", carrier: "mineo", data: "1GB", price: 1298, type: "mvno" },
  { name: "mineo マイピタ 5GB", carrier: "mineo", data: "5GB", price: 1518, type: "mvno" },
  { name: "mineo マイピタ 20GB", carrier: "mineo", data: "20GB", price: 2178, type: "mvno" },
  { name: "IIJmio 2GB", carrier: "IIJ", data: "2GB", price: 850, type: "mvno" },
  { name: "IIJmio 5GB", carrier: "IIJ", data: "5GB", price: 990, type: "mvno" },
  { name: "IIJmio 15GB", carrier: "IIJ", data: "15GB", price: 1800, type: "mvno" },
  { name: "IIJmio 20GB", carrier: "IIJ", data: "20GB", price: 2000, type: "mvno" },
  { name: "日本通信 合理的プラン", carrier: "日本通信", data: "10GB", price: 1390, type: "mvno" },
  { name: "povo 2.0 基本", carrier: "au系", data: "0GB", price: 0, type: "mvno", note: "トッピング制" },
];

const typeLabels = { major: "📱 大手キャリア", sub: "📶 サブブランド", mvno: "💰 格安SIM/MVNO" };
const typeColors = { major: "bg-red-50 border-red-200", sub: "bg-blue-50 border-blue-200", mvno: "bg-green-50 border-green-200" };

export default function MobileSavings() {
  const [currentPrice, setCurrentPrice] = useState(8000);
  const [familyCount, setFamilyCount] = useState(1);
  const [filter, setFilter] = useState<"all" | "major" | "sub" | "mvno">("all");

  const filtered = filter === "all" ? plans : plans.filter(p => p.type === filter);
  const sorted = [...filtered].sort((a, b) => a.price - b.price);

  const totalCurrent = currentPrice * familyCount;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📱 スマホ料金節約シミュレーター</h1>
        <p className="text-gray-500 mt-1">今のスマホ代と比べて、いくら節約できる？</p>
      </div>

      <AdBanner />

      {/* 現在の料金入力 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-bold text-gray-900">現在のスマホ料金</h2>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">月額料金（1人あたり）</span>
            <span className="font-semibold">¥{fmt(currentPrice)}/月</span>
          </div>
          <input type="range" min={1000} max={15000} step={100} value={currentPrice}
            onChange={e => setCurrentPrice(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500" />
          <div className="flex justify-between text-xs text-gray-400">
            <span>¥1,000</span><span>¥15,000</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">家族の回線数</span>
            <span className="font-semibold">{familyCount}人</span>
          </div>
          <input type="range" min={1} max={5} step={1} value={familyCount}
            onChange={e => setFamilyCount(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-500" />
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <span className="text-sm text-gray-500">現在の月額合計</span>
          <p className="text-2xl font-bold text-gray-900">¥{fmt(totalCurrent)}<span className="text-sm text-gray-400">/月</span></p>
          <p className="text-sm text-gray-400">年間 ¥{fmt(totalCurrent * 12)}</p>
        </div>
      </div>

      {/* フィルタ */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "major", "sub", "mvno"] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {f === "all" ? "すべて" : typeLabels[f]}
          </button>
        ))}
      </div>

      {/* プラン一覧 */}
      <div className="space-y-3">
        {sorted.map(plan => {
          const savings = currentPrice - plan.price;
          const yearlySavings = savings * 12 * familyCount;
          const isPositive = savings > 0;
          return (
            <div key={plan.name} className={`rounded-xl border p-4 ${typeColors[plan.type]}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-900">{plan.name}</p>
                  <p className="text-xs text-gray-500">{plan.carrier} | {plan.data} {plan.note ? `(${plan.note})` : ""}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">¥{fmt(plan.price)}<span className="text-xs text-gray-400">/月</span></p>
                </div>
              </div>
              {isPositive ? (
                <div className="mt-2 bg-white/60 rounded-lg px-3 py-2 flex justify-between items-center">
                  <span className="text-sm text-green-700">💰 月 ¥{fmt(savings)} 節約</span>
                  <span className="font-bold text-green-700">年間 ¥{fmt(yearlySavings)} お得{familyCount > 1 ? `（${familyCount}人分）` : ""}</span>
                </div>
              ) : savings === 0 ? (
                <div className="mt-2 bg-white/60 rounded-lg px-3 py-2 text-sm text-gray-500">→ 現在と同じ料金</div>
              ) : (
                <div className="mt-2 bg-white/60 rounded-lg px-3 py-2 text-sm text-red-500">→ 現在より ¥{fmt(Math.abs(savings))}/月 高い</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
        <p className="font-bold mb-1">💡 乗り換えの注意点</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>端末の残債がある場合は継続して支払いが必要です</li>
          <li>MNP（番号ポータビリティ）で電話番号はそのまま引き継げます</li>
          <li>格安SIMは昼時間帯に速度が遅くなる場合があります</li>
          <li>家族割引がある場合は割引後の料金で比較してください</li>
        </ul>
      </div>

      <p className="text-xs text-gray-400 text-center">※ 2026年3月時点の主要プラン情報です。料金は税込み。割引前の基本料金で比較しています。最新情報は各社公式サイトをご確認ください。</p>

      <AdBanner />
    </div>
  );
}
