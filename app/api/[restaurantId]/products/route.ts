import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    const body = await req.json()
    const { name, price, categoryId, images, isFeatured, isArchived } = body
    if (!name) return new NextResponse("Name is required", { status: 400 })
    if (!price) return new NextResponse("Price is required", { status: 400 })
    if (!categoryId) return new NextResponse("Category is required", { status: 400 })
    if (!images || !images.length) return new NextResponse("Images are required", { status: 400 })

    if (!params.restaurantId) return new NextResponse("Restaurant ID is required", { status: 400 })

    const storeByUser = await db.restaurant.findFirst({ where: { id: params.restaurantId, userId } })
    if (!storeByUser) return new NextResponse("Unauthorized", { status: 403 })

    const product = await db.product.create({
      data: {
        name,
        price,
        categoryId,
        isFeatured,
        isArchived,
        restaurantId: params.restaurantId,
        images: {
          create: images.map((image: { url: string }) => {
            return { url: image.url }
          }),
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCTS_POST]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { restaurantId: string } }) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId") || undefined
    const isFeatured = searchParams.get("isFeatured")

    if (!params.restaurantId) return new NextResponse("Restaurant ID is required", { status: 400 })

    const products = await db.product.findMany({
      where: { restaurantId: params.restaurantId, categoryId, isFeatured: isFeatured ? true : undefined, isArchived: false },
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.log("[PRODUCTS_GET]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
