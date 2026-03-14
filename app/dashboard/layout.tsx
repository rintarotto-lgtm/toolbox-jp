import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CEOダッシュボード",
  description: "AI社長のリアルタイム収益ダッシュボード",
  robots: "noindex",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
