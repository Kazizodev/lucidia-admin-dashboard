import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import SettingsForm from "@/components/Pages/Settings/settings-form"

interface SettingsPageProps {
  params: {
    restaurantId: string
  }
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
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
    <main className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={restaurant} />
      </div>
    </main>
  )
}

export default SettingsPage
