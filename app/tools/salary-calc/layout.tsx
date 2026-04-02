import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "年収500万円の手取りはいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "年収500万円の手取りは約387万円（手取り率約77%）が目安です。所得税・住民税・社会保険料を差し引いた金額です。扶養家族の有無や各種控除によって変わります。",
      },
    },
    {
      "@type": "Question",
      name: "社会保険料はどのくらいかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "社会保険料は年収の約15%が目安です。内訳は健康保険料（約5%）、厚生年金保険料（約9%）、雇用保険料（約0.6%）です。会社と折半のため実際の負担は約15%となります。",
      },
    },
    {
      "@type": "Question",
      name: "所得税の税率はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "所得税は累進課税制度で、課税所得に応じて5%〜45%の税率が適用されます。年収400万円程度であれば実効税率は5〜10%程度です。",
      },
    },
    {
      "@type": "Question",
      name: "住民税はいくらかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "住民税は課税所得の約10%＋均等割約5,000円が目安です。前年度の所得に対して翌年6月から徴収されます（翌年課税）。",
      },
    },
    {
      "@type": "Question",
      name: "手取り計算の方法を教えてください",
      acceptedAnswer: {
        "@type": "Answer",
        text: "手取り = 年収 - 社会保険料（約15%）- 所得税（累進課税）- 住民税（課税所得の10%）で計算します。一般的に手取りは額面の75〜80%程度になります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "手取り計算【2025年最新】年収入力するだけ→手取り額を瞬時に表示 | ツールボックス",
  description:
    "年収から手取り額を瞬時に計算。所得税・住民税・社会保険料の内訳も一目でわかる無料ツール。2026年の税制対応。スライダーで直感的に操作。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/salary-calc",
  },
  openGraph: {
    title: "給料手取り計算ツール - 年収○○万円の手取りは？",
    description:
      "年収から手取り額を瞬時に計算。所得税・住民税・社会保険料の内訳も一目でわかる。",
    url: "https://www.toolbox-jp.net/tools/salary-calc",
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
