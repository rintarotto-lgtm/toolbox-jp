import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "住宅ローン繰上返済シミュレーター - 期間短縮・返済軽減の効果を無料計算 | ToolBox Japan",
  description: "住宅ローンの繰上返済による利息節約額・返済期間短縮効果を無料シミュレーション。期間短縮型・返済額軽減型を比較。毎月の繰上返済額から最適な選択肢を計算。",
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
                name: "繰上返済の期間短縮型と返済額軽減型どちらが得ですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "一般的に期間短縮型の方が利息節約効果が大きいです。ただし、月々の負担を減らしたい場合は返済額軽減型が向いています。家計の状況に応じて選びましょう。",
                },
              },
              {
                "@type": "Question",
                name: "住宅ローンの繰上返済はいつするのが効果的ですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "早いほど効果が大きいです。ローン残高が多く、残期間が長い返済初期の繰上返済が最も利息節約効果が高くなります。",
                },
              },
              {
                "@type": "Question",
                name: "繰上返済の手数料はかかりますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "ネット銀行は無料が多く、メガバンクなどは1〜3万円程度かかる場合があります。変動金利型は固定より手数料が低い傾向があります。事前に金融機関に確認しましょう。",
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
