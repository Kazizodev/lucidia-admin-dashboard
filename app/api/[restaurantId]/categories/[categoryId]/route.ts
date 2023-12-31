import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { categoryId: string } }) {
  try {
    if (!params.categoryId) return new NextResponse("Category ID is required", { status: 400 })

    const category = await db.category.findUnique({ where: { id: params.categoryId } })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_GET]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { restaurantId: string; categoryId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    const body = await req.json()
    const { name } = body
    if (!name) return new NextResponse("Name is required.", { status: 400 })
    if (!params.restaurantId) return new NextResponse("Restaurant Id is required.", { status: 400 })
    if (!params.categoryId) return new NextResponse("Category Id is required.", { status: 400 })

    const storeByUser = await db.restaurant.findFirst({ where: { id: params.restaurantId, userId } })
    if (!storeByUser) return new NextResponse("Unauthorized", { status: 403 })

    const category = await db.category.update({ where: { id: params.categoryId }, data: { name } })
    if (!category) return new NextResponse("Category not found", { status: 404 })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_PATCH]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { restaurantId: string; categoryId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    if (!params.restaurantId) return new NextResponse("Restaurant ID is required", { status: 400 })
    if (!params.categoryId) return new NextResponse("Category ID is required", { status: 400 })

    const storeByUser = await db.restaurant.findFirst({ where: { id: params.restaurantId, userId } })
    if (!storeByUser) return new NextResponse("Unauthorized", { status: 403 })

    const category = await db.category.delete({ where: { id: params.categoryId } })

    return NextResponse.json(category)
  } catch (error) {
    console.log("[CATEGORY_DELETE]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
