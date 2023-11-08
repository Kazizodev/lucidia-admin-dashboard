import { db } from "@/lib/db"
import ProductForm from "@/components/Pages/Products/slug/product-form"

const ProductsPage = async ({ params }: { params: { productId: string; restaurantId: string } }) => {
  const categories = await db.category.findMany({ where: { restaurantId: params.restaurantId } })
  const product = await db.product.findUnique({ where: { id: params.productId }, include: { images: true } })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} categories={categories} />
      </div>
    </div>
  )
}

export default ProductsPage
