"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

/* ─── Data ─── */

// 年間費用（円）
const COSTS = {
  kindergarten: { public: 160_000, private: 330_000 },
  elementary: { public: 350_000, private: 1_670_000 },
  juniorHigh: { public: 540_000, private: 1_440_000 },
  highSchool: { public: 510_000, private: 1_050_000 },
  // 大学: { 入学金(初年のみ), 年間授業料等 }
  university: {
    national: { enrollment: 282_000, annual: 535_800, years: 4 },
    privateLit: { enrollment: 250_000, annual: 930_000, years: 4 },
    privateSci: { enrollment: 260_000, annual: 1_310_000, years: 4 },
    junior: { enrollment: 200_000, annual: 750_000, years: 2 },
    vocational: { enrollment: 150_000, annual: 700_000, years: 2 },
  },
  dormitory: 1_000_000, // 下宿追加費用/年
};

type SchoolType = "public" | "private";
type UnivType = "national" | "privateLit" | "privateSci" | "junior" | "vocational" | "none";
type DormType = "home" | "dormitory";

interface ChildSettings {
  age: number;
  kindergarten: SchoolType;
  elementary: SchoolType;
  juniorHigh: SchoolType;
  highSchool: SchoolType;
  university: UnivType;
  dorm: DormType;
}

function defaultChild(): ChildSettings {
  return {
    age: 0,
    kindergarten: "public",
    elementary: "public",
    juniorHigh: "public",
    highSchool: "public",
    university: "national",
    dorm: "home",
  };
}

function univLabel(t: UnivType): string {
  const map: Record<UnivType, string> = {
    national: "国立大学（4年）",
    privateLit: "私立大学 文系（4年）",
    privateSci: "私立大学 理系（4年）",
    junior: "短大（2年）",
    vocational: "専門学校（2年）",
    none: "進学しない",
  };
  return map[t];
}

function calcChildCost(c: ChildSettings) {
  const kg = COSTS.kindergarten[c.kindergarten] * 3;
  const el = COSTS.elementary[c.elementary] * 6;
  const jh = COSTS.juniorHigh[c.juniorHigh] * 3;
  const hs = COSTS.highSchool[c.highSchool] * 3;

  let univ = 0;
  if (c.university !== "none") {
    const u = COSTS.university[c.university];
    univ = u.enrollment + u.annual * u.years;
    if (c.dorm === "dormitory") univ += COSTS.dormitory * u.years;
  }

  return { kg, el, jh, hs, univ, total: kg + el + jh + hs + univ };
}

// 入学のピーク年齢（最初の大きな費用が集中する時期）
function peakAge(c: ChildSettings): number {
  if (c.university !== "none") return 18;
  return 15;
}

function formatYen(n: number): string {
  return `¥${Math.round(n).toLocaleString()}`;
}

function formatMan(n: number): string {
  const man = n / 10_000;
  if (man >= 100) return `${Math.round(man)}万円`;
  return `${man.toFixed(0)}万円`;
}

/* ─── Sub-components ─── */
function SchoolSelector({
  label,
  value,
  onChange,
  accent,
}: {
  label: string;
  value: SchoolType;
  onChange: (v: SchoolType) => void;
  accent: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex gap-1">
        {(["public", "private"] as SchoolType[]).map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              value === t ? `${accent} text-white` : "border-gray-300 text-gray-600 hover:border-pink-400"
            }`}
          >
            {t === "public" ? "公立" : "私立"}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Component ─── */
export default function EducationCost() {
  const [numChildren, setNumChildren] = useState(1);
  const [children, setChildren] = useState<ChildSettings[]>([defaultChild(), defaultChild(), defaultChild()]);

  const updateChild = (idx: number, update: Partial<ChildSettings>) => {
    setChildren((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...update };
      return next;
    });
  };

  const results = useMemo(() => {
    return children.slice(0, numChildren).map((c) => calcChildCost(c));
  }, [children, numChildren]);

  const totalCost = useMemo(() => results.reduce((s, r) => s + r.total, 0), [results]);

  // 積立プラン: 最初の子のピーク年齢まで
  const savingPlans = useMemo(() => {
    return children.slice(0, numChildren).map((c, i) => {
      const yearsLeft = Math.max(0, peakAge(c) - c.age);
      const target = results[i].univ + results[i].hs; // 高校+大学費用を積立目標
      const monthly = yearsLeft > 0 ? Math.ceil(target / (yearsLeft * 12)) : 0;
      return { yearsLeft, target, monthly };
    });
  }, [children, numChildren, results]);

  const accent = "bg-pink-500 border-pink-500";
  const focusRing = "focus:ring-pink-500";

  const stageLabels = [
    { key: "kg", label: "幼稚園（3年）" },
    { key: "el", label: "小学校（6年）" },
    { key: "jh", label: "中学校（3年）" },
    { key: "hs", label: "高校（3年）" },
    { key: "univ", label: "大学・短大等" },
  ] as const;

  // 棒グラフ用: 段階別費用の最大値
  const maxStage = useMemo(() => {
    return Math.max(
      ...results.flatMap((r) =>
        stageLabels.map(({ key }) => r[key])
      ),
      1
    );
  }, [results]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── Hero ─── */}
      <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎓</span>
          <h1 className="text-2xl font-bold">教育費シミュレーター</h1>
        </div>
        <p className="text-pink-100 text-sm">
          幼稚園から大学まで、公立・私立の組み合わせで子どもの教育費総額を試算します。
        </p>
      </div>

      {/* ─── 子どもの人数 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">子どもの人数</h2>
          <div className="flex gap-2">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setNumChildren(n)}
                className={`w-10 h-10 rounded-full font-bold border transition-colors ${
                  numChildren === n ? "bg-pink-500 text-white border-pink-500" : "border-gray-300 text-gray-600 hover:border-pink-400"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="text-sm text-gray-500 self-center">人</span>
          </div>
        </div>
        <p className="text-xs text-gray-400">※ 最大3人まで入力できます</p>
      </div>

      {/* ─── 子ども別設定 ─── */}
      {children.slice(0, numChildren).map((child, idx) => (
        <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-4">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            第{idx + 1}子の設定
          </h2>

          {/* 現在の年齢 */}
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-gray-700">現在の年齢</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={18}
                value={child.age}
                onChange={(e) => updateChild(idx, { age: Number(e.target.value) })}
                className="w-32 accent-pink-500"
              />
              <span className="w-16 text-center text-sm font-bold text-pink-700 bg-pink-50 rounded-lg py-1">
                {child.age}歳
              </span>
            </div>
          </div>

          {/* 学校区分選択 */}
          <div className="space-y-2.5">
            <SchoolSelector label="幼稚園（3〜5歳）" value={child.kindergarten} onChange={(v) => updateChild(idx, { kindergarten: v })} accent={accent} />
            <SchoolSelector label="小学校（6〜11歳）" value={child.elementary} onChange={(v) => updateChild(idx, { elementary: v })} accent={accent} />
            <SchoolSelector label="中学校（12〜14歳）" value={child.juniorHigh} onChange={(v) => updateChild(idx, { juniorHigh: v })} accent={accent} />
            <SchoolSelector label="高校（15〜17歳）" value={child.highSchool} onChange={(v) => updateChild(idx, { highSchool: v })} accent={accent} />

            {/* 大学 */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">大学・短大・専門</span>
                <select
                  value={child.university}
                  onChange={(e) => updateChild(idx, { university: e.target.value as UnivType })}
                  className={`border border-gray-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 ${focusRing}`}
                >
                  {(["national", "privateLit", "privateSci", "junior", "vocational", "none"] as UnivType[]).map((t) => (
                    <option key={t} value={t}>{univLabel(t)}</option>
                  ))}
                </select>
              </div>

              {child.university !== "none" && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">居住形態</span>
                  <div className="flex gap-1">
                    {(["home", "dormitory"] as DormType[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => updateChild(idx, { dorm: t })}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          child.dorm === t ? `${accent} text-white` : "border-gray-300 text-gray-600 hover:border-pink-400"
                        }`}
                      >
                        {t === "home" ? "自宅通学" : "下宿・一人暮らし"}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 子ども別結果 */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">教育費合計</span>
              <span className="text-xl font-extrabold text-pink-700">{formatMan(results[idx].total)}</span>
            </div>

            {/* 段階別棒グラフ */}
            <div className="space-y-2">
              {stageLabels.map(({ key, label }) => {
                const val = results[idx][key];
                const pct = maxStage > 0 ? (val / maxStage) * 100 : 0;
                return (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-32 shrink-0">{label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-4 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-20 text-right shrink-0">
                      {val > 0 ? formatMan(val) : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 積立プラン */}
          {savingPlans[idx].yearsLeft > 0 && savingPlans[idx].target > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs font-semibold text-amber-800 mb-1">積立プラン（高校・大学費用の目安）</p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-600">入学ピーク（18歳）まで あと</p>
                  <p className="text-lg font-bold text-amber-700">{savingPlans[idx].yearsLeft}年</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">月々の積立目安</p>
                  <p className="text-2xl font-extrabold text-amber-700">{formatYen(savingPlans[idx].monthly)}</p>
                  <p className="text-xs text-gray-500">目標: {formatMan(savingPlans[idx].target)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <AdBanner />

      {/* ─── 総合計 ─── */}
      {numChildren > 1 && (
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300 rounded-2xl p-6 mb-6 text-center">
          <p className="text-sm text-pink-700 mb-1">全子どもの教育費 総合計</p>
          <p className="text-5xl font-extrabold text-pink-700">{formatMan(totalCost)}</p>
          <p className="text-sm text-pink-500 mt-1">（{numChildren}人分の合計）</p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {results.map((r, i) => (
              <div key={i} className="bg-white rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">第{i + 1}子</p>
                <p className="text-base font-bold text-pink-700">{formatMan(r.total)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 費用データ参考 ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-4">費用データの参考値（年間）</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 pr-3 font-medium">学校</th>
                <th className="text-right py-2 px-2 font-medium">公立</th>
                <th className="text-right py-2 px-2 font-medium">私立</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[
                { label: "幼稚園", pub: "16万円/年", priv: "33万円/年" },
                { label: "小学校", pub: "35万円/年", priv: "167万円/年" },
                { label: "中学校", pub: "54万円/年", priv: "144万円/年" },
                { label: "高校", pub: "51万円/年", priv: "105万円/年" },
              ].map((row) => (
                <tr key={row.label} className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-medium">{row.label}</td>
                  <td className="py-2 px-2 text-right">{row.pub}</td>
                  <td className="py-2 px-2 text-right">{row.priv}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="w-full text-xs mt-3">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500">
                <th className="text-left py-2 pr-3 font-medium">大学・短大等</th>
                <th className="text-right py-2 px-2 font-medium">入学金</th>
                <th className="text-right py-2 px-2 font-medium">年間費用</th>
                <th className="text-right py-2 px-2 font-medium">総額目安</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[
                { label: "国立大学（4年）", enr: "28万円", ann: "54万円/年", total: "約243万円" },
                { label: "私立文系（4年）", enr: "25万円", ann: "93万円/年", total: "約397万円" },
                { label: "私立理系（4年）", enr: "26万円", ann: "131万円/年", total: "約550万円" },
                { label: "短大（2年）", enr: "20万円", ann: "75万円/年", total: "約170万円" },
                { label: "専門学校（2年）", enr: "15万円", ann: "70万円/年", total: "約155万円" },
              ].map((row) => (
                <tr key={row.label} className="border-b border-gray-100">
                  <td className="py-2 pr-3 font-medium">{row.label}</td>
                  <td className="py-2 px-2 text-right">{row.enr}</td>
                  <td className="py-2 px-2 text-right">{row.ann}</td>
                  <td className="py-2 px-2 text-right font-semibold text-pink-700">{row.total}</td>
                </tr>
              ))}
              <tr className="border-b border-gray-100 text-amber-700">
                <td className="py-2 pr-3 font-medium">下宿追加費用</td>
                <td className="py-2 px-2 text-right">—</td>
                <td className="py-2 px-2 text-right">+100万円/年</td>
                <td className="py-2 px-2 text-right">+200〜400万円</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          ※ 文部科学省「子供の学習費調査」「国公私立大学の授業料等の推移」をもとにした概算値です。
        </p>
      </div>

      <AdBanner />
      <RelatedTools currentToolId="education-cost" />

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-4">
          {[
            { q: "子ども一人にかかる教育費の総額は？", a: "文科省の調査によると、幼稚園〜高校をすべて公立の場合約574万円、すべて私立の場合約1,838万円です。大学費用を加えると公立文系で約800〜900万円、私立理系で約1,500万円以上になります。" },
            { q: "大学費用は4年間でいくらかかりますか？", a: "国立大学は初年度約82万円・4年合計約243万円。私立文系は初年度約130万円・4年合計約400万円。私立理系は4年合計約540万円程度です（2024年度概算）。" },
            { q: "教育費の積立はいつから始めるべきですか？", a: "子どもが生まれたらすぐ始めるのが理想です。学資保険・ジュニアNISAの後継制度（成長投資枠）や投資信託の積立を活用すると効率的です。" },
            { q: "幼児教育・保育の無償化とは何ですか？", a: "3〜5歳の幼稚園・保育所・認定こども園の費用が無料になる制度です。0〜2歳は住民税非課税世帯のみ対象です。" },
          ].map(({ q, a }) => (
            <details key={q} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <summary className="text-sm font-semibold text-gray-800 cursor-pointer hover:text-pink-600 list-none flex justify-between items-center">
                {q}
                <span className="text-gray-400 ml-2 shrink-0">＋</span>
              </summary>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* ─── Disclaimer ─── */}
      <p className="text-xs text-gray-400 leading-relaxed">
        ※ 本ツールの計算結果は概算です。正確な金額は専門家にご相談ください。教育費は年度・学校・地域により大きく異なります。幼児教育・保育の無償化制度の適用により実際の費用は異なる場合があります。
      </p>
    </div>
  );
}
