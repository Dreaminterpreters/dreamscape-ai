"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ExternalLink, BookOpen, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import MinimalAds from "@/components/minimal-ads"

interface DreamResultsProps {
  results: any
  onBack: () => void
  language: string
}

export default function DreamResults({ results, onBack, language }: DreamResultsProps) {
  const router = useRouter()
  const [expandedInterpretation, setExpandedInterpretation] = useState<string | null>(null)

  const handleReadMore = (interpretation: any, index: number) => {
    // Store interpretations in localStorage for the full page
    localStorage.setItem("currentInterpretations", JSON.stringify(results.interpretations))
    localStorage.setItem("currentInterpretationIndex", index.toString())
    localStorage.setItem(
      "dreamContext",
      JSON.stringify({
        dream: results.dream,
        language: language,
      }),
    )

    // Navigate to full interpretation page
    router.push(`/interpretation/${index}`)
  }

  const getTranslation = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        backToForm: "← Back to Dream Form",
        yourDream: "Your Dream",
        interpretations: "Interpretations",
        readMore: "Read More",
        sourceReference: "Source Reference",
        authenticSource: "Authentic Source",
      },
      ti: {
        backToForm: "← ናብ ሕልሚ ቅጥዒ ተመለስ",
        yourDream: "ሕልምካ",
        interpretations: "ትርጓሜታት",
        readMore: "ዝያዳ ኣንብብ",
        sourceReference: "ምንጪ ሓበሬታ",
        authenticSource: "ሓቀኛ ምንጪ",
      },
      am: {
        backToForm: "← ወደ ህልም ቅጽ ተመለስ",
        yourDream: "ህልምዎ",
        interpretations: "ትርጓሜዎች",
        readMore: "ተጨማሪ ያንብቡ",
        sourceReference: "ምንጭ ማጣቀሻ",
        authenticSource: "ትክክለኛ ምንጭ",
      },
    }
    return translations[language]?.[key] || translations.en[key] || key
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-4 text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {getTranslation("backToForm")}
          </Button>

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            DreamSage Analysis
          </h1>
          <p className="text-gray-400">
            AI-powered interpretation from {results.interpretations?.length || 0} authentic sources
          </p>
        </div>

        {/* Dream Summary */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              {getTranslation("yourDream")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">{results.dream}</p>
          </CardContent>
        </Card>

        {/* Minimal Ad */}
        <MinimalAds position="content" />

        {/* Interpretations */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">{getTranslation("interpretations")}</h2>

          {results.interpretations?.map((interpretation: any, index: number) => (
            <Card key={index} className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-purple-300">{interpretation.name}</CardTitle>
                    <p className="text-sm text-gray-400 mt-1">{interpretation.source}</p>
                  </div>
                  <Badge variant="outline" className="text-purple-400 border-purple-400">
                    {getTranslation("authenticSource")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    {interpretation.briefInterpretation || interpretation.interpretation}
                  </p>

                  {interpretation.hasMore && (
                    <Button
                      onClick={() => handleReadMore(interpretation, index)}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {getTranslation("readMore")}
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  )}

                  {interpretation.sourceReference && (
                    <div className="pt-4 border-t border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <BookOpen className="w-4 h-4" />
                        <span>
                          {getTranslation("sourceReference")}: {interpretation.sourceReference}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Wisdom Quote */}
        {results.wisdomQuote && (
          <Card className="mt-8 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border-purple-600/30">
            <CardContent className="p-6 text-center">
              <p className="text-lg italic text-purple-200">"{results.wisdomQuote}"</p>
            </CardContent>
          </Card>
        )}

        {/* Footer Ad */}
        <MinimalAds position="footer" />
      </div>
    </div>
  )
}
