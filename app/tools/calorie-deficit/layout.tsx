import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "カロリー赤字・ダイエット計画計算 - 目標体重達成日を無料シミュレーション | ToolBox Japan",
  description: "現在体重・目標体重・消費カロリーからダイエット計画を無料計算。1日のカロリー赤字目標と目標体重達成までの日数・必要な運動量を算出。リバウンドしない計画を作成。",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: "1kgの脂肪を落とすには何カロリー消費する必要がありますか？", acceptedAnswer: { "@type": "Answer", text: "体脂肪1kgのカロリーは約7,200kcalです。1日500kcalの赤字を作ると約14日で1kg減量できる計算になります。ただし個人差があります。" } },
          { "@type": "Question", name: "リバウンドしないためのダイエット速度は？", acceptedAnswer: { "@type": "Answer", text: "月1〜2kg（1日500〜700kcalの赤字）が安全なペースとされています。急激な制限（1日1000kcal以上の赤字）は筋肉量の低下やリバウンドのリスクが高まります。" } },
          { "@type": "Question", name: "基礎代謝より少ない食事をしてもよいですか？", acceptedAnswer: { "@type": "Answer", text: "基礎代謝以下の食事は代謝を著しく下げ、筋肉を分解してリバウンドしやすい体になります。最低でも基礎代謝分のカロリーは摂取することを推奨します。" } },
        ],
      }) }} />
      {children}
    </>
  );
}
