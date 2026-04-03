"use client";

import { useState, useMemo, useCallback } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type TatamiType = "edo" | "kyo" | "danchi" | "fudosan";

const TATAMI_RATES: Record<TatamiType, number> = {
  edo: 1.548,
  kyo: 1.824,
  danchi: 1.444,
  fudosan: 1.62,
};

const TATAMI_LABELS: Record<TatamiType, string> = {
  edo: "江戸間（関東）1畳=1.548㎡",
  kyo: "京間（関西）1畳=1.824㎡",
  danchi: "団地サイズ 1畳=1.444㎡",
  fudosan: "不動産表記 1畳=1.62㎡",
};

const TSUBO_TO_SQM = 3.30578512;

const PRESETS = [6, 8, 10, 12, 15, 20];

const MADORI_TABLE = [
  { type: "ワンルーム", sqmRange: "20〜30㎡", tatamiRange: "12〜18畳", note: "単身向け" },
  { type: "1K", sqmRange: "20〜30㎡", tatamiRange: "12〜18畳", note: "単身向け" },
  { type: "1DK", sqmRange: "25〜35㎡", tatamiRange: "15〜22畳", note: "単身〜カップル" },
  { type: "1LDK", sqmRange: "30〜45㎡", tatamiRange: "18〜28畳", note: "カップル向け" },
  { type: "2DK", sqmRange: "35〜50㎡", tatamiRange: "22〜31畳", note: "2人〜3人" },
  { type: "2LDK", sqmRange: "45〜60㎡", tatamiRange: "28〜37畳", note: "ファミリー向け" },
  { type: "3LDK", sqmRange: "60〜80㎡", tatamiRange: "37〜49畳", note: "4人家族向け" },
];

interface Room {
  id: number;
  name: string;
  length: string;
  width: string;
}

type InputField = "tatami" | "tsubo" | "sqm";

export default function RoomSize() {
  const [tatamiType, setTatamiType] = useState<TatamiType>("fudosan");
  const [activeField, setActiveField] = useState<InputField>("tatami");
  const [tatamiVal, setTatamiVal] = useState("");
  const [tsuboVal, setTsuboVal] = useState("");
  const [sqmVal, setSqmVal] = useState("");

  const [rooms, setRooms] = useState<Room[]>([
    { id: 1, name: "リビング", length: "", width: "" },
  ]);

  const rate = TATAMI_RATES[tatamiType];

  const derived = useMemo(() => {
    const r = TATAMI_RATES[tatamiType];
    if (activeField === "tatami" && tatamiVal !== "") {
      const t = parseFloat(tatamiVal);
      if (isNaN(t)) return null;
      return { tatami: t, tsubo: (t * r) / TSUBO_TO_SQM, sqm: t * r };
    }
    if (activeField === "tsubo" && tsuboVal !== "") {
      const ts = parseFloat(tsuboVal);
      if (isNaN(ts)) return null;
      const sqm = ts * TSUBO_TO_SQM;
      return { tatami: sqm / r, tsubo: ts, sqm };
    }
    if (activeField === "sqm" && sqmVal !== "") {
      const sq = parseFloat(sqmVal);
      if (isNaN(sq)) return null;
      return { tatami: sq / r, tsubo: sq / TSUBO_TO_SQM, sqm: sq };
    }
    return null;
  }, [activeField, tatamiVal, tsuboVal, sqmVal, tatamiType]);

  function applyPreset(tatami: number) {
    setActiveField("tatami");
    setTatamiVal(String(tatami));
    setTsuboVal("");
    setSqmVal("");
  }

  function handleTatamiChange(v: string) {
    setActiveField("tatami");
    setTatamiVal(v);
  }
  function handleTsuboChange(v: string) {
    setActiveField("tsubo");
    setTsuboVal(v);
  }
  function handleSqmChange(v: string) {
    setActiveField("sqm");
    setSqmVal(v);
  }

  const displayTatami = derived ? derived.tatami.toFixed(2) : (activeField === "tatami" ? tatamiVal : "");
  const displayTsubo = derived ? derived.tsubo.toFixed(3) : (activeField === "tsubo" ? tsuboVal : "");
  const displaySqm = derived ? derived.sqm.toFixed(2) : (activeField === "sqm" ? sqmVal : "");

  // Multi-room calculator
  const roomResults = useMemo(() => {
    return rooms.map((r) => {
      const l = parseFloat(r.length);
      const w = parseFloat(r.width);
      if (!isNaN(l) && !isNaN(w) && l > 0 && w > 0) {
        const sqm = l * w;
        return { ...r, sqm, tatami: sqm / rate, tsubo: sqm / TSUBO_TO_SQM };
      }
      return { ...r, sqm: null, tatami: null, tsubo: null };
    });
  }, [rooms, rate]);

  const totalSqm = roomResults.reduce((sum, r) => sum + (r.sqm ?? 0), 0);
  const totalTatami = totalSqm / rate;
  const totalTsubo = totalSqm / TSUBO_TO_SQM;

  function addRoom() {
    setRooms((prev) => [...prev, { id: Date.now(), name: `部屋${prev.length + 1}`, length: "", width: "" }]);
  }
  function removeRoom(id: number) {
    setRooms((prev) => prev.filter((r) => r.id !== id));
  }
  const updateRoom = useCallback((id: number, field: keyof Room, value: string) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  }, []);

  // Visualization rectangle
  const vizRoom = roomResults[0];
  const vizSqm = vizRoom?.sqm ?? derived?.sqm ?? null;
  const rectAspect = useMemo(() => {
    if (vizRoom?.sqm && parseFloat(vizRoom.length) > 0 && parseFloat(vizRoom.width) > 0) {
      return { l: parseFloat(vizRoom.length), w: parseFloat(vizRoom.width) };
    }
    if (derived?.sqm) {
      // Assume square-ish room
      const side = Math.sqrt(derived.sqm);
      return { l: side * 1.2, w: side / 1.2 };
    }
    return null;
  }, [vizRoom, derived]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-6 mb-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🏠</span>
          <h1 className="text-2xl font-bold">部屋の広さ計算</h1>
        </div>
        <p className="text-orange-100 text-sm">
          畳・坪・㎡を相互変換。部屋の寸法入力にも対応。引越し・不動産選びの参考に。
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">

        {/* Tatami type selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">畳のタイプ</label>
          <select
            value={tatamiType}
            onChange={(e) => setTatamiType(e.target.value as TatamiType)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {(Object.keys(TATAMI_LABELS) as TatamiType[]).map((k) => (
              <option key={k} value={k}>{TATAMI_LABELS[k]}</option>
            ))}
          </select>
        </div>

        {/* Three-way converter */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">単位変換（どれかを入力すると自動変換）</h2>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">畳（帖）</label>
              <input
                type="number"
                value={activeField === "tatami" ? tatamiVal : (derived ? derived.tatami.toFixed(2) : "")}
                onChange={(e) => handleTatamiChange(e.target.value)}
                onFocus={() => setActiveField("tatami")}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-center font-medium"
              />
              <div className="text-center text-xs text-gray-400 mt-1">畳</div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">坪</label>
              <input
                type="number"
                value={activeField === "tsubo" ? tsuboVal : (derived ? derived.tsubo.toFixed(3) : "")}
                onChange={(e) => handleTsuboChange(e.target.value)}
                onFocus={() => setActiveField("tsubo")}
                placeholder="0"
                min="0"
                step="0.001"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-center font-medium"
              />
              <div className="text-center text-xs text-gray-400 mt-1">坪</div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">平方メートル</label>
              <input
                type="number"
                value={activeField === "sqm" ? sqmVal : (derived ? derived.sqm.toFixed(2) : "")}
                onChange={(e) => handleSqmChange(e.target.value)}
                onFocus={() => setActiveField("sqm")}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-center font-medium"
              />
              <div className="text-center text-xs text-gray-400 mt-1">㎡</div>
            </div>
          </div>
        </div>

        {/* Presets */}
        <div>
          <div className="text-xs text-gray-500 mb-2">プリセット</div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => applyPreset(p)}
                className="px-3 py-1.5 text-sm rounded-full border border-orange-200 text-orange-700 hover:bg-orange-50 transition-colors"
              >
                {p}畳
              </button>
            ))}
          </div>
        </div>

        {/* Visualization */}
        {(derived?.sqm ?? vizSqm) !== null && rectAspect && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">部屋のイメージ（縮尺比）</h3>
            <div className="flex justify-center">
              <div
                className="bg-orange-100 border-2 border-orange-400 rounded flex items-center justify-center relative"
                style={{
                  width: `${Math.min(240, Math.max(80, (rectAspect.l / (rectAspect.l + rectAspect.w)) * 320))}px`,
                  height: `${Math.min(180, Math.max(60, (rectAspect.w / (rectAspect.l + rectAspect.w)) * 240))}px`,
                }}
              >
                <div className="text-center">
                  <div className="text-sm font-bold text-orange-700">
                    {(derived?.sqm ?? vizSqm ?? 0).toFixed(1)}㎡
                  </div>
                  <div className="text-xs text-orange-600">
                    {(derived ? derived.tatami : totalTatami).toFixed(1)}畳
                  </div>
                </div>
                {/* dimension labels */}
                <div className="absolute -bottom-5 left-0 right-0 text-center text-xs text-gray-400">
                  {rectAspect.l.toFixed(1)}m
                </div>
                <div className="absolute top-0 bottom-0 -right-6 flex items-center">
                  <span className="text-xs text-gray-400 -rotate-90">{rectAspect.w.toFixed(1)}m</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multi-room calculator */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">複数部屋の合計計算</h2>
          <div className="space-y-2">
            {rooms.map((room) => {
              const rResult = roomResults.find((r) => r.id === room.id);
              return (
                <div key={room.id} className="flex items-center gap-2 flex-wrap">
                  <input
                    type="text"
                    value={room.name}
                    onChange={(e) => updateRoom(room.id, "name", e.target.value)}
                    placeholder="部屋名"
                    className="w-24 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <input
                    type="number"
                    value={room.length}
                    onChange={(e) => updateRoom(room.id, "length", e.target.value)}
                    placeholder="縦 (m)"
                    min="0"
                    step="0.01"
                    className="w-24 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  <span className="text-gray-400">×</span>
                  <input
                    type="number"
                    value={room.width}
                    onChange={(e) => updateRoom(room.id, "width", e.target.value)}
                    placeholder="横 (m)"
                    min="0"
                    step="0.01"
                    className="w-24 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  {rResult?.sqm !== null && (
                    <span className="text-sm text-gray-600 font-medium">
                      = {rResult!.sqm!.toFixed(2)}㎡（{rResult!.tatami!.toFixed(1)}畳）
                    </span>
                  )}
                  {rooms.length > 1 && (
                    <button
                      onClick={() => removeRoom(room.id)}
                      className="text-xs text-red-400 hover:text-red-600 ml-auto"
                    >
                      削除
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <button
            onClick={addRoom}
            className="mt-3 text-sm text-orange-600 hover:text-orange-800 underline"
          >
            ＋ 部屋を追加
          </button>

          {totalSqm > 0 && (
            <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="text-sm font-semibold text-orange-800 mb-2">合計面積</div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xl font-bold text-orange-700">{totalSqm.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">㎡</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-orange-700">{totalTatami.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">畳</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-orange-700">{totalTsubo.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">坪</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Madori table */}
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">間取り別 広さの目安</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-3 py-2 text-left font-medium text-gray-600">間取り</th>
                  <th className="border border-gray-200 px-3 py-2 text-center font-medium text-gray-600">㎡目安</th>
                  <th className="border border-gray-200 px-3 py-2 text-center font-medium text-gray-600">畳目安</th>
                  <th className="border border-gray-200 px-3 py-2 text-center font-medium text-gray-600">用途</th>
                </tr>
              </thead>
              <tbody>
                {MADORI_TABLE.map((row) => (
                  <tr key={row.type} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-3 py-2 font-medium text-orange-700">{row.type}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center text-gray-700">{row.sqmRange}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center text-gray-700">{row.tatamiRange}</td>
                    <td className="border border-gray-200 px-3 py-2 text-center text-gray-500 text-xs">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">部屋の広さ計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          畳・坪・㎡のどれかを入力すると他の単位に自動変換します。畳のタイプ（江戸間・京間・団地・不動産表記）を切り替えて正確な換算が可能です。
          プリセットボタンで6畳〜20畳をワンタップで入力。縦×横の寸法を入れると面積を直接計算でき、複数部屋の合計面積も出せます。
          引越し先の内見や不動産選びの参考にご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "1畳は何平米ですか？",
            answer:
              "畳のサイズは地域によって異なります。江戸間（関東標準）は1畳≒1.548㎡、京間（関西）は1畳≒1.824㎡、団地サイズは1畳≒1.444㎡です。不動産広告では1畳=1.62㎡で計算されることが多いです。",
          },
          {
            question: "1坪は何平米ですか？",
            answer: "1坪 = 約3.3058㎡（正確には約3.30578512㎡）です。また1坪 = 2畳（江戸間）です。",
          },
          {
            question: "1LDKと2LDKの広さの違いは？",
            answer:
              "一般的に1LDKは30〜45㎡、2LDKは45〜60㎡程度が目安です。LDK部分は10畳以上、Dがある場合はさらに広くなります。",
          },
          {
            question: "部屋の広さはどうやって測りますか？",
            answer:
              "部屋の縦×横の長さ（m）を掛けて㎡が求められます。壁から壁の内法寸法で測るのが一般的です。不動産広告の面積は壁の中心線で測る壁芯計算が多いため実際より広く表示されることがあります。",
          },
        ]}
      />

      <RelatedTools currentToolId="room-size" />
    </div>
  );
}
