import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "iDeCoで年間いくら節税できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "iDeCoの節税額は掛金と所得税率によります。年収500万円の会社員が月23,000円掛けた場合、年間約62,100円（所得税＋住民税）の節税になります。",
      },
    },
    {
      "@type": "Question",
      name: "iDeCoの掛金上限はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "掛金上限は職業によって異なります。会社員（企業年金なし）は月23,000円、自営業・フリーランスは月68,000円、公務員は月12,000円、専業主婦(夫)は月23,000円が上限です。",
      },
    },
    {
      "@type": "Question",
      name: "iDeCoはいつから始めるべきですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "iDeCoは早く始めるほど複利効果と節税効果が高まります。20〜30代から始めると60歳時の受取額が大きく増えます。ただし60歳まで原則引き出せないため、生活費の余剰資金で始めることをおすすめします。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "iDeCo節税シミュレーター - 年間いくら節税できる？ | ツールボックス",
  description: "iDeCo（個人型確定拠出年金）で年間いくら節税できるか計算。会社員・自営業・公務員の掛金上限と節税額、60歳時の受取額シミュレーション。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/ideco-calc",
  },
  openGraph: {
    title: "iDeCo節税シミュレーター - 掛金と節税額を計算",
    description: "iDeCoの年間節税額と60歳時の受取額を簡単計算。",
    url: "https://www.toolbox-jp.net/tools/ideco-calc",
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
