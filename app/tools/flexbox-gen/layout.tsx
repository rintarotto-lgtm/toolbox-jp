import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Flexbox生成 - ビジュアルFlexboxジェネレーター",
  description: "Flexboxレイアウトを視覚的に作成できるジェネレーター。direction、justify-content、align-items、gap、wrapを直感的に操作。生成されたCSSをコピーしてすぐ使えます。",
  alternates: { canonical: "https://toolbox-jp.net/tools/flexbox-gen" },
  openGraph: {
    title: "CSS Flexbox生成 - ビジュアルFlexboxジェネレーター",
    description: "Flexboxレイアウトを視覚的に作成。CSSコードを即座に生成・コピー。",
    url: "https://toolbox-jp.net/tools/flexbox-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
