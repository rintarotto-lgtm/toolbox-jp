import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "1日の生活費・日割り予算計算 - 月収から1日の使える金額を無料計算 | ToolBox Japan",
  description: "月収・固定費から1日に使える自由なお金を無料計算。食費・交際費・娯楽費の日割り予算を設定。節約目標からの逆算で毎日の生活費管理に活用。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "月収20万円の1日の生活費の目安はいくらですか？", acceptedAnswer: { "@type": "Answer", text: "月収20万円（手取り）で家賃6万円・通信費1万円・保険1万円の固定費がある場合、残りは約12万円。1日あたり約4,000円が使える計算です。ここから食費・交通費・娯楽費を管理します。" } },
          { "@type": "Question", name: "1日3,000円の生活費で生活できますか？", acceptedAnswer: { "@type": "Answer", text: "1日3,000円（月9万円）は節約を意識すれば可能です。食費（自炊中心）1,000〜1,500円、交通費500円、その他1,000円が目安です。外食を減らし自炊中心にするのがポイントです。" } },
          { "@type": "Question", name: "家計管理に便利な方法はありますか？", acceptedAnswer: { "@type": "Answer", text: "「先取り貯金法」（給与日に貯蓄分を別口座に移す）と「封筒家計簿」（費目ごとに現金を分ける）が効果的です。家計簿アプリ（マネーフォワード等）の活用も便利です。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
