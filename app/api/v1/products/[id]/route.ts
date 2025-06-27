import { NextResponse } from "next/server"

// Mock products data
const products = [
  { id: 1, name: "Product 1", price: 99.99, description: "Description for product 1" },
  { id: 2, name: "Product 2", price: 149.99, description: "Description for product 2" },
  { id: 3, name: "Product 3", price: 199.99, description: "Description for product 3" },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Find product by ID
    const product = products.find((p) => p.id === id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ data: product })
  } catch (error) {
    console.error("Product detail error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
