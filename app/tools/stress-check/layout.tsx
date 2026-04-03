import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ストレスチェック制度とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "50人以上の労働者がいる事業場で年1回の実施が義務付けられている制度です（2015年12月施行）。労働者のメンタルヘルス不調を早期発見・予防することを目的としています。",
      },
    },
    {
      "@type": "Question",
      name: "ストレスチェックの結果は会社に知られますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "労働者の同意なく結果が事業者に提供されることはありません。高ストレス者が面接指導を希望した場合のみ、産業医等から事業者に通知されます。",
      },
    },
    {
      "@type": "Question",
      name: "高ストレス者とはどういう状態ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ストレスチェックの結果が一定の基準を超えた場合（上位10%程度）に高ストレス者と判定されます。医師による面接指導を申し出ることができます。",
      },
    },
    {
      "@type": "Question",
      name: "燃え尽き症候群（バーンアウト）の症状は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "極度の疲労感・仕事への無気力・達成感のなさが主な症状です。特に真面目で仕事熱心な人に多く見られます。早期に休養・相談することが重要です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title:
    "ストレスチェック【職業性ストレス簡易調査】仕事のストレス度を診断 | ツールボックス",
  description:
    "仕事のストレス度を無料チェック。厚生労働省の職業性ストレス簡易調査票（57項目）をもとに、ストレスの原因・反応・周囲のサポートを評価。燃え尽き症候群のリスク診断も。",
  keywords: [
    "ストレスチェック",
    "職業性ストレス 診断",
    "仕事 ストレス 診断",
    "燃え尽き症候群 チェック",
    "メンタルヘルス 診断",
  ],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/stress-check" },
  openGraph: {
    title: "ストレスチェック【職業性ストレス簡易調査】仕事のストレス度を診断",
    description:
      "仕事のストレス度を無料チェック。ストレスの原因・反応・周囲のサポートを評価し、燃え尽き症候群リスクも診断。",
    url: "https://www.toolbox-jp.net/tools/stress-check",
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
