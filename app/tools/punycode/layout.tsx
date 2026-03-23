import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Punycode変換 - 日本語ドメイン変換ツール",
  description: "日本語ドメインとPunycode（xn--形式）を相互変換。国際化ドメイン名（IDN）の確認に便利。",
  alternates: { canonical: "https://www.toolbox-jp.net/tools/punycode" },
  openGraph: {
    title: "Punycode変換 - 日本語ドメイン変換ツール",
    description: "日本語ドメインとPunycode（xn--形式）を相互変換。国際化ドメイン名（IDN）の確認に便利。",
    url: "https://www.toolbox-jp.net/tools/punycode",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
