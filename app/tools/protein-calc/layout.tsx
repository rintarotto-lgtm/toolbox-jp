import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "タンパク質必要量計算 - 体重・目的別に最適摂取量を無料計算 | ToolBox Japan",
  description: "体重・年齢・運動量・目的（筋トレ・ダイエット・維持）からタンパク質の1日必要量を無料計算。食品別タンパク質量も一覧表示。筋肉量アップ・体重管理に活用。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "タンパク質の1日の必要量はどれくらいですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "一般的な成人では体重1kgあたり0.8〜1.0gが目安です。筋トレをしている方は体重1kgあたり1.6〜2.2g、ダイエット中は1.2〜1.6gが推奨されます。",
                },
              },
              {
                "@type": "Question",
                name: "タンパク質を摂りすぎるとどうなりますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "過剰摂取は腎臓への負担増加、体重増加（余分なカロリーとして蓄積）、消化器系の不調などを引き起こす可能性があります。体重1kgあたり2.2g以下を目安にしましょう。",
                },
              },
              {
                "@type": "Question",
                name: "タンパク質が多い食品はどれですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "鶏胸肉（100gあたり約23g）、卵（1個約6g）、豆腐（100gあたり約7g）、プロテインパウダー（1食約20〜25g）などが代表的な高タンパク食品です。",
                },
              },
            ],
          }),
        }}
      />
      {children}
    </>
  );
}
