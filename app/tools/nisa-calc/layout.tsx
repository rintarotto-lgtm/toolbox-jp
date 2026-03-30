import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "新NISAの年間投資上限額はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "新NISA（2024年〜）は年間最大360万円（つみたて投資枠120万円＋成長投資枠240万円）で、生涯投資上限は1,800万円です。",
      },
    },
    {
      "@type": "Question",
      name: "NISAで運用益は非課税ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい、NISA口座内の運用益・配当金は全て非課税です。通常の特定口座では利益の約20.315%が課税されますが、NISAではゼロです。",
      },
    },
    {
      "@type": "Question",
      name: "NISAの出口戦略はどうすればいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "積立終了後も非課税のまま保有し続けることができます。必要なときに必要な額だけ売却するのが基本です。老後資金として活用する場合は、退職後に少しずつ取り崩すのが一般的です。",
      },
    },
    {
      "@type": "Question",
      name: "何年間積み立てればいくらになりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "例えば月3万円を年利5%で30年積み立てると、元本1,080万円に対して約2,495万円になります（複利効果）。積立額と運用利回りが大きいほど、長期投資の複利効果が大きくなります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "NISA積立シミュレーター - 新NISA運用シミュレーション無料計算 | ツールボックス",
  description:
    "新NISA（2024年〜）の積立シミュレーション。月額・年数・利回りを入力するだけで将来の資産額を計算。NISA非課税効果vs課税口座の比較も。複利グラフ表示。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/nisa-calc",
  },
  openGraph: {
    title: "NISA積立シミュレーター - 新NISAで資産はいくらになる？",
    description:
      "月額・年数・利回りから新NISAの将来資産額を計算。非課税効果の比較グラフ付き。",
    url: "https://www.toolbox-jp.net/tools/nisa-calc",
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
