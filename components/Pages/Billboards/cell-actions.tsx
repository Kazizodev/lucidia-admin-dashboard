"use client"
import axios from "axios"
import { useState } from "react"
import { BillboardColumn } from "./columns"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useParams, useRouter } from "next/navigation"
import AlertModal from "@/components/Global/alert-modal"
import { Edit, MoreHorizontal, ToggleLeft, ToggleRight, Trash } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface CellActionProps {
  data: BillboardColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const onChangeStatus = async () => {
    try {
      toast({ title: "⌛ Loading...", description: "Your billboard is being updated." })
      await axios.put(`/api/${params.restaurantId}/billboards/${data.id}`)
      router.refresh()
      toast({ title: "👍 Success!", description: "Your billboard is now live." })
    } catch (error: any) {
      console.log(error)
      toast({ title: "🚫 Uh oh! Something went wrong.", description: "Please try again later." })
    }
  }
  const onDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.restaurantId}/billboards/${data.id}`)
      router.refresh()
      toast({ title: "👍 Success!", description: "Your billboard has been deleted." })
    } catch (error: any) {
      console.log(error)
      toast({ title: "🚫 Uh oh! Something went wrong.", description: "Make sure you removed all products and categories first." })
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

          <DropdownMenuItem onClick={onChangeStatus}>
            {data.isActive ? (
              <>
                <ToggleLeft className="mr-2 w-4 h-4" />
                Deactivate
              </>
            ) : (
              <>
                <ToggleRight className="mr-2 w-4 h-4" />
                Activate
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/${params.restaurantId}/billboards/${data.id}`)}>
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
