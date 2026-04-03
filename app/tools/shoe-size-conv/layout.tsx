import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "靴サイズ変換 - 日本・US・UK・EU対応表 無料計算 | ToolBox Japan",
  description: "靴のサイズを日本（cm）・US・UK・EU間で無料変換。メンズ・レディース別対応表付き。海外通販・旅行で困らない靴サイズ早見表とサイズ選びのコツも解説。",
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
                name: "日本の25cmはUSサイズでいくつですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "メンズの場合、日本25cmはUS 7（UK 6、EU 39）に相当します。レディースの場合はUS 8（UK 6、EU 39）です。",
                },
              },
              {
                "@type": "Question",
                name: "海外の靴を買うときにサイズをどう確認すればよいですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "足の長さをcmで計測し、ブランドのサイズガイドで確認するのが確実です。一般的に足の実測値より0.5〜1cm大きいサイズを選ぶと快適です。",
                },
              },
              {
                "@type": "Question",
                name: "ナイキやアディダスのサイズはどの規格ですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "ナイキ・アディダスともにUS規格を基準としています。日本サイズ（cm）表記もありますが、ブランドによってサイズ感が異なるため、試着か実測での確認を推奨します。",
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
