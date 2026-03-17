import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IPアドレス情報ツール | CIDR計算・サブネット計算 - ツールボックス",
  description:
    "IPv4/IPv6のクラス判定、CIDR計算、サブネット情報、バイナリ表現を表示。ネットワークエンジニア必須ツール。",
  openGraph: {
    title: "IPアドレス情報ツール | CIDR計算・サブネット計算 - ツールボックス",
    description:
      "IPアドレスのクラス判定・CIDR計算・サブネット情報を即座に表示。",
    url: "https://toolbox-jp.vercel.app/tools/ip-info",
  },
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/ip-info" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
