import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "理想の睡眠時間はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "成人（18〜64歳）の理想的な睡眠時間は7〜9時間とされています（米国睡眠財団の推奨）。ただし個人差があり、6時間で十分な人もいれば10時間必要な人もいます。日本人の平均睡眠時間は約6時間22分と先進国の中で最も短い水準にあります。",
      },
    },
    {
      "@type": "Question",
      name: "睡眠サイクル（90分）とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "睡眠は約90分を1サイクルとして、ノンレム睡眠（深い眠り）とレム睡眠（浅い眠り）を繰り返します。サイクルの終わり（レム睡眠の終了時）に起床すると、脳が覚醒しやすい状態にあるため、すっきりと目覚められるとされています。",
      },
    },
    {
      "@type": "Question",
      name: "睡眠負債とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "睡眠負債とは、必要な睡眠時間に対して実際の睡眠が不足し、その差が蓄積されたものです。週末の寝だめで一定程度は回復できますが、長期的な睡眠不足は認知機能・免疫力・代謝などに悪影響を及ぼします。毎日1時間の不足が1週間続くと、7時間分の睡眠負債が生じます。",
      },
    },
    {
      "@type": "Question",
      name: "昼寝の最適な時間はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "昼寝は15〜20分（パワーナップ）が最も効果的とされています。20分以内であれば深い睡眠（ノンレム睡眠）に入らないため、起きた後もすっきりしやすいです。30分以上になると深い睡眠に入り、睡眠慣性（起床後のだるさ）が生じやすくなります。午後3時以降の昼寝は夜の睡眠に影響することがあります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "睡眠時間計算【起床時間から最適な就寝時刻を逆算】睡眠サイクル計算 | ツールボックス",
  description:
    "起床時間・就寝時間から最適な睡眠時刻を計算。睡眠サイクル（90分）に基づいてすっきり目覚めるための就寝時刻を提案。理想の睡眠時間・睡眠負債計算も。",
  keywords: [
    "睡眠時間 計算",
    "就寝時間 計算",
    "睡眠サイクル",
    "起床時間 逆算",
    "快眠 時間",
  ],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/sleep-calc" },
  openGraph: {
    title: "睡眠時間計算【起床時間から最適な就寝時刻を逆算】睡眠サイクル計算",
    description:
      "睡眠サイクル（90分）に基づいてすっきり目覚めるための就寝時刻・起床時間を計算。睡眠負債チェックも。",
    url: "https://www.toolbox-jp.net/tools/sleep-calc",
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
