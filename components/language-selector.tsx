"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"

interface LanguageSelectorProps {
  language: string
  onLanguageChange: (language: string) => void
}

export default function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "ti", name: "Tigrinya", nativeName: "ትግርኛ" },
    { code: "am", name: "Amharic", nativeName: "አማርኛ" },
    { code: "ar", name: "Arabic", nativeName: "العربية" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    { code: "zh", name: "Chinese", nativeName: "中文" },
    { code: "ja", name: "Japanese", nativeName: "日本語" },
  ]

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-400" />
      <Select value={language} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code} className="text-white hover:bg-gray-700">
              {lang.nativeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
