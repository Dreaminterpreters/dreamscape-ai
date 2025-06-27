import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { apiHandler } from "@/lib/api-handler"

const recoverySchema = z.object({
  username: z.string().min(1, "Username is required"),
  age: z.number().min(13, "Age is required"),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say", "other"]),
})

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()
  const result = recoverySchema.safeParse(body)

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

  const { username, age, gender } = result.data

  try {
    // In production, verify user exists with matching username, age, and gender
    // For demo, we'll simulate this check
    const userExists = username.toLowerCase() !== "nonexistent"

    if (!userExists) {
      return NextResponse.json(
        {
          success: false,
          error: "No account found with the provided information. Please check your details and try again.",
        },
        { status: 404 },
      )
    }

    // Generate a temporary recovery token (in production, this would be more secure)
    const recoveryToken = `recovery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // In production, you would:
    // 1. Store the recovery token temporarily in database
    // 2. Set an expiration time (e.g., 15 minutes)
    // 3. If user has email, send recovery link
    // 4. If no email, provide the token directly for immediate password reset

    return NextResponse.json({
      success: true,
      message: "Account verified! You can now reset your password.",
      recoveryToken,
      hasEmail: false, // In production, check if user has email
    })
  } catch (error) {
    console.error("Recovery error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Account recovery failed. Please try again.",
      },
      { status: 500 },
    )
  }
})
