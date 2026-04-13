import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "変動金利と固定金利どちらがいい？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "固定金利は返済額が変わらず安定していますが、変動金利より高めに設定されています。変動金利は低金利ですが、金利上昇リスクがあります。ライフプランや金利動向を踏まえて選択することが重要です。",
      },
    },
    {
      "@type": "Question",
      name: "繰り上げ返済はどの時点でするのがいい？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "繰り上げ返済は早いほど利息の節約効果が大きくなります。ただし手元資金（生活費6ヶ月分程度）は確保しておくことが重要です。まず高金利ローンから返済するのが基本です。",
      },
    },
    {
      "@type": "Question",
      name: "金利0.1%の差はどのくらい影響する？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "3,000万円・30年ローンで金利0.1%の差は、総返済額に約50〜80万円の違いが生じることがあります。少しの金利差でも長期間では大きな差になるため、複数のローンを比較することが重要です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "ローン比較計算 - 複数ローンを一覧比較・月返済額と総利息を計算 | ツールボックス",
  description:
    "複数のローンを横並びで比較。借入金額・金利・返済期間を入力するだけで月返済額・総返済額・利息総額を一覧表示。住宅ローン・カーローン・教育ローンの比較に。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/loan-comparison" },
  openGraph: {
    title: "ローン比較計算 - 複数ローンを並べて比較",
    description:
      "月返済額・総返済額・利息総額を複数ローンで一覧比較。最安ローンをハイライト表示。",
    url: "https://www.toolbox-jp.net/tools/loan-comparison",
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
