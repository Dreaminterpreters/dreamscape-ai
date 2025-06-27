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
  },
  {
    id: "p2",
    name: "Smart Watch",
    price: 199.99,
    description: "Feature-rich smartwatch with health tracking",
    category: "Electronics",
    inStock: true,
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "p3",
    name: "Laptop Stand",
    price: 49.99,
    description: "Ergonomic laptop stand for better posture",
    category: "Accessories",
    inStock: false,
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
]

export const GET = apiHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)

  // Parse query parameters
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const category = searchParams.get("category")
  const search = searchParams.get("search")

  // Filter products
  let filteredProducts = products

  if (category) {
    filteredProducts = filteredProducts.filter((product) => product.category?.toLowerCase() === category.toLowerCase())
  }

  if (search) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description?.toLowerCase().includes(search.toLowerCase()),
    )
  }

  // Paginate results
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  return NextResponse.json({
    success: true,
    data: paginatedProducts,
    pagination: {
      total: filteredProducts.length,
      page,
      limit,
      pages: Math.ceil(filteredProducts.length / limit),
    },
  })
})
