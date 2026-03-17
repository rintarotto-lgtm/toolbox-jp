"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

function toWareki(year: number, month: number, day: number): string {
  const date = new Date(year, month - 1, day);
  if (date >= new Date(2019, 4, 1)) {
    return `令和${year - 2018 === 1 ? "元" : year - 2018}年`;
  }
  if (date >= new Date(1989, 0, 8)) {
    return `平成${year - 1988 === 1 ? "元" : year - 1988}年`;
  }
  if (date >= new Date(1926, 11, 25)) {
    return `昭和${year - 1925 === 1 ? "元" : year - 1925}年`;
  }
  if (date >= new Date(1912, 6, 30)) {
    return `大正${year - 1911 === 1 ? "元" : year - 1911}年`;
  }
  return `明治${year - 1867 === 1 ? "元" : year - 1867}年`;
}

function calcAge(birthDate: Date, today: Date) {
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

export default function AgeCalc() {
  const [birthStr, setBirthStr] = useState("");

  const result = useMemo(() => {
    if (!birthStr) return null;
    const birth = new Date(birthStr);
    if (isNaN(birth.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birth > today) return null;

    const age = calcAge(birth, today);
    const diffMs = today.getTime() - birth.getTime();
    const daysLived = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Next birthday
    let nextBirthday = new Date(
      today.getFullYear(),
      birth.getMonth(),
      birth.getDate()
    );
    if (nextBirthday <= today) {
      nextBirthday = new Date(
        today.getFullYear() + 1,
        birth.getMonth(),
        birth.getDate()
      );
    }
    const daysUntilBirthday = Math.ceil(
      (nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    const wareki = toWareki(
      birth.getFullYear(),
      birth.getMonth() + 1,
      birth.getDate()
    );

    // Zodiac (干支)
    const eto = [
      "子（ねずみ）",
      "丑（うし）",
      "寅（とら）",
      "卯（うさぎ）",
      "辰（たつ）",
      "巳（へび）",
      "午（うま）",
      "未（ひつじ）",
      "申（さる）",
      "酉（とり）",
      "戌（いぬ）",
      "亥（いのしし）",
    ];
    const etoIndex = (birth.getFullYear() - 4) % 12;
    const etoStr = eto[etoIndex >= 0 ? etoIndex : etoIndex + 12];

    return {
      age,
      daysLived,
      daysUntilBirthday,
      wareki,
      etoStr,
      birthDate: birth,
    };
  }, [birthStr]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-2">年齢計算</h1>
      <p className="text-gray-500 text-sm mb-6">
        生年月日から現在の年齢、生まれてからの日数、次の誕生日までのカウントダウンを計算します。
      </p>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            生年月日を入力
          </label>
          <input
            type="date"
            value={birthStr}
            onChange={(e) => setBirthStr(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="w-full sm:w-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {result && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.age.years}
                </div>
                <div className="text-xs text-gray-500 mt-1">歳</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-gray-800">
                  {result.age.years}年{result.age.months}ヶ月{result.age.days}日
                </div>
                <div className="text-xs text-gray-500 mt-1">詳細な年齢</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-gray-800">
                  {result.daysLived.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  生まれてからの日数
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                <div className="text-xl font-bold text-orange-600">
                  あと{result.daysUntilBirthday}日
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  次の誕生日まで
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-gray-800">
                  {result.wareki}
                </div>
                <div className="text-xs text-gray-500 mt-1">和暦</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-lg font-bold text-gray-800">
                  {result.etoStr}
                </div>
                <div className="text-xs text-gray-500 mt-1">干支</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                その他の情報
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  生まれてからの時間:{" "}
                  <span className="font-medium">
                    約{(result.daysLived * 24).toLocaleString()}時間
                  </span>
                </div>
                <div>
                  生まれてからの週数:{" "}
                  <span className="font-medium">
                    {Math.floor(result.daysLived / 7).toLocaleString()}週
                  </span>
                </div>
                <div>
                  生まれてからの月数:{" "}
                  <span className="font-medium">
                    約{result.age.years * 12 + result.age.months}ヶ月
                  </span>
                </div>
                <div>
                  西暦:{" "}
                  <span className="font-medium">
                    {result.birthDate.getFullYear()}年
                    {result.birthDate.getMonth() + 1}月
                    {result.birthDate.getDate()}日生まれ
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">年齢計算ツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          生年月日を入力すると、現在の年齢（年・月・日）、生まれてからの日数、次の誕生日までのカウントダウンがリアルタイムで表示されます。
          和暦（令和・平成・昭和・大正・明治）や干支の表示にも対応しています。
          保険や公的書類の年齢確認、記念日の計算などにご活用ください。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "年齢の計算はどのように行われますか？",
            answer:
              "日本の法律（年齢計算に関する法律）に基づき、誕生日の前日に加齢する方式で計算しています。現在の日付と生年月日の差分から正確な年・月・日を算出します。",
          },
          {
            question: "和暦はどの年号に対応していますか？",
            answer:
              "令和（2019年5月1日〜）、平成（1989年1月8日〜）、昭和（1926年12月25日〜）、大正（1912年7月30日〜）、明治に対応しています。",
          },
          {
            question: "入力したデータはサーバーに送信されますか？",
            answer:
              "いいえ。このツールは全てブラウザ上で動作するため、入力した生年月日がサーバーに送信されることは一切ありません。安心してご利用ください。",
          },
        ]}
      />

      <RelatedTools currentToolId="age-calc" />
    </div>
  );
}
