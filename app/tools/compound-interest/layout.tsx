import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "複利と単利の違いは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "単利は元本だけに利息がつきますが、複利は元本に加えて過去の利息にも利息がつきます。たとえば100万円を年利5%で10年運用した場合、単利なら150万円ですが、複利なら約163万円になります。長期運用ほど複利の効果は大きくなります。",
      },
    },
    {
      "@type": "Question",
      name: "72の法則とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "72の法則とは「72 ÷ 年利(%) = 資産が2倍になるおよその年数」を求める計算の近似式です。例えば年利6%なら72÷6=12年で資産が約2倍になります。複利運用の効果を直感的に把握するために広く使われています。",
      },
    },
    {
      "@type": "Question",
      name: "毎月いくら積み立てれば老後に備えられますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "老後資金の目安として「2,000万円問題」が話題になりましたが、必要額は生活水準によって異なります。年利5%で20年積み立てる場合、毎月約5万円の積立で約2,000万円を目指せます。まずは毎月の余剰資金の範囲で無理なく始めることが重要です。",
      },
    },
    {
      "@type": "Question",
      name: "インフレが資産運用に与える影響は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "インフレ（物価上昇）が続くと、現金の実質的な価値は下がります。年2%のインフレが続くと、30年後には現在の100万円の価値が約55万円に目減りします。インフレ率を上回る利回りで資産を運用することが、実質的な資産保全・増加につながります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "複利計算シミュレーター【毎月積立対応】元本・利率・期間から将来価値を計算 | ツールボックス",
  description:
    "複利計算を無料シミュレーション。一括投資・毎月積立の両方に対応。元本・年利・運用期間を入力するだけで将来の資産額をグラフで表示。72の法則も解説。",
  keywords: ["複利計算", "積立 シミュレーション", "資産運用 計算", "複利 効果", "将来価値 計算"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/compound-interest",
  },
  openGraph: {
    title: "複利計算シミュレーター【毎月積立対応】",
    description: "一括投資・毎月積立の複利計算を無料シミュレーション。将来の資産額をグラフで確認。",
    url: "https://www.toolbox-jp.net/tools/compound-interest",
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
