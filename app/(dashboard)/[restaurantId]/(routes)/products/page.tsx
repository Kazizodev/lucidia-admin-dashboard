import { db } from "@/lib/db"
import { format } from "date-fns"
import { formatter } from "@/lib/utils"
import { ProductColumn } from "@/components/Pages/Products/columns"
import ProductClient from "@/components/Pages/Products/product-client"

const ProductsPage = async ({ params }: { params: { restaurantId: string } }) => {
  const products = await db.product.findMany({ where: { restaurantId: params.restaurantId }, include: { category: true }, orderBy: { id: "desc" } })

  const formattedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    category: product.category.name,
    price: formatter.format(product.price.toNumber()),
    createdAt: format(new Date(product.createdAt), "MMMM do, yyyy"),
  }))

  return (
    <main className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </main>
  )
}

export default ProductsPage
