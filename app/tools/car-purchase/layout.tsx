import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "車の諸費用はいくらくらいかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "新車の場合、車両本体価格の10〜15%程度が諸費用の目安です。200万円の車なら20〜30万円の諸費用がかかります。中古車は車両価格の15〜20%程度です。",
      },
    },
    {
      "@type": "Question",
      name: "自動車税は毎年いくらかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "排気量によって異なります。1,000cc以下は25,000円、1,500cc以下は30,500円、2,000cc以下は36,000円、2,500cc以下は43,500円（2019年10月以降の新車登録）です。",
      },
    },
    {
      "@type": "Question",
      name: "カーローンの金利はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ディーラーローンは3〜8%程度、銀行の自動車ローンは1〜3%程度が多いです。金利差によって総支払額が大きく変わるため、事前に比較することをおすすめします。",
      },
    },
    {
      "@type": "Question",
      name: "車の維持費は年間いくらかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "普通乗用車の場合、自動車税・保険・車検・ガソリン・駐車場などを合わせると年間50〜80万円程度が平均的です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "車購入費用計算【諸費用込みの総額】新車・中古車の購入時の全費用を試算 | ツールボックス",
  description:
    "車の購入費用を総額で計算。車両本体価格に加え、自動車税・自動車重量税・自賠責保険・登録費用・オプション費用など諸費用を含めた実際の支払総額をシミュレーション。",
  keywords: ["車 購入費用 計算", "自動車 諸費用 計算", "車 総額 計算", "新車 購入 費用", "自動車ローン 計算"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/car-purchase",
  },
  openGraph: {
    title: "車購入費用計算【諸費用込みの総額】新車・中古車の全費用を試算",
    description: "車両本体価格＋諸費用＋ローン利息まで含めた購入総額をシミュレーション。",
    url: "https://www.toolbox-jp.net/tools/car-purchase",
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
