import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "育児休業給付金はいくらもらえますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "育児休業給付金は、育休開始から180日（約6ヶ月）は月収の67%、181日目以降は月収の50%が支給されます。ただし上限があり、基本月額の上限は450,300円（2024年度）です。月収30万円の場合、最初の6ヶ月は月約20.1万円、その後は月約15万円が目安です。",
      },
    },
    {
      "@type": "Question",
      name: "育休給付金の計算方法を教えてください。",
      acceptedAnswer: {
        "@type": "Answer",
        text: "計算式は「休業開始時賃金日額 × 支給日数 × 給付率」です。賃金日額は育休前6ヶ月の賃金総額を180で割った額で決まります。シミュレーターでは月収（額面）を入力すると自動計算されます。上限額は月収換算で450,300円に相当します。",
      },
    },
    {
      "@type": "Question",
      name: "育児休業給付金はいつまでもらえますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "原則として子どもが1歳になるまでです。保育所に入れない場合などは最大2歳まで延長できます（1歳6ヶ月・2歳の節目で延長申請が必要）。パパ・ママ育休プラス制度を利用すると、両親ともに育休取得した場合は最大1歳2ヶ月まで取得可能です。",
      },
    },
    {
      "@type": "Question",
      name: "パパ育休（産後パパ育休）はどう違いますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "産後パパ育休（出生時育児休業）は子どもの出生後8週間以内に最大4週間（28日）取得できる制度です。2022年10月から導入され、通常の育休とは別に取得可能です。給付率は最初の28日間は月収の80%相当（手取りベースではほぼ従来収入と同等）になります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title:
    "育休給付金計算シミュレーター - 産休・育休でいくらもらえる？無料計算 | ツールボックス",
  description:
    "育児休業給付金の受給額を月収から無料でシミュレーション。産前産後休業中の出産手当金、育休0〜6ヶ月は月収67%・7ヶ月〜は50%を自動計算。パパ育休（産後パパ育休）にも対応。社会保険料免除の節約効果も含めた実質受給総額を試算します。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/ikukyu-calc",
  },
  openGraph: {
    title: "育休給付金計算シミュレーター - 産休・育休でいくらもらえる？",
    description:
      "月収・育休期間を入力するだけで育児休業給付金の受給総額を無料計算。パパ育休対応。",
    url: "https://www.toolbox-jp.net/tools/ikukyu-calc",
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
