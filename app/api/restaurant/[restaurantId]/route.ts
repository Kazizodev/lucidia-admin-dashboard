import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    const body = await req.json()
    const { name } = body
    if (!name) return new NextResponse("Missing name", { status: 400 })

    const restaurant = await db.restaurant.update({
      where: { id: params.restaurantId, userId },
      data: { name: name.toLowerCase() },
    })
    if (!restaurant) return new NextResponse("Restaurant not found", { status: 404 })

    return NextResponse.json(restaurant)
  } catch (error) {
    console.log("[RESTAURANT_PATCH]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    const restaurant = await db.restaurant.delete({
      where: { id: params.restaurantId, userId },
    })
    if (!restaurant) return new NextResponse("Restaurant not found", { status: 404 })

    return NextResponse.json(restaurant)
  } catch (error) {
    console.log("[RESTAURANT_DELETE]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
