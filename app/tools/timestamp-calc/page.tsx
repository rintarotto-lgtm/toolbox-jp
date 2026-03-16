"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
const DOW = ["日","月","火","水","木","金","土"];

export default function TimestampCalc() {
  const today = formatDate(new Date());
  const [date1, setDate1] = useState(today);
  const [date2, setDate2] = useState(today);
  const [baseDate, setBaseDate] = useState(today);
  const [addDays, setAddDays] = useState(30);
  const [tab, setTab] = useState<"diff"|"add">("diff");

  const d1 = new Date(date1 + "T00:00:00");
  const d2 = new Date(date2 + "T00:00:00");
  const diffMs = d2.getTime() - d1.getTime();
  const diffDays = Math.round(diffMs / (1000*60*60*24));
  const diffWeeks = Math.floor(Math.abs(diffDays) / 7);
  const diffRemDays = Math.abs(diffDays) % 7;
  const diffMonths = (d2.getFullYear()-d1.getFullYear())*12 + d2.getMonth()-d1.getMonth();
  const diffYears = d2.getFullYear()-d1.getFullYear();

  const bd = new Date(baseDate + "T00:00:00");
  const resultDate = new Date(bd.getTime() + addDays * 24*60*60*1000);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">日時計算</h1>
      <p className="text-gray-500 text-sm mb-6">日付の差分計算や日数の加算・減算。締め切り管理や経過日数の確認に。</p>
      <AdBanner />
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab("diff")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab==="diff"?"bg-blue-600 text-white":"bg-white border border-gray-300"}`}>日数差分</button>
        <button onClick={() => setTab("add")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab==="add"?"bg-blue-600 text-white":"bg-white border border-gray-300"}`}>日付加算</button>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        {tab === "diff" ? (<>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">開始日</label><input type="date" value={date1} onChange={e=>setDate1(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">終了日</label><input type="date" value={date2} onChange={e=>setDate2(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" /></div>
          </div>
          {!isNaN(d1.getTime()) && !isNaN(d2.getTime()) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="text-3xl font-bold text-blue-700 text-center">{Math.abs(diffDays).toLocaleString()}日{diffDays < 0 ? "（過去）" : diffDays > 0 ? "（未来）" : "（同日）"}</div>
              <div className="grid grid-cols-3 gap-3 text-center text-sm">
                <div className="bg-white rounded-lg p-2"><div className="font-bold text-gray-800">{diffWeeks}週{diffRemDays > 0 ? ` ${diffRemDays}日` : ""}</div><div className="text-xs text-gray-500">週換算</div></div>
                <div className="bg-white rounded-lg p-2"><div className="font-bold text-gray-800">約{Math.abs(diffMonths)}ヶ月</div><div className="text-xs text-gray-500">月換算</div></div>
                <div className="bg-white rounded-lg p-2"><div className="font-bold text-gray-800">約{Math.abs(diffYears)}年{Math.abs(diffMonths%12)}ヶ月</div><div className="text-xs text-gray-500">年換算</div></div>
              </div>
              <div className="text-xs text-gray-500 text-center">{date1}（{DOW[d1.getDay()]}）〜 {date2}（{DOW[d2.getDay()]}）</div>
            </div>
          )}
        </>) : (<>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">基準日</label><input type="date" value={baseDate} onChange={e=>setBaseDate(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg" /></div>
            <div><label className="text-sm font-medium text-gray-700 mb-1 block">加算日数（マイナスで減算）</label><input type="number" value={addDays} onChange={e=>setAddDays(Number(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg" /></div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[7,14,30,60,90,180,365].map(d=>(
              <button key={d} onClick={()=>setAddDays(d)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700">+{d}日</button>
            ))}
          </div>
          {!isNaN(bd.getTime()) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <div className="text-sm text-green-700">結果</div>
              <div className="text-3xl font-bold text-green-800">{formatDate(resultDate)}（{DOW[resultDate.getDay()]}曜日）</div>
              <div className="text-xs text-gray-500 mt-1">{baseDate} {addDays >= 0 ? `+ ${addDays}` : `- ${Math.abs(addDays)}`}日</div>
            </div>
          )}
        </>)}
      </div>
      <ToolFAQ faqs={[
        { question: "営業日（平日）だけの計算はできますか？", answer: "現在は暦日（カレンダー上の日数）での計算です。営業日計算機能は今後追加予定です。土日を除く場合は、週数×5で概算できます。" },
        { question: "日付の差分計算はどのように行われますか？", answer: "開始日から終了日までのミリ秒差を計算し、1日（86,400,000ミリ秒）で割って日数を算出しています。うるう年も正しく考慮されます。" },
        { question: "過去の日付も計算できますか？", answer: "はい、過去の日付も指定可能です。日数差分では過去方向の場合はマイナスで表示されます。日付加算でもマイナス値を入力すれば減算できます。" },
      ]} />
      <AdBanner />
      <RelatedTools currentToolId="timestamp-calc" />
    </div>
  );
}
