import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "仮想通貨の税金はいくらかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "仮想通貨の利益は「雑所得」として他の所得と合算した総合課税（5〜45%）が適用されます。住民税10%を合わせると最大55%です。年間20万円以下は申告不要（給与所得者）です。",
      },
    },
    {
      "@type": "Question",
      name: "仮想通貨の損益計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "売却益 = 売却価格 - 取得原価（移動平均法または総平均法）で計算します。複数回購入した場合は取得単価の計算が必要です。",
      },
    },
    {
      "@type": "Question",
      name: "仮想通貨の損失は翌年に繰り越せますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "現状、仮想通貨（雑所得）の損失は翌年への繰越控除が認められていません。ただし同年内の他の雑所得との損益通算は可能です。",
      },
    },
    {
      "@type": "Question",
      name: "NFTやDeFiの税金はどうなりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NFTの売買益も原則として雑所得として課税されます。DeFiのステーキング報酬や流動性提供の報酬も受け取り時に雑所得となります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "仮想通貨・暗号資産損益計算【確定申告対応】取得費・売却益を計算 | ツールボックス",
  description:
    "仮想通貨の売却損益を無料計算。取得価格・売却価格・数量から総合課税の税額をシミュレーション。移動平均法・総平均法にも対応。確定申告の参考に。",
  keywords: ["仮想通貨 損益 計算", "暗号資産 税金 計算", "ビットコイン 税金", "仮想通貨 確定申告", "暗号資産 損益通算"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/crypto-calc",
  },
  openGraph: {
    title: "仮想通貨・暗号資産損益計算【確定申告対応】取得費・売却益を計算",
    description:
      "仮想通貨の売却損益を無料計算。取得価格・売却価格・数量から総合課税の税額をシミュレーション。移動平均法・総平均法にも対応。",
    url: "https://www.toolbox-jp.net/tools/crypto-calc",
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
