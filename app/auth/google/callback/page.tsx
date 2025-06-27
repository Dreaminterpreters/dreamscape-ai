"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Processing authentication...")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const error = searchParams.get("error")

        if (error) {
          setStatus("error")
          setMessage("Authentication was cancelled or failed")
          setTimeout(() => router.push("/"), 3000)
          return
        }

        if (!code) {
          setStatus("error")
          setMessage("No authorization code received")
          setTimeout(() => router.push("/"), 3000)
          return
        }

        // Exchange code for tokens
        const response = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        })

        const data = await response.json()

        if (data.success) {
          // Store user data
          localStorage.setItem("dreamSageUser", JSON.stringify(data.user))

          setStatus("success")
          setMessage("Successfully signed in! Redirecting...")

          // Redirect to main app
          setTimeout(() => router.push("/"), 2000)
        } else {
          setStatus("error")
          setMessage(data.error || "Authentication failed")
          setTimeout(() => router.push("/"), 3000)
        }
      } catch (error) {
        console.error("Callback error:", error)
        setStatus("error")
        setMessage("An unexpected error occurred")
        setTimeout(() => router.push("/"), 3000)
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black text-white flex items-center justify-center">
      <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-purple-400" />
              <h2 className="text-xl font-semibold mb-2">Signing you in...</h2>
              <p className="text-gray-400">{message}</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h2 className="text-xl font-semibold mb-2 text-green-400">Success!</h2>
              <p className="text-gray-400">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
              <h2 className="text-xl font-semibold mb-2 text-red-400">Authentication Failed</h2>
              <p className="text-gray-400">{message}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
