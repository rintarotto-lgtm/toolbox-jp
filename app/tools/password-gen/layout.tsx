import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "パスワード生成 - 安全なランダムパスワード作成",
  description: "安全なランダムパスワードを無料で生成。文字数・大文字・小文字・数字・記号を自由に設定し、強力なパスワードを即座に作成できるオンラインツールです。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/password-gen" },
  openGraph: {
    title: "パスワード生成 - 安全なランダムパスワード作成",
    description: "安全なランダムパスワードを無料で生成。文字数・記号などを自由に設定し、強力なパスワードを即座に作成。",
    url: "https://toolbox-jp.vercel.app/tools/password-gen",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
