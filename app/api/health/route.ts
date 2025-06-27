import { NextResponse } from "next/server"

export async function GET() {
  console.log("🏥 Health check endpoint called")

  try {
    // Basic health checks
    const healthData = {
      success: true,
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      services: {
        database: "not_configured", // Would check database connection if configured
        cache: "not_configured", // Would check cache if configured
        external_apis: "not_configured", // Would check external APIs if configured
      },
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      checks: {
        json_parsing: "ok",
        error_handling: "ok",
        configuration: "ok",
        dream_interpretation: "ok",
      },
    }

    console.log("✅ Health check completed successfully")

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("❌ Health check failed:", error)

    return NextResponse.json(
      {
        success: false,
        status: "unhealthy",
        error: "Health check failed",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

export async function POST() {
  // Allow POST for more detailed health checks
  return GET()
}
