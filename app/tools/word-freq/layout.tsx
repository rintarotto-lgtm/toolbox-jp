import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "単語出現頻度カウンター - テキスト分析",
  description: "テキスト内の単語・文字の出現頻度をカウント。頻出ワードのランキング表示。SEO・文章分析に便利。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/word-freq" },
  openGraph: {
    title: "単語出現頻度カウンター - テキスト分析",
    description: "テキスト内の単語・文字の出現頻度をカウント。頻出ワードのランキング表示。SEO・文章分析に便利。",
    url: "https://www.toolbox-jp.net/tools/word-freq",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
