import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { billboardId: string } }) {
  try {
    if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 })

    const billboard = await db.billboard.findUnique({ where: { id: params.billboardId } })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD_GET]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { restaurantId: string; billboardId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    const body = await req.json()
    const { label, imageUrl } = body
    if (!label) return new NextResponse("Label is required.", { status: 400 })
    if (!imageUrl) return new NextResponse("Image URL is required.", { status: 400 })
    if (!params.restaurantId) return new NextResponse("Restaurant Id is required.", { status: 400 })
    if (!params.billboardId) return new NextResponse("Billboard Id is required.", { status: 400 })

    const storeByUser = await db.restaurant.findFirst({ where: { id: params.restaurantId, userId } })
    if (!storeByUser) return new NextResponse("Unauthorized", { status: 403 })

    const billboard = await db.billboard.update({ where: { id: params.billboardId }, data: { label, imageUrl } })
    if (!billboard) return new NextResponse("Billboard not found", { status: 404 })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { restaurantId: string; billboardId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    if (!params.restaurantId) return new NextResponse("Restaurant ID is required", { status: 400 })
    if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 })

    const storeByUser = await db.restaurant.findFirst({ where: { id: params.restaurantId, userId } })
    if (!storeByUser) return new NextResponse("Unauthorized", { status: 403 })

    const billboard = await db.billboard.delete({ where: { id: params.billboardId } })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
