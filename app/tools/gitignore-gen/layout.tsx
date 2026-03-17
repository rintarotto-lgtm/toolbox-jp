import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ".gitignore生成ツール - プロジェクトに合わせて自動生成 - ツールボックス",
  description: "プログラミング言語・フレームワークを選ぶだけで.gitignoreファイルを自動生成。30+テンプレート。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/gitignore-gen" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
