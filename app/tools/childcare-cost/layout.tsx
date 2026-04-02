import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "保育料はどのように計算されますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "認可保育所の保育料は、世帯の市町村民税額（住民税所得割額）に基づいた階層区分によって決まります。市町村民税額が高いほど保育料も高くなる累進制で、同じ施設でも年収によって保育料が異なります。各市区町村が国の基準を参考に上限内で独自に設定しています。",
      },
    },
    {
      "@type": "Question",
      name: "幼児教育・保育の無償化の対象は誰ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2019年10月から始まった幼児教育・保育の無償化により、3歳〜5歳児クラスの子どもは認可保育所・幼稚園・認定こども園などの利用料が無料になります。0〜2歳児クラスは住民税非課税世帯のみ無償化の対象です。ただし給食費（副食費）や延長保育料などは実費負担となります。",
      },
    },
    {
      "@type": "Question",
      name: "副食費（給食費）はいくらかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "3歳以上児の副食費（おかず代）は月額4,500円が目安です。ただし年収360万円未満相当の世帯や第3子以降などは免除される場合があります。主食費（ごはん代）は別途実費負担となる施設もあります。金額は施設によって異なりますので、入園予定の施設に確認してください。",
      },
    },
    {
      "@type": "Question",
      name: "認可外保育施設の場合はどうなりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "認可外保育施設（認証保育所・企業主導型保育所など）は施設ごとに料金を自由に設定できます。3〜5歳児クラスは無償化の対象ですが、上限額は月3.7万円です。0〜2歳児の住民税非課税世帯は月4.2万円が上限です。認可外は認可より料金が高い場合が多く、差額は自己負担となります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "保育料シミュレーター - 無償化後の実質負担額を計算 | ツールボックス",
  description:
    "保育料（認可保育所）の月額を年収から計算。3歳以上の幼児教育無償化・副食費・延長保育料も含めた実質負担額をシミュレーション。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/childcare-cost",
  },
  openGraph: {
    title: "保育料シミュレーター - 無償化後の実質負担額を計算",
    description:
      "年収・子どもの年齢から保育料を計算。3歳以上無償化・副食費・延長保育料も含めた実質負担額がわかります。",
    url: "https://www.toolbox-jp.net/tools/childcare-cost",
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
