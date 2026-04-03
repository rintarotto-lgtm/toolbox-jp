"use client";

import { useState, useMemo } from "react";
import AdBanner from "@/components/AdBanner";
import RelatedTools from "@/components/RelatedTools";
import ToolFAQ from "@/components/ToolFAQ";

// 4-point scale options
const SCALE_OPTIONS = [
  { label: "そうだ", value: 4 },
  { label: "まあそうだ", value: 3 },
  { label: "ややちがう", value: 2 },
  { label: "ちがう", value: 1 },
];

interface Question {
  id: number;
  text: string;
  section: "A" | "B" | "C";
  reverse?: boolean; // positive items scored in reverse
}

const QUESTIONS: Question[] = [
  // A. ストレスの原因（仕事の負担）
  { id: 1, text: "非常にたくさんの仕事をしなければならない", section: "A" },
  { id: 2, text: "時間内に仕事が処理しきれない", section: "A" },
  { id: 3, text: "一生懸命働かなければならない", section: "A" },
  { id: 4, text: "かなり注意を集中する必要がある", section: "A" },
  { id: 5, text: "高度の知識や技術が必要な難しい仕事だ", section: "A" },
  { id: 6, text: "勤務時間中はいつも仕事のことを考えていなければならない", section: "A" },

  // B. ストレスの反応（自覚症状）
  { id: 7, text: "活気がわいてくる", section: "B", reverse: true },
  { id: 8, text: "元気がいっぱいだ", section: "B", reverse: true },
  { id: 9, text: "生き生きする", section: "B", reverse: true },
  { id: 10, text: "ひどく疲れた", section: "B" },
  { id: 11, text: "へとへとだ", section: "B" },
  { id: 12, text: "だるい", section: "B" },
  { id: 13, text: "気がはりつめている", section: "B" },
  { id: 14, text: "不安だ", section: "B" },
  { id: 15, text: "落ち着かない", section: "B" },
  { id: 16, text: "憂うつだ", section: "B" },

  // C. 周囲のサポート
  { id: 17, text: "上司は気にかけてくれる", section: "C", reverse: true },
  { id: 18, text: "同僚は気にかけてくれる", section: "C", reverse: true },
  { id: 19, text: "困った時、上司に相談できる", section: "C", reverse: true },
  { id: 20, text: "困った時、同僚に相談できる", section: "C", reverse: true },
];

const SECTION_INFO = {
  A: { label: "A. ストレスの原因（仕事の負担）", count: 6, maxScore: 24 },
  B: { label: "B. ストレスの反応（自覚症状）", count: 10, maxScore: 40 },
  C: { label: "C. 周囲のサポート", count: 4, maxScore: 16 },
};

type Answers = Record<number, number>;

function calcSectionScore(answers: Answers, section: "A" | "B" | "C"): number {
  return QUESTIONS.filter((q) => q.section === section).reduce((sum, q) => {
    const raw = answers[q.id] ?? 0;
    if (!raw) return sum;
    // reverse scored: 4->1, 3->2, 2->3, 1->4
    const score = q.reverse ? 5 - raw : raw;
    return sum + score;
  }, 0);
}

function getStressLevel(scoreA: number, scoreB: number, scoreC: number) {
  // Composite: high A + high B + low C = high stress
  // A max 24, B max 40, C max 16
  // Normalize: higher C means more support (lower stress)
  const stressScore = scoreA + scoreB + (16 - scoreC);
  const maxStress = 24 + 40 + 16; // 80

  if (stressScore <= 30) return { level: "低", color: "text-green-700", bgColor: "bg-green-50 border-green-300", percent: Math.round((stressScore / maxStress) * 100) };
  if (stressScore <= 48) return { level: "中", color: "text-yellow-700", bgColor: "bg-yellow-50 border-yellow-300", percent: Math.round((stressScore / maxStress) * 100) };
  if (stressScore <= 62) return { level: "高", color: "text-orange-700", bgColor: "bg-orange-50 border-orange-300", percent: Math.round((stressScore / maxStress) * 100) };
  return { level: "非常に高い", color: "text-red-700", bgColor: "bg-red-50 border-red-300", percent: Math.round((stressScore / maxStress) * 100) };
}

function getSectionLabel(section: "A" | "B" | "C", score: number, max: number): { label: string; color: string } {
  const ratio = score / max;
  if (section === "C") {
    // Higher is better for support
    if (ratio >= 0.75) return { label: "十分", color: "text-green-600" };
    if (ratio >= 0.5) return { label: "ある程度あり", color: "text-yellow-600" };
    return { label: "不十分", color: "text-red-600" };
  }
  if (ratio <= 0.4) return { label: "低い", color: "text-green-600" };
  if (ratio <= 0.65) return { label: "やや高い", color: "text-yellow-600" };
  if (ratio <= 0.8) return { label: "高い", color: "text-orange-600" };
  return { label: "非常に高い", color: "text-red-600" };
}

export default function StressCheck() {
  const [answers, setAnswers] = useState<Answers>({});
  const [showResult, setShowResult] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = QUESTIONS.length;
  const isComplete = answeredCount === totalQuestions;

  function setAnswer(id: number, value: number) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  const result = useMemo(() => {
    if (!isComplete) return null;
    const scoreA = calcSectionScore(answers, "A");
    const scoreB = calcSectionScore(answers, "B");
    const scoreC = calcSectionScore(answers, "C");
    const stressLevel = getStressLevel(scoreA, scoreB, scoreC);
    const sectionALabel = getSectionLabel("A", scoreA, SECTION_INFO.A.maxScore);
    const sectionBLabel = getSectionLabel("B", scoreB, SECTION_INFO.B.maxScore);
    const sectionCLabel = getSectionLabel("C", scoreC, SECTION_INFO.C.maxScore);
    return { scoreA, scoreB, scoreC, stressLevel, sectionALabel, sectionBLabel, sectionCLabel };
  }, [answers, isComplete]);

  const sections: { key: "A" | "B" | "C"; info: typeof SECTION_INFO.A }[] = [
    { key: "A", info: SECTION_INFO.A },
    { key: "B", info: SECTION_INFO.B },
    { key: "C", info: SECTION_INFO.C },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🧠</span>
          <h1 className="text-2xl font-bold">ストレスチェック・燃え尽き診断</h1>
        </div>
        <p className="text-violet-200 text-sm">
          厚生労働省の職業性ストレス簡易調査票をもとにした20問のストレスチェック。仕事のストレス度と燃え尽き症候群のリスクを診断します。
        </p>
      </div>

      <AdBanner />

      {/* Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>回答済み: {answeredCount} / {totalQuestions}</span>
          <span>{Math.round((answeredCount / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {sections.map(({ key, info }) => (
          <div key={key} className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 mb-1">{info.label}</h2>
            <p className="text-xs text-gray-500 mb-4">
              {key === "C"
                ? "各設問についてあてはまるものを選んでください。"
                : "最近1ヶ月間の状態についてあてはまるものを選んでください。"}
            </p>
            <div className="space-y-4">
              {QUESTIONS.filter((q) => q.section === key).map((q) => (
                <div key={q.id} className="border border-gray-100 rounded-lg p-3">
                  <p className="text-sm text-gray-800 mb-3">
                    <span className="text-violet-600 font-medium mr-2">{q.id}.</span>
                    {q.text}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {SCALE_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAnswer(q.id, opt.value)}
                        className={`py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${
                          answers[q.id] === opt.value
                            ? "bg-violet-600 text-white border-violet-600"
                            : "bg-white text-gray-600 border-gray-200 hover:border-violet-400 hover:text-violet-600"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit */}
      <div className="mt-6 text-center">
        <button
          onClick={() => setShowResult(true)}
          disabled={!isComplete}
          className={`px-8 py-3 rounded-xl font-bold text-white text-sm transition-colors ${
            isComplete
              ? "bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {isComplete ? "診断結果を見る" : `残り${totalQuestions - answeredCount}問回答してください`}
        </button>
      </div>

      {/* Results */}
      {showResult && result && (
        <div className="mt-8 space-y-6">
          {/* Overall Level */}
          <div className={`border-2 rounded-xl p-6 text-center ${result.stressLevel.bgColor}`}>
            <div className="text-xs text-gray-500 mb-1">総合ストレスレベル</div>
            <div className={`text-4xl font-bold mb-2 ${result.stressLevel.color}`}>
              {result.stressLevel.level}
            </div>
            <div className="text-sm text-gray-600">
              ストレス指数: {result.stressLevel.percent}%
            </div>
          </div>

          {/* Section Scores */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-4">3領域のスコア</h3>
            <div className="space-y-4">
              {/* A */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">A. ストレスの原因（仕事負担）</span>
                  <span className={`text-sm font-bold ${result.sectionALabel.color}`}>
                    {result.scoreA} / {SECTION_INFO.A.maxScore} — {result.sectionALabel.label}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full"
                    style={{ width: `${(result.scoreA / SECTION_INFO.A.maxScore) * 100}%` }}
                  />
                </div>
              </div>

              {/* B */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">B. ストレス反応（自覚症状）</span>
                  <span className={`text-sm font-bold ${result.sectionBLabel.color}`}>
                    {result.scoreB} / {SECTION_INFO.B.maxScore} — {result.sectionBLabel.label}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400 rounded-full"
                    style={{ width: `${(result.scoreB / SECTION_INFO.B.maxScore) * 100}%` }}
                  />
                </div>
              </div>

              {/* C */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">C. 周囲のサポート</span>
                  <span className={`text-sm font-bold ${result.sectionCLabel.color}`}>
                    {result.scoreC} / {SECTION_INFO.C.maxScore} — {result.sectionCLabel.label}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full"
                    style={{ width: `${(result.scoreC / SECTION_INFO.C.maxScore) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">※Cは高いほど良い（サポートが充実）</p>
              </div>
            </div>
          </div>

          {/* Advice */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h3 className="font-bold text-gray-900 mb-3">対処法アドバイス</h3>
            {result.stressLevel.level === "低" && (
              <p className="text-sm text-gray-700 leading-relaxed">
                ストレスレベルは低い状態です。現在の良好なメンタルヘルスを維持するために、規則正しい睡眠、適度な運動、趣味の時間を大切にしてください。
              </p>
            )}
            {result.stressLevel.level === "中" && (
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <p>ストレスが蓄積しつつある状態です。以下を意識してみましょう。</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>十分な睡眠（7〜8時間）を確保する</li>
                  <li>週に2〜3回、30分以上の軽い運動を取り入れる</li>
                  <li>信頼できる人に話を聞いてもらう</li>
                  <li>仕事とプライベートの切り替えを意識する</li>
                </ul>
              </div>
            )}
            {result.stressLevel.level === "高" && (
              <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                <p>ストレスが高い状態です。積極的なケアが必要です。</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-600">
                  <li>上司や人事に業務量の相談をする</li>
                  <li>産業医・保健師への相談を検討する</li>
                  <li>休暇を取り、心身を回復させる</li>
                  <li>深呼吸・瞑想・ストレッチなどリラクゼーションを実践する</li>
                </ul>
              </div>
            )}
            {result.stressLevel.level === "非常に高い" && (
              <div className="text-sm text-red-700 leading-relaxed space-y-2 bg-red-50 rounded-lg p-3 border border-red-200">
                <p className="font-bold">ストレスが非常に高い状態です。早急な対処が必要です。</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>一人で抱え込まず、医師や専門家に相談してください</li>
                  <li>今すぐ休養を取ることを優先してください</li>
                  <li>燃え尽き症候群（バーンアウト）のサインの可能性があります</li>
                </ul>
              </div>
            )}
          </div>

          {/* High Stress Support */}
          {(result.stressLevel.level === "高" || result.stressLevel.level === "非常に高い") && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
              <h3 className="font-bold text-purple-900 mb-3">高ストレスの方へ — 相談窓口</h3>
              <ul className="text-sm text-purple-800 space-y-2">
                <li>
                  <span className="font-medium">よりそいホットライン（厚生労働省）</span>
                  <br />
                  <span className="text-purple-600">0120-279-338（24時間対応）</span>
                </li>
                <li>
                  <span className="font-medium">こころの健康相談統一ダイヤル</span>
                  <br />
                  <span className="text-purple-600">0570-064-556</span>
                </li>
                <li>
                  <span className="font-medium">産業医・保健師</span>
                  <br />
                  <span className="text-gray-600">職場の産業医または保健師に相談することをお勧めします。</span>
                </li>
              </ul>
            </div>
          )}

          <div className="text-center">
            <button
              onClick={() => {
                setAnswers({});
                setShowResult(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="text-sm text-violet-600 hover:underline"
            >
              もう一度チェックする
            </button>
          </div>
        </div>
      )}

      <AdBanner />

      <section className="mt-10 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-bold text-gray-900 mb-3">ストレスチェックツールの使い方</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          厚生労働省の職業性ストレス簡易調査票（57項目）をもとにした20問のチェックです。
          「ストレスの原因（仕事負担）」「ストレス反応（自覚症状）」「周囲のサポート」の3領域を4段階で評価し、
          総合ストレスレベルを低・中・高・非常に高いの4段階で判定します。
          回答内容はサーバーに送信されず、ブラウザ上のみで処理されます。
        </p>
      </section>

      <ToolFAQ
        faqs={[
          {
            question: "ストレスチェック制度とは何ですか？",
            answer:
              "50人以上の労働者がいる事業場で年1回の実施が義務付けられている制度です（2015年12月施行）。労働者のメンタルヘルス不調を早期発見・予防することを目的としています。",
          },
          {
            question: "ストレスチェックの結果は会社に知られますか？",
            answer:
              "労働者の同意なく結果が事業者に提供されることはありません。高ストレス者が面接指導を希望した場合のみ、産業医等から事業者に通知されます。",
          },
          {
            question: "高ストレス者とはどういう状態ですか？",
            answer:
              "ストレスチェックの結果が一定の基準を超えた場合（上位10%程度）に高ストレス者と判定されます。医師による面接指導を申し出ることができます。",
          },
          {
            question: "燃え尽き症候群（バーンアウト）の症状は？",
            answer:
              "極度の疲労感・仕事への無気力・達成感のなさが主な症状です。特に真面目で仕事熱心な人に多く見られます。早期に休養・相談することが重要です。",
          },
        ]}
      />

      <RelatedTools currentToolId="stress-check" />

      <p className="text-xs text-gray-400 text-center mt-8">
        本ツールの計算結果は参考情報です。健康に関する判断は必ず医師にご相談ください。
      </p>
    </div>
  );
}
