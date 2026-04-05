import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "チップ・サービス料計算 - 海外旅行の相場と計算方法 | ToolBox Japan",
  description: "海外旅行のチップ（tip）金額を無料計算。米国・ヨーロッパ・アジア各国のチップ相場（%）とマナー。レストラン・ホテル・タクシー・美容院別に最適なチップを計算。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "アメリカのレストランのチップ相場はいくらですか？", acceptedAnswer: { "@type": "Answer", text: "アメリカのレストランのチップ相場は税込金額の15〜20%が一般的です。料理の質・サービスが良ければ20〜25%、不満があっても10%は渡すのがマナーとされています。" } },
          { "@type": "Question", name: "チップを渡さなくてよい国はどこですか？", acceptedAnswer: { "@type": "Answer", text: "日本・韓国・中国・台湾ではチップは不要（失礼になることも）。オーストラリアも基本不要です。ただしトップクラスのホテルや特別なサービスには渡す場合もあります。" } },
          { "@type": "Question", name: "タクシーのチップ相場はいくらですか？", acceptedAnswer: { "@type": "Answer", text: "米国ではメーター料金の10〜15%、ヨーロッパでは端数を切り上げる程度が一般的です。Uberなどのライドシェアでは画面上で%を選択できます。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
