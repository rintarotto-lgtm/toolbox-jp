import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "住宅ローンの月々返済額の計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "元利均等返済方式の場合、月々返済額 = 借入金額 × 月利 × (1+月利)^返済月数 ÷ ((1+月利)^返済月数 - 1) で計算します。例えば借入3,000万円・金利1.5%・35年の場合、月々約91,855円です。",
      },
    },
    {
      "@type": "Question",
      name: "ローンの総返済額はいくらになりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "総返済額 = 月々返済額 × 返済月数 で計算できます。借入3,000万円・金利1.5%・35年の場合、総返済額は約3,858万円（利息合計約858万円）です。",
      },
    },
    {
      "@type": "Question",
      name: "元利均等返済と元金均等返済の違いは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "元利均等返済は毎月の返済額が一定で家計管理がしやすいですが、総利息がやや多くなります。元金均等返済は毎月の返済額が徐々に減りますが、返済初期の負担が大きくなります。このツールは元利均等返済で計算しています。",
      },
    },
    {
      "@type": "Question",
      name: "繰り上げ返済はどのくらい効果がありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "繰り上げ返済は元金を直接減らすため、その後の利息を大幅に削減できます。返済期間の短縮型と月々返済額の軽減型があり、一般的に短縮型のほうが利息削減効果が大きいです。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "ローン計算 - 住宅ローン・借入の返済シミュレーション無料計算 | ツールボックス",
  description: "借入金額・金利・返済期間を入力してローンの月々返済額を計算。元利均等返済方式で総返済額・総利息も表示。返済スケジュール付き。無料オンラインツール。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/loan-calc" },
  openGraph: {
    title: "ローン計算 - 住宅ローン・借入の返済シミュレーション",
    description: "ローンの月々返済額・総返済額・総利息を計算。返済スケジュール表示付き。",
    url: "https://www.toolbox-jp.net/tools/loan-calc",
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
