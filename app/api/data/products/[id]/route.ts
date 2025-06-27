import { type NextRequest, NextResponse } from "next/server"
import { apiHandler } from "@/lib/api-handler"

// Mock products data
const products = [
  {
    id: "p1",
    name: "Premium Headphones",
    price: 299.99,
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    inStock: true,
    imageUrl: "/placeholder.svg?height=300&width=300",
    specifications: {
      brand: "AudioTech",
      model: "AT-1000",
      warranty: "2 years",
    },
  },
  {
    id: "p2",
    name: "Smart Watch",
    price: 199.99,
    description: "Feature-rich smartwatch with health tracking",
    category: "Electronics",
    inStock: true,
    imageUrl: "/placeholder.svg?height=300&width=300",
    specifications: {
      brand: "TechWear",
      model: "TW-200",
      warranty: "1 year",
    },
  },
]

export const GET = apiHandler(async (req: NextRequest, { params }) => {
  const id = params.id
  const product = products.find((p) => p.id === id)

  if (!product) {
    return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: product,
  })
})
