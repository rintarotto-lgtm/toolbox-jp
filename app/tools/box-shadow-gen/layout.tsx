import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSSボックスシャドウ生成 - box-shadowジェネレーター",
  description: "CSSのbox-shadowをスライダーで直感的に作成。水平・垂直オフセット、ぼかし、広がり、色を調整。プレビュー付き。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/box-shadow-gen" },
  openGraph: {
    title: "CSSボックスシャドウ生成 - box-shadowジェネレーター",
    description: "CSSのbox-shadowをスライダーで直感的に作成。水平・垂直オフセット、ぼかし、広がり、色を調整。",
    url: "https://toolbox-jp.vercel.app/tools/box-shadow-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
