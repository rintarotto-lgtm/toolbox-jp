import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "贈与税の基礎控除110万円とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "贈与税には年間110万円の基礎控除があります。1年間（1月1日〜12月31日）に受け取った贈与の合計額が110万円以下であれば、贈与税はかかりません。110万円を超えた部分に対して税率が適用されます。",
      },
    },
    {
      "@type": "Question",
      name: "暦年贈与と相続時精算課税の違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "暦年贈与は毎年110万円の基礎控除を使って少額ずつ贈与する方法です。相続時精算課税は60歳以上の父母・祖父母から18歳以上の子・孫への贈与に適用でき、累計2,500万円まで贈与税が非課税になります。ただし相続時精算課税を選ぶと暦年贈与の110万円控除は使えなくなるため、どちらが有利かは状況によります。",
      },
    },
    {
      "@type": "Question",
      name: "贈与税が非課税になるケースはありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "年間110万円以下の贈与のほか、住宅取得等資金の贈与（最大1,000万円）、教育資金の一括贈与（最大1,500万円）、結婚・子育て資金の一括贈与（最大1,000万円）などの特例があります。また、夫婦間の居住用不動産贈与（最大2,000万円）も非課税となる場合があります。",
      },
    },
    {
      "@type": "Question",
      name: "贈与税の申告期限はいつですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "贈与税の申告期限は、贈与を受けた年の翌年2月1日から3月15日までです。110万円の基礎控除を超えた場合は申告が必要です。申告期限を過ぎると無申告加算税や延滞税が発生する場合がありますので注意が必要です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "贈与税計算シミュレーター - 年間110万円を超えたらいくら？ | ツールボックス",
  description:
    "贈与税の税額を無料計算。年間110万円の基礎控除を超えた分にかかる贈与税を計算。一般税率・特例税率（直系尊属からの贈与）の比較も。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/gift-tax",
  },
  openGraph: {
    title: "贈与税計算シミュレーター - 年間110万円を超えたらいくら？",
    description:
      "贈与金額と続柄を入力するだけで贈与税を自動計算。一般税率・特例税率（直系尊属）の比較も。",
    url: "https://www.toolbox-jp.net/tools/gift-tax",
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
