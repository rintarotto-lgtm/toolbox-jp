import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "アメリカでのチップの相場はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "レストランでは税引前の15〜20%が一般的です。カフェ・ファストフードは10%程度、タクシーは10〜15%、ホテルのポーターは1〜2ドル/個が目安です。",
      },
    },
    {
      "@type": "Question",
      name: "チップはいつ払わなければなりませんか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "アメリカ・カナダではレストランでのチップは事実上必須です。ヨーロッパは端数をまとめる程度、アジア（日本・中国・韓国など）はチップ不要な国が多いです。",
      },
    },
    {
      "@type": "Question",
      name: "グループで割り勘する際のチップの計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "合計額（税抜き）× チップ率 = チップ額を計算し、合計（税込み+チップ）を人数で割ります。本ツールで自動計算できます。",
      },
    },
    {
      "@type": "Question",
      name: "クレジットカードでチップは払えますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ほとんどのレストランでカード払い時にチップ欄があり、金額を記入できます。カードの明細には合計額が反映されます。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "チップ・割り勘計算【海外旅行対応】人数・税金・チップを含めた1人分を計算 | ツールボックス",
  description:
    "チップ・割り勘を無料計算。飲食代に税金・チップを加えた総額を人数で割り算。チップ率の目安（10〜20%）から金額を自動計算。海外旅行・グループ食事の精算に。",
  keywords: ["チップ 計算", "割り勘 計算", "チップ 金額 計算", "海外 チップ", "割り勘 アプリ"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/tip-calc" },
  openGraph: {
    title: "チップ・割り勘計算【海外旅行対応】人数・税金・チップを含めた1人分を計算",
    description: "チップ・割り勘を無料計算。海外旅行・グループ食事の精算に。",
    url: "https://www.toolbox-jp.net/tools/tip-calc",
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
