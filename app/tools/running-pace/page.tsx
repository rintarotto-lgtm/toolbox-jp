"use client";
import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

const RACE_DISTANCES = [
  { name: "5km", km: 5 },
  { name: "10km", km: 10 },
  { name: "ハーフマラソン", km: 21.0975 },
  { name: "フルマラソン", km: 42.195 },
];

const MARATHON_TARGETS = [
  { name: "サブ3", time: "2:59:59", pace: "4:16" },
  { name: "サブ3.5", time: "3:29:59", pace: "4:58" },
  { name: "サブ4", time: "3:59:59", pace: "5:41" },
  { name: "サブ4.5", time: "4:29:59", pace: "6:23" },
  { name: "サブ5", time: "4:59:59", pace: "7:06" },
];

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatPace(secsPerKm: number): string {
  const m = Math.floor(secsPerKm / 60);
  const s = Math.floor(secsPerKm % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function RunningPacePage() {
  const [mode, setMode] = useState<"pace" | "time">("pace");
  const [paceMin, setPaceMin] = useState("");
  const [paceSec, setPaceSec] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  const [distance, setDistance] = useState("42.195");

  const paceToTimes = () => {
    const pm = parseInt(paceMin) || 0;
    const ps = parseInt(paceSec) || 0;
    const paceSeconds = pm * 60 + ps;
    if (!paceSeconds) return null;
    return RACE_DISTANCES.map((r) => ({
      name: r.name,
      time: formatTime(paceSeconds * r.km),
    }));
  };

  const timeToPace = () => {
    const h = parseFloat(hours) || 0;
    const m = parseFloat(minutes) || 0;
    const s = parseFloat(seconds) || 0;
    const d = parseFloat(distance);
    const totalSecs = h * 3600 + m * 60 + s;
    if (!totalSecs || !d) return null;
    const paceSeconds = totalSecs / d;
    const speedKmh = (d / (totalSecs / 3600)).toFixed(2);
    return { pace: formatPace(paceSeconds), speed: speedKmh };
  };

  const paceResults = mode === "pace" ? paceToTimes() : null;
  const timeResult = mode === "time" ? timeToPace() : null;

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">ランニングペース計算</h1>
      <p className="text-gray-600 mb-6">ペースから完走タイム予測、またはタイムから必要ペースを計算します。</p>

      <AdBanner />

      <div className="mt-6 flex gap-2">
        <button
          onClick={() => setMode("pace")}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${mode === "pace" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          ペース → タイム
        </button>
        <button
          onClick={() => setMode("time")}
          className={`flex-1 py-2 rounded-lg font-medium transition-colors ${mode === "time" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          タイム → ペース
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-4 space-y-4">
        {mode === "pace" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">1kmあたりのペース</label>
            <div className="flex items-center gap-2">
              <input type="number" value={paceMin} onChange={(e) => setPaceMin(e.target.value)} placeholder="分" className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="text-gray-600">分</span>
              <input type="number" value={paceSec} onChange={(e) => setPaceSec(e.target.value)} placeholder="秒" className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="text-gray-600">秒 /km</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">距離（km）</label>
              <div className="flex gap-2 flex-wrap mb-2">
                {RACE_DISTANCES.map((r) => (
                  <button key={r.name} onClick={() => setDistance(String(r.km))} className={`px-3 py-1 rounded text-sm border ${distance === String(r.km) ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}>{r.name}</button>
                ))}
              </div>
              <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="ml-2 text-gray-600">km</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">タイム</label>
              <div className="flex items-center gap-2">
                <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="時間" className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="text-gray-600">時間</span>
                <input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="分" className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="text-gray-600">分</span>
                <input type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} placeholder="秒" className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <span className="text-gray-600">秒</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {paceResults && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">各レース完走タイム予測</h2>
          <div className="grid grid-cols-2 gap-3">
            {paceResults.map((r) => (
              <div key={r.name} className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">{r.name}</p>
                <p className="text-2xl font-bold text-blue-600">{r.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {timeResult && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">計算結果</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">必要ペース</p>
              <p className="text-3xl font-bold text-blue-600">{timeResult.pace}</p>
              <p className="text-xs text-gray-500">/km</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">平均スピード</p>
              <p className="text-3xl font-bold text-green-600">{timeResult.speed}</p>
              <p className="text-xs text-gray-500">km/h</p>
            </div>
          </div>
        </div>
      )}

      <AdBanner />

      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">マラソン目標タイム別ペース表</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-700">目標</th>
                <th className="text-center px-4 py-2 font-medium text-gray-700">完走タイム</th>
                <th className="text-right px-4 py-2 font-medium text-gray-700">必要ペース/km</th>
              </tr>
            </thead>
            <tbody>
              {MARATHON_TARGETS.map((t) => (
                <tr key={t.name} className="border-t border-gray-100">
                  <td className="px-4 py-2 font-medium text-gray-800">{t.name}</td>
                  <td className="px-4 py-2 text-center text-gray-600">{t.time}</td>
                  <td className="px-4 py-2 text-right font-medium text-blue-600">{t.pace}/km</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">マラソンサブ4のペースは？</h3>
            <p className="text-sm text-gray-600 mt-1">1kmあたり約5分41秒です。このペースを42.195km維持することで3時間59分59秒でフィニッシュできます。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">5kmを30分で走るには？</h3>
            <p className="text-sm text-gray-600 mt-1">1kmあたり6分00秒のペースが必要です。これは時速10kmに相当します。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">ランニング初心者の目安ペースは？</h3>
            <p className="text-sm text-gray-600 mt-1">初心者は1kmあたり7〜8分程度のゆっくりとしたペースから始めましょう。会話ができる程度の速度が有酸素運動に最適です。</p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="running-pace" />
    </main>
  );
}
