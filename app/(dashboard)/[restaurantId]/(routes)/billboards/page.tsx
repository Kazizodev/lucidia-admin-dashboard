import { db } from "@/lib/db"
import { format } from "date-fns"
import BillboardClient from "@/components/Pages/Billboards/billboard-client"
import { BillboardColumn } from "@/components/Pages/Billboards/columns"

const BillboardsPage = async () => {
  const billboards = await db.billboard.findMany({ orderBy: { id: "desc" } })

  const formattedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(new Date(billboard.createdAt), "MMMM do, yyyy"),
  }))

  return (
    <main className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </main>
  )
}

export default BillboardsPage
