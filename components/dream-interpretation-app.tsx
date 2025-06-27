"use client"

import { useState, useEffect } from "react"
import { User, LogOut, BookOpen, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthDialog from "@/components/auth-dialog"
import DreamJournal from "@/components/dream-journal"
import DreamForm from "@/components/dream-form"
import DreamResults from "@/components/dream-results"

function DreamInterpretationApp() {
  const [config] = useState({
    languages: [{ code: "en", name: "English", flag: "🇺🇸" }],
    sourceTypes: [{ value: "mixed", label: "Mixed Traditions", emoji: "🌍" }],
    specificSources: [{ value: "all", label: "All Available Sources", emoji: "🌟" }],
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentView, setCurrentView] = useState<"interpret" | "journal">("interpret")

  // Auth state
  const [user, setUser] = useState<any>(null)
  const [authToken, setAuthToken] = useState<string>("")
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  // Dream saving state
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Load user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("dreamSageUser")
    const savedToken = localStorage.getItem("dreamSageToken")
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setAuthToken(savedToken)
    }
  }, [])

  const handleAuthSuccess = (userData: any, token: string) => {
    setUser(userData)
    setAuthToken(token)
    localStorage.setItem("dreamSageUser", JSON.stringify(userData))
    localStorage.setItem("dreamSageToken", token)
  }

  const handleLogout = () => {
    setUser(null)
    setAuthToken("")
    localStorage.removeItem("dreamSageUser")
    localStorage.removeItem("dreamSageToken")
    setCurrentView("interpret")
  }

  const handleDreamSubmit = async (dreamData: any) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/dreams/interpret", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify(dreamData),
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

  const handleReset = () => {
    setResult(null)
    setError("")
    setSaveSuccess(false)
  }

  const saveDreamToJournal = async () => {
    if (!user || !result) return

    setSaving(true)
    try {
      const dreamEntry = {
        title: "Dream Analysis " + new Date().toLocaleDateString(),
        dream: "Dream interpretation completed",
        mood: "neutral",
        tags: [],
        isLucid: false,
        sleepQuality: 5,
        notes: `AI Interpretation completed on ${new Date().toLocaleDateString()}`,
        interpretations: result.traditions?.map((t: any) => t.interpretation) || [],
        symbols: [],
      }

      const response = await fetch("/api/journal/entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(dreamEntry),
      })

      if (response.ok) {
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 3000)
      } else {
        throw new Error("Failed to save dream")
      }
    } catch (err) {
      setError("Failed to save dream to journal")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-gray-900 text-white font-sans min-h-screen">
      {/* Top Navigation */}
      <div className="fixed top-4 left-4 z-50">
        <img src="/images/dreamscape-spiritual-watermark.png" alt="DreamSage" className="w-12 h-12 opacity-80" />
      </div>

      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        {user && (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentView("interpret")}
              variant={currentView === "interpret" ? "default" : "ghost"}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Interpret
            </Button>
            <Button
              onClick={() => setCurrentView("journal")}
              variant={currentView === "journal" ? "default" : "ghost"}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Journal
            </Button>
          </div>
        )}

        {user ? (
          <div className="flex items-center gap-3 bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-700">
            <span className="text-sm text-gray-300">Welcome, {user.username}</span>
            <Button onClick={handleLogout} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={() => setShowAuthDialog(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
            <User className="h-4 w-4 mr-2" />
            Sign In
          </Button>
        )}
      </div>

      {/* Main Content */}
      {currentView === "journal" && user ? (
        <div className="pt-24">
          <DreamJournal user={user} authToken={authToken} />
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-black px-4 py-16 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-center mb-8">
                <img
                  src="/images/dreamscape-spiritual-watermark.png"
                  alt="DreamSage - Spiritual Dream Interpretation"
                  className="w-24 h-24 md:w-32 md:h-32 opacity-90"
                />
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">DreamSage</h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90 mb-8">
                Explore the hidden meanings behind your dreams through ancient wisdom and modern psychology.
              </p>

              {/* Dream Input or Loading */}
              {!result && !loading && (
                <DreamForm config={config} onSubmit={handleDreamSubmit} loading={loading} error={error} />
              )}

              {/* Loading State */}
              {loading && (
                <div className="text-center py-12">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-purple-400" />
                    <div className="absolute inset-0 w-12 h-12 mx-auto rounded-full bg-purple-400 opacity-20 animate-pulse"></div>
                  </div>
                  <p className="text-white text-lg mb-2">Consulting ancient wisdom sources...</p>
                  <p className="text-gray-400">Analyzing across 50+ traditions</p>
                </div>
              )}
            </div>
          </section>

          {/* Results */}
          {result && (
            <DreamResults
              result={result}
              onReset={handleReset}
              onSave={saveDreamToJournal}
              saving={saving}
              saveSuccess={saveSuccess}
              user={user}
            />
          )}
        </>
      )}

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={handleAuthSuccess}
        onError={() => {}}
      />
    </div>
  )
}

export default DreamInterpretationApp
