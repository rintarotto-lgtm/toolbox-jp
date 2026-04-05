import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "プレゼント予算・相場計算 - シーン別ギフト金額の目安 | ToolBox Japan",
  description: "誕生日・バレンタイン・クリスマス・結婚祝い・お中元などシーン別プレゼント相場を無料表示。関係性・年齢・予算から最適なギフト金額を計算。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "彼氏・彼女へのプレゼント相場はいくらですか？", acceptedAnswer: { "@type": "Answer", text: "交際期間や関係性にもよりますが、誕生日プレゼントの相場は5,000〜10,000円程度、クリスマスは10,000〜30,000円程度が一般的です。" } },
          { "@type": "Question", name: "友人へのプレゼント相場は？", acceptedAnswer: { "@type": "Answer", text: "友人への誕生日プレゼントは3,000〜5,000円が一般的な相場です。グループでまとめて贈る場合は1人1,000〜3,000円程度になります。" } },
          { "@type": "Question", name: "結婚祝いの相場はいくらですか？", acceptedAnswer: { "@type": "Answer", text: "関係性によって異なります。友人・知人は3〜5万円、兄弟姉妹は5〜10万円、親からは10〜30万円程度が一般的な相場です。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
