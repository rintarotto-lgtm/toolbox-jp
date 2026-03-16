import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "料金プラン - ToolBox",
  description:
    "ToolBoxの料金プラン。無料プラン、Proプラン（¥980/月）、Teamプラン（¥2,980/月）で全機能を活用。",
  openGraph: {
    title: "料金プラン - ToolBox",
    description: "ToolBoxの料金プラン。Proプランで広告なし・無制限利用。",
  },
  alternates: {
    canonical: "https://toolbox-jp.vercel.app/pricing",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
