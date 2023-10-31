import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    const body = await req.json()
    const { name } = body
    if (!name) return new NextResponse("Name is required", { status: 400 })

    if (!params.restaurantId) return new NextResponse("Restaurant ID is required", { status: 400 })

    const storeByUser = await db.restaurant.findFirst({ where: { id: params.restaurantId, userId } })
    if (!storeByUser) return new NextResponse("Unauthorized", { status: 403 })

    const category = await db.category.create({ data: { name, restaurantId: params.restaurantId } })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORIES_POST]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { restaurantId: string } }) {
  try {
    if (!params.restaurantId) return new NextResponse("Restaurant ID is required", { status: 400 })

    const category = await db.category.findMany({ where: { restaurantId: params.restaurantId } })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORIES_GET]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
