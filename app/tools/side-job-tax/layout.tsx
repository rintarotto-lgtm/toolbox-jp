import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "副業の税金計算機 - 手取りは結局いくら増える？ | ツールボックス",
  description: "副業したら手取りはいくら増える？本業の年収と副業収入を入れるだけで、所得税・住民税・確定申告の必要性を瞬時に計算。2026年最新の税率対応。",
  alternates: {
    canonical: "https://www.toolbox-jp.net/tools/side-job-tax",
  },
  openGraph: {
    title: "副業の税金計算機 - 手取りは結局いくら増える？",
    description: "副業したら手取りはいくら増える？本業年収と副業収入を入れるだけで瞬時計算。",
    url: "https://www.toolbox-jp.net/tools/side-job-tax",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
