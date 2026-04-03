import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "配当金にはどのくらい税金がかかりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "特定口座（源泉徴収あり）では所得税15%＋住民税5%＋復興特別所得税0.315%の合計20.315%が源泉徴収されます。NISA口座内の配当金は非課税です。",
      },
    },
    {
      "@type": "Question",
      name: "配当利回りとは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1株当たり年間配当金÷株価×100で計算されます。例えば株価1,000円で年間配当30円なら利回り3%です。一般的に利回り3〜5%以上を高配当株と呼びます。",
      },
    },
    {
      "@type": "Question",
      name: "配当金はいつもらえますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "企業が定める配当基準日（多くは3月末や9月末）に株式を保有していると受け取れます。実際の入金は基準日から約2〜3ヶ月後が一般的です。",
      },
    },
    {
      "@type": "Question",
      name: "配当金で生活するには何株必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "年間生活費を配当利回りで割ると必要な投資額が計算できます。月20万円（年240万円）の配当を得るために利回り3%なら8,000万円、5%なら4,800万円の投資が必要です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "配当金・株式利回り計算【税引後手取り】配当利回りから年間受取額を計算 | ツールボックス",
  description:
    "配当金の税引後手取り額を無料計算。株価・配当利回り・保有株数から年間配当金を算出。NISA口座なら非課税、特定口座なら20.315%の税金を差し引いた実手取り額を表示。",
  keywords: ["配当金 計算", "配当利回り 計算", "株式 配当 手取り", "配当金 税金", "高配当株 計算"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/stock-dividend",
  },
  openGraph: {
    title: "配当金・株式利回り計算【税引後手取り】",
    description:
      "株価・配当利回り・保有株数から年間配当金を計算。NISA口座・特定口座ごとの税引後手取り額を表示。",
    url: "https://www.toolbox-jp.net/tools/stock-dividend",
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
