import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "住宅ローン借り換えシミュレーター【得する条件を自動判定】削減効果を計算 | ツールボックス",
  description:
    "住宅ローンの借り換えによる利息削減効果を無料計算。現在のローン情報と借り換え後の金利を入力して、月々の返済額変化・総利息削減額・諸費用回収期間を自動計算。",
  keywords: [
    "住宅ローン 借り換え 計算",
    "借り換え 節約 計算",
    "住宅ローン 金利 比較",
    "借り換え メリット 計算",
    "ローン 乗り換え シミュレーション",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/home-loan-switch",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "住宅ローンの借り換えはどんな時にお得ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "残債が1,000万円以上、残返済期間が10年以上、金利差が1%以上の場合に借り換えのメリットが大きいとされています。諸費用を上回る利息削減効果があるかシミュレーションが重要です。",
      },
    },
    {
      "@type": "Question",
      name: "借り換えにかかる諸費用はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "新しいローンの事務手数料（融資額の2%程度）、登記費用（抵当権設定・抹消）、印紙代など合計で50〜100万円程度かかることが多いです。",
      },
    },
    {
      "@type": "Question",
      name: "変動金利から固定金利への借り換えは得ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "現在の変動金利が低い場合でも、将来の金利上昇リスクを回避するために固定に切り替える選択肢があります。ただし固定金利は変動より高いため、金利上昇がない場合は割高になります。",
      },
    },
    {
      "@type": "Question",
      name: "借り換えを断られることはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "収入・勤続年数・健康状態（団信）などによって審査が通らない場合があります。また物件の担保評価が下がっている場合も借り換えが難しいことがあります。",
      },
    },
  ],
};

export default function HomeLoanSwitchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
