import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "FIREに必要な資産額の計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "「年間生活費 × 25」がFIRE資産の目安です（4%ルール）。年間300万円で生活するなら7,500万円が必要です。資産の4%を毎年取り崩しても30年以上資産が持続するという研究（トリニティスタディ）に基づきます。",
      },
    },
    {
      "@type": "Question",
      name: "4%ルールとは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "資産の4%以下を毎年取り崩せば理論上資産は枯渇しないという投資の法則です。年率7%の運用リターンからインフレ率3%を引いた実質4%の成長が続くという前提に基づきます。",
      },
    },
    {
      "@type": "Question",
      name: "サイドFIREとは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "完全にFIREせず、生活費の一部をアルバイトや副業で賄いながら、残りを投資収益でカバーするFIREの亜種です。必要資産額を大幅に減らせます。",
      },
    },
    {
      "@type": "Question",
      name: "FIREを目指すうえで最も効果的な戦略は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "収入を増やしながら支出を減らし、差額をインデックス投資（全世界株・S&P500等）に積立てることです。支出の削減はそのまま必要資産の削減にもつながります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "FIRE計算シミュレーター【経済的自立・早期退職】必要資産額を計算 | ツールボックス",
  description:
    "FIRE（経済的自立・早期退職）に必要な資産額を無料計算。年間生活費・4%ルール・現在資産・積立額から目標達成年齢を算出。サイドFIRE・バリスタFIREも対応。",
  keywords: ["FIRE 計算", "経済的自立 計算", "早期退職 シミュレーション", "4%ルール 計算", "FIRE 必要資産"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/fire-calc",
  },
  openGraph: {
    title: "FIRE計算シミュレーター【経済的自立・早期退職】必要資産額を計算",
    description: "年間生活費・4%ルール・現在資産・積立額からFIRE達成年齢を算出。サイドFIRE・バリスタFIREも対応。",
    url: "https://www.toolbox-jp.net/tools/fire-calc",
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
