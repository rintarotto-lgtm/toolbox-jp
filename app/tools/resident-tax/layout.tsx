import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "住民税計算シミュレーター【2025年版】年収から住民税額を自動計算 | ツールボックス",
  description:
    "年収・各種控除から住民税（市区町村民税＋都道府県民税）を無料計算。所得割・均等割・調整控除まで含めた正確な住民税額をシミュレーション。",
  keywords: [
    "住民税 計算",
    "住民税 年収",
    "住民税 いくら",
    "住民税 シミュレーション",
    "所得割 均等割",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/resident-tax",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "住民税はいつから払い始めますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "前年の所得に対して翌年6月から翌翌年5月に支払います。就職1年目は住民税がかかりません。",
      },
    },
    {
      "@type": "Question",
      name: "住民税の税率はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "所得割は一律10%（市区町村6%+都道府県4%）に均等割5,000円（市区町村3,500円+都道府県1,500円）が加わります。",
      },
    },
    {
      "@type": "Question",
      name: "住民税が非課税になる条件は何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "前年の合計所得が45万円以下（単身）または35万円×家族人数+31万円以下の場合、住民税所得割が非課税になります。",
      },
    },
    {
      "@type": "Question",
      name: "ふるさと納税は住民税にどう影響しますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ふるさと納税の寄付金のうち2,000円を超える部分が住民税から控除されます（上限あり）。",
      },
    },
  ],
};

export default function ResidentTaxLayout({
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
