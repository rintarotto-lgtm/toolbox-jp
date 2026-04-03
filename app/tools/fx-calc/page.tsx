"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

type Direction = "jpy-to-foreign" | "foreign-to-jpy";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // 1単位あたりの円（参考レート）
}

const currencies: Currency[] = [
  { code: "USD", name: "米ドル", symbol: "$", rate: 150 },
  { code: "EUR", name: "ユーロ", symbol: "€", rate: 163 },
  { code: "GBP", name: "英ポンド", symbol: "£", rate: 190 },
  { code: "AUD", name: "豪ドル", symbol: "A$", rate: 98 },
  { code: "CAD", name: "カナダドル", symbol: "C$", rate: 110 },
  { code: "CHF", name: "スイスフラン", symbol: "CHF", rate: 167 },
  { code: "CNY", name: "中国元", symbol: "¥", rate: 21 },
  { code: "KRW", name: "韓国ウォン", symbol: "₩", rate: 0.11 },
  { code: "THB", name: "タイバーツ", symbol: "฿", rate: 4.3 },
  { code: "SGD", name: "シンガポールドル", symbol: "S$", rate: 112 },
];

interface ExchangeMethod {
  id: string;
  name: string;
  description: string;
  calcFee: (amount: number, rate: number) => { spread: number; fixedFee: number };
}

const exchangeMethods: ExchangeMethod[] = [
  {
    id: "bank",
    name: "銀行窓口",
    description: "レート+3円/単位",
    calcFee: (_amount, _rate) => ({ spread: 3, fixedFee: 0 }),
  },
  {
    id: "airport",
    name: "空港両替",
    description: "レート+5円/単位",
    calcFee: (_amount, _rate) => ({ spread: 5, fixedFee: 0 }),
  },
  {
    id: "convenience",
    name: "コンビニATM",
    description: "レート+3円/単位+手数料110円",
    calcFee: (_amount, _rate) => ({ spread: 3, fixedFee: 110 }),
  },
  {
    id: "credit",
    name: "クレジットカード",
    description: "レート+2%",
    calcFee: (amount, rate) => ({ spread: rate * 0.02, fixedFee: 0 }),
  },
  {
    id: "overseas_atm",
    name: "海外ATM",
    description: "レート+3%+手数料220円",
    calcFee: (amount, rate) => ({ spread: rate * 0.03, fixedFee: 220 }),
  },
];

function fmt(n: number, digits = 2): string {
  if (isNaN(n)) return "–";
  return n.toLocaleString("ja-JP", { maximumFractionDigits: digits, minimumFractionDigits: digits });
}

function fmtInt(n: number): string {
  if (isNaN(n)) return "–";
  return Math.round(n).toLocaleString("ja-JP");
}

export default function FxCalc() {
  const [direction, setDirection] = useState<Direction>("jpy-to-foreign");
  const [currencyCode, setCurrencyCode] = useState("USD");
  const [amount, setAmount] = useState("10000");
  const [customRate, setCustomRate] = useState("");
  const [methodId, setMethodId] = useState("bank");

  const currency = currencies.find((c) => c.code === currencyCode)!;

  const baseRate = customRate !== "" && !isNaN(parseFloat(customRate))
    ? parseFloat(customRate)
    : currency.rate;

  const selectedMethod = exchangeMethods.find((m) => m.id === methodId)!;
  const inputAmount = parseFloat(amount) || 0;

  const { spread, fixedFee } = useMemo(
    () => selectedMethod.calcFee(inputAmount, baseRate),
    [selectedMethod, inputAmount, baseRate]
  );

  // 実質レート（円→外貨の場合: より不利なレート）
  const effectiveRate = baseRate + spread;

  const result = useMemo(() => {
    if (inputAmount <= 0) return null;
    if (direction === "jpy-to-foreign") {
      // 円を外貨に換える
      const foreignAmount = (inputAmount - fixedFee) / effectiveRate;
      const totalFee = inputAmount - foreignAmount * baseRate;
      return {
        received: foreignAmount,
        effectiveRate,
        totalFee,
        unit: currency.code,
      };
    } else {
      // 外貨を円に換える
      const jpyAmount = inputAmount * (baseRate - spread) - fixedFee;
      const totalFee = inputAmount * baseRate - jpyAmount;
      return {
        received: jpyAmount,
        effectiveRate: baseRate - spread,
        totalFee,
        unit: "JPY",
      };
    }
  }, [direction, inputAmount, effectiveRate, baseRate, spread, fixedFee, currency]);

  // 全方法比較
  const comparison = useMemo(() => {
    return exchangeMethods.map((m) => {
      const { spread: s, fixedFee: f } = m.calcFee(inputAmount, baseRate);
      const effRate = baseRate + s;
      if (direction === "jpy-to-foreign") {
        const received = (inputAmount - f) / effRate;
        const fee = inputAmount - received * baseRate;
        return { method: m, received, fee, effectiveRate: effRate };
      } else {
        const received = inputAmount * (baseRate - s) - f;
        const fee = inputAmount * baseRate - received;
        return { method: m, received, fee, effectiveRate: baseRate - s };
      }
    });
  }, [direction, inputAmount, baseRate]);

  const bestMethod = comparison.reduce((best, cur) => cur.received > best.received ? cur : best, comparison[0]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 mb-6 text-white">
        <div className="text-4xl mb-2">💱</div>
        <h1 className="text-2xl font-bold mb-1">外貨両替・為替計算</h1>
        <p className="text-green-100 text-sm">
          手数料込みの実質レートで両替コストを比較。海外旅行の費用シミュレーションに。
        </p>
      </div>

      <AdBanner />

      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 mt-6">
        {/* Direction tabs */}
        <div className="flex gap-2">
          {(["jpy-to-foreign", "foreign-to-jpy"] as Direction[]).map((d) => (
            <button
              key={d}
              onClick={() => setDirection(d)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                direction === d
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {d === "jpy-to-foreign" ? "円 → 外貨" : "外貨 → 円"}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">通貨</label>
            <select
              value={currencyCode}
              onChange={(e) => {
                setCurrencyCode(e.target.value);
                setCustomRate("");
              }}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} – {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {direction === "jpy-to-foreign" ? "両替する円" : `両替する${currency.code}`}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="金額を入力"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              為替レート（参考値: 1{currency.code} = {currency.rate}円）
            </label>
            <input
              type="number"
              value={customRate}
              onChange={(e) => setCustomRate(e.target.value)}
              placeholder={`${currency.rate}`}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              ※参考レートです。実際のレートは金融機関でご確認ください。
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">両替方法</label>
            <select
              value={methodId}
              onChange={(e) => setMethodId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            >
              {exchangeMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}（{m.description}）
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result cards */}
        {result && inputAmount > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-xs text-green-700 font-medium mb-1">受取金額</p>
                <p className="text-xl font-bold text-green-800">
                  {direction === "jpy-to-foreign"
                    ? `${fmt(result.received, 2)} ${result.unit}`
                    : `${fmtInt(result.received)} 円`}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-600 font-medium mb-1">実質レート</p>
                <p className="text-xl font-bold text-gray-800">
                  {fmt(result.effectiveRate, 2)}円
                </p>
                <p className="text-xs text-gray-400">（中値 {fmt(baseRate, 2)}円）</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-xs text-red-600 font-medium mb-1">手数料相当額</p>
                <p className="text-xl font-bold text-red-700">
                  {fmtInt(result.totalFee)} 円
                </p>
              </div>
            </div>

            {/* 旅行予算換算 */}
            {direction === "jpy-to-foreign" && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-sm font-medium text-emerald-800 mb-2">旅行費用の目安</p>
                <div className="grid grid-cols-3 gap-3 text-center text-xs text-emerald-700">
                  <div>
                    <p className="text-lg font-bold">{fmt(result.received / 50, 1)}</p>
                    <p>泊（1泊{fmt(50, 0)}{currency.code}のホテル）</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{fmt(result.received / 15, 1)}</p>
                    <p>食事分（1食{fmt(15, 0)}{currency.code}目安）</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{fmt(result.received / 3, 1)}</p>
                    <p>交通費（1回{fmt(3, 0)}{currency.code}目安）</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 両替方法別比較テーブル */}
      {inputAmount > 0 && (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 mb-4">両替方法の比較</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 pr-4 font-medium text-gray-600">両替方法</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-600">実質レート</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-600">受取金額</th>
                  <th className="text-right py-2 pl-2 font-medium text-gray-600">手数料相当</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => {
                  const isBest = row.method.id === bestMethod.method.id;
                  const isSelected = row.method.id === methodId;
                  return (
                    <tr
                      key={row.method.id}
                      className={`border-b border-gray-100 ${
                        isBest ? "bg-green-50" : isSelected ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="py-2 pr-4 font-medium text-gray-800">
                        {row.method.name}
                        {isBest && (
                          <span className="ml-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                            最安
                          </span>
                        )}
                      </td>
                      <td className="text-right py-2 px-2 font-mono text-gray-700">
                        {fmt(row.effectiveRate, 2)}円
                      </td>
                      <td className="text-right py-2 px-2 font-mono text-gray-800 font-medium">
                        {direction === "jpy-to-foreign"
                          ? `${fmt(row.received, 2)} ${currencyCode}`
                          : `${fmtInt(row.received)} 円`}
                      </td>
                      <td className="text-right py-2 pl-2 font-mono text-red-600">
                        {fmtInt(row.fee)} 円
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdBanner />

      <section className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          通貨・金額・為替レート・両替方法を選択すると、手数料込みの実質コストを自動計算します。
          為替レートは参考値として設定していますが、実際のレートに変更してご利用いただけます。
          各両替方法の比較表で、もっともお得な選択肢を確認できます。
        </p>
        <p className="text-xs text-gray-400 mt-3 p-3 bg-gray-50 rounded-lg">
          ※掲載のレートは参考値であり、実際の為替レートや手数料は金融機関・日時によって異なります。
          重要な取引の際は必ず各金融機関の公式情報をご確認ください。投資・資産運用の参考にはなりません。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "空港での両替と銀行での両替どちらがお得ですか？",
            answer:
              "一般的に銀行・郵便局での両替の方が手数料が低いことが多いです。空港は便利ですが手数料が高め。現地ATMはカード手数料がかかりますが、為替レートが有利な場合もあります。",
          },
          {
            question: "為替手数料とはなんですか？",
            answer:
              "銀行や両替所が外貨を売買する際に上乗せする手数料です。TTSレート（対顧客電信売相場）から中値（TTM）を引いた差分が実質的な手数料です。通常1ドルあたり1〜3円程度です。",
          },
          {
            question: "クレジットカードでの海外決済と現金両替どちらがお得ですか？",
            answer:
              "クレジットカードの海外決済手数料は1.6〜2.5%程度が多く、現地通貨建てで決済すれば有利なことが多いです。ただし不正利用のリスクや使えない場面も考慮が必要です。",
          },
          {
            question: "海外旅行の現金はどのくらい持っていくべきですか？",
            answer:
              "カードが使える国では最低限の現金（緊急用3〜5万円相当）を持ち、メインはカードを活用するのが安全です。カードが使いにくい国・地域では多めに現金を用意しましょう。",
          },
        ]}
      />

      <RelatedTools currentToolId="fx-calc" />
    </div>
  );
}
