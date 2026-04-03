"use client";

import { useState } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";

type BloodType = "A" | "B" | "O" | "AB";
type Gender = "male" | "female";
type Mode = "diagnosis" | "compatibility" | "parent";

// ─── 性格データ
const PERSONALITY: Record<BloodType, {
  keywords: string[];
  strengths: string[];
  weaknesses: string[];
  workStyle: string;
  romance: string;
  friendship: string;
  ratio?: string;
}> = {
  A: {
    keywords: ["几帳面", "真面目", "完璧主義", "慎重", "誠実", "協調性"],
    strengths: ["計画性がある", "責任感が強い", "細かいところに気づく", "約束を守る", "チームワークを大切にする"],
    weaknesses: ["心配性になりやすい", "融通が利きにくい", "ストレスをため込む", "完璧を求めすぎる"],
    workStyle: "計画通りに物事を進めるのが得意。ルールや手順を重視し、ミスなく丁寧にこなす。チームでの協調を大切にする。",
    romance: "慎重で真剣な恋愛をする傾向。相手に対して誠実で、長続きする関係を好む。嫉妬心が強い面も。",
    friendship: "少数の親しい友人を大切にする。信頼関係ができると非常に誠実で、友情を長く続ける。",
  },
  B: {
    keywords: ["自由", "マイペース", "好奇心旺盛", "個性的", "直感的", "明るい"],
    strengths: ["行動力がある", "好奇心が強く新しいことに挑戦", "個性的で独創的", "明るく場を盛り上げる", "ストレスをため込まない"],
    weaknesses: ["気分にムラがある", "飽きやすい", "空気を読まないことがある", "自己中心的に見られることも"],
    workStyle: "自分のペースで集中できる環境が得意。創造性を活かした仕事が向いている。締め切り直前に本領を発揮する。",
    romance: "情熱的で直感的な恋愛をする。好きになったら積極的だが、束縛を嫌う。自由を尊重し合える関係が理想。",
    friendship: "広く浅く付き合う傾向。場の雰囲気を明るくし、誰とでも仲良くなれる。深い友情も作れるが時間がかかる。",
  },
  O: {
    keywords: ["リーダーシップ", "大らか", "情熱的", "おおざっぱ", "度量が広い", "社交的"],
    strengths: ["リーダーシップがある", "大らかで細かいことを気にしない", "社交的で人気者", "目標に向かって粘り強い", "人の話をよく聞く"],
    weaknesses: ["おおざっぱすぎることがある", "頑固な一面がある", "嫉妬や独占欲が強い", "感情的になりやすい"],
    workStyle: "大局を見て判断するのが得意。人をまとめるリーダー的な役割が向いている。細かい作業より全体の流れを掌握する仕事に強い。",
    romance: "情熱的で一途な恋愛をする。好きな人への独占欲が強め。どっしりとした安心感を与えてくれるパートナー。",
    friendship: "面倒見がよく友人が多い。グループのムードメーカーになりやすい。一度仲良くなると長続きする友情を持つ。",
  },
  AB: {
    keywords: ["二面性", "独特", "合理的", "クール", "芸術的", "ミステリアス"],
    strengths: ["多面的な思考ができる", "合理的で冷静な判断", "独自のセンスがある", "適応力が高い", "感受性が豊か"],
    weaknesses: ["気分の波が激しい", "神経質になることがある", "二面性で周囲を戸惑わせる", "一人の時間が必要でクールに見られる"],
    workStyle: "分析力・創造力の両方を活かせる仕事が向いている。単独で深く考える作業も得意。変化への対応力が高い。",
    romance: "合理的に見えて実は感受性が豊か。好きな人には別の顔を見せる。自立した関係を好み、干渉されすぎると距離を置く。",
    friendship: "少数精鋭の深い友人関係を好む。表面上はクールに見えるが、親しい人には別の一面を見せる。",
  },
};

// ─── 相性データ（全16パターン）
type CompatKey = `${BloodType}-${BloodType}`;
const COMPATIBILITY: Record<CompatKey, { score: number; comment: string; good: string; caution: string }> = {
  "A-A": { score: 75, comment: "価値観が近く安心できる関係。同じ几帳面さゆえに、お互いのこだわりがぶつかることも。", good: "共感しやすく、安定した信頼関係を築ける", caution: "お互いにストレスをため込まないよう発散が必要" },
  "A-B": { score: 55, comment: "慎重なA型と自由なB型は正反対。刺激的だが、価値観のズレを理解し合う努力が必要。", good: "お互いにない面を補い合えると充実する", caution: "ペースや几帳面さの違いを尊重することが大切" },
  "A-O": { score: 70, comment: "A型の細かさとO型の大らかさは補完関係。O型がリードし、A型がサポートする形がうまくいく。", good: "役割分担がはっきりしてバランスが取れる", caution: "A型が細かいことを気にしすぎないよう注意" },
  "A-AB": { score: 65, comment: "A型の誠実さとAB型の合理性は好相性。AB型の二面性にA型が戸惑うことがある。", good: "互いに誠実で知的な対話ができる", caution: "AB型の気分の波に振り回されないようにを" },
  "B-A": { score: 55, comment: "慎重なA型と自由なB型は正反対。刺激的だが、価値観のズレを理解し合う努力が必要。", good: "お互いにない面を補い合えると充実する", caution: "ペースや几帳面さの違いを尊重することが大切" },
  "B-B": { score: 70, comment: "同じマイペース同士。気が合いノリが合うが、両者がマイペースすぎると関係が進まないことも。", good: "束縛なく自由に楽しめる明るい関係", caution: "お互い受け身にならず積極的に関わることが大切" },
  "B-O": { score: 80, comment: "B型の個性とO型の包容力は好相性。O型がB型を温かく受け入れ、明るい関係が続く。", good: "B型の自由をO型が大らかに受け入れてくれる", caution: "O型の嫉妬心とB型の気まぐれが衝突することも" },
  "B-AB": { score: 65, comment: "個性派同士で刺激的な関係。AB型の合理性がB型を上手く引っ張ることがある。", good: "独自の世界観を共有できるユニークな関係", caution: "両者とも気分にムラがあるため、衝突に注意" },
  "O-A": { score: 70, comment: "O型の包容力でA型を包んでくれる。O型がリード役になることが多い。", good: "O型の大らかさがA型のストレスを和らげる", caution: "O型の大雑把さがA型を不安にさせることも" },
  "O-B": { score: 80, comment: "B型の個性とO型の包容力は好相性。O型がB型を温かく受け入れ、明るい関係が続く。", good: "B型の自由をO型が大らかに受け入れてくれる", caution: "O型の嫉妬心とB型の気まぐれが衝突することも" },
  "O-O": { score: 72, comment: "同じ大らかさで気が合い楽しい関係。ただし両者おおざっぱなため、細かい部分が疎かになることも。", good: "大きな目標に向かって一緒に頑張れるパートナー", caution: "細かいこと（家事・約束）が後回しになりやすい" },
  "O-AB": { score: 68, comment: "O型の情熱とAB型の冷静さは対照的。AB型の合理性がO型を落ち着かせてくれる。", good: "O型の行動力とAB型の分析力が上手く噛み合う", caution: "O型の感情的な面とAB型のクールさがすれ違うことも" },
  "AB-A": { score: 65, comment: "AB型の二面性にA型が戸惑うことがあるが、互いの誠実さで補い合える。", good: "知的な対話と深い信頼関係が築ける", caution: "AB型の気分の波をA型が理解することが大切" },
  "AB-B": { score: 65, comment: "個性派同士で刺激的な関係。AB型の合理性がB型を上手く引っ張ることがある。", good: "独自の世界観を共有できるユニークな関係", caution: "両者とも気分にムラがあるため、衝突に注意" },
  "AB-O": { score: 68, comment: "O型の情熱とAB型の冷静さは対照的。AB型の合理性がO型を落ち着かせてくれる。", good: "O型の行動力とAB型の分析力が上手く噛み合う", caution: "O型の感情的な面とAB型のクールさがすれ違うことも" },
  "AB-AB": { score: 60, comment: "不思議と惹かれ合うAB型同士。二面性が重なり合って深い理解が生まれることも、衝突することも。", good: "誰も理解しない独特の感性を共有できる", caution: "気分の波が重なると関係が不安定になることも" },
};

// ─── 血液型遺伝の法則（ABO式）
// 遺伝子型マッピング
const GENOTYPES: Record<BloodType, string[]> = {
  A: ["AA", "AO"],
  B: ["BB", "BO"],
  O: ["OO"],
  AB: ["AB"],
};

function getPossibleChildTypes(father: BloodType, mother: BloodType): { type: BloodType; note: string }[] {
  const fatherGenes = GENOTYPES[father];
  const motherGenes = GENOTYPES[mother];
  const possibleTypes = new Set<BloodType>();

  for (const fg of fatherGenes) {
    for (const mg of motherGenes) {
      const alleles = [fg[0], fg[1], mg[0], mg[1]];
      // 子の遺伝子型は父から1つ、母から1つ
      for (const fa of [fg[0], fg[1]]) {
        for (const ma of [mg[0], mg[1]]) {
          const childAlleles = [fa, ma].sort().join("");
          if (childAlleles === "AA" || childAlleles === "AO" || childAlleles === "OA") possibleTypes.add("A");
          else if (childAlleles === "BB" || childAlleles === "BO" || childAlleles === "OB") possibleTypes.add("B");
          else if (childAlleles === "OO") possibleTypes.add("O");
          else if (childAlleles === "AB" || childAlleles === "BA") possibleTypes.add("AB");
        }
      }
      void alleles;
    }
  }

  const results: { type: BloodType; note: string }[] = [];
  const allPossible: BloodType[] = ["A", "B", "O", "AB"];
  for (const t of allPossible) {
    if (possibleTypes.has(t)) {
      results.push({ type: t, note: "生まれる可能性あり" });
    }
  }
  return results;
}

// ─── FAQ
const FAQS = [
  {
    question: "血液型で性格が決まるのは本当ですか？",
    answer:
      "科学的根拠はなく、心理学では「血液型性格判断」の信頼性は否定されています。ただし日本では文化的な話題として親しまれており、コミュニケーションのきっかけとして楽しまれています。",
  },
  {
    question: "日本人の血液型の割合は？",
    answer:
      "A型約38%、O型約31%、B型約22%、AB型約9%とされています。地域によっても多少異なります。",
  },
  {
    question: "血液型が分からない場合はどうすれば良いですか？",
    answer:
      "病院・献血センターで検査できます。また親の血液型から子どもの血液型を推定することも可能です（メンデルの法則）。",
  },
  {
    question: "血液型と病気の関係はありますか？",
    answer:
      "一部の研究でO型は血液が固まりにくい、A型は胃がんリスクがやや高いなどの統計的傾向が報告されています。ただし個人差が大きく、血液型だけで健康リスクを判断することは適切ではありません。",
  },
];

const BLOOD_TYPES: BloodType[] = ["A", "B", "O", "AB"];

const TYPE_COLORS: Record<BloodType, string> = {
  A: "bg-red-100 text-red-700 border-red-200",
  B: "bg-blue-100 text-blue-700 border-blue-200",
  O: "bg-green-100 text-green-700 border-green-200",
  AB: "bg-purple-100 text-purple-700 border-purple-200",
};

const TYPE_ACCENT: Record<BloodType, string> = {
  A: "text-red-600",
  B: "text-blue-600",
  O: "text-green-600",
  AB: "text-purple-600",
};

export default function BloodTypePage() {
  const [mode, setMode] = useState<Mode>("diagnosis");
  const [myType, setMyType] = useState<BloodType>("A");
  const [gender, setGender] = useState<Gender>("male");
  const [partnerType, setPartnerType] = useState<BloodType>("O");
  const [fatherType, setFatherType] = useState<BloodType>("A");
  const [motherType, setMotherType] = useState<BloodType>("O");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const personality = PERSONALITY[myType];
  const compatKey = `${myType}-${partnerType}` as CompatKey;
  const compat = COMPATIBILITY[compatKey];
  const childTypes = getPossibleChildTypes(fatherType, motherType);

  const MODES: { type: Mode; label: string }[] = [
    { type: "diagnosis", label: "血液型診断" },
    { type: "compatibility", label: "相性チェック" },
    { type: "parent", label: "親子血液型" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* ─── Hero ─── */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🩸</span>
          <h1 className="text-2xl font-bold">血液型・性格診断ツール</h1>
        </div>
        <p className="text-sm opacity-90">
          A・B・O・AB型の性格特徴・相性・親子血液型をチェック。コミュニケーションのヒントにお役立てください。
        </p>
      </div>

      <AdBanner />

      {/* ─── モードタブ ─── */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {MODES.map(({ type, label }) => (
          <button
            key={type}
            onClick={() => setMode(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              mode === type
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-700 border-gray-300 hover:bg-red-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ─── 血液型診断モード ─── */}
      {mode === "diagnosis" && (
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-4">あなたの血液型を選んでください</h2>
            <div className="grid grid-cols-4 gap-3 mb-5">
              {BLOOD_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setMyType(t)}
                  className={`py-3 rounded-xl text-xl font-extrabold border-2 transition-all ${
                    myType === t
                      ? "border-red-400 bg-red-50 scale-105 shadow-sm"
                      : "border-gray-200 bg-white hover:bg-red-50"
                  } ${TYPE_ACCENT[t]}`}
                >
                  {t}型
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              {(["male", "female"] as Gender[]).map((g) => (
                <label key={g} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={() => setGender(g)}
                    className="accent-red-500"
                  />
                  <span className="text-sm text-gray-700">{g === "male" ? "男性" : "女性"}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 結果カード */}
          <div className={`rounded-2xl p-6 border-2 ${TYPE_COLORS[myType]} shadow-sm`}>
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-5xl font-extrabold ${TYPE_ACCENT[myType]}`}>{myType}型</span>
              <span className="text-sm text-gray-600">{gender === "male" ? "男性" : "女性"}</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {personality.keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2 py-0.5 rounded-full text-xs font-medium bg-white/70 border border-current"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-green-700 mb-2">長所</h3>
              <ul className="space-y-1">
                {personality.strengths.map((s) => (
                  <li key={s} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5">✓</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-red-600 mb-2">短所・注意点</h3>
              <ul className="space-y-1">
                {personality.weaknesses.map((w) => (
                  <li key={w} className="text-sm text-gray-700 flex items-start gap-1.5">
                    <span className="text-red-400 mt-0.5">!</span>{w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
            {[
              { label: "仕事スタイル", content: personality.workStyle },
              { label: "恋愛傾向", content: personality.romance },
              { label: "友人関係", content: personality.friendship },
            ].map(({ label, content }) => (
              <div key={label}>
                <p className="text-xs font-bold text-gray-500 mb-1">{label}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 相性チェックモード ─── */}
      {mode === "compatibility" && (
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-5">2人の血液型を選んでください</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 text-center">自分</p>
                <div className="grid grid-cols-2 gap-2">
                  {BLOOD_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setMyType(t)}
                      className={`py-2.5 rounded-xl text-base font-extrabold border-2 transition-all ${
                        myType === t
                          ? "border-red-400 bg-red-50 scale-105 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-red-50"
                      } ${TYPE_ACCENT[t]}`}
                    >
                      {t}型
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 text-center">相手</p>
                <div className="grid grid-cols-2 gap-2">
                  {BLOOD_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setPartnerType(t)}
                      className={`py-2.5 rounded-xl text-base font-extrabold border-2 transition-all ${
                        partnerType === t
                          ? "border-pink-400 bg-pink-50 scale-105 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-pink-50"
                      } ${TYPE_ACCENT[t]}`}
                    >
                      {t}型
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 相性結果 */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-3xl font-extrabold">{myType}型</span>
              <span className="text-2xl opacity-70">×</span>
              <span className="text-3xl font-extrabold">{partnerType}型</span>
            </div>
            {/* CSS円グラフ */}
            <div className="flex justify-center mb-4">
              <div className="relative w-28 h-28">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3.8" />
                  <circle
                    cx="18" cy="18" r="15.9"
                    fill="none"
                    stroke="white"
                    strokeWidth="3.8"
                    strokeDasharray={`${compat.score} ${100 - compat.score}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-extrabold">{compat.score}%</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-center leading-relaxed opacity-90">{compat.comment}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-green-700 mb-2">うまくいく点</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{compat.good}</p>
            </div>
            <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-orange-600 mb-2">注意ポイント</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{compat.caution}</p>
            </div>
          </div>

          {/* 全パターン相性テーブル */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3">{myType}型の全相性一覧</h3>
            <div className="space-y-2">
              {BLOOD_TYPES.map((pt) => {
                const key = `${myType}-${pt}` as CompatKey;
                const c = COMPATIBILITY[key];
                return (
                  <div
                    key={pt}
                    className={`flex items-center gap-3 rounded-lg p-2.5 cursor-pointer transition-colors ${
                      pt === partnerType ? "bg-red-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setPartnerType(pt)}
                  >
                    <span className={`w-10 text-center font-bold text-base ${TYPE_ACCENT[pt]}`}>{pt}型</span>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-400 to-pink-400 rounded-full"
                        style={{ width: `${c.score}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 w-10 text-right">{c.score}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── 親子血液型モード ─── */}
      {mode === "parent" && (
        <div className="space-y-5">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-800 mb-5">両親の血液型を選んでください</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 text-center">父</p>
                <div className="grid grid-cols-2 gap-2">
                  {BLOOD_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setFatherType(t)}
                      className={`py-2.5 rounded-xl text-base font-extrabold border-2 transition-all ${
                        fatherType === t
                          ? "border-blue-400 bg-blue-50 scale-105 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-blue-50"
                      } ${TYPE_ACCENT[t]}`}
                    >
                      {t}型
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 mb-2 text-center">母</p>
                <div className="grid grid-cols-2 gap-2">
                  {BLOOD_TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setMotherType(t)}
                      className={`py-2.5 rounded-xl text-base font-extrabold border-2 transition-all ${
                        motherType === t
                          ? "border-pink-400 bg-pink-50 scale-105 shadow-sm"
                          : "border-gray-200 bg-white hover:bg-pink-50"
                      } ${TYPE_ACCENT[t]}`}
                    >
                      {t}型
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 結果 */}
          <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-1">
              {fatherType}型（父）× {motherType}型（母）の子どもに生まれ得る血液型
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              {childTypes.length > 0 ? (
                childTypes.map(({ type }) => (
                  <span
                    key={type}
                    className="px-5 py-2 bg-white/20 rounded-full text-xl font-extrabold border border-white/40"
                  >
                    {type}型
                  </span>
                ))
              ) : (
                <span className="text-sm opacity-80">この組み合わせでは生まれません</span>
              )}
            </div>
            {childTypes.length > 0 && childTypes.length < 4 && (
              <p className="text-xs opacity-75 mt-3">
                ※ 上記以外の血液型は遺伝的に生まれません（例外あり）
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 mb-2">ABO血液型の遺伝の仕組み</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              血液型はA・B・O・ABの4種類で、遺伝子レベルではA・B・Oの3つの対立遺伝子があります。
              A型はAA型またはAO型、B型はBB型またはBO型、O型はOO型のみ、AB型はAB型のみです。
              子どもは父と母からそれぞれ1つずつ遺伝子を受け継ぐため、血液型が決まります（メンデルの法則）。
            </p>
          </div>

          {/* 全組み合わせ早見表 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3">血液型遺伝 早見表</h3>
            <div className="overflow-x-auto -mx-2">
              <table className="text-xs w-full">
                <thead>
                  <tr>
                    <th className="py-1.5 px-2 text-left text-gray-400 font-medium">父＼母</th>
                    {BLOOD_TYPES.map((t) => (
                      <th key={t} className={`py-1.5 px-2 font-bold ${TYPE_ACCENT[t]}`}>{t}型</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BLOOD_TYPES.map((f) => (
                    <tr key={f} className="border-t border-gray-100">
                      <td className={`py-2 px-2 font-bold ${TYPE_ACCENT[f]}`}>{f}型</td>
                      {BLOOD_TYPES.map((m) => {
                        const children = getPossibleChildTypes(f, m);
                        const isActive = f === fatherType && m === motherType;
                        return (
                          <td
                            key={m}
                            className={`py-2 px-2 cursor-pointer rounded transition-colors ${
                              isActive ? "bg-red-100 font-bold" : "hover:bg-gray-50"
                            }`}
                            onClick={() => { setFatherType(f); setMotherType(m); }}
                          >
                            {children.map((c) => c.type).join("/")}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <AdBanner />

      {/* ─── FAQ ─── */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 mt-6 shadow-sm">
        <h2 className="text-base font-bold text-gray-900 mb-4">よくある質問</h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left flex justify-between items-center text-sm font-semibold text-gray-800 hover:text-red-500"
              >
                <span>{faq.question}</span>
                <span className="text-gray-400 ml-2 shrink-0">{openFaq === i ? "−" : "＋"}</span>
              </button>
              {openFaq === i && (
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <RelatedTools currentToolId="blood-type" />

      <p className="text-xs text-gray-400 leading-relaxed mt-4">
        ※ 血液型と性格の関係に科学的な根拠はありません。このツールはエンターテインメント目的で提供しています。
        血液型によって個人を判断したり、差別的な目的で使用しないでください。
        なお、このツールはブラウザ上で完結し、入力情報がサーバーに送信されることは一切ありません。
      </p>
    </div>
  );
}
