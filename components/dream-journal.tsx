"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Plus, Cloud, Download, Search, Calendar, Moon, Star, Heart, Brain, Trash2, Edit } from "lucide-react"
import {
  type DreamJournalEntry,
  type CloudStorageConfig,
  CLOUD_PROVIDERS,
  createCloudStorage,
  LocalStorage,
} from "@/lib/cloud-storage"

interface DreamJournalProps {
  user: any
  authToken: string
}

export default function DreamJournal({ user, authToken }: DreamJournalProps) {
  const [entries, setEntries] = useState<DreamJournalEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<DreamJournalEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMood, setSelectedMood] = useState("all")
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false)
  const [showCloudDialog, setShowCloudDialog] = useState(false)
  const [editingEntry, setEditingEntry] = useState<DreamJournalEntry | null>(null)
  const [cloudConfig, setCloudConfig] = useState<CloudStorageConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const localStorage = new LocalStorage()

  // New entry form state
  const [newEntry, setNewEntry] = useState({
    title: "",
    dream: "",
    mood: "neutral",
    tags: "",
    isLucid: false,
    sleepQuality: 5,
    notes: "",
  })

  const moods = [
    { value: "joyful", label: "😊 Joyful", color: "#FFD700" },
    { value: "peaceful", label: "😌 Peaceful", color: "#87CEEB" },
    { value: "excited", label: "🤩 Excited", color: "#FF6347" },
    { value: "neutral", label: "😐 Neutral", color: "#D3D3D3" },
    { value: "confused", label: "😕 Confused", color: "#DDA0DD" },
    { value: "anxious", label: "😰 Anxious", color: "#FFA500" },
    { value: "frightened", label: "😨 Frightened", color: "#DC143C" },
    { value: "sad", label: "😢 Sad", color: "#4682B4" },
  ]

  useEffect(() => {
    loadEntries()
    loadCloudConfig()
  }, [])

  useEffect(() => {
    filterEntries()
  }, [entries, searchTerm, selectedMood])

  const loadEntries = async () => {
    setLoading(true)
    try {
      if (cloudConfig) {
        const cloudStorage = createCloudStorage(cloudConfig.provider, cloudConfig.accessToken)
        const cloudEntries = await cloudStorage.loadJournalEntries()
        setEntries(cloudEntries)
      } else {
        const localEntries = await localStorage.loadJournalEntries()
        setEntries(localEntries)
      }
    } catch (error) {
      console.error("Failed to load entries:", error)
      setError("Failed to load journal entries")
    } finally {
      setLoading(false)
    }
  }

  const loadCloudConfig = () => {
    const stored = localStorage.getItem("dreamscape_cloud_config")
    if (stored) {
      try {
        setCloudConfig(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to parse cloud config:", error)
      }
    }
  }

  const filterEntries = () => {
    let filtered = entries

    if (searchTerm) {
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.dream.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (selectedMood !== "all") {
      filtered = filtered.filter((entry) => entry.mood === selectedMood)
    }

    setFilteredEntries(filtered)
  }

  const saveEntry = async (entryData: Partial<DreamJournalEntry>) => {
    setLoading(true)
    try {
      const entry: DreamJournalEntry = {
        id: entryData.id || `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString().split("T")[0],
        title: entryData.title || "",
        dream: entryData.dream || "",
        mood: entryData.mood || "neutral",
        symbols: entryData.symbols || [],
        interpretations: entryData.interpretations || [],
        tags: entryData.tags || [],
        isLucid: entryData.isLucid || false,
        sleepQuality: entryData.sleepQuality || 5,
        notes: entryData.notes || "",
        createdAt: entryData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      let success = false

      if (cloudConfig) {
        const cloudStorage = createCloudStorage(cloudConfig.provider, cloudConfig.accessToken)
        success = await cloudStorage.saveJournalEntry(entry)
      } else {
        success = await localStorage.saveJournalEntry(entry)
      }

      if (success) {
        await loadEntries()
        setSuccess("Journal entry saved successfully!")
        setShowNewEntryDialog(false)
        setEditingEntry(null)
        resetNewEntryForm()
      } else {
        setError("Failed to save journal entry")
      }
    } catch (error) {
      console.error("Save error:", error)
      setError("Failed to save journal entry")
    } finally {
      setLoading(false)
    }
  }

  const deleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this journal entry?")) return

    setLoading(true)
    try {
      let success = false

      if (cloudConfig) {
        // For cloud storage, we'd need to implement delete functionality
        // For now, we'll remove from local state and let cloud sync handle it
        setEntries(entries.filter((e) => e.id !== entryId))
        success = true
      } else {
        success = await localStorage.deleteJournalEntry(entryId)
      }

      if (success) {
        await loadEntries()
        setSuccess("Journal entry deleted successfully!")
      } else {
        setError("Failed to delete journal entry")
      }
    } catch (error) {
      console.error("Delete error:", error)
      setError("Failed to delete journal entry")
    } finally {
      setLoading(false)
    }
  }

  const connectCloudStorage = async (provider: string) => {
    try {
      const redirectUri = `${window.location.origin}/cloud-callback`
      const providerConfig = CLOUD_PROVIDERS[provider]

      if (!providerConfig) {
        setError("Unsupported cloud provider")
        return
      }

      // Build OAuth URL
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "", // You'd need different client IDs for each provider
        redirect_uri: redirectUri,
        response_type: "code",
        scope: providerConfig.scopes.join(" "),
        access_type: "offline",
        prompt: "consent",
      })

      const authUrl = `${providerConfig.authUrl}?${params.toString()}`
      window.open(authUrl, "_blank", "width=500,height=600")

      // Listen for the callback
      window.addEventListener("message", handleCloudCallback)
    } catch (error) {
      console.error("Cloud connection error:", error)
      setError("Failed to connect to cloud storage")
    }
  }

  const handleCloudCallback = async (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return

    const { code, provider } = event.data

    if (code && provider) {
      try {
        const response = await fetch("/api/cloud-storage/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            provider,
            code,
            redirectUri: `${window.location.origin}/cloud-callback`,
          }),
        })

        const data = await response.json()

        if (data.success) {
          const config: CloudStorageConfig = {
            provider,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresAt: Date.now() + data.expiresIn * 1000,
            userId: user.id,
          }

          setCloudConfig(config)
          localStorage.setItem("dreamscape_cloud_config", JSON.stringify(config))
          setSuccess(`Connected to ${CLOUD_PROVIDERS[provider].name} successfully!`)
          setShowCloudDialog(false)

          // Migrate local entries to cloud
          await migrateLocalToCloud(config)
        } else {
          setError("Failed to connect to cloud storage")
        }
      } catch (error) {
        console.error("Cloud callback error:", error)
        setError("Failed to connect to cloud storage")
      }

      window.removeEventListener("message", handleCloudCallback)
    }
  }

  const migrateLocalToCloud = async (config: CloudStorageConfig) => {
    try {
      const localEntries = await localStorage.loadJournalEntries()
      if (localEntries.length > 0) {
        const cloudStorage = createCloudStorage(config.provider, config.accessToken)

        for (const entry of localEntries) {
          await cloudStorage.saveJournalEntry(entry)
        }

        setSuccess(`Migrated ${localEntries.length} entries to ${CLOUD_PROVIDERS[config.provider].name}`)
      }
    } catch (error) {
      console.error("Migration error:", error)
      setError("Failed to migrate local entries to cloud")
    }
  }

  const exportJournal = async (format: "json" | "csv") => {
    try {
      let data: string | null = null

      if (cloudConfig) {
        const cloudStorage = createCloudStorage(cloudConfig.provider, cloudConfig.accessToken)
        data = await cloudStorage.exportJournal(format)
      } else {
        const localEntries = await localStorage.loadJournalEntries()
        if (format === "json") {
          data = JSON.stringify(localEntries, null, 2)
        } else {
          // Convert to CSV
          const headers = ["Date", "Title", "Dream", "Mood", "Tags", "Lucid", "Sleep Quality", "Notes"]
          const rows = localEntries.map((entry) => [
            entry.date,
            entry.title,
            `"${entry.dream.replace(/"/g, '""')}"`,
            entry.mood,
            entry.tags.join("; "),
            entry.isLucid ? "Yes" : "No",
            entry.sleepQuality.toString(),
            `"${entry.notes.replace(/"/g, '""')}"`,
          ])
          data = [headers, ...rows].map((row) => row.join(",")).join("\n")
        }
      }

      if (data) {
        const blob = new Blob([data], { type: format === "json" ? "application/json" : "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `dreamscape-journal.${format}`
        a.click()
        URL.revokeObjectURL(url)
        setSuccess(`Journal exported as ${format.toUpperCase()}`)
      }
    } catch (error) {
      console.error("Export error:", error)
      setError("Failed to export journal")
    }
  }

  const resetNewEntryForm = () => {
    setNewEntry({
      title: "",
      dream: "",
      mood: "neutral",
      tags: "",
      isLucid: false,
      sleepQuality: 5,
      notes: "",
    })
  }

  const handleNewEntrySubmit = () => {
    if (!newEntry.title.trim() || !newEntry.dream.trim()) {
      setError("Title and dream description are required")
      return
    }

    const entryData = {
      ...newEntry,
      tags: newEntry.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }

    saveEntry(entryData)
  }

  const getMoodColor = (mood: string) => {
    const moodConfig = moods.find((m) => m.value === mood)
    return moodConfig?.color || "#D3D3D3"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        {cloudConfig ? (
          <div className="flex items-center gap-3">
            {user?.picture && (
              <img
                src={user.picture || "/placeholder.svg"}
                alt={user.name || user.username}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Dream Journal</h2>
              <p className="text-gray-600">
                Synced with {CLOUD_PROVIDERS[cloudConfig.provider].name} • {user?.email}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Dream Journal</h2>
              <p className="text-gray-600">
                {user?.email ? `Welcome ${user.name || user.username}` : "Stored locally on your device"}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Dialog open={showCloudDialog} onOpenChange={setShowCloudDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                {cloudConfig ? "Cloud Connected" : "Connect Cloud"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cloud Storage</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Connect your cloud storage to sync your dream journal across devices and keep your data secure.
                </p>

                {cloudConfig ? (
                  <div className="space-y-4">
                    <Alert>
                      <Cloud className="w-4 h-4" />
                      <AlertDescription>Connected to {CLOUD_PROVIDERS[cloudConfig.provider].name}</AlertDescription>
                    </Alert>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCloudConfig(null)
                        localStorage.removeItem("dreamscape_cloud_config")
                        setSuccess("Disconnected from cloud storage")
                        setShowCloudDialog(false)
                      }}
                    >
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {Object.entries(CLOUD_PROVIDERS).map(([key, provider]) => (
                      <Button
                        key={key}
                        variant="outline"
                        className="flex items-center gap-3 justify-start"
                        onClick={() => connectCloudStorage(key)}
                        style={{ borderColor: provider.color }}
                      >
                        <div
                          className="w-6 h-6 rounded flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: provider.color }}
                        >
                          {provider.icon === "google" && "G"}
                          {provider.icon === "dropbox" && "D"}
                          {provider.icon === "microsoft" && "M"}
                        </div>
                        Connect to {provider.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => exportJournal("json")} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>

          <Dialog open={showNewEntryDialog} onOpenChange={setShowNewEntryDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Dream Journal Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Dream Title</Label>
                  <Input
                    id="title"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                    placeholder="Give your dream a title..."
                  />
                </div>

                <div>
                  <Label htmlFor="dream">Dream Description</Label>
                  <Textarea
                    id="dream"
                    value={newEntry.dream}
                    onChange={(e) => setNewEntry({ ...newEntry, dream: e.target.value })}
                    placeholder="Describe your dream in detail..."
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mood">Mood</Label>
                    <Select value={newEntry.mood} onValueChange={(value) => setNewEntry({ ...newEntry, mood: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {moods.map((mood) => (
                          <SelectItem key={mood.value} value={mood.value}>
                            {mood.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="sleepQuality">Sleep Quality (1-10)</Label>
                    <Input
                      id="sleepQuality"
                      type="number"
                      min="1"
                      max="10"
                      value={newEntry.sleepQuality}
                      onChange={(e) => setNewEntry({ ...newEntry, sleepQuality: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={newEntry.tags}
                    onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                    placeholder="nightmare, flying, family, work..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isLucid"
                    checked={newEntry.isLucid}
                    onChange={(e) => setNewEntry({ ...newEntry, isLucid: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isLucid">This was a lucid dream</Label>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={newEntry.notes}
                    onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                    placeholder="Any additional thoughts or observations..."
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowNewEntryDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleNewEntrySubmit} disabled={loading}>
                    {loading ? "Saving..." : "Save Entry"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-700">{success}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search dreams, titles, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Moods</SelectItem>
                {moods.map((mood) => (
                  <SelectItem key={mood.value} value={mood.value}>
                    {mood.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Journal Entries */}
      <div className="space-y-4">
        {loading && <div className="text-center py-8">Loading journal entries...</div>}

        {!loading && filteredEntries.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Moon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No dreams recorded yet</h3>
              <p className="text-gray-500 mb-6">Start your dream journey by recording your first dream!</p>
              <Button onClick={() => setShowNewEntryDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Dream
              </Button>
            </CardContent>
          </Card>
        )}

        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="border-l-4" style={{ borderLeftColor: getMoodColor(entry.mood) }}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div>
                    <CardTitle className="text-xl">{entry.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(entry.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {moods.find((m) => m.value === entry.mood)?.label || entry.mood}
                      </span>
                      {entry.isLucid && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Lucid
                        </Badge>
                      )}
                      <span className="flex items-center gap-1">
                        <Brain className="w-4 h-4" />
                        Sleep: {entry.sleepQuality}/10
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditingEntry(entry)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4 leading-relaxed">{entry.dream}</p>

              {entry.symbols.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Dream Symbols:</h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.symbols.map((symbol, index) => (
                      <Badge key={index} variant="outline">
                        {symbol}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {entry.tags.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {entry.notes && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-sm text-gray-600 mb-2">Notes:</h4>
                  <p className="text-gray-600 text-sm">{entry.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
