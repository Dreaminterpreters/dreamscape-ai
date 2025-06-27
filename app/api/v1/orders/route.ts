import { NextResponse } from "next/server"
import { z } from "zod"
import { verifyAuth } from "@/lib/auth"

// Order schema validation
const orderSchema = z.object({
  products: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().positive(),
    }),
  ),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
})

export async function POST(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract token
    const token = authHeader.split(" ")[1]

    // Verify token
    const user = await verifyAuth(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Parse request body
    const body = await request.json()

    // Validate input
    const result = orderSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Validation error", details: result.error.format() }, { status: 400 })
    }

    const { products, shippingAddress } = result.data

    // Here you would typically:
    // 1. Verify product availability
    // 2. Calculate total price
    // 3. Process payment
    // 4. Create order in database

    // For demo purposes, we'll just return a success message
    return NextResponse.json(
      {
        message: "Order created successfully",
        order: {
          id: "order_" + Date.now(),
          userId: user.id,
          products,
          shippingAddress,
          status: "pending",
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Get authorization header
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Extract token
    const token = authHeader.split(" ")[1]

    // Verify token
    const user = await verifyAuth(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Mock orders data
    const orders = [
      {
        id: "order_1",
        userId: user.id,
        products: [
          { productId: 1, quantity: 2, name: "Product 1", price: 99.99 },
          { productId: 3, quantity: 1, name: "Product 3", price: 199.99 },
        ],
        total: 399.97,
        status: "delivered",
        createdAt: "2023-01-15T12:00:00Z",
      },
      {
        id: "order_2",
        userId: user.id,
        products: [{ productId: 2, quantity: 1, name: "Product 2", price: 149.99 }],
        total: 149.99,
        status: "processing",
        createdAt: "2023-02-20T15:30:00Z",
      },
    ]

    return NextResponse.json({ data: orders })
  } catch (error) {
    console.error("Orders retrieval error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
