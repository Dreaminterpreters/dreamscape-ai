"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Moon, Sparkles, History, LogOut, BookOpen } from "lucide-react"
import { LucideUser } from "lucide-react"
import AuthDialog from "@/components/auth-dialog"

interface UserType {
  id: string
  username: string
  age: number
  gender: string
}

export default function DreamApp() {
  // State management
  const [user, setUser] = useState<UserType | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [dreamText, setDreamText] = useState("I was climbing a mountain and encountered a dog near water")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  // Authentication success handler
  const handleAuthSuccess = (userData: UserType, token: string) => {
    setUser(userData)
    setAuthToken(token)
    setSuccess(`Welcome ${userData.username}! 🌙`)
    setError("")
  }

  // Authentication error handler
  const handleAuthError = (errorMessage: string) => {
    setError(errorMessage)
    setSuccess("")
  }

  const logout = () => {
    setAuthToken(null)
    setUser(null)
    setSuccess("Logged out successfully")
  }

  // Dream interpretation
  const interpretDream = async () => {
    if (!dreamText.trim()) {
      setError("Please describe your dream")
      return
    }

    if (dreamText.split(/\s+/).length < 5) {
      setError("Please provide a more detailed dream description")
      return
    }

    setLoading(true)
    setError("")

    // Simulate API call for preview
    setTimeout(() => {
      setSuccess("Dream interpreted successfully!")
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Moon className="w-12 h-12 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              DreamScape AI
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-6">Unlock the mysteries of your dreams</p>

          {/* Auth Section */}
          <div className="flex items-center justify-center gap-4 mb-6">
            {user ? (
              <div className="flex items-center gap-4 bg-white rounded-full px-6 py-3 shadow-md">
                <LucideUser className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Welcome, {user.username}!</span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setShowAuthDialog(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <LucideUser className="w-4 h-4 mr-2" />
                Login / Register
              </Button>
            )}
          </div>
        </div>

        {/* Auth Dialog */}
        <AuthDialog
          open={showAuthDialog}
          onOpenChange={setShowAuthDialog}
          onSuccess={handleAuthSuccess}
          onError={handleAuthError}
        />

        {/* Messages */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="interpret" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="interpret" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Interpret Dream
            </TabsTrigger>
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Dream Journal
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2" disabled={!user}>
              <History className="w-4 h-4" />
              Dream History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interpret" className="space-y-6">
            {/* Dream Input */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="w-5 h-5" />
                  Describe Your Dream
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={dreamText}
                  onChange={(e) => setDreamText(e.target.value)}
                  placeholder="Describe your dream in detail..."
                  className="min-h-[120px] text-lg"
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
                      Analyzing Dream...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Interpret Dream
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="journal" className="space-y-6">
            {user ? (
              <Card>
                <CardContent className="py-8">
                  <h3 className="text-xl font-semibold text-center mb-4">Dream Journal</h3>
                  <p className="text-center text-gray-600">Your personal dream journal will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Dream Journal</h3>
                  <p className="text-gray-500 mb-6">Please log in to access your personal dream journal</p>
                  <Button onClick={() => setShowAuthDialog(true)}>
                    <LucideUser className="w-4 h-4 mr-2" />
                    Login to Continue
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Your Dream History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Your dream history will appear here.</p>
                  <Button variant="outline">
                    <History className="w-4 h-4 mr-2" />
                    Load Dream History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Powered by Vercel Backend API • DreamScape v2.0</p>
        </div>
      </div>
    </div>
  )
}
