interface StructuredDataProps {
  type?: "website" | "service" | "article"
  title?: string
  description?: string
  url?: string
  image?: string
  organizationName?: string
}

export function StructuredData({
  type = "website",
  title = "DreamScape AI - Free Dream Interpretation",
  description = "AI-powered dream interpretation from 50+ spiritual traditions worldwide",
  url = "https://dreamscape-ai.vercel.app",
  image = "https://dreamscape-ai.vercel.app/images/dreamscape-watermark.png",
  organizationName = "DreamScape AI",
}: StructuredDataProps) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: title,
    description: description,
    url: url,
    image: image,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: organizationName,
      url: url,
      logo: {
        "@type": "ImageObject",
        url: image,
      },
    },
  }

  const serviceStructuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Dream Interpretation Service",
    description: "Free AI-powered dream interpretation using 50+ spiritual and psychological traditions",
    provider: {
      "@type": "Organization",
      name: organizationName,
      url: url,
    },
    serviceType: "Dream Analysis",
    audience: {
      "@type": "Audience",
      name: "Adults seeking spiritual guidance",
    },
    availableLanguage: ["English", "Spanish", "Arabic", "Tigrinya", "Amharic", "French", "Swahili"],
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free dream interpretation service",
    },
  }

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is dream interpretation free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, DreamScape AI provides completely free dream interpretation using AI and 50+ spiritual traditions.",
        },
      },
      {
        "@type": "Question",
        name: "What languages are supported?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We support English, Spanish, Arabic, Tigrinya, Amharic, French, and Swahili for dream interpretation.",
        },
      },
      {
        "@type": "Question",
        name: "How accurate are the interpretations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our AI analyzes dreams using authentic sources from 50+ spiritual and psychological traditions, providing comprehensive interpretations based on traditional wisdom.",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(baseStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
    </>
  )
}

export function ArticleStructuredData({
  title,
  description,
  author,
  datePublished,
  dateModified,
  url,
  image,
}: {
  title: string
  description: string
  author?: string
  datePublished: string
  dateModified?: string
  url: string
  image?: string
}) {
  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    author: {
      "@type": "Person",
      name: author || "DreamScape AI",
    },
    publisher: {
      "@type": "Organization",
      name: "DreamScape AI",
      logo: {
        "@type": "ImageObject",
        url: "https://dreamscape-ai.vercel.app/images/dreamscape-watermark.png",
      },
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    url: url,
    image: image || "https://dreamscape-ai.vercel.app/images/dreamscape-watermark.png",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(articleData),
      }}
    />
  )
}
