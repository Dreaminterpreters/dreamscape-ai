import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/api-handler"

export const GET = withAuth(async (req: NextRequest, { user }) => {
  // In production, fetch user from database using user.userId
  const userProfile = {
    id: user.userId,
    email: user.email,
    name: user.name,
    createdAt: "2024-01-01T00:00:00Z",
    lastLogin: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    user: userProfile,
  })
})

export const PUT = withAuth(async (req: NextRequest, { user }) => {
  const body = await req.json()
  const { name } = body

  // In production, update user in database
  const updatedUser = {
    id: user.userId,
    email: user.email,
    name: name || user.name,
    updatedAt: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  })
})
