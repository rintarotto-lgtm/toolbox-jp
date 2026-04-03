import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "太陽光発電シミュレーター【設置費用・売電収入・回収期間】を計算 | ツールボックス",
  description:
    "太陽光発電の導入費用・年間発電量・売電収入・投資回収期間を無料シミュレーション。設置容量・地域・電気代・売電価格から費用対効果を計算。",
  keywords: [
    "太陽光発電 シミュレーション",
    "太陽光 売電 計算",
    "太陽光発電 回収期間",
    "ソーラーパネル 費用",
    "FIT 売電収入",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/solar-panel",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "太陽光発電の設置費用はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "4kWシステムで120〜160万円程度が相場です（2024年）。容量1kWあたり25〜35万円が目安です。補助金を活用することで実質負担を減らせます。",
      },
    },
    {
      "@type": "Question",
      name: "太陽光発電の売電価格はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2024年度のFIT制度による売電価格は10kW未満の住宅用で16円/kWhです（10年間固定）。余剰電力のみ売電する余剰売電が一般的です。",
      },
    },
    {
      "@type": "Question",
      name: "太陽光発電の投資回収期間は何年ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的に10〜15年程度とされています。電気代節約効果と売電収入の合計が設置費用を上回るまでの期間です。設置環境や電気代によって大きく変わります。",
      },
    },
    {
      "@type": "Question",
      name: "蓄電池と一緒に設置するメリットは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "昼間に発電した電気を蓄電して夜間に使用でき、自家消費率が向上します。停電時の非常用電源にもなります。ただし蓄電池の追加費用（70〜150万円）も考慮が必要です。",
      },
    },
  ],
};

export default function SolarPanelLayout({
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
