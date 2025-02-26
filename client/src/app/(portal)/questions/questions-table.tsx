"use client"

import { useState } from "react"
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
import { AddQuestionModal } from "@/components/add-question-modal"

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "questionText",
    header: "Question",
    cell: ({ row }) => <div className="truncate w-56">{row.getValue("questionText")}</div>,
  },
  {
    accessorKey: "questionType",
    header: "Type",
    cell: ({ row }) => <div className="capitalize">{row.getValue("questionType")}</div>,
  },
  {
    accessorKey: "mediaUrl",
    header: "Media",
    cell: ({ row }) => {
      const mediaUrl = row.getValue("mediaUrl")
      return mediaUrl ? (
        <a href={String(mediaUrl)} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
          View
        </a>
      ) : (
        "-"
      )
    },
  },
  {
    accessorKey: "options",
    header: "Options (MCQ)",
    cell: ({ row }) => {
      const options = row.getValue("options")
      return options ? <div className="truncate w-56">{JSON.stringify(options)}</div> : "-"
    },
  },
  {
    accessorKey: "correctAnswer",
    header: "Correct Answer",
    cell: ({ row }) => <div className="truncate w-56">{row.getValue("correctAnswer") || "-"}</div>,
  },
  {
    accessorKey: "author",
    header: "Created By",
    cell: ({ row }) => <div className="capitalize">{row.getValue("author") || "-"}</div>,
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

export default function QuestionsTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [key, setKey] = useState(0) // Used to force refresh the grid

  const handleQuestionAdded = () => {
    // Refresh the grid after a question is added
    setKey((prev) => prev + 1)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Questions</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      <IndiGrid key={key} columns={columns} gridUrl="/api/questions" />

      <AddQuestionModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onQuestionAdded={handleQuestionAdded} />
    </div>
  )
}

