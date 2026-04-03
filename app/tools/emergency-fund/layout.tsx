import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "緊急予備資金はいくら必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的に生活費の3〜6ヶ月分が推奨されています。会社員は3ヶ月、自営業・フリーランスは6〜12ヶ月を目安にしましょう。",
      },
    },
    {
      "@type": "Question",
      name: "緊急予備資金はどこに置くべきですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "普通預金や高金利の定期預金など、すぐに引き出せる流動性の高い場所が最適です。投資に回してはいけません。確実に使えることが最優先です。",
      },
    },
    {
      "@type": "Question",
      name: "緊急予備資金と投資はどちらを優先すべきですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "緊急予備資金を先に確保してから投資を始めることが原則です。緊急資金なしで投資すると、急な出費で投資を損切りせざるを得なくなるリスクがあります。",
      },
    },
    {
      "@type": "Question",
      name: "緊急予備資金を使ってしまったらどうすればいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "使った分を速やかに補充することが重要です。緊急出費後は投資・贅沢を一時停止し、まず緊急資金の回復を優先しましょう。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "緊急予備資金計算【何ヶ月分必要？】生活防衛資金の目標額を計算 | ツールボックス",
  description:
    "緊急予備資金（生活防衛資金）の必要額を無料計算。月の生活費・雇用形態・家族構成から推奨する緊急資金の目標額を算出。達成までの積立プランも表示。",
  keywords: ["緊急予備資金 計算", "生活防衛資金 計算", "緊急資金 いくら", "生活費 貯金 目標", "緊急時 備え"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/emergency-fund",
  },
  openGraph: {
    title: "緊急予備資金計算【何ヶ月分必要？】生活防衛資金の目標額を計算",
    description: "月の生活費・雇用形態・家族構成から推奨する緊急資金の目標額を算出。達成までの積立プランも表示。",
    url: "https://www.toolbox-jp.net/tools/emergency-fund",
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
