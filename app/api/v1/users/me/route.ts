import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract token
    const token = authHeader.split(" ")[1]

    // Verify token (in a real app, this would validate JWT)
    const user = await verifyAuth(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Return user data
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error("User profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
