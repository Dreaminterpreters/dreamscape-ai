import { NextResponse } from "next/server"
import { verifyAuth } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
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

    const orderId = params.id

    // Mock order data
    // In a real app, you would fetch this from a database
    const order = {
      id: orderId,
      userId: user.id,
      products: [
        { productId: 1, quantity: 2, name: "Product 1", price: 99.99 },
        { productId: 3, quantity: 1, name: "Product 3", price: 199.99 },
      ],
      total: 399.97,
      status: "delivered",
      shippingAddress: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA",
      },
      createdAt: "2023-01-15T12:00:00Z",
    }

    return NextResponse.json({ data: order })
  } catch (error) {
    console.error("Order detail error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
