import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/api-handler"

export const GET = withAuth(async (req: NextRequest, { params, user }) => {
  const orderId = params.id

  // Mock order data
  // In a real app, you would fetch this from a database
  const order = {
    id: orderId,
    userId: user.userId,
    items: [
      { productId: "p1", quantity: 2, price: 299.99, name: "Premium Headphones" },
      { productId: "p3", quantity: 1, price: 49.99, name: "Laptop Stand" },
    ],
    total: 649.97,
    status: "delivered" as const,
    shippingAddress: {
      street: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
      country: "USA",
    },
    paymentMethod: "credit_card",
    createdAt: "2023-01-15T12:00:00Z",
  }

  // In production, verify that the order belongs to the user

  return NextResponse.json({ success: true, data: order })
})
