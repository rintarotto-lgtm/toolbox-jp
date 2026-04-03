import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "年末調整シミュレーター【2025年版】還付金・追徴額を事前に計算 | ツールボックス",
  description:
    "年末調整の還付金・追徴額を事前にシミュレーション。給与収入・各種控除を入力して源泉徴収税との差額を計算。生命保険料控除・住宅ローン控除・扶養控除も対応。",
  keywords: [
    "年末調整 シミュレーション",
    "還付金 計算",
    "年末調整 いくら戻る",
    "源泉徴収 計算",
    "年末調整 控除",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/nenmatsu-chosei",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "年末調整とは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "給与所得者の1年間の所得税を正確に精算する手続きです。毎月の給与から天引きされた源泉徴収税の合計と実際の税額との差額を調整します。",
      },
    },
    {
      "@type": "Question",
      name: "年末調整の還付金の平均はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "会社員の平均還付額は年間約7〜8万円程度とされています。ただし扶養家族の変動や各種控除の申告内容によって大きく異なります。",
      },
    },
    {
      "@type": "Question",
      name: "生命保険料控除の上限はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "新契約（2012年以降）は一般・介護・個人年金それぞれ最大4万円、合計最大12万円です。旧契約は各最大5万円、合計最大10万円です。",
      },
    },
    {
      "@type": "Question",
      name: "住宅ローン控除はいつまで受けられますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2022年以降の入居は原則13年間（認定住宅等）または10年間受けられます。控除額は年末ローン残高の0.7%です。",
      },
    },
  ],
};

export default function NenmatsuChoseiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
