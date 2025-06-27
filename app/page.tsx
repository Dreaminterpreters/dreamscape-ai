"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const SPIRITUAL_TRADITIONS = [
  "G.H. Miller Classical Dictionary",
  "Jungian Analytical Psychology",
  "Islamic Dream Interpretation",
  "Christian Biblical Symbolism",
  "Hindu Vedic Traditions",
  "Buddhist Mindfulness Analysis",
  "Jewish Talmudic Wisdom",
  "Ancient Egyptian Symbolism",
  "Greek Mythological Analysis",
  "Celtic Druidic Traditions",
  "Native American Shamanism",
  "Chinese Traditional Medicine",
  "Japanese Shinto Beliefs",
  "African Ancestral Wisdom",
  "Mayan Cosmic Understanding",
  "Norse Mythology",
  "Persian Zoroastrian Texts",
  "Sufi Mystical Interpretation",
  "Kabbalistic Analysis",
  "Tibetan Dream Yoga",
  "Australian Aboriginal Dreamtime",
  "Polynesian Spiritual Traditions",
  "Aztec Symbolic Wisdom",
  "Incan Spiritual Guidance",
  "Russian Orthodox Mysticism",
  "Gnostic Christian Traditions",
  "Hermetic Philosophical Analysis",
  "Anthroposophical Interpretation",
  "Theosophical Understanding",
  "Rosicrucian Symbolism",
  "Wiccan Nature Wisdom",
  "Rastafarian Spiritual Insight",
  "Tarot Archetypal Analysis",
]

export default function DreamSagePage() {
  const [dreamText, setDreamText] = useState("")
  const [selectedTraditions, setSelectedTraditions] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleTraditionToggle = (tradition: string) => {
    setSelectedTraditions((prev) => {
      if (prev.includes(tradition)) {
        return prev.filter((t) => t !== tradition)
      } else if (prev.length < 10) {
        return [...prev, tradition]
      }
      return prev
    })
  }

  const handleSelectAll = () => {
    setSelectedTraditions(SPIRITUAL_TRADITIONS.slice(0, 10))
  }

  const handleClearAll = () => {
    setSelectedTraditions([])
  }

  const handleAnalyzeDream = async () => {
    if (dreamText.length < 20) return

    setIsAnalyzing(true)

    try {
      const response = await fetch("/api/dreams/interpret-deepseek", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dreamText,
          selectedTraditions: selectedTraditions.length > 0 ? selectedTraditions : ["General Analysis"],
        }),
      })

      const data = await response.json()

      if (data.success) {
        setResults(data)
      } else {
        console.error("Analysis failed:", data.error)
      }
    } catch (error) {
      console.error("Error analyzing dream:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <Button onClick={() => setResults(null)} className="mb-6 bg-purple-600 hover:bg-purple-700">
            ← Back to Dream Form
          </Button>

          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Your Dream Analysis
          </h1>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-300">{results.interpretation}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            DreamSage
          </h1>
          <p className="text-xl text-purple-300 mb-6">AI-Powered Multi-Traditional Dream Interpretation</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>📖 33+ Authentic Sources</span>
            <span>🌍 Multi-Cultural Wisdom</span>
            <span>✨ AI-Powered Analysis</span>
          </div>
        </div>

        {/* Dream Input */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Share Your Dream</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Describe your dream in detail...</label>
              <Textarea
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="I was walking through a golden forest when I encountered a wise owl..."
                className="min-h-32 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                maxLength={3000}
              />
              <div className="flex justify-between text-sm text-gray-400 mt-2">
                <span>{dreamText.length}/3000 characters</span>
                <span className={dreamText.length >= 20 ? "text-green-400" : "text-yellow-400"}>
                  {dreamText.length >= 20 ? "✓ Ready for analysis" : "Need at least 20 characters"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tradition Selection */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Select Spiritual Traditions (Max 10)</span>
              <div className="flex gap-2">
                <Button
                  onClick={handleSelectAll}
                  variant="outline"
                  size="sm"
                  className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                >
                  Select All
                </Button>
                <Button
                  onClick={handleClearAll}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
                >
                  Clear All
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {SPIRITUAL_TRADITIONS.map((tradition) => (
                <Badge
                  key={tradition}
                  variant={selectedTraditions.includes(tradition) ? "default" : "outline"}
                  className={`cursor-pointer p-3 text-center transition-all ${
                    selectedTraditions.includes(tradition)
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "border-gray-600 text-gray-300 hover:border-purple-500 hover:text-purple-300"
                  } ${selectedTraditions.length >= 10 && !selectedTraditions.includes(tradition) ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => handleTraditionToggle(tradition)}
                >
                  {tradition}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-gray-400 mt-4">Selected: {selectedTraditions.length}/10 traditions</p>
          </CardContent>
        </Card>

        {/* Analyze Button */}
        <div className="text-center">
          <Button
            onClick={handleAnalyzeDream}
            disabled={dreamText.length < 20 || isAnalyzing}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-6 px-12 text-lg"
          >
            {isAnalyzing ? "⏳ AI is analyzing your dream..." : "✨ Interpret My Dream"}
          </Button>
        </div>
      </div>
    </div>
  )
}
