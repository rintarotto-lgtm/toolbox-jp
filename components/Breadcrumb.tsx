"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { tools } from "@/lib/tools";

export default function Breadcrumb() {
  const pathname = usePathname();
  const toolId = pathname.split("/").pop() || "";
  const tool = tools.find((t) => t.id === toolId);

  if (!tool) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "ホーム",
        item: "https://www.toolbox-jp.net",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tool.name,
        item: `https://www.toolbox-jp.net${tool.path}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="パンくずリスト" className="mb-4">
        <ol className="flex items-center gap-1.5 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-blue-600 transition-colors">
              🏠 ホーム
            </Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="text-gray-700 font-medium truncate">{tool.name}</li>
        </ol>
      </nav>
    </>
  );
}
