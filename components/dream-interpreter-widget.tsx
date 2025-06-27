"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, BookOpen, ExternalLink } from "lucide-react"
import Image from "next/image"

interface Tradition {
  tradition: string
  interpretation: string
  source: string
  ritual: string
  readMoreUrl?: string
  summary?: string
}

interface PsychologicalCorrelation {
  dreamElement: string
  realLifeEquivalent: string
}

interface DreamInterpretationResponse {
  success: boolean
  traditions: Tradition[]
  psychologicalCorrelations: PsychologicalCorrelation[]
  aiSynthesis: string
  gypsyProverb: string
  warning: string
  availableSources: any
  selectedSource: string
  fromCache?: boolean
}

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "ti", name: "ትግርኛ", flag: "🇪🇷" },
  { code: "am", name: "አማርኛ", flag: "🇪🇹" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
]

const SOURCE_TYPES = [
  { value: "mixed", label: "Mixed Traditions", emoji: "🌍" },
  { value: "ancient", label: "Ancient Wisdom", emoji: "🏛️" },
  { value: "religious", label: "Religious Traditions", emoji: "🙏" },
  { value: "indigenous", label: "Indigenous Wisdom", emoji: "🌿" },
]

export default function DreamInterpreterWidget() {
  const [dream, setDream] = useState("")
  const [language, setLanguage] = useState("en")
  const [sourceType, setSourceType] = useState("mixed")
  const [result, setResult] = useState<DreamInterpretationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expandedTraditions, setExpandedTraditions] = useState<Set<number>>(new Set())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dream.trim() || dream.length < 10) {
      setError("Please provide a more detailed dream description (at least 10 characters)")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/dreams/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dream, language, sourceType }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to interpret dream")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedTraditions)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedTraditions(newExpanded)
  }

  const isExpanded = (index: number) => expandedTraditions.has(index)

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Universal Dream Interpreter
          </h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the hidden meanings in your dreams through 50+ spiritual and psychological traditions from around the
          world
        </p>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Tell Us Your Dream
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tradition Focus</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {SOURCE_TYPES.map((source) => (
                    <option key={source.value} value={source.value}>
                      {source.emoji} {source.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Describe Your Dream</label>
              <Textarea
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder="Share your dream in as much detail as possible. Include emotions, colors, people, places, and any symbols you remember..."
                className="min-h-32"
                maxLength={2000}
              />
              <div className="text-sm text-gray-500 mt-1">{dream.length}/2000 characters</div>
            </div>

            <button
              type="submit"
              disabled={loading || !dream.trim() || dream.length < 10}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Interpreting Your Dream...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Interpret My Dream
                </div>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Cache indicator */}
          {result.fromCache && (
            <div className="text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                ⚡ Instant Result (Cached)
              </span>
            </div>
          )}

          {/* AI Synthesis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Synthesis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{result.aiSynthesis}</p>
            </CardContent>
          </Card>

          {/* Traditions */}
          <div className="grid gap-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              Interpretations from {result.traditions.length} Traditions
            </h2>
            {result.traditions.map((tradition, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{tradition.tradition.split(" ")[0]}</span>
                      <span>{tradition.tradition.substring(tradition.tradition.indexOf(" ") + 1)}</span>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {tradition.readMoreUrl && (
                        <a
                          href={tradition.readMoreUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Learn more about this tradition"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => toggleExpanded(index)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <BookOpen className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{tradition.source}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Show summary or full interpretation */}
                    <div className="text-gray-700 leading-relaxed">
                      {isExpanded(index) ? (
                        <div>
                          <p>{tradition.interpretation}</p>
                          <button
                            onClick={() => toggleExpanded(index)}
                            className="text-blue-600 hover:text-blue-800 text-sm mt-2 font-medium"
                          >
                            Show Less
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p>{tradition.summary || tradition.interpretation.substring(0, 150) + "..."}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <button
                              onClick={() => toggleExpanded(index)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Read Full Interpretation
                            </button>
                            {tradition.readMoreUrl && (
                              <a
                                href={tradition.readMoreUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
                              >
                                Learn More About {tradition.tradition.split(" ")[1] || "Tradition"}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Ritual */}
                    {tradition.ritual && (
                      <div className="bg-purple-50 p-3 rounded-md">
                        <h4 className="font-medium text-purple-800 mb-1">Recommended Practice:</h4>
                        <p className="text-purple-700 text-sm">{tradition.ritual}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Psychological Correlations */}
          {result.psychologicalCorrelations && result.psychologicalCorrelations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">🧠 Psychological Correlations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {result.psychologicalCorrelations.map((correlation, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-blue-50 rounded-md">
                      <div className="flex-1">
                        <span className="font-medium text-blue-800">Dream:</span>
                        <span className="ml-2 text-blue-700">{correlation.dreamElement}</span>
                      </div>
                      <div className="text-blue-600">→</div>
                      <div className="flex-1">
                        <span className="font-medium text-blue-800">Reality:</span>
                        <span className="ml-2 text-blue-700">{correlation.realLifeEquivalent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Mystical Proverb */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">🔮 Mystical Wisdom</CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-lg italic text-center text-purple-700 font-medium">
                "{result.gypsyProverb}"
              </blockquote>
            </CardContent>
          </Card>

          {/* Warning/Guidance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">⚠️ Guidance for the Next 21 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{result.warning}</p>
            </CardContent>
          </Card>

          {/* Watermark */}
          <div className="text-center py-4">
            <div className="relative inline-block">
              <Image
                src="/images/dreamscape-spiritual-watermark.png"
                alt="Dreamscape Spiritual"
                width={200}
                height={60}
                className="opacity-60"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
