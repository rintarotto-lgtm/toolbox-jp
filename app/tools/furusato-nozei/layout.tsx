import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ふるさと納税はいくらまでできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ふるさと納税の上限額は年収と家族構成によって異なります。年収400万円・独身の場合は約42,000円、年収600万円では約77,000円が目安です。自己負担2,000円を引いた全額が翌年の住民税から控除されます。",
      },
    },
    {
      "@type": "Question",
      name: "ふるさと納税の仕組みを教えてください",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ふるさと納税は自治体への寄附金のうち、2,000円を超える部分が所得税の還付と翌年の住民税から控除される制度です。返礼品として寄附額の最大3割相当の特産品等を受け取ることができます。",
      },
    },
    {
      "@type": "Question",
      name: "ワンストップ特例とは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ワンストップ特例制度を利用すると確定申告不要でふるさと納税の控除が受けられます。寄附先が5自治体以内で、確定申告が不要な給与所得者が対象です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "ふるさと納税シミュレーター - 上限額を年収から計算 | ツールボックス",
  description: "ふるさと納税の上限額を年収・家族構成から無料計算。自己負担2,000円で控除できる最大金額がわかる。独身・既婚・扶養家族ありの全パターンに対応。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/furusato-nozei",
  },
  openGraph: {
    title: "ふるさと納税シミュレーター - いくらまでできる？",
    description: "年収と家族構成を入力するだけでふるさと納税の上限額を計算。",
    url: "https://www.toolbox-jp.net/tools/furusato-nozei",
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
