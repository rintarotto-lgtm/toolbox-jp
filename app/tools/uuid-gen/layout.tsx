import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UUID/GUID生成ツール | v4ランダムUUID一括生成 - ツールボックス",
  description:
    "UUID（GUID）をワンクリックで生成。v4ランダムUUIDを1〜100個まで一括生成。コピーボタンで即利用。",
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/tools/uuid-gen",
  },
  openGraph: {
    title: "UUID/GUID生成ツール | v4ランダムUUID一括生成 - ツールボックス",
    description: "UUID（GUID）をワンクリックで生成。v4ランダムUUIDを1〜100個まで一括生成。コピーボタンで即利用。",
    url: "https://toolbox-jp.vercel.app/tools/uuid-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
