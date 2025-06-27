import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔧 Config API: GET request received")

    const config = {
      languages: [
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "es", name: "Español", flag: "🇪🇸" },
        { code: "fr", name: "Français", flag: "🇫🇷" },
        { code: "de", name: "Deutsch", flag: "🇩🇪" },
        { code: "it", name: "Italiano", flag: "🇮🇹" },
        { code: "pt", name: "Português", flag: "🇵🇹" },
        { code: "ru", name: "Русский", flag: "🇷🇺" },
        { code: "zh", name: "中文", flag: "🇨🇳" },
        { code: "ja", name: "日本語", flag: "🇯🇵" },
        { code: "ar", name: "العربية", flag: "🇸🇦" },
        { code: "hi", name: "हिन्दी", flag: "🇮🇳" },
        { code: "ko", name: "한국어", flag: "🇰🇷" },
      ],
      sourceTypes: [
        { value: "mixed", label: "Mixed Traditions", emoji: "🌍" },
        { value: "religious", label: "Religious Traditions", emoji: "🙏" },
        { value: "psychological", label: "Psychological Analysis", emoji: "🧠" },
        { value: "ancient", label: "Ancient Wisdom", emoji: "📜" },
        { value: "indigenous", label: "Indigenous Traditions", emoji: "🦅" },
        { value: "classical", label: "Classical Literature", emoji: "📚" },
        { value: "modern", label: "Modern Approaches", emoji: "🔬" },
        { value: "esoteric", label: "Esoteric & Occult", emoji: "🔮" },
      ],
      specificSources: [
        { value: "all", label: "All Available Sources", emoji: "🌟" },

        // Classical & Historical (10)
        { value: "📖 G.H. Miller (10,000 Dreams)", label: "G.H. Miller - 10,000 Dreams Interpreted", emoji: "📖" },
        { value: "🏛️ Artemidorus Oneirocritica", label: "Artemidorus - Oneirocritica (Ancient Greek)", emoji: "🏛️" },
        { value: "📜 Medieval Dream Books", label: "Medieval European Dream Books", emoji: "📜" },
        { value: "🎭 Shakespeare Dream Symbolism", label: "Shakespearean Dream Analysis", emoji: "🎭" },
        { value: "📚 Victorian Dream Interpretation", label: "Victorian Era Dream Analysis", emoji: "📚" },
        { value: "🏺 Mesopotamian Dream Texts", label: "Ancient Mesopotamian Dream Interpretation", emoji: "🏺" },
        { value: "📋 Roman Dream Interpretation", label: "Ancient Roman Dream Analysis", emoji: "📋" },
        { value: "🎨 Renaissance Dream Theory", label: "Renaissance Dream Philosophy", emoji: "🎨" },
        { value: "⚔️ Germanic Dream Lore", label: "Germanic & Anglo-Saxon Dream Traditions", emoji: "⚔️" },
        { value: "🏰 Arthurian Dream Visions", label: "Arthurian & Chivalric Dream Symbolism", emoji: "🏰" },

        // Religious & Spiritual Traditions (15)
        { value: "✝️ Christian Mysticism", label: "Christian Mysticism", emoji: "✝️" },
        { value: "☪️ Islamic Tradition (Ibn Sirin)", label: "Islamic Tradition (Ibn Sirin)", emoji: "☪️" },
        { value: "🕉️ Hinduism (Vedanta)", label: "Hinduism (Vedanta)", emoji: "🕉️" },
        { value: "☸️ Buddhism (Theravada)", label: "Buddhism (Theravada)", emoji: "☸️" },
        { value: "✡️ Judaism (Kabbalah)", label: "Judaism (Kabbalah)", emoji: "✡️" },
        { value: "🕎 Jewish Talmudic", label: "Jewish Talmudic Interpretation", emoji: "🕎" },
        { value: "🌙 Sufi Mysticism", label: "Sufi Mysticism", emoji: "🌙" },
        { value: "🪯 Sikh Tradition", label: "Sikh Dream Interpretation", emoji: "🪯" },
        { value: "🕯️ Jainism", label: "Jain Dream Philosophy", emoji: "🕯️" },
        { value: "🌺 Bahai Faith", label: "Bahai Spiritual Dream Analysis", emoji: "🌺" },
        { value: "☦️ Eastern Orthodox", label: "Eastern Orthodox Dream Theology", emoji: "☦️" },
        { value: "✨ Gnostic Christianity", label: "Gnostic Christian Dream Mysticism", emoji: "✨" },
        { value: "🔥 Zoroastrian", label: "Zoroastrian Fire Wisdom", emoji: "🔥" },
        { value: "🌸 Zen Buddhism", label: "Zen Buddhist Dream Practice", emoji: "🌸" },
        { value: "🧘 Tibetan Buddhism", label: "Tibetan Dream Yoga", emoji: "🧘" },

        // Psychological Approaches (8)
        { value: "🧠 Freudian Analysis", label: "Freudian Psychoanalysis", emoji: "🧠" },
        { value: "🎭 Jungian Psychology", label: "Jungian Analytical Psychology", emoji: "🎭" },
        { value: "👥 Adlerian Psychology", label: "Adlerian Individual Psychology", emoji: "👥" },
        { value: "🎯 Gestalt Dream Work", label: "Gestalt Dream Therapy", emoji: "🎯" },
        { value: "🔄 Cognitive Behavioral", label: "Cognitive Behavioral Dream Analysis", emoji: "🔄" },
        { value: "🌈 Transpersonal Psychology", label: "Transpersonal Dream Psychology", emoji: "🌈" },
        { value: "🧬 Evolutionary Psychology", label: "Evolutionary Dream Theory", emoji: "🧬" },
        { value: "🎪 Existential Analysis", label: "Existential Dream Analysis", emoji: "🎪" },

        // Indigenous & Shamanic Traditions (12)
        { value: "🦅 Native American (Lakota)", label: "Native American (Lakota)", emoji: "🦅" },
        { value: "🌏 Aboriginal Dreamtime", label: "Aboriginal Dreamtime", emoji: "🌏" },
        { value: "🌍 African Traditional (Yoruba)", label: "African Traditional (Yoruba)", emoji: "🌍" },
        { value: "🦎 Australian Aboriginal", label: "Australian Aboriginal Traditions", emoji: "🦎" },
        { value: "🐺 Siberian Shamanism", label: "Siberian Shamanic Traditions", emoji: "🐺" },
        { value: "🦜 Amazonian Shamanism", label: "Amazonian Plant Spirit Dreams", emoji: "🦜" },
        { value: "🏔️ Himalayan Shamanism", label: "Himalayan Shamanic Traditions", emoji: "🏔️" },
        { value: "🌵 Mexican Curanderismo", label: "Mexican Curandera Dream Healing", emoji: "🌵" },
        { value: "🦌 Inuit Traditions", label: "Inuit Arctic Dream Wisdom", emoji: "🦌" },
        { value: "🐻 First Nations (Ojibwe)", label: "First Nations Ojibwe Traditions", emoji: "🐻" },
        { value: "🌿 Celtic Shamanism", label: "Celtic Shamanic Practices", emoji: "🌿" },
        { value: "🦋 Mayan Dream Traditions", label: "Ancient Mayan Dream Prophecy", emoji: "🦋" },

        // Eastern Philosophy & Traditions (8)
        { value: "🐉 Chinese Taoism", label: "Chinese Taoist Dream Philosophy", emoji: "🐉" },
        { value: "🌸 Japanese Shinto", label: "Japanese Shinto Traditions", emoji: "🌸" },
        { value: "🏮 Chinese Traditional Medicine", label: "Traditional Chinese Medicine Dreams", emoji: "🏮" },
        { value: "🎋 Japanese Zen", label: "Japanese Zen Dream Practice", emoji: "🎋" },
        { value: "🕸️ Korean Shamanism", label: "Korean Mudang Shamanism", emoji: "🕸️" },
        { value: "🐅 Vietnamese Folk Tradition", label: "Vietnamese Folk Dream Beliefs", emoji: "🐅" },
        { value: "🌊 Thai Buddhist", label: "Thai Theravada Buddhist Dreams", emoji: "🌊" },
        { value: "🦚 Indian Ayurveda", label: "Ayurvedic Dream Interpretation", emoji: "🦚" },

        // European Folk & Regional (6)
        { value: "🏺 Celtic Druidism", label: "Celtic Druidic Traditions", emoji: "🏺" },
        { value: "⚡ Norse/Viking", label: "Norse/Viking Traditions", emoji: "⚡" },
        { value: "🌲 Slavic Folk Traditions", label: "Slavic Folk Dream Beliefs", emoji: "🌲" },
        { value: "🔮 Romani/Gypsy Tradition", label: "Romani/Gypsy Traditions", emoji: "🔮" },
        { value: "🍀 Irish Celtic", label: "Irish Celtic Dream Lore", emoji: "🍀" },
        { value: "🏔️ Alpine Folk Traditions", label: "Alpine & Germanic Folk Dreams", emoji: "🏔️" },

        // Modern & New Age (5)
        { value: "🔮 New Age Spirituality", label: "New Age Dream Spirituality", emoji: "🔮" },
        { value: "💎 Crystal Healing Dreams", label: "Crystal & Gemstone Dream Healing", emoji: "💎" },
        { value: "🌟 Astral Projection", label: "Astral Projection & OBE Dreams", emoji: "🌟" },
        { value: "🎴 Tarot Dream Symbolism", label: "Tarot-Based Dream Interpretation", emoji: "🎴" },
        { value: "🌙 Wiccan/Pagan", label: "Wiccan & Neo-Pagan Dream Work", emoji: "🌙" },

        // Oceanic & Island Traditions (3)
        { value: "🌺 Hawaiian/Polynesian", label: "Hawaiian/Polynesian Traditions", emoji: "🌺" },
        { value: "🏝️ Melanesian Traditions", label: "Melanesian Dream Customs", emoji: "🏝️" },
        { value: "🐚 Micronesian Navigation", label: "Micronesian Navigation Dreams", emoji: "🐚" },

        // Additional Traditions to reach 67+ (4)
        { value: "🌾 Rastafarian", label: "Rastafarian Spiritual Dreams", emoji: "🌾" },
        { value: "🕊️ Quaker Tradition", label: "Quaker Inner Light Dreams", emoji: "🕊️" },
        { value: "🌀 Anthroposophical", label: "Rudolf Steiner's Anthroposophy", emoji: "🌀" },
        { value: "🎪 Circus & Carnival Lore", label: "Traveling Folk Dream Wisdom", emoji: "🎪" },
      ],
      adConfig: {
        clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-test",
        slots: {
          header: "1234567890",
          sidebar: "2345678901",
          inline: "3456789012",
          footer: "4567890123",
          responsive: "5678901234",
        },
      },
    }

    console.log("✅ Config API: Returning configuration with", config.specificSources.length - 1, "traditions") // -1 for "all" option

    return NextResponse.json(
      {
        success: true,
        config,
        totalTraditions: config.specificSources.length - 1, // Exclude "all" option
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300",
        },
      },
    )
  } catch (error) {
    console.error("❌ Config API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to load configuration",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log("🎯 Config API: POST request for ad targeting")

    const body = await request.json()
    const { dreamText, language, traditionType } = body

    // Generate contextual ad targeting
    const adTargeting = {
      keywords: extractKeywords(dreamText || ""),
      language: language || "en",
      category: traditionType || "mixed",
      interests: ["spirituality", "psychology", "dreams", "interpretation"],
    }

    console.log("✅ Config API: Ad targeting generated")

    return NextResponse.json(
      {
        success: true,
        adTargeting,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    console.error("❌ Config API POST error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate ad targeting",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

function extractKeywords(text: string): string[] {
  const keywords = []
  const dreamKeywords = [
    "flying",
    "water",
    "animals",
    "death",
    "wedding",
    "family",
    "house",
    "car",
    "snake",
    "dog",
    "cat",
    "fire",
    "money",
    "baby",
    "school",
  ]

  dreamKeywords.forEach((keyword) => {
    if (text.toLowerCase().includes(keyword)) {
      keywords.push(keyword)
    }
  })

  return keywords.slice(0, 5) // Limit to 5 keywords
}
