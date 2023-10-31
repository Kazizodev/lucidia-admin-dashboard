import { db } from "@/lib/db"
import { format } from "date-fns"
import { CategoryColumn } from "@/components/Pages/Categories/columns"
import CategoryClient from "@/components/Pages/Categories/category-client"

const CategoriesPage = async ({ params }: { params: { restaurantId: string } }) => {
  const categories = await db.category.findMany({ where: { restaurantId: params.restaurantId }, orderBy: { id: "desc" } })

  const formattedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    createdAt: format(new Date(category.createdAt), "MMMM do, yyyy"),
  }))

  return (
    <main className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </main>
  )
}

export default CategoriesPage
