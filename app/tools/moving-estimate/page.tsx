"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/* ─── Types ─── */
type Distance = "same_city" | "same_pref" | "neighbor" | "long" | "island";
type HouseholdSize = "single" | "two" | "three" | "four" | "five_plus";
type Volume = "small" | "normal" | "large" | "xlarge";
type Season = "peak" | "semi_peak" | "normal" | "off";
type TimeSlot = "weekday_am" | "weekday_pm" | "weekend_am" | "weekend_pm";

/* ─── Multipliers ─── */
const DISTANCE_MULT: Record<Distance, number> = {
  same_city: 1.0,
  same_pref: 1.5,
  neighbor: 2.0,
  long: 3.0,
  island: 4.5,
};

const SIZE_MULT: Record<HouseholdSize, number> = {
  single: 1.0,
  two: 1.6,
  three: 2.2,
  four: 2.8,
  five_plus: 3.5,
};

const VOLUME_MULT: Record<Volume, number> = {
  small: 1.0,
  normal: 1.3,
  large: 1.7,
  xlarge: 2.2,
};

const SEASON_MULT: Record<Season, number> = {
  peak: 1.8,
  semi_peak: 1.3,
  normal: 1.0,
  off: 0.8,
};

const TIMESLOT_MULT: Record<TimeSlot, number> = {
  weekday_am: 1.0,
  weekday_pm: 0.9,
  weekend_am: 1.2,
  weekend_pm: 1.1,
};

const BASE_PRICE = 35000;

/* ─── Packaging cost estimate ─── */
const PACK_COST: Record<HouseholdSize, number> = {
  single: 3000,
  two: 5000,
  three: 7000,
  four: 9000,
  five_plus: 12000,
};

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

/* ─── Select component ─── */
function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ─── Main Component ─── */
export default function MovingEstimatePage() {
  const [distance, setDistance] = useState<Distance>("same_city");
  const [householdSize, setHouseholdSize] = useState<HouseholdSize>("single");
  const [volume, setVolume] = useState<Volume>("normal");
  const [season, setSeason] = useState<Season>("normal");
  const [timeSlot, setTimeSlot] = useState<TimeSlot>("weekday_am");

  const calc = useMemo(() => {
    const base =
      BASE_PRICE *
      DISTANCE_MULT[distance] *
      SIZE_MULT[householdSize] *
      VOLUME_MULT[volume] *
      SEASON_MULT[season] *
      TIMESLOT_MULT[timeSlot];

    const lowEstimate = Math.round(base * 0.8);
    const highEstimate = Math.round(base * 1.3);
    const packCost = PACK_COST[householdSize];

    // Season surcharge vs normal
    const normalBase =
      BASE_PRICE *
      DISTANCE_MULT[distance] *
      SIZE_MULT[householdSize] *
      VOLUME_MULT[volume] *
      1.0 *
      TIMESLOT_MULT[timeSlot];
    const seasonSurcharge = Math.max(0, Math.round(base - normalBase));

    // Savings from avoiding peak season
    const peakBase =
      BASE_PRICE *
      DISTANCE_MULT[distance] *
      SIZE_MULT[householdSize] *
      VOLUME_MULT[volume] *
      SEASON_MULT.peak *
      TIMESLOT_MULT[timeSlot];
    const savingVsPeak = Math.max(0, Math.round(peakBase - base));

    // Competitive bidding discount (typically 10-20%)
    const competitiveSaving = Math.round(base * 0.15);

    return {
      base: Math.round(base),
      lowEstimate,
      highEstimate,
      packCost,
      seasonSurcharge,
      savingVsPeak,
      competitiveSaving,
    };
  }, [distance, householdSize, volume, season, timeSlot]);

  const seasonLabel: Record<Season, string> = {
    peak: "繁忙期（3〜4月）",
    semi_peak: "準繁忙期（2月・5月）",
    normal: "通常期",
    off: "閑散期（6〜8月）",
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ── Header ── */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">📦</span>
          <h1 className="text-2xl font-bold">引越し費用見積もり</h1>
        </div>
        <p className="text-blue-100 text-sm">
          距離・荷物量・時期を選ぶだけで引越し費用の相場をシミュレーション。
        </p>
      </div>

      <AdBanner />

      {/* ── Inputs ── */}
      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-800 mb-5">引越し情報を入力</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="距離区分"
            value={distance}
            onChange={(v) => setDistance(v as Distance)}
            options={[
              { value: "same_city", label: "同市区内（30km未満）" },
              { value: "same_pref", label: "同都道府県（100km未満）" },
              { value: "neighbor", label: "隣県（200km未満）" },
              { value: "long", label: "遠距離（200km以上）" },
              { value: "island", label: "北海道・沖縄含む" },
            ]}
          />

          <SelectField
            label="世帯人数"
            value={householdSize}
            onChange={(v) => setHouseholdSize(v as HouseholdSize)}
            options={[
              { value: "single", label: "単身（1人）" },
              { value: "two", label: "2人" },
              { value: "three", label: "3人" },
              { value: "four", label: "4人" },
              { value: "five_plus", label: "5人以上" },
            ]}
          />

          <SelectField
            label="荷物量"
            value={volume}
            onChange={(v) => setVolume(v as Volume)}
            options={[
              { value: "small", label: "少ない（1K相当）" },
              { value: "normal", label: "普通（1LDK）" },
              { value: "large", label: "多い（2LDK）" },
              { value: "xlarge", label: "非常に多い（3LDK以上）" },
            ]}
          />

          <SelectField
            label="引越し時期"
            value={season}
            onChange={(v) => setSeason(v as Season)}
            options={[
              { value: "peak", label: "繁忙期 3〜4月（×1.8）" },
              { value: "semi_peak", label: "準繁忙期 2月・5月（×1.3）" },
              { value: "normal", label: "通常期（×1.0）" },
              { value: "off", label: "閑散期 6〜8月（×0.8）" },
            ]}
          />

          <div className="sm:col-span-2">
            <SelectField
              label="曜日・時間帯"
              value={timeSlot}
              onChange={(v) => setTimeSlot(v as TimeSlot)}
              options={[
                { value: "weekday_am", label: "平日午前（標準）" },
                { value: "weekday_pm", label: "平日午後（約10%割引）" },
                { value: "weekend_am", label: "土日祝午前（約20%割増）" },
                { value: "weekend_pm", label: "土日祝午後（約10%割増）" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">概算費用</h2>

        {/* Main range */}
        <div className="text-center pb-4 mb-4 border-b border-blue-200">
          <p className="text-sm text-blue-700 font-medium mb-1">概算費用レンジ</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-blue-900 tabular-nums">
            {formatYen(calc.lowEstimate)}
            <span className="text-xl font-bold text-blue-600 mx-2">〜</span>
            {formatYen(calc.highEstimate)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            ※ 相見積もりにより実際はこの範囲内に収まることが多いです
          </p>
        </div>

        {/* Breakdown */}
        <h3 className="text-sm font-bold text-gray-700 mb-3">費用内訳（目安）</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm py-2 border-b border-blue-100">
            <span className="text-gray-600">基本運送料</span>
            <span className="font-bold text-gray-800 tabular-nums">
              {formatYen(calc.base - (season !== "normal" ? calc.seasonSurcharge : 0))}
            </span>
          </div>
          {calc.seasonSurcharge > 0 && (
            <div className="flex justify-between items-center text-sm py-2 border-b border-blue-100">
              <span className="text-amber-600">時期割増（{seasonLabel[season]}）</span>
              <span className="font-bold text-amber-700 tabular-nums">
                +{formatYen(calc.seasonSurcharge)}
              </span>
            </div>
          )}
          {season === "off" && (
            <div className="flex justify-between items-center text-sm py-2 border-b border-blue-100">
              <span className="text-green-600">閑散期割引</span>
              <span className="font-bold text-green-700 tabular-nums">
                -{formatYen(Math.round(calc.base / 0.8 * 0.2))}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center text-sm py-2 border-b border-blue-100">
            <span className="text-gray-600">梱包材費（推定）</span>
            <span className="font-bold text-gray-800 tabular-nums">
              {formatYen(calc.packCost)}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm py-2 font-bold">
            <span className="text-gray-800">合計目安（中央値）</span>
            <span className="text-blue-800 tabular-nums">{formatYen(calc.base + calc.packCost)}</span>
          </div>
        </div>
      </section>

      <AdBanner />

      {/* ── Saving Tips ── */}
      <section className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6">
        <h2 className="text-base font-bold text-green-800 mb-4">💡 節約Tips</h2>
        <div className="space-y-3">
          {calc.savingVsPeak > 0 && (
            <div className="flex items-start gap-3 bg-white rounded-xl border border-green-100 px-4 py-3">
              <span className="text-xl shrink-0">📅</span>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  繁忙期を避けて{" "}
                  <span className="text-green-700 font-bold">
                    {formatYen(calc.savingVsPeak)}
                  </span>{" "}
                  節約
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  現在の時期選択と繁忙期（3〜4月）の差額です
                </p>
              </div>
            </div>
          )}
          <div className="flex items-start gap-3 bg-white rounded-xl border border-green-100 px-4 py-3">
            <span className="text-xl shrink-0">🔍</span>
            <div>
              <p className="text-sm font-medium text-gray-800">
                相見積もりで平均{" "}
                <span className="text-green-700 font-bold">
                  {formatYen(calc.competitiveSaving)}
                </span>{" "}
                節約（約15%）
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                3社以上に見積もりを依頼すると交渉力が高まります
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-xl border border-green-100 px-4 py-3">
            <span className="text-xl shrink-0">🗑️</span>
            <div>
              <p className="text-sm font-medium text-gray-800">不用品を事前処分で荷物量を削減</p>
              <p className="text-xs text-gray-500 mt-0.5">
                荷物量を1ランク減らすと費用が約20〜30%下がります
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-white rounded-xl border border-green-100 px-4 py-3">
            <span className="text-xl shrink-0">🌇</span>
            <div>
              <p className="text-sm font-medium text-gray-800">午後便を選ぶと約10%割引</p>
              <p className="text-xs text-gray-500 mt-0.5">
                引越し業者のスケジュール効率化のため午後便は割安設定が多いです
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mb-8">
        <h2 className="text-base font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {[
            {
              q: "引越し費用の見積もりはいつ依頼すべきですか？",
              a: "引越しの1〜2ヶ月前から複数社に見積もりを依頼するのが理想です。繁忙期は早めに動かないと希望日が取れないこともあります。引越し一括見積もりサービスを利用すると効率的です。",
            },
            {
              q: "自分で引越しした場合の費用は？",
              a: "レンタカー（2トントラック1日）＋ガソリン代＋有料道路代で2〜5万円程度が目安です。ただし梱包・搬出入の労力と時間がかかります。単身・近距離・荷物少量の場合は検討の余地があります。",
            },
          ].map((item, i) => (
            <details
              key={i}
              className="rounded-xl border border-gray-200 bg-white overflow-hidden"
            >
              <summary className="px-4 py-3 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
                Q. {item.q}
              </summary>
              <div className="px-4 pb-4 pt-2 text-sm text-gray-600 border-t border-gray-100">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-500 mb-8">
        ※ 本ツールの計算結果はあくまで概算の目安です。実際の引越し費用はトラックのサイズ、スタッフ人数、オプションサービスなどによって大きく異なります。正確な費用は複数の引越し会社に見積もりをご依頼ください。
      </div>

      <RelatedTools currentToolId="moving-estimate" />
    </div>
  );
}
