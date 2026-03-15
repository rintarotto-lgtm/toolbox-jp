import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "進数変換（2進数・8進数・16進数） - 無料オンラインツール",
  description:
    "2進数・8進数・10進数・16進数を相互変換するオンラインツール。プログラミングやネットワーク設定に便利。",
  keywords: ["進数変換", "2進数変換", "16進数変換", "基数変換", "n進数変換"],
  openGraph: {
    title: "進数変換 - ToolBox",
    description: "2進数・8進数・10進数・16進数を相互変換。ブラウザ上で完結。",
  },
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/tools/number-converter",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
