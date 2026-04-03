import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "1日に必要な水分量はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的に体重1kgあたり約30〜40mlが目安です。体重60kgなら1,800〜2,400mlです。ただし気温や運動量によって大きく変わります。",
      },
    },
    {
      "@type": "Question",
      name: "水以外の飲み物でも水分補給できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "お茶・コーヒー・ジュースなども水分補給になりますが、カフェインには利尿作用があります。アルコールは脱水を促進するため、水分補給としてはカウントできません。",
      },
    },
    {
      "@type": "Question",
      name: "脱水症状のサインは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "口の渇き・尿の色が濃い黄色・頭痛・めまい・集中力低下などが脱水のサインです。喉が渇く前に定期的に水分を補給することが重要です。",
      },
    },
    {
      "@type": "Question",
      name: "運動中はどのくらい水分を補給すべきですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "運動前に300〜500ml、運動中は15〜20分ごとに150〜250ml、運動後は体重減少分の1.5倍を目安に補給してください。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "水分摂取量計算【1日に必要な水の量】体重・気温・運動量から算出 | ツールボックス",
  description:
    "1日に必要な水分摂取量を無料計算。体重・気温・運動強度から1日の推奨水分量を算出。脱水症状のリスク診断と水分補給のタイミング提案も。",
  keywords: ["水分摂取量 計算", "1日 水 量", "水分補給 量 計算", "脱水 予防", "水分 体重"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/water-intake",
  },
  openGraph: {
    title: "水分摂取量計算【1日に必要な水の量】体重・気温・運動量から算出",
    description: "体重・気温・運動強度から1日の推奨水分摂取量を計算。補給スケジュールも提案。",
    url: "https://www.toolbox-jp.net/tools/water-intake",
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
