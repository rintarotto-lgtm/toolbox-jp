import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "カフェインの1日の上限量はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "健康な成人の場合、1日のカフェイン摂取量の上限は400mg以下が推奨されています（WHO・カナダ保健省等の基準）。コーヒー換算でおよそ4〜5杯に相当します。ただし妊婦・授乳中の方は200mg以下、子供・青少年はさらに低い量が推奨されます。",
      },
    },
    {
      "@type": "Question",
      name: "コーヒー1杯のカフェイン量はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ドリップコーヒー（240ml）1杯に含まれるカフェインは約70〜140mg（平均約90mg）です。エスプレッソ1ショット（30ml）は約60mg、インスタントコーヒーは約60〜90mgです。カフェレス（デカフェ）コーヒーでも2〜15mg程度のカフェインが残留しています。",
      },
    },
    {
      "@type": "Question",
      name: "カフェインの半減期（体内に残る時間）はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "カフェインの半減期は約5〜6時間です。例えば午後3時にコーヒー（90mg）を飲んだ場合、午後8〜9時には半分の45mgが体内に残ります。就寝6時間前以降のカフェイン摂取は睡眠の質を低下させる可能性があります。",
      },
    },
    {
      "@type": "Question",
      name: "妊娠中のカフェイン摂取量はどのくらいですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "妊娠中・授乳中の方のカフェイン摂取量は1日200mg以下が推奨されています（WHO・日本産科婦人科学会）。コーヒー換算で約2杯に相当します。胎児はカフェインを代謝する能力が低く、過剰摂取は低出生体重や流産リスクと関連するとされています。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "カフェイン摂取量計算【コーヒー何杯まで？】1日の上限・半減期を計算 | ツールボックス",
  description:
    "1日のカフェイン摂取量を管理。コーヒー・緑茶・エナジードリンクなど飲み物ごとのカフェイン含有量を計算。体重別の安全上限量・睡眠への影響時間も表示。",
  keywords: [
    "カフェイン 計算",
    "コーヒー カフェイン 量",
    "カフェイン 上限",
    "カフェイン 半減期",
    "カフェイン 摂りすぎ",
  ],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/caffeine-calc" },
  openGraph: {
    title: "カフェイン摂取量計算【コーヒー何杯まで？】1日の上限・半減期を計算",
    description:
      "コーヒー・エナジードリンクなどのカフェイン量を合計。体重別安全上限・睡眠への影響時間も表示。",
    url: "https://www.toolbox-jp.net/tools/caffeine-calc",
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
