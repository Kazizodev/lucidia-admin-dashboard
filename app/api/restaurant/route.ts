import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return new NextResponse("Unauthorized", { status: 401 })

    const body = await req.json()
    const { name } = body
    if (!name) return new NextResponse("Missing name", { status: 400 })

    const restaurantExists = await db.restaurant.findFirst({ where: { name: name.toLowerCase() } })
    if (restaurantExists) return new NextResponse("Restaurant already exists", { status: 400 })

    const restaurant = await db.restaurant.create({ data: { name: name.toLowerCase(), userId } })

    return NextResponse.json(restaurant)
  } catch (error) {
    console.log("[RESTAURANTS_POST]", error)
    return new NextResponse("Internal server error", { status: 500 })
  }
}
