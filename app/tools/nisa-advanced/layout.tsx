import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "新NISAの年間投資上限はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "新NISAはつみたて投資枠120万円＋成長投資枠240万円の年間360万円、生涯投資枠1,800万円（うち成長投資枠1,200万）が上限です。",
      },
    },
    {
      "@type": "Question",
      name: "新NISAで1,800万円を満額使うには何年かかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "年間360万円（月30万円）を投資すれば最短5年で満額になります。月10万円なら15年です。",
      },
    },
    {
      "@type": "Question",
      name: "NISAとiDeCoはどちらを優先すべきですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "iDeCoは掛金が全額所得控除になるため節税効果が高いですが、60歳まで引き出せません。NISAはいつでも売却可能。まずiDeCoで節税し、余裕資金をNISAに回すのが一般的な戦略です。",
      },
    },
    {
      "@type": "Question",
      name: "NISAで投資できる商品は何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "つみたて投資枠は金融庁が認定した長期・積立・分散投資に適した投資信託・ETF（約300本）。成長投資枠は上場株式・投資信託など幅広い商品が対象です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "NISAつみたてシミュレーター【新NISA対応】非課税メリットを計算 | ツールボックス",
  description:
    "新NISA（つみたて投資枠・成長投資枠）の積立シミュレーション。課税口座との比較で非課税メリットを可視化。目標金額から必要な積立額を逆算する機能も。",
  keywords: [
    "NISA つみたて シミュレーション",
    "新NISA 計算",
    "NISA 非課税 メリット",
    "つみたてNISA 運用 計算",
    "NISA 1800万 計算",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/nisa-advanced",
  },
  openGraph: {
    title: "NISAつみたてシミュレーター【新NISA対応】",
    description:
      "新NISAの積立シミュレーション。課税口座との比較・目標逆算機能付き。非課税メリットを可視化。",
    url: "https://www.toolbox-jp.net/tools/nisa-advanced",
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
