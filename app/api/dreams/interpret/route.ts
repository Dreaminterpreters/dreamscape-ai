import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🌙 AI Dream interpretation API called")

    let requestData
    try {
      requestData = await request.json()
      console.log("📝 Request parsed successfully")
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError)
      return NextResponse.json(
        { success: false, error: "Invalid request format" },
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    const { dream, language = "en", sourceType = "mixed", selectedTraditions = [] } = requestData

    if (!dream || typeof dream !== "string" || dream.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Please provide a more detailed dream description (at least 10 characters)" },
        { status: 400, headers: { "Content-Type": "application/json" } },
      )
    }

    console.log("✅ Dream validation passed, length:", dream.length)
    console.log("📋 Selected traditions received:", selectedTraditions)
    console.log("📊 Number of selected traditions:", selectedTraditions.length)

    // Generate AI interpretations using DeepSeek
    const traditions = await generateAIInterpretations(dream, sourceType, selectedTraditions)
    console.log("📚 Final result: Generated", traditions.length, "AI interpretations")

    const response = {
      success: true,
      dream: dream.substring(0, 500),
      traditions,
      wisdomQuote: getSourceQuote(traditions),
      selectedTraditionsCount: selectedTraditions.length,
      metadata: {
        analysisType: selectedTraditions.length > 0 ? "Custom Selection" : "Auto Selection",
        traditionsAnalyzed: traditions.length,
        traditionsRequested: selectedTraditions.length,
        language,
        sourceType,
        totalAvailableTraditions: 74,
        aiPowered: true,
        aiProvider: "DeepSeek",
      },
    }

    console.log("✅ AI Response created successfully")
    return NextResponse.json(response, {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("❌ AI API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Unable to interpret dream at this time",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

async function generateAIInterpretations(dream: string, sourceType: string, selectedTraditions: string[]) {
  const traditions = []

  if (selectedTraditions.length > 0) {
    console.log(`🎯 Processing ${selectedTraditions.length} selected traditions`)
    console.log("📝 Selected traditions list:", selectedTraditions)

    // Process ALL selected traditions (no limit)
    for (let i = 0; i < selectedTraditions.length; i++) {
      const tradition = selectedTraditions[i]
      console.log(`🔄 Processing tradition ${i + 1}/${selectedTraditions.length}: "${tradition}"`)

      try {
        const interpretation = await generateTraditionInterpretation(dream, tradition)
        if (interpretation) {
          traditions.push(interpretation)
          console.log(`✅ Successfully added interpretation ${traditions.length} for: ${tradition}`)
        } else {
          console.log(`❌ Failed to generate interpretation for: ${tradition} (tradition key not found)`)
        }
      } catch (error) {
        console.error(`❌ Error processing tradition ${tradition}:`, error)
      }
    }
  } else {
    const defaults = getDefaultTraditions(sourceType)
    console.log(`📋 Processing ${defaults.length} default traditions for sourceType: ${sourceType}`)

    for (const tradition of defaults) {
      const interpretation = await generateTraditionInterpretation(dream, tradition)
      if (interpretation) traditions.push(interpretation)
    }
  }

  console.log(
    `📊 Final processing result: ${traditions.length} interpretations out of ${selectedTraditions.length || "default"} requested`,
  )
  return traditions
}

async function generateTraditionInterpretation(dream: string, traditionKey: string) {
  try {
    // Enhanced tradition prompts focused on understanding and matching
    const traditionPrompts = {
      // Classical & Historical
      Miller: {
        name: "Classical Dream Dictionary",
        prompt: `You are a classical dream interpreter following G.H. Miller's methodology. Your job is to understand this specific dream and provide a detailed interpretation based on classical dream analysis principles.

UNDERSTAND the dream content thoroughly, then provide interpretation covering:
- What the dream elements mean in classical interpretation
- Practical predictions for the dreamer's life
- Business, relationship, and fortune implications
- Specific guidance based on what you understood from the dream

Dream to interpret: "${dream}"

Provide a comprehensive classical interpretation based on your understanding of this specific dream:`,
        source: `Classical Dream Dictionary - G.H. Miller Methodology`,
      },

      Artemidorus: {
        name: "Ancient Greek Interpretation",
        prompt: `You are Artemidorus of Daldis, the ancient Greek dream interpreter. Your task is to UNDERSTAND this dream deeply and interpret it using authentic ancient Greek methodology.

ANALYZE this specific dream and determine:
- Is this an 'oneiros' (prophetic dream from gods) or 'enhypnion' (reflecting daily concerns)?
- What Greek mythological connections apply to THIS dream?
- What divine messages are present in THIS specific dream content?
- What fate and fortune predictions emerge from understanding THIS dream?

Dream to interpret: "${dream}"

Provide your authentic Artemidorus interpretation based on understanding this specific dream:`,
        source: `Artemidorus of Daldis - 'Oneirocritica' Ancient Greek Dream Analysis`,
      },

      // Psychological Schools
      Freudian: {
        name: "Psychoanalytic Approach",
        prompt: `You are a Freudian psychoanalyst. Your role is to UNDERSTAND this dream's content and provide psychoanalytic interpretation based on what you comprehend from the dream.

ANALYZE this specific dream for:
- What unconscious desires are revealed in THIS dream?
- How does dream-work (condensation, displacement, symbolization) operate in THIS specific content?
- What repressed impulses are expressed through THIS dream's specific elements?
- How do the id, ego, and superego manifest in THIS particular dream?

Dream to interpret: "${dream}"

Provide detailed Freudian analysis based on understanding this specific dream content:`,
        source: `Freudian Psychoanalysis - 'The Interpretation of Dreams' Methodology`,
      },

      Jungian: {
        name: "Analytical Psychology",
        prompt: `You are a Jungian analyst. Your task is to UNDERSTAND this dream and interpret it through analytical psychology based on the specific content presented.

COMPREHEND this dream and analyze:
- What compensatory function does THIS specific dream serve?
- Which archetypal patterns emerge from THIS dream's content?
- How does THIS dream relate to the individuation process?
- What Shadow, anima/animus elements appear in THIS specific dream?

Dream to interpret: "${dream}"

Provide comprehensive Jungian interpretation based on understanding this specific dream:`,
        source: `Jungian Analytical Psychology - Archetypal Dream Analysis`,
      },

      // Religious & Spiritual Traditions
      Christian: {
        name: "Christian Mystical Tradition",
        prompt: `You are a Christian mystic interpreter. Your role is to UNDERSTAND this dream and interpret it through Christian mystical tradition based on the specific spiritual content you perceive.

DISCERN this specific dream for:
- What divine communication is present in THIS dream?
- How does THIS dream relate to the soul's spiritual journey?
- What biblical parallels or spiritual lessons emerge from THIS specific content?
- What guidance for spiritual growth comes from understanding THIS dream?

Dream to interpret: "${dream}"

Provide Christian mystical interpretation based on understanding this specific dream:`,
        source: `Christian Mystical Tradition - Spiritual Discernment and Divine Communication`,
      },

      Islamic: {
        name: "Islamic Dream Interpretation",
        prompt: `You are an Islamic dream interpreter following traditional methodology. Your task is to UNDERSTAND this dream and classify it according to Islamic tradition based on the specific content.

ANALYZE this specific dream to determine:
- Is this ru'ya sadiqah (true dream from Allah), hulm (from nafs), or from Shaytan?
- What Islamic teachings and Quranic wisdom apply to THIS specific dream content?
- What spiritual significance emerges from understanding THIS particular dream?
- What practical guidance follows Islamic principles for THIS dream?

Dream to interpret: "${dream}"

Provide Islamic interpretation based on understanding this specific dream content:`,
        source: `Islamic Dream Interpretation - Classical Methodology with Quranic References`,
      },

      Hindu: {
        name: "Hindu Vedantic Tradition",
        prompt: `You are a Hindu dream interpreter versed in Vedantic tradition. Your role is to UNDERSTAND this dream and interpret it through Hindu spiritual wisdom based on the specific content.

COMPREHEND this dream and analyze:
- How does THIS dream relate to karma, dharma, and spiritual evolution?
- What consciousness states are reflected in THIS specific dream?
- Which deities or spiritual principles manifest in THIS dream's content?
- What guidance for spiritual practice emerges from understanding THIS dream?

Dream to interpret: "${dream}"

Provide Hindu Vedantic interpretation based on understanding this specific dream:`,
        source: `Hindu Vedantic Tradition - Swapna Shastra and Consciousness Analysis`,
      },

      Chinese: {
        name: "Traditional Chinese Analysis",
        prompt: `You are a Traditional Chinese dream interpreter. Your task is to UNDERSTAND this dream and interpret it through Chinese wisdom traditions based on the specific content.

ANALYZE this specific dream for:
- What yin-yang imbalances or harmonies appear in THIS dream?
- How do the five elements manifest in THIS specific dream content?
- What I Ching principles apply to understanding THIS particular dream?
- What guidance for achieving balance emerges from THIS dream's meaning?

Dream to interpret: "${dream}"

Provide Traditional Chinese interpretation based on understanding this specific dream:`,
        source: `Traditional Chinese Dream Analysis - Tao, I Ching, and Five Elements`,
      },

      Wiccan: {
        name: "Wiccan & Neo-Pagan Tradition",
        prompt: `You are a Wiccan dream interpreter. Your role is to UNDERSTAND this dream and interpret it through Wiccan tradition based on the specific spiritual content you perceive.

COMPREHEND this dream and analyze:
- How do the elements (Earth, Air, Fire, Water) manifest in THIS specific dream?
- What connection to the Triple Goddess appears in THIS dream's content?
- How do natural cycles and lunar energies relate to THIS particular dream?
- What magical or spiritual guidance emerges from understanding THIS dream?

Dream to interpret: "${dream}"

Provide Wiccan interpretation based on understanding this specific dream content:`,
        source: `Wiccan Tradition - Triple Goddess and Elemental Dream Analysis`,
      },

      Rastafarian: {
        name: "Rastafarian Spiritual Wisdom",
        prompt: `You are a Rastafarian spiritual guide. Your task is to UNDERSTAND this dream and interpret it through Rastafarian consciousness based on the specific spiritual content.

ANALYZE this specific dream for:
- How does THIS dream relate to Jah consciousness and spiritual elevation?
- What Babylon system influences or Zion consciousness appears in THIS dream?
- How do biblical prophecy and Marcus Garvey's teachings apply to THIS specific content?
- What guidance for righteous living emerges from understanding THIS dream?

Dream to interpret: "${dream}"

Provide Rastafarian interpretation based on understanding this specific dream:`,
        source: `Rastafarian Spiritual Tradition - Jah Consciousness and Zion Symbolism`,
      },

      Tarot: {
        name: "Tarot Symbolic Interpretation",
        prompt: `You are a Tarot reader and dream interpreter. Your role is to UNDERSTAND this dream and interpret it through Tarot wisdom based on the specific archetypal content you perceive.

COMPREHEND this dream and analyze:
- Which Major Arcana archetypes manifest in THIS specific dream?
- What elemental energies (Cups, Wands, Swords, Pentacles) appear in THIS dream's content?
- How does the Hero's Journey relate to THIS particular dream?
- What guidance for personal transformation emerges from understanding THIS dream?

Dream to interpret: "${dream}"

Provide Tarot-based interpretation based on understanding this specific dream:`,
        source: `Tarot Symbolic Interpretation - Archetypal Analysis and Divinatory Wisdom`,
      },
    }

    const traditionData = traditionPrompts[traditionKey as keyof typeof traditionPrompts]
    if (!traditionData) {
      console.log(`⚠️ Unknown tradition key: "${traditionKey}"`)
      return null
    }

    console.log(`🤖 Generating DeepSeek AI interpretation for: ${traditionData.name}`)

    // Use DeepSeek API for understanding-based interpretation
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are an expert dream interpreter. Your job is to understand the dream content deeply and provide specific, contextual interpretations based on your understanding. Never give generic responses - always base your interpretation on what you understand from the specific dream content provided.",
          },
          {
            role: "user",
            content: traditionData.prompt,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`DeepSeek API error for ${traditionKey}:`, response.status, errorText)
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const fullInterpretation = data.choices?.[0]?.message?.content?.trim()

    if (!fullInterpretation) {
      console.error(`No interpretation received from DeepSeek API for ${traditionKey}`)
      throw new Error("No interpretation received from DeepSeek API")
    }

    // Create brief version (first 3-4 sentences)
    const sentences = fullInterpretation.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const briefInterpretation = sentences.slice(0, 3).join(". ") + (sentences.length > 3 ? "..." : "")

    console.log(`✅ Successfully generated interpretation for ${traditionKey}`)

    return {
      name: traditionData.name,
      interpretation: briefInterpretation,
      fullInterpretation: fullInterpretation,
      source: traditionData.source,
      tradition: traditionKey,
      hasMore: sentences.length > 3,
    }
  } catch (error) {
    console.error(`❌ Error generating DeepSeek AI interpretation for ${traditionKey}:`, error)
    return null
  }
}

function getDefaultTraditions(sourceType: string): string[] {
  switch (sourceType) {
    case "classical":
      return ["Miller", "Artemidorus"]
    case "religious":
      return ["Christian", "Islamic", "Hindu"]
    case "psychological":
      return ["Freudian", "Jungian"]
    default:
      return ["Miller", "Jungian", "Islamic"]
  }
}

function getSourceQuote(traditions: any[]): string {
  if (traditions.length === 0) return "Dreams are the royal road to the unconscious"

  const traditionQuotes = {
    Miller: "Dreams are nature's way of warning us of approaching events",
    Artemidorus: "Dreams are messages from the gods requiring proper interpretation",
    Freudian: "Dreams are the royal road to the unconscious",
    Jungian: "The dream is a little hidden door in the innermost recesses of the soul",
    Christian: "In dreams and visions of the night, when deep sleep falls on mortals",
    Islamic: "True dreams are one of the forty-six parts of prophethood",
    Hindu: "Dreams reflect the harmony or imbalance of consciousness within",
    Chinese: "Dreams reveal the flow of qi and cosmic harmony",
    Wiccan: "Dreams connect us to the divine feminine and natural cycles",
    Rastafarian: "Dreams are visions from Jah guiding us toward Zion",
    Tarot: "Dreams reveal the archetypal journey of the soul",
  }

  for (const tradition of traditions) {
    const name = tradition.name || tradition.tradition || ""
    for (const [key, quote] of Object.entries(traditionQuotes)) {
      if (name.toLowerCase().includes(key.toLowerCase())) {
        return quote
      }
    }
  }

  return traditionQuotes["Jungian"]
}
