"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/* ─── Types ─── */
type PayType = "monthly" | "hourly";

interface OvertimeInputs {
  payType: PayType;
  monthlySalary: number;
  scheduledHours: number;
  hourlyWage: number;
  extraAllowance: number;
  normalOT: number;     // 月60h以内の時間外
  over60OT: number;     // 月60h超の時間外
  nightOT: number;      // 深夜残業
  legalHoliday: number; // 法定休日
  nonLegalHoliday: number; // 法定外休日
}

/* ─── 割増率定数 ─── */
const RATES = {
  normalOT: 1.25,
  over60OT: 1.50,
  nightOT: 1.50,       // 時間外25% + 深夜25%
  legalHoliday: 1.35,
  nonLegalHoliday: 1.25,
};

/* ─── Helpers ─── */
function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

function calcOvertime(inputs: OvertimeInputs) {
  const baseHourly =
    inputs.payType === "hourly"
      ? inputs.hourlyWage
      : inputs.scheduledHours > 0
      ? (inputs.monthlySalary + inputs.extraAllowance) / inputs.scheduledHours
      : 0;

  const normalOTPay    = baseHourly * RATES.normalOT    * inputs.normalOT;
  const over60OTPay    = baseHourly * RATES.over60OT    * inputs.over60OT;
  const nightOTPay     = baseHourly * RATES.nightOT     * inputs.nightOT;
  const legalHolPay    = baseHourly * RATES.legalHoliday    * inputs.legalHoliday;
  const nonLegalHolPay = baseHourly * RATES.nonLegalHoliday * inputs.nonLegalHoliday;

  const total = normalOTPay + over60OTPay + nightOTPay + legalHolPay + nonLegalHolPay;
  const totalHours = inputs.normalOT + inputs.over60OT + inputs.nightOT + inputs.legalHoliday + inputs.nonLegalHoliday;
  const base = inputs.payType === "monthly" ? inputs.monthlySalary : 0;
  const ratio = base > 0 ? (total / base) * 100 : 0;

  return {
    baseHourly,
    normalOTPay,
    over60OTPay,
    nightOTPay,
    legalHolPay,
    nonLegalHolPay,
    total,
    totalHours,
    ratio,
    annual: total * 12,
  };
}

/* ─── Sub-component ─── */
function NumberInput({
  label,
  sublabel,
  value,
  onChange,
  unit,
  min = 0,
  step = 0.5,
}: {
  label: string;
  sublabel?: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  min?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {sublabel && <span className="text-xs text-gray-400 ml-1">({sublabel})</span>}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <span className="text-sm text-gray-500 w-8 shrink-0">{unit}</span>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function OvertimeCalc() {
  const [inputs, setInputs] = useState<OvertimeInputs>({
    payType: "monthly",
    monthlySalary: 300000,
    scheduledHours: 160,
    hourlyWage: 1500,
    extraAllowance: 0,
    normalOT: 20,
    over60OT: 0,
    nightOT: 0,
    legalHoliday: 0,
    nonLegalHoliday: 0,
  });

  const set = <K extends keyof OvertimeInputs>(key: K, val: OvertimeInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: val }));

  const result = useMemo(() => calcOvertime(inputs), [inputs]);

  const breakdownRows = [
    { label: "時間外残業（月60h以内）", sublabel: "×1.25", hours: inputs.normalOT, rate: "25%", pay: result.normalOTPay },
    { label: "時間外残業（月60h超）",   sublabel: "×1.50", hours: inputs.over60OT, rate: "50%", pay: result.over60OTPay },
    { label: "深夜残業（22時〜翌5時）", sublabel: "×1.50", hours: inputs.nightOT,  rate: "50%", pay: result.nightOTPay },
    { label: "法定休日労働",            sublabel: "×1.35", hours: inputs.legalHoliday,    rate: "35%", pay: result.legalHolPay },
    { label: "法定外休日労働",          sublabel: "×1.25", hours: inputs.nonLegalHoliday, rate: "25%", pay: result.nonLegalHolPay },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⏰</span>
          <h1 className="text-2xl font-bold">残業代計算ツール</h1>
        </div>
        <p className="text-blue-100 text-sm">
          時間外・深夜・休日の割増賃金を自動計算。未払い残業代のチェックに。
        </p>
      </div>

      {/* ─── Section 1: 給与情報 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">① 給与情報</h2>

        {/* 給与形態タブ */}
        <div className="flex gap-2 mb-5">
          {(["monthly", "hourly"] as PayType[]).map((t) => (
            <button
              key={t}
              onClick={() => set("payType", t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputs.payType === t
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t === "monthly" ? "月給制" : "時給制"}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {inputs.payType === "monthly" ? (
            <>
              <NumberInput
                label="月額基本給"
                value={inputs.monthlySalary}
                onChange={(v) => set("monthlySalary", v)}
                unit="円"
                step={1000}
              />
              <NumberInput
                label="月の所定労働時間"
                value={inputs.scheduledHours}
                onChange={(v) => set("scheduledHours", v)}
                unit="時間"
                step={1}
              />
              <NumberInput
                label="職務手当など（基礎賃金に含める手当）"
                sublabel="家族手当・通勤手当・住宅手当は除外"
                value={inputs.extraAllowance}
                onChange={(v) => set("extraAllowance", v)}
                unit="円"
                step={1000}
              />
            </>
          ) : (
            <NumberInput
              label="時給"
              value={inputs.hourlyWage}
              onChange={(v) => set("hourlyWage", v)}
              unit="円"
              step={10}
            />
          )}
        </div>

        {result.baseHourly > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">基礎時給（計算に使用）</span>
            <span className="font-bold text-blue-700">{formatYen(result.baseHourly)} / 時間</span>
          </div>
        )}
      </div>

      {/* ─── Section 2: 残業時間の内訳 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-5 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">② 残業時間の内訳</h2>
        <div className="space-y-4">
          <NumberInput
            label="時間外残業（平日・月60時間以内）"
            sublabel="割増25%"
            value={inputs.normalOT}
            onChange={(v) => set("normalOT", v)}
            unit="時間"
          />
          <NumberInput
            label="時間外残業（月60時間超）"
            sublabel="割増50%"
            value={inputs.over60OT}
            onChange={(v) => set("over60OT", v)}
            unit="時間"
          />
          <NumberInput
            label="深夜残業（22時〜翌5時）"
            sublabel="割増50%"
            value={inputs.nightOT}
            onChange={(v) => set("nightOT", v)}
            unit="時間"
          />
          <NumberInput
            label="法定休日労働"
            sublabel="割増35%"
            value={inputs.legalHoliday}
            onChange={(v) => set("legalHoliday", v)}
            unit="時間"
          />
          <NumberInput
            label="法定外休日労働（所定休日）"
            sublabel="割増25%"
            value={inputs.nonLegalHoliday}
            onChange={(v) => set("nonLegalHoliday", v)}
            unit="時間"
          />
        </div>
      </div>

      {/* ─── Results ─── */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6 text-center">
        <p className="text-sm text-blue-700 mb-1">今月の残業代合計</p>
        <p className="text-5xl font-extrabold text-blue-800 mb-1">
          {formatYen(result.total)}
        </p>
        <p className="text-sm text-gray-500">残業 {result.totalHours.toFixed(1)} 時間分</p>

        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-blue-200">
          <div>
            <p className="text-xs text-gray-500">基礎時給</p>
            <p className="text-base font-bold text-gray-800">{formatYen(result.baseHourly)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">月給に占める割合</p>
            <p className="text-base font-bold text-gray-800">
              {inputs.payType === "monthly" ? `${result.ratio.toFixed(1)}%` : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-blue-600">年間換算</p>
            <p className="text-base font-bold text-blue-700">{formatYen(result.annual)}</p>
          </div>
        </div>
      </div>

      <AdBanner />

      {/* ─── 内訳テーブル ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">残業代の内訳</h2>
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 px-2 font-medium">区分</th>
                <th className="text-right py-2 px-2 font-medium">時間</th>
                <th className="text-right py-2 px-2 font-medium">割増率</th>
                <th className="text-right py-2 px-2 font-medium">金額</th>
              </tr>
            </thead>
            <tbody>
              {breakdownRows.map((row) => (
                <tr key={row.label} className="border-b border-gray-100 last:border-0">
                  <td className="py-2.5 px-2 text-gray-800">
                    <div>{row.label}</div>
                  </td>
                  <td className="py-2.5 px-2 text-right text-gray-600">{row.hours}h</td>
                  <td className="py-2.5 px-2 text-right text-gray-600">+{row.rate}</td>
                  <td className="py-2.5 px-2 text-right font-semibold text-blue-700">
                    {formatYen(row.pay)}
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-50">
                <td className="py-2.5 px-2 font-bold text-gray-900" colSpan={3}>合計</td>
                <td className="py-2.5 px-2 text-right font-extrabold text-blue-800">
                  {formatYen(result.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <AdBanner />
      <RelatedTools currentToolId="overtime-calc" />

      {/* ─── 計算の仕組み ─── */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-3">計算の仕組み</h2>
        <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
          <li><strong>基礎時給</strong> = 月給 ÷ 月の所定労働時間</li>
          <li><strong>各残業代</strong> = 基礎時給 × 割増率 × 残業時間</li>
          <li>深夜残業は時間外25%＋深夜25%で計50%増として計算</li>
          <li>月60時間超は中小企業でも2023年4月から50%増が義務化</li>
        </ol>
      </div>

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          {[
            {
              q: "残業代の割増率はいくらですか？",
              a: "法定時間外（月60時間まで）は25%増、月60時間超は50%増、深夜（22時〜翌5時）は25%増、法定休日は35%増が義務です。これらは重複して適用されます（例：深夜残業は50%増）。",
            },
            {
              q: "残業代の計算方法を教えてください。",
              a: "1時間あたりの基礎賃金×割増率×残業時間で計算します。月給制の場合、月の所定労働時間で月給を割って時給換算します。",
            },
            {
              q: "残業代が払われない場合はどうすればいいですか？",
              a: "未払い残業代は労働基準監督署に相談できます。時効は2年（2020年4月以降の分は3年）です。タイムカードや業務記録を証拠として保管しておきましょう。",
            },
            {
              q: "管理職は残業代が出ないのは本当ですか？",
              a: "「管理監督者」（労働基準法41条）に該当する場合は時間外・休日割増は適用外ですが、深夜割増は支払い義務があります。名ばかり管理職には残業代の請求権があります。",
            },
          ].map(({ q, a }) => (
            <details key={q} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <summary className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-blue-600 list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 ml-2 shrink-0">＋</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 leading-relaxed">
        ※ 本ツールの計算結果は概算です。正確な金額は専門家にご相談ください。
      </p>
    </div>
  );
}
