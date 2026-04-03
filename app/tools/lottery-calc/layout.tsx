import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "宝くじの還元率はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "日本の宝くじの還元率（期待値）は約45〜47%です。1,000円買えば平均450〜470円しか戻ってきません。パチンコの85〜95%と比べても低い還元率です。",
      },
    },
    {
      "@type": "Question",
      name: "ジャンボ宝くじの1等当選確率は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "年末ジャンボ宝くじの1等（7億円）の当選確率は2,000万分の1（0.000005%）です。1等前後賞合わせても1,000万分の1です。",
      },
    },
    {
      "@type": "Question",
      name: "ロト6とジャンボ宝くじどちらが当たりやすいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ロト6の1等当選確率は約609万分の1でジャンボより高いですが、それでも非常に低い確率です。ロト6は理論上の期待値がジャンボより高い場合があります。",
      },
    },
    {
      "@type": "Question",
      name: "宝くじで当選した場合、税金はかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "宝くじの当選金には所得税・住民税がかかりません（当選金は非課税）。ただし当選金で購入した資産（不動産・株式等）の売却益には課税されます。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "宝くじ期待値計算【当選確率・還元率】ジャンボ宝くじの損得を計算 | ツールボックス",
  description:
    "宝くじの期待値・還元率・当選確率を無料計算。ジャンボ宝くじ・ロト・ナンバーズの当選金額と確率から理論的な期待値を算出。宝くじの損益分岐点も表示。",
  keywords: [
    "宝くじ 期待値 計算",
    "宝くじ 当選確率",
    "ロト6 期待値",
    "宝くじ 還元率",
    "宝くじ 当たる確率",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/lottery-calc",
  },
  openGraph: {
    title: "宝くじ期待値計算【当選確率・還元率】ジャンボ宝くじの損得を計算",
    description:
      "宝くじの期待値・還元率・当選確率を無料計算。ジャンボ宝くじ・ロト・ナンバーズの損得を理論的に算出。",
    url: "https://www.toolbox-jp.net/tools/lottery-calc",
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
