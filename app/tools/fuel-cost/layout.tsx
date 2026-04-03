import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ガソリン代計算【高速代込み】走行距離から燃料費を自動計算 | ツールボックス",
  description:
    "ガソリン代・燃料費を無料計算。走行距離・燃費・ガソリン単価から燃料費を自動計算。高速道路料金の概算も加算可能。通勤・旅行・ドライブの費用見積もりに。",
  keywords: [
    "ガソリン代 計算",
    "燃料費 計算",
    "燃費 計算",
    "ガソリン代 距離",
    "車 燃費 費用",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/fuel-cost",
  },
  openGraph: {
    title: "ガソリン代計算【高速代込み】走行距離から燃料費を自動計算",
    description:
      "ガソリン代・燃料費を無料計算。走行距離・燃費・ガソリン単価から燃料費を自動計算。高速道路料金の概算も加算可能。",
    url: "https://www.toolbox-jp.net/tools/fuel-cost",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "燃費の計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "燃費(km/L) = 走行距離(km) ÷ 給油量(L)で計算します。例えば300km走って30L給油した場合、燃費は10km/Lです。",
      },
    },
    {
      "@type": "Question",
      name: "ガソリン代の計算方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ガソリン代 = 走行距離 ÷ 燃費 × ガソリン単価で計算します。100km走って燃費15km/L、ガソリン170円/Lなら約1,133円になります。",
      },
    },
    {
      "@type": "Question",
      name: "電気自動車のランニングコストはガソリン車と比べてどうですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "電気自動車の電費は約6〜8km/kWhで、電気代が30円/kWhなら1km約4〜5円。ガソリン車（燃費15km/L、ガソリン170円/L）の1km約11円と比べると約半分以下です。",
      },
    },
    {
      "@type": "Question",
      name: "高速道路料金の目安はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "高速道路の普通車料金は概ね1km当たり約25〜35円程度です。東名高速（東京〜名古屋）は約5,000〜7,000円、東名・名神（東京〜大阪）は約10,000円程度です。",
      },
    },
  ],
};

export default function FuelCostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
