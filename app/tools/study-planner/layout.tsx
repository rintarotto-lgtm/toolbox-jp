import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "資格試験の勉強時間の目安はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "主な目安：FP3級50〜100時間、FP2級150〜300時間、宅建200〜400時間、簿記3級50〜100時間、簿記2級200〜350時間、TOEICスコアアップ100点=約100時間、英検2級100〜200時間です。",
      },
    },
    {
      "@type": "Question",
      name: "効率的な勉強計画の立て方は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "試験日から逆算して総学習時間を均等に割り振り、週ごとの目標を決めます。最初の2週間は基礎固め、中盤は問題演習、最後の2週間は模試・復習というサイクルが効果的です。",
      },
    },
    {
      "@type": "Question",
      name: "社会人が毎日の勉強時間を確保するコツは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "通勤時間・昼休み・就寝前の30分など「隙間時間」を活用することが鍵です。朝型勉強は集中力が高く継続しやすいとされています。まず1日30分から始めましょう。",
      },
    },
    {
      "@type": "Question",
      name: "勉強のモチベーションを維持するには？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "具体的な目標（試験日・合格後の変化）を紙に書く、進捗を可視化する（本ツールの達成率表示など）、勉強仲間を作るなどが効果的です。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "勉強計画シミュレーター【試験日から逆算】1日の学習時間を計算 | ツールボックス",
  description:
    "試験日から逆算した勉強計画を無料作成。目標試験・必要学習時間・試験日を入力して1日の学習時間と週間スケジュールを自動計算。資格・受験対策に。",
  keywords: [
    "勉強計画 計算",
    "試験 勉強時間 計算",
    "資格 勉強 スケジュール",
    "受験 計画 シミュレーション",
    "学習時間 計算",
  ],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/study-planner" },
  openGraph: {
    title: "勉強計画シミュレーター【試験日から逆算】1日の学習時間を計算",
    description:
      "試験日・必要学習時間・1日の可能時間から最適な勉強スケジュールを自動計算。資格・受験対策に。",
    url: "https://www.toolbox-jp.net/tools/study-planner",
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
