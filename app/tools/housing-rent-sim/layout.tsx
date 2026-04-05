import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "家賃シミュレーター・適正家賃計算 - 年収・手取りから上限を無料算出 | ToolBox Japan",
  description: "年収・手取りから無理のない家賃の上限を無料計算。1/3ルール・1/4ルールでの目安家賃、引越し初期費用、家賃交渉のコツも解説。一人暮らし・カップル・家族対応。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "適正な家賃の目安はいくらですか？", acceptedAnswer: { "@type": "Answer", text: "手取り月収の1/3以下が一般的な目安です。例えば手取り20万円なら家賃は6〜7万円以下が目安です。食費・光熱費・貯蓄も考えると1/4（手取りの25%）以下が理想的です。" } },
          { "@type": "Question", name: "賃貸の初期費用はいくらかかりますか？", acceptedAnswer: { "@type": "Answer", text: "家賃の4〜6ヶ月分が目安です。敷金（1〜2ヶ月）、礼金（0〜2ヶ月）、仲介手数料（1ヶ月）、前家賃・保証料などが含まれます。家賃8万円なら32〜48万円程度が初期費用です。" } },
          { "@type": "Question", name: "家賃交渉はできますか？", acceptedAnswer: { "@type": "Answer", text: "可能です。特に空室期間が長い物件や入居希望時期が繁忙期以外の場合は交渉しやすいです。5〜10%の値引きが成功するケースも多く、礼金をゼロにしてもらうなどの交渉も有効です。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
