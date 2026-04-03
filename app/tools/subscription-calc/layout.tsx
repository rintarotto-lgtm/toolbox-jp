import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "サブスク費用計算【月額サービス一覧】年間コストと見直しポイントを計算 | ツールボックス",
  description:
    "毎月払っているサブスクリプションの年間コストを無料計算。動画・音楽・クラウド・ゲームなど登録中のサービスを入力して合計費用を可視化。解約候補も提案。",
  keywords: [
    "サブスク 計算",
    "サブスクリプション 費用",
    "月額サービス 一覧",
    "サブスク 見直し",
    "サブスク 年間コスト",
  ],
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/subscription-calc",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "日本人のサブスク平均支出はいくらですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "調査によると日本人の月間サブスク支出は平均5,000〜8,000円程度とされています。動画・音楽・ゲーム・クラウドなど複数加入すると気づかないうちに高額になりがちです。",
      },
    },
    {
      "@type": "Question",
      name: "サブスクの見直しはどのくらいの頻度でするべきですか？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "少なくとも半年に1度の棚卸しをおすすめします。使用頻度が月3回未満のサービスは解約を検討する目安です。",
      },
    },
    {
      "@type": "Question",
      name: "ポイントやキャンペーンを活用した節約方法は？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "年払いプランへの変更（通常2ヶ月分お得）、家族プランの活用、学生割引の利用などが効果的です。使用頻度の低いサービスは無料プランへのダウングレードも検討しましょう。",
      },
    },
    {
      "@type": "Question",
      name: "サブスクの無料トライアルを忘れずに解約するには？",
      acceptedAnswer: {
        "@type": "Answer",
        text: "申し込みと同時にスマートフォンのカレンダーに解約リマインダーを設定するのが最も確実です。クレジットカード明細を定期的に確認することも重要です。",
      },
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
