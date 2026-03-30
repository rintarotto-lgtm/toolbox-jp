import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "BMIとは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "BMI（Body Mass Index）は体重と身長から算出される体格指数です。計算式は「体重(kg) ÷ 身長(m)²」で、肥満度の判定に国際的に用いられています。",
      },
    },
    {
      "@type": "Question",
      name: "BMIの正常値・標準値はいくつですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "日本肥満学会の基準では、BMI 18.5未満がやせ（低体重）、18.5〜25未満が標準（普通体重）、25以上が肥満です。統計的にBMI 22が最も病気になりにくいとされており、理想体重の算出に使われます。",
      },
    },
    {
      "@type": "Question",
      name: "BMI 25以上は肥満ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "日本肥満学会の基準ではBMI 25以上を肥満と判定します。25〜30が肥満1度、30〜35が肥満2度、35〜40が肥満3度、40以上が肥満4度です。WHO基準は30以上が肥満ですが、日本ではアジア人の体質を考慮して25以上としています。",
      },
    },
    {
      "@type": "Question",
      name: "理想体重の計算方法を教えてください",
      acceptedAnswer: {
        "@type": "Answer",
        text: "理想体重 = 身長(m)² × 22 で計算します。例えば身長170cmの場合、1.70² × 22 = 63.5kgが理想体重です。BMI 22が統計的に最も健康的とされています。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "BMI計算 - 身長と体重からBMIを無料計算 | ツールボックス",
  description: "身長と体重を入力するだけでBMIを自動計算。日本肥満学会の基準でやせ〜肥満4度まで判定。理想体重も表示。無料オンラインツール。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/bmi-calc" },
  openGraph: {
    title: "BMI計算 - 身長と体重からBMIを計算",
    description: "身長と体重からBMIを計算。日本基準で肥満度判定。理想体重も表示。",
    url: "https://www.toolbox-jp.net/tools/bmi-calc",
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
