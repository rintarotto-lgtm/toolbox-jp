"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";

const fmt = (n: number) => Math.round(n).toLocaleString("ja-JP");
const fmtMan = (n: number) => (Math.round(n / 10000)).toLocaleString("ja-JP");

// 地域別料率乗数（全国平均を1.0とした概算）
const REGION_MULTIPLIERS: Record<string, number> = {
  全国平均: 1.0,
  "東京都(23区)": 1.15,
  大阪府: 1.2,
  神奈川県: 1.1,
  愛知県: 1.05,
  福岡県: 1.0,
  北海道: 0.95,
  宮城県: 0.92,
  広島県: 0.98,
};

const REGIONS = Object.keys(REGION_MULTIPLIERS);

function calcKokuho(
  income: number,
  members: number,
  multiplier: number
): {
  iryo: number;
  kouki: number;
  total: number;
  monthly: number;
} {
  // 賦課基準額 = 所得 - 43万円（基礎控除）
  const baseIncome = Math.max(0, income - 430_000);

  // 医療分
  const iryoShotokuWari = baseIncome * 0.076 * multiplier;
  const iryoKintouWari = 29_000 * members * multiplier;
  const iryo = Math.min(iryoShotokuWari + iryoKintouWari, 650_000);

  // 後期高齢者支援金分
  const koukiShotokuWari = baseIncome * 0.024 * multiplier;
  const koukiKintouWari = 10_000 * members * multiplier;
  const kouki = Math.min(koukiShotokuWari + koukiKintouWari, 220_000);

  const total = iryo + kouki;
  const monthly = total / 12;

  return { iryo, kouki, total, monthly };
}

// 軽減判定
function getKeiGen(income: number, members: number): string | null {
  // 7割軽減: 43万円以下
  if (income <= 430_000) return "7割軽減（所得43万円以下）の対象になる可能性があります";
  // 5割軽減: 43万 + 29万 × (被保険者数) 以下
  if (income <= 430_000 + 290_000 * members)
    return "5割軽減（所得目安: 43万＋29万×加入者数以下）の対象になる可能性があります";
  // 2割軽減: 43万 + 53.5万 × (被保険者数) 以下
  if (income <= 430_000 + 535_000 * members)
    return "2割軽減（所得目安: 43万＋53.5万×加入者数以下）の対象になる可能性があります";
  return null;
}

const INCOME_TABLE_ROWS = [100, 200, 300, 400, 500, 700, 1000];

const faqs = [
  {
    q: "国民健康保険料はどのように計算されますか？",
    a: "国民健康保険料は「医療分」「後期高齢者支援金分」（40〜64歳は「介護分」も）の合計です。各区分は「所得割（前年所得に料率をかけた額）」と「均等割（加入者数×定額）」で構成されます。料率は市区町村ごとに異なるため、実際の金額はお住まいの自治体にご確認ください。",
  },
  {
    q: "国民健康保険料を安くする方法はありますか？",
    a: "①前年所得が一定以下の場合は均等割の2〜7割軽減が自動適用されます。②会社員の配偶者に扶養してもらえれば保険料が0円になります。③退職後は任意継続被保険者として在職中の保険料水準を最大2年間維持できる場合があります。",
  },
  {
    q: "国民健康保険と社会保険（健康保険）の違いは何ですか？",
    a: "社会保険（健康保険）は会社員が対象で、保険料の約半分を会社が負担します。同じ年収でも自己負担は国民健康保険の半分程度になる場合が多いです。国民健康保険は自営業・フリーランス・退職後の方が加入し、保険料は全額自己負担です。",
  },
  {
    q: "国民健康保険にはいつ加入しますか？",
    a: "会社を退職して社会保険の資格を失った翌日から加入義務が発生します。手続きはお住まいの市区町村窓口で原則14日以内に行ってください。手続きが遅れた場合も資格取得日まで遡って保険料が発生します。",
  },
];

export default function KokuhoCalc() {
  const [income, setIncome] = useState(3_000_000);
  const [members, setMembers] = useState(1);
  const [region, setRegion] = useState("全国平均");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const multiplier = REGION_MULTIPLIERS[region] ?? 1.0;

  const result = useMemo(
    () => calcKokuho(income, members, multiplier),
    [income, members, multiplier]
  );

  // 社会保険比較（会社員の場合: 年収の約5%、会社が半分負担 → 本人負担約2.5%）
  const shakaihokenHonnin = income * 0.025;
  const diff = result.total - shakaihokenHonnin;

  // 軽減判定
  const keiGenMsg = getKeiGen(income, members);

  // 所得別テーブル
  const tableRows = useMemo(() =>
    INCOME_TABLE_ROWS.map((man) => {
      const inc = man * 10_000;
      const r = calcKokuho(inc, members, multiplier);
      return { man, ...r };
    }),
    [members, multiplier]
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* ヘッダー */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          国民健康保険料計算シミュレーター
        </h1>
        <p className="text-gray-500 mt-1">
          フリーランス・自営業・退職後の方向けに、前年所得から国民健康保険料の概算を無料計算。
        </p>
      </div>

      <AdBanner />

      {/* 入力パネル */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
        <h2 className="font-bold text-gray-900">入力情報</h2>

        {/* 所得スライダー */}
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              前年の所得
              <span className="ml-1 text-xs text-gray-400">（収入から経費を引いた金額）</span>
            </span>
            <span className="font-semibold text-gray-900">{fmtMan(income)}万円</span>
          </div>
          <input
            type="range"
            min={0}
            max={20_000_000}
            step={100_000}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>0円</span>
            <span>2,000万円</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {[100, 200, 300, 400, 500, 700, 1000].map((v) => (
              <button
                key={v}
                onClick={() => setIncome(v * 10_000)}
                className={`px-3 py-1 rounded-full text-xs border transition-all ${
                  income === v * 10_000
                    ? "bg-teal-100 border-teal-400 text-teal-700"
                    : "border-gray-200 text-gray-600 hover:border-teal-300"
                }`}
              >
                {v}万
              </button>
            ))}
          </div>
        </div>

        {/* 被保険者数 */}
        <div className="space-y-2">
          <span className="text-sm text-gray-600">世帯の被保険者数</span>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setMembers(n)}
                className={`w-12 h-10 rounded-lg border text-sm font-medium transition-all ${
                  members === n
                    ? "bg-teal-500 border-teal-500 text-white"
                    : "border-gray-200 text-gray-600 hover:border-teal-300"
                }`}
              >
                {n}人
              </button>
            ))}
          </div>
        </div>

        {/* 都道府県 */}
        <div className="space-y-2">
          <span className="text-sm text-gray-600">都道府県（簡易）</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400">
            ※ 料率は概算です。正確な金額はお住まいの市区町村にご確認ください。
          </p>
        </div>
      </div>

      {/* ヒーローカード */}
      <div className="bg-gradient-to-br from-teal-500 to-green-500 rounded-2xl p-6 text-white text-center shadow-lg">
        <p className="text-sm font-medium text-teal-100">年間保険料（概算）</p>
        <p className="text-5xl sm:text-6xl font-bold mt-1">
          {fmtMan(result.total)}
          <span className="text-2xl ml-1 font-normal">万円</span>
        </p>
        <p className="text-teal-100 mt-1 text-sm">
          月額 約{fmt(result.monthly)}円
        </p>

        {/* 内訳 */}
        <div className="mt-5 pt-4 border-t border-white/20 grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-xs text-teal-100">医療分（年額）</p>
            <p className="font-bold text-lg">{fmt(result.iryo)}円</p>
          </div>
          <div>
            <p className="text-xs text-teal-100">後期高齢者支援金分（年額）</p>
            <p className="font-bold text-lg">{fmt(result.kouki)}円</p>
          </div>
        </div>
      </div>

      {/* 軽減判定バナー */}
      {keiGenMsg && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
          <p className="font-bold mb-1">軽減判定</p>
          <p>{keiGenMsg}</p>
          <p className="mt-1 text-xs text-green-600">
            ※ 軽減は申請不要で自動適用されます。詳細はお住まいの市区町村にご確認ください。
          </p>
        </div>
      )}

      {/* 社会保険との比較 */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900 mb-3">社会保険との比較</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">国民健康保険料（あなたの試算）</span>
            <span className="font-bold text-teal-600">{fmt(result.total)}円/年</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">
              会社員の場合
              <span className="ml-1 text-xs text-gray-400">（年収の約2.5%・会社が半分負担）</span>
            </span>
            <span className="font-bold text-gray-700">{fmt(shakaihokenHonnin)}円/年</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm text-gray-600 font-medium">差額</span>
            <span className={`font-bold text-base ${diff > 0 ? "text-orange-500" : "text-green-600"}`}>
              {diff > 0 ? "+" : ""}
              {fmt(diff)}円/年
              <span className="text-sm ml-1 font-normal">
                （約{fmtMan(Math.abs(diff))}万円{diff > 0 ? "多い" : "少ない"}）
              </span>
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          ※ 社会保険料は標準報酬月額や保険組合によって異なります。あくまで目安です。
        </p>
      </div>

      {/* 所得別保険料テーブル */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-bold text-gray-900 mb-1">所得別 保険料一覧</h2>
        <p className="text-xs text-gray-400 mb-3">
          被保険者数: {members}人 ／ {region}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-2 text-gray-500 font-medium">前年所得</th>
                <th className="text-right py-2 px-2 text-gray-500 font-medium">年間保険料</th>
                <th className="text-right py-2 px-2 text-gray-500 font-medium">月額</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => {
                const isSelected = income === row.man * 10_000;
                return (
                  <tr
                    key={row.man}
                    className={`border-b border-gray-100 transition-colors ${
                      isSelected ? "bg-teal-50 font-bold" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="py-2 px-2 text-gray-800">{row.man}万円</td>
                    <td className="py-2 px-2 text-right text-teal-600">
                      {fmt(row.total)}円
                    </td>
                    <td className="py-2 px-2 text-right text-gray-600">
                      {fmt(row.monthly)}円
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 節約ヒント */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-sm text-teal-800">
        <p className="font-bold mb-2">保険料を節約するヒント</p>
        <ul className="list-disc ml-5 space-y-1">
          <li>
            <span className="font-medium">配偶者の扶養に入る</span>
            ：会社員の配偶者の健康保険の扶養に入ると保険料が0円になります（収入要件あり）
          </li>
          <li>
            <span className="font-medium">軽減制度を確認</span>
            ：所得43万円以下は均等割7割軽減、43万＋29万×加入者数以下は5割軽減が自動適用
          </li>
          <li>
            <span className="font-medium">任意継続被保険者制度</span>
            ：退職後2年間、在職中の保険料（会社負担分も自己負担）で継続できる場合があります
          </li>
          <li>
            <span className="font-medium">法人化を検討</span>
            ：一定の収入を超えると法人の社会保険に加入することで負担が軽減される場合があります
          </li>
          <li>
            <span className="font-medium">所得を把握する</span>
            ：経費を適切に計上して確定申告の所得を正確に算出することが節税の基本です
          </li>
        </ul>
      </div>

      {/* FAQ */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div key={q} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center text-left text-sm font-semibold text-gray-800 hover:text-teal-600 transition-colors"
              >
                <span>{q}</span>
                <span className="text-gray-400 ml-2 shrink-0 text-lg leading-none">
                  {openFaq === i ? "−" : "＋"}
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        ※ 本ツールは全国平均の概算料率を使用しています。実際の保険料はお住まいの市区町村によって異なります。正確な金額は各自治体の窓口またはWebサイトでご確認ください。
      </p>

      <AdBanner />
    </div>
  );
}
