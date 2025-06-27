"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Script from "next/script"
import { analytics } from "./analytics"

// Enhanced AdSense Configuration
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-YOUR-ADSENSE-ID"

export function EnhancedAdSenseScript() {
  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script
        id="adsense-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.googletag = window.googletag || {cmd: []};
            (adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "${ADSENSE_CLIENT_ID}",
              enable_page_level_ads: true,
              overlays: {bottom: true}
            });
          `,
        }}
      />
    </>
  )
}

interface EnhancedAdProps {
  adSlot: string
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal"
  adLayout?: string
  adLayoutKey?: string
  style?: React.CSSProperties
  className?: string
  position: string
  dreamContext?: string
  userLanguage?: string
  traditionType?: string
}

export function EnhancedAdSenseAd({
  adSlot,
  adFormat = "auto",
  adLayout,
  adLayoutKey,
  style = { display: "block" },
  className = "",
  position,
  dreamContext,
  userLanguage = "en",
  traditionType = "mixed",
}: EnhancedAdProps) {
  const [adLoaded, setAdLoaded] = useState(false)
  const [adError, setAdError] = useState(false)

  useEffect(() => {
    try {
      // Enhanced targeting based on user behavior
      const adConfig = {
        google_ad_client: ADSENSE_CLIENT_ID,
        google_ad_slot: adSlot,
        google_ad_format: adFormat,
        google_page_url: window.location.href,
        google_language: userLanguage,
        google_country: "US", // You can detect this dynamically
        google_safe: "high",
        google_content_label_ids: ["spiritual", "wellness", "psychology"],
        google_max_num_ads: "3",
        // Custom targeting
        custom_targeting: {
          dream_category: dreamContext ? extractDreamCategory(dreamContext) : "general",
          user_language: userLanguage,
          tradition_type: traditionType,
          ad_position: position,
        },
      }

      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push(adConfig)

      // Track ad load
      analytics.trackAdInteraction(position, "loaded")
      setAdLoaded(true)
    } catch (err) {
      console.error("AdSense error:", err)
      analytics.trackError("adsense_load_error", err.toString())
      setAdError(true)
    }
  }, [adSlot, position, dreamContext, userLanguage, traditionType])

  const handleAdClick = () => {
    analytics.trackAdInteraction(position, "clicked")
    analytics.trackUserEngagement("ad_click", {
      ad_position: position,
      ad_slot: adSlot,
      dream_context: dreamContext ? extractDreamCategory(dreamContext) : "none",
    })
  }

  if (adError) {
    return null // Hide failed ads gracefully
  }

  return (
    <div className={`adsense-container ${className}`} onClick={handleAdClick}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive="true"
        data-ad-region={position}
        data-page-url={typeof window !== "undefined" ? window.location.href : ""}
        data-language={userLanguage}
        data-country="US"
        data-content-category="spiritual,wellness,psychology"
      />
      {adLoaded && (
        <div className="ad-analytics-pixel" style={{ display: "none" }}>
          {/* Invisible tracking pixel */}
        </div>
      )}
    </div>
  )
}

// Extract dream category for better ad targeting
function extractDreamCategory(dreamText: string): string {
  const categories = {
    relationship: ["wedding", "marriage", "love", "partner", "spouse", "boyfriend", "girlfriend"],
    spiritual: ["god", "angel", "prayer", "church", "temple", "divine", "holy"],
    fear: ["enemy", "monster", "chase", "attack", "danger", "scared", "nightmare"],
    nature: ["water", "ocean", "mountain", "forest", "animal", "tree", "sky"],
    death: ["death", "funeral", "grave", "cemetery", "dying", "dead"],
    flying: ["flying", "float", "soar", "wings", "sky", "clouds"],
    family: ["mother", "father", "child", "baby", "family", "parent", "sibling"],
  }

  const lowerText = dreamText.toLowerCase()
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      return category
    }
  }
  return "general"
}

// Predefined enhanced ad components
export function EnhancedHeaderBannerAd({
  userLanguage,
  traditionType,
}: { userLanguage?: string; traditionType?: string }) {
  return (
    <div className="w-full bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 py-2">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Advertisement</p>
          <EnhancedAdSenseAd
            adSlot="1234567890"
            adFormat="horizontal"
            style={{ display: "block", height: "90px" }}
            className="mx-auto"
            position="header_banner"
            userLanguage={userLanguage}
            traditionType={traditionType}
          />
        </div>
      </div>
    </div>
  )
}

export function EnhancedSidebarAd({
  dreamContext,
  userLanguage,
  traditionType,
}: { dreamContext?: string; userLanguage?: string; traditionType?: string }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <p className="text-xs text-gray-500 mb-2 text-center">Sponsored</p>
      <EnhancedAdSenseAd
        adSlot="2345678901"
        adFormat="vertical"
        style={{ display: "block", width: "300px", height: "250px" }}
        className="mx-auto"
        position="sidebar"
        dreamContext={dreamContext}
        userLanguage={userLanguage}
        traditionType={traditionType}
      />
    </div>
  )
}

export function EnhancedInlineAd({
  dreamContext,
  userLanguage,
  traditionType,
}: { dreamContext?: string; userLanguage?: string; traditionType?: string }) {
  return (
    <div className="my-6 p-4 bg-gradient-to-r from-gray-50 to-purple-50 rounded-lg border">
      <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
      <EnhancedAdSenseAd
        adSlot="3456789012"
        adFormat="rectangle"
        style={{ display: "block", width: "100%", height: "280px" }}
        position="inline"
        dreamContext={dreamContext}
        userLanguage={userLanguage}
        traditionType={traditionType}
      />
    </div>
  )
}

export function EnhancedResponsiveAd({
  adSlot,
  dreamContext,
  userLanguage,
  traditionType,
}: {
  adSlot: string
  dreamContext?: string
  userLanguage?: string
  traditionType?: string
}) {
  return (
    <div className="my-4 p-3 bg-white rounded-lg shadow-sm border">
      <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
      <EnhancedAdSenseAd
        adSlot={adSlot}
        adFormat="auto"
        style={{ display: "block" }}
        className="w-full"
        position="responsive"
        dreamContext={dreamContext}
        userLanguage={userLanguage}
        traditionType={traditionType}
      />
    </div>
  )
}

// Simple minimal ad for HTML version
export function MinimalHTMLAd({ position }: { position: string }) {
  return (
    <div className="minimal-ad-container">
      <div className="text-xs text-gray-500 mb-1 text-center">Sponsored</div>
      <div className="bg-gray-800/20 border border-gray-600/30 rounded p-3 text-center">
        <p className="text-xs text-gray-400">
          {position === "header" && "✨ Discover spiritual wisdom books"}
          {position === "content" && "🔮 Explore dream interpretation courses"}
          {position === "footer" && "🌟 Connect with spiritual communities"}
        </p>
      </div>
    </div>
  )
}
