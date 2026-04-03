import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "正常血圧の基準値は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "日本高血圧学会の基準では、診察室血圧で収縮期120mmHg未満かつ拡張期80mmHg未満が正常血圧です。家庭血圧では115/75mmHg未満が正常とされます。",
      },
    },
    {
      "@type": "Question",
      name: "高血圧の基準値はいくつですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "診察室血圧で収縮期140mmHg以上または拡張期90mmHg以上が高血圧と診断されます。家庭血圧では135/85mmHg以上が高血圧の基準です。",
      },
    },
    {
      "@type": "Question",
      name: "上の血圧と下の血圧の違いは？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "収縮期血圧（上）は心臓が血液を送り出す瞬間の最大圧力、拡張期血圧（下）は心臓が弛緩している時の最小圧力です。両方を確認することが重要です。",
      },
    },
    {
      "@type": "Question",
      name: "血圧を下げるには何が効果的ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "減塩（6g/日未満）、体重管理、適度な運動（有酸素運動30分/日）、禁煙、アルコール制限が効果的です。薬物療法が必要な場合は医師に相談してください。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title:
    "血圧判定【正常・高血圧・低血圧】収縮期・拡張期から血圧レベルを判定 | ツールボックス",
  description:
    "収縮期血圧（上）と拡張期血圧（下）から血圧レベルを無料判定。WHO・日本高血圧学会の基準に基づいて正常・高血圧・低血圧を分類。家庭血圧の管理にも。",
  keywords: [
    "血圧 判定",
    "高血圧 基準",
    "血圧 正常値",
    "血圧 計算",
    "家庭血圧 管理",
  ],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/blood-pressure" },
  openGraph: {
    title: "血圧判定【正常・高血圧・低血圧】",
    description:
      "収縮期・拡張期血圧から日本高血圧学会の基準で血圧レベルを無料判定。家庭血圧の管理にも。",
    url: "https://www.toolbox-jp.net/tools/blood-pressure",
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
