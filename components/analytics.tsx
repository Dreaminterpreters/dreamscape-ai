"use client"

import Script from "next/script"
import { useEffect } from "react"

// Analytics Configuration
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

// Google Analytics 4
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}

// Google Tag Manager
export function GoogleTagManager() {
  if (!GTM_ID) return null

  return (
    <>
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  )
}

// Main Analytics Component
export function Analytics() {
  return (
    <>
      <GoogleAnalytics />
      <GoogleTagManager />
    </>
  )
}

// Custom Analytics Events
export const analytics = {
  // Dream interpretation events
  trackDreamInterpretation: (dreamData: {
    language: string
    sourceType: string
    dreamLength: number
    traditions: string[]
  }) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "dream_interpretation", {
        event_category: "engagement",
        event_label: dreamData.language,
        custom_parameter_1: dreamData.sourceType,
        custom_parameter_2: dreamData.language,
        custom_parameter_3: dreamData.traditions.join(","),
        value: dreamData.dreamLength,
      })

      // Enhanced ecommerce for ad targeting
      window.gtag("event", "view_item", {
        currency: "USD",
        value: 0, // Free service
        items: [
          {
            item_id: "dream_interpretation",
            item_name: "Dream Interpretation",
            item_category: "spiritual_services",
            item_category2: dreamData.sourceType,
            item_category3: dreamData.language,
            quantity: 1,
            price: 0,
          },
        ],
      })
    }
  },

  // User engagement events
  trackUserEngagement: (action: string, details?: Record<string, any>) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: "user_engagement",
        ...details,
      })
    }
  },

  // Ad interaction events
  trackAdInteraction: (adPosition: string, adType: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "ad_interaction", {
        event_category: "advertising",
        event_label: adPosition,
        ad_type: adType,
        ad_position: adPosition,
      })
    }
  },

  // Language selection tracking
  trackLanguageSelection: (language: string, previousLanguage?: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "language_change", {
        event_category: "localization",
        event_label: language,
        previous_language: previousLanguage,
        new_language: language,
      })
    }
  },

  // Tradition preference tracking
  trackTraditionPreference: (sourceType: string, traditions: string[]) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "tradition_preference", {
        event_category: "content_preference",
        event_label: sourceType,
        tradition_type: sourceType,
        traditions_selected: traditions.join(","),
      })
    }
  },

  // Content consumption tracking
  trackContentConsumption: (contentType: string, timeSpent: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "content_consumption", {
        event_category: "engagement",
        event_label: contentType,
        value: timeSpent,
        content_type: contentType,
        time_spent: timeSpent,
      })
    }
  },

  // Error tracking
  trackError: (errorType: string, errorMessage: string) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "exception", {
        description: errorMessage,
        fatal: false,
        error_type: errorType,
      })
    }
  },
}

// Enhanced AdSense tracking
export function trackAdSenseEvents() {
  useEffect(() => {
    // Track when ads are loaded
    const handleAdLoad = (event: any) => {
      analytics.trackAdInteraction("loaded", event.slot?.getAdUnitPath() || "unknown")
    }

    // Track ad clicks
    const handleAdClick = (event: any) => {
      analytics.trackAdInteraction("clicked", event.slot?.getAdUnitPath() || "unknown")
    }

    if (typeof window !== "undefined" && window.googletag) {
      window.googletag.cmd.push(() => {
        window.googletag.pubads().addEventListener("slotOnload", handleAdLoad)
        window.googletag.pubads().addEventListener("slotRequested", handleAdClick)
      })
    }

    return () => {
      if (typeof window !== "undefined" && window.googletag) {
        window.googletag.cmd.push(() => {
          window.googletag.pubads().removeEventListener("slotOnload", handleAdLoad)
          window.googletag.pubads().removeEventListener("slotRequested", handleAdClick)
        })
      }
    }
  }, [])
}

// User behavior tracking hook
export function useUserBehaviorTracking() {
  useEffect(() => {
    let startTime = Date.now()
    let isActive = true

    const trackTimeSpent = () => {
      if (isActive) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000)
        analytics.trackContentConsumption("page_view", timeSpent)
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive = false
        trackTimeSpent()
      } else {
        isActive = true
        startTime = Date.now()
      }
    }

    const handleBeforeUnload = () => {
      trackTimeSpent()
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)

    // Track scroll depth
    let maxScroll = 0
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100,
      )
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent
        if (maxScroll % 25 === 0) {
          // Track at 25%, 50%, 75%, 100%
          analytics.trackUserEngagement("scroll_depth", {
            scroll_depth: maxScroll,
          })
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("scroll", handleScroll)
      trackTimeSpent()
    }
  }, [])
}

// Declare global gtag function
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    googletag: any
    dataLayer: any[]
  }
}
