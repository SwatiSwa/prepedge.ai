"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { IndiGrid } from "@/components/indi-grid"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="truncate w-56">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div className="capitalize">{row.getValue("description")}</div>,
  },
  {
    accessorKey: "slug",
    header: "Slug"
  },
  {
    accessorKey: "createdBy",
    header: "Created By"
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const question = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit question</DropdownMenuItem>
            <DropdownMenuItem>Delete question</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function MockTestList() {
  return (
    <div className="space-y-4">
      <IndiGrid columns={columns} gridUrl="/api/mock-tests" />
    </div>
  )
}

