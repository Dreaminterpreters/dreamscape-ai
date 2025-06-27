import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test all internal API endpoints
    const testResults = []

    // Test 1: Config API
    try {
      const configResponse = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/config`)
      const configData = await configResponse.json()
      testResults.push({
        endpoint: "/api/config",
        status: configResponse.ok ? "success" : "error",
        hasValidJson: typeof configData === "object" && configData !== null,
        hasSuccessField: "success" in configData,
        traditionCount: configData.config?.specificSources?.length || 0,
      })
    } catch (error) {
      testResults.push({
        endpoint: "/api/config",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    // Test 2: Health Check
    try {
      const healthResponse = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/health`)
      const healthData = await healthResponse.json()
      testResults.push({
        endpoint: "/api/health",
        status: healthResponse.ok ? "success" : "error",
        hasValidJson: typeof healthData === "object" && healthData !== null,
        hasSuccessField: "success" in healthData,
      })
    } catch (error) {
      testResults.push({
        endpoint: "/api/health",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    return NextResponse.json(
      {
        success: true,
        message: "API test completed",
        results: testResults,
        timestamp: new Date().toISOString(),
        totalTests: testResults.length,
        passedTests: testResults.filter((r) => r.status === "success").length,
        failedTests: testResults.filter((r) => r.status === "error").length,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("Test API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Test execution failed",
        details: error instanceof Error ? error.message : "Unknown error",
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
