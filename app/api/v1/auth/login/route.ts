import { NextResponse } from "next/server"
import { z } from "zod"

// Login schema validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate input
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation error", details: result.error.format() }, { status: 400 })
    }

    const { email, password } = result.data

    // Here you would typically:
    // 1. Verify user credentials
    // 2. Generate JWT token

    // For demo purposes, we'll just return a mock token
    return NextResponse.json({
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMyIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUxNjIzOTAyMn0.fake_token",
      user: {
        id: "user_123",
        email,
        name: "John Doe",
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
