import { db } from "@/lib/db"

interface DashboardPageProps {
  params: {
    restaurantId: string
  }
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const { restaurantId } = params

  const restaurant = await db.restaurant.findFirst({
    where: { id: restaurantId },
  })

  return (
    <main>
      Current store: <span className="capitalize font-semibold">{restaurant?.name}</span>
    </main>
  )
}

export default DashboardPage
