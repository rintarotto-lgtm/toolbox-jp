import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "インフレ計算【物価上昇シミュレーター】将来の購買力・資産価値を計算 | ツールボックス",
  description:
    "インフレ率から将来の物価・購買力を無料計算。現在の金額が将来どれだけの価値になるか、また過去の金額の現在価値を逆算。貯金の実質価値減少もシミュレーション。",
  keywords: [
    "インフレ 計算",
    "物価上昇 シミュレーション",
    "購買力 計算",
    "インフレ率 計算",
    "実質価値 計算",
  ],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/inflation-calc" },
  openGraph: {
    title: "インフレ計算【物価上昇シミュレーター】将来の購買力・資産価値を計算 | ツールボックス",
    description:
      "インフレ率から将来の物価・購買力を無料計算。現在の金額が将来どれだけの価値になるか、また過去の金額の現在価値を逆算。貯金の実質価値減少もシミュレーション。",
    url: "https://www.toolbox-jp.net/tools/inflation-calc",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "インフレとは何ですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "物価が全体的に上昇し、お金の価値（購買力）が下がる経済現象です。年率2%のインフレが続くと、36年後には現在の100万円の購買力は約50万円相当になります。",
          },
        },
        {
          "@type": "Question",
          name: "日本のインフレ率は現在どのくらいですか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "2024年の日本の消費者物価指数（CPI）上昇率は2〜3%程度で推移しています。日銀の目標インフレ率は2%です。",
          },
        },
        {
          "@type": "Question",
          name: "インフレで貯金はどうなりますか？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "インフレが続くと預金の実質価値が下がります。年2%のインフレで金利0.1%の場合、実質的に毎年約1.9%ずつ貯金の価値が減ることになります。",
          },
        },
        {
          "@type": "Question",
          name: "インフレ対策としての資産運用は？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "株式・不動産・物価連動国債（JGB）・金（ゴールド）などはインフレに強いとされています。現金だけで持ち続けると実質価値が下がるリスクがあります。",
          },
        },
      ],
    }),
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
