"use client"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Heading from "@/components/Global/heading"
import { Separator } from "@/components/ui/separator"

const BillboardClient = () => {
  const params = useParams()
  const router = useRouter()

  return (
    <>
      <section className="flex items-center justify-between">
        <Heading title="Billboards (0)" description="Manage billboards for your restaurant" />
        <Button variant="default" size="sm" onClick={() => router.push(`/${params.restaurantId}/billboards/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </section>

      <Separator />
    </>
  )
}

export default BillboardClient
