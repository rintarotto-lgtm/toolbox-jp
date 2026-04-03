import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "電気自動車コスト計算【ガソリン車と比較】EV購入・維持費シミュレーション | ツールボックス",
  description:
    "電気自動車（EV）とガソリン車の購入・維持費を無料比較。車両価格・電費・充電コスト・補助金を考慮したトータルコストを計算。EV購入の損益分岐点も表示。",
  keywords: [
    "電気自動車 コスト 計算",
    "EV ガソリン車 比較",
    "電気自動車 維持費",
    "EV 補助金 計算",
    "電費 計算",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/ev-calc",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "電気自動車の維持費はガソリン車と比べてどうですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "燃料費はEVが大幅に安く（1km約3〜5円 vs ガソリン車約10〜15円）、エンジンオイル交換が不要なため整備費も安い傾向があります。ただし車両価格と充電設備設置費用が高めです。",
      },
    },
    {
      "@type": "Question",
      name: "EV購入の補助金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CEV補助金（クリーンエネルギー自動車補助金）として普通乗用EVには最大65万円の補助があります（2024年度）。自治体の上乗せ補助もあります。",
      },
    },
    {
      "@type": "Question",
      name: "自宅充電の電気代はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "深夜電力（約16〜20円/kWh）を利用すると1回満充電で400〜600円程度です。急速充電器の場合は1回1,000〜2,000円程度かかります。",
      },
    },
    {
      "@type": "Question",
      name: "EVの電池交換費用はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "バッテリー保証は多くのメーカーで8年/16万km程度ですが、交換費用は50〜100万円以上になることも。近年はバッテリー技術が向上し、交換不要なケースも増えています。",
      },
    },
  ],
};

export default function EvCalcLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
