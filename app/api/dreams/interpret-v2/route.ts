import { type NextRequest, NextResponse } from "next/server"

// Enhanced symbol database with better keyword matching
const dreamSymbolsDB = {
  dragon: {
    keywords: ["dragon", "dragons", "dragonfly", "drake"],
    weight: 10, // High priority symbol
    traditions: {
      chinese:
        "Dragons represent ultimate yang energy, imperial power, wisdom, and divine transformation. The most auspicious symbol in Chinese culture.",
      jungian:
        "Dragons represent the shadow self and primal power that must be integrated. They guard treasure (wisdom) that requires courage to claim.",
      celtic:
        "Dragons represent earth's sovereignty and the wisdom of the land that must be honored through courage and respect.",
      taoist:
        "Dragons embody perfect harmony between heaven and earth, representing the flow of qi in its most powerful form.",
    },
  },

  tiger: {
    keywords: ["tiger", "tigers", "tigress"],
    weight: 9,
    traditions: {
      hindu:
        "Tigers represent Durga's fierce protective power and the divine feminine energy that destroys ignorance and evil.",
      chinese:
        "Tigers represent courage, military prowess, and protection from evil spirits. Guardians of the western direction.",
      shamanic:
        "Tiger spirit offers protection, courage, and the fierce energy needed for spiritual warfare and defending sacred territory.",
      jungian:
        "Tigers represent raw instinctual power and the fierce aspect of the psyche that must be integrated, not suppressed.",
    },
  },

  flying: {
    keywords: ["fly", "flying", "flew", "soar", "soaring", "float", "floating", "levitate", "airborne", "wings"],
    weight: 8,
    traditions: {
      islamic:
        "Flying represents spiritual elevation and freedom from worldly constraints, indicating divine favor and spiritual ascension.",
      buddhist:
        "Flying represents liberation from attachment and the lightness of enlightened consciousness free from suffering's weight.",
      native_american:
        "Flying connects with Eagle medicine - higher perspective, spiritual vision, and messages from the Sky Father.",
      kabbalistic:
        "Flying represents the soul's ascent through the Tree of Life, transcending physical limitations to reach higher realms.",
    },
  },

  water: {
    keywords: [
      "water",
      "river",
      "lake",
      "ocean",
      "sea",
      "stream",
      "waterfall",
      "rain",
      "swimming",
      "drowning",
      "flood",
      "waves",
    ],
    weight: 7,
    traditions: {
      islamic:
        "Clear water represents knowledge and spiritual insight. Turbulent water indicates trials and spiritual challenges.",
      christian:
        "Water symbolizes purification, baptism, and the Holy Spirit's cleansing power. Living water represents eternal life.",
      hindu:
        "Water represents consciousness flow and spiritual purification, like the sacred Ganges washing away karma.",
      native_american:
        "Water is sacred life force, representing purification, emotional healing, and connection of all living beings.",
    },
  },

  snake: {
    keywords: ["snake", "serpent", "cobra", "viper", "python", "adder"],
    weight: 8,
    traditions: {
      hindu:
        "Serpents represent kundalini energy, cosmic power, and divine feminine principle (Shakti) coiled at the spine's base.",
      islamic:
        "Snakes may represent hidden knowledge, spiritual tests, or enemies. Context and feelings determine their meaning.",
      native_american:
        "Snake represents transformation medicine, healing, and rebirth through shedding old patterns and limitations.",
      egyptian:
        "Serpents represent protective power (uraeus) and primordial wisdom, guarding sacred knowledge and divine mysteries.",
    },
  },

  death: {
    keywords: ["death", "dying", "dead", "funeral", "grave", "cemetery", "corpse", "burial", "coffin"],
    weight: 9,
    traditions: {
      islamic:
        "Death represents spiritual transformation and the end of one phase, beginning of another. Often indicates divine guidance.",
      buddhist:
        "Death represents impermanence and rebirth cycles, reminding us to live mindfully and prepare for transitions.",
      hindu:
        "Death is transition, not ending. Represents the soul's journey through incarnations toward ultimate liberation (moksha).",
      shamanic:
        "Death represents spiritual initiation, soul journey to other worlds, and transformation through sacred death-rebirth.",
    },
  },

  mountain: {
    keywords: ["mountain", "mountains", "hill", "hills", "peak", "summit", "climb", "climbing"],
    weight: 7,
    traditions: {
      islamic:
        "Mountains represent spiritual obstacles testing faith and strength. Climbing indicates progress on the righteous path.",
      hindu:
        "Mountains are sacred abodes of gods, representing spiritual peaks attained through devotion and discipline.",
      buddhist:
        "Mountains symbolize the enlightenment path - steep and challenging but leading to ultimate liberation.",
      native_american: "Mountains are sacred places where earth meets sky, connecting physical and spiritual realms.",
    },
  },

  wedding: {
    keywords: ["wedding", "marriage", "bride", "groom", "ceremony", "altar", "vows"],
    weight: 6,
    traditions: {
      hindu:
        "Wedding represents sacred samskara (rite of passage) for spiritual growth. Disrupted wedding suggests compromised commitments.",
      islamic:
        "Wedding symbolizes completion of faith and social responsibilities. Interrupted ceremony warns of relationship trials.",
      kabbalistic:
        "Wedding manifests Tiferet (beauty) in the divine tree. Troubled ceremony indicates disrupted spiritual covenant.",
      egyptian:
        "Wedding mirrors Isis-Osiris sacred union. Troubled ceremony signifies disorder triumphing over divine balance.",
    },
  },

  dog: {
    keywords: ["dog", "dogs", "puppy", "canine"],
    weight: 5,
    traditions: {
      islamic:
        "Dogs represent faithful companions and divine protection. Friendly dogs indicate loyal friends and spiritual guardianship.",
      native_american:
        "Dogs are loyal spirit guides offering protection, unconditional love, and guidance on the spiritual path.",
      egyptian:
        "Dogs like Anubis represent guardianship of sacred knowledge and guidance through spiritual transitions.",
      jungian: "Dogs represent loyal, instinctual psyche aspects offering protection and unconditional acceptance.",
    },
  },
}

// Enhanced symbol detection with scoring
function detectSymbols(dreamText: string): Array<{ symbol: string; score: number; confidence: number }> {
  const text = dreamText.toLowerCase()
  const detectedSymbols: Array<{ symbol: string; score: number; confidence: number }> = []

  Object.entries(dreamSymbolsDB).forEach(([symbolName, symbolData]) => {
    let score = 0
    let matches = 0

    symbolData.keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi")
      const keywordMatches = (text.match(regex) || []).length
      if (keywordMatches > 0) {
        score += keywordMatches * keyword.length * symbolData.weight
        matches += keywordMatches
      }
    })

    if (score > 0) {
      const confidence = Math.min(100, (score / text.length) * 100 + matches * 10)
      detectedSymbols.push({
        symbol: symbolName,
        score,
        confidence: Math.round(confidence),
      })
    }
  })

  // Sort by score and return top symbols
  return detectedSymbols.sort((a, b) => b.score - a.score).slice(0, 5) // Top 5 symbols max
}

// Generate composite interpretation
function generateCompositeInterpretation(symbols: string[], dreamText: string): string {
  if (symbols.length === 0) {
    return "Your dream contains subtle symbolism that may require deeper reflection. Consider the emotions and overall atmosphere of the dream for additional insights."
  }

  const symbolCombinations: Record<string, string> = {
    "dragon,tiger,flying":
      "A powerful trinity of transformation! You embody cosmic dragon wisdom, fierce tiger courage, and spiritual flight mastery. This represents ultimate shamanic power - you're ready for major life leadership and spiritual authority.",

    "dragon,flying":
      "Dragon flight represents mastery over both earthly and celestial realms. You're achieving spiritual sovereignty and the ability to transform any situation through divine wisdom.",

    "tiger,flying":
      "The flying tiger represents fierce spiritual liberation. You're breaking free from limitations through courage and achieving higher perspective through warrior spirit.",

    "water,snake,death":
      "Sacred transformation through the waters of rebirth. The serpent guides you through necessary spiritual death, leading to profound renewal and wisdom.",

    "mountain,dog,water":
      "A blessed spiritual journey with faithful guidance. The mountain represents your challenges, the loyal dog offers divine protection, while water provides purification.",

    "wedding,water":
      "Sacred union blessed by purifying waters. This represents emotional and spiritual cleansing preparing you for deeper commitments or relationships.",

    "snake,death":
      "Profound transformation through shedding old patterns. The serpent's wisdom guides you through necessary endings toward spiritual rebirth.",

    "flying,water":
      "Spiritual transcendence combined with emotional purification. You're rising above limitations while cleansing deep emotional patterns.",
  }

  // Try to find matching combination
  const sortedSymbols = symbols.sort().join(",")
  if (symbolCombinations[sortedSymbols]) {
    return symbolCombinations[sortedSymbols]
  }

  // Generate dynamic interpretation based on primary symbol
  const primarySymbol = symbols[0]
  const symbolData = dreamSymbolsDB[primarySymbol as keyof typeof dreamSymbolsDB]

  if (symbolData) {
    const traditions = Object.keys(symbolData.traditions)
    const primaryTradition = traditions[0]
    return `Your dream centers on ${primarySymbol} symbolism, which in ${primaryTradition} tradition represents profound spiritual significance. ${symbolData.traditions[primaryTradition as keyof typeof symbolData.traditions]} The presence of additional symbols (${symbols.slice(1).join(", ")}) suggests a complex spiritual message requiring careful contemplation.`
  }

  return "Your dream contains meaningful symbolism that speaks to your spiritual journey and personal transformation."
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const dream = body.dream?.trim() || ""

    // Validation
    if (dream.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a more detailed dream description (at least 10 characters)",
        },
        { status: 400 },
      )
    }

    if (dream.split(/\s+/).length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: "Please describe your dream with more detail (at least 3 words)",
        },
        { status: 400 },
      )
    }

    // Detect symbols with enhanced algorithm
    const detectedSymbols = detectSymbols(dream)

    if (detectedSymbols.length === 0) {
      return NextResponse.json({
        success: true,
        dream,
        symbols: [],
        interpretations: [],
        message:
          "No specific symbols were clearly detected in your dream. Try describing your dream with more specific details about people, objects, actions, animals, or emotions you experienced.",
      })
    }

    // Extract symbol names for processing
    const symbolNames = detectedSymbols.map((s) => s.symbol)

    // Generate interpretations grouped by tradition
    const traditionGroups: Record<string, any> = {}

    detectedSymbols.forEach(({ symbol, confidence }) => {
      const symbolData = dreamSymbolsDB[symbol as keyof typeof dreamSymbolsDB]
      if (symbolData) {
        Object.entries(symbolData.traditions).forEach(([tradition, interpretation]) => {
          if (!traditionGroups[tradition]) {
            traditionGroups[tradition] = {
              tradition,
              source: getTraditionDisplayName(tradition),
              interpretations: [],
              symbols: [],
              confidence: 0,
            }
          }

          traditionGroups[tradition].interpretations.push(interpretation)
          traditionGroups[tradition].symbols.push({ symbol, confidence })
          traditionGroups[tradition].confidence = Math.max(traditionGroups[tradition].confidence, confidence)
        })
      }
    })

    // Format final interpretations
    const interpretations = Object.values(traditionGroups)
      .sort((a: any, b: any) => b.confidence - a.confidence)
      .slice(0, 6) // Top 6 traditions
      .map((group: any) => ({
        tradition: group.tradition,
        source: group.source,
        interpretation: group.interpretations.join(" "),
        symbols: symbolNames,
        confidence: group.confidence,
      }))

    // Generate composite meaning
    const composite = generateCompositeInterpretation(symbolNames, dream)

    console.log("Dream Analysis:", {
      dream: dream.substring(0, 100),
      detectedSymbols,
      interpretationCount: interpretations.length,
    })

    return NextResponse.json({
      success: true,
      dream,
      symbols: symbolNames,
      detectedSymbols, // Include confidence scores
      interpretations,
      composite,
      metadata: {
        symbolCount: detectedSymbols.length,
        traditionCount: interpretations.length,
        averageConfidence: Math.round(
          detectedSymbols.reduce((sum, s) => sum + s.confidence, 0) / detectedSymbols.length,
        ),
      },
    })
  } catch (error) {
    console.error("Dream interpretation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Unable to process dream interpretation. Please try again.",
      },
      { status: 500 },
    )
  }
}

function getTraditionDisplayName(tradition: string): string {
  const displayNames: Record<string, string> = {
    islamic: "Islamic Dream Analysis",
    christian: "Christian Interpretation",
    buddhist: "Buddhist Wisdom",
    jungian: "Jungian Psychology",
    hindu: "Hindu Tradition",
    native_american: "Native American Wisdom",
    kabbalistic: "Kabbalistic Interpretation",
    taoist: "Taoist Philosophy",
    chinese: "Chinese Traditional Wisdom",
    egyptian: "Ancient Egyptian Wisdom",
    shamanic: "Shamanic Interpretation",
    celtic: "Celtic Wisdom",
  }

  return displayNames[tradition] || tradition.charAt(0).toUpperCase() + tradition.slice(1)
}
