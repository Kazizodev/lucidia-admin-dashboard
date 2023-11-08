"use client"
import { Check, X } from "lucide-react"
import { CellAction } from "./cell-actions"
import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type ProductColumn = {
  id: string
  name: string
  price: string
  category: string
  createdAt: string
  isFeatured: boolean
  isArchived: boolean
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Id" />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "price",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Price" />,
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
  },
  {
    accessorKey: "isFeatured",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Featured" />,
    cell: ({ row }) => (row.original.isFeatured ? <Check className="w-4 h-4 dark:text-green-600 text-green-700" /> : <X className="w-4 h-4 dark:text-red-700 text-red-800" />),
  },
  {
    accessorKey: "isArchived",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Archived" />,
    cell: ({ row }) => (row.original.isArchived ? <Check className="w-4 h-4 dark:text-green-600 text-green-700" /> : <X className="w-4 h-4 dark:text-red-700 text-red-800" />),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
