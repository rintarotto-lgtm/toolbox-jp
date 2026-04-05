import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "子どもBMI・肥満度計算 - 小学生・中学生の標準体重を無料判定 | ToolBox Japan",
  description: "子ども（3〜18歳）の身長・体重・年齢・性別から肥満度（ローレル指数）と標準体重を無料計算。学校の健康診断の基準に対応。成長曲線との比較も表示。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "子どものBMIの計算方法は大人と違いますか？", acceptedAnswer: { "@type": "Answer", text: "子どもの場合はBMIだけでなく「肥満度（%）」や「ローレル指数」が使われます。肥満度は（実測体重-標準体重）÷標準体重×100(%)で計算し、+20%以上で肥満と判定します。" } },
          { "@type": "Question", name: "子どもの標準体重はどうやって計算しますか？", acceptedAnswer: { "@type": "Answer", text: "文部科学省の「学校保健統計」に基づき、年齢・性別・身長から標準体重を算出します。幼児はカウプ指数（15〜18が標準）、学童期以降は肥満度で評価します。" } },
          { "@type": "Question", name: "子どもが肥満と判定されたらどうすればよいですか？", acceptedAnswer: { "@type": "Answer", text: "成長期は過度なカロリー制限は禁物です。バランスの良い食事、適度な運動（外遊び・スポーツ）、規則正しい生活習慣を心がけましょう。小児科や栄養士への相談をお勧めします。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
