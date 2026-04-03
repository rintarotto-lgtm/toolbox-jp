import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "日本の平均昇給率はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "厚生労働省の調査によると、日本の平均賃金上昇率（ベースアップ＋定期昇給）は近年2〜3%程度です。2023〜2024年は物価上昇を背景に3〜5%程度の昇給を実施する企業も増えています。ただし業種・企業規模・職種によって大きく異なります。",
      },
    },
    {
      "@type": "Question",
      name: "転職で年収を上げるにはどうすればよいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "転職での年収アップには、①希少スキルの習得、②年収水準が高い業界・職種への移動、③実績を数値で示した交渉、が効果的です。日本では転職による年収増加の中央値は約10〜20%とされています。同一企業内の昇給より転職の方が一度に大きく年収を上げやすい傾向があります。",
      },
    },
    {
      "@type": "Question",
      name: "生涯年収の平均はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "日本の大卒サラリーマン（男性）の生涯年収は約2億〜3億円が目安とされています。大企業勤務では3億円超、中小企業では2億円前後が一般的です。女性は育児休業取得などで2億円を下回るケースも多くあります。これらはあくまで平均値であり、個人差が大きい数字です。",
      },
    },
    {
      "@type": "Question",
      name: "ベースアップと昇給の違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ベースアップ（ベア）は全従業員の給与水準を一律に引き上げることです。一方、昇給（定期昇給）は個人の勤続年数・評価に応じて個別に給与を上げる仕組みです。春闘で決まる賃上げはベアが中心で、これに定期昇給が加わって実際の昇給率が決まります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "昇給シミュレーター【生涯年収・手取り変化】昇給率から将来の給与を予測 | ツールボックス",
  description:
    "昇給後の手取り・生涯年収を無料シミュレーション。現在の年収と昇給率・昇給頻度を入力して将来の給与推移を予測。転職・昇進交渉の判断材料に。",
  keywords: ["昇給 シミュレーション", "生涯年収 計算", "年収 推移", "手取り 変化", "転職 年収 比較"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/salary-increase",
  },
  openGraph: {
    title: "昇給シミュレーター【生涯年収・手取り変化】",
    description: "昇給率・昇給頻度から将来の年収推移と生涯年収を予測。転職との年収比較も可能。",
    url: "https://www.toolbox-jp.net/tools/salary-increase",
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
