import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "奨学金返済期間の計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "奨学金の返済期間は、借入総額・月々返済額・利率から元利均等返済方式で計算します。計算式は n = -log(1 - 元本 × 月利 ÷ 月々返済額) ÷ log(1 + 月利) です。無利子の第一種奨学金の場合は、借入総額 ÷ 月々返済額で返済月数を求めます。",
      },
    },
    {
      "@type": "Question",
      name: "繰り上げ返済の効果はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "繰り上げ返済は元金を直接減らすため、将来発生する利息を大幅に削減できます。例えば借入300万円・年利1.5%・月々16,000円の場合、毎月1万円を追加返済すると、返済期間が数年短縮され、総利息を数十万円節約できるケースがあります。返済期間が長いほど繰り上げ返済の効果は大きくなります。",
      },
    },
    {
      "@type": "Question",
      name: "奨学金の返還猶予・免除制度とは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "日本学生支援機構（JASSO）の奨学金には、経済的困難・傷病・災害等の場合に返還を一時的に猶予する「返還期限猶予制度」があります。また、死亡や精神・身体の障害により返還が困難な場合は「返還免除制度」が適用されます。さらに、第一種奨学金には一定の条件（特に優れた業績）を満たすと一部または全部が免除される「特に優れた業績による返還免除」制度もあります。",
      },
    },
    {
      "@type": "Question",
      name: "奨学金の利子（利息）の計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "第二種奨学金（有利子）の利子は元利均等返済方式で計算されます。毎月の利息 = 残元金 × 月利（年利 ÷ 12）で算出され、返済額から利息分を差し引いた残りが元金返済に充てられます。総利息 = 総返済額 - 借入総額で求めることができます。固定金利と変動金利では将来の利息が異なるため、シミュレーションで事前に確認することが重要です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "奨学金返済シミュレーター - 総返済額・期間を無料計算 | ツールボックス",
  description:
    "奨学金の総返済額と返済期間を計算。借入総額・利率・月々返済額から繰り上げ返済の効果も比較。日本学生支援機構（JASSO）第一種・第二種対応。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/scholarship-repay",
  },
  openGraph: {
    title: "奨学金返済シミュレーター - 総返済額・期間を無料計算",
    description:
      "奨学金の総返済額と返済期間を計算。借入総額・利率・月々返済額から繰り上げ返済の効果も比較。",
    url: "https://www.toolbox-jp.net/tools/scholarship-repay",
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
