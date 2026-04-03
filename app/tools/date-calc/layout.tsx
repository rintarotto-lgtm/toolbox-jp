import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "日付計算ツール【日数・営業日・期間計算】2つの日付の差を自動計算 | ツールボックス",
  description:
    "2つの日付の差（日数・週数・月数・年数）を無料計算。営業日数のカウント・〇日後/前の日付計算・記念日カウントダウンも対応。",
  keywords: ["日付計算", "日数計算", "期間計算", "営業日 計算", "日付 差 計算"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/date-calc" },
  openGraph: {
    title: "日付計算ツール【日数・営業日・期間計算】2つの日付の差を自動計算 | ツールボックス",
    description:
      "2つの日付の差（日数・週数・月数・年数）を無料計算。営業日数のカウント・〇日後/前の日付計算・記念日カウントダウンも対応。",
    url: "https://www.toolbox-jp.net/tools/date-calc",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "2つの日付の間の日数を計算するには？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "終了日から開始日を引くと日数が求められます。例えば4月1日から9月30日は183日間です。本ツールでは日数・週数・月数・年数を一括計算できます。",
          },
        },
        {
          "@type": "Question",
          name: "営業日数の計算方法は？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "土日と祝日を除いた日数が営業日数です。本ツールでは日本の祝日を考慮した営業日数を計算できます。",
          },
        },
        {
          "@type": "Question",
          name: "〇日後の日付を調べるには？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "基準日に日数を足すと将来の日付がわかります。例えば今日から100日後の日付や、契約期間の満了日などを計算できます。",
          },
        },
        {
          "@type": "Question",
          name: "うるう年の判定方法は？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "4で割り切れる年がうるう年ですが、100で割り切れる年は平年、400で割り切れる年はうるう年です。2024年はうるう年です。",
          },
        },
      ],
    }),
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
