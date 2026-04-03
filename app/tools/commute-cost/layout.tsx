import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "通勤費・交通費計算【定期代・実費比較】最もお得な通勤方法を計算 | ツールボックス",
  description:
    "通勤費を無料計算。電車・バス定期代、車通勤のガソリン代・駐車場代を比較。1ヶ月・6ヶ月・1年の交通費と会社支給限度額との比較も。",
  keywords: [
    "通勤費 計算",
    "交通費 計算",
    "定期代 計算",
    "通勤 費用 比較",
    "通勤手当 計算",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/commute-cost",
  },
  openGraph: {
    title: "通勤費・交通費計算【定期代・実費比較】最もお得な通勤方法を計算",
    description:
      "通勤費を無料計算。電車・バス定期代、車通勤のガソリン代・駐車場代を比較。1ヶ月・6ヶ月・1年の交通費と会社支給限度額との比較も。",
    url: "https://www.toolbox-jp.net/tools/commute-cost",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "通勤手当の非課税限度額はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "電車・バス通勤は月15万円まで非課税。車通勤は距離によって2km未満は全額課税、2〜10kmは4,200円、10〜15kmは7,100円、15〜25kmは12,900円などが非課税限度額です。",
      },
    },
    {
      "@type": "Question",
      name: "定期代と実費どちらがお得ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "通勤日数が多い場合は定期代の方が安い場合が多いですが、リモートワーク併用や出勤日が少ない場合は実費精算の方が安くなることがあります。月の出勤日数が何日以上なら定期がお得かを本ツールで計算できます。",
      },
    },
    {
      "@type": "Question",
      name: "テレワーク中の交通費はどうなりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "実費精算の場合は出勤した日数分のみ支給されます。定期代支給の場合は会社の規定によりますが、テレワーク比率が高い場合は実費精算への変更を検討する価値があります。",
      },
    },
    {
      "@type": "Question",
      name: "新幹線通勤の交通費は会社が全額出してくれますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "会社によって異なりますが、多くの会社では新幹線を含む合理的な経路の交通費を全額支給します。月15万円の非課税限度額を超える部分は課税対象になります。",
      },
    },
  ],
};

export default function CommuteCostLayout({
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
