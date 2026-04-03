import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "標準体重の計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "標準体重 = 身長(m)² × 22で計算します。身長170cmなら1.7² × 22 = 63.6kgが標準体重です。BMI22が統計的に最も病気になりにくいとされています。",
      },
    },
    {
      "@type": "Question",
      name: "美容体重とシンデレラ体重の違いは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "美容体重はBMI20を基準とした体重で外見的にスリムに見えるとされる体重です。シンデレラ体重はBMI18を基準とした体重で、医学的には「低体重」に相当し健康リスクがある場合もあります。",
      },
    },
    {
      "@type": "Question",
      name: "理想体重を達成するための期間は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "健康的なペースは月1〜2kgの減量（1日約500〜1,000kcalの赤字）です。急激な減量は筋肉量の低下や栄養不足のリスクがあります。",
      },
    },
    {
      "@type": "Question",
      name: "筋肉質な人は体重が重くても問題ないですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BMIは体重と身長のみから計算するため、筋肉量を反映しません。筋肉質な人はBMIが高くても体脂肪率が低く健康な場合があります。体組成（体脂肪率・筋肉量）も合わせて確認することが重要です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "理想体重・標準体重計算【身長から最適体重を計算】BMI目標体重も | ツールボックス",
  description:
    "身長から理想体重・標準体重を無料計算。BMI22を基準とした標準体重、美容体重(BMI20)、シンデレラ体重(BMI18)を算出。目標体重達成のための必要な増減量も表示。",
  keywords: ["理想体重 計算", "標準体重 計算", "身長 体重 理想", "BMI 理想体重", "美容体重 計算"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/ideal-weight" },
  openGraph: {
    title: "理想体重・標準体重計算【身長から最適体重を計算】BMI目標体重も",
    description: "身長から理想体重・標準体重を無料計算。美容体重・シンデレラ体重も算出。",
    url: "https://www.toolbox-jp.net/tools/ideal-weight",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
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
