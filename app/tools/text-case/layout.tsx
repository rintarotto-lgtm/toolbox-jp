import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "テキスト変換（大文字・小文字・キャメルケース） - ツールボックス",
  description: "テキストを大文字・小文字・キャメルケース・スネークケース・ケバブケースなどに一括変換。プログラミングの命名規則に便利。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/text-case" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
