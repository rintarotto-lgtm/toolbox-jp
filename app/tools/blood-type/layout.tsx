import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "血液型で性格が決まるのは本当ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "科学的根拠はなく、心理学では「血液型性格判断」の信頼性は否定されています。ただし日本では文化的な話題として親しまれており、コミュニケーションのきっかけとして楽しまれています。",
      },
    },
    {
      "@type": "Question",
      name: "日本人の血液型の割合は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A型約38%、O型約31%、B型約22%、AB型約9%とされています。地域によっても多少異なります。",
      },
    },
    {
      "@type": "Question",
      name: "血液型が分からない場合はどうすれば良いですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "病院・献血センターで検査できます。また親の血液型から子どもの血液型を推定することも可能です（メンデルの法則）。",
      },
    },
    {
      "@type": "Question",
      name: "血液型と病気の関係はありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一部の研究でO型は血液が固まりにくい、A型は胃がんリスクがやや高いなどの統計的傾向が報告されています。ただし個人差が大きく、血液型だけで健康リスクを判断することは適切ではありません。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "血液型性格診断【A・B・O・AB型の特徴】相性チェック付き | ツールボックス",
  description:
    "血液型別の性格特徴と相性を無料チェック。A型・B型・O型・AB型それぞれの特徴・長所・短所・恋愛傾向を詳しく解説。2人の相性診断も。",
  keywords: [
    "血液型 性格",
    "血液型 相性",
    "血液型 診断",
    "A型 性格",
    "血液型 特徴",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/blood-type",
  },
  openGraph: {
    title: "血液型性格診断【A・B・O・AB型の特徴】相性チェック付き",
    description:
      "血液型別の性格特徴と相性を無料チェック。A型・B型・O型・AB型の特徴・恋愛傾向・相性診断。",
    url: "https://www.toolbox-jp.net/tools/blood-type",
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
