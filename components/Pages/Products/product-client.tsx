"use client"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import ApiList from "@/components/ui/api-list"
import { Button } from "@/components/ui/button"
import Heading from "@/components/Global/heading"
import { ProductColumn, columns } from "./columns"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

interface ProductClientProps {
  data: ProductColumn[]
}

const ProductClient: React.FC<ProductClientProps> = ({ data }) => {
  const params = useParams()
  const router = useRouter()

  return (
    <>
      <section className="flex items-center justify-between">
        <Heading title={`Products (${data.length})`} description="Manage Products for your restaurant" />
        <Button variant="default" size="sm" onClick={() => router.push(`/${params.restaurantId}/products/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </section>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for Products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  )
}

export default ProductClient
