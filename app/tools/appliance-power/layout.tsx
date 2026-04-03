import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "電気代の計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "電気代 = 消費電力(kW) × 使用時間(h) × 電力料金単価(円/kWh)で計算します。1,000Wの家電を1時間使うと1kWh消費し、単価30円なら30円かかります。",
      },
    },
    {
      "@type": "Question",
      name: "エアコンの電気代はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "6畳用エアコン（消費電力500〜700W）を1日8時間使用した場合、月額3,000〜5,000円程度が目安です。設定温度を1度上げるだけで約10%節電できます。",
      },
    },
    {
      "@type": "Question",
      name: "冷蔵庫は常に電気を使っているのですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "冷蔵庫は24時間365日稼働していますが、コンプレッサーが断続的に動作します。年間消費電力量は機種によって200〜600kWhで、電気代換算で年間6,000〜18,000円程度です。",
      },
    },
    {
      "@type": "Question",
      name: "待機電力はどのくらいかかっていますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "テレビ・エアコン・電子レンジなどの待機電力は1台あたり1〜6W程度です。家全体で20〜30W程度の待機電力があり、年間約5,000〜8,000円かかっているとされています。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "家電電気代計算【1時間・1ヶ月の電気代】消費電力から電気料金を計算 | ツールボックス",
  description:
    "家電製品の電気代を無料計算。消費電力（W）・使用時間・電気料金単価から1時間・1日・1ヶ月の電気代を計算。エアコン・冷蔵庫・洗濯機など主要家電の電気代比較も。",
  keywords: ["家電 電気代 計算", "消費電力 電気代 計算", "電気代 計算", "エアコン 電気代", "冷蔵庫 電気代"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/appliance-power" },
  openGraph: {
    title: "家電電気代計算【1時間・1ヶ月の電気代】消費電力から電気料金を計算",
    description: "家電製品の消費電力から1時間・1日・1ヶ月の電気代を無料計算。",
    url: "https://www.toolbox-jp.net/tools/appliance-power",
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
