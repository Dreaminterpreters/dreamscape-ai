"use client"

import type React from "react"

import { useEffect } from "react"
import Script from "next/script"

// AdSense Configuration
const ADSENSE_CLIENT_ID = "ca-pub-YOUR-ADSENSE-ID" // Replace with your actual AdSense ID

export function AdSenseScript() {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}

interface AdSenseAdProps {
  adSlot: string
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal"
  adLayout?: string
  adLayoutKey?: string
  style?: React.CSSProperties
  className?: string
}

export function AdSenseAd({
  adSlot,
  adFormat = "auto",
  adLayout,
  adLayoutKey,
  style = { display: "block" },
  className = "",
}: AdSenseAdProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-layout={adLayout}
        data-ad-layout-key={adLayoutKey}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// Predefined ad components for different positions
export function HeaderBannerAd() {
  return (
    <div className="w-full bg-gray-50 border-b border-gray-200 py-2">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">Advertisement</p>
          <AdSenseAd
            adSlot="1234567890"
            adFormat="horizontal"
            style={{ display: "block", height: "90px" }}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  )
}

export function SidebarAd() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-4">
      <p className="text-xs text-gray-500 mb-2 text-center">Sponsored</p>
      <AdSenseAd
        adSlot="2345678901"
        adFormat="vertical"
        style={{ display: "block", width: "300px", height: "250px" }}
        className="mx-auto"
      />
    </div>
  )
}

export function InlineAd() {
  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border">
      <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
      <AdSenseAd
        adSlot="3456789012"
        adFormat="rectangle"
        style={{ display: "block", width: "100%", height: "280px" }}
      />
    </div>
  )
}

export function FooterAd() {
  return (
    <div className="mt-8 p-4 bg-white rounded-lg shadow-sm border">
      <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
      <AdSenseAd adSlot="4567890123" adFormat="horizontal" style={{ display: "block", height: "90px" }} />
    </div>
  )
}

// Responsive ad that adapts to screen size
export function ResponsiveAd({ adSlot }: { adSlot: string }) {
  return (
    <div className="my-4">
      <p className="text-xs text-gray-500 mb-2 text-center">Advertisement</p>
      <AdSenseAd adSlot={adSlot} adFormat="auto" style={{ display: "block" }} className="w-full" />
    </div>
  )
}
