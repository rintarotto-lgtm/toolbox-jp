import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "生命保険の必要保障額はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "遺族に必要な生活費の総額から、公的遺族年金・現在の貯蓄・配偶者の収入見込みを差し引いた金額が必要保障額です。子どもの年齢や教育方針によって大きく異なります。",
      },
    },
    {
      "@type": "Question",
      name: "独身者に生命保険は必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "扶養家族がいない独身者には死亡保険は基本不要とされています。ただし就業不能保険（収入保障）は、自分自身が病気・ケガで働けなくなった場合の備えとして重要です。",
      },
    },
    {
      "@type": "Question",
      name: "子どもが生まれたら保険はどう変わりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "子どもが生まれると必要保障額が大幅に増えます。子どもが独立するまでの生活費・教育費を賄える保険金額が必要です。定期保険（掛け捨て）が費用対効果に優れています。",
      },
    },
    {
      "@type": "Question",
      name: "住宅ローンがあると保険は不要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "住宅ローンには団体信用生命保険（団信）が付いているため、住宅ローン相当の保障は既にあります。ただし生活費・教育費・その他債務の保障は別途必要です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "生命保険必要額計算【必要保障額シミュレーター】いくらの保険が必要？ | ツールボックス",
  description:
    "生命保険の必要保障額を無料計算。家族構成・収入・ローン残高・貯蓄額から万が一の際に必要な保険金額を算出。死亡保険・就業不能保険の必要額を確認。",
  keywords: ["生命保険 必要額 計算", "保険 必要額 シミュレーション", "死亡保険 いくら", "生命保険 見直し", "必要保障額 計算"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/insurance-calc",
  },
  openGraph: {
    title: "生命保険必要額計算【必要保障額シミュレーター】いくらの保険が必要？",
    description: "家族構成・収入・ローン残高・貯蓄額から必要保障額を算出。死亡保険・就業不能保険の必要額を確認。",
    url: "https://www.toolbox-jp.net/tools/insurance-calc",
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
