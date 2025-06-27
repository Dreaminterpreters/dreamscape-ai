import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { withAuth } from "@/lib/api-handler"

const journalEntrySchema = z.object({
  id: z.string().optional(),
  date: z.string(),
  title: z.string().min(1, "Title is required"),
  dream: z.string().min(10, "Dream description must be at least 10 characters"),
  mood: z.string(),
  symbols: z.array(z.string()).default([]),
  interpretations: z.array(z.any()).default([]),
  tags: z.array(z.string()).default([]),
  isLucid: z.boolean().default(false),
  sleepQuality: z.number().min(1).max(10).default(5),
  notes: z.string().default(""),
})

export const POST = withAuth(async (req: NextRequest, { user }) => {
  const body = await req.json()
  const result = journalEntrySchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation failed",
        details: result.error.format(),
      },
      { status: 400 },
    )
  }

  const entryData = result.data
  const entry = {
    ...entryData,
    id: entryData.id || `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // In production, you might want to store a backup or metadata
  // but the actual journal data goes to the user's cloud storage

  return NextResponse.json({
    success: true,
    message: "Journal entry processed successfully",
    entry,
  })
})

export const GET = withAuth(async (req: NextRequest, { user }) => {
  // Return user's cloud storage configuration if any
  // This is just metadata, not the actual journal entries
  return NextResponse.json({
    success: true,
    message: "Journal entries are stored in your connected cloud storage",
    cloudStorageConnected: false, // Check user's cloud storage status
  })
})
