import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "ポモドーロテクニックとは何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "25分作業→5分休憩を1セット（1ポモドーロ）として繰り返す時間管理術です。4セット後に15〜30分の長休憩を取ります。イタリア語でトマトを意味するポモドーロという形のキッチンタイマーを使って考案されました。",
      },
    },
    {
      "@type": "Question",
      name: "ポモドーロの時間は変えてもいいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "はい。集中力の高い人は50分作業+10分休憩、短時間集中したい場合は15分+5分など、自分に合った時間で行うことが重要です。",
      },
    },
    {
      "@type": "Question",
      name: "1日に何ポモドーロできますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "集中力を維持できる理想的な数は1日8〜12ポモドーロ（標準25分）とされています。それ以上は集中力が低下します。",
      },
    },
    {
      "@type": "Question",
      name: "ポモドーロでタスクの時間を見積もるには？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1ポモドーロ（25分）を1単位として、各タスクが何ポモドーロかかるか見積もります。見積もりと実績の差から自分の作業速度を把握できます。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "ポモドーロ計算ツール【作業時間・休憩計算】集中時間を最適化 | ツールボックス",
  description:
    "ポモドーロテクニックを活用した作業計画を無料計算。作業時間・休憩・タスク数から1日のスケジュールと完了予定時刻を計算。集中力・生産性向上に。",
  keywords: [
    "ポモドーロ 計算",
    "ポモドーロテクニック",
    "作業時間 計算",
    "集中力 時間 計算",
    "タスク 時間 見積もり",
  ],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/pomodoro-calc" },
  openGraph: {
    title: "ポモドーロ計算ツール【作業時間・休憩計算】集中時間を最適化",
    description:
      "ポモドーロテクニックで作業計画を無料計算。タスクごとの完了予定時刻とタイムラインを自動生成。",
    url: "https://www.toolbox-jp.net/tools/pomodoro-calc",
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
