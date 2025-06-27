"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, BookOpen, ExternalLink } from "lucide-react"
import MinimalAds from "@/components/minimal-ads"

export default function FullInterpretationPage() {
  const params = useParams()
  const router = useRouter()
  const [interpretation, setInterpretation] = useState<any>(null)
  const [allInterpretations, setAllInterpretations] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dreamContext, setDreamContext] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get interpretation data from localStorage
    const storedInterpretations = localStorage.getItem("currentInterpretations")
    const storedIndex = localStorage.getItem("currentInterpretationIndex")
    const storedDreamContext = localStorage.getItem("dreamContext")

    if (storedInterpretations && storedIndex && storedDreamContext) {
      const interpretations = JSON.parse(storedInterpretations)
      const index = Number.parseInt(storedIndex)
      const context = JSON.parse(storedDreamContext)

      setAllInterpretations(interpretations)
      setInterpretation(interpretations[index])
      setCurrentIndex(index)
      setDreamContext(context)
    }
    setLoading(false)
  }, [params.id])

  const handleBack = () => {
    router.back()
  }

  const handleNext = () => {
    if (currentIndex < allInterpretations.length - 1) {
      const nextIndex = currentIndex + 1
      localStorage.setItem("currentInterpretationIndex", nextIndex.toString())
      router.push(`/interpretation/${nextIndex}`)
    } else {
      router.back()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      localStorage.setItem("currentInterpretationIndex", prevIndex.toString())
      router.push(`/interpretation/${prevIndex}`)
    }
  }

  const getTranslation = (key: string) => {
    const language = dreamContext?.language || "en"
    const translations: Record<string, Record<string, string>> = {
      en: {
        backToResults: "← Back to All Interpretations",
        fullInterpretation: "Complete Interpretation",
        sourceReference: "Source Reference",
        nextInterpretation: "Next Interpretation",
        previousInterpretation: "Previous Interpretation",
        backToAll: "Back to All Results",
      },
      ti: {
        backToResults: "← ናብ ኩሉ ትርጓሜታት ተመለስ",
        fullInterpretation: "ምሉእ ትርጓሜ",
        sourceReference: "ምንጪ ሓበሬታ",
        nextInterpretation: "ዝቕጽል ትርጓሜ",
        previousInterpretation: "ዝሓለፈ ትርጓሜ",
        backToAll: "ናብ ኩሉ ውጽኢታት ተመለስ",
      },
      am: {
        backToResults: "← ወደ ሁሉም ትርጓሜዎች ተመለስ",
        fullInterpretation: "ሙሉ ትርጓሜ",
        sourceReference: "ምንጭ ማጣቀሻ",
        nextInterpretation: "ቀጣይ ትርጓሜ",
        previousInterpretation: "ቀዳሚ ትርጓሜ",
        backToAll: "ወደ ሁሉም ውጤቶች ተመለስ",
      },
    }
    return translations[language]?.[key] || translations.en[key] || key
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p>Loading interpretation...</p>
        </div>
      </div>
    )
  }

  if (!interpretation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Interpretation not found</p>
          <Button onClick={handleBack} className="bg-purple-600 hover:bg-purple-700">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={handleBack}
            variant="outline"
            className="mb-4 text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {getTranslation("backToResults")}
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {interpretation.name}
              </h1>
              <p className="text-gray-400">{interpretation.source}</p>
            </div>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              {currentIndex + 1} of {allInterpretations.length}
            </Badge>
          </div>
        </div>

        {/* Dream Context */}
        {dreamContext?.dream && (
          <Card className="mb-8 bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Your Dream</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-sm leading-relaxed">
                {dreamContext.dream.length > 200 ? `${dreamContext.dream.substring(0, 200)}...` : dreamContext.dream}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Minimal Ad */}
        <MinimalAds position="content" />

        {/* Full Interpretation */}
        <Card className="mb-8 bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              {getTranslation("fullInterpretation")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                {interpretation.fullInterpretation || interpretation.interpretation}
              </div>
            </div>

            {interpretation.sourceReference && (
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-start gap-3">
                  <ExternalLink className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-300 mb-2">{getTranslation("sourceReference")}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed">{interpretation.sourceReference}</p>
                    {interpretation.sourceUrl && (
                      <a
                        href={interpretation.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-sm underline mt-2 inline-block"
                      >
                        View Original Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {getTranslation("previousInterpretation")}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">
              {currentIndex + 1} of {allInterpretations.length} interpretations
            </p>
            <div className="flex space-x-1">
              {allInterpretations.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full ${idx === currentIndex ? "bg-purple-400" : "bg-gray-600"}`}
                />
              ))}
            </div>
          </div>

          <Button onClick={handleNext} className="bg-purple-600 hover:bg-purple-700">
            {currentIndex + 1 < allInterpretations.length ? (
              <>
                {getTranslation("nextInterpretation")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                {getTranslation("backToAll")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Footer Ad */}
        <MinimalAds position="footer" />
      </div>
    </div>
  )
}
