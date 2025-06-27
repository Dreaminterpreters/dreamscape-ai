import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const loginSchema = z.object({
  username: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password } = loginSchema.parse(body)

    // Check if input is email or username
    const isEmail = username.includes("@")
    const loginField = isEmail ? "email" : "username"

    // In production, you would check the database for either email or username
    // For demo purposes, we'll simulate this
    if (isEmail && !username.includes("@")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email format",
        },
        { status: 400 },
      )
    }

    if (username === "test" && password === "test") {
      return NextResponse.json({
        success: true,
        message: "Login successful",
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid credentials",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: error.issues,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    )
  }
}
