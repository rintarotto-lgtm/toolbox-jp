import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "CAGRとは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CAGR（Compound Annual Growth Rate：年平均成長率）は、複数年にわたる投資リターンを1年あたりの平均成長率に換算した指標です。例えば100万円が3年で150万円になった場合、CAGRは約14.5%になります。単純な年次リターンの平均より正確に長期パフォーマンスを評価できます。",
      },
    },
    {
      "@type": "Question",
      name: "良い投資利回りの目安はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的にインフレ率（日本では約2%）を上回ることが最低ラインとされます。インデックス投資では年利5〜10%が長期的な目安です。S&P500の過去平均は約10%/年、日経平均は約6%/年とされています。ただし過去の実績が将来を保証するものではありません。",
      },
    },
    {
      "@type": "Question",
      name: "インデックス投資の平均リターンはどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "長期の歴史的データでは、S&P500（米国株）が年率約10%、全世界株（オルカン）が年率約8%、日経平均が年率約6%とされています。ただしこれは過去の実績であり、為替変動・税金・信託報酬などを差し引いた実質リターンはさらに低くなる点に注意が必要です。",
      },
    },
    {
      "@type": "Question",
      name: "税引後リターンはどうやって計算しますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "日本では株式・投資信託の売却益・配当金に対して約20.315%（所得税15.315%＋住民税5%）の税金がかかります。税引後リターン = 税引前利益 × (1 - 0.20315) で計算できます。NISAを活用すると非課税で運用でき、実質リターンを高められます。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "投資リターン計算【年率・CAGR・IRR】株式・投資信託の利回り計算 | ツールボックス",
  description:
    "投資の利回り・年率リターン（CAGR）を無料計算。購入価格・売却価格・配当金・保有期間から実質リターンを算出。インデックス投資・株式投資の成績評価に。",
  keywords: ["投資 利回り 計算", "CAGR 計算", "年率リターン", "株式 リターン 計算", "投資信託 利回り"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/investment-return",
  },
  openGraph: {
    title: "投資リターン計算【年率・CAGR】株式・投資信託の利回り計算",
    description: "購入・売却価格と保有期間からCAGR（年率リターン）を無料計算。税引後リターンも算出。",
    url: "https://www.toolbox-jp.net/tools/investment-return",
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
