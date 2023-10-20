"use client"
import axios from "axios"
import { useState } from "react"
import { ProductColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useParams, useRouter } from "next/navigation"
import AlertModal from "@/components/Global/alert-modal"
import { Edit, MoreHorizontal, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CellActionProps {
  data: ProductColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.restaurantId}/products/${data.id}`)
      router.refresh()
      toast({ title: "👍 Success!", description: "Your product has been deleted." })
    } catch (error: any) {
      console.error(error)
      toast({ title: "🚫 Uh oh! Something went wrong." })
    } finally {
      setOpen(false)
      setLoading(false)
    }
  }

  return (
    <>
      <AlertModal isOpen={open} onClose={() => setOpen(false)} onConfirm={onDelete} loading={loading} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => router.push(`/${params.restaurantId}/products/${data.id}`)}>
            <Edit className="mr-2 w-4 h-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 w-4 h-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
