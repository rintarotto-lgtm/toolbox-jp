import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "睡眠負債計算 - 必要睡眠時間との差と回復日数を無料計算 | ToolBox Japan",
  description: "年齢・実際の睡眠時間から睡眠負債（不足量）を無料計算。1週間の睡眠不足の合計と、完全回復に必要な日数を表示。健康的な睡眠習慣の改善に活用。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "睡眠負債とは何ですか？", acceptedAnswer: { "@type": "Answer", text: "睡眠負債とは、必要な睡眠時間に対する慢性的な睡眠不足の蓄積です。短期的な睡眠不足は数日の休息で回復できますが、長期的な睡眠負債は健康に悪影響を及ぼします。" } },
          { "@type": "Question", name: "大人に必要な睡眠時間はどれくらいですか？", acceptedAnswer: { "@type": "Answer", text: "成人（18〜64歳）の推奨睡眠時間は7〜9時間です。65歳以上は7〜8時間、10代は8〜10時間が推奨されています（米国睡眠財団）。" } },
          { "@type": "Question", name: "週末の寝溜めで睡眠負債は解消できますか？", acceptedAnswer: { "@type": "Answer", text: "部分的な回復は可能ですが、完全な解消はできません。週末に2〜3時間多く寝ても、平日の不足分を完全には補えません。毎日の規則正しい睡眠が最も効果的です。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
