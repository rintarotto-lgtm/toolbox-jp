import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chmod計算機 - Linuxパーミッション変換 - ツールボックス",
  description: "Linuxのファイルパーミッション（chmod）を数値⇔シンボル形式で相互変換。チェックボックスで直感的に権限設定。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/chmod-calc" },
  openGraph: {
    title: "Chmod計算機 - Linuxパーミッション変換 - ツールボックス",
    description: "Linuxのファイルパーミッション（chmod）を数値⇔シンボル形式で相互変換。チェックボックスで直感的に権限設定。",
    url: "https://toolbox-jp.vercel.app/tools/chmod-calc",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
