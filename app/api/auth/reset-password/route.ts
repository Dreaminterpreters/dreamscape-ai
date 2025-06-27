import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { apiHandler } from "@/lib/api-handler"
import { hashPassword, validatePassword } from "@/lib/auth"

const resetPasswordSchema = z.object({
  recoveryToken: z.string().min(1, "Recovery token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
})

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()
  const result = resetPasswordSchema.safeParse(body)

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

  const { recoveryToken, newPassword } = result.data

  // Enhanced password validation
  const passwordValidation = validatePassword(newPassword)
  if (!passwordValidation.valid) {
    return NextResponse.json(
      {
        success: false,
        error: passwordValidation.message,
      },
      { status: 400 },
    )
  }

  try {
    // In production, verify the recovery token exists and hasn't expired
    const isValidToken = recoveryToken.startsWith("recovery_")

    if (!isValidToken) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid or expired recovery token. Please start the recovery process again.",
        },
        { status: 400 },
      )
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword)

    // In production, update the user's password in the database
    // and invalidate the recovery token

    return NextResponse.json({
      success: true,
      message: "Password reset successfully! You can now log in with your new password.",
    })
  } catch (error) {
    console.error("Password reset error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Password reset failed. Please try again.",
      },
      { status: 500 },
    )
  }
})
