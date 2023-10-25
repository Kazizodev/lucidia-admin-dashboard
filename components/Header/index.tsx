import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { Nav } from "@/components/Header/nav"
import { ModeToggle } from "../ui/mode-toggle"
import { UserButton, auth } from "@clerk/nextjs"
import RestaurantSwicther from "@/components/Header/restaurant-switcher"

const Header = async () => {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")

  const restaurants = await db.restaurant.findMany({ where: { userId } })

  return (
    <header className="border-b h-16 flex items-center gap-4 px-4">
      <RestaurantSwicther items={restaurants} />

      <Nav />

      <div className="ml-auto flex items-center space-x-2">
        <UserButton afterSignOutUrl="/" />
        <ModeToggle />
      </div>
    </header>
  )
}

export default Header
