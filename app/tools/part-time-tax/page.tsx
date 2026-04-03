"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 壁の閾値
const WALLS = [
  { amount: 1_030_000, label: "103万円の壁", color: "bg-green-500" },
  { amount: 1_060_000, label: "106万円の壁", color: "bg-yellow-400" },
  { amount: 1_300_000, label: "130万円の壁", color: "bg-orange-500" },
  { amount: 1_500_000, label: "150万円の壁", color: "bg-red-400" },
  { amount: 2_010_000, label: "201万円の壁", color: "bg-gray-400" },
];

// ─── 壁ゾーン情報
function getWallZone(annual: number, hasSpouse: boolean, isStudent: boolean) {
  if (annual <= 1_030_000) {
    return {
      color: "bg-green-100 border-green-400 text-green-800",
      dot: "🟢",
      label: "所得税なし・扶養内",
      message: isStudent
        ? "学生：勤労学生控除あり。年収130万まで所得税0円。"
        : "所得税がかかりません。配偶者の扶養内です。",
    };
  }
  if (annual <= 1_060_000) {
    return {
      color: "bg-yellow-100 border-yellow-400 text-yellow-800",
      dot: "🟡",
      label: "所得税あり",
      message: "103万円を超えたため所得税が発生します。扶養は継続可能です。",
    };
  }
  if (annual <= 1_300_000) {
    return {
      color: "bg-orange-100 border-orange-400 text-orange-800",
      dot: "🟠",
      label: "要確認ゾーン",
      message:
        "企業規模によっては社会保険加入が必要です。130万円未満なら社会保険上の扶養は継続可能。",
    };
  }
  if (annual <= 1_500_000) {
    return {
      color: "bg-red-100 border-red-400 text-red-800",
      dot: "🔴",
      label: "社会保険加入・手取り減少ゾーン",
      message:
        "扶養から外れ、健康保険・年金を自己負担（約20万円/年）します。手取りが減る可能性があります。",
    };
  }
  if (annual <= 2_010_000 && hasSpouse) {
    return {
      color: "bg-yellow-100 border-yellow-400 text-yellow-800",
      dot: "🟡",
      label: "配偶者特別控除あり",
      message:
        "配偶者特別控除が適用されます（段階的に控除額が減少）。201万円を超えると控除がなくなります。",
    };
  }
  return {
    color: "bg-gray-100 border-gray-400 text-gray-700",
    dot: "⚫",
    label: "配偶者控除なし",
    message: "配偶者控除は適用されません。",
  };
}

// ─── 所得税計算（給与所得）
function calcIncomeTax(annual: number, isStudent: boolean): number {
  // 給与所得控除
  let kyuyoKojo: number;
  if (annual <= 1_625_000) kyuyoKojo = 550_000;
  else if (annual <= 1_800_000) kyuyoKojo = annual * 0.4 - 100_000;
  else if (annual <= 3_600_000) kyuyoKojo = annual * 0.3 + 80_000;
  else if (annual <= 6_600_000) kyuyoKojo = annual * 0.2 + 440_000;
  else if (annual <= 8_500_000) kyuyoKojo = annual * 0.1 + 1_100_000;
  else kyuyoKojo = 1_950_000;

  const kyuyoShotoku = Math.max(0, annual - kyuyoKojo);
  const kisoKojo = 480_000;
  const studentKojo = isStudent ? 270_000 : 0;
  const taxableIncome = Math.max(
    0,
    kyuyoShotoku - kisoKojo - studentKojo
  );

  // 課税所得に対する所得税率（簡易）
  let tax = 0;
  if (taxableIncome <= 1_950_000) tax = taxableIncome * 0.05;
  else if (taxableIncome <= 3_300_000)
    tax = taxableIncome * 0.1 - 97_500;
  else if (taxableIncome <= 6_950_000)
    tax = taxableIncome * 0.2 - 427_500;
  else tax = taxableIncome * 0.23 - 636_000;

  return Math.max(0, Math.round(tax * 1.021)); // 復興特別所得税込
}

// ─── 住民税計算（簡易）
function calcResidentTax(annual: number): number {
  if (annual <= 1_000_000) return 0;
  let kyuyoKojo: number;
  if (annual <= 1_625_000) kyuyoKojo = 550_000;
  else if (annual <= 1_800_000) kyuyoKojo = annual * 0.4 - 100_000;
  else kyuyoKojo = annual * 0.3 + 80_000;
  const shotoku = Math.max(0, annual - kyuyoKojo);
  const kojo = 430_000;
  const taxable = Math.max(0, shotoku - kojo);
  return Math.max(0, Math.round(taxable * 0.1 + 5_000));
}

const FAQS = [
  {
    question: "103万円の壁とは何ですか？",
    answer:
      "年収103万円以下なら所得税がかかりません（給与所得控除55万+基礎控除48万=103万円）。また配偶者が会社員の場合、被扶養者として健康保険・年金の保険料を支払わずに済みます。",
  },
  {
    question: "130万円の壁とは何ですか？",
    answer:
      "年収130万円以上になると、扶養から外れて自分で健康保険と国民年金（約20万円/年）を支払う必要が生じます。130万円を少し超えると手取りが減る逆転現象が起きることがあります。",
  },
  {
    question: "2024年の「年収の壁」対策はどうなりましたか？",
    answer:
      "2024年10月から従業員51人以上の企業に勤める短時間労働者は、週20時間以上・月額8.8万円以上・2ヶ月超の雇用見込みがある場合に社会保険加入が必要になりました。",
  },
  {
    question: "学生アルバイトの場合、税金はどうなりますか？",
    answer:
      "勤労学生控除（27万円）を申請すれば年収130万円まで所得税がかかりません。親の扶養控除は年収103万円以下で一般扶養控除（38万円）、103万円超で段階的に減少します。",
  },
];

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString("ja-JP")}`;
}

type InputMode = "hourly" | "annual";
type CompanySize = "small" | "mid" | "large";

export default function PartTimeTax() {
  const [inputMode, setInputMode] = useState<InputMode>("hourly");
  const [hourlyWage, setHourlyWage] = useState(1_100);
  const [weeklyHours, setWeeklyHours] = useState(20);
  const [annualInput, setAnnualInput] = useState(1_200_000);
  const [hasSpouse, setHasSpouse] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [companySize, setCompanySize] = useState<CompanySize>("small");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // 年収を計算
  const annual = useMemo(() => {
    if (inputMode === "hourly") {
      return Math.round(hourlyWage * weeklyHours * 52);
    }
    return annualInput;
  }, [inputMode, hourlyWage, weeklyHours, annualInput]);

  const monthly = Math.round(annual / 12);

  // 社会保険加入判定
  const needsSocialInsurance = useMemo(() => {
    if (annual >= 1_300_000) return true;
    if (companySize === "large" && annual >= 1_056_000) return true; // 8.8万×12
    if (companySize === "mid" && annual >= 1_056_000) return true;
    return false;
  }, [annual, companySize]);

  const socialInsurance = needsSocialInsurance ? 200_000 : 0; // 概算20万円/年

  const incomeTax = calcIncomeTax(annual, isStudent);
  const residentTax = calcResidentTax(annual);
  const totalDeduction = incomeTax + residentTax + socialInsurance;
  const netAnnual = annual - totalDeduction;
  const netMonthly = Math.round(netAnnual / 12);

  const zone = getWallZone(annual, hasSpouse, isStudent);

  // 次の壁まであと何円
  const nextWall = WALLS.find((w) => w.amount > annual);
  const remainToWall = nextWall ? nextWall.amount - annual : null;

  // 壁バーの幅計算（最大201万円を100%とする）
  const barPct = Math.min((annual / 2_010_000) * 100, 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── ヘッダー ─── */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">💰</span>
          <div>
            <h1 className="text-2xl font-extrabold">
              アルバイト・パート収入計算
            </h1>
            <p className="text-sm opacity-90">
              103万・130万の壁と手取りをシミュレーション
            </p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-5">
        {/* 入力方法切替 */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200">
          {(
            [
              { key: "hourly", label: "時給・労働時間で入力" },
              { key: "annual", label: "年収を直接入力" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setInputMode(key)}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                inputMode === key
                  ? "bg-rose-500 text-white"
                  : "bg-white text-gray-600 hover:bg-rose-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {inputMode === "hourly" ? (
          <>
            {/* 時給 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                時給（円）
              </label>
              <input
                type="number"
                min={900}
                max={5000}
                value={hourlyWage}
                onChange={(e) => setHourlyWage(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
            {/* 週の労働時間 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                週の労働時間: {weeklyHours}時間
              </label>
              <input
                type="range"
                min={1}
                max={40}
                step={1}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full h-3 rounded-full appearance-none cursor-pointer accent-rose-500 bg-gradient-to-r from-rose-100 to-rose-400"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>1h</span>
                <span>10h</span>
                <span>20h</span>
                <span>30h</span>
                <span>40h</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-center">
                <div className="bg-rose-50 rounded-lg py-1.5">
                  <p className="text-xs text-gray-500">月収（概算）</p>
                  <p className="text-sm font-bold text-rose-700">
                    {Math.round(
                      (hourlyWage * weeklyHours * 52) / 12
                    ).toLocaleString("ja-JP")}
                    円
                  </p>
                </div>
                <div className="bg-rose-50 rounded-lg py-1.5">
                  <p className="text-xs text-gray-500">年収（概算）</p>
                  <p className="text-sm font-bold text-rose-700">
                    {annual.toLocaleString("ja-JP")}円
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              年収（円）
            </label>
            <input
              type="number"
              min={0}
              value={annualInput}
              onChange={(e) => setAnnualInput(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-right text-lg font-bold focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
        )}

        {/* オプション */}
        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <input
              type="checkbox"
              checked={hasSpouse}
              onChange={(e) => setHasSpouse(e.target.checked)}
              className="w-4 h-4 accent-rose-500"
            />
            <span className="text-sm font-medium text-gray-700">
              配偶者あり
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
            <input
              type="checkbox"
              checked={isStudent}
              onChange={(e) => setIsStudent(e.target.checked)}
              className="w-4 h-4 accent-rose-500"
            />
            <span className="text-sm font-medium text-gray-700">学生</span>
          </label>
        </div>

        {/* 企業規模 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            企業規模（社会保険加入要件）
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { key: "small", label: "50人以下", sub: "社保任意" },
                { key: "mid", label: "51〜100人", sub: "要件あり" },
                { key: "large", label: "101人以上", sub: "要件あり" },
              ] as const
            ).map(({ key, label, sub }) => (
              <button
                key={key}
                onClick={() => setCompanySize(key)}
                className={`py-2 rounded-xl border text-center transition-colors ${
                  companySize === key
                    ? "bg-rose-500 text-white border-rose-500"
                    : "border-gray-200 text-gray-600 hover:bg-rose-50"
                }`}
              >
                <div className="text-sm font-bold">{label}</div>
                <div className="text-xs opacity-80">{sub}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── 壁インジケーター ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-3">
          年収の壁チェッカー
        </h2>
        {/* バー */}
        <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden mb-2">
          <div
            className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-500 transition-all duration-500 rounded-full"
            style={{ width: `${barPct}%` }}
          />
          {/* 壁マーカー */}
          {WALLS.map((w) => {
            const pct = (w.amount / 2_010_000) * 100;
            return (
              <div
                key={w.amount}
                className="absolute top-0 h-full w-0.5 bg-white/70"
                style={{ left: `${pct}%` }}
              />
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-3">
          <span>0円</span>
          <span>103万</span>
          <span>130万</span>
          <span>150万</span>
          <span>201万</span>
        </div>

        {/* ゾーン表示 */}
        <div
          className={`rounded-xl border px-4 py-3 ${zone.color}`}
        >
          <div className="flex items-center gap-2 font-bold text-sm mb-1">
            <span>{zone.dot}</span>
            <span>
              現在の年収: {annual.toLocaleString("ja-JP")}円 — {zone.label}
            </span>
          </div>
          <p className="text-xs leading-relaxed">{zone.message}</p>
        </div>

        {/* 次の壁まで */}
        {remainToWall !== null && (
          <div className="mt-3 text-center">
            <span className="inline-block bg-rose-100 text-rose-700 text-sm font-semibold px-4 py-2 rounded-full">
              次の壁「{nextWall?.label}」まで あと{" "}
              {remainToWall.toLocaleString("ja-JP")}円
            </span>
          </div>
        )}
      </div>

      {/* ─── 結果ヒーロー ─── */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90 mb-1">
          年間手取り推定額
        </p>
        <p className="text-5xl font-extrabold tracking-tight mb-1">
          {netAnnual < 0 ? "¥0" : formatYen(netAnnual)}
        </p>
        <p className="text-sm opacity-75 mb-4">
          月換算: {netMonthly < 0 ? "¥0" : formatYen(netMonthly)} / 月
        </p>
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/30 text-center">
          <div>
            <p className="text-xs opacity-75">年収（総支給）</p>
            <p className="text-xl font-bold">{formatYen(annual)}</p>
          </div>
          <div>
            <p className="text-xs opacity-75">控除合計</p>
            <p className="text-xl font-bold text-red-200">
              -{formatYen(totalDeduction)}
            </p>
          </div>
        </div>
      </div>

      {/* ─── 内訳カード ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-xs text-pink-600 mb-1 font-medium">所得税（概算）</p>
          <p className="text-2xl font-bold text-pink-800">
            {formatYen(incomeTax)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">復興特別所得税込</p>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center shadow-sm">
          <p className="text-xs text-rose-600 mb-1 font-medium">住民税（概算）</p>
          <p className="text-2xl font-bold text-rose-800">
            {formatYen(residentTax)}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">均等割含む</p>
        </div>
        <div
          className={`rounded-2xl p-4 text-center shadow-sm border ${
            needsSocialInsurance
              ? "bg-red-50 border-red-200"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <p
            className={`text-xs mb-1 font-medium ${
              needsSocialInsurance ? "text-red-600" : "text-gray-500"
            }`}
          >
            社会保険料
          </p>
          <p
            className={`text-2xl font-bold ${
              needsSocialInsurance ? "text-red-800" : "text-gray-400"
            }`}
          >
            {needsSocialInsurance ? formatYen(socialInsurance) : "対象外"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {needsSocialInsurance ? "健保＋年金 概算" : "扶養内 or 未加入"}
          </p>
        </div>
      </div>

      {/* 配偶者控除変化 */}
      {hasSpouse && (
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-3">
            配偶者控除の変化
          </h2>
          <div className="space-y-2 text-sm">
            {[
              { label: "〜103万円", ctrl: "配偶者控除 38万円" },
              { label: "103〜150万円", ctrl: "配偶者特別控除（段階的に減）" },
              { label: "150〜201万円", ctrl: "配偶者特別控除（少額）" },
              { label: "201万円〜", ctrl: "配偶者控除なし" },
            ].map(({ label, ctrl }) => {
              const limits = [1_030_000, 1_500_000, 2_010_000];
              let active = false;
              if (
                label.startsWith("〜103") &&
                annual <= 1_030_000
              )
                active = true;
              if (
                label.startsWith("103") &&
                annual > 1_030_000 &&
                annual <= 1_500_000
              )
                active = true;
              if (
                label.startsWith("150") &&
                annual > 1_500_000 &&
                annual <= 2_010_000
              )
                active = true;
              if (label.startsWith("201") && annual > 2_010_000)
                active = true;
              return (
                <div
                  key={label}
                  className={`flex justify-between rounded-lg px-3 py-2 ${
                    active
                      ? "bg-rose-50 border border-rose-200 font-semibold text-rose-800"
                      : "text-gray-500"
                  }`}
                >
                  <span>{label}</span>
                  <span>{ctrl}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AdBanner />

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-rose-600 transition-colors"
              >
                <span>{faq.question}</span>
                <span className="text-gray-400 ml-2 shrink-0 text-base">
                  {openFaq === i ? "−" : "＋"}
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="part-time-tax" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このツールは概算です。実際の税額・社会保険料は勤務先や確定申告の内容・自治体により異なります。
        扶養の判定や手続きは勤務先・税務署・年金事務所にご確認ください。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
