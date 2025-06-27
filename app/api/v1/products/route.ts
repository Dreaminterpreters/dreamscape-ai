import { NextResponse } from "next/server"

// Mock products data
const products = [
  { id: 1, name: "Product 1", price: 99.99, description: "Description for product 1" },
  { id: 2, name: "Product 2", price: 149.99, description: "Description for product 2" },
  { id: 3, name: "Product 3", price: 199.99, description: "Description for product 3" },
]

export async function GET(request: Request) {
  try {
    // Get URL to parse query parameters
    const { searchParams } = new URL(request.url)

    // Parse pagination parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Calculate pagination
    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    // Get paginated results
    const results = products.slice(startIndex, endIndex)

    // Return paginated data with metadata
    return NextResponse.json({
      data: results,
      pagination: {
        total: products.length,
        page,
        limit,
        pages: Math.ceil(products.length / limit),
      },
    })
  } catch (error) {
    console.error("Products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
