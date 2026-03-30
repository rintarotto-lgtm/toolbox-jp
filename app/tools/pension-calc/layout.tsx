import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "年金はいくらもらえますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "年金受給額は加入期間と平均年収によって異なります。会社員の場合、老齢基礎年金（国民年金）＋老齢厚生年金の合計が受け取れます。平均的なサラリーマンで月額約14〜16万円程度が目安です。",
      },
    },
    {
      "@type": "Question",
      name: "年金の受給開始年齢はいつですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "原則65歳からですが、60〜75歳の間で選択できます。65歳より早く受け取ると減額（最大24%減）、遅くすると増額（最大84%増）されます。",
      },
    },
    {
      "@type": "Question",
      name: "繰り下げ受給はお得ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1ヶ月遅らせるごとに0.7%増額されます。75歳まで遅らせると最大84%増。損益分岐点は約80歳前後です。健康状態や家族状況を考慮して判断してください。",
      },
    },
    {
      "@type": "Question",
      name: "老齢基礎年金と老齢厚生年金の違いは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "老齢基礎年金は国民全員が対象で、40年加入で満額約81万6,000円/年（2025年度）。老齢厚生年金は会社員・公務員が対象で、現役時代の年収と加入期間で決まります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "年金受給額シミュレーター - いくらもらえる？無料計算 | ツールボックス",
  description:
    "年金はいくらもらえる？加入年数・年収・受給開始年齢を入力するだけで老齢基礎年金＋厚生年金の受給額を無料シミュレーション。繰り上げ・繰り下げ比較も。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/pension-calc",
  },
  openGraph: {
    title: "年金受給額シミュレーター - いくらもらえる？",
    description:
      "年収・加入年数から年金受給額を計算。繰り上げ・繰り下げ受給の比較も。",
    url: "https://www.toolbox-jp.net/tools/pension-calc",
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
