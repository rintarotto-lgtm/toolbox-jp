import type { Metadata } from "next";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "理想的な家計の支出割合はどのくらいですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "手取り収入を100%とした場合、住居費25%以下、食費15%、光熱費5%、通信費3%以下、趣味・娯楽5%、貯蓄20%以上が理想とされています。ただし地域や家族構成によって異なります。"
      }
    },
    {
      "@type": "Question",
      "name": "貯蓄はどのくらいするのが正解ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "一般的に手取り収入の20%以上が理想とされています。まず生活費の3〜6ヶ月分の緊急予備資金を確保し、その後iDeCo・NISAなどの投資に回すのがおすすめです。"
      }
    },
    {
      "@type": "Question",
      "name": "一人暮らしの平均的な生活費はいくらですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "総務省の家計調査によると、単身世帯の月間消費支出は約15〜17万円程度です。ただし東京などの都市部では家賃が高いため20万円以上かかることも珍しくありません。"
      }
    },
    {
      "@type": "Question",
      "name": "固定費と変動費の違いは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "固定費は毎月ほぼ一定の支出（家賃・保険料・サブスク等）で、変動費は月によって変動する支出（食費・光熱費・娯楽費等）です。節約は固定費の削減が効果的です。"
      }
    }
  ]
};

export const metadata: Metadata = {
  title: "家計簿シミュレーター【収支バランス診断】理想の家計割合と比較 | ツールボックス",
  description: "月の収入・支出を入力して家計の収支バランスを診断。住居費・食費・光熱費など項目別に理想割合と比較。節約のヒントと貯蓄シミュレーションも。",
  keywords: ["家計簿 シミュレーター", "家計 収支 計算", "理想 家計 割合", "家計 診断", "節約 シミュレーション"],
  alternates: { canonical: "https://www.toolbox-jp.net/tools/home-budget" },
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
