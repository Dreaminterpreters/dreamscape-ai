import { NextResponse } from "next/server"
import { z } from "zod"

// User registration schema validation
const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
})

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json()

    // Validate input
    const result = userSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation error", details: result.error.format() }, { status: 400 })
    }

    const { email, password, name } = result.data

    // Here you would typically:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Store user in database
    // 4. Generate JWT token

    // For demo purposes, we'll just return a success message
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: "user_123", email, name },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
