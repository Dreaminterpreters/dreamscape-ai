import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ success: false, error: "Authorization code is required" }, { status: 400 })
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google/callback`,
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error("Token exchange failed:", tokenData)
      return NextResponse.json({ success: false, error: "Failed to exchange authorization code" }, { status: 400 })
    }

    // Get user info from Google
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    if (!userResponse.ok) {
      console.error("User info fetch failed:", userData)
      return NextResponse.json({ success: false, error: "Failed to get user information" }, { status: 400 })
    }

    // Create user session data
    const user = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      token: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      signedInAt: new Date().toISOString(),
    }

    console.log(`✅ Google OAuth successful for user: ${user.email}`)

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
