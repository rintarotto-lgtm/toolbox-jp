import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "経費として認められるものは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "事業に関連する支出が経費になります。交通費・宿泊費・会議費・通信費・消耗品費・広告宣伝費などが代表例です。プライベートとの按分が必要なものもあります。",
      },
    },
    {
      "@type": "Question",
      name: "レシートなしでも経費計上できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "3万円未満の交通費（バス・電車）など領収書の取得が困難なものは出金伝票での代替が認められる場合があります。ただし原則として領収書・レシートの保管が必要です。",
      },
    },
    {
      "@type": "Question",
      name: "自宅兼事務所の家賃は経費になりますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "個人事業主・フリーランスは自宅の使用面積按分で家賃の一部を経費にできます。例えば30㎡の部屋で仕事用スペース6㎡なら20%が経費算入可能です。",
      },
    },
    {
      "@type": "Question",
      name: "経費の領収書はいつまで保管が必要ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "法人は7年間（青色申告の欠損金がある場合は10年）、個人事業主は5年間の保管が義務付けられています。電子保存も法的に認められています。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "経費精算計算【交通費・日当・領収書管理】経費の合計を自動集計 | ツールボックス",
  description:
    "出張・交通費・接待費など経費を無料集計。日付・項目・金額を入力するだけで経費合計を自動計算。消費税区分（10%・8%）も対応。CSVダウンロード機能付き。",
  keywords: [
    "経費精算 計算",
    "交通費精算 計算",
    "出張費 計算",
    "経費 集計",
    "領収書 計算",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/business-expense",
  },
  openGraph: {
    title: "経費精算計算【交通費・日当・領収書管理】",
    description:
      "日付・項目・金額を入力するだけで経費を自動集計。消費税10%・8%対応。印刷・CSVダウンロード機能付き。",
    url: "https://www.toolbox-jp.net/tools/business-expense",
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
