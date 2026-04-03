import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "国内旅行の平均費用はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "観光庁の調査によると、国内旅行（1泊2日）の1人当たり平均消費額は約3〜5万円程度です。交通費・宿泊費が大きな割合を占め、目的地によって大きく異なります。例えば沖縄・北海道は航空券代が高めで1人5〜8万円程度、近隣への旅行は1〜3万円程度が目安です。",
      },
    },
    {
      "@type": "Question",
      name: "海外旅行の平均予算はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "海外旅行の費用は目的地により大きく異なります。近隣のアジア圏（韓国・台湾）は3〜5万円、東南アジア（タイ・バリ等）は5〜10万円、ハワイは15〜25万円、ヨーロッパは20〜40万円程度が1人当たりの目安です。滞在日数・時期・宿泊グレードにより変動します。",
      },
    },
    {
      "@type": "Question",
      name: "旅行積立の方法を教えてください",
      acceptedAnswer: {
        "@type": "Answer",
        text: "旅行積立の方法には、銀行の定期積立・旅行会社の積立旅行・自分での毎月積立などがあります。目標金額を旅行までの月数で割って毎月の積立額を決めるのが基本です。例えば20万円の旅行に12ヶ月後に行く場合、毎月約1.7万円の積立が必要です。",
      },
    },
    {
      "@type": "Question",
      name: "旅行保険は必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "海外旅行では医療費が高額になるリスクがあるため、旅行保険への加入が強く推奨されます。クレジットカードの旅行保険が自動付帯の場合もあります。国内旅行でもケガや急病・旅行のキャンセル等に備えて加入を検討する価値があります。費用は数百円〜数千円程度です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "旅行予算計算ツール【国内・海外対応】費用を項目別に自動計算 | ツールボックス",
  description:
    "旅行の予算を無料計算。交通費・宿泊費・食費・観光費を入力して合計予算と1人当たりの費用を自動算出。国内旅行・海外旅行の費用シミュレーションに。",
  keywords: ["旅行 予算 計算", "旅行費用 計算", "旅行 費用 シミュレーション", "海外旅行 予算", "国内旅行 費用"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/travel-budget" },
  openGraph: {
    title: "旅行予算計算ツール【国内・海外対応】",
    description: "旅行の予算を項目別に自動計算。1人当たり費用も算出。",
    url: "https://www.toolbox-jp.net/tools/travel-budget",
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
