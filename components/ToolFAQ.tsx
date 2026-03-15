"use client";

import Script from "next/script";

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FAQItem[];
}

export default function ToolFAQ({ faqs }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="mt-8">
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="text-lg font-bold text-gray-800 mb-4">❓ よくある質問</h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-800 hover:bg-gray-50">
              {faq.question}
            </summary>
            <div className="px-4 py-3 text-sm text-gray-600 border-t border-gray-100">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
