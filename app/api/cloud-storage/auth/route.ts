import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { apiHandler } from "@/lib/api-handler"

const authSchema = z.object({
  provider: z.enum(["google", "dropbox", "onedrive"]),
  code: z.string(),
  redirectUri: z.string(),
})

export const POST = apiHandler(async (req: NextRequest) => {
  const body = await req.json()
  const result = authSchema.safeParse(body)

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

  const { provider, code, redirectUri } = result.data

  try {
    let tokenResponse: Response
    let tokenData: any

    switch (provider) {
      case "google":
        tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID || "",
            client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
            code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
          }),
        })
        break

      case "dropbox":
        tokenResponse = await fetch("https://api.dropboxapi.com/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: process.env.DROPBOX_CLIENT_ID || "",
            client_secret: process.env.DROPBOX_CLIENT_SECRET || "",
            code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
          }),
        })
        break

      case "onedrive":
        tokenResponse = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: process.env.MICROSOFT_CLIENT_ID || "",
            client_secret: process.env.MICROSOFT_CLIENT_SECRET || "",
            code,
            grant_type: "authorization_code",
            redirect_uri: redirectUri,
          }),
        })
        break

      default:
        throw new Error("Unsupported provider")
    }

    if (!tokenResponse.ok) {
      throw new Error("Token exchange failed")
    }

    tokenData = await tokenResponse.json()

    return NextResponse.json({
      success: true,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
    })
  } catch (error) {
    console.error("Cloud storage auth error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed",
      },
      { status: 500 },
    )
  }
})
