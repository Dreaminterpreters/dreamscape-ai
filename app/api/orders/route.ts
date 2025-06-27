import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { withAuth } from "@/lib/api-handler"

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive(),
      name: z.string().optional(),
    }),
  ),
  shippingAddress: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  paymentMethod: z.string(),
})

export const POST = withAuth(async (req: NextRequest, { user }) => {
  const body = await req.json()
  const result = orderSchema.safeParse(body)

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

  const { items, shippingAddress, paymentMethod } = result.data

  // Calculate total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // Create order
  const order = {
    id: `order_${Date.now()}`,
    userId: user.userId,
    items,
    shippingAddress,
    paymentMethod,
    total,
    status: "pending" as const,
    createdAt: new Date().toISOString(),
  }

  // In production, save to database and process payment

  return NextResponse.json(
    {
      success: true,
      message: "Order created successfully",
      order,
    },
    { status: 201 },
  )
})

export const GET = withAuth(async (req: NextRequest, { user }) => {
  // Mock orders data - in production, fetch from database
  const orders = [
    {
      id: "order_1",
      userId: user.userId,
      items: [{ productId: "p1", quantity: 1, price: 299.99, name: "Premium Headphones" }],
      total: 299.99,
      status: "delivered" as const,
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "order_2",
      userId: user.userId,
      items: [{ productId: "p2", quantity: 1, price: 199.99, name: "Smart Watch" }],
      total: 199.99,
      status: "processing" as const,
      createdAt: "2024-01-20T14:30:00Z",
    },
  ]

  return NextResponse.json({
    success: true,
    data: orders,
  })
})
