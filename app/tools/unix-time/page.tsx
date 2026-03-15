"use client";

import { useState, useEffect } from "react";
import AdBanner from "@/components/AdBanner";

export default function UnixTimeTool() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [convertedDate, setConvertedDate] = useState("");
  const [convertedUnix, setConvertedUnix] = useState("");

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  const unixToDate = (val: string) => {
    setUnixInput(val);
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setConvertedDate("");
      return;
    }
    const ts = val.length > 10 ? num : num * 1000;
    const d = new Date(ts);
    setConvertedDate(d.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" }));
  };

  const dateToUnix = (val: string) => {
    setDateInput(val);
    const d = new Date(val);
    if (isNaN(d.getTime())) {
      setConvertedUnix("");
      return;
    }
    setConvertedUnix(Math.floor(d.getTime() / 1000).toString());
  };

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">Unix時間変換</h1>
      <p className="text-gray-500 text-sm mb-6">
        Unixタイムスタンプと日時を相互変換します。
      </p>

      <AdBanner />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-center">
        <p className="text-sm text-blue-600 mb-1">現在のUnixタイムスタンプ</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl font-mono font-bold text-blue-800">{now}</span>
          <button onClick={() => copy(now.toString())} className="text-xs text-blue-600 hover:underline">コピー</button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-bold text-gray-700 mb-3">Unixタイムスタンプ → 日時</h2>
          <input
            type="text"
            value={unixInput}
            onChange={(e) => unixToDate(e.target.value)}
            placeholder="例: 1700000000"
            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {convertedDate && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-sm font-mono">{convertedDate}</span>
              <button onClick={() => copy(convertedDate)} className="text-xs text-blue-600 hover:underline">コピー</button>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h2 className="text-sm font-bold text-gray-700 mb-3">日時 → Unixタイムスタンプ</h2>
          <input
            type="datetime-local"
            value={dateInput}
            onChange={(e) => dateToUnix(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {convertedUnix && (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-sm font-mono">{convertedUnix}</span>
              <button onClick={() => copy(convertedUnix)} className="text-xs text-blue-600 hover:underline">コピー</button>
            </div>
          )}
        </div>
      </div>

      <AdBanner />
    </div>
  );
}
