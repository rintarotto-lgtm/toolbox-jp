import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "1日に必要な水分量はどれくらい？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "体重×30mlが基本目安です。例えば体重60kgなら1,800ml（1.8L）が目安となります。成人で約1.5〜2Lが一般的な推奨量ですが、運動量や気候によって増減します。",
      },
    },
    {
      "@type": "Question",
      name: "水分補給のタイミングはいつがいい？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "起床後・食事前・入浴前後・就寝前など、喉が渇く前にこまめに補給することが重要です。運動中は15〜20分ごとに150〜250mlを目安に摂取しましょう。",
      },
    },
    {
      "@type": "Question",
      name: "お茶やコーヒーは水分補給になる？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "カフェインには利尿作用がありますが、適量であれば水分補給として計算できます。ただし大量摂取は逆効果になる場合があるため、水やノンカフェイン飲料をメインにすることをおすすめします。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "水分摂取量計算 - 1日の適切な水分補給量を無料計算 | ツールボックス",
  description:
    "体重・運動量・季節から1日の適切な水分摂取量を計算。熱中症対策や健康管理に。コップ何杯分か、時間別摂取目安も表示。無料オンラインツール。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/water-intake-calc" },
  openGraph: {
    title: "水分摂取量計算 - 1日の適切な水分補給量を計算",
    description:
      "体重・運動量・季節から1日の水分摂取量を計算。熱中症対策・健康管理に。",
    url: "https://www.toolbox-jp.net/tools/water-intake-calc",
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
