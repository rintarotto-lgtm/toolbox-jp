import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "源泉徴収税額計算 - 給与・報酬・フリーランスの源泉税を無料計算 | ToolBox Japan",
  description: "給与・報酬から源泉徴収される所得税額を無料計算。フリーランス・副業の報酬源泉徴収率（10.21%）、給与所得の源泉徴収税額表に対応。手取り計算にも活用。",
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
                name: "フリーランスの源泉徴収税率は何パーセントですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "原則として報酬の10.21%（所得税10%＋復興特別所得税0.21%）が源泉徴収されます。報酬が100万円を超える部分は20.42%です。",
                },
              },
              {
                "@type": "Question",
                name: "源泉徴収された税金は確定申告で戻ってきますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "はい、確定申告で年間の所得税を計算し、源泉徴収額が多すぎた場合は還付されます。フリーランスは必ず確定申告を行いましょう。",
                },
              },
              {
                "@type": "Question",
                name: "源泉徴収の対象となる報酬の種類は？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "原稿料、講演料、デザイン料、システム開発費、コンサルティング費用、弁護士・税理士報酬などが対象です。物品販売は原則対象外です。",
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
