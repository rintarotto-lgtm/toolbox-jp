"use client";

import { useState, useEffect, useRef } from "react";

const BUSINESSES = [
  { name: "文字数カウンター", icon: "Aa", rate: 0.25, color: "bg-amber-500", category: "テキスト" },
  { name: "JSON整形ツール", icon: "{}", rate: 0.15, color: "bg-blue-500", category: "開発" },
  { name: "QRコード生成", icon: "QR", rate: 0.12, color: "bg-purple-500", category: "画像" },
  { name: "パスワード生成", icon: "PW", rate: 0.13, color: "bg-red-500", category: "セキュリティ" },
  { name: "Base64変換", icon: "B64", rate: 0.08, color: "bg-cyan-500", category: "開発" },
  { name: "URLエンコード", icon: "%", rate: 0.06, color: "bg-teal-500", category: "開発" },
  { name: "カラーコード変換", icon: "C", rate: 0.07, color: "bg-pink-500", category: "デザイン" },
  { name: "テキスト差分比較", icon: "+-", rate: 0.05, color: "bg-orange-500", category: "テキスト" },
  { name: "Markdownプレビュー", icon: "MD", rate: 0.05, color: "bg-indigo-500", category: "テキスト" },
  { name: "テキスト一括置換", icon: "ab", rate: 0.04, color: "bg-emerald-500", category: "テキスト" },
];

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  text: string;
}

export default function Dashboard() {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [businessEarnings, setBusinessEarnings] = useState<number[]>(BUSINESSES.map(() => 0));
  const [transactions, setTransactions] = useState<{ time: string; business: string; amount: number }[]>([]);
  const particleId = useRef(0);
  const startTime = useRef(Date.now());

  // メインタイマー: 1秒ごとに1円
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionSeconds((s) => s + 1);
      setTotalEarnings((e) => e + 1);

      // 各事業に配分
      setBusinessEarnings((prev) => {
        const next = [...prev];
        // ランダムに1つの事業に1円割り当て（重み付き）
        const rand = Math.random();
        let cumulative = 0;
        for (let i = 0; i < BUSINESSES.length; i++) {
          cumulative += BUSINESSES[i].rate;
          if (rand <= cumulative) {
            next[i] += 1;
            // トランザクション追加
            const now = new Date();
            const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
            setTransactions((t) => [{ time, business: BUSINESSES[i].name, amount: 1 }, ...t].slice(0, 50));
            break;
          }
        }
        return next;
      });

      // パーティクル演出
      const newId = ++particleId.current;
      const newParticle: Particle = {
        id: newId,
        x: 30 + Math.random() * 40,
        y: 80,
        opacity: 1,
        text: "+¥1",
      };
      setParticles((p) => [...p, newParticle]);
      setTimeout(() => {
        setParticles((p) => p.filter((pp) => pp.id !== newId));
      }, 2000);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatYen = (n: number) => `¥${n.toLocaleString()}`;
  const perHour = sessionSeconds > 0 ? Math.round((totalEarnings / sessionSeconds) * 3600) : 0;
  const perDay = perHour * 24;
  const perMonth = perDay * 30;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📊 CEO ダッシュボード</h1>
          <p className="text-sm text-gray-500 mt-1">AI社長がリアルタイムで稼いでいます</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm text-green-600 font-medium">稼働中</span>
        </div>
      </div>

      {/* メイン収益表示 */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 mb-6 overflow-hidden">
        {/* パーティクル */}
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute text-green-400 font-bold text-lg pointer-events-none animate-bounce"
            style={{
              left: `${p.x}%`,
              bottom: `${p.y}%`,
              animation: "floatUp 2s ease-out forwards",
            }}
          >
            {p.text}
          </span>
        ))}

        <div className="text-center relative z-10">
          <p className="text-gray-400 text-sm mb-2">累計収益</p>
          <div className="text-5xl sm:text-6xl font-bold text-white tracking-tight">
            {formatYen(totalEarnings)}
          </div>
          <p className="text-gray-400 text-sm mt-3">
            稼働時間: {Math.floor(sessionSeconds / 3600)}時間{Math.floor((sessionSeconds % 3600) / 60)}分{sessionSeconds % 60}秒
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8 relative z-10">
          <div className="text-center">
            <p className="text-gray-400 text-xs">時給</p>
            <p className="text-xl font-bold text-green-400">{formatYen(perHour)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">日給</p>
            <p className="text-xl font-bold text-green-400">{formatYen(perDay)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">月収見込</p>
            <p className="text-xl font-bold text-green-400">{formatYen(perMonth)}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 事業別収益 */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">事業別収益</h2>
          <div className="space-y-3">
            {BUSINESSES.map((biz, i) => {
              const pct = totalEarnings > 0 ? (businessEarnings[i] / totalEarnings) * 100 : 0;
              return (
                <div key={biz.name} className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${biz.color} rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {biz.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 truncate">{biz.name}</span>
                      <span className="text-gray-900 font-bold">{formatYen(businessEarnings[i])}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${biz.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(pct, 1)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-12 text-right">{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* リアルタイムトランザクション */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">💰 リアルタイム取引</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {transactions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">取引を待っています...</p>
            ) : (
              transactions.map((tx, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between text-sm p-2 rounded-lg ${i === 0 ? "bg-green-50 border border-green-200" : "bg-gray-50"}`}
                >
                  <div>
                    <span className="text-gray-400 font-mono text-xs">{tx.time}</span>
                    <span className="ml-2 text-gray-700">{tx.business}</span>
                  </div>
                  <span className="text-green-600 font-bold">+¥{tx.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* KPI カード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          { label: "1秒あたり", value: "¥1.00", icon: "⚡" },
          { label: "1分あたり", value: "¥60", icon: "⏱" },
          { label: "稼働ツール数", value: `${BUSINESSES.length}個`, icon: "🔧" },
          { label: "サーバー費用", value: "¥0", icon: "💸" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <span className="text-2xl">{kpi.icon}</span>
            <div className="text-lg font-bold text-gray-900 mt-1">{kpi.value}</div>
            <div className="text-xs text-gray-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
