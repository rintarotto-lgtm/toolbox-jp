import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "禁煙節約額計算 - タバコをやめると年間・生涯でいくら節約できる？ | ToolBox Japan",
  description: "禁煙で節約できる金額を無料計算。1日の本数・タバコ価格から年間・5年・10年・生涯の節約額を計算。禁煙開始日からの累計節約額カウンターも表示。",
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
                name: "1日1箱タバコを吸うと年間いくらかかりますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "1箱600円のタバコを1日1箱吸うと年間約21万9000円かかります。10年で約219万円、生涯（40年間吸い続けた場合）で約876万円になります。",
                },
              },
              {
                "@type": "Question",
                name: "禁煙すると健康保険料は下がりますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "直接的に健康保険料が下がるわけではありませんが、タバコによる病気（肺がん、心疾患など）のリスクが下がることで医療費の節約になります。一部の企業や自治体では禁煙者への保険料割引制度もあります。",
                },
              },
              {
                "@type": "Question",
                name: "禁煙補助薬や禁煙外来は保険適用されますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "一定の条件（1日の本数×喫煙年数が200以上、禁煙の意志があるなど）を満たせば保険適用で禁煙外来を受診できます。自己負担は3割で、12週間の治療で約20,000円前後です。",
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
