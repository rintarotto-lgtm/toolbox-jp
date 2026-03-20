import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "robots.txt生成 - GUIで簡単作成",
  description: "robots.txtをGUIで簡単作成。WordPress・Next.js等のプリセット付き。User-Agent・Allow・Disallowルール、Sitemap URLを設定。",
  alternates: { canonical: "https://toolbox-jp.net/tools/robots-gen" },
  openGraph: {
    title: "robots.txt生成 - GUIで簡単作成",
    description: "robots.txtをGUIで簡単作成。WordPress・Next.js等のプリセット付き。User-Agent・Allow・Disallowルール、Sitemap URLを設定。",
    url: "https://toolbox-jp.net/tools/robots-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
