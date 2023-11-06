import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    if (!params.restaurantId) return new NextResponse("Restaurant ID is required", { status: 400 })

    const body = await req.json()
    const { rate } = body
    if (!rate) return new NextResponse("Exchange rate is required", { status: 400 })

    const restaurant = await db.restaurant.findFirst({ where: { id: params.restaurantId, userId } })
    if (!restaurant) return new NextResponse("Restaurant not found", { status: 404 })

    const exchangeRate = await db.exchangerate.create({ data: { rate, restaurantId: params.restaurantId } })

    return NextResponse.json(exchangeRate)
  } catch (error) {
    console.log("[EXCHANGE_RATE_POST]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { restaurantId: string } }) {
  try {
    if (!params.restaurantId) return new NextResponse("Restaurant ID is required", { status: 400 })

    const exchangeRate = await db.exchangerate.findFirst({ where: { restaurantId: params.restaurantId }, orderBy: { createdAt: "desc" } })

    return NextResponse.json(exchangeRate)
  } catch (error) {
    console.log("[EXCHANGE_RATE_GET]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
