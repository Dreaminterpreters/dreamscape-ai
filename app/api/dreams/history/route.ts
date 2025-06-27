import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/api-handler"

// Mock dreams history - in production, fetch from database
const mockDreams = [
  {
    id: "dream_1",
    dream: "I was climbing a mountain and saw a beautiful waterfall",
    symbols: ["mountain", "water"],
    interpretedAt: "2024-01-15T10:00:00Z",
    interpretations: [
      {
        symbol: "mountain",
        source: "Hinduism",
        interpretation: "Spiritual obstacles and path to enlightenment",
      },
    ],
  },
  {
    id: "dream_2",
    dream: "A friendly dog was guiding me through a forest",
    symbols: ["dog", "forest"],
    interpretedAt: "2024-01-14T08:30:00Z",
    interpretations: [
      {
        symbol: "dog",
        source: "Jungian Psychology",
        interpretation: "Loyalty and authentic self",
      },
    ],
  },
]

export const GET = withAuth(async (req: NextRequest, { user }) => {
  // In production, fetch user's dream history from database
  const userDreams = mockDreams.map((dream) => ({
    ...dream,
    userId: user.userId,
  }))

  return NextResponse.json({
    success: true,
    dreams: userDreams,
    total: userDreams.length,
  })
})
