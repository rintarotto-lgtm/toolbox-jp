import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "生理周期・排卵日計算 - 次の生理日と安全日を無料予測 | ToolBox Japan",
  description: "最終生理開始日と周期から次の生理予定日・排卵日・安全日を無料計算。3ヶ月先まで生理周期カレンダーを表示。妊娠希望・避妊計画のサポートに。",
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
                name: "排卵日はいつですか？計算方法は？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "一般的に排卵日は次の生理予定日の14日前です。生理周期が28日の場合、生理開始から14日目が排卵日の目安です。ただし個人差があるため、あくまでも目安です。",
                },
              },
              {
                "@type": "Question",
                name: "生理不順の場合、排卵日の計算は正確ですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "周期が不規則な場合は計算による予測精度が下がります。排卵検査薬を使うか、基礎体温を測定して排卵日を特定する方法が信頼性が高いです。",
                },
              },
              {
                "@type": "Question",
                name: "生理前症候群（PMS）とはなんですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "PMSは月経前症候群の略で、生理の3〜10日前から始まるイライラ、腹痛、頭痛、むくみなどの身体的・精神的症状です。黄体ホルモンの変化が原因とされており、約70〜80%の女性が経験します。",
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
