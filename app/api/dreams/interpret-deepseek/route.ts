import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { dreamText, selectedTraditions } = await request.json()

    if (!dreamText || dreamText.length < 20) {
      return NextResponse.json(
        {
          success: false,
          error: "Dream text must be at least 20 characters long",
        },
        { status: 400 },
      )
    }

    // Use DeepSeek API
    const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are a master dream interpreter with deep knowledge of ${selectedTraditions.join(", ")} traditions. Provide authentic, culturally accurate interpretations based on these specific traditions. Be respectful and insightful.`,
          },
          {
            role: "user",
            content: `Please interpret this dream using the following spiritual/cultural traditions: ${selectedTraditions.join(", ")}

Dream: ${dreamText}

Please provide:
1. A comprehensive interpretation from each selected tradition
2. Common themes across traditions
3. Practical guidance based on the interpretations
4. Cultural context for each tradition's perspective

Format your response in a clear, organized manner.`,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    })

    if (!deepseekResponse.ok) {
      throw new Error(`DeepSeek API error: ${deepseekResponse.status}`)
    }

    const deepseekData = await deepseekResponse.json()
    const interpretation = deepseekData.choices[0]?.message?.content

    if (!interpretation) {
      throw new Error("No interpretation received from DeepSeek")
    }

    return NextResponse.json({
      success: true,
      interpretation,
      dreamText: dreamText.substring(0, 200) + (dreamText.length > 200 ? "..." : ""),
      selectedTraditions,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Dream interpretation error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Failed to interpret dream. Please try again.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
