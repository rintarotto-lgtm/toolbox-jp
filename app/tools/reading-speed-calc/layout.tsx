import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "日本人の平均読書速度は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的に400〜600文字/分とされています。速読トレーニングを積むことで1,000文字/分以上も可能になります。黙読の練習や返り読みを減らす訓練が効果的です。",
      },
    },
    {
      "@type": "Question",
      name: "本の平均的な文字数は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "一般的な文庫本で10〜20万字程度が多いです。新書は6〜10万字が多く、ライトノベルは8〜12万字程度です。学術書や専門書はジャンルにより大きく異なります。",
      },
    },
    {
      "@type": "Question",
      name: "読書速度を上げるには？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "黙読の練習、視野を広げる訓練（複数単語をまとめて認識する）、返り読みを減らすことが効果的です。毎日継続的に読書することで自然に速度が上がります。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "読書速度・読了時間計算 - 本の読み終わり時間を無料計算 | ツールボックス",
  description:
    "読書スピードと文字数から読了時間を計算。速度テスト機能付き。日本人平均との比較、1日○分読めば○日で読了できるかも表示。読書計画に。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/reading-speed-calc" },
  openGraph: {
    title: "読書速度・読了時間計算 - 本の読み終わり時間を計算",
    description:
      "読書スピードと文字数から読了時間を計算。速度テスト機能付きで読書計画に活用。",
    url: "https://www.toolbox-jp.net/tools/reading-speed-calc",
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
