import BillboardClient from "@/components/Pages/Billboards/billboard-client"
import { db } from "@/lib/db"

const BillboardsPage = async () => {
  const billboards = await db.billboard.findMany({ orderBy: { id: "desc" } })

  return (
    <main className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={billboards} />
      </div>
    </main>
  )
}

export default BillboardsPage
