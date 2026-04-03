import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "カーリース vs 購入 比較計算 - 総費用を無料シミュレーション | ToolBox Japan",
  description: "カーリース（月額）と車の購入（ローン）の総費用を比較計算。月々の支払い・残価設定・諸費用を含めた5年・10年の総支払額をシミュレーション。",
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
                name: "カーリースと購入どちらが安いですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "一般的に長期（7年以上）で乗る場合は購入の方が総費用は安くなります。短期（3〜5年）でメンテナンス込みならカーリースが便利ですが、走行距離制限などの制約があります。",
                },
              },
              {
                "@type": "Question",
                name: "カーリースの残価設定とは何ですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "残価設定とは、契約期間終了時の車の残存価値を事前に設定し、その分を引いた金額をリース料として支払う仕組みです。月々の支払額を抑えられますが、超過走行や傷・汚れの場合は追加費用が発生します。",
                },
              },
              {
                "@type": "Question",
                name: "カーリースのデメリットは何ですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "走行距離制限（年間1〜1.5万km程度）、改造・カスタマイズ不可、中途解約時の違約金、契約満了時に車が自分のものにならない（残価精算型の場合）などがデメリットです。",
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
