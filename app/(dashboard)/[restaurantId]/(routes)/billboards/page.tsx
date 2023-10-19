import BillboardClient from "@/components/Pages/Billboards/billboard-client"

const BillboardsPage = () => {
  return (
    <main className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient />
      </div>
    </main>
  )
}

export default BillboardsPage
