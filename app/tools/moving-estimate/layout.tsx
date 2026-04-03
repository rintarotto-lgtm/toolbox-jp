import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "引越し費用見積もり【距離・荷物量・時期から概算】引越しの相場を計算 | ツールボックス",
  description:
    "引越し費用の概算を無料計算。現在地・引越し先・荷物量・引越し時期を選ぶだけで費用相場をシミュレーション。単身・家族の引越し費用の目安に。",
  keywords: [
    "引越し費用 計算",
    "引越し 相場 計算",
    "引越し 見積もり",
    "引越し代 目安",
    "単身 引越し 費用",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/moving-estimate",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "引越し費用の相場はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "単身・近距離（同市区内）で2〜5万円、単身・長距離（他県）で5〜15万円程度が目安です。家族（4人）の場合は近距離10〜25万円、長距離30〜70万円程度が相場です。",
      },
    },
    {
      "@type": "Question",
      name: "引越し費用が安い時期はいつですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "4〜9月の閑散期（特に5〜8月）は費用が安い傾向があります。3〜4月の繁忙期は1.5〜2倍以上になることも。平日や午後便も割安です。",
      },
    },
    {
      "@type": "Question",
      name: "引越し費用を抑えるコツはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "複数社への相見積もり（3社以上）が最も効果的です。不用品を事前に処分して荷物を減らす、繁忙期を避ける、午後便を選ぶなども有効です。",
      },
    },
    {
      "@type": "Question",
      name: "引越し費用は経費にできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "転勤・転職による引越しの場合、会社が引越し費用を負担するケースが多いです。個人事業主は事業上の引越しであれば経費計上できる場合があります。",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
