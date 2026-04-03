import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "教育費シミュレーター【幼稚園〜大学】子どもの教育にかかる費用を試算 | ツールボックス",
  description:
    "子どもの教育費を幼稚園から大学まで無料シミュレーション。公立・私立の選択や大学の文理・自宅/下宿別に総教育費を計算。月々の積立必要額も表示。",
  keywords: [
    "教育費 計算",
    "子育て 費用 計算",
    "大学費用 シミュレーション",
    "教育費 いくら",
    "子ども 教育費 平均",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/education-cost",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "子ども一人にかかる教育費の総額は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "文科省の調査によると、幼稚園〜高校をすべて公立の場合約574万円、すべて私立の場合約1,838万円です。大学費用を加えると公立文系で約800〜900万円、私立理系で約1,500万円以上になります。",
      },
    },
    {
      "@type": "Question",
      name: "大学費用は4年間でいくらかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "国立大学は初年度約82万円・4年合計約243万円。私立文系は初年度約130万円・4年合計約400万円。私立理系は4年合計約540万円程度です（2024年度概算）。",
      },
    },
    {
      "@type": "Question",
      name: "教育費の積立はいつから始めるべきですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "子どもが生まれたらすぐ始めるのが理想です。学資保険・ジュニアNISAの後継制度（成長投資枠）や投資信託の積立を活用すると効率的です。",
      },
    },
    {
      "@type": "Question",
      name: "幼児教育・保育の無償化とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "3〜5歳の幼稚園・保育所・認定こども園の費用が無料になる制度です。0〜2歳は住民税非課税世帯のみ対象です。",
      },
    },
  ],
};

export default function EducationCostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  );
}
