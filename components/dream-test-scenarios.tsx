"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TestTube, Play, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface TestScenario {
  id: string
  dream: string
  expectedSymbols: string[]
  description: string
  minInterpretations: number
}

export default function DreamTestScenarios() {
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [useV2Api, setUseV2Api] = useState(true)

  const testScenarios: TestScenario[] = [
    {
      id: "dragon_tiger_flying",
      dream: "I was a dragon and somehow at the same time I was a tiger and I flew to a far away land",
      expectedSymbols: ["dragon", "tiger", "flying"],
      description: "Multi-transformation with flight",
      minInterpretations: 3,
    },
    {
      id: "wedding_disruption",
      dream:
        "I was with friends passing a wedding when I saw a personal enemy among guests. The groom appeared with his head newly shaved, looking unhappy as he walked away.",
      expectedSymbols: ["wedding"],
      description: "Complex social scenario with wedding",
      minInterpretations: 2,
    },
    {
      id: "water_snake_death",
      dream:
        "I was swimming in a dark river when a large snake appeared. I felt like I was dying but then I was reborn from the water.",
      expectedSymbols: ["water", "snake", "death"],
      description: "Spiritual transformation themes",
      minInterpretations: 3,
    },
    {
      id: "mountain_dog_journey",
      dream: "I was climbing a steep mountain with my faithful dog companion when we discovered a hidden temple.",
      expectedSymbols: ["mountain", "dog"],
      description: "Spiritual journey with companion",
      minInterpretations: 2,
    },
    {
      id: "generic_test",
      dream: "I had a strange dream about some stuff happening.",
      expectedSymbols: [],
      description: "Vague description - should handle gracefully",
      minInterpretations: 0,
    },
    {
      id: "short_test",
      dream: "Dragon",
      expectedSymbols: [],
      description: "Too short - should return error",
      minInterpretations: 0,
    },
  ]

  const runSingleTest = async (scenario: TestScenario) => {
    try {
      const apiEndpoint = useV2Api ? "/api/dreams/interpret-v2" : "/api/dreams/interpret"

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dream: scenario.dream }),
      })

      const result = await response.json()

      // Analyze results
      const symbolsFound = result.symbols || []
      const interpretations = result.interpretations || []

      const expectedFound = scenario.expectedSymbols.filter((expected) => symbolsFound.includes(expected)).length

      const symbolAccuracy =
        scenario.expectedSymbols.length > 0
          ? (expectedFound / scenario.expectedSymbols.length) * 100
          : symbolsFound.length === 0
            ? 100
            : 0

      return {
        scenario: scenario.id,
        success: response.ok,
        symbols: symbolsFound,
        interpretations,
        detectedSymbols: result.detectedSymbols || [],
        composite: result.composite,
        message: result.message,
        error: result.error,
        metadata: result.metadata,
        // Analysis
        expectedSymbols: scenario.expectedSymbols,
        symbolsDetected: symbolsFound.length,
        interpretationCount: interpretations.length,
        symbolAccuracy: Math.round(symbolAccuracy),
        meetsMinInterpretations: interpretations.length >= scenario.minInterpretations,
        hasSpecificContent: interpretations.some((i: any) => i.interpretation && i.interpretation.length > 50),
      }
    } catch (error) {
      return {
        scenario: scenario.id,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        expectedSymbols: scenario.expectedSymbols,
      }
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    const results: Record<string, any> = {}

    for (const scenario of testScenarios) {
      console.log(`Testing: ${scenario.description}`)
      const result = await runSingleTest(scenario)
      results[scenario.id] = result

      // Add delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setTestResults(results)
    setIsRunning(false)
  }

  const getTestStatus = (scenarioId: string) => {
    const result = testResults[scenarioId]
    if (!result) return "pending"

    if (!result.success) return "error"

    const scenario = testScenarios.find((s) => s.id === scenarioId)
    if (!scenario) return "error"

    // Special cases
    if (scenarioId === "generic_test") {
      return result.symbols.length === 0 && result.message ? "success" : "warning"
    }

    if (scenarioId === "short_test") {
      return result.error ? "success" : "warning" // Should return error for too short
    }

    // Regular tests
    const hasGoodSymbolDetection = result.symbolAccuracy >= 50
    const hasEnoughInterpretations = result.meetsMinInterpretations
    const hasSpecificContent = result.hasSpecificContent

    if (hasGoodSymbolDetection && hasEnoughInterpretations && hasSpecificContent) {
      return "success"
    } else if (hasGoodSymbolDetection || hasEnoughInterpretations) {
      return "warning"
    } else {
      return "error"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />
    }
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-6 h-6 text-purple-600" />
          Dream Interpretation Test Suite
        </CardTitle>
        <p className="text-gray-600">Testing dream interpretation accuracy and avoiding generic responses</p>

        <div className="flex items-center gap-4 mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={useV2Api}
              onChange={(e) => setUseV2Api(e.target.checked)}
              className="rounded"
            />
            Use Enhanced API (v2)
          </label>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Button
          onClick={runAllTests}
          disabled={isRunning}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600"
          size="lg"
        >
          {isRunning ? (
            <>
              <Play className="w-4 h-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run All Tests ({useV2Api ? "Enhanced API" : "Original API"})
            </>
          )}
        </Button>

        <div className="space-y-4">
          {testScenarios.map((scenario) => {
            const status = getTestStatus(scenario.id)
            const result = testResults[scenario.id]

            return (
              <div key={scenario.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(status)}
                      <h3 className="font-semibold">{scenario.description}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">"{scenario.dream}"</p>
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs font-medium">Expected:</span>
                      {scenario.expectedSymbols.length > 0 ? (
                        scenario.expectedSymbols.map((symbol) => (
                          <Badge key={symbol} variant="outline" className="text-xs">
                            {symbol}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500">No symbols (or error)</span>
                      )}
                    </div>
                  </div>
                </div>

                {result && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <strong>Status:</strong> {result.success ? "✅ Success" : "❌ Failed"}
                      </div>
                      <div>
                        <strong>Symbols:</strong> {result.symbolsDetected || 0}
                      </div>
                      <div>
                        <strong>Accuracy:</strong> {result.symbolAccuracy || 0}%
                      </div>
                      <div>
                        <strong>Interpretations:</strong> {result.interpretationCount || 0}
                      </div>
                    </div>

                    {result.symbols?.length > 0 && (
                      <div className="mb-2">
                        <strong>Found Symbols:</strong>
                        <div className="flex gap-1 mt-1">
                          {result.symbols.map((symbol: string) => (
                            <Badge
                              key={symbol}
                              variant={scenario.expectedSymbols.includes(symbol) ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {symbol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.detectedSymbols?.length > 0 && (
                      <div className="mb-2">
                        <strong>Confidence Scores:</strong>
                        <div className="text-xs text-gray-600">
                          {result.detectedSymbols.map((ds: any) => `${ds.symbol}: ${ds.confidence}%`).join(", ")}
                        </div>
                      </div>
                    )}

                    {result.composite && (
                      <div className="mb-2">
                        <strong>Composite:</strong>
                        <div className="text-xs text-gray-600 mt-1">{result.composite.substring(0, 150)}...</div>
                      </div>
                    )}

                    {result.message && (
                      <div className="mb-2">
                        <strong>Message:</strong>
                        <span className="text-gray-600 text-sm ml-1">{result.message}</span>
                      </div>
                    )}

                    {result.error && (
                      <div className="text-red-600 text-sm">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {Object.keys(testResults).length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">Test Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {Object.keys(testResults).filter((k) => getTestStatus(k) === "success").length}
                </div>
                <div>Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {Object.keys(testResults).filter((k) => getTestStatus(k) === "warning").length}
                </div>
                <div>Warnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {Object.keys(testResults).filter((k) => getTestStatus(k) === "error").length}
                </div>
                <div>Failed</div>
              </div>
            </div>

            {useV2Api && (
              <div className="mt-3 text-center text-sm text-gray-600">
                Using Enhanced API with improved symbol detection and confidence scoring
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
