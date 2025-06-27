"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, BookOpen, Zap } from "lucide-react"

interface Interpretation {
  tradition: string
  interpretation: string
  source: string
  ritual: string
}

interface ActionStep {
  step: number
  title: string
  actions: string[]
}

interface AdvancedResult {
  interpretations: Interpretation[]
  symbolicMap: string
  actionPlan: ActionStep[]
  psychologicalCorrelations: Array<{ dreamElement: string; realLife: string }>
  timeline: string
}

export default function AdvancedDreamInterpreter() {
  const [dream, setDream] = useState("")
  const [result, setResult] = useState<AdvancedResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const interpretDream = async () => {
    if (!dream.trim() || dream.length < 20) {
      setError("Please provide a detailed dream description (at least 20 characters)")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/dreams/interpret-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || "Failed to interpret dream")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Advanced Dream Interpretation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <Textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="Describe your dream in detail... (e.g., I was at a wedding when an enemy appeared, the groom had a shaved head and walked away sadly...)"
            className="min-h-[120px] text-base"
          />

          <Button
            onClick={interpretDream}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing across 10 traditions...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Generate Advanced Interpretation
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Multi-Traditional Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                Multi-Traditional Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {result.interpretations.map((interp, index) => (
                  <div key={index} className="border-l-4 border-purple-200 pl-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-semibold">
                        {index + 1}. {interp.tradition}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-2">{interp.interpretation}</p>
                    <p className="text-sm text-gray-500 italic mb-1">
                      <strong>Source:</strong> {interp.source}
                    </p>
                    <p className="text-sm text-purple-600">
                      <strong>Ritual:</strong> {interp.ritual}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Symbolic Map */}
          <Card>
            <CardHeader>
              <CardTitle>Symbolic Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg font-mono text-sm">
                <pre>{result.symbolicMap}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Psychological Correlations */}
          {result.psychologicalCorrelations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Psychological Correlations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Dream Element</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Real-Life Equivalent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.psychologicalCorrelations.map((corr, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-2 capitalize">{corr.dreamElement}</td>
                          <td className="border border-gray-300 px-4 py-2">{corr.realLife}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.actionPlan.map((step, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-semibold text-lg mb-2">
                      Step {step.step}: {step.title}
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {step.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="text-gray-700">
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Warning */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <div className="text-orange-600 text-2xl">⚠️</div>
                <div>
                  <h4 className="font-semibold text-orange-800 mb-1">Timeline Alert</h4>
                  <p className="text-orange-700">{result.timeline}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
