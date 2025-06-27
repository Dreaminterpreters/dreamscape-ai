import { type NextRequest, NextResponse } from "next/server"
import { performanceMonitor } from "@/lib/performance-monitor"
import { dreamCache, userCache, analyticsCache } from "@/lib/cache"
import { dreamApiLimiter, generalApiLimiter, analyticsLimiter } from "@/lib/rate-limiter"

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const metric = url.searchParams.get("metric")
    const limit = Number.parseInt(url.searchParams.get("limit") || "100")

    const stats = {
      timestamp: new Date().toISOString(),
      performance: {
        metrics: performanceMonitor.getMetrics(metric || undefined, limit),
        averages: performanceMonitor.getAverages(),
      },
      cache: {
        dream: dreamCache.getStats(),
        user: userCache.getStats(),
        analytics: analyticsCache.getStats(),
      },
      rateLimiting: {
        dreamApi: dreamApiLimiter.getStats(),
        generalApi: generalApiLimiter.getStats(),
        analytics: analyticsLimiter.getStats(),
      },
      system: {
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
      },
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Performance monitoring error:", error)
    return NextResponse.json({ error: "Failed to get performance stats" }, { status: 500 })
  }
}

// Health check endpoint
export async function POST(request: NextRequest) {
  try {
    const { metric, value, metadata } = await request.json()

    if (!metric || typeof value !== "number") {
      return NextResponse.json({ error: "Missing required fields: metric, value" }, { status: 400 })
    }

    performanceMonitor.track(metric, value, metadata)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Performance tracking error:", error)
    return NextResponse.json({ error: "Failed to track performance" }, { status: 500 })
  }
}
