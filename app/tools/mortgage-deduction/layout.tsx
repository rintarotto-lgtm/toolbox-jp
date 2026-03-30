import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "住宅ローン控除はいくら戻ってきますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "住宅ローン控除は年末残高の0.7%が所得税・住民税から控除されます。新築の場合、最大控除額は年35万円（借入限度額5,000万円×0.7%）で、最長13年間適用されます。",
      },
    },
    {
      "@type": "Question",
      name: "住宅ローン控除の期間は何年ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2022年以降に居の場合、新築住宅・認定住宅は13年間、中古住宅は10年間です。控除期間中に年末残高の0.7%が毎年控除されます。",
      },
    },
    {
      "@type": "Question",
      name: "住宅ローン控除の借入限度額はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2024〜2025年入居の場合: 認定長期優良住宅・低炭素住宅5,000万円、ZEH水準省エネ住宅4,500万円、省エネ基準適合住宅4,000万円、一般新築3,000万円です。",
      },
    },
    {
      "@type": "Question",
      name: "住宅ローン控除は確定申告が必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "初年度は確定申告が必要です。2年目以降は会社員であれば年末調整で手続き可能です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "住宅ローン控除シミュレーター - 13年間の節税額を計算 | ツールボックス",
  description:
    "住宅ローン控除（減税）の節税額を無料シミュレーション。借入額・金利・住宅種別を入力するだけで13年間の控除額合計を計算。2024年税制対応。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/mortgage-deduction",
  },
  openGraph: {
    title: "住宅ローン控除シミュレーター - 13年間でいくら戻る？",
    description:
      "借入額・金利から住宅ローン控除の年間・合計節税額を計算。2024年税制対応。",
    url: "https://www.toolbox-jp.net/tools/mortgage-deduction",
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
