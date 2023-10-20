import { db } from "@/lib/db"
import CategoryForm from "@/components/Pages/Categories/slug/category-form"

const CategoryId = async ({ params }: { params: { categoryId: string; restaurantId: string } }) => {
  const category = await db.category.findUnique({ where: { id: params.categoryId } })
  const billboards = await db.billboard.findMany({ where: { restaurantId: params.restaurantId } })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  )
}

export default CategoryId
