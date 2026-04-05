import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "体内年齢・体力年齢計算 - 生活習慣から若さを無料診断 | ToolBox Japan",
  description: "生活習慣・運動・食事・睡眠のアンケートから体内年齢・体力年齢を無料診断。実年齢との差を確認し、若返りのためのアドバイスも表示。健康意識向上に。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "体内年齢とは何ですか？", acceptedAnswer: { "@type": "Answer", text: "体内年齢とは、生活習慣・運動習慣・食事・睡眠などの状態から推定される身体の機能的な年齢です。実年齢より若い体内年齢は良好な健康状態を示します。" } },
          { "@type": "Question", name: "体力年齢を若くする方法は？", acceptedAnswer: { "@type": "Answer", text: "有酸素運動（週3回以上）、筋力トレーニング、十分な睡眠（7〜8時間）、バランスの取れた食事、禁煙・節酒が体力年齢を若く保つ主な方法です。" } },
          { "@type": "Question", name: "体内年齢と体力年齢の違いは？", acceptedAnswer: { "@type": "Answer", text: "体内年齢は主に内臓・代謝の状態（血管年齢、骨年齢など）を示し、体力年齢は筋力・持久力・柔軟性などの運動機能を示します。両方を合わせて総合的な健康状態を評価します。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
