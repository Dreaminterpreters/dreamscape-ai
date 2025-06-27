"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, LogIn } from "lucide-react"
import Image from "next/image"
import AuthDialog from "@/components/auth-dialog"

export default function Header() {
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string>("")

  const handleAuthSuccess = (userData: any, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    console.log("User authenticated:", userData)
  }

  const handleAuthError = (error: string) => {
    console.error("Auth error:", error)
  }

  const handleSignOut = () => {
    setUser(null)
    setToken("")
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image
                src="/images/dreamscape-watermark.png"
                alt="DreamScape AI"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  DreamScape AI
                </h1>
                <p className="text-xs text-gray-500">Multi-Traditional Dream Wisdom</p>
              </div>
            </div>

            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Welcome, {user.username}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowAuthDialog(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In / Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={handleAuthSuccess}
        onError={handleAuthError}
      />
    </>
  )
}
