"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

// ─── 相続税速算表
function calcTax(amount: number): number {
  if (amount <= 0) return 0;
  if (amount <= 10_000_000) return amount * 0.1;
  if (amount <= 30_000_000) return amount * 0.15 - 500_000;
  if (amount <= 50_000_000) return amount * 0.2 - 2_000_000;
  if (amount <= 100_000_000) return amount * 0.3 - 7_000_000;
  if (amount <= 200_000_000) return amount * 0.4 - 17_000_000;
  if (amount <= 300_000_000) return amount * 0.45 - 27_000_000;
  if (amount <= 600_000_000) return amount * 0.5 - 42_000_000;
  return amount * 0.55 - 72_000_000;
}

// ─── 税率ステップ表（参考表示用）
const TAX_BRACKETS = [
  { label: "〜1,000万円", rate: "10%", deduction: "0円" },
  { label: "〜3,000万円", rate: "15%", deduction: "50万円" },
  { label: "〜5,000万円", rate: "20%", deduction: "200万円" },
  { label: "〜1億円", rate: "30%", deduction: "700万円" },
  { label: "〜2億円", rate: "40%", deduction: "1,700万円" },
  { label: "〜3億円", rate: "45%", deduction: "2,700万円" },
  { label: "〜6億円", rate: "50%", deduction: "4,200万円" },
  { label: "6億円超", rate: "55%", deduction: "7,200万円" },
];

// ─── FAQ
const FAQS = [
  {
    question: "相続税の基礎控除額はいくらですか？",
    answer:
      "相続税の基礎控除額は「3,000万円 + 600万円 × 法定相続人の数」で計算されます。例えば法定相続人が2人の場合は4,200万円となり、遺産総額がこの金額以下であれば相続税はかかりません。",
  },
  {
    question: "相続税の税率はどれくらいですか？",
    answer:
      "相続税は取得金額に応じた超過累進税率が適用されます。1,000万円以下10%〜6億円超55%の8段階構造です。実際には法定相続分で按分した金額にそれぞれ税率を掛けて合算する「法定相続分課税方式」で計算します。",
  },
  {
    question: "配偶者控除とはどのような制度ですか？",
    answer:
      "配偶者が取得する財産が「1億6,000万円」または「配偶者の法定相続分相当額」のいずれか多い方までは相続税がかかりません。ただし、この控除を受けるには相続税の申告が必要です。",
  },
  {
    question: "相続税の申告期限はいつですか？",
    answer:
      "相続税の申告と納付の期限は、被相続人が亡くなったことを知った日の翌日から10ヶ月以内です。申告先は被相続人の住所地を管轄する税務署です。期限を過ぎると延滞税や加算税が発生することがあります。",
  },
];

// ─── 万円フォーマット
function toMan(yen: number): string {
  if (yen === 0) return "0円";
  const man = Math.round(yen / 10_000);
  return `${man.toLocaleString("ja-JP")}万円`;
}
function toYen(yen: number): string {
  return `¥${Math.round(yen).toLocaleString("ja-JP")}`;
}

// ─── 計算ロジック
interface InheritanceResult {
  basicDeduction: number;
  netEstate: number;       // 債務控除後
  taxableEstate: number;   // 課税遺産総額
  totalTax: number;        // 相続税の総額（按分前合計）
  heirBreakdown: {
    label: string;
    share: number;         // 法定相続分（0〜1）
    taxableAmount: number;
    taxBefore: number;     // 按分前税額（各人分）
    taxAfterSpouse: number; // 配偶者控除適用後
  }[];
  spouseDeductionApplied: number; // 配偶者控除で軽減された額
  totalTaxAfterSpouse: number;    // 配偶者控除後の実質税額合計
}

function calcInheritance(
  totalEstate: number,
  debt: number,
  heirsCount: number,
  hasSpouse: boolean
): InheritanceResult {
  const basicDeduction = 30_000_000 + 6_000_000 * heirsCount;
  const netEstate = Math.max(0, totalEstate - debt);
  const taxableEstate = Math.max(0, netEstate - basicDeduction);

  // 法定相続人の内訳を構築
  // 配偶者あり: 配偶者1/2, 子全員で1/2を均等割り
  // 配偶者なし: 子全員で1/1を均等割り
  const childCount = hasSpouse ? heirsCount - 1 : heirsCount;
  const childShare = hasSpouse
    ? (childCount > 0 ? 0.5 / Math.max(childCount, 1) : 0)
    : (childCount > 0 ? 1 / childCount : 0);

  const heirs: InheritanceResult["heirBreakdown"] = [];

  if (hasSpouse) {
    // 配偶者
    const spouseShareRatio = childCount > 0 ? 0.5 : 1.0;
    const spouseTaxable = taxableEstate * spouseShareRatio;
    const spouseTaxBefore = calcTax(spouseTaxable);

    // 配偶者控除: 配偶者の法定相続分相当額 または 1億6000万円 のいずれか多い方まで非課税
    const spouseStatutoryAmount = netEstate * spouseShareRatio;
    const spouseExemptLimit = Math.max(160_000_000, spouseStatutoryAmount);
    const spouseActualAcquired = netEstate * spouseShareRatio; // 法定相続分どおりに取得と仮定
    const spouseExemptRatio = Math.min(1, spouseExemptLimit / Math.max(netEstate, 1));
    const spouseTaxableAfterDeduction =
      spouseActualAcquired <= spouseExemptLimit ? 0 : spouseTaxBefore;

    heirs.push({
      label: "配偶者",
      share: spouseShareRatio,
      taxableAmount: spouseTaxable,
      taxBefore: spouseTaxBefore,
      taxAfterSpouse: spouseActualAcquired <= spouseExemptLimit ? 0 : spouseTaxBefore,
    });

    // 子
    for (let i = 0; i < childCount; i++) {
      const childTaxable = taxableEstate * childShare;
      const childTax = calcTax(childTaxable);
      heirs.push({
        label: childCount === 1 ? "子" : `子${i + 1}`,
        share: childShare,
        taxableAmount: childTaxable,
        taxBefore: childTax,
        taxAfterSpouse: childTax,
      });
    }
  } else {
    // 子のみ
    for (let i = 0; i < childCount; i++) {
      const childTaxable = taxableEstate * childShare;
      const childTax = calcTax(childTaxable);
      heirs.push({
        label: childCount === 1 ? "子" : `子${i + 1}`,
        share: childShare,
        taxableAmount: childTaxable,
        taxBefore: childTax,
        taxAfterSpouse: childTax,
      });
    }
  }

  const totalTax = heirs.reduce((sum, h) => sum + h.taxBefore, 0);
  const totalTaxAfterSpouse = heirs.reduce((sum, h) => sum + h.taxAfterSpouse, 0);
  const spouseDeductionApplied = totalTax - totalTaxAfterSpouse;

  return {
    basicDeduction,
    netEstate,
    taxableEstate,
    totalTax,
    heirBreakdown: heirs,
    spouseDeductionApplied,
    totalTaxAfterSpouse,
  };
}

export default function InheritanceTax() {
  const [totalEstate, setTotalEstate] = useState(50_000_000);
  const [heirsCount, setHeirsCount] = useState(2);
  const [hasSpouse, setHasSpouse] = useState(true);
  const [debt, setDebt] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = useMemo(
    () => calcInheritance(totalEstate, debt, heirsCount, hasSpouse),
    [totalEstate, debt, heirsCount, hasSpouse]
  );

  const isTaxable = result.taxableEstate > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        相続税計算シミュレーター
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        遺産総額・法定相続人数を入力するだけで相続税の目安額を計算します。基礎控除・配偶者控除にも対応。
      </p>

      <AdBanner />

      {/* ─── 入力パネル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm space-y-7">

        {/* 遺産総額 */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <label className="text-sm font-medium text-gray-700">遺産総額（プラスの財産）</label>
            <span className="text-xl font-extrabold text-amber-600">
              {toMan(totalEstate)}
            </span>
          </div>
          <input
            type="range"
            min={10_000_000}
            max={3_000_000_000}
            step={1_000_000}
            value={totalEstate}
            onChange={(e) => setTotalEstate(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-amber-500
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-amber-200 to-amber-400"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1,000万</span>
            <span>5億</span>
            <span>10億</span>
            <span>20億</span>
            <span>30億</span>
          </div>
          {/* クイック選択 */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[
              { label: "3,000万", v: 30_000_000 },
              { label: "5,000万", v: 50_000_000 },
              { label: "1億", v: 100_000_000 },
              { label: "2億", v: 200_000_000 },
              { label: "5億", v: 500_000_000 },
              { label: "10億", v: 1_000_000_000 },
            ].map(({ label, v }) => (
              <button
                key={v}
                onClick={() => setTotalEstate(v)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  totalEstate === v
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-amber-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 債務・葬式費用 */}
        <div>
          <div className="flex justify-between items-baseline mb-1">
            <label className="text-sm font-medium text-gray-700">債務・葬式費用（控除対象）</label>
            <span className="text-lg font-bold text-gray-600">
              {toMan(debt)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={50_000_000}
            step={100_000}
            value={debt}
            onChange={(e) => setDebt(Number(e.target.value))}
            className="w-full h-3 rounded-full appearance-none cursor-pointer accent-amber-400
              [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:h-7
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg
              [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white
              bg-gradient-to-r from-gray-200 to-amber-200"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0円</span>
            <span>1,000万</span>
            <span>2,500万</span>
            <span>5,000万</span>
          </div>
        </div>

        {/* 法定相続人数 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            法定相続人の数（合計）
          </label>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => {
                  setHeirsCount(n);
                  // 配偶者ありで子なしにならないよう調整
                  if (hasSpouse && n === 1) setHasSpouse(false);
                }}
                className={`w-11 h-11 rounded-full text-sm font-bold border transition-colors ${
                  heirsCount === n
                    ? "bg-amber-500 text-white border-amber-500 shadow"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-amber-50"
                }`}
              >
                {n}人
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            ※ 民法上の法定相続人（配偶者・子・親など）の合計人数を選択してください
          </p>
        </div>

        {/* 配偶者の有無 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            相続人の内訳
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setHasSpouse(true)}
              disabled={heirsCount === 1}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                hasSpouse && heirsCount > 1
                  ? "bg-amber-500 text-white border-amber-500 shadow"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-amber-50 disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              配偶者あり
              {heirsCount > 1 && hasSpouse && (
                <span className="ml-1 text-xs opacity-80">
                  （＋子{heirsCount - 1}人）
                </span>
              )}
            </button>
            <button
              onClick={() => setHasSpouse(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                !hasSpouse || heirsCount === 1
                  ? "bg-amber-500 text-white border-amber-500 shadow"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-amber-50"
              }`}
            >
              配偶者なし
              <span className="ml-1 text-xs opacity-80">
                （子{heirsCount}人）
              </span>
            </button>
          </div>
          {heirsCount === 1 && (
            <p className="text-xs text-amber-600 mt-1">
              ※ 相続人が1人の場合は「配偶者なし（子1人）」として計算します
            </p>
          )}
        </div>
      </div>

      {/* ─── ヒーローカード ─── */}
      <div
        className={`rounded-2xl p-6 mb-6 text-white shadow-lg ${
          isTaxable
            ? "bg-gradient-to-br from-amber-500 to-orange-500"
            : "bg-gradient-to-br from-emerald-500 to-teal-500"
        }`}
      >
        {isTaxable ? (
          <>
            <p className="text-sm font-medium opacity-90 mb-1">相続税の総額（目安）</p>
            <p className="text-5xl font-extrabold tracking-tight mb-1">
              {toYen(result.totalTaxAfterSpouse)}
            </p>
            {hasSpouse && result.spouseDeductionApplied > 0 && (
              <p className="text-sm opacity-80 mb-1">
                配偶者控除適用後 ／ 控除前：{toYen(result.totalTax)}
              </p>
            )}
            <div className="pt-4 border-t border-white/30 mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs opacity-75">基礎控除額</p>
                <p className="text-2xl font-bold">{toMan(result.basicDeduction)}</p>
              </div>
              <div>
                <p className="text-xs opacity-75">課税遺産総額</p>
                <p className="text-2xl font-bold">{toMan(result.taxableEstate)}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-medium opacity-90 mb-1">相続税</p>
            <p className="text-4xl font-extrabold tracking-tight mb-2">非課税（0円）</p>
            <p className="text-sm opacity-80">
              遺産総額が基礎控除額（{toMan(result.basicDeduction)}）以下のため、相続税はかかりません。
            </p>
          </>
        )}
      </div>

      {/* ─── 内訳カード ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">計算の内訳</h2>
        <div className="space-y-2 text-sm">
          {[
            { label: "遺産総額（プラスの財産）", value: toMan(totalEstate), highlight: false },
            { label: "債務・葬式費用（控除）", value: `- ${toMan(debt)}`, highlight: false },
            { label: "債務控除後の遺産額", value: toMan(result.netEstate), highlight: false },
            { label: "基礎控除額", value: `- ${toMan(result.basicDeduction)}`, highlight: false },
            {
              label: "課税遺産総額",
              value: isTaxable ? toMan(result.taxableEstate) : "0円（非課税）",
              highlight: true,
            },
          ].map(({ label, value, highlight }) => (
            <div
              key={label}
              className={`flex justify-between items-center py-2 border-b border-gray-100 last:border-0 ${
                highlight ? "font-bold text-amber-700" : "text-gray-700"
              }`}
            >
              <span>{label}</span>
              <span className={highlight ? "text-lg" : ""}>{value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          基礎控除 = 3,000万円 ＋ 600万円 × {heirsCount}人 = {toMan(result.basicDeduction)}
        </p>
      </div>

      {/* ─── 相続人別税負担テーブル ─── */}
      {isTaxable && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-1">相続人別の税負担（法定相続分課税方式）</h2>
          <p className="text-xs text-gray-500 mb-4">
            法定相続分に応じて課税遺産総額を按分し、各自の相続税額を計算して合算します。
          </p>
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-right">
                  <th className="text-left py-2 px-2 font-medium">相続人</th>
                  <th className="py-2 px-2 font-medium">法定相続分</th>
                  <th className="py-2 px-2 font-medium">按分後取得額</th>
                  <th className="py-2 px-2 font-medium">算出税額</th>
                </tr>
              </thead>
              <tbody>
                {result.heirBreakdown.map((heir) => (
                  <tr key={heir.label} className="border-b border-gray-100 last:border-0">
                    <td className="py-2.5 px-2 text-gray-800 font-medium">{heir.label}</td>
                    <td className="py-2.5 px-2 text-right text-gray-600">
                      {(heir.share * 100).toFixed(heir.share % 1 === 0 ? 0 : 1)}%
                    </td>
                    <td className="py-2.5 px-2 text-right text-gray-700">
                      {toMan(heir.taxableAmount)}
                    </td>
                    <td className="py-2.5 px-2 text-right text-amber-700 font-semibold">
                      {toYen(heir.taxBefore)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-amber-50 font-bold">
                  <td className="py-2.5 px-2 text-gray-900" colSpan={3}>
                    相続税の総額
                  </td>
                  <td className="py-2.5 px-2 text-right text-amber-700 text-base">
                    {toYen(result.totalTax)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── 配偶者控除 ─── */}
      {isTaxable && hasSpouse && heirsCount > 1 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-3">配偶者控除の適用</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b border-amber-100">
              <span className="text-gray-700">配偶者の法定相続分相当額</span>
              <span className="font-medium text-gray-800">
                {toMan(result.netEstate * 0.5)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-amber-100">
              <span className="text-gray-700">非課税限度額（いずれか多い方）</span>
              <span className="font-medium text-gray-800">
                {toMan(Math.max(160_000_000, result.netEstate * 0.5))}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-amber-100">
              <span className="text-gray-700">配偶者控除による軽減額</span>
              <span className="font-semibold text-emerald-700">
                − {toYen(result.spouseDeductionApplied)}
              </span>
            </div>
            <div className="flex justify-between py-2 font-bold text-base">
              <span className="text-gray-900">実質税額合計（配偶者控除後）</span>
              <span className="text-amber-700 text-lg">{toYen(result.totalTaxAfterSpouse)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            ※ 配偶者が法定相続分どおりに取得した場合の試算です。実際の取得割合によって控除額は異なります。
          </p>
        </div>
      )}

      <AdBanner />

      {/* ─── 税率ステップ表 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">相続税の税率表（参考）</h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">取得金額</th>
                <th className="text-right py-2 px-2 font-medium">税率</th>
                <th className="text-right py-2 px-2 font-medium">控除額</th>
              </tr>
            </thead>
            <tbody>
              {TAX_BRACKETS.map((b) => (
                <tr key={b.label} className="border-b border-gray-100 last:border-0 hover:bg-amber-50 transition-colors">
                  <td className="py-2.5 px-2 text-gray-700">{b.label}</td>
                  <td className="py-2.5 px-2 text-right font-semibold text-amber-700">{b.rate}</td>
                  <td className="py-2.5 px-2 text-right text-gray-500">{b.deduction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※ 税率は「各法定相続人が法定相続分に応じて取得した金額」に対して適用されます（速算表）。
        </p>
      </div>

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-amber-600"
              >
                <span>{faq.question}</span>
                <span className="text-gray-400 ml-2 shrink-0 text-base">
                  {openFaq === i ? "−" : "＋"}
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="inheritance-tax" />

      {/* ─── 免責事項 ─── */}
      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ このシミュレーターは目安計算です。実際の相続税額は遺産分割の内容・各種特例・小規模宅地等の特例などにより大きく異なる場合があります。
        相続税の申告・納付については税理士または税務署にご相談ください。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
