"use client";

import { useState, useEffect } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

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
      <ToolFAQ faqs={[
        { question: "Unixタイムスタンプとは何ですか？", answer: "Unixタイムスタンプ（エポック秒）とは、1970年1月1日00:00:00 UTCからの経過秒数で時刻を表す形式です。プログラミングやデータベースで日時を扱う標準的な方法として広く使われています。" },
        { question: "Unix時間とミリ秒タイムスタンプの違いは？", answer: "Unix時間は秒単位（10桁）で表現されますが、JavaScriptなどでは ミリ秒単位（13桁）のタイムスタンプが使われます。本ツールはどちらの形式にも対応して自動判別し、日時に変換します。" },
        { question: "タイムゾーンはどのように処理されますか？", answer: "本ツールではJST（日本標準時、UTC+9）で日時を表示します。Unixタイムスタンプ自体はタイムゾーンに依存しないUTC基準の値ですが、表示時にJSTへ変換しています。" },
        { question: "2038年問題とは何ですか？", answer: "2038年問題とは、32ビット整数でUnix時間を管理するシステムで、2038年1月19日に整数がオーバーフローする問題です。64ビットシステムへの移行により多くの環境で対策済みです。" },
      ]} />
      <RelatedTools currentToolId="unix-time" />
    </div>
  );
}
