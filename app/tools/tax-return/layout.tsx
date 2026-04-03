import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "確定申告の還付金はいつ振り込まれますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "e-Taxで申告した場合は3週間〜2ヶ月程度、書面申告は1〜3ヶ月程度で指定口座に振り込まれます。",
      },
    },
    {
      "@type": "Question",
      name: "医療費控除はいくらから申告できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "年間の医療費が10万円（または所得の5%のいずれか低い方）を超えた場合に申告できます。最高控除額は200万円です。",
      },
    },
    {
      "@type": "Question",
      name: "確定申告が必要な人はどんな人ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "給与収入が2,000万円超、副業収入が20万円超、2か所以上から給与、医療費控除・住宅ローン控除初年度申請など、還付を受けたい場合は申告が必要です。",
      },
    },
    {
      "@type": "Question",
      name: "ふるさと納税の確定申告は必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ワンストップ特例制度を利用した場合は確定申告不要ですが、寄付先が6自治体以上の場合や確定申告が必要な人は確定申告で申告します。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "確定申告・還付金計算【2025年版】医療費・ふるさと納税の還付額を計算 | ツールボックス",
  description:
    "確定申告の還付金額を無料計算。医療費控除・ふるさと納税・住宅ローン控除・雑損控除などの申告控除から所得税の還付見込み額をシミュレーション。",
  keywords: ["確定申告 還付金 計算", "医療費控除 還付金", "ふるさと納税 還付金", "確定申告 シミュレーション", "所得税 還付"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/tax-return",
  },
  openGraph: {
    title: "確定申告・還付金計算【2025年版】医療費・ふるさと納税の還付額を計算",
    description:
      "確定申告の還付金額を無料計算。医療費控除・ふるさと納税・住宅ローン控除などの控除から所得税の還付見込み額をシミュレーション。",
    url: "https://www.toolbox-jp.net/tools/tax-return",
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
