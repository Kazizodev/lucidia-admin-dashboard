import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function SetupLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")

  const restaurant = await db.restaurant.findFirst({ where: { userId } })
  if (restaurant) redirect(`/${restaurant.id}`)

  return <>{children}</>
}
