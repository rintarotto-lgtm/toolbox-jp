import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "フリーランスの税金はどうやって計算するのですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "フリーランスの税金は「売上－経費＝事業所得」を求めてから、青色申告特別控除・基礎控除・iDeCo掛金などを差し引いた「課税所得」に累進税率を適用して所得税を計算します。住民税（課税所得×10%）・国民健康保険料・国民年金も加えた合計が年間の税負担額です。",
      },
    },
    {
      "@type": "Question",
      name: "フリーランスは経費でどれくらい節税できますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "経費が増えるほど事業所得が減り、所得税・住民税・国民健康保険料がすべて下がります。たとえば課税所得が500万円の方が100万円の経費を追加計上すると、所得税・住民税だけで約30万円以上の節税効果が見込めます。パソコン・通信費・家賃（按分）・書籍代など事業に必要な支出は積極的に経費化しましょう。",
      },
    },
    {
      "@type": "Question",
      name: "青色申告特別控除65万円を受ける条件は何ですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "65万円の青色申告特別控除を受けるには、①事前に「青色申告承認申請書」を税務署に提出、②複式簿記による記帳、③確定申告書にB様式・青色申告決算書を添付、④e-Tax（電子申告）での提出、が必要です。紙での申告の場合は控除額が55万円になります。",
      },
    },
    {
      "@type": "Question",
      name: "インボイス制度（消費税）はフリーランスに関係ありますか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2023年10月から始まったインボイス制度により、適格請求書発行事業者（課税事業者）に登録しないと取引先が消費税仕入税額控除を受けられなくなり、値引き交渉をされる場合があります。年間売上1,000万円以下の免税事業者も登録を求められるケースがあるため、取引先との関係を踏まえて登録を検討しましょう。",
      },
    },
  ],
};

export const metadata: Metadata = {
  title: "フリーランス税金シミュレーター【2025年確定申告】手取りと税金を計算 | ツールボックス",
  description:
    "フリーランス・個人事業主の税金と手取り額を無料計算。売上・経費・青色申告控除を入力して所得税・住民税・国民健康保険料・国民年金の合計を一括シミュレーション。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/freelance-tax",
  },
  openGraph: {
    title: "フリーランス税金シミュレーター【2025年確定申告】手取りと税金を計算",
    description:
      "売上・経費・青色申告控除を入力して所得税・住民税・国保・年金の合計を一括シミュレーション。",
    url: "https://www.toolbox-jp.net/tools/freelance-tax",
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
