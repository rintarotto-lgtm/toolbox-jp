import type { Metadata } from "next";

export const metadata: Metadata = {
  title: ".gitignore生成ツール - プロジェクトに合わせて自動生成",
  description: "プログラミング言語・フレームワークを選ぶだけで.gitignoreファイルを自動生成。30+テンプレート。",
  alternates: { canonical: "https://toolbox-jp.net/tools/gitignore-gen" },
  openGraph: {
    title: ".gitignore生成ツール - プロジェクトに合わせて自動生成",
    description: "プログラミング言語・フレームワークを選ぶだけで.gitignoreファイルを自動生成。30+テンプレート。",
    url: "https://toolbox-jp.net/tools/gitignore-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
