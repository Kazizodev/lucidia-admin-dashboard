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

    // ? Check if restaurant exists
    const restaurantExists = await db.restaurant.findFirst({ where: { id: params.restaurantId, userId } })
    if (!restaurantExists) return new NextResponse("Restaurant not found", { status: 404 })

    // ? Check if restaurant has billboards, categories, and products
    const billboards = await db.billboard.findMany({ where: { restaurantId: params.restaurantId } })
    const categories = await db.category.findMany({ where: { restaurantId: params.restaurantId } })
    const products = await db.product.findMany({ where: { restaurantId: params.restaurantId } })
    if (billboards.length > 0 || categories.length > 0 || products.length > 0) return new NextResponse("Restaurant has billboards, categories, or products", { status: 400 })

    // ? delete the exchange rates for the restaurant first
    await db.exchangerate.deleteMany({ where: { restaurantId: params.restaurantId } })

    const restaurant = await db.restaurant.delete({ where: { id: params.restaurantId, userId } })

    return NextResponse.json(restaurant)
  } catch (error) {
    console.log("[RESTAURANT_DELETE]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
