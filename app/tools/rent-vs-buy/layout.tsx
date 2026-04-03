import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "賃貸と購入どちらが得ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一概にどちらが得とは言えません。購入は資産形成できる反面、維持費・固定資産税・金利負担があります。賃貸は転居の自由度が高い反面、家賃を払い続けても資産は残りません。居住期間・物件価格・金利・家賃水準によって損益分岐点が変わるため、シミュレーションで比較することが重要です。",
      },
    },
    {
      "@type": "Question",
      name: "住宅購入に必要な頭金はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的には物件価格の10〜20%が目安とされています。頭金なしのフルローンも可能ですが、借入金額が増えるため総利息が多くなります。また、頭金の他に仲介手数料・登記費用・ローン手数料などの諸費用（物件価格の3〜8%程度）も別途必要です。",
      },
    },
    {
      "@type": "Question",
      name: "マンションの維持費（管理費・修繕積立金）はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "マンションの管理費と修繕積立金の合計は、一般的に月1〜3万円程度です。築年数が経過するほど修繕積立金が増額される場合があります。戸建ての場合も将来的な修繕費として月1〜2万円程度を積立てることが推奨されています。",
      },
    },
    {
      "@type": "Question",
      name: "住宅ローン控除とはどのような制度ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "住宅ローン控除（住宅借入金等特別控除）は、住宅ローンの年末残高の0.7%を13年間、所得税から控除できる制度です（2022年以降の入居）。例えばローン残高3,000万円なら年間最大21万円が控除されます。所得税から控除しきれない分は住民税からも一部控除されます。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "賃貸vs購入シミュレーター【30年コスト比較】マンション購入 vs 賃貸どちらがお得？ | ツールボックス",
  description:
    "賃貸と住宅購入の総コストを30年・50年スパンで比較。物件価格・家賃・ローン金利・住居費を入力して生涯コストをシミュレーション。持ち家vs賃貸の損益分岐点を計算。",
  keywords: ["賃貸 vs 購入", "持ち家 賃貸 比較", "住宅購入 シミュレーション", "住居費 計算", "マンション 購入 損得"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/rent-vs-buy" },
  openGraph: {
    title: "賃貸vs購入シミュレーター【30年コスト比較】",
    description: "賃貸と住宅購入の総コストを比較。損益分岐点を計算します。",
    url: "https://www.toolbox-jp.net/tools/rent-vs-buy",
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
