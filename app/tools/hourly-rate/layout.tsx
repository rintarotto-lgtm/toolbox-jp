import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "フリーランスの時給はどのくらいが適正ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "同じスキルの会社員の年収÷1,500〜1,800時間が粗利時給の目安です。そこに経費・社会保険・税金・有給相当を上乗せする必要があります。",
      },
    },
    {
      "@type": "Question",
      name: "フリーランスは会社員の何倍の単価が必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "社会保険・有給・賞与・退職金などを自己負担するため、一般的に同等の手取りを得るには会社員の1.4〜1.7倍の収入が必要とされます。",
      },
    },
    {
      "@type": "Question",
      name: "フリーランスの稼働率の目安は何%ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "営業・提案・事務・スキルアップの時間を除くと、実稼働率（請求可能時間÷総労働時間）は70〜80%程度が現実的です。100%稼働は持続困難です。",
      },
    },
    {
      "@type": "Question",
      name: "フリーランスの値上げはどうすれば成功しますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "実績・成果を数値で示す、市場単価データを提示する、スキルアップを証明するなどが効果的です。本ツールで算出した必要単価を根拠として交渉資料に使えます。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "フリーランス時給・単価設定計算【手取り目標から逆算】適正価格を計算 | ツールボックス",
  description:
    "フリーランス・個人事業主の適正時給・月額単価を無料計算。目標手取り年収・稼働時間・経費・税金から必要な請求単価を逆算。値上げ交渉の根拠づくりに。",
  keywords: [
    "フリーランス 時給 計算",
    "フリーランス 単価 設定",
    "フリーランス 適正単価",
    "時給 逆算 計算",
    "フリーランス 年収 計算",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/hourly-rate",
  },
  openGraph: {
    title: "フリーランス時給・単価設定計算【手取り目標から逆算】",
    description:
      "目標手取り年収・稼働時間・経費・税金から必要な請求単価を逆算。適正時給を無料計算。",
    url: "https://www.toolbox-jp.net/tools/hourly-rate",
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
