import { db } from "@/lib/db"
import RateButton from "./rate-button"
import { redirect } from "next/navigation"
import { Nav } from "@/components/Header/nav"
import { UserButton, auth } from "@clerk/nextjs"
import { ModeToggle } from "@/components/ui/mode-toggle"
import RestaurantSwicther from "@/components/Header/restaurant-switcher"

const Header = async () => {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")

  const restaurants = await db.restaurant.findMany({ where: { userId } })
  const exchange = await db.exchangerate.findFirst({ where: { restaurantId: restaurants[0].id }, orderBy: { createdAt: "desc" } })

  return (
    <header className="border-b h-16 flex items-center gap-4 px-4">
      <RestaurantSwicther items={restaurants} />

      <Nav />

      <div className="ml-auto flex items-center space-x-2">
        {exchange && <RateButton exchange={exchange.rate.toNumber()} />}
        <UserButton afterSignOutUrl="/" />
        <ModeToggle />
      </div>
    </header>
  )
}

export default Header
