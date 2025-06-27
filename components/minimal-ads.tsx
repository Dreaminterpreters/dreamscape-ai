"use client"

interface MinimalAdsProps {
  position: "header" | "content" | "footer"
}

export default function MinimalAds({ position }: MinimalAdsProps) {
  const adContent = {
    header: {
      text: "Discover more about spiritual wisdom",
      size: "h-16",
    },
    content: {
      text: "Explore dream interpretation books and courses",
      size: "h-24",
    },
    footer: {
      text: "Connect with spiritual communities worldwide",
      size: "h-20",
    },
  }

  const ad = adContent[position]

  return (
    <div
      className={`w-full ${ad.size} bg-gray-800/30 border border-gray-700 rounded-lg mb-6 flex items-center justify-center`}
    >
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-1">Sponsored</p>
        <p className="text-sm text-gray-400">{ad.text}</p>
      </div>
    </div>
  )
}
