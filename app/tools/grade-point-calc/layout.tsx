import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPA・成績点数計算 - 大学の単位加重平均を計算 | ToolBox Japan",
  description: "大学のGPAを簡単計算。4.0・5.0スケール対応、単位数加重平均で正確に算出。大学院出願に向けた目標GPA達成シミュレーションも。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/grade-point-calc" },
  openGraph: {
    title: "GPA・成績点数計算 - 大学の単位加重平均を計算",
    description: "4.0/5.0スケール対応のGPA計算。目標GPA達成シミュレーション付き。",
    url: "https://www.toolbox-jp.net/tools/grade-point-calc",
  },
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
                name: "GPAの計算方法は？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "（成績ポイント×単位数）の合計を総単位数で割って算出します。例えばA（3.0）の3単位とB（2.0）の2単位の場合、GPA＝（9+4）÷5＝2.6となります。",
                },
              },
              {
                "@type": "Question",
                name: "大学院出願に必要なGPAは？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "国内大学院は3.0以上（4.0スケール）、海外大学院は3.5以上が一般的な目安です。ただし大学・専攻によって異なるため、各校の要件を確認してください。",
                },
              },
              {
                "@type": "Question",
                name: "GPAを上げるには？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "単位数の多い必修科目の成績向上が最も効果的です。単位数が大きい科目ほどGPAへの影響が大きいため、重点的に取り組むことをお勧めします。",
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
