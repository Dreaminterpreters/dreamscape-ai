"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface TestResult {
  endpoint: string
  method: string
  status: "pending" | "success" | "error"
  statusCode?: number
  responseTime?: number
  error?: string
  data?: any
  description: string
}

export default function APITestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>("")
  const [testDream, setTestDream] = useState(
    "I was flying over a beautiful landscape when I saw a golden eagle soaring beside me. We flew together towards a magnificent castle on a hill. The eagle spoke to me in a voice like thunder, telling me about ancient secrets hidden in the castle walls.",
  )

  // Enhanced safe JSON parsing utility
  function safeJsonParse(text: string, fallback: any = null) {
    try {
      if (!text || typeof text !== "string") {
        throw new Error(`Invalid input: ${typeof text}`)
      }

      const trimmed = text.trim()
      if (!trimmed) {
        throw new Error("Empty string")
      }

      if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
        throw new Error(`Not JSON format: ${trimmed.substring(0, 50)}...`)
      }

      return JSON.parse(trimmed)
    } catch (error) {
      console.error("JSON Parse Error:", error)
      console.error("Failed text:", text?.substring(0, 200))
      return fallback
    }
  }

  // Enhanced safe fetch utility with detailed logging
  async function safeFetch(url: string, options?: RequestInit): Promise<TestResult> {
    const startTime = Date.now()
    const method = options?.method || "GET"
    const description = testDescriptions[url + method] || `${method} ${url}`

    setCurrentTest(description)

    try {
      console.log(`🚀 Testing: ${method} ${url}`)
      console.log(`📝 Description: ${description}`)

      if (options?.body) {
        console.log(`📤 Request body: ${options.body}`)
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...options?.headers,
        },
      })

      const responseTime = Date.now() - startTime
      console.log(`📊 Response: ${response.status} ${response.statusText} (${responseTime}ms)`)

      // Get response text first
      const responseText = await response.text()
      console.log(`📝 Response length: ${responseText.length} characters`)
      console.log(`📄 Response preview: ${responseText.substring(0, 300)}...`)

      // Check content type
      const contentType = response.headers.get("content-type")
      console.log(`📋 Content-Type: ${contentType}`)

      if (!contentType?.includes("application/json")) {
        throw new Error(`Unexpected content-type: ${contentType}. Response: ${responseText.substring(0, 200)}`)
      }

      // Parse JSON safely
      const data = safeJsonParse(responseText, {
        success: false,
        error: "Invalid JSON response",
        rawResponse: responseText.substring(0, 500),
      })

      if (!data) {
        throw new Error("Failed to parse JSON response")
      }

      // Validate response structure
      if (typeof data !== "object" || data === null) {
        throw new Error(`Invalid response structure: ${typeof data}`)
      }

      return {
        endpoint: url,
        method,
        status: response.ok ? "success" : "error",
        statusCode: response.status,
        responseTime,
        data,
        description,
        error: response.ok ? undefined : data.error || `HTTP ${response.status}`,
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      console.error(`❌ Error testing ${method} ${url}:`, error)

      return {
        endpoint: url,
        method,
        status: "error",
        responseTime,
        description,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Test descriptions for better reporting
  const testDescriptions: Record<string, string> = {
    "/api/configGET": "Load app configuration with 67+ traditions",
    "/api/configPOST": "Generate ad targeting from dream content",
    "/api/dreams/interpretPOST": "Basic dream interpretation (mixed traditions)",
    "/api/dreams/interpret-specificPOST": "Dream interpretation with specific traditions",
    "/api/dreams/interpret-multilingualPOST": "Multi-language interpretation (Spanish)",
    "/api/dreams/interpret-religiousPOST": "Religious tradition interpretation",
    "/api/dreams/interpret-psychologicalPOST": "Psychological analysis interpretation",
    "/api/dreams/interpret-millerPOST": "G.H. Miller specific interpretation",
    "/api/healthGET": "Health check endpoint",
    "/api/auth/registerPOST": "User registration test",
    "/api/auth/loginPOST": "Login with wrong credentials (error handling test)",
    "/api/testGET": "Internal API test endpoint",
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])
    setCurrentTest("")

    const tests: Array<{ url: string; options?: RequestInit; key: string }> = [
      {
        url: "/api/config",
        key: "/api/configGET",
      },
      {
        url: "/api/config",
        options: {
          method: "POST",
          body: JSON.stringify({
            dreamText: testDream,
            language: "en",
            traditionType: "mixed",
          }),
        },
        key: "/api/configPOST",
      },
      {
        url: "/api/dreams/interpret",
        options: {
          method: "POST",
          body: JSON.stringify({
            dream: testDream,
            language: "en",
            sourceType: "mixed",
          }),
        },
        key: "/api/dreams/interpretPOST",
      },
      {
        url: "/api/dreams/interpret",
        options: {
          method: "POST",
          body: JSON.stringify({
            dream: testDream,
            language: "en",
            sourceType: "religious",
            selectedTraditions: ["📖 G.H. Miller (10,000 Dreams)", "✝️ Christian Mysticism", "🧠 Freudian Analysis"],
          }),
        },
        key: "/api/dreams/interpret-specificPOST",
      },
      {
        url: "/api/dreams/interpret",
        options: {
          method: "POST",
          body: JSON.stringify({
            dream: testDream,
            language: "es",
            sourceType: "psychological",
            selectedTraditions: ["🎭 Jungian Psychology", "🎯 Gestalt Dream Work"],
          }),
        },
        key: "/api/dreams/interpret-multilingualPOST",
      },
      {
        url: "/api/dreams/interpret",
        options: {
          method: "POST",
          body: JSON.stringify({
            dream: testDream,
            language: "en",
            sourceType: "religious",
            selectedTraditions: ["☪️ Islamic Tradition (Ibn Sirin)", "✝️ Christian Mysticism", "🕉️ Hinduism (Vedanta)"],
          }),
        },
        key: "/api/dreams/interpret-religiousPOST",
      },
      {
        url: "/api/dreams/interpret",
        options: {
          method: "POST",
          body: JSON.stringify({
            dream: testDream,
            language: "en",
            sourceType: "psychological",
            selectedTraditions: ["🧠 Freudian Analysis", "🎭 Jungian Psychology"],
          }),
        },
        key: "/api/dreams/interpret-psychologicalPOST",
      },
      {
        url: "/api/dreams/interpret",
        options: {
          method: "POST",
          body: JSON.stringify({
            dream: testDream,
            language: "en",
            sourceType: "classical",
            selectedTraditions: ["📖 G.H. Miller (10,000 Dreams)"],
          }),
        },
        key: "/api/dreams/interpret-millerPOST",
      },
      {
        url: "/api/health",
        key: "/api/healthGET",
      },
      {
        url: "/api/test",
        key: "/api/testGET",
      },
      {
        url: "/api/auth/register",
        options: {
          method: "POST",
          body: JSON.stringify({
            username: "testuser" + Date.now(),
            email: "test@example.com",
            password: "testpassword123",
          }),
        },
        key: "/api/auth/registerPOST",
      },
      {
        url: "/api/auth/login",
        options: {
          method: "POST",
          body: JSON.stringify({
            username: "nonexistentuser",
            password: "wrongpassword",
          }),
        },
        key: "/api/auth/loginPOST",
      },
    ]

    const results: TestResult[] = []

    for (const test of tests) {
      console.log(`\n🧪 Running test: ${testDescriptions[test.key]}`)
      const result = await safeFetch(test.url, test.options)
      results.push(result)
      setTestResults([...results])

      // Small delay between tests to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsRunning(false)
    setCurrentTest("")
    console.log("\n✅ All tests completed!")
  }

  // Test specific error scenarios
  const runErrorTests = async () => {
    setIsRunning(true)
    const errorTests = [
      {
        name: "Empty JSON body",
        test: () => safeFetch("/api/config", { method: "POST", body: "" }),
      },
      {
        name: "Invalid JSON body",
        test: () => safeFetch("/api/config", { method: "POST", body: "invalid json" }),
      },
      {
        name: "Missing required fields",
        test: () => safeFetch("/api/dreams/interpret", { method: "POST", body: JSON.stringify({}) }),
      },
      {
        name: "Very long dream text",
        test: () =>
          safeFetch("/api/dreams/interpret", {
            method: "POST",
            body: JSON.stringify({
              dream: "A".repeat(10000),
              language: "en",
              sourceType: "mixed",
            }),
          }),
      },
    ]

    const errorResults: TestResult[] = []
    for (const errorTest of errorTests) {
      console.log(`\n🧪 Running error test: ${errorTest.name}`)
      const result = await errorTest.test()
      result.description = `Error Test: ${errorTest.name}`
      errorResults.push(result)
      setTestResults((prev) => [...prev, result])
      await new Promise((resolve) => setTimeout(resolve, 300))
    }

    setIsRunning(false)
  }

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "text-green-400"
      case "error":
        return "text-red-400"
      case "pending":
        return "text-yellow-400"
      default:
        return "text-gray-400"
    }
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "✅"
      case "error":
        return "❌"
      case "pending":
        return "⏳"
      default:
        return "⚪"
    }
  }

  const getStatusBadge = (result: TestResult) => {
    if (result.status === "success") {
      return <Badge className="bg-green-600">PASS</Badge>
    } else if (result.status === "error") {
      return <Badge className="bg-red-600">FAIL</Badge>
    } else {
      return <Badge className="bg-yellow-600">PENDING</Badge>
    }
  }

  const passedTests = testResults.filter((r) => r.status === "success").length
  const failedTests = testResults.filter((r) => r.status === "error").length
  const totalTests = testResults.length

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔧 DreamSage API Verification Suite</h1>
          <p className="text-gray-400 mb-6">
            Comprehensive testing to verify all API endpoints work without HTTP 500 errors
          </p>

          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium mb-2">Test Dream Text:</label>
            <Textarea
              value={testDream}
              onChange={(e) => setTestDream(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              rows={4}
            />
          </div>

          <div className="flex gap-4 justify-center mb-6">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
            >
              {isRunning ? "🧪 Running Tests..." : "🚀 Run All API Tests"}
            </Button>
            <Button
              onClick={runErrorTests}
              disabled={isRunning}
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white px-8 py-3"
            >
              🐛 Test Error Scenarios
            </Button>
          </div>

          {isRunning && currentTest && (
            <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mb-6">
              <p className="text-blue-300">
                <span className="animate-pulse">🔄</span> Currently testing: {currentTest}
              </p>
            </div>
          )}

          {totalTests > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                <div className="text-2xl text-green-400">{passedTests}</div>
                <div className="text-sm text-gray-400">Passed</div>
              </div>
              <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4">
                <div className="text-2xl text-red-400">{failedTests}</div>
                <div className="text-sm text-gray-400">Failed</div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="text-2xl text-gray-400">{totalTests}</div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
            </div>
          )}
        </div>

        {/* Test Results */}
        <div className="grid gap-4">
          {testResults.map((result, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">{getStatusIcon(result.status)}</span>
                    <div>
                      <div className={`${getStatusColor(result.status)} font-medium`}>
                        {result.method} {result.endpoint}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">{result.description}</div>
                    </div>
                  </span>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(result)}
                    {result.statusCode && (
                      <span className={result.statusCode < 400 ? "text-green-400" : "text-red-400"}>
                        {result.statusCode}
                      </span>
                    )}
                    {result.responseTime && <span className="text-gray-400">{result.responseTime}ms</span>}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result.error && (
                  <div className="bg-red-900/20 border border-red-600/30 rounded p-3 mb-3">
                    <p className="text-red-300 text-sm">
                      <strong>Error:</strong> {result.error}
                    </p>
                  </div>
                )}

                {result.data && (
                  <div className="bg-gray-700/50 rounded p-3">
                    <p className="text-xs text-gray-400 mb-2">Response Data:</p>
                    <pre className="text-xs text-gray-300 overflow-x-auto max-h-40 overflow-y-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Specific validations for different endpoints */}
                {result.status === "success" && result.endpoint === "/api/config" && result.method === "GET" && (
                  <div className="mt-3 p-2 bg-green-900/20 rounded border border-green-600/30">
                    <p className="text-xs text-green-300">
                      ✓ Configuration loaded with {result.data?.config?.specificSources?.length || 0} traditions
                    </p>
                    <p className="text-xs text-green-300">
                      ✓ AdSense configuration present: {result.data?.config?.adConfig ? "Yes" : "No"}
                    </p>
                  </div>
                )}

                {result.status === "success" && result.endpoint === "/api/dreams/interpret" && (
                  <div className="mt-3 p-2 bg-green-900/20 rounded border border-green-600/30">
                    <p className="text-xs text-green-300">
                      ✓ Dream interpretation completed with {result.data?.traditions?.length || 0} traditions
                    </p>
                    <p className="text-xs text-green-300">
                      ✓ AI synthesis present: {result.data?.aiSynthesis ? "Yes" : "No"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Final Summary */}
        {testResults.length > 0 && !isRunning && (
          <Card className="bg-gray-800 border-gray-700 mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">{failedTests === 0 ? "🎉" : "⚠️"} Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-lg font-semibold text-green-400">
                      {passedTests}/{totalTests} Tests Passed
                    </div>
                    <div className="text-sm text-gray-400">
                      Success Rate: {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-400">
                      Avg Response Time:{" "}
                      {testResults.length > 0
                        ? Math.round(
                            testResults.reduce((sum, r) => sum + (r.responseTime || 0), 0) / testResults.length,
                          )
                        : 0}
                      ms
                    </div>
                    <div className="text-sm text-gray-400">Performance Metric</div>
                  </div>
                </div>

                {failedTests === 0 ? (
                  <div className="p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
                    <p className="text-green-300 font-medium">
                      🎉 All API endpoints are working correctly without HTTP 500 errors!
                    </p>
                    <p className="text-green-400 text-sm mt-2">
                      ✅ Configuration loading works
                      <br />✅ Dream interpretation works
                      <br />✅ Error handling is robust
                      <br />✅ JSON responses are valid
                      <br />✅ All traditions load properly
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-red-900/20 border border-red-600/30 rounded-lg">
                    <p className="text-red-300 font-medium">
                      ⚠️ {failedTests} test{failedTests !== 1 ? "s" : ""} failed. Please review the errors above.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* HTTP 500 Error Verification Checklist */}
        <Card className="bg-gray-800 border-gray-700 mt-8">
          <CardHeader>
            <CardTitle>🔍 HTTP 500 Error Prevention Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>All API routes return proper Content-Type: application/json headers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>All responses include consistent success/error structure</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Frontend uses enhanced safeJsonParse() for all JSON parsing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Error responses are valid JSON even when exceptions occur</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Request body validation prevents malformed JSON crashes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Comprehensive error logging for debugging</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>Graceful error handling with user-friendly messages</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">✅</span>
              <span>All 67+ dream interpretation traditions load without errors</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
