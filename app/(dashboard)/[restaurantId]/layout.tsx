import Header from "@/components/Header"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children, params }: { children: React.ReactNode; params: { restaurantId: string } }) {
  const { userId } = auth()

  if (!userId) redirect("/sign-in")

  const restaurant = await db.restaurant.findFirst({
    where: {
      id: params.restaurantId,
      userId,
    },
  })
  if (!restaurant) redirect("/")

  return (
    <>
      <Header />
      {children}
    </>
  )
}
