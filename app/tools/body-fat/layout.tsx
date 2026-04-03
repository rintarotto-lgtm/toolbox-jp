import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "体脂肪率計算【海軍式・BMI法】身体測定から体脂肪率を推定 | ツールボックス",
  description:
    "体脂肪率を無料計算。ウエスト・身長・体重から海軍式・BMI法で体脂肪率を推定。理想体脂肪率との比較・体脂肪量・除脂肪体重も算出。",
  keywords: [
    "体脂肪率 計算",
    "体脂肪率 推定",
    "体脂肪 計算方法",
    "体組成 計算",
    "除脂肪体重 計算",
  ],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/body-fat" },
  openGraph: {
    title: "体脂肪率計算【海軍式・BMI法】身体測定から体脂肪率を推定 | ツールボックス",
    description:
      "体脂肪率を無料計算。ウエスト・身長・体重から海軍式・BMI法で体脂肪率を推定。理想体脂肪率との比較・体脂肪量・除脂肪体重も算出。",
    url: "https://www.toolbox-jp.net/tools/body-fat",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "体脂肪率の理想的な数値は？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "成人男性は15〜20%、成人女性は20〜25%が標準的です。アスリートは男性8〜12%、女性14〜18%程度です。30%以上は肥満とされます。",
          },
        },
        {
          "@type": "Question",
          name: "体脂肪率の計算方法は？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "家庭用体脂肪計は生体インピーダンス法を使用します。本ツールは身体測定から推定する海軍式（ネイビーメソッド）とBMIを使った推定式を使用しています。",
          },
        },
        {
          "@type": "Question",
          name: "内臓脂肪と皮下脂肪の違いは？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "内臓脂肪はお腹の臓器周りにつく脂肪で生活習慣病リスクが高く、皮下脂肪は皮膚の下につく脂肪です。内臓脂肪はウエストサイズで推測できます。",
          },
        },
        {
          "@type": "Question",
          name: "体脂肪率を下げるには？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "有酸素運動（ジョギング・水泳など）で体脂肪を燃焼し、筋トレで基礎代謝を上げることが効果的です。食事は高タンパク・低脂質を意識し、カロリー収支を管理しましょう。",
          },
        },
      ],
    }),
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
