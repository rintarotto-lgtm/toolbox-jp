"use client";
import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

interface ShoeSizeData {
  jp: number;
  mensUS: number;
  mensUK: number;
  eu: number;
  ladiesUS: number;
  ladiesUK: number;
}

const SHOE_SIZES: ShoeSizeData[] = [
  { jp: 22.0, mensUS: 4.5, mensUK: 3.5, eu: 35, ladiesUS: 5.5, ladiesUK: 3.5 },
  { jp: 22.5, mensUS: 5.0, mensUK: 4.0, eu: 36, ladiesUS: 6.0, ladiesUK: 4.0 },
  { jp: 23.0, mensUS: 5.5, mensUK: 4.5, eu: 36, ladiesUS: 6.5, ladiesUK: 4.5 },
  { jp: 23.5, mensUS: 6.0, mensUK: 5.0, eu: 37, ladiesUS: 7.0, ladiesUK: 5.0 },
  { jp: 24.0, mensUS: 6.5, mensUK: 5.5, eu: 38, ladiesUS: 7.5, ladiesUK: 5.5 },
  { jp: 24.5, mensUS: 7.0, mensUK: 6.0, eu: 38, ladiesUS: 8.0, ladiesUK: 6.0 },
  { jp: 25.0, mensUS: 7.5, mensUK: 6.5, eu: 39, ladiesUS: 8.5, ladiesUK: 6.5 },
  { jp: 25.5, mensUS: 8.0, mensUK: 7.0, eu: 40, ladiesUS: 9.0, ladiesUK: 7.0 },
  { jp: 26.0, mensUS: 8.5, mensUK: 7.5, eu: 40, ladiesUS: 9.5, ladiesUK: 7.5 },
  { jp: 26.5, mensUS: 9.0, mensUK: 8.0, eu: 41, ladiesUS: 10.0, ladiesUK: 8.0 },
  { jp: 27.0, mensUS: 9.5, mensUK: 8.5, eu: 42, ladiesUS: 10.5, ladiesUK: 8.5 },
  { jp: 27.5, mensUS: 10.0, mensUK: 9.0, eu: 43, ladiesUS: 11.0, ladiesUK: 9.0 },
  { jp: 28.0, mensUS: 10.5, mensUK: 9.5, eu: 43, ladiesUS: 11.5, ladiesUK: 9.5 },
  { jp: 28.5, mensUS: 11.0, mensUK: 10.0, eu: 44, ladiesUS: 12.0, ladiesUK: 10.0 },
  { jp: 29.0, mensUS: 11.5, mensUK: 10.5, eu: 45, ladiesUS: 12.5, ladiesUK: 10.5 },
  { jp: 29.5, mensUS: 12.0, mensUK: 11.0, eu: 45, ladiesUS: 13.0, ladiesUK: 11.0 },
  { jp: 30.0, mensUS: 13.0, mensUK: 12.0, eu: 46, ladiesUS: 14.0, ladiesUK: 12.0 },
];

type InputType = "jp" | "mensUS" | "ladiesUS" | "eu";

export default function ShoeSizeConvPage() {
  const [inputType, setInputType] = useState<InputType>("jp");
  const [gender, setGender] = useState<"mens" | "ladies">("mens");
  const [inputValue, setInputValue] = useState("");

  const result = useMemo((): ShoeSizeData | null => {
    const v = parseFloat(inputValue);
    if (!v) return null;

    if (inputType === "jp") {
      return SHOE_SIZES.find((s) => s.jp === v) ||
        SHOE_SIZES.reduce((prev, curr) =>
          Math.abs(curr.jp - v) < Math.abs(prev.jp - v) ? curr : prev
        );
    } else if (inputType === "mensUS") {
      return SHOE_SIZES.find((s) => s.mensUS === v) ||
        SHOE_SIZES.reduce((prev, curr) =>
          Math.abs(curr.mensUS - v) < Math.abs(prev.mensUS - v) ? curr : prev
        );
    } else if (inputType === "ladiesUS") {
      return SHOE_SIZES.find((s) => s.ladiesUS === v) ||
        SHOE_SIZES.reduce((prev, curr) =>
          Math.abs(curr.ladiesUS - v) < Math.abs(prev.ladiesUS - v) ? curr : prev
        );
    } else if (inputType === "eu") {
      return SHOE_SIZES.find((s) => s.eu === v) ||
        SHOE_SIZES.reduce((prev, curr) =>
          Math.abs(curr.eu - v) < Math.abs(prev.eu - v) ? curr : prev
        );
    }
    return null;
  }, [inputValue, inputType]);

  const inputLabels: Record<InputType, string> = {
    jp: "日本サイズ (cm)",
    mensUS: "US メンズ",
    ladiesUS: "US レディース",
    eu: "EUサイズ",
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">靴サイズ変換</h1>
      <p className="text-gray-600 mb-6">日本・US・UK・EUの靴サイズを相互変換します。海外通販や旅行に便利です。</p>

      <AdBanner />

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">入力するサイズ規格</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(inputLabels) as InputType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setInputType(t); setInputValue(""); }}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${inputType === t ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}
              >
                {inputLabels[t]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{inputLabels[inputType]}</label>
          <input
            type="number"
            step="0.5"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputType === "jp" ? "例: 25.5" : "例: 8"}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {result && (
        <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">変換結果</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">日本サイズ</p>
              <p className="text-3xl font-bold text-blue-600">{result.jp}<span className="text-sm">cm</span></p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">EUサイズ</p>
              <p className="text-3xl font-bold text-green-600">{result.eu}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">US メンズ</p>
              <p className="text-3xl font-bold text-gray-700">{result.mensUS}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">UK メンズ</p>
              <p className="text-3xl font-bold text-gray-700">{result.mensUK}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">US レディース</p>
              <p className="text-3xl font-bold text-pink-600">{result.ladiesUS}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">UK レディース</p>
              <p className="text-3xl font-bold text-pink-600">{result.ladiesUK}</p>
            </div>
          </div>
        </div>
      )}

      <AdBanner />

      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-3">靴サイズ早見表（メンズ）</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm min-w-max">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 font-medium text-gray-700">日本(cm)</th>
                <th className="px-3 py-2 font-medium text-gray-700">US</th>
                <th className="px-3 py-2 font-medium text-gray-700">UK</th>
                <th className="px-3 py-2 font-medium text-gray-700">EU</th>
              </tr>
            </thead>
            <tbody>
              {SHOE_SIZES.filter(s => s.jp >= 24 && s.jp <= 29).map((s) => (
                <tr key={s.jp} className="border-t border-gray-100 hover:bg-blue-50">
                  <td className="px-3 py-2 text-center font-medium text-blue-600">{s.jp}</td>
                  <td className="px-3 py-2 text-center">{s.mensUS}</td>
                  <td className="px-3 py-2 text-center">{s.mensUK}</td>
                  <td className="px-3 py-2 text-center">{s.eu}</td>
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
            <h3 className="font-medium text-gray-900">日本の25cmはUSでいくつ？</h3>
            <p className="text-sm text-gray-600 mt-1">メンズはUS 7.5（UK 6.5、EU 39）、レディースはUS 8.5（UK 6.5、EU 39）に相当します。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">海外通販の靴サイズ選び方は？</h3>
            <p className="text-sm text-gray-600 mt-1">足の長さをcmで計測し、変換表で確認しましょう。ナイキなど一部ブランドはハーフサイズ大きめを選ぶと快適です。</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">メンズとレディースでUSサイズが違う理由は？</h3>
            <p className="text-sm text-gray-600 mt-1">アメリカの靴サイズはメンズとレディースで基準が異なります。同じ足の長さでもレディースはメンズより約1.5サイズ大きい数字になります。</p>
          </div>
        </div>
      </div>

      <RelatedTools currentToolId="shoe-size-conv" />
    </main>
  );
}
