import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import jwt from "jsonwebtoken"
import { apiHandler } from "@/lib/api-handler"
import { hashPassword, validatePassword } from "@/lib/auth"

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  email: z.string().email("Please enter a valid email address"),
  age: z.number().min(13, "You must be at least 13 years old").max(120, "Please enter a valid age"),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say", "other"], {
    errorMap: () => ({ message: "Please select a valid gender option" }),
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()
  const result = registerSchema.safeParse(body)

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

  const { username, age, gender, password, email } = result.data

  // Enhanced password validation
  const passwordValidation = validatePassword(password)
  if (!passwordValidation.valid) {
    return NextResponse.json(
      {
        success: false,
        error: passwordValidation.message,
      },
      { status: 400 },
    )
  }

  // Check if username already exists (in production, check database)
  // For demo, we'll simulate this check
  if (username.toLowerCase() === "admin" || username.toLowerCase() === "test") {
    return NextResponse.json(
      {
        success: false,
        error: "Username already taken. Please choose a different username.",
      },
      { status: 409 },
    )
  }

  try {
    // Hash password securely
    const hashedPassword = await hashPassword(password)

    // In production, save to database
    const user = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      age,
      gender,
      hashedPassword, // Don't return this in response
      provider: "local",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    }

    // Generate JWT token with user info
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error("JWT_SECRET not configured")
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        age: user.age,
        gender: user.gender,
        provider: "local",
        iat: Math.floor(Date.now() / 1000),
      },
      secret,
      { expiresIn: "30d" },
    )

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully! Welcome to DreamScape AI.",
        user: {
          id: user.id,
          username: user.username,
          age: user.age,
          gender: user.gender,
          email: user.email,
          createdAt: user.createdAt,
        },
        token,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Registration failed. Please try again.",
      },
      { status: 500 },
    )
  }
})
