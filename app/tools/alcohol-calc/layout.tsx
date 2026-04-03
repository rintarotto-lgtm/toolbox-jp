import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "適度な飲酒量の目安はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "厚生労働省は1日あたりの純アルコール量20g程度を適量としています。ビールなら500ml、日本酒なら1合、ワインなら200ml程度に相当します。女性はこの半量が目安です。",
      },
    },
    {
      "@type": "Question",
      name: "純アルコール量の計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "純アルコール量(g) = 飲み物の量(ml) × アルコール度数(%) ÷ 100 × 0.8（アルコールの比重）で計算します。",
      },
    },
    {
      "@type": "Question",
      name: "アルコールのカロリーはどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "アルコールは1gあたり7kcalです。ビール500mlなら約200kcal、日本酒1合(180ml)なら約200kcal、ウイスキーダブル(60ml)なら約140kcalです。",
      },
    },
    {
      "@type": "Question",
      name: "飲酒後、運転できるようになるまで何時間かかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "アルコールは1時間に体重1kgあたり約0.1gが分解されます。体重60kgの人がビール500ml（純アルコール約20g）を飲んだ場合、分解に約3.3時間かかります。個人差があるため余裕をもって判断してください。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "アルコール量計算【純アルコール量・適量チェック】体への影響も表示 | ツールボックス",
  description:
    "飲酒量から純アルコール量（g）を無料計算。ビール・日本酒・ワイン・ウイスキーなどの種類と量を入力して1日の純アルコール摂取量を算出。適量・過飲のチェックに。",
  keywords: ["アルコール量 計算", "純アルコール 計算", "飲酒 適量 計算", "お酒 カロリー 計算", "アルコール 適量"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/alcohol-calc" },
  openGraph: {
    title: "アルコール量計算【純アルコール量・適量チェック】体への影響も表示",
    description: "飲酒量から純アルコール量（g）を無料計算。適量・過飲のチェックに。",
    url: "https://www.toolbox-jp.net/tools/alcohol-calc",
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
