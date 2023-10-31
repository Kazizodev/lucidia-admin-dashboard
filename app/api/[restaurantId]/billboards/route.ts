import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    const body = await req.json()
    const { label, imageUrl } = body
    if (!label) return new NextResponse("Label is required", { status: 400 })
    if (!imageUrl) return new NextResponse("Image URL is required", { status: 400 })

    if (!params.restaurantId) return new NextResponse("Restaurant ID is required", { status: 400 })

    const storeByUser = await db.restaurant.findFirst({ where: { id: params.restaurantId, userId } })
    if (!storeByUser) return new NextResponse("Unauthorized", { status: 403 })

    const billboard = await db.billboard.create({ data: { label, imageUrl, restaurantId: params.restaurantId } })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARDS_POST]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const isActive = searchParams.get("isActive")

    if (!params.restaurantId) return new NextResponse("Restaurant ID is required", { status: 400 })

    const billboard = await db.billboard.findMany({ where: { restaurantId: params.restaurantId, isActive: isActive ? true : undefined } })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARDS_GET]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
