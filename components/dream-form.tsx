"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"

interface DreamFormProps {
  config: any
  onSubmit: (data: any) => void
  loading: boolean
  error: string
}

function DreamForm({ config, onSubmit, loading, error }: DreamFormProps) {
  const [dream, setDream] = useState("")
  const [language, setLanguage] = useState("en")
  const [sourceType, setSourceType] = useState("mixed")
  const [specificSource, setSpecificSource] = useState("all")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (dream.trim().length < 10) return

    onSubmit({
      dream: dream.trim(),
      language,
      sourceType,
      specificSource: specificSource !== "all" ? specificSource : undefined,
    })
  }

  if (!config) return <div className="text-center">Loading...</div>

  return (
    <div className="bg-gray-800 rounded-lg p-8 shadow-2xl border border-gray-700 max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles className="h-6 w-6 text-purple-400" />
        <h2 className="text-2xl font-semibold">Tell Us Your Dream</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Describe Your Dream</label>
          <Textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                if (dream.trim().length >= 10) {
                  handleSubmit(e)
                }
              }
            }}
            placeholder="I was at a wedding ceremony when suddenly an enemy appeared..."
            className="min-h-32 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            maxLength={2000}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-400">{dream.length}/2000 characters</div>
            <div className="text-sm text-gray-400">
              Press <kbd className="px-2 py-1 bg-gray-600 rounded text-xs">Enter</kbd> to interpret
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || dream.trim().length < 10}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-6 rounded-lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Interpreting Your Dream...
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5 mr-2" />
              Interpret My Dream
            </>
          )}
        </Button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-600 rounded-md">
          <p className="text-red-300">{error}</p>
        </div>
      )}
    </div>
  )
}

export default DreamForm
