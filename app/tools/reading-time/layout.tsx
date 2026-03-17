import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "読了時間計算 - テキストの読書時間を自動計算",
  description: "テキストの読了時間・文字数・原稿用紙枚数を自動計算。日本語テキストの読書時間やスピーチ時間の目安に。",
  alternates: { canonical: "https://toolbox-jp.vercel.app/tools/reading-time" },
  openGraph: {
    title: "読了時間計算 - テキストの読書時間を自動計算",
    description: "テキストの読了時間・文字数・原稿用紙枚数を自動計算。日本語テキストの読書時間やスピーチ時間の目安に。",
    url: "https://toolbox-jp.vercel.app/tools/reading-time",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
