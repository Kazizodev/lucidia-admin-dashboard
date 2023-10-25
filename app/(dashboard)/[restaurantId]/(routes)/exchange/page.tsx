import { db } from "@/lib/db"
import ExchangeForm from "@/components/Pages/Exchange/exchange-form"

const CategoriesPage = async ({ params }: { params: { restaurantId: string } }) => {
  const exchange = await db.exchangerate.findFirst({ where: { restaurantId: params.restaurantId }, orderBy: { createdAt: "desc" } })

  return (
    <main className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ExchangeForm initialData={exchange} />
      </div>
    </main>
  )
}

export default CategoriesPage
