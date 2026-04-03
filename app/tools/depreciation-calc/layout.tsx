import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "定額法と定率法の違いは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "定額法は毎年同じ金額を償却する方法です。定率法は未償却残高に一定率をかけるため、初年度の償却額が大きく、年々減少します。個人事業主は原則定額法、法人は定率法も選択できます。"
      }
    },
    {
      "@type": "Question",
      "name": "パソコンの耐用年数は何年ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "パソコン（サーバー以外）の法定耐用年数は4年です。ただし、10万円未満なら全額損金算入、30万円未満なら少額減価償却資産の特例（青色申告の中小企業）が使えます。"
      }
    },
    {
      "@type": "Question",
      "name": "車の減価償却はどう計算しますか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "新車の法定耐用年数は普通乗用車6年、軽自動車4年です。中古車の場合は（法定耐用年数－経過年数）＋経過年数×0.2で計算します。事業使用割合に応じて按分が必要です。"
      }
    },
    {
      "@type": "Question",
      "name": "減価償却の計算で1円残す理由は何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "税法上、減価償却は帳簿価額が備忘価額（1円）になるまでしか行えません。完全に0円にすることはできないため、最終年度は1円を残した金額までしか償却できません。"
      }
    }
  ]
};

export const metadata: Metadata = {
  title: "減価償却計算【定額法・定率法】耐用年数から自動計算 | ツールボックス",
  description: "減価償却費を無料計算。定額法・定率法に対応。パソコン・車・建物など資産の取得価額と耐用年数を入力するだけで年度別償却額を一覧表示。確定申告・法人税申告に。",
  keywords: ["減価償却 計算", "定額法 定率法", "減価償却費 計算", "耐用年数 一覧", "減価償却 シミュレーション"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/depreciation-calc" },
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
