import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "インボイス制度とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2023年10月から始まった制度で、適格請求書（インボイス）を発行・保存することで消費税の仕入税額控除が可能になります。免税事業者はインボイスを発行できないため、取引先が仕入税額控除できなくなります。",
      },
    },
    {
      "@type": "Question",
      name: "免税事業者がインボイス登録すると税負担はどう変わりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "課税事業者になると売上に対する消費税を納付する義務が生じます。ただし仕入れにかかった消費税は控除できます。2026年9月まで経過措置として納税額の20%軽減があります。",
      },
    },
    {
      "@type": "Question",
      name: "簡易課税と本則課税どちらが有利ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "簡易課税は売上から「みなし仕入率」で消費税を計算する方法で、実際の仕入れが少ない業種（サービス業など）に有利です。売上5,000万円以下の事業者が選択できます。",
      },
    },
    {
      "@type": "Question",
      name: "フリーランスはインボイス登録すべきですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "取引先が消費税課税事業者の場合、インボイス未登録だと取引先が仕入税額控除できず、値引き要求や取引停止のリスクがあります。売上規模や取引先の状況を考慮して判断が必要です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "インボイス・消費税計算【免税事業者・課税事業者】消費税納税額を計算 | ツールボックス",
  description:
    "インボイス制度に対応した消費税納税額を無料計算。免税事業者・課税事業者の税負担を比較。簡易課税・本則課税の有利判定もシミュレーション。",
  keywords: ["インボイス 計算", "消費税 納税額 計算", "免税事業者 課税事業者", "簡易課税 計算", "消費税 申告"],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/invoice-calc",
  },
  openGraph: {
    title: "インボイス・消費税計算【免税事業者・課税事業者】消費税納税額を計算",
    description:
      "インボイス制度に対応した消費税納税額を無料計算。免税事業者・課税事業者の税負担を比較。簡易課税・本則課税の有利判定もシミュレーション。",
    url: "https://www.toolbox-jp.net/tools/invoice-calc",
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
