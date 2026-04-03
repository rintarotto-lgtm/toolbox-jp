import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "住宅ローンの変動金利と固定金利どちらがいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "変動金利は現在低い（0.3〜0.5%程度）ですが金利上昇リスクがあります。固定金利（フラット35等）は1.5〜2%程度ですが返済額が確定します。返済期間中の金利動向の読みと家計の余裕度で選択が重要です。",
      },
    },
    {
      "@type": "Question",
      name: "ローンの繰り上げ返済はいつするのがお得ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "早期の繰り上げ返済ほど利息削減効果が大きいです。残高が多く返済期間が長い早い時期に実行することで、後半より大幅な利息節約になります。",
      },
    },
    {
      "@type": "Question",
      name: "カードローンと消費者金融の違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "金利面ではほぼ同様（年3〜18%程度）ですが、銀行系カードローンの方が金利が低い傾向があります。いずれも住宅・自動車ローンと比べて高金利のため、できるだけ短期返済が重要です。",
      },
    },
    {
      "@type": "Question",
      name: "借り換えで得するローンの条件は何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "残債が多い、残返済期間が長い、金利差が1%以上ある場合に借り換えメリットが大きいとされています。諸費用（登録免許税・保証料等）も考慮した総コスト比較が必要です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "ローン比較計算【複数ローンを一括比較】金利・返済額・総支払額を比較 | ツールボックス",
  description:
    "複数のローンプランを無料比較。借入額・金利・返済期間を入力して月々の返済額・総支払額・利息総額を一括計算。住宅ローン・カーローン・カードローンの比較に。",
  keywords: ["ローン 比較 計算", "金利 比較", "住宅ローン 比較", "ローン 総支払額 計算", "借り換え 比較"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/loan-comparison" },
  openGraph: {
    title: "ローン比較計算【複数ローンを一括比較】金利・返済額・総支払額を比較",
    description: "複数のローンプランを無料比較。月々の返済額・総支払額・利息総額を一括計算。",
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
