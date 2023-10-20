import { db } from "@/lib/db"
import { format } from "date-fns"
import { CategoryColumn } from "@/components/Pages/Categories/columns"
import CategoryClient from "@/components/Pages/Categories/category-client"
import { formatter } from "@/lib/utils"

const CategoriesPage = async ({ params }: { params: { restaurantId: string } }) => {
  const exchange = await db.exchangerate.findMany({ where: { restaurantId: params.restaurantId } })

  // ! Add exchange rate only once
  // const formattedExchange: CategoryColumn[] = exchange.map((exchange) => ({
  //   id: exchange.id,
  //   rate: formatter.format(exchange.rate.toNumber()),
  //   createdAt: format(new Date(exchange.createdAt), "MMMM do, yyyy"),
  // }))

  return (
    <main className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">{/* <CategoryClient data={formattedExchange} /> */}</div>
    </main>
  )
}

export default CategoriesPage
