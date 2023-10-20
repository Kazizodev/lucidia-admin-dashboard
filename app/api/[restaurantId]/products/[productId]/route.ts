import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params }: { params: { productId: string } }) {
  try {
    if (!params.productId) return new NextResponse("Product ID is required", { status: 400 })

    const product = await db.product.findUnique({
      where: { id: params.productId },
      include: {
        images: true,
        category: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCT_GET]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { restaurantId: string; productId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 })

    const body = await req.json()
    const { name, price, categoryId, images, isFeatured, isArchived } = body
    if (!name) return new NextResponse("Name is required", { status: 400 })
    if (!price) return new NextResponse("Price is required", { status: 400 })
    if (!categoryId) return new NextResponse("Category is required", { status: 400 })
    if (!images || !images.length) return new NextResponse("Images are required", { status: 400 })
    if (!params.restaurantId) return new NextResponse("Restaurant Id is required.", { status: 400 })
    if (!params.productId) return new NextResponse("Product Id is required.", { status: 400 })

    const storeByUser = await db.restaurant.findFirst({ where: { id: params.restaurantId, userId } })
    if (!storeByUser) return new NextResponse("Unauthorized", { status: 403 })

    await db.product.update({
      where: { id: params.productId },
      data: {
        name,
        price,
        categoryId,
        images: { deleteMany: {} },
        isFeatured,
        isArchived,
      },
    })
    const product = await db.product.update({
      where: { id: params.productId },
      data: {
        images: {
          create: images.map((image: { url: string }) => {
            return { url: image.url }
          }),
        },
      },
    })
    if (!product) return new NextResponse("Product not found", { status: 404 })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { restaurantId: string; productId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    if (!params.restaurantId) return new NextResponse("Restaurant ID is required", { status: 400 })
    if (!params.productId) return new NextResponse("Product ID is required", { status: 400 })

    const storeByUser = await db.restaurant.findFirst({ where: { id: params.restaurantId, userId } })
    if (!storeByUser) return new NextResponse("Unauthorized", { status: 403 })

    const product = await db.product.deleteMany({ where: { id: params.productId } })

    return NextResponse.json(product)
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
