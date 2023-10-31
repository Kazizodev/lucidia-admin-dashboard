"use client"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import ApiList from "@/components/ui/api-list"
import { Button } from "@/components/ui/button"
import Heading from "@/components/Global/heading"
import { BillboardColumn, columns } from "./columns"
import { Separator } from "@/components/ui/separator"
import { DataTable } from "@/components/ui/data-table"

interface BillboardClientProps {
  data: BillboardColumn[]
}

const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const params = useParams()
  const router = useRouter()

  return (
    <>
      <section className="flex items-center justify-between">
        <Heading title={`Billboards (${data.length})`} description="Manage billboards for your restaurant" />
        <Button variant="default" size="sm" onClick={() => router.push(`/${params.restaurantId}/billboards/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </section>

      <Separator />

      <DataTable columns={columns} data={data} searchKey="label" />

      {process.env.NODE_ENV !== "production" && (
        <>
          <Heading title="API" description="API calls for Billboards" />
          <Separator />
          <ApiList entityName="billboards" entityIdName="billboardId" />
        </>
      )}
    </>
  )
}

export default BillboardClient
