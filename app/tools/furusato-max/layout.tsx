import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ふるさと納税の上限額の計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "(住民税所得割額 × 20%) ÷ (1 - 所得税率 × 1.021 - 10%) + 2,000円 が控除上限額の目安です。年収・扶養家族数・各種控除によって変わります。",
      },
    },
    {
      "@type": "Question",
      name: "ふるさと納税で2,000円を超えて寄付するとどうなりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2,000円を超えた部分が控除されます。上限額を超えた分は通常の寄付として扱われ、所得税からの控除のみとなり住民税から全額控除されません。",
      },
    },
    {
      "@type": "Question",
      name: "住宅ローン控除がある場合の上限額は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "住宅ローン控除が所得税から全額控除されている場合、ふるさと納税の控除が住民税からしか受けられず、実質的な上限額が下がります。",
      },
    },
    {
      "@type": "Question",
      name: "ワンストップ特例と確定申告どちらがいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "給与所得者で寄付先が5自治体以下なら、手続きが簡単なワンストップ特例が便利です。ただし医療費控除など他の確定申告がある場合はワンストップ特例は使えません。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "ふるさと納税上限額計算【2025年版】年収・家族構成から控除上限を計算 | ツールボックス",
  description:
    "ふるさと納税の控除上限額を正確に計算。年収・家族構成・住宅ローン控除の有無から自己負担2,000円で寄付できる上限額を算出。損しない寄付額の目安に。",
  keywords: [
    "ふるさと納税 上限額 計算",
    "ふるさと納税 いくらまで",
    "ふるさと納税 控除上限 計算",
    "ふるさと納税 年収 上限",
    "ふるさと納税 シミュレーション",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/furusato-max",
  },
  openGraph: {
    title: "ふるさと納税上限額計算【2025年版】年収・家族構成から控除上限を計算",
    description:
      "ふるさと納税の控除上限額を正確に計算。年収・家族構成・住宅ローン控除の有無から自己負担2,000円で寄付できる上限額を算出。",
    url: "https://www.toolbox-jp.net/tools/furusato-max",
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
