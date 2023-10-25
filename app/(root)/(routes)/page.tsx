import HandleModal from "@/components/Pages/Home/handle-modal"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

const Home = async () => {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")

  const restaurant = await db.restaurant.findFirst({ where: { userId } })
  if (restaurant) redirect(`/${restaurant.id}`)

  return (
    <main className="container">
      <HandleModal />
    </main>
  )
}

export default Home
